"use client";
import { useState } from "react";

// List of countries for the select dropdown
const countries = [
  "Nigeria", "Ghana", "Kenya", "South Africa", "United States", "United Kingdom", "Canada", "India", "Germany", "France", "Brazil", "China", "Japan", "Australia", "Italy", "Spain", "Russia", "Egypt", "Turkey", "Mexico", "Indonesia", "Pakistan", "Bangladesh", "Philippines", "Vietnam", "Argentina", "Poland", "Netherlands", "Sweden", "Switzerland", "Belgium", "Norway", "Denmark", "Finland", "Ireland", "Portugal", "Greece", "Saudi Arabia", "UAE", "Israel", "South Korea", "Malaysia", "Singapore", "Thailand", "New Zealand", "Morocco", "Algeria", "Ethiopia", "Sudan", "Angola", "Cameroon", "Ivory Coast", "Senegal", "Uganda", "Tanzania", "Zambia", "Zimbabwe", "Mozambique", "Chile", "Colombia", "Peru", "Venezuela", "Ecuador", "Bolivia", "Paraguay", "Uruguay", "Costa Rica", "Panama", "Guatemala", "Honduras", "El Salvador", "Nicaragua", "Jamaica", "Trinidad & Tobago", "Barbados", "Bahamas", "Cuba", "Dominican Republic", "Haiti", "Puerto Rico", "Other"
];

export default function RegistrationForm({ token, projectName, packageName }: { token: string; projectName: string; packageName: string; }) {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contactDetails, setContactDetails] = useState({
    fullName: '',
    username: '',
    password: '',
    phone: '',
    email: '',
    country: '',
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (!isConfirmed) {
      setError("Please confirm your details.");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/registrations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, ...contactDetails }),
    });
    const data = await res.json();
    setLoading(false);
    if (!data.ok) { setError(data.error || "Failed"); return; }
    window.location.href = data.whatsapp_url;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="g-card w-full max-w-md space-y-3">
        <div className="g-title">Register · {projectName}</div>
        <div className="g-sub">Package: {packageName}</div>
        {error && <div className="text-red-400">{error}</div>}
        <input
          className="g-input"
          name="fullName"
          placeholder="Full Name"
          required
          value={contactDetails.fullName}
          onChange={e => setContactDetails({ ...contactDetails, fullName: e.target.value })}
        />
        <input
          className="g-input"
          name="username"
          placeholder="Username"
          required
          value={contactDetails.username}
          onChange={e => setContactDetails({ ...contactDetails, username: e.target.value })}
        />
        <input
          className="g-input"
          name="password"
          placeholder="Password"
          type="password"
          required
          value={contactDetails.password}
          onChange={e => setContactDetails({ ...contactDetails, password: e.target.value })}
        />
        <input
          className="g-input"
          name="phone"
          placeholder="Phone (digits only, country code first)"
          required
          value={contactDetails.phone}
          onChange={e => setContactDetails({ ...contactDetails, phone: e.target.value })}
        />
        <input
          className="g-input"
          name="email"
          placeholder="Email (optional)"
          value={contactDetails.email}
          onChange={e => setContactDetails({ ...contactDetails, email: e.target.value })}
        />
        <select
          className="g-input"
          name="country"
          required
          value={contactDetails.country}
          onChange={e => setContactDetails({ ...contactDetails, country: e.target.value })}
        >
          <option value="">Select Country</option>
          {countries.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <div className="g-sub flex items-center gap-2">
          <input
            type="checkbox"
            onChange={() => setIsConfirmed(!isConfirmed)}
            checked={isConfirmed}
            id="confirm-details"
          />
          <label htmlFor="confirm-details">
            I confirm that the details are correct and I cannot change them after submission.
          </label>
        </div>
        <button className="g-btn w-full" disabled={loading}>
          {loading ? "Submitting..." : "Submit & WhatsApp"}
        </button>
      </form>
    </div>
  );
}
