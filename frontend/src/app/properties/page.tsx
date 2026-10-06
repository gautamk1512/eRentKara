"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Building2, MapPin, ShieldCheck, ArrowRight, Utensils, 
  Wind, CheckCircle2, Bed, Search, Filter, SlidersHorizontal, 
  X, Sparkles, Map, LayoutGrid, Columns2, Compass, PhoneCall,
  Check, ChevronRight, Globe
} from "lucide-react";
import { api } from "@/lib/api";
import RentSearchHero from "@/components/RentSearchHero";
import PropertyMap from "@/components/PropertyMap";
import MotionVideoTour from "@/components/MotionVideoTour";

export default function PropertiesMarketplacePage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState("All India");
  const [selectedLocality, setSelectedLocality] = useState("ALL");
  const [selectedType, setSelectedType] = useState("ALL");
  const [rentBounds, setRentBounds] = useState<{min?: string; max?: string}>({});
  const [filtersReady, setFiltersReady] = useState(false);
  const [selectedGender, setSelectedGender] = useState("ANY");
  const [foodOnly, setFoodOnly] = useState(false);
  const [acOnly, setAcOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPersona, setSelectedPersona] = useState("Professional");
  const [stats, setStats] = useState<any>(null);

  // View Mode: 'SPLIT' (Cards + Map), 'GRID' (Cards only), or 'MAP' (Full map)
  const [viewMode, setViewMode] = useState<"SPLIT" | "GRID" | "MAP">("SPLIT");
  const [hoveredPropertyId, setHoveredPropertyId] = useState<string | null>(null);

  const categories = [
    { label: "All Stays", value: "ALL" },
    { label: "PG & Hostels", value: "PG" },
    { label: "Co-Living", value: "CO_LIVING" },
    { label: "Flats & Apartments", value: "FLAT" },
    { label: "Studio 1BHK", value: "STUDIO" },
  ];

  const genderFilters = [
    { label: "All Genders", value: "ANY" },
    { label: "Boys / Male", value: "MALE" },
    { label: "Girls / Female", value: "FEMALE" },
    { label: "Couples / Family", value: "FAMILY" },
  ];

  const cityLocalities: Record<string, Array<{ label: string; value: string }>> = {
    "All India": [
      { label: "All India (All Cities)", value: "ALL" },
      { label: "Vadodara", value: "Vadodara" },
      { label: "Ahmedabad", value: "Ahmedabad" },
      { label: "Surat", value: "Surat" },
      { label: "Gandhinagar", value: "Gandhinagar" },
      { label: "Rajkot", value: "Rajkot" },
      { label: "Bengaluru", value: "Bengaluru" },
      { label: "Pune", value: "Pune" },
    ],
    Vadodara: [
      { label: "All Vadodara", value: "ALL" },
      { label: "Alkapuri", value: "Alkapuri" },
      { label: "Gotri", value: "Gotri" },
      { label: "Sayajigunj", value: "Sayajigunj" },
      { label: "Fatehgunj", value: "Fatehgunj" },
      { label: "Manjalpur", value: "Manjalpur" },
      { label: "Vasna Road", value: "Vasna Road" },
      { label: "Akota", value: "Akota" },
      { label: "Karelibaug", value: "Karelibaug" },
      { label: "Waghodia Road", value: "Waghodia Road" },
    ],
    Ahmedabad: [
      { label: "All Ahmedabad", value: "ALL" },
      { label: "Vastrapur", value: "Vastrapur" },
      { label: "Navrangpura", value: "Navrangpura" },
      { label: "SG Highway", value: "SG Highway" },
      { label: "Prahlad Nagar", value: "Prahlad Nagar" },
      { label: "Bodakdev", value: "Bodakdev" },
      { label: "Satellite", value: "Satellite" },
    ],
    Surat: [
      { label: "All Surat", value: "ALL" },
      { label: "Vesu", value: "Vesu" },
      { label: "Adajan", value: "Adajan" },
      { label: "Pal", value: "Pal" },
      { label: "Piplod", value: "Piplod" },
      { label: "Citylight", value: "Citylight" },
    ],
    Gandhinagar: [
      { label: "All Gandhinagar", value: "ALL" },
      { label: "Infocity", value: "Infocity" },
      { label: "Kudasan", value: "Kudasan" },
      { label: "Gift City", value: "Gift City" },
    ],
    Rajkot: [
      { label: "All Rajkot", value: "ALL" },
      { label: "Kalawad Road", value: "Kalawad Road" },
      { label: "University Road", value: "University Road" },
      { label: "Yagnik Road", value: "Yagnik Road" },
    ],
    Bengaluru: [
      { label: "All Bengaluru", value: "ALL" },
      { label: "Koramangala", value: "Koramangala" },
      { label: "HSR Layout", value: "HSR Layout" },
      { label: "Indiranagar", value: "Indiranagar" },
    ],
  };

  const activeLocalities = cityLocalities[selectedCity] || [
    { label: `All in ${selectedCity}`, value: "ALL" },
    { label: "City Center", value: "City Center" },
    { label: "IT Hub", value: "IT Hub" },
  ];

  useEffect(() => {
    // Load live marketplace stats
    api.getMarketplaceStats()
      .then((res) => {
        if (res.success) setStats(res.data);
      })
      .catch((e) => console.error("Stats load error:", e));
  }, []);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const city = query.get("city");
    const type = query.get("type");
    if (city) setSelectedCity(city);
    if (type && ["PG", "CO_LIVING", "FLAT", "COMMERCIAL", "ROOM", "STUDIO", "HOSTEL", "HOTEL"].includes(type)) setSelectedType(type);
    const positive = (value: string | null) => value && Number.isFinite(Number(value)) && Number(value) >= 0 ? value : undefined;
    setRentBounds({min: positive(query.get("min_rent")), max: positive(query.get("max_rent"))});
    setFiltersReady(true);
  }, []);

  useEffect(() => {
    if (filtersReady) fetchListings();
  }, [filtersReady, selectedCity, selectedLocality, selectedType, selectedGender, foodOnly, rentBounds]);

  const fetchListings = async (overrideParams?: any) => {
    setLoading(true);
    try {
      const targetCity = overrideParams?.city !== undefined ? overrideParams.city : selectedCity;
      const params: Record<string, string> = {
        ...(overrideParams || {}),
      };

      if (targetCity && targetCity !== "All India" && targetCity !== "ALL") {
        params.city = targetCity;
      }

      if (selectedLocality !== "ALL" && !overrideParams?.locality && selectedCity !== "All India") {
        params.locality = selectedLocality;
      }
      if (selectedType !== "ALL") params.type = selectedType;
      if (rentBounds.min) params.min_rent = rentBounds.min;
      if (rentBounds.max) params.max_rent = rentBounds.max;
      if (selectedGender !== "ANY") params.gender = selectedGender;
      if (foodOnly) params.food = "true";
      if (searchQuery.trim()) params.q = searchQuery;

      const res = await api.searchProperties(params);
      if (res.success) {
        setProperties(res.data);
      }
    } catch (err) {
      console.error("Failed to load properties:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleHeroSearch = (filters: {
    city: string;
    persona: string;
    query: string;
    propertyType: string;
    gender: string;
  }) => {
    setSelectedCity(filters.city);
    setSelectedPersona(filters.persona);
    setSearchQuery(filters.query);

    if (filters.propertyType !== "ALL") {
      setSelectedType(filters.propertyType);
    }
    if (filters.gender !== "ANY") {
      setSelectedGender(filters.gender);
    }

    fetchListings({
      city: filters.city !== "All India" ? filters.city : undefined,
      q: filters.query,
      type: filters.propertyType !== "ALL" ? filters.propertyType : undefined,
      gender: filters.gender !== "ANY" ? filters.gender : undefined,
    });
  };

  const handleLocalityOrCityClick = (val: string) => {
    if (selectedCity === "All India") {
      if (val === "ALL") {
        setSelectedLocality("ALL");
        fetchListings({ city: undefined, locality: undefined });
      } else {
        // User clicked a city from All India list (e.g. Vadodara, Surat, etc.)
        setSelectedCity(val);
        setSelectedLocality("ALL");
        fetchListings({ city: val, locality: undefined });
      }
    } else {
      setSelectedLocality(val);
      fetchListings({ city: selectedCity, locality: val !== "ALL" ? val : undefined });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {(rentBounds.min || rentBounds.max) && <div className="max-w-7xl mx-auto px-6 py-3 flex flex-wrap gap-3 items-center text-sm">Budget: {rentBounds.min ? `₹${Number(rentBounds.min).toLocaleString("en-IN")}` : "₹0"} – {rentBounds.max ? `₹${Number(rentBounds.max).toLocaleString("en-IN")}` : "Any"}<button onClick={() => setRentBounds({})} className="underline">Clear budget filter</button></div>}
      {/* RentOk Inspired Hero Search with Persona Selectors & Autocomplete */}
      <div className="bg-gradient-to-b from-white via-slate-50 to-slate-100 border-b border-slate-200">
        <RentSearchHero
          selectedCity={selectedCity}
          onCityChange={(city) => {
            setSelectedCity(city);
            setSelectedLocality("ALL");
          }}
          onSearch={handleHeroSearch}
        />
      </div>

      {/* Filter Toolbar & Results Section */}
      <section id="properties-results" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 scroll-mt-6">
        
        {/* All India & Gujarat Network Ribbon */}
        <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-950 text-white p-5 sm:p-6 rounded-3xl shadow-xl border border-emerald-500/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
              <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-400">
                {selectedCity === "All India" ? "All India Live Network" : `${selectedCity} Live Rental Network`} • Interactive Map
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white flex flex-wrap items-center gap-2">
              <span>
                {selectedCity === "All India"
                  ? `All India: ${properties.length} Verified Properties Active`
                  : `${selectedCity}: ${properties.length} Verified Stays Active`}
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {stats?.available_gujarat_beds || "39"} Co-Living Beds Ready
              </span>
            </h3>
            <p className="text-xs text-slate-300">
              Vadodara ({stats?.total_vadodara || 10} Live) • Ahmedabad ({stats?.total_ahmedabad || 6}) • Surat ({stats?.total_surat || 1}) • Gandhinagar ({stats?.total_gandhinagar || 1}) • Bengaluru ({stats?.total_blr || 3}) • Direct Landlord Bookings
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-stretch md:self-auto">
            {/* Quick City Switcher */}
            <div className="flex items-center bg-white/10 rounded-2xl p-1 border border-white/15 text-xs overflow-x-auto">
              {["All India", "Vadodara", "Ahmedabad", "Surat", "Gandhinagar", "Bengaluru"].map((cty) => (
                <button
                  key={cty}
                  type="button"
                  onClick={() => {
                    setSelectedCity(cty);
                    setSelectedLocality("ALL");
                  }}
                  className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer whitespace-nowrap ${
                    selectedCity === cty
                      ? "bg-emerald-500 text-white shadow-sm"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  {cty === "All India" ? "🇮🇳 All India" : cty}
                </button>
              ))}
            </div>

            {/* List Your Property Button */}
            <Link
              href="/list-your-property"
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-2xl text-xs font-black transition flex items-center gap-1.5 shadow-md whitespace-nowrap"
            >
              <span>+ List Property</span>
            </Link>

            {/* Watch Motion Demo Button */}
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById("properties-motion-tour");
                if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="px-3 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-xs font-bold transition flex items-center gap-1.5 border border-white/20 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Watch Video Tour</span>
            </button>
          </div>
        </div>

        {/* Localities / Cities Pills Bar */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-2 overflow-x-auto text-xs">
          <span className="font-bold text-slate-700 shrink-0 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>
              {selectedCity === "All India" ? "Popular Cities in India:" : `${selectedCity} Localities & Areas:`}
            </span>
          </span>
          {activeLocalities.map((loc) => {
            const isSelected = selectedLocality === loc.value || (selectedCity === loc.value);
            return (
              <button
                key={loc.value}
                onClick={() => handleLocalityOrCityClick(loc.value)}
                className={`px-3 py-1.5 rounded-xl font-bold transition shrink-0 cursor-pointer ${
                  isSelected
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                {loc.label}
              </button>
            );
          })}
        </div>

        {/* Category Tabs & View Mode Switcher */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
            {categories.map((c) => (
              <button
                key={c.value}
                onClick={() => setSelectedType(c.value)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
                  selectedType === c.value
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Quick Filters + View Mode Switcher */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs self-stretch lg:self-auto justify-between lg:justify-end">
            {/* Gender Filter */}
            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              className="bg-slate-50 border border-slate-200 font-semibold text-slate-800 rounded-xl px-3 py-2 outline-none cursor-pointer hover:bg-slate-100"
            >
              {genderFilters.map((g) => (
                <option key={g.value} value={g.value}>
                  {g.label}
                </option>
              ))}
            </select>

            {/* Food Included Toggle */}
            <button
              onClick={() => setFoodOnly(!foodOnly)}
              className={`px-3 py-2 rounded-xl font-bold transition border flex items-center gap-1.5 cursor-pointer ${
                foodOnly
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <Utensils className="w-3.5 h-3.5" />
              <span>Food Included</span>
            </button>

            {/* Map / Split View Switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setViewMode("SPLIT")}
                className={`px-2.5 py-1.5 rounded-lg font-bold flex items-center gap-1 transition cursor-pointer ${
                  viewMode === "SPLIT"
                    ? "bg-white text-emerald-700 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                title="Split View (Cards + Map)"
              >
                <Columns2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Split</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode("GRID")}
                className={`px-2.5 py-1.5 rounded-lg font-bold flex items-center gap-1 transition cursor-pointer ${
                  viewMode === "GRID"
                    ? "bg-white text-emerald-700 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                title="Grid Cards View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Grid</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode("MAP")}
                className={`px-2.5 py-1.5 rounded-lg font-bold flex items-center gap-1 transition cursor-pointer ${
                  viewMode === "MAP"
                    ? "bg-white text-emerald-700 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                title="Interactive Map Only"
              >
                <Map className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Map</span>
              </button>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex justify-between items-center text-xs text-slate-500">
          <div>
            <span className="font-bold text-slate-900 text-sm">
              {properties.length} Verified Properties
            </span>{" "}
            in <span className="font-bold text-slate-800">{selectedCity}</span>
            {searchQuery && (
              <span>
                {" "}
                matching &quot;<span className="text-emerald-700 font-bold">{searchQuery}</span>&quot;
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 font-semibold text-emerald-700">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Zero Brokerage • Direct Landlord Bookings</span>
          </div>
        </div>

        {/* Main Content Layout based on View Mode */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white rounded-3xl h-96 border border-slate-200" />
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-4">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-bold text-lg text-slate-900">No properties found matching your search</h3>
            <p className="text-xs text-slate-500">
              Try resetting filters, searching another locality, or viewing All India.
            </p>
            <button
              onClick={() => {
                setSelectedCity("All India");
                setSelectedLocality("ALL");
                setSelectedType("ALL");
                setSelectedGender("ANY");
                setFoodOnly(false);
                setSearchQuery("");
              }}
              className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition shadow-sm cursor-pointer"
            >
              Show All India Properties ({stats?.total_all_india || 22})
            </button>
          </div>
        ) : viewMode === "MAP" ? (
          /* Full Map View */
          <div className="space-y-4">
            <PropertyMap
              properties={properties}
              selectedCity={selectedCity}
              hoveredPropertyId={hoveredPropertyId}
              height="650px"
            />
          </div>
        ) : viewMode === "SPLIT" ? (
          /* Split View: Left Cards List (55%) + Right Sticky Map (45%) */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Property Cards */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {properties.map((p) => {
                const coverImg =
                  p.images?.find((img: any) => img.is_cover)?.image_url ||
                  p.images?.[0]?.image_url ||
                  "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80";

                const isHovered = hoveredPropertyId === p.id;

                return (
                  <div
                    key={p.id}
                    onMouseEnter={() => setHoveredPropertyId(p.id)}
                    onMouseLeave={() => setHoveredPropertyId(null)}
                    className={`bg-white rounded-3xl border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group ${
                      isHovered ? "border-emerald-500 ring-2 ring-emerald-500/20 shadow-lg" : "border-slate-200"
                    }`}
                  >
                    {/* Photo with Overlay Badges */}
                    <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                      <img
                        src={coverImg}
                        alt={p.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />

                      {/* Top tags */}
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        <span className="bg-slate-900/85 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-lg uppercase tracking-wider">
                          {p.property_type.replace("_", " ")}
                        </span>
                        {p.verification_status === "VERIFIED" && (
                          <span className="bg-emerald-600/90 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-sm">
                            <ShieldCheck className="w-3 h-3" />
                            <span>Verified</span>
                          </span>
                        )}
                      </div>

                      {/* Rent Badge */}
                      <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-xl shadow-md border border-slate-100">
                        <span className="text-[9px] text-slate-500 font-bold block uppercase tracking-wide">
                          Rent Starting
                        </span>
                        <span className="text-sm font-black text-slate-900 flex items-center">
                          ₹{Number(p.monthly_rent_starting).toLocaleString("en-IN")}
                          <span className="text-[10px] font-medium text-slate-500">/mo</span>
                        </span>
                      </div>
                    </div>

                    {/* Property Info */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 group-hover:text-emerald-700 transition line-clamp-1">
                          {p.title}
                        </h4>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span className="truncate">{p.locality}, {p.city}</span>
                        </p>
                      </div>

                      {/* Features Row */}
                      <div className="flex items-center gap-2 text-[11px] text-slate-600 border-t border-slate-100 pt-2.5">
                        <span className="bg-slate-100 px-2 py-0.5 rounded-md font-semibold">
                          {p.gender_preference === "ANY" ? "Co-ed" : p.gender_preference}
                        </span>
                        {p.food_included && (
                          <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md font-semibold flex items-center gap-1">
                            <Utensils className="w-3 h-3" />
                            <span>Food</span>
                          </span>
                        )}
                      </div>

                      {/* Action Button */}
                      <Link
                        href={`/properties/${p.slug || p.id}`}
                        className="w-full py-2 bg-slate-900 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Sticky Map */}
            <div className="lg:col-span-5 sticky top-20">
              <PropertyMap
                properties={properties}
                selectedCity={selectedCity}
                hoveredPropertyId={hoveredPropertyId}
                height="620px"
              />
            </div>
          </div>
        ) : (
          /* Classic 3-Column Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((p) => {
              const coverImg =
                p.images?.find((img: any) => img.is_cover)?.image_url ||
                p.images?.[0]?.image_url ||
                "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80";

              return (
                <div
                  key={p.id}
                  className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all duration-300 flex flex-col group"
                >
                  {/* Photo with Overlay Badges */}
                  <div className="relative h-56 w-full bg-slate-100 overflow-hidden">
                    <img
                      src={coverImg}
                      alt={p.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />

                    {/* Top tags */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      <span className="bg-slate-900/85 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider">
                        {p.property_type.replace("_", " ")}
                      </span>
                      {p.verification_status === "VERIFIED" && (
                        <span className="bg-emerald-600/90 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Verified Landlord</span>
                        </span>
                      )}
                    </div>

                    {/* Rent Badge */}
                    <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md border border-slate-100">
                      <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wide">
                        Rent Starting
                      </span>
                      <span className="text-base font-black text-slate-900 flex items-center">
                        ₹{Number(p.monthly_rent_starting).toLocaleString("en-IN")}
                        <span className="text-xs font-medium text-slate-500">/mo</span>
                      </span>
                    </div>
                  </div>

                  {/* Property Info */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                          {p.organization_name || "Direct Owner"}
                        </span>
                        <span>Min {p.minimum_stay_months || 1} Mo</span>
                      </div>
                      <h4 className="font-bold text-base text-slate-900 group-hover:text-emerald-700 transition line-clamp-1">
                        {p.title}
                      </h4>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>
                          {p.locality}, {p.city}
                        </span>
                      </p>
                    </div>

                    {/* Features Row */}
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
                      <span className="bg-slate-100 px-2.5 py-1 rounded-lg font-semibold">
                        {p.gender_preference === "ANY"
                          ? "Co-ed / Any"
                          : p.gender_preference === "MALE"
                          ? "Boys Only"
                          : p.gender_preference === "FEMALE"
                          ? "Girls Only"
                          : "Families"}
                      </span>

                      {p.food_included && (
                        <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1">
                          <Utensils className="w-3 h-3" />
                          <span>Food Inc.</span>
                        </span>
                      )}

                      <span className="bg-slate-100 px-2.5 py-1 rounded-lg font-semibold">
                        {p.notice_period_days || 30}d Notice
                      </span>
                    </div>

                    {/* Action Button */}
                    <Link
                      href={`/properties/${p.slug || p.id}`}
                      className="w-full py-2.5 bg-slate-900 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm"
                    >
                      <span>View Rooms &amp; Beds</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Embedded Motion Video Tour Section */}
      <section id="properties-motion-tour" className="py-10 bg-slate-900/5 border-t border-slate-200 scroll-mt-10">
        <MotionVideoTour />
      </section>
    </div>
  );
}
