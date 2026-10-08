from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.db.models import Q, Min, Count
from decimal import Decimal
from rest_framework import serializers
from django.db import transaction
from apps.properties.models import Property, PropertyType, PropertyAmenity, Building, Floor, Room, Bed, PropertyImage
from apps.properties.serializers import PropertySerializer, PublicPropertySerializer, PropertySearchSerializer
from apps.leads.models import Lead
from apps.accounts.models import User, UserProfile
from apps.organizations.models import Organization, OrganizationMember

class MarketplaceSearchView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        queryset = Property.objects.filter(
            is_published=True,
            verification_status=Property.VerificationStatus.VERIFIED
        ).select_related("organization").prefetch_related("images", "amenities").annotate(
            available_beds=Count('buildings__floors__rooms__beds', filter=Q(buildings__floors__rooms__beds__status='AVAILABLE'), distinct=True)
        )

        # Filters
        state = request.query_params.get("state")
        if state:
            if state.lower() in ["gujarat", "gj"]:
                queryset = queryset.filter(Q(state__iexact="Gujarat") | Q(state__iexact="GJ"))
            else:
                queryset = queryset.filter(state__iexact=state)

        city = request.query_params.get("city")
        if city and city.lower() not in ["all", "all india", "india", "all cities"]:
            queryset = queryset.filter(city__iexact=city)

        locality = request.query_params.get("locality")
        if locality and locality.lower() != "all":
            queryset = queryset.filter(locality__icontains=locality)

        property_type = request.query_params.get("type")
        if property_type and property_type.lower() != "all":
            queryset = queryset.filter(property_type__iexact=property_type)

        gender = request.query_params.get("gender")
        if gender and gender != "ANY":
            queryset = queryset.filter(Q(gender_preference=gender) | Q(gender_preference="ANY"))

        max_rent = request.query_params.get("max_rent")
        if max_rent:
            try:
                queryset = queryset.filter(monthly_rent_starting__lte=float(max_rent))
            except ValueError:
                pass

        min_rent = request.query_params.get("min_rent")
        if min_rent:
            try:
                queryset = queryset.filter(monthly_rent_starting__gte=float(min_rent))
            except ValueError:
                pass

        food = request.query_params.get("food")
        if food == "true":
            queryset = queryset.filter(food_included=True)

        query = request.query_params.get("q")
        if query:
            queryset = queryset.filter(
                Q(title__icontains=query) |
                Q(locality__icontains=query) |
                Q(city__icontains=query) |
                Q(state__icontains=query) |
                Q(description__icontains=query) |
                Q(nearby_landmarks__icontains=query)
            )

        # Priority ordering: Featured first, then Gujarat properties, then created_at
        queryset = queryset.order_by("-is_featured", "-monthly_rent_starting")

        try:
            limit = min(100, max(1, int(request.query_params.get("limit", 60))))
            offset = max(0, int(request.query_params.get("offset", 0)))
        except (ValueError, TypeError):
            return Response({"error": "Invalid pagination values."}, status=400)
        total_count = queryset.count()
        serializer = PropertySearchSerializer(queryset[offset:offset + limit], many=True)

        # Single aggregation query for Gujarat & city counts
        from django.core.cache import cache
        live_stats = cache.get("marketplace_live_stats")
        if not live_stats:
            live_stats = Property.objects.filter(
                is_published=True,
                verification_status=Property.VerificationStatus.VERIFIED
            ).aggregate(
                total_properties=Count("id"),
                total_gujarat=Count("id", filter=Q(state__iexact="Gujarat") | Q(state__iexact="GJ")),
                total_vadodara=Count("id", filter=Q(city__iexact="Vadodara")),
                total_ahmedabad=Count("id", filter=Q(city__iexact="Ahmedabad")),
                total_surat=Count("id", filter=Q(city__iexact="Surat")),
            )
            cache.set("marketplace_live_stats", live_stats, 60)

        return Response({
            "success": True,
            "count": total_count,
            "limit": limit,
            "offset": offset,
            "live_stats": live_stats,
            "data": serializer.data
        })

