import React from "react";
import { Link } from "react-router-dom";
import CloudQABoard from "../components/CloudQABoard";

export default function GST() {
  return (
    <div className="min-h-screen bg-slate-50 p-10">
      <h1 className="text-4xl font-bold">GST Services</h1>
      <p className="mt-4 text-lg text-slate-700">
        End-to-end GST solutions including registration, monthly/annual returns,
        audits, refunds, and advisory for businesses across India.
      </p>
      <div className="mt-8">
        <CloudQABoard boardKey="gst" title="GST Q&A" />
      </div>
      <Link to="/" className="mt-6 inline-block text-blue-600 underline">
        ← Back to Home
      </Link>
    </div>
  );
}
