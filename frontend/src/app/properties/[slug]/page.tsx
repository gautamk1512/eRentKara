"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { 
  Building2, MapPin, ShieldCheck, ArrowLeft, CheckCircle2, 
  Utensils, Zap, Droplets, Calendar, User, Phone, Mail, 
  AlertCircle, Bed as BedIcon, Sparkles, X, Compass, ExternalLink, Navigation
} from "lucide-react";
import { api } from "@/lib/api";
import PropertyMap from "@/components/PropertyMap";

export default function PropertyDetailPage() {
  const { slug } = useParams();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedBed, setSelectedBed] = useState<any>(null);

  // Booking Modal State
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    tenant_name: "",
    tenant_phone: "",
    tenant_email: "",
    move_in_date: "",
    token_amount: 1000,
  });
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<any>(null);

  // Visit Modal State
  const [visitModalOpen, setVisitModalOpen] = useState(false);
  const [visitForm, setVisitForm] = useState({
    name: "",
    phone: "",
    email: "",
    move_in_date: "",
    notes: "",
  });
  const [visitSubmitting, setVisitSubmitting] = useState(false);
  const [visitSuccess, setVisitSuccess] = useState(false);

  useEffect(() => {
    if (slug) {
      loadProperty();
    }
  }, [slug]);

  const loadProperty = async () => {
    setLoading(true);
    try {
      const res = await api.getPropertyDetail(slug as string);
      if (res.success) {
        setProperty(res.data);
      }
    } catch (err) {
      console.error("Failed to load property:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSubmitting(true);
    try {
      const payload = {
        property: property.id,
        bed: selectedBed?.id,
        move_in_date: bookingForm.move_in_date,
        tenant_name: bookingForm.tenant_name,
        tenant_phone: bookingForm.tenant_phone,
        tenant_email: bookingForm.tenant_email,
        token_amount: bookingForm.token_amount,
      };

      const res = await api.createBooking(payload);
      if (res.success) {
        setBookingSuccess(res.data);
        // Reload property to reflect updated bed status
        loadProperty();
      }
    } catch (err: any) {
      alert("Booking failed: " + err.message);
    } finally {
      setBookingSubmitting(false);
    }
  };

  const handleVisitSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setVisitSubmitting(true);
    try {
      const payload = {
        property_id: property.id,
        name: visitForm.name,
        phone: visitForm.phone,
        email: visitForm.email,
        move_in_date: visitForm.move_in_date,
        notes: visitForm.notes,
      };

      const res = await api.submitEnquiry(payload);
      if (res.success) {
        setVisitSuccess(true);
      }
    } catch (err: any) {
      alert("Visit request failed: " + err.message);
    } finally {
      setVisitSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-500">
        <Building2 className="w-10 h-10 animate-bounce mx-auto text-emerald-600 mb-3" />
        <p className="font-semibold text-sm">Loading verified listing details...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-slate-800">Property not found</h2>
        <Link href="/" className="mt-4 inline-block px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold">
          Back to Marketplace
        </Link>
      </div>
    );
  }

  const coverImg = property.images?.find((img: any) => img.is_cover)?.image_url ||
                   property.images?.[0]?.image_url ||
                   "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80";

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Top Breadcrumb Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between text-xs">
          <Link href="/" className="flex items-center space-x-1.5 text-slate-500 hover:text-emerald-600 font-semibold transition">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Marketplace</span>
          </Link>
          <div className="flex items-center space-x-2 text-slate-400">
            <span>{property.city}</span>
            <span>/</span>
            <span>{property.locality}</span>
            <span>/</span>
            <span className="text-slate-800 font-bold">{property.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Title & Location Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-slate-900 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-md uppercase">
                {property.property_type.replace("_", " ")}
              </span>
              {property.verification_status === "VERIFIED" && (
                <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[11px] font-bold px-2.5 py-0.5 rounded-md flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>100% Verified Landlord</span>
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{property.title}</h1>
            <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-1.5 mt-1">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{property.address}, {property.locality}, {property.city} - {property.pincode}</span>
            </p>
          </div>

          {/* Pricing Highlight & Quick CTA */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-6">
            <div>
              <span className="text-[11px] font-bold text-slate-400 block uppercase">Monthly Rent Starting</span>
              <span className="text-2xl font-black text-slate-900">
                ₹{Number(property.monthly_rent_starting).toLocaleString("en-IN")}
                <span className="text-xs font-normal text-slate-500">/mo</span>
              </span>
            </div>
            <button
              onClick={() => setVisitModalOpen(true)}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition"
            >
              Schedule Visit
            </button>
          </div>
        </div>

        {/* Hero Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-3xl overflow-hidden shadow-sm">
          <div className="md:col-span-2 h-72 sm:h-96 bg-slate-100">
            <img src={coverImg} alt={property.title} className="w-full h-full object-cover" />
          </div>
          <div className="hidden md:flex flex-col gap-4 h-96">
            <div className="flex-1 bg-slate-100 overflow-hidden rounded-r-2xl">
              <img
                src={property.images?.[1]?.image_url || "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80"}
                alt="Room Preview"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 bg-slate-100 overflow-hidden rounded-r-2xl">
              <img
                src={property.images?.[2]?.image_url || "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=800&q=80"}
                alt="Lounge Preview"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Content Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Description, Rooms & Inventory */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
              <h2 className="text-base font-bold text-slate-900">About Demised Premises</h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {/* Room & Bed Inventory Matrix */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <BedIcon className="w-5 h-5 text-emerald-600" />
                    <span>Real-Time Bed & Room Inventory</span>
                  </h2>
                  <p className="text-xs text-slate-500">Select an available bed to instantly lock and book</p>
                </div>
              </div>

              {property.buildings?.map((bldg: any) => (
                <div key={bldg.id} className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">{bldg.name}</h3>

                  {bldg.floors?.map((fl: any) => (
                    <div key={fl.id} className="space-y-3">
                      <h4 className="text-xs font-semibold text-slate-700 bg-slate-100 px-3 py-1 rounded-md inline-block">
                        {fl.name}
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {fl.rooms?.map((rm: any) => (
                          <div key={rm.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2.5">
                            <div className="flex justify-between items-center text-xs">
                              <span className="font-bold text-slate-900">Room {rm.room_number}</span>
                              <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                                {rm.room_type}
                              </span>
                            </div>

                            <p className="text-[11px] text-slate-500">
                              {rm.has_ac ? "AC" : "Non-AC"} • {rm.has_attached_bathroom ? "Attached Bath" : "Common Bath"}
                            </p>

                            {/* Beds within Room */}
                            <div className="space-y-1.5 pt-1">
                              {rm.beds?.map((bd: any) => (
                                <div
                                  key={bd.id}
                                  className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 text-xs"
                                >
                                  <div>
                                    <span className="font-bold text-slate-800">{bd.bed_identifier}</span>
                                    <span className="text-slate-500 block text-[10px]">
                                      ₹{Number(bd.rent_amount).toLocaleString("en-IN")}/mo
                                    </span>
                                  </div>

                                  {bd.status === "AVAILABLE" ? (
                                    <button
                                      onClick={() => {
                                        setSelectedBed(bd);
                                        setBookingModalOpen(true);
                                      }}
                                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-md text-[11px] transition"
                                    >
                                      Book Bed
                                    </button>
                                  ) : (
                                    <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-100 px-2 py-0.5 rounded">
                                      {bd.status}
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Amenities Grid */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-slate-900">Included Amenities & Services</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {property.amenities?.map((amenity: any) => (
                  <div
                    key={amenity.id}
                    className="flex items-center space-x-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-800"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{amenity.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Location & Interactive Neighbourhood Map */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <span>Exact Location &amp; Neighbourhood</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {property.address || property.locality}, {property.locality}, {property.city}, {property.state} {property.pincode}
                  </p>
                </div>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    (property.address || property.title) + ", " + property.locality + ", " + property.city
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition shrink-0 self-start sm:self-auto"
                >
                  <Navigation className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Get Directions</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </div>

              {/* Interactive Map Display */}
              <div className="overflow-hidden rounded-2xl border border-slate-200">
                <PropertyMap
                  properties={[property]}
                  selectedCity={property.city || "Vadodara"}
                  height="340px"
                />
              </div>

              {property.nearby_landmarks && (
                <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-xl text-xs text-emerald-900 flex items-start gap-2">
                  <Compass className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Nearby Landmarks &amp; Transit: </span>
                    <span>{property.nearby_landmarks}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Policies, Pricing & Direct Action */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 sticky top-24">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Rental Terms & Rules</h3>

              <div className="space-y-3 text-xs text-slate-600">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-400">Security Deposit</span>
                  <span className="font-bold text-slate-900">₹{Number(property.security_deposit).toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-400">Notice Period</span>
                  <span className="font-bold text-slate-900">{property.notice_period_days} Days</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-400">Lock-in Period</span>
                  <span className="font-bold text-slate-900">{property.minimum_stay_months} Months</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-400">Electricity</span>
                  <span className="font-bold text-slate-900">{property.electricity_policy}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-400">Water & Maintenance</span>
                  <span className="font-bold text-slate-900">{property.water_policy}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => {
                    setSelectedBed(null);
                    setBookingModalOpen(true);
                  }}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition shadow-md shadow-emerald-600/20 flex items-center justify-center space-x-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Instant Reserve with ₹1,000 Token</span>
                </button>

                <button
                  onClick={() => setVisitModalOpen(true)}
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition"
                >
                  Schedule Free Property Visit
                </button>
              </div>

              <p className="text-[10px] text-slate-400 text-center leading-normal">
                Double-booking protected by atomic database locking. Token refundable if stay is not confirmed.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {bookingModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => {
                setBookingModalOpen(false);
                setBookingSuccess(null);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            {bookingSuccess ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-lg text-slate-900">Booking Confirmed!</h3>
                <p className="text-xs text-slate-600">
                  Reference: <span className="font-bold text-slate-900">{bookingSuccess.booking_reference}</span>
                </p>
                <p className="text-xs text-slate-500">
                  Your bed has been reserved atomically. The landlord has received your booking details.
                </p>
                <button
                  onClick={() => {
                    setBookingModalOpen(false);
                    setBookingSuccess(null);
                  }}
                  className="mt-3 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-3.5">
                <div>
                  <h3 className="font-bold text-base text-slate-900">Reserve Your Stay</h3>
                  <p className="text-xs text-slate-500">
                    {selectedBed ? `Selected: ${selectedBed.bed_identifier}` : "Reserve property bed"}
                  </p>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={bookingForm.tenant_name}
                      onChange={(e) => setBookingForm({ ...bookingForm, tenant_name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">WhatsApp Mobile Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={bookingForm.tenant_phone}
                      onChange={(e) => setBookingForm({ ...bookingForm, tenant_phone: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="rahul@example.com"
                      value={bookingForm.tenant_email}
                      onChange={(e) => setBookingForm({ ...bookingForm, tenant_email: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Target Move-in Date</label>
                    <input
                      type="date"
                      required
                      value={bookingForm.move_in_date}
                      onChange={(e) => setBookingForm({ ...bookingForm, move_in_date: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={bookingSubmitting}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition shadow-sm"
                  >
                    {bookingSubmitting ? "Securing Inventory..." : "Lock & Confirm Reservation"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Visit Modal */}
      {visitModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => {
                setVisitModalOpen(false);
                setVisitSuccess(false);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            {visitSuccess ? (
              <div className="text-center py-6 space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h3 className="font-bold text-base text-slate-900">Visit Scheduled!</h3>
                <p className="text-xs text-slate-600">
                  The property manager has been notified and will contact you on WhatsApp to confirm the site visit time.
                </p>
                <button
                  onClick={() => {
                    setVisitModalOpen(false);
                    setVisitSuccess(false);
                  }}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleVisitSubmit} className="space-y-3.5">
                <div>
                  <h3 className="font-bold text-base text-slate-900">Schedule Free Property Visit</h3>
                  <p className="text-xs text-slate-500">Visit {property.title} before booking</p>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vikram Sethi"
                      value={visitForm.name}
                      onChange={(e) => setVisitForm({ ...visitForm, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98112 23344"
                      value={visitForm.phone}
                      onChange={(e) => setVisitForm({ ...visitForm, phone: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Preferred Visit Date & Time</label>
                    <input
                      type="datetime-local"
                      required
                      value={visitForm.move_in_date}
                      onChange={(e) => setVisitForm({ ...visitForm, move_in_date: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={visitSubmitting}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition"
                >
                  {visitSubmitting ? "Scheduling..." : "Submit Visit Request"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