class MarketplaceStatsView(APIView):
    """
    Live stats endpoint for Gujarat and Vadodara property marketplace.
    Provides counts, locality distributions, and active bed availability.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        all_published = Property.objects.filter(
            is_published=True,
            verification_status=Property.VerificationStatus.VERIFIED
        )
        gujarat_props = all_published.filter(Q(state__iexact="Gujarat") | Q(state__iexact="GJ"))
        vadodara_props = all_published.filter(city__iexact="Vadodara")
        ahmedabad_props = all_published.filter(city__iexact="Ahmedabad")
        surat_props = all_published.filter(city__iexact="Surat")
        rajkot_props = all_published.filter(city__iexact="Rajkot")
        gandhinagar_props = all_published.filter(city__iexact="Gandhinagar")

        vadodara_localities = (
            vadodara_props.values("locality")
            .annotate(count=Count("id"), min_rent=Min("monthly_rent_starting"))
            .order_by("-count")
        )

        total_beds = Bed.objects.filter(room__floor__building__property__in=gujarat_props).count()
        available_beds = Bed.objects.filter(
            room__floor__building__property__in=gujarat_props,
            status=Bed.BedStatus.AVAILABLE
        ).count()

        return Response({
            "success": True,
            "data": {
                "total_all_india": all_published.count(),
                "total_gujarat": gujarat_props.count(),
                "total_vadodara": vadodara_props.count(),
                "total_ahmedabad": ahmedabad_props.count(),
                "total_surat": surat_props.count(),
                "total_rajkot": rajkot_props.count(),
                "total_gandhinagar": gandhinagar_props.count(),
                "total_gujarat_beds": total_beds,
                "available_gujarat_beds": available_beds,
                "vadodara_localities": list(vadodara_localities),
                "vadodara_popular_areas": [
                    "Alkapuri", "Gotri", "Sayajigunj", "Fatehgunj", 
                    "Manjalpur", "Vasna Road", "Akota", "Karelibaug", "Waghodia Road"
                ],
            }
        })

class PublicPropertyListCreateView(APIView):
    """
    Public Property Listing Submission:
    Allows any landlord in Gujarat (Vadodara, Ahmedabad, Surat, etc.) or anywhere in India
    to instantly list their property into the database.
    Creates Property, Building, Floor, Rooms, and Beds automatically.
    """
    permission_classes = [permissions.IsAuthenticated]

    @transaction.atomic
    def post(self, request):
        if request.user.role == "TENANT":
            return Response({"error": "Sign in with a property operator account."}, status=403)
        title = request.data.get("title")
        city = request.data.get("city", "Vadodara")
        locality = request.data.get("locality", "Alkapuri")
        address = request.data.get("address", f"{locality}, {city}")
        property_type = request.data.get("property_type", PropertyType.CO_LIVING)
        monthly_rent = serializers.DecimalField(max_digits=10, decimal_places=2, min_value=0).run_validation(request.data.get("monthly_rent") or request.data.get("monthly_rent_starting") or 8500)
        security_deposit = serializers.DecimalField(max_digits=10, decimal_places=2, min_value=0).run_validation(request.data.get("security_deposit") or (monthly_rent * 2))
        total_beds = serializers.IntegerField(min_value=1, max_value=500).run_validation(request.data.get("total_beds") or 10)
        title = serializers.CharField(max_length=255, allow_blank=False).run_validation(title)
        gender_preference = request.data.get("gender_preference", Property.GenderPreference.ANY)
        if gender_preference == "UNISEX":
            gender_preference = Property.GenderPreference.ANY

        owner_name = request.data.get("owner_name", "Gujarat Landlord")
        owner_phone = request.data.get("owner_phone", "9876543210")
        owner_email = request.data.get("owner_email", "")

        state = request.data.get("state")
        if not state:
            gujarat_cities = ["vadodara", "ahmedabad", "surat", "rajkot", "gandhinagar", "bhavnagar", "anand", "bharuch", "jamnagar"]
            state = "Gujarat" if city.lower() in gujarat_cities else "Karnataka"

        pincode = request.data.get("pincode", "390007" if city.lower() == "vadodara" else "380015")
        description = request.data.get("description", f"Verified {property_type} property in {locality}, {city}. Features modern amenities, security, and flexible rental terms.")

        user = request.user

        # Organization
        membership = OrganizationMember.objects.filter(user=user, is_active=True).first()
        if membership:
            org = membership.organization
        else:
            org = Organization.objects.create(
                name=f"{owner_name}'s {city} Properties",
                    contact_email=user.email,
                    contact_phone=owner_phone or "9876543210",
                    city=city,
                    state=state,
            )
            OrganizationMember.objects.get_or_create(organization=org, user=user, defaults={"role": OrganizationMember.MemberRole.OWNER})

        # Create Property
        prop = Property.objects.create(
            organization=org,
            title=title,
            property_type=property_type,
            description=description,
            address=address,
            locality=locality,
            city=city,
            state=state,
            pincode=pincode,
            nearby_landmarks=request.data.get("nearest_landmark", request.data.get("nearby_landmarks", "")),
            monthly_rent_starting=monthly_rent,
            security_deposit=security_deposit,
            gender_preference=gender_preference,
            food_included=bool(request.data.get("food_included", "food" in (request.data.get("amenities") or []))),
            is_published=False,
            verification_status=Property.VerificationStatus.PENDING,
            ownership_warranty_accepted=True,
            electricity_board_discom="MGVCL" if city.lower() == "vadodara" else "State DISCOM",
        )

        # Default cover image
        PropertyImage.objects.create(
            property=prop,
            image_url="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80",
            is_cover=True,
            caption=f"{prop.title} Front View"
        )

        # Create Building, Floor, and Rooms/Beds
        bldg = Building.objects.create(property=prop, name="Main Wing")
        floor = Floor.objects.create(building=bldg, floor_number=1, name="1st Floor")

        rooms_count = (total_beds + 1) // 2
        for r_idx in range(1, rooms_count + 1):
            room = Room.objects.create(
                floor=floor,
                room_number=f"10{r_idx}",
                room_type=Room.RoomType.DOUBLE,
                base_rent=monthly_rent,
                default_deposit=security_deposit,
                has_attached_bathroom=True,
                has_ac=True,
            )
            Bed.objects.create(
                room=room,
                bed_identifier=f"10{r_idx}-A",
                rent_amount=monthly_rent,
                deposit_amount=security_deposit,
                status=Bed.BedStatus.AVAILABLE,
            )
            if r_idx * 2 <= total_beds:
                Bed.objects.create(
                    room=room,
                    bed_identifier=f"10{r_idx}-B",
                    rent_amount=monthly_rent,
                    deposit_amount=security_deposit,
                    status=Bed.BedStatus.AVAILABLE,
                )

        serializer = PropertySerializer(prop)
        return Response({
            "success": True,
            "message": f"Property listing request for '{prop.title}' submitted successfully! It is now under Admin review and will be published to the marketplace once approved.",
            "data": serializer.data
        }, status=status.HTTP_201_CREATED)

class MarketplaceDetailView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, slug):
        prop = Property.objects.prefetch_related(
            "images", "amenities", "buildings__floors__rooms__beds"
        ).filter(slug=slug).first()

        if not prop:
            return Response(
                {"success": False, "error": {"code": "NOT_FOUND", "message": "Property not found or unavailable."}},
                status=status.HTTP_404_NOT_FOUND,
            )

        # If not verified and published, only staff or property owner can preview
        if not (prop.is_published and prop.verification_status == Property.VerificationStatus.VERIFIED):
            user = request.user
            is_authorized = (
                user.is_authenticated and (
                    user.is_staff or 
                    getattr(user, "role", "") in ["SUPER_ADMIN", "ADMIN"] or
                    prop.organization.members.filter(user=user).exists()
                )
            )
            if not is_authorized:
                return Response(
                    {"success": False, "error": {"code": "PENDING_APPROVAL", "message": "This property listing is currently under admin review and approval."}},
                    status=status.HTTP_403_FORBIDDEN,
                )

        serializer = PublicPropertySerializer(prop)
        return Response({
            "success": True,
            "data": serializer.data
        })

class PublicEnquiryView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        property_id = request.data.get("property_id")
        name = request.data.get("name")
        phone = request.data.get("phone")
        email = request.data.get("email", "")
        move_in_date = request.data.get("move_in_date")
        notes = request.data.get("notes", "")

        if not property_id or not name or not phone:
            return Response(
                {"success": False, "error": {"code": "VALIDATION_ERROR", "message": "Property, Name and Phone are required."}},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            prop = Property.objects.get(id=property_id)
        except Property.DoesNotExist:
            return Response(
                {"success": False, "error": {"code": "NOT_FOUND", "message": "Property does not exist."}},
                status=status.HTTP_404_NOT_FOUND,
            )

        lead = Lead.objects.create(
            organization=prop.organization,
            property=prop,
            name=name,
            phone=phone,
            email=email,
            source=Lead.LeadSource.MARKETPLACE,
            move_in_date=move_in_date or None,
            notes=notes,
            status=Lead.LeadStatus.NEW,
        )

        return Response(
            {
                "success": True,
                "message": "Enquiry submitted successfully! The property manager will contact you shortly.",
                "data": {"lead_id": str(lead.id)},
            },
            status=status.HTTP_201_CREATED,
        )

class CityListView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        # Curated top rental hubs across Gujarat & India
        cities = [
            {
                "name": "Vadodara",
                "state": "Gujarat",
                "is_featured": True,
                "popular_localities": [
                    "Alkapuri", "Gotri", "Sayajigunj", "Fatehgunj", 
                    "Manjalpur", "Vasna Road", "Akota", "Karelibaug", 
                    "Waghodia Road", "Sama-Savli Road", "Bhayli"
                ]
            },
            {
                "name": "Ahmedabad",
                "state": "Gujarat",
                "is_featured": True,
                "popular_localities": [
                    "Vastrapur", "Navrangpura", "Prahlad Nagar", "SG Highway", 
                    "Bodakdev", "Satellite", "Bopal", "Chandkheda"
                ]
            },
            {
                "name": "Surat",
                "state": "Gujarat",
                "is_featured": True,
                "popular_localities": [
                    "Vesu", "Adajan", "VIP Road", "City Light", "Piplod", "Pal"
                ]
            },
            {
                "name": "Gandhinagar",
                "state": "Gujarat",
                "is_featured": True,
                "popular_localities": [
                    "Infocity", "Kudasan", "Raysan", "GIFT City", "Sector 7"
                ]
            },
            {
                "name": "Rajkot",
                "state": "Gujarat",
                "popular_localities": [
                    "Kalawad Road", "University Road", "Yagnik Road", "Nana Mava"
                ]
            },
            {
                "name": "Bengaluru",
                "state": "Karnataka",
                "popular_localities": [
                    "Koramangala", "HSR Layout", "Indiranagar", "Whitefield", "Electronic City"
                ]
            },
            {
                "name": "Pune",
                "state": "Maharashtra",
                "popular_localities": [
                    "Hinjawadi", "Viman Nagar", "Kothrud", "Wakad", "Baner"
                ]
            },
            {
                "name": "Mumbai",
                "state": "Maharashtra",
                "popular_localities": [
                    "Andheri West", "Powai", "Bandra", "Thane"
                ]
            },
            {
                "name": "Delhi NCR",
                "state": "Delhi",
                "popular_localities": [
                    "Noida Sector 62", "Gurugram Cyber City", "Laxmi Nagar", "Hauz Khas"
                ]
            },
        ]
        return Response({"success": True, "data": cities})
