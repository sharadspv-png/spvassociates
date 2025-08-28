import React from "react";
import { Link } from "react-router-dom";
import CloudQABoard from "../components/CloudQABoard";

export default function IncomeTax() {
  return (
    <div className="min-h-screen bg-slate-50 p-10">
      <h1 className="text-4xl font-bold">Income Tax Services</h1>
      <p className="mt-4 text-lg text-slate-700">
        Expert assistance for ITR filing (1–7), assessments, notices & appeals,
        TDS/TCS compliance and tax planning to optimize your finances.
      </p>
      <div className="mt-8">
        <CloudQABoard boardKey="incometax" title="Income Tax Q&A" />
      </div>
      <Link to="/" className="mt-6 inline-block text-blue-600 underline">
        ← Back to Home
      </Link>
    </div>
  );
}
