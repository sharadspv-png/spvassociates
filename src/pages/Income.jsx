import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

const Container = ({ children, className = "" }) => (
  <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>
);
const Section = ({ id, className = "", children }) => (
  <section id={id} className={`py-16 sm:py-20 ${className}`}>{children}</section>
);
const Tag = ({ children }) => (
  <span className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-white/80 px-3 py-1 text-xs font-medium text-slate-700 shadow-sm">
    <ShieldCheck className="h-3.5 w-3.5"/>{children}
  </span>
);
const fade = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.6 }
};

export default function IncomeTax() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      <header className="sticky top-0 z-50 backdrop-blur bg-white/70 border-b border-slate-200">
        <Container className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl sm:text-2xl">
            <img src="/ca-logo-india.jpg" alt="Logo" className="h-8 w-auto"/>
            <span>SPV & Associates</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link to="/incometax" className="hover:text-slate-600">Income Tax</Link>
            <Link to="/gst" className="hover:text-slate-600">GST</Link>
            <Link to="/corporate" className="hover:text-slate-600">Corporate</Link>
            <a href="/#contact" className="hover:text-slate-600">Contact</a>
          </nav>
        </Container>
      </header>

      <Section>
        <Container>
          <motion.div {...fade} className="text-center">
            <Tag>Professional Services</Tag>
            <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight">Income Tax</h1>
            <p className="mt-4 text-slate-600 max-w-2xl mx-auto">Expert assistance for ITR filing (1–7), assessments, notices & appeals, TDS/TCS and planning.</p>
            <div className="mt-6">
              <Link to="/" className="text-sm underline text-slate-700">← Back to Home</Link>
            </div>
          </motion.div>
        </Container>
      </Section>
    </div>
  );
}
