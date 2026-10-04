"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  MapPin, Building2, Search, Filter, ShieldCheck,
  CheckCircle2, ArrowRight, Utensils, Wind, Bed,
  Sparkles, IndianRupee, HelpCircle, Star, Phone
} from "lucide-react";

import { api } from "@/lib/api";

const cityMetaMap: Record<string, {
  name: string;
  tagline: string;
  heroImg: string;
  avgPgRent: string;
  avgFlatRent: string;
  topLocalities: string[];
  description: string;
  faqs: { q: string; a: string }[];
}> = {
  bengaluru: {
    name: "Bengaluru",
    tagline: "India's Tech Capital • Silicon Valley of India",
    heroImg: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1200&q=80",
    avgPgRent: "₹8,500 – ₹18,000 / bed",
    avgFlatRent: "₹22,000 – ₹45,000 / month",
    topLocalities: ["Koramangala", "HSR Layout", "Indiranagar", "Electronic City", "Whitefield", "BTM Layout", "Marathahalli", "Bellandur"],
    description: "Find verified PGs, hostels, co-living spaces, and flats for rent in Bengaluru near major IT parks, tech hubs, and metro lines. No broker, verified photos, and biometric secure buildings.",
    faqs: [
      { q: "What is the average PG rent in Bengaluru?", a: "Single sharing PG in Bengaluru ranges from ₹14,000 to ₹22,000/mo with food, while double sharing starts around ₹8,500 to ₹12,000/mo." },
      { q: "Are food and WiFi included in Bengaluru PGs?", a: "Yes, 90% of PGs in Koramangala, HSR Layout, and Electronic City include 3-time North & South Indian meals, high-speed WiFi, and daily housekeeping." },
      { q: "What is the typical security deposit in Bengaluru?", a: "For PGs, it is typically 1 to 2 months rent. For flats, landlords traditionally ask for 3 to 6 months deposit, now capped under Model Tenancy guidelines." },
    ]
  },
  pune: {
    name: "Pune",
    tagline: "Oxford of the East • Automotive & IT Heartland",
    heroImg: "https://images.unsplash.com/photo-1588416936097-41850ab3d86d?auto=format&fit=crop&w=1200&q=80",
    avgPgRent: "₹6,500 – ₹14,000 / bed",
    avgFlatRent: "₹16,000 – ₹32,000 / month",
    topLocalities: ["Hinjewadi Phase 1", "Viman Nagar", "Kothrud", "Kharadi", "Baner", "Wakad", "Aundh", "Magarpatta"],
    description: "Explore the best student hostels, luxury PGs, and apartments in Pune close to Symbiosis, MIT, Hinjewadi Rajiv Gandhi Infotech Park, and Kharadi EON IT Park.",
    faqs: [
      { q: "How much does a PG cost in Hinjewadi Phase 1?", a: "Sharing beds start from ₹7,000/mo while luxury private rooms with AC cost ₹13,000 to ₹16,000/mo." },
      { q: "Is registration compulsory for rent agreements in Pune?", a: "Yes, under Maharashtra Rent Control and IGR rules, all leave and license agreements must be registered online." }
    ]
  },
  mumbai: {
    name: "Mumbai",
    tagline: "Financial Capital of India • The City of Dreams",
    heroImg: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80",
    avgPgRent: "₹11,000 – ₹25,000 / bed",
    avgFlatRent: "₹35,000 – ₹80,000 / month",
    topLocalities: ["Andheri West", "Powai", "Bandra", "Lower Parel", "Goregaon East", "Thane West", "Navi Mumbai", "Malad"],
    description: "Find affordable PGs, bed spaces, co-living rooms, and shared apartments in Mumbai with convenient suburban train & metro access.",
    faqs: [
      { q: "What is the typical deposit in Mumbai for a flat or PG?", a: "PGs require 1-2 months deposit, whereas Mumbai flats typically require 2 to 3 months deposit." },
      { q: "Which areas in Mumbai have the best PGs for corporate professionals?", a: "Andheri East/West, Powai (near Hiranandani/IIT), and Lower Parel/Worli are popular." }
    ]
  },
  noida: {
    name: "Noida / Greater Noida",
    tagline: "Major Educational & Industrial Hub of NCR",
    heroImg: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=1200&q=80",
    avgPgRent: "₹6,000 – ₹13,000 / bed",
    avgFlatRent: "₹15,000 – ₹30,000 / month",
    topLocalities: ["Sector 62", "Sector 18", "Sector 137", "Knowledge Park (Greater Noida)", "Sector 76", "Sector 128"],
    description: "Discover verified student hostels near Amity, Sharda, Galgotias University and corporate PGs in Sector 62 & Expressway with full power backup and security.",
    faqs: [
      { q: "Are PGs near Knowledge Park student-friendly?", a: "Yes, Knowledge Park offers hundreds of student hostels with mess food, shuttle services, and high-speed internet." }
    ]
  },
  gurugram: {
    name: "Gurugram (Cyber City)",
    tagline: "Millennium City • Fortune 500 Corporate Hub",
    heroImg: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80",
    avgPgRent: "₹9,500 – ₹20,000 / bed",
    avgFlatRent: "₹25,000 – ₹55,000 / month",
    topLocalities: ["Cyber City / DLF Phase 2", "Sector 29", "Golf Course Road", "Sohna Road", "Sector 48", "DLF Phase 3"],
    description: "Luxury co-living, studio apartments, and executive PGs in Gurgaon with AC, power backup, gym, and curated community events.",
    faqs: [
      { q: "What is the average rent near DLF Cyber City?", a: "Executive private rooms cost around ₹18,000 – ₹25,000, while double sharing starts around ₹10,000." }
    ]
  },
  ahmedabad: {
    name: "Ahmedabad",
    tagline: "Manchester of the East • Gujarat's Premier Economic Hub",
    heroImg: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    avgPgRent: "₹5,500 – ₹11,000 / bed",
    avgFlatRent: "₹14,000 – ₹28,000 / month",
    topLocalities: ["Navrangpura", "SG Highway", "Vastrapur", "Prahlad Nagar", "Bopal", "Satellite", "Chandkheda"],
    description: "Find hygienic PGs and student hostels in Ahmedabad near Gujarat University, NID, IIM-A, and SG Highway corporate offices with Jain food options.",
    faqs: [
      { q: "Is Jain food available in Ahmedabad PGs?", a: "Yes, majority of PGs in Navrangpura and Satellite provide pure vegetarian and dedicated Jain food menus." }
    ]
  },
  hyderabad: {
    name: "Hyderabad",
    tagline: "City of Pearls • HITEC City & Gachibowli Tech Corridor",
    heroImg: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
    avgPgRent: "₹7,000 – ₹16,000 / bed",
    avgFlatRent: "₹18,000 – ₹38,000 / month",
    topLocalities: ["Gachibowli", "Madhapur", "HITEC City", "Kondapur", "Kukatpally", "Manikonda", "Jubilee Hills"],
    description: "Explore top-rated executive PGs and flats in Hyderabad's Cyberabad corridor with Telugu & North Indian mess, AC, and 24/7 security.",
    faqs: [
      { q: "How much does a PG in Madhapur / HITEC City cost?", a: "2-sharing beds range from ₹8,000 to ₹12,000 with 3 meals and WiFi included." }
    ]
  },
  chennai: {
    name: "Chennai",
    tagline: "Detroit of Asia • OMR IT Expressway & Healthcare Hub",
    heroImg: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
    avgPgRent: "₹6,500 – ₹14,000 / bed",
    avgFlatRent: "₹16,000 – ₹35,000 / month",
    topLocalities: ["OMR / Thoraipakkam", "Velachery", "Sholinganallur", "Guindy", "T. Nagar", "Anna Nagar", "Siruseri"],
    description: "Hostels and PGs in Chennai along Old Mahabalipuram Road (OMR) with delicious South & North Indian food, backup power, and metro connectivity.",
    faqs: [
      { q: "Are PGs on OMR close to IT companies like TCS, Infosys, and Cognizant?", a: "Yes, hundreds of PGs in Thoraipakkam, Sholinganallur, and Navalur are within walking distance or a short bus ride to IT parks." }
    ]
  }
};

