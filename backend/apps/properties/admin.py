from django.contrib import admin
from unfold.admin import ModelAdmin, TabularInline
from unfold.decorators import display
from django.utils import timezone
from apps.properties.models import (
    Property,
    PropertyAmenity,
    PropertyImage,
    Building,
    Floor,
    Room,
    Bed,
)


class PropertyImageInline(TabularInline):
    model = PropertyImage
    extra = 1


class BuildingInline(TabularInline):
    model = Building
    extra = 1


class BedInline(TabularInline):
    model = Bed
    extra = 1


@admin.register(Property)
class PropertyAdmin(ModelAdmin):
    list_display = (
        "title",
        "organization",
        "property_type",
        "city",
        "locality",
        "monthly_rent_starting",
        "show_verification_status",
        "show_published_status",
        "created_at",
    )
    list_filter = ("verification_status", "is_published", "property_type", "city", "gender_preference")
    search_fields = ("title", "city", "locality", "address", "slug", "organization__name")
    prepopulated_fields = {"slug": ("title", "locality", "city")}
    inlines = [PropertyImageInline, BuildingInline]
    actions = ["approve_and_publish", "reject_properties", "mark_as_pending"]
    list_filter_submit = True

    @display(
        description="Verification Status",
        label={
            Property.VerificationStatus.VERIFIED: "success",
            Property.VerificationStatus.PENDING: "warning",
            Property.VerificationStatus.REJECTED: "danger",
            Property.VerificationStatus.UNVERIFIED: "info",
        }
    )
    def show_verification_status(self, obj):
        return obj.get_verification_status_display()

    @display(
        description="Marketplace Live",
        label={
            True: "success",
            False: "info",
        }
    )
    def show_published_status(self, obj):
        return "Live on Website" if obj.is_published else "Draft / Hidden"

    @admin.action(description="✅ Approve & Publish selected listings to Website Marketplace")
    def approve_and_publish(self, request, queryset):
        now = timezone.now()
        count = queryset.update(
            verification_status=Property.VerificationStatus.VERIFIED,
            is_published=True,
            ownership_verified_at=now,
            ownership_verified_by=request.user,
            ownership_verification_notes="Approved via Django Admin",
        )
        self.message_user(request, f"Successfully approved & published {count} properties to the live website marketplace.")

    @admin.action(description="❌ Reject selected property listings")
    def reject_properties(self, request, queryset):
        count = queryset.update(
            verification_status=Property.VerificationStatus.REJECTED,
            is_published=False,
            ownership_verification_notes="Rejected via Django Admin",
        )
        self.message_user(request, f"Marked {count} properties as REJECTED.")

    @admin.action(description="⏳ Mark selected listings as PENDING Verification")
    def mark_as_pending(self, request, queryset):
        count = queryset.update(
            verification_status=Property.VerificationStatus.PENDING,
            is_published=False,
        )
        self.message_user(request, f"Marked {count} properties as PENDING verification.")


@admin.register(PropertyAmenity)
class PropertyAmenityAdmin(ModelAdmin):
    list_display = ("name", "category", "icon")
    list_filter = ("category",)
    search_fields = ("name",)


@admin.register(Building)
class BuildingAdmin(ModelAdmin):
    list_display = ("name", "property", "description")
    search_fields = ("name", "property__title")


@admin.register(Floor)
class FloorAdmin(ModelAdmin):
    list_display = ("name", "floor_number", "building")
    list_filter = ("floor_number",)
    search_fields = ("name", "building__name", "building__property__title")


@admin.register(Room)
class RoomAdmin(ModelAdmin):
    list_display = ("room_number", "floor", "room_type", "furnishing", "base_rent", "is_active")
    list_filter = ("room_type", "furnishing", "has_attached_bathroom", "has_ac", "is_active")
    search_fields = ("room_number", "floor__name", "floor__building__property__title")
    inlines = [BedInline]


@admin.register(Bed)
class BedAdmin(ModelAdmin):
    list_display = ("bed_identifier", "room", "rent_amount", "deposit_amount", "show_bed_status")
    list_filter = ("status",)
    search_fields = ("bed_identifier", "room__room_number", "room__floor__building__property__title")

    @display(
        description="Status",
        label={
            Bed.BedStatus.AVAILABLE: "success",
            Bed.BedStatus.OCCUPIED: "info",
            Bed.BedStatus.RESERVED: "warning",
            Bed.BedStatus.BLOCKED: "danger",
            Bed.BedStatus.MAINTENANCE: "danger",
            Bed.BedStatus.NOTICE_PERIOD: "warning",
        }
    )
    def show_bed_status(self, obj):
        return obj.get_status_display()


@admin.register(PropertyImage)
class PropertyImageAdmin(ModelAdmin):
    list_display = ("property", "is_cover", "caption", "image_url")
    list_filter = ("is_cover",)
    search_fields = ("property__title", "caption")
