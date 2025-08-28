import React from "react";
import { Link } from "react-router-dom";
import CloudQABoard from "../components/CloudQABoard";

export default function Corporate() {
  return (
    <div className="min-h-screen bg-slate-50 p-10">
      <h1 className="text-4xl font-bold">Corporate Compliances</h1>
      <p className="mt-4 text-lg text-slate-700">
        Comprehensive support for ROC filings, company/LLP incorporation, board/AGM
        meetings, secretarial compliance, and regulatory obligations.
      </p>
      <div className="mt-8">
        <CloudQABoard boardKey="corporate" title="Corporate Compliances Q&A" />
      </div>
      <Link to="/" className="mt-6 inline-block text-blue-600 underline">
        ← Back to Home
      </Link>
    </div>
  );
}
