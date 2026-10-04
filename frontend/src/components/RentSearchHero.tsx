"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  MapPin, Search, Crosshair, GraduationCap, Briefcase, 
  Users2, User, Sparkles, Building2, CheckCircle2, ShieldCheck,
  ChevronDown, ArrowRight, Building, Home, Compass, Map, Globe
} from "lucide-react";

interface RentSearchHeroProps {
  onSearch: (params: {
    city: string;
    persona: string;
    query: string;
    propertyType: string;
    gender: string;
  }) => void;
  selectedCity: string;
  onCityChange: (city: string) => void;
}

interface SuggestionItem {
  id: string;
  title: string;
  subtitle: string;
  type: "city" | "locality" | "category" | "property";
  city: string;
  locality?: string;
  propertyType?: string;
  count?: string;
}

export default function RentSearchHero({
  onSearch,
  selectedCity = "All India",
  onCityChange,
}: RentSearchHeroProps) {
  // Rotating animated property category words
  const words = ["Flats", "PGs", "Hostels", "Co-Living", "Rooms"];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  // Persona options
  const [selectedPersona, setSelectedPersona] = useState<string>("Professional");
  const [locationQuery, setLocationQuery] = useState("");
  const [detectingLocation, setDetectingLocation] = useState(false);

  // Autocomplete / Suggestions state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const personas = [
    {
      id: "Student",
      label: "Student",
      icon: GraduationCap,
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
      accent: "from-blue-500 to-indigo-600",
    },
    {
      id: "Professional",
      label: "Professional",
      icon: Briefcase,
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
      accent: "from-emerald-500 to-teal-600",
    },
    {
      id: "Couple",
      label: "Couple",
      icon: Users2,
      avatarUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=120&q=80",
      accent: "from-rose-500 to-amber-500",
    },
    {
      id: "Bachelor",
      label: "Bachelor",
      icon: User,
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
      accent: "from-purple-500 to-violet-600",
    },
  ];

  const popularCities = [
    "All India",
    "Vadodara",
    "Ahmedabad",
    "Surat",
    "Gandhinagar",
    "Rajkot",
    "Anand",
    "Bharuch",
    "Bengaluru",
    "Pune",
    "Mumbai",
    "Delhi NCR",
  ];

  // Gujarat & National Database of Localities & Hubs for Autocomplete
  const SUGGESTION_DATABASE: SuggestionItem[] = [
    // Top Cities
    { id: "city-all", title: "All India (All Cities)", subtitle: "Browse verified stays across all regions", type: "city", city: "All India", count: "All 22+ Stays" },
    { id: "city-vad", title: "Vadodara, Gujarat", subtitle: "Cultural capital • Alkapuri, Gotri, Sayajigunj", type: "city", city: "Vadodara", count: "10 Verified Stays" },
    { id: "city-ahm", title: "Ahmedabad, Gujarat", subtitle: "Mega city • Vastrapur, SG Highway, Prahlad Nagar", type: "city", city: "Ahmedabad", count: "6 Verified Stays" },
    { id: "city-sur", title: "Surat, Gujarat", subtitle: "Diamond City • Vesu Luxury Stays, Adajan, Pal", type: "city", city: "Surat", count: "1 Luxury Co-Living" },
    { id: "city-gan", title: "Gandhinagar, Gujarat", subtitle: "Infocity, Kudasan, PDPU, Gift City", type: "city", city: "Gandhinagar", count: "1 Verified Stay" },
    { id: "city-raj", title: "Rajkot, Gujarat", subtitle: "Kalawad Road, University Area", type: "city", city: "Rajkot", count: "Verified Stays" },
    { id: "city-blr", title: "Bengaluru, Karnataka", subtitle: "Koramangala, HSR Layout, Indiranagar", type: "city", city: "Bengaluru", count: "3 Verified Stays" },
    { id: "city-pun", title: "Pune, Maharashtra", subtitle: "Hinjawadi IT Hub, Viman Nagar, Wakad", type: "city", city: "Pune", count: "Verified Stays" },

    // Vadodara Hubs
    { id: "v-1", title: "Alkapuri, Vadodara", subtitle: "Prime Hub, Corporate Offices & Cafes", type: "locality", city: "Vadodara", locality: "Alkapuri", count: "3 Verified Stays" },
    { id: "v-2", title: "Gotri, Vadodara", subtitle: "Tech & Medical Hub, Sevasi Road", type: "locality", city: "Vadodara", locality: "Gotri", count: "2 Verified Stays" },
    { id: "v-3", title: "Sayajigunj, Vadodara", subtitle: "Near Railway Station & MSU Campus", type: "locality", city: "Vadodara", locality: "Sayajigunj", count: "2 Verified Stays" },
    { id: "v-4", title: "Fatehgunj, Vadodara", subtitle: "University Area & Student Zone", type: "locality", city: "Vadodara", locality: "Fatehgunj", count: "1 Verified Stay" },
    { id: "v-5", title: "Akota, Vadodara", subtitle: "Residential & Corporate Offices", type: "locality", city: "Vadodara", locality: "Akota", count: "1 Verified Stay" },
    { id: "v-6", title: "Manjalpur, Vadodara", subtitle: "GIDC & Industrial Hub", type: "locality", city: "Vadodara", locality: "Manjalpur", count: "1 Verified Stay" },
    { id: "v-7", title: "Vasna Road, Vadodara", subtitle: "Modern Highrise Apartments & Bhayli", type: "locality", city: "Vadodara", locality: "Vasna Road", count: "1 Verified Stay" },
    { id: "v-8", title: "Karelibaug, Vadodara", subtitle: "Heritage & Family Neighbourhood", type: "locality", city: "Vadodara", locality: "Karelibaug", count: "1 Verified Stay" },
    { id: "v-9", title: "Waghodia Road, Vadodara", subtitle: "Parul University & Tech Zone", type: "locality", city: "Vadodara", locality: "Waghodia Road", count: "1 Verified Stay" },
    
    // Surat Hubs
    { id: "s-1", title: "Vesu, Surat", subtitle: "Diamond City Luxury & SVNIT Area", type: "locality", city: "Surat", locality: "Vesu", count: "1 Luxury Co-Living" },
    { id: "s-2", title: "Adajan, Surat", subtitle: "Prime Residential Hub & Riverfront", type: "locality", city: "Surat", locality: "Adajan", count: "Verified Stays" },
    { id: "s-3", title: "Pal, Surat", subtitle: "Modern Highrises & Shopping", type: "locality", city: "Surat", locality: "Pal", count: "Verified Stays" },

    // Ahmedabad Hubs
    { id: "a-1", title: "Vastrapur, Ahmedabad", subtitle: "IIM-A & Lake Hub", type: "locality", city: "Ahmedabad", locality: "Vastrapur", count: "1 Executive Stay" },
    { id: "a-2", title: "Navrangpura, Ahmedabad", subtitle: "Gujarat University & CG Road", type: "locality", city: "Ahmedabad", locality: "Navrangpura", count: "1 Student PG" },
    { id: "a-3", title: "SG Highway, Ahmedabad", subtitle: "IT Parks & Corporate Hubs", type: "locality", city: "Ahmedabad", locality: "SG Highway", count: "Verified Stays" },
    { id: "a-4", title: "Prahlad Nagar, Ahmedabad", subtitle: "Corporate Offices & High-Street", type: "locality", city: "Ahmedabad", locality: "Prahlad Nagar", count: "Verified Stays" },

    // Property Types
    { id: "cat-1", title: "Flats & Furnished Apartments", subtitle: "1BHK, 2BHK, 3BHK for Families & Execs", type: "category", city: selectedCity, propertyType: "FLAT" },
    { id: "cat-2", title: "Co-Living & Executive Stays", subtitle: "Fully Managed with Wi-Fi, Food & Housekeeping", type: "category", city: selectedCity, propertyType: "CO_LIVING" },
    { id: "cat-3", title: "PGs & Hostels (Boys / Girls)", subtitle: "Affordable Stays with 3-Time Meals", type: "category", city: selectedCity, propertyType: "PG" },
    { id: "cat-4", title: "Studio 1BHK Apartments", subtitle: "Private 1RK / Studio for Working Singles", type: "category", city: selectedCity, propertyType: "STUDIO" },
  ];

  // Helper to scroll smoothly to properties results section
  const scrollToResults = () => {
    setTimeout(() => {
      const el = document.getElementById("properties-results");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  // Dynamic suggestions based on query and city
  const filteredSuggestions = SUGGESTION_DATABASE.filter((item) => {
    const q = locationQuery.toLowerCase().trim();
    if (!q) {
      // Default suggestions show matching city items or popular categories
      if (selectedCity === "All India") {
        return item.type === "city" || item.type === "category";
      }
      return item.city === selectedCity || item.type === "category" || item.type === "city";
    }
    return (
      item.title.toLowerCase().includes(q) ||
      item.subtitle.toLowerCase().includes(q) ||
      item.city.toLowerCase().includes(q) ||
      (item.locality && item.locality.toLowerCase().includes(q))
    );
  }).slice(0, 8);

  // Rotate headline word every 2.4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
    }, 2400);
    return () => clearInterval(interval);
  }, [words.length]);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectSuggestion = (item: SuggestionItem) => {
    const targetCity = item.type === "city" ? item.city : (item.city || selectedCity);
    if (targetCity && targetCity !== selectedCity) {
      onCityChange(targetCity);
    }
    
    const newQuery = item.type === "city" ? "" : (item.locality || (item.type === "category" ? "" : item.title));
    setLocationQuery(newQuery);
    setIsDropdownOpen(false);

    onSearch({
      city: targetCity,
      persona: selectedPersona,
      query: newQuery,
      propertyType: item.propertyType || (selectedPersona === "Student" ? "PG" : selectedPersona === "Couple" ? "FLAT" : "ALL"),
      gender: selectedPersona === "Couple" ? "FAMILY" : "ANY",
    });

    scrollToResults();
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsDropdownOpen(false);
    
    // If the user typed a city name in the search box (e.g. "Vadodara", "Surat", "Ahmedabad")
    let activeCity = selectedCity;
    const lowerQuery = locationQuery.trim().toLowerCase();
    const matchedCity = popularCities.find((c) => c.toLowerCase() === lowerQuery);
    if (matchedCity) {
      activeCity = matchedCity;
      onCityChange(matchedCity);
      setLocationQuery("");
    }

    onSearch({
      city: activeCity,
      persona: selectedPersona,
      query: matchedCity ? "" : locationQuery,
      propertyType: selectedPersona === "Student" ? "PG" : selectedPersona === "Couple" ? "FLAT" : "ALL",
      gender: selectedPersona === "Couple" ? "FAMILY" : "ANY",
    });

    scrollToResults();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isDropdownOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        setIsDropdownOpen(true);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < filteredSuggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : filteredSuggestions.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < filteredSuggestions.length) {
        handleSelectSuggestion(filteredSuggestions[highlightedIndex]);
      } else {
        handleSearchSubmit();
      }
    } else if (e.key === "Escape") {
      setIsDropdownOpen(false);
    }
  };

  const handleDetectLocation = () => {
    setDetectingLocation(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setDetectingLocation(false);
          onCityChange("Vadodara");
          setLocationQuery("Alkapuri");
          setIsDropdownOpen(false);
          onSearch({
            city: "Vadodara",
            persona: selectedPersona,
            query: "Alkapuri",
            propertyType: "ALL",
            gender: "ANY",
          });
          scrollToResults();
        },
        () => {
          setDetectingLocation(false);
          setLocationQuery("Alkapuri");
          scrollToResults();
        }
      );
    } else {
      setDetectingLocation(false);
    }
  };

  return (
    <div className="relative pt-12 pb-14 px-4 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto space-y-6">
      {/* Trust pill */}
      <div className="inline-flex items-center space-x-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-1.5 rounded-full text-xs font-bold shadow-xs">
        <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
        <span>All India Rental Network &amp; Verified Gujarat Inventory</span>
      </div>

      {/* Main Dynamic Headline */}
      <div className="space-y-2">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 leading-tight">
          Find your{" "}
          <span className="relative inline-block px-1">
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 bg-clip-text text-transparent transition-all duration-500 inline-block transform">
              {words[currentWordIndex]}
            </span>
            <span className="absolute bottom-1 left-0 w-full h-2 bg-emerald-100 -z-10 rounded-full" />
          </span>
        </h1>
        <p className="text-xl sm:text-2xl text-slate-600 font-medium tracking-tight">
          Wherever you want across India. Whenever you need.
        </p>
      </div>

      {/* Interactive RentOk-Style Search Box */}
      <div 
        ref={searchContainerRef}
        className="bg-white rounded-3xl p-5 sm:p-7 shadow-xl shadow-slate-200/60 border border-slate-200 text-left max-w-3xl mx-auto space-y-5 transition duration-200 relative z-30"
      >
        {/* Row 1: "I'm a" Persona Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <span className="text-xs sm:text-sm font-bold text-slate-800 shrink-0 min-w-16">
            I&apos;m a
          </span>

          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-2.5 flex-1">
            {personas.map((p) => {
              const isSelected = selectedPersona === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedPersona(p.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-2xl text-xs sm:text-sm font-bold transition border cursor-pointer select-none ${
                    isSelected
                      ? "bg-slate-900 text-white border-slate-900 shadow-md scale-[1.02]"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100"
                  }`}
                >
                  <img
                    src={p.avatarUrl}
                    alt={p.label}
                    className="w-5 h-5 rounded-full object-cover shrink-0 ring-1 ring-white/50"
                  />
                  <span>{p.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="h-px bg-slate-100 w-full" />

        {/* Row 2: "Finding in" Input + City Selector + Autocomplete Suggestions Dropdown */}
        <form onSubmit={handleSearchSubmit} className="space-y-3 relative">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <span className="text-xs sm:text-sm font-bold text-slate-800 shrink-0 min-w-16 hidden sm:block">
              Finding in
            </span>

            {/* City Dropdown (Defaults to All India) */}
            <div className="relative">
              <select
                value={selectedCity}
                onChange={(e) => {
                  onCityChange(e.target.value);
                  setLocationQuery("");
                }}
                className="appearance-none w-full sm:w-auto bg-slate-50 border border-slate-200 text-slate-800 text-xs sm:text-sm font-bold rounded-2xl pl-3.5 pr-8 py-3 outline-none hover:bg-slate-100 cursor-pointer transition focus:border-emerald-500"
              >
                {popularCities.map((city) => (
                  <option key={city} value={city}>
                    {city === "All India" ? "🇮🇳 All India" : city}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-3.5 pointer-events-none" />
            </div>

            {/* Locality / City Input with Live Autocomplete Trigger */}
            <div className="flex-1 relative">
              <div className="flex items-center px-4 py-2.5 bg-slate-50 rounded-2xl border border-slate-200 focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500/20 transition">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mr-2.5" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder={
                    selectedCity === "All India"
                      ? "Search city, area, or stay (e.g. Vadodara, Alkapuri, Surat, Flat, PG)..."
                      : `Search locality, landmark, or stay in ${selectedCity}...`
                  }
                  value={locationQuery}
                  onChange={(e) => {
                    setLocationQuery(e.target.value);
                    setIsDropdownOpen(true);
                  }}
                  onFocus={() => setIsDropdownOpen(true)}
                  onKeyDown={handleKeyDown}
                  className="bg-transparent text-xs sm:text-sm outline-none w-full text-slate-800 placeholder-slate-400 font-medium"
                />
                <button
                  type="button"
                  onClick={handleDetectLocation}
                  title="Detect My Location"
                  className={`p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-slate-200/50 transition cursor-pointer ${
                    detectingLocation ? "animate-spin text-emerald-600" : ""
                  }`}
                >
                  <Crosshair className="w-4 h-4" />
                </button>
              </div>

              {/* Autocomplete / References Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 text-left divide-y divide-slate-100 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="p-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-500">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                      <span>Suggested Cities, Areas &amp; Stays</span>
                    </span>
                    <span className="text-[10px] text-slate-400">Click or press ↵ to select</span>
                  </div>

                  <div className="max-h-72 overflow-y-auto py-1">
                    {filteredSuggestions.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-500">
                        No specific match for &quot;{locationQuery}&quot;. Click Search to browse all stays.
                      </div>
                    ) : (
                      filteredSuggestions.map((item, idx) => {
                        const isHighlighted = idx === highlightedIndex;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => handleSelectSuggestion(item)}
                            onMouseEnter={() => setHighlightedIndex(idx)}
                            className={`w-full px-4 py-2.5 flex items-center justify-between text-left transition cursor-pointer ${
                              isHighlighted ? "bg-emerald-50/80 text-emerald-950" : "hover:bg-slate-50 text-slate-800"
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                                item.type === "city"
                                  ? "bg-indigo-100 text-indigo-700"
                                  : item.type === "locality" 
                                  ? "bg-emerald-100 text-emerald-700" 
                                  : item.type === "category"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-slate-100 text-slate-700"
                              }`}>
                                {item.type === "city" ? (
                                  <Globe className="w-3.5 h-3.5" />
                                ) : item.type === "locality" ? (
                                  <MapPin className="w-3.5 h-3.5" />
                                ) : item.type === "category" ? (
                                  <Building className="w-3.5 h-3.5" />
                                ) : (
                                  <Home className="w-3.5 h-3.5" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <div className="font-bold text-xs flex items-center gap-1.5 truncate">
                                  <span>{item.title}</span>
                                </div>
                                <div className="text-[11px] text-slate-500 truncate">
                                  {item.subtitle}
                                </div>
                              </div>
                            </div>

                            {item.count && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 shrink-0 ml-2">
                                {item.count}
                              </span>
                            )}
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Green / Emerald Search Button */}
            <button
              type="submit"
              className="px-7 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-sm shadow-lg shadow-emerald-600/30 transition flex items-center justify-center space-x-2 shrink-0 transform active:scale-95 cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>
          </div>

          {/* Quick Filter Chips (Shows Cities or Localities) */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] pt-1">
            <span className="text-slate-400 font-bold shrink-0">
              {selectedCity === "All India"
                ? "Popular Cities:"
                : selectedCity === "Vadodara"
                ? "Vadodara Hubs:"
                : `Popular in ${selectedCity}:`}
            </span>
            {(selectedCity === "All India"
              ? ["Vadodara", "Ahmedabad", "Surat", "Gandhinagar", "Rajkot", "Bengaluru", "Pune"]
              : selectedCity === "Vadodara"
              ? ["Alkapuri", "Gotri", "Sayajigunj", "Fatehgunj", "Manjalpur", "Vasna Road", "Akota", "Karelibaug", "Waghodia Road"]
              : selectedCity === "Ahmedabad"
              ? ["Vastrapur", "Navrangpura", "SG Highway", "Prahlad Nagar", "Bodakdev"]
              : selectedCity === "Surat"
              ? ["Vesu", "Adajan", "Pal", "Piplod", "Citylight"]
              : ["City Center", "IT Park", "University Area"]
            ).map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => {
                  if (selectedCity === "All India") {
                    onCityChange(loc);
                    setLocationQuery("");
                    onSearch({
                      city: loc,
                      persona: selectedPersona,
                      query: "",
                      propertyType: "ALL",
                      gender: "ANY",
                    });
                  } else {
                    setLocationQuery(loc);
                    setIsDropdownOpen(false);
                    onSearch({
                      city: selectedCity,
                      persona: selectedPersona,
                      query: loc,
                      propertyType: "ALL",
                      gender: "ANY",
                    });
                  }
                  scrollToResults();
                }}
                className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition shrink-0 font-semibold cursor-pointer"
              >
                {loc}
              </button>
            ))}
          </div>
        </form>
      </div>

      {/* Social Proof Text Below Card */}
      <div className="text-center pt-2">
        <p className="text-xs sm:text-sm font-bold text-emerald-800 inline-flex items-center gap-1.5 bg-emerald-50/80 px-4 py-1.5 rounded-full border border-emerald-100">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>82,000+ millennials staying happily in over 4,100+ verified properties across India</span>
        </p>
      </div>
    </div>
  );
}