export default function CityPropertyDirectoryPage() {
  const params = useParams();
  const citySlug = (params?.city as string)?.toLowerCase() || "bengaluru";
  const cityData = cityMetaMap[citySlug] || cityMetaMap["bengaluru"];

  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState("ALL");
  const [selectedGender, setSelectedGender] = useState("ANY");

  useEffect(() => {
    fetchCityListings();
  }, [citySlug, selectedType, selectedGender]);

  const fetchCityListings = async () => {
    setLoading(true);
    try {
      const qParams: Record<string, string> = { city: cityData.name };
      if (selectedType !== "ALL") qParams.type = selectedType;
      if (selectedGender !== "ANY") qParams.gender = selectedGender;

      const res = await api.searchProperties(qParams);
      if (res.success && res.data) {
        setProperties(res.data);
      }
    } catch (err) {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">

      {/* Hero Header with Background Image Overlay */}
      <section className="relative bg-slate-900 text-white py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-overlay"
          style={{ backgroundImage: `url(${cityData.heroImg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent" />

        <div className="relative max-w-5xl mx-auto text-center space-y-5">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>{cityData.tagline}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            PGs, Hostels & Flats for Rent in{" "}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              {cityData.name}
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed">
            {cityData.description}
          </p>

          {/* City Stats Strip */}
          <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 text-center">
              <div className="text-[10px] text-slate-300 uppercase font-semibold">Avg PG Rent</div>
              <div className="text-xs sm:text-sm font-bold text-emerald-300 mt-0.5">{cityData.avgPgRent}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 text-center">
              <div className="text-[10px] text-slate-300 uppercase font-semibold">Avg Flat Rent</div>
              <div className="text-xs sm:text-sm font-bold text-teal-300 mt-0.5">{cityData.avgFlatRent}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 text-center">
              <div className="text-[10px] text-slate-300 uppercase font-semibold">Brokerage</div>
              <div className="text-xs sm:text-sm font-bold text-amber-300 mt-0.5">₹0 Zero Brokerage</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 text-center">
              <div className="text-[10px] text-slate-300 uppercase font-semibold">Verification</div>
              <div className="text-xs sm:text-sm font-bold text-cyan-300 mt-0.5">100% Aadhaar Verified</div>
            </div>
          </div>
        </div>
      </section>

      {/* Top Localities Carousel / Pills */}
      <section className="bg-white border-b border-slate-200 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center space-x-3 overflow-x-auto no-scrollbar py-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0">
            Top Localities:
          </span>
          {cityData.topLocalities.map((loc) => (
            <Link
              key={loc}
              href={`/properties?city=${encodeURIComponent(cityData.name)}&q=${encodeURIComponent(loc)}`}
              className="shrink-0 px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-xs font-medium text-slate-700 border border-slate-200 transition"
            >
              {loc}
            </Link>
          ))}
        </div>
      </section>

      {/* Filter Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500 mr-2 flex items-center space-x-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Stay Type:</span>
            </span>
            {[
              { id: "ALL", label: "All Stays" },
              { id: "PG", label: "PG & Hostels" },
              { id: "CO_LIVING", label: "Co-Living" },
              { id: "FLAT", label: "Flats & 1BHK" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedType(t.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  selectedType === t.id
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-500">Gender:</span>
            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800"
            >
              <option value="ANY">Any Gender</option>
              <option value="MALE">Boys Only</option>
              <option value="FEMALE">Girls Only</option>
              <option value="FAMILY">Family Only</option>
            </select>
          </div>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-3xl h-72 border border-slate-200 animate-pulse" />
            ))}
          </div>
        ) : properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((prop) => (
              <Link
                key={prop.id}
                href={`/properties/${prop.slug || prop.id}`}
                className="group bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-emerald-300 transition duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="h-48 bg-slate-100 relative overflow-hidden">
                    <img
                      src={
                        prop.cover_image ||
                        "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80"
                      }
                      alt={prop.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute top-3 left-3 flex space-x-1.5">
                      <span className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider">
                        {prop.property_type}
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-600/90 backdrop-blur-md text-white text-[10px] font-bold">
                        {prop.gender_preference}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex items-center space-x-1 text-xs text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="truncate">{prop.locality}, {prop.city}</span>
                    </div>

                    <h3 className="font-bold text-slate-900 group-hover:text-emerald-600 transition text-base line-clamp-1">
                      {prop.title}
                    </h3>

                    <div className="flex flex-wrap gap-1.5">
                      {prop.food_included && (
                        <span className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 text-[10px] font-semibold flex items-center space-x-1">
                          <Utensils className="w-3 h-3" />
                          <span>Food Included</span>
                        </span>
                      )}
                      {prop.has_ac && (
                        <span className="px-2 py-0.5 rounded-lg bg-blue-50 text-blue-700 text-[10px] font-semibold flex items-center space-x-1">
                          <Wind className="w-3 h-3" />
                          <span>AC</span>
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-semibold flex items-center space-x-1">
                        <Bed className="w-3 h-3" />
                        <span>{prop.available_beds || 5} Beds Available</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="px-5 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Rent Starts</span>
                    <div className="text-base font-black text-slate-900 font-mono">
                      ₹{Number(prop.monthly_rent || 8000).toLocaleString("en-IN")}<span className="text-xs font-normal text-slate-500">/mo</span>
                    </div>
                  </div>

                  <span className="px-3.5 py-1.5 rounded-xl bg-emerald-600 group-hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center space-x-1">
                    <span>View Stay</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-10 border border-slate-200 text-center max-w-lg mx-auto">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No properties match this filter in {cityData.name}</h3>
            <p className="text-xs text-slate-500 mt-1">Try resetting the filters or check back shortly.</p>
            <button
              onClick={() => { setSelectedType("ALL"); setSelectedGender("ANY"); }}
              className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* Local FAQs Section */}
      <section className="bg-white border-t border-slate-200 py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Frequently Asked Questions about Renting in {cityData.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Verified local guidance for tenants, students, and landlords in {cityData.name}.
            </p>
          </div>

          <div className="space-y-4">
            {cityData.faqs.map((faq, idx) => (
              <div key={idx} className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-2">
                <div className="text-sm font-bold text-slate-900 flex items-start space-x-2">
                  <HelpCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{faq.q}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pl-6">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
