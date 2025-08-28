import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Scale, Calculator, Building2, ReceiptIndianRupee,
  Phone, Mail, MapPin, ShieldCheck,
  FileCheck2, FileSearch
} from "lucide-react";

const Container = ({ children, className = "" }) => (
  <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>
);
const Section = ({ id, className = "", children }) => (
  <section id={id} className={`py-16 sm:py-20 ${className}`}>{children}</section>
);
const Card = ({ className = "", children }) => (
  <div className={`rounded-2xl shadow-sm border border-slate-200 bg-white ${className}`}>{children}</div>
);
const OutlineButton = ({ as: As = "a", className = "", children, ...props }) => (
  <As className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 font-medium border border-slate-300 hover:border-slate-400 text-slate-800 bg-white transition ${className}`} {...props}>
    {children}
  </As>
);
const Tag = ({ children }) => (
  <span className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-white/80 px-3 py-1 text-xs font-medium text-slate-700 shadow-sm">
    <ShieldCheck className="h-3.5 w-3.5"/>{children}
  </span>
);

const SERVICES = [
  { icon: <Scale className="h-6 w-6"/>, title: "Income Tax", points: ["Return filing (ITR 1–7)", "Scrutiny & assessments", "TDS/TCS advisory", "Notices & appeals"] },
  { icon: <ReceiptIndianRupee className="h-6 w-6"/>, title: "GST", points: ["GST registration", "GSTR-1/3B filing", "Input credit review", "Refunds & audits"] },
  { icon: <Building2 className="h-6 w-6"/>, title: "Company Law", points: ["Company/LLP incorporation", "ROC filings & XBRL", "Board/AGM compliance", "Strike off & revival"] },
  { icon: <Calculator className="h-6 w-6"/>, title: "Accounting & Payroll", points: ["Books of accounts", "MIS & dashboards", "PF/ESI/Professional Tax", "Payroll processing"] },
  { icon: <FileCheck2 className="h-6 w-6"/>, title: "Certifications", points: ["Net worth certificates", "CA certificates", "Projections & CMA", "Bank/visa papers"] },
  { icon: <FileSearch className="h-6 w-6"/>, title: "Litigation & Advisory", points: ["ITAT/CIT(A) support", "GST appellate work", "Notices replies", "Strategic tax planning"] }
];

const FAQS = [
  { q: "Old vs New Tax Regime — which should I pick?", a: "We evaluate slabs, deductions, exemptions and your specific profile to suggest the most tax‑efficient option each year." },
  { q: "Can you handle GST monthly compliance end‑to‑end?", a: "Yes. We manage data prep, reconciliations, returns, and alerts — with MIS so you always know where things stand." },
  { q: "Do you work with startups and MSMEs?", a: "Absolutely — from incorporation to funding, ESOPs, virtual CFO, and regular compliance." },
  { q: "How do consultations work?", a: "Contact us directly by phone/email for assistance." }
];

const fade = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.6 }
};

export default function Website() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      <header className="sticky top-0 z-50 backdrop-blur bg-white/70 border-b border-slate-200">
        <Container className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl sm:text-2xl">
            <img src="/ca-logo-india.jpg" alt="CA India Logo" className="h-8 w-auto"/>
            <span>SPV & Associates</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#services" className="hover:text-slate-600">Services</a>
            <a href="#about" className="hover:text-slate-600">About</a>
            <Link to="/incometax" className="hover:text-slate-600">Income Tax</Link>
            <Link to="/gst" className="hover:text-slate-600">GST</Link>
            <Link to="/corporate" className="hover:text-slate-600">Corporate</Link>
            <a href="#faq" className="hover:text-slate-600">FAQ</a>
            <a href="#contact" className="hover:text-slate-600">Contact</a>
          </nav>
        </Container>
      </header>

      {/* Hero with CA logo as the main visual */}
      <Section id="home" className="relative overflow-hidden">
        <Container>
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <motion.div {...fade}>
              <Tag>Trusted Tax & Corporate Compliance</Tag>
              <h1 className="mt-4 text-5xl sm:text-6xl font-extrabold tracking-tight">
                SPV & Associates
              </h1>
              <p className="mt-4 text-2xl text-slate-600">Income Tax • GST • Company Law</p>
              <p className="mt-4 text-slate-600 max-w-xl">
                We help individuals and businesses stay compliant, reduce risk, and make smarter finance decisions. Serving clients across the world with timely, accurate, and proactive advice. Based in Delhi, India.
              </p>
            </motion.div>
            <motion.div className="relative" {...fade}>
              <div className="relative rounded-2xl border border-slate-200 shadow-sm bg-gradient-to-br from-indigo-700 via-sky-600 to-emerald-500">
                <div className="aspect-[4/3] w-full flex items-center justify-center p-6">
                  <img
                    src="/ca-hero.jpg"
                    alt="CA India mark"
                    className="max-h-full max-w-full object-contain drop-shadow-xl"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </Section>

      {/* Services */}
      <Section id="services" className="bg-slate-50">
        <Container>
          <motion.div {...fade} className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold">Core Services</h2>
          </motion.div>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((s, i) => (
              <motion.div key={i} {...fade}>
                <Card className="p-6 h-full">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-slate-100">{s.icon}</div>
                    <h3 className="text-lg font-semibold">{s.title}</h3>
                  </div>
                  <ul className="mt-4 text-sm text-slate-600 space-y-2 list-disc list-inside">
                    {s.points.map((p, j) => <li key={j}>{p}</li>)}
                  </ul>
                </Card>
              </motion.div>
            ))}
          </div>
        </Container>
      </Section>

      {/* About */}
      <Section id="about">
        <Container>
          <motion.div {...fade} className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold">About SPV & Associates</h2>
            <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
              We are a Tax & Finance consultancy led by seasoned professionals, specialising in Income Tax, GST and Company Law. Our mission is to bring clarity, compliance and confidence to your finances.
            </p>
          </motion.div>
        </Container>
      </Section>

      
      {/* PAGES MOVED TO ROUTES */}

      <Section id="gst" className="bg-slate-50">
        <Container>
          <motion.div {...fade} className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold">GST</h2>
            <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
              End-to-end GST solutions including registration, monthly/annual returns, audits, and advisory for businesses across India.
            </p>
          </motion.div>
        </Container>
      </Section>

      {/* Corporate Compliances */}
      <Section id="corporate" className="bg-white">
        <Container>
          <motion.div {...fade} className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold">Corporate Compliances</h2>
            <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
              Comprehensive support for ROC filings, board meetings, company incorporations, and secretarial compliances for corporates and LLPs.
            </p>
          </motion.div>
        </Container>
      </Section>
    
      {/* FAQ */}
      <Section id="faq" className="bg-slate-50">
        <Container>
          <motion.div {...fade} className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold">FAQs</h2>
          </motion.div>
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            {FAQS.map((f, i) => (
              <motion.div key={i} {...fade}>
                <Card className="p-6 h-full">
                  <div className="font-semibold">{f.q}</div>
                  <p className="mt-2 text-slate-600 text-sm">{f.a}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Contact */}
      <Section id="contact">
        <Container>
          <motion.div {...fade} className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold">Get in touch</h2>
            <p className="mt-3 text-slate-600">We usually respond within one business day.</p>
            <div className="mt-6 space-y-3 text-slate-700">
              <div className="flex items-center gap-3 justify-center"><Phone className="h-5 w-5"/> <a href="tel:+919811033501" className="hover:underline">+91 98110 33501</a></div>
              <div className="flex items-center gap-3 justify-center"><Mail className="h-5 w-5"/> <a href="mailto:sharad.spv@gmail.com" className="hover:underline">sharad.spv@gmail.com</a></div>
              <div className="flex items-center gap-3 justify-center"><MapPin className="h-5 w-5"/> SPV & Associates, MB-59A, 1st floor, Street no. 2, Master Block, Shakarpur, Delhi - 110092</div>
            </div>
          </motion.div>
        </Container>
      </Section>

      <footer className="border-t border-slate-200 bg-white">
        <Container className="py-10 text-center text-sm text-slate-600">
          <img src="/ca-logo-india.jpg" alt="CA India Logo" className="h-12 mx-auto mb-3"/>
          © {new Date().getFullYear()} SPV & Associates. All rights reserved.
        </Container>
      </footer>
    </div>
  );
}
