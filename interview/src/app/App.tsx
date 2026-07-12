import { useState } from "react";
import {
  LayoutDashboard, Trello, Plus, Search, AlertTriangle,
  ArrowRight, Zap, X, Calendar, Filter,
  Star, BarChart2, Target, FileText, User,
  CheckCircle, Clock, TrendingUp, LogOut, Bell,
  ChevronRight, ExternalLink, GripVertical, Shield,
  FolderKanban,
} from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

// ─── Types ────────────────────────────────────────────────────────────────────
type Screen = "landing" | "auth" | "app";
type JobStatus = "Applied" | "Waiting" | "Interview" | "Offer" | "Rejected";
type AuthMode = "login" | "register";
type NavTab = "dashboard" | "kanban";

interface Job {
  id: string;
  company: string;
  position: string;
  status: JobStatus;
  appliedDate: string;
  daysAgo: number;
  notes?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const COLUMNS: { id: JobStatus; label: string; color: string; bg: string }[] = [
  { id: "Applied",   label: "Applied",   color: "#3B82F6", bg: "#EFF6FF" },
  { id: "Waiting",   label: "Waiting",   color: "#F59E0B", bg: "#FFFBEB" },
  { id: "Interview", label: "Interview", color: "#8B5CF6", bg: "#F5F3FF" },
  { id: "Offer",     label: "Offer",     color: "#10B981", bg: "#ECFDF5" },
  { id: "Rejected",  label: "Rejected",  color: "#EF4444", bg: "#FEF2F2" },
];

const INITIAL_JOBS: Job[] = [
  { id: "1",  company: "Stripe",    position: "Software Engineer Intern",    status: "Applied",   appliedDate: "Jun 28", daysAgo: 5 },
  { id: "2",  company: "Airbnb",    position: "Product Design Intern",       status: "Applied",   appliedDate: "Jun 25", daysAgo: 8 },
  { id: "3",  company: "Figma",     position: "Frontend Engineer Intern",    status: "Applied",   appliedDate: "Jul 1",  daysAgo: 2 },
  { id: "4",  company: "Notion",    position: "PM Intern",                   status: "Waiting",   appliedDate: "Jun 20", daysAgo: 13 },
  { id: "5",  company: "Linear",    position: "Software Engineer Intern",    status: "Waiting",   appliedDate: "Jun 18", daysAgo: 15 },
  { id: "6",  company: "Vercel",    position: "DevRel Intern",               status: "Waiting",   appliedDate: "Jun 24", daysAgo: 9 },
  { id: "7",  company: "Google",    position: "STEP Intern",                 status: "Interview", appliedDate: "Jun 10", daysAgo: 23, notes: "Virtual onsite — Jul 8" },
  { id: "8",  company: "Meta",      position: "Software Engineer Intern",    status: "Interview", appliedDate: "Jun 8",  daysAgo: 25, notes: "2nd round — System Design" },
  { id: "9",  company: "Apple",     position: "ML Platform Intern",          status: "Offer",     appliedDate: "May 20", daysAgo: 44, notes: "$52/hr + relocation. Deadline: Jul 10." },
  { id: "10", company: "Amazon",    position: "SDE Intern",                  status: "Rejected",  appliedDate: "Jun 1",  daysAgo: 32 },
  { id: "11", company: "Microsoft", position: "PM Intern",                   status: "Rejected",  appliedDate: "May 28", daysAgo: 36 },
  { id: "12", company: "Spotify",   position: "Data Science Intern",         status: "Rejected",  appliedDate: "Jun 5",  daysAgo: 28 },
];

const FUNNEL_DATA = [
  { label: "Applied",   count: 47, pct: "100%", color: "#3B82F6" },
  { label: "Responded", count: 26, pct: "55%",  color: "#F59E0B" },
  { label: "Interview", count: 13, pct: "28%",  color: "#8B5CF6" },
  { label: "Offer",     count: 2,  pct: "4%",   color: "#10B981" },
];

const REJECTION_DATA = [
  { name: "No Response",       value: 40, color: "#94A3B8" },
  { name: "Technical Screen",  value: 25, color: "#EF4444" },
  { name: "Culture Fit",       value: 15, color: "#F97316" },
  { name: "Position Filled",   value: 12, color: "#F59E0B" },
  { name: "Other",             value: 8,  color: "#8B5CF6" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getCardState(daysAgo: number, status: JobStatus): "normal" | "yellow" | "red" {
  if (status === "Interview" || status === "Offer" || status === "Rejected") return "normal";
  if (daysAgo >= 7) return "red";
  if (daysAgo >= 3) return "yellow";
  return "normal";
}

const COMPANY_COLORS = [
  "bg-blue-100 text-blue-700",
  "bg-violet-100 text-violet-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-indigo-100 text-indigo-700",
  "bg-cyan-100 text-cyan-700",
  "bg-pink-100 text-pink-700",
];

function CompanyInitial({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" }) {
  const idx = name.charCodeAt(0) % COMPANY_COLORS.length;
  const sz = size === "sm" ? "w-7 h-7 text-xs" : size === "lg" ? "w-11 h-11 text-base" : "w-9 h-9 text-sm";
  return (
    <div className={`${sz} ${COMPANY_COLORS[idx]} rounded-xl flex items-center justify-center font-semibold flex-shrink-0`}
      style={{ fontFamily: "'DM Mono', monospace" }}>
      {name[0]}
    </div>
  );
}

// ─── Landing Page ─────────────────────────────────────────────────────────────
function LandingPage({ onGetStarted, onSignIn }: { onGetStarted: () => void; onSignIn: () => void }) {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-black/[0.06]">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
              <FolderKanban size={14} className="text-white" />
            </div>
            <span className="font-semibold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              InterTrack
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={onSignIn}
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors px-3 py-1.5">
              Sign in
            </button>
            <button onClick={onGetStarted}
              className="text-sm bg-indigo-600 text-white px-4 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors font-medium">
              Get started free
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16">
        <div className="text-center mb-6">
          <span className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 text-xs font-medium px-3 py-1 rounded-full mb-6">
            <Star size={10} fill="currentColor" /> Built for university students
          </span>
          <h1 className="text-5xl font-extrabold text-gray-900 leading-[1.1] tracking-tight mb-5"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Never miss an internship<br />
            <span className="text-indigo-600">follow-up again.</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto mb-8 leading-relaxed">
            Track applications, visualize your recruitment funnel, and get
            timely reminders — all in one clean workspace designed for the modern job hunt.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button onClick={onGetStarted}
              className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-all font-semibold shadow-lg shadow-indigo-200 text-sm">
              Start tracking for free <ArrowRight size={15} />
            </button>
            <button onClick={onSignIn}
              className="text-sm text-gray-600 px-6 py-3 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors font-medium">
              Sign in
            </button>
          </div>
        </div>

        {/* App preview */}
        <div className="mt-14 rounded-2xl border border-black/[0.08] shadow-2xl shadow-black/[0.08] overflow-hidden bg-gray-50">
          {/* Window bar */}
          <div className="bg-white border-b border-black/[0.06] px-4 py-3 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <div className="flex-1 flex justify-center">
              <div className="bg-gray-100 rounded-md px-16 py-1 text-xs text-gray-400">
                app.intertrack.io
              </div>
            </div>
          </div>
          {/* Mini kanban preview */}
          <div className="p-5 flex gap-3 overflow-x-auto">
            {[
              { label: "Applied", color: "#3B82F6", items: ["Stripe · SWE Intern", "Figma · Frontend Intern"] },
              { label: "Waiting", color: "#F59E0B", items: ["Notion · PM Intern", "Linear · SWE Intern"], warn: true },
              { label: "Interview", color: "#8B5CF6", items: ["Google · STEP Intern", "Meta · SWE Intern"] },
              { label: "Offer", color: "#10B981", items: ["Apple · ML Intern"] },
              { label: "Rejected", color: "#EF4444", items: ["Amazon · SDE Intern"] },
            ].map((col) => (
              <div key={col.label} className="flex-shrink-0 w-44">
                <div className="flex items-center gap-1.5 mb-2 px-1">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: col.color }} />
                  <span className="text-xs font-semibold text-gray-700">{col.label}</span>
                  <span className="text-xs text-gray-400 ml-auto">{col.items.length}</span>
                </div>
                <div className="space-y-2">
                  {col.items.map((item, i) => (
                    <div key={i}
                      className="bg-white rounded-xl p-3 shadow-sm text-xs"
                      style={{
                        border: col.warn && i === 0
                          ? "1.5px solid #FCD34D"
                          : "1px solid rgba(0,0,0,0.07)"
                      }}>
                      <div className="font-semibold text-gray-800 text-[11px]">{item.split("·")[0]}</div>
                      <div className="text-gray-400 mt-0.5 text-[10px]">{item.split("·")[1]}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-gray-50 border-y border-black/[0.06] py-10">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-3 gap-8 text-center">
          {[
            { value: "12,000+", label: "Applications tracked" },
            { value: "3,400+", label: "Students onboarded" },
            { value: "68%", label: "Avg. response rate improvement" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-bold text-gray-900 mb-1"
                style={{ fontFamily: "'DM Mono', monospace" }}>{s.value}</div>
              <div className="text-sm text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Everything you need, nothing you don't
          </h2>
          <p className="text-gray-500">The focused toolkit for a sharper job search.</p>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {[
            {
              icon: <Trello size={20} className="text-indigo-600" />,
              title: "Visual Kanban Board",
              desc: "Drag cards between Applied, Waiting, Interview, Offer, and Rejected. Know exactly where every application stands.",
            },
            {
              icon: <AlertTriangle size={20} className="text-amber-500" />,
              title: "Smart Follow-up Alerts",
              desc: "Cards turn yellow after 3 days and red after 7 days of silence. Never let a hot lead go cold.",
            },
            {
              icon: <BarChart2 size={20} className="text-violet-600" />,
              title: "Recruitment Funnel Analytics",
              desc: "See your conversion rates at every stage. Understand where you drop off and fix it faster.",
            },
            {
              icon: <Zap size={20} className="text-emerald-600" />,
              title: "One-click Job Logging",
              desc: "Add a new application in under 10 seconds with the Quick Add modal, always accessible from the sidebar.",
            },
            {
              icon: <Target size={20} className="text-rose-500" />,
              title: "Rejection Insights",
              desc: "A pie chart breaks down why you're being rejected so you can address the real bottleneck.",
            },
            {
              icon: <Shield size={20} className="text-blue-600" />,
              title: "Private by default",
              desc: "Your data is yours. No recruiters, no third-party sharing, no algorithm selling your job search.",
            },
          ].map((f) => (
            <div key={f.title}
              className="bg-white rounded-2xl p-6 border border-black/[0.07] hover:shadow-md transition-shadow">
              <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center mb-4">
                {f.icon}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 text-sm"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {f.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-indigo-600 py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-white text-center mb-10"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Students who landed their dream internship
          </h2>
          <div className="grid grid-cols-3 gap-5">
            {[
              {
                name: "Anya Patel",
                school: "UC Berkeley · CS",
                company: "Stripe",
                quote: "InterTrack's follow-up alerts helped me send a timely email that turned a ghosted application into an onsite interview.",
              },
              {
                name: "Marcus Chen",
                school: "Georgia Tech · CE",
                company: "Google",
                quote: "I was tracking 60+ applications in a spreadsheet. Switching to InterTrack cut my admin time in half and kept me sane.",
              },
              {
                name: "Priya Nair",
                school: "UT Austin · MIS",
                company: "Airbnb",
                quote: "The funnel chart showed me I had a terrible response rate but great interview-to-offer rate. It changed how I write cold emails.",
              },
            ].map((t) => (
              <div key={t.name} className="bg-white/10 backdrop-blur rounded-2xl p-5">
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} className="text-yellow-300" fill="currentColor" />
                  ))}
                </div>
                <p className="text-white/90 text-sm leading-relaxed mb-4">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <CompanyInitial name={t.name} size="sm" />
                  <div>
                    <div className="text-white text-xs font-semibold">{t.name}</div>
                    <div className="text-white/60 text-xs">{t.school} · Now at {t.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 py-20 text-center">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-4"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Your next internship starts with<br />staying organized.
        </h2>
        <p className="text-gray-500 mb-8">Free forever for students. No credit card required.</p>
        <button onClick={onGetStarted}
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-xl hover:bg-indigo-700 transition-all font-semibold shadow-lg shadow-indigo-200 text-base">
          Get started — it's free <ArrowRight size={17} />
        </button>
      </section>

      {/* Footer */}
      <footer className="border-t border-black/[0.06] py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center">
              <FolderKanban size={11} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-700"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              InterTrack
            </span>
          </div>
          <p className="text-xs text-gray-400">© 2026 InterTrack · Built for students, by students.</p>
        </div>
      </footer>
    </div>
  );
}

// ─── Auth Page ────────────────────────────────────────────────────────────────
function AuthPage({
  mode,
  onToggleMode,
  onAuth,
}: {
  mode: AuthMode;
  onToggleMode: () => void;
  onAuth: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onAuth();
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6"
      style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-600 mb-4 shadow-lg shadow-indigo-200">
            <FolderKanban size={22} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {mode === "login" ? "Welcome back" : "Create account"}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {mode === "login"
              ? "Sign in to your InterTrack workspace"
              : "Start tracking your internship applications"}
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl border border-black/[0.08] shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Anya Patel"
                  className="w-full bg-gray-50 border border-black/[0.08] rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="anya@university.edu"
                className="w-full bg-gray-50 border border-black/[0.08] rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-gray-50 border border-black/[0.08] rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition"
              />
            </div>
            {mode === "login" && (
              <div className="text-right">
                <button type="button" className="text-xs text-indigo-600 hover:underline">
                  Forgot password?
                </button>
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200 mt-1">
              {mode === "login" ? "Sign in" : "Create account"}
            </button>
          </form>

          <div className="mt-5 pt-5 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500">
              {mode === "login" ? "Don't have an account?" : "Already have an account?"}
              {" "}
              <button onClick={onToggleMode} className="text-indigo-600 font-medium hover:underline">
                {mode === "login" ? "Sign up free" : "Sign in"}
              </button>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-5">
          Free forever for students · No credit card required
        </p>
      </div>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({
  activeTab,
  onNav,
  onQuickAdd,
  onSignOut,
}: {
  activeTab: NavTab;
  onNav: (tab: NavTab) => void;
  onQuickAdd: () => void;
  onSignOut: () => void;
}) {
  const navItems = [
    { id: "dashboard" as NavTab, label: "Dashboard", icon: <LayoutDashboard size={16} /> },
    { id: "kanban" as NavTab, label: "Kanban Board", icon: <Trello size={16} /> },
  ];

  return (
    <aside
      className="w-56 flex-shrink-0 bg-white border-r border-black/[0.07] flex flex-col h-screen sticky top-0"
      style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Logo */}
      <div className="px-5 h-14 flex items-center gap-2.5 border-b border-black/[0.06]">
        <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center shadow-sm">
          <FolderKanban size={13} className="text-white" />
        </div>
        <span className="font-bold text-gray-900 text-sm"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          InterTrack
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNav(item.id)}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all ${
              activeTab === item.id
                ? "bg-indigo-50 text-indigo-700 font-medium"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}>
            <span className={activeTab === item.id ? "text-indigo-600" : "text-gray-400"}>
              {item.icon}
            </span>
            {item.label}
          </button>
        ))}

        <div className="pt-3 pb-1">
          <div className="h-px bg-gray-100" />
        </div>

        {/* Quick Add Job */}
        <button
          onClick={onQuickAdd}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200">
          <Plus size={15} />
          Quick Add Job
        </button>
      </nav>

      {/* User */}
      <div className="px-3 pb-4 border-t border-black/[0.06] pt-3 space-y-0.5">
        <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors">
          <Bell size={15} className="text-gray-400" />
          Notifications
        </button>
        <button
          onClick={onSignOut}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors">
          <LogOut size={15} className="text-gray-400" />
          Sign out
        </button>
        <div className="flex items-center gap-2.5 px-3 py-2 mt-1">
          <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center">
            <User size={13} className="text-indigo-600" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-medium text-gray-900 truncate">Anya Patel</div>
            <div className="text-xs text-gray-400 truncate">UC Berkeley</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

// ─── Dashboard Screen ─────────────────────────────────────────────────────────
function ConversionFunnel() {
  const max = FUNNEL_DATA[0].count;
  return (
    <div className="space-y-3">
      {FUNNEL_DATA.map((row, i) => {
        const width = (row.count / max) * 100;
        const conv = i === 0 ? null : Math.round((row.count / FUNNEL_DATA[i - 1].count) * 100);
        return (
          <div key={row.label} className="flex items-center gap-3">
            <div className="w-20 text-right text-xs text-gray-400 font-medium">{row.label}</div>
            <div className="flex-1 flex justify-center">
              <div
                className="h-9 rounded-xl flex items-center justify-center gap-2 text-white text-xs font-semibold transition-all"
                style={{ width: `${width}%`, backgroundColor: row.color, minWidth: 72 }}>
                <span style={{ fontFamily: "'DM Mono', monospace" }}>{row.count}</span>
              </div>
            </div>
            <div className="w-12 text-xs font-medium" style={{ color: row.color, fontFamily: "'DM Mono', monospace" }}>
              {conv !== null ? `${conv}%` : row.pct}
            </div>
          </div>
        );
      })}
    </div>
  );
}

const CUSTOM_TOOLTIP = ({ active, payload }: { active?: boolean; payload?: { name: string; value: number; payload: { color: string } }[] }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-black/[0.08] rounded-xl px-3 py-2 shadow-lg text-xs">
        <span className="font-semibold text-gray-900">{payload[0].name}</span>
        <span className="ml-2 text-gray-500">{payload[0].value}%</span>
      </div>
    );
  }
  return null;
};

function DashboardScreen({ jobs, onQuickAdd }: { jobs: Job[]; onQuickAdd: () => void }) {
  const urgent = jobs.filter((j) => {
    const state = getCardState(j.daysAgo, j.status);
    return state !== "normal";
  }).sort((a, b) => b.daysAgo - a.daysAgo);

  const stats = [
    { label: "Total Applications", value: "47", sub: "this semester", icon: <FolderKanban size={16} />, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Interview Rate", value: "28%", sub: "13 interviews", icon: <TrendingUp size={16} />, color: "text-violet-600", bg: "bg-violet-50" },
    { label: "Offer Rate", value: "4%", sub: "2 offers", icon: <CheckCircle size={16} />, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Rejection Rate", value: "40%", sub: "19 rejections", icon: <Clock size={16} />, color: "text-rose-600", bg: "bg-rose-50" },
  ];

  return (
    <div className="flex-1 overflow-auto p-6 space-y-6" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Good morning, Anya 👋
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Here's your internship search overview.</p>
        </div>
        <button onClick={onQuickAdd}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200">
          <Plus size={15} /> Add Job
        </button>
      </div>

      {/* Urgent Actions */}
      {urgent.length > 0 && (
        <div className="bg-white rounded-2xl border border-amber-200 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 bg-amber-50 border-b border-amber-100">
            <AlertTriangle size={14} className="text-amber-500" />
            <span className="text-sm font-semibold text-amber-800">
              Urgent Actions — {urgent.length} applications need follow-up
            </span>
          </div>
          <div className="divide-y divide-gray-50">
            {urgent.slice(0, 5).map((job) => {
              const state = getCardState(job.daysAgo, job.status);
              return (
                <div key={job.id} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <CompanyInitial name={job.company} size="sm" />
                    <div>
                      <span className="text-sm font-medium text-gray-900">{job.company}</span>
                      <span className="text-gray-400 mx-1.5">·</span>
                      <span className="text-sm text-gray-500">{job.position}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        state === "red"
                          ? "bg-red-50 text-red-600"
                          : "bg-amber-50 text-amber-600"
                      }`}
                      style={{ fontFamily: "'DM Mono', monospace" }}>
                      {job.daysAgo}d no response
                    </span>
                    <button className="text-xs font-medium text-indigo-600 hover:underline flex items-center gap-1">
                      Follow up <ChevronRight size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Stats cards */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label}
            className="bg-white rounded-2xl border border-black/[0.07] p-5 shadow-sm">
            <div className={`w-8 h-8 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
              <span className={s.color}>{s.icon}</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-0.5"
              style={{ fontFamily: "'DM Mono', monospace" }}>
              {s.value}
            </div>
            <div className="text-xs text-gray-500">{s.label}</div>
            <div className="text-xs text-gray-400 mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-5">
        {/* Funnel */}
        <div className="bg-white rounded-2xl border border-black/[0.07] p-5 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-semibold text-gray-900"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Conversion Funnel
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">Applied → Offer pipeline</p>
            </div>
            <BarChart2 size={15} className="text-gray-300" />
          </div>
          <ConversionFunnel />
        </div>

        {/* Pie chart */}
        <div className="bg-white rounded-2xl border border-black/[0.07] p-5 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-semibold text-gray-900"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Rejection Reasons
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">Based on 19 rejections</p>
            </div>
            <Target size={15} className="text-gray-300" />
          </div>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie
                  data={REJECTION_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={42}
                  outerRadius={72}
                  paddingAngle={2}
                  dataKey="value">
                  {REJECTION_DATA.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CUSTOM_TOOLTIP />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {REJECTION_DATA.map((d) => (
                <div key={d.name} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                  <span className="text-xs text-gray-600 flex-1 truncate">{d.name}</span>
                  <span className="text-xs font-medium text-gray-900"
                    style={{ fontFamily: "'DM Mono', monospace" }}>
                    {d.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent activity */}
      <div className="bg-white rounded-2xl border border-black/[0.07] p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-900 mb-4"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Recent Applications
        </h2>
        <div className="space-y-1">
          {jobs.slice(0, 6).map((job) => {
            const col = COLUMNS.find((c) => c.id === job.status)!;
            return (
              <div key={job.id}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <CompanyInitial name={job.company} size="sm" />
                  <div>
                    <span className="text-sm font-medium text-gray-900">{job.company}</span>
                    <span className="text-gray-400 mx-1.5 text-xs">·</span>
                    <span className="text-xs text-gray-500">{job.position}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">{job.appliedDate}</span>
                  <span
                    className="text-xs font-medium px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: col.bg, color: col.color }}>
                    {job.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Kanban Card ──────────────────────────────────────────────────────────────
function KanbanCard({
  job,
  onDragStart,
}: {
  job: Job;
  onDragStart: (id: string) => void;
}) {
  const state = getCardState(job.daysAgo, job.status);

  let borderStyle = "1px solid rgba(0,0,0,0.08)";
  if (state === "yellow") borderStyle = "1.5px solid #FCD34D";
  if (state === "red") borderStyle = "1.5px solid #FCA5A5";

  let bgExtra = "";
  if (state === "yellow") bgExtra = "bg-amber-50/40";
  if (state === "red") bgExtra = "bg-red-50/40";

  return (
    <div
      draggable
      onDragStart={() => onDragStart(job.id)}
      className={`bg-white rounded-xl p-3.5 shadow-sm cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow select-none ${bgExtra}`}
      style={{ border: borderStyle }}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <CompanyInitial name={job.company} size="sm" />
          <div className="min-w-0">
            <div className="text-sm font-semibold text-gray-900 truncate">{job.company}</div>
            <div className="text-xs text-gray-500 truncate">{job.position}</div>
          </div>
        </div>
        {state === "red" && (
          <AlertTriangle size={13} className="text-red-400 flex-shrink-0 mt-0.5" />
        )}
      </div>
      {job.notes && (
        <p className="text-xs text-gray-400 mb-2 leading-relaxed line-clamp-2 pl-9">{job.notes}</p>
      )}
      <div className="flex items-center justify-between pl-9">
        <div className="flex items-center gap-1 text-gray-400">
          <Calendar size={11} />
          <span className="text-xs" style={{ fontFamily: "'DM Mono', monospace" }}>{job.appliedDate}</span>
        </div>
        {state !== "normal" && (
          <span
            className={`text-xs px-1.5 py-0.5 rounded-md font-medium ${
              state === "red" ? "text-red-500 bg-red-50" : "text-amber-600 bg-amber-50"
            }`}
            style={{ fontFamily: "'DM Mono', monospace" }}>
            {job.daysAgo}d
          </span>
        )}
      </div>
      <div className="mt-2 pl-9 opacity-0 group-hover:opacity-100">
        <GripVertical size={12} className="text-gray-300" />
      </div>
    </div>
  );
}

// ─── Kanban Board ─────────────────────────────────────────────────────────────
function KanbanScreen({
  jobs,
  setJobs,
  onQuickAdd,
}: {
  jobs: Job[];
  setJobs: (jobs: Job[]) => void;
  onQuickAdd: () => void;
}) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<JobStatus | "All">("All");
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<JobStatus | null>(null);

  function handleDragStart(id: string) {
    setDraggedId(id);
  }

  function handleDragOver(e: React.DragEvent, colId: JobStatus) {
    e.preventDefault();
    setDragOverCol(colId);
  }

  function handleDrop(colId: JobStatus) {
    if (!draggedId) return;
    setJobs(jobs.map((j) => (j.id === draggedId ? { ...j, status: colId } : j)));
    setDraggedId(null);
    setDragOverCol(null);
  }

  function handleDragLeave() {
    setDragOverCol(null);
  }

  const filteredJobs = jobs.filter((j) => {
    const matchSearch =
      !search ||
      j.company.toLowerCase().includes(search.toLowerCase()) ||
      j.position.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filterStatus === "All" || j.status === filterStatus;
    return matchSearch && matchFilter;
  });

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Top bar */}
      <div className="flex items-center gap-3 px-6 py-4 bg-white border-b border-black/[0.06]">
        <div className="flex-1 flex items-center gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search company or position…"
              className="bg-gray-50 border border-black/[0.08] rounded-xl pl-9 pr-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 w-64 transition"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <Filter size={13} className="text-gray-400" />
            <span className="text-xs text-gray-500">Filter:</span>
            {(["All", ...COLUMNS.map((c) => c.id)] as (JobStatus | "All")[]).map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`text-xs px-2.5 py-1 rounded-lg transition-all font-medium ${
                  filterStatus === s
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}>
                {s}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={onQuickAdd}
          className="flex items-center gap-1.5 bg-indigo-600 text-white px-3.5 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200">
          <Plus size={14} /> Add Job
        </button>
      </div>

      {/* Columns */}
      <div className="flex-1 overflow-x-auto p-5">
        <div className="flex gap-4 h-full min-w-max">
          {COLUMNS.map((col) => {
            const colJobs = filteredJobs.filter((j) => j.status === col.id);
            const isOver = dragOverCol === col.id;
            return (
              <div
                key={col.id}
                className="w-60 flex-shrink-0 flex flex-col"
                onDragOver={(e) => handleDragOver(e, col.id)}
                onDrop={() => handleDrop(col.id)}
                onDragLeave={handleDragLeave}>
                {/* Column header */}
                <div
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl mb-3"
                  style={{ backgroundColor: col.bg }}>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: col.color }} />
                    <span className="text-xs font-semibold text-gray-800">{col.label}</span>
                  </div>
                  <span
                    className="text-xs font-medium rounded-full px-2 py-0.5 text-white"
                    style={{ backgroundColor: col.color, fontFamily: "'DM Mono', monospace" }}>
                    {colJobs.length}
                  </span>
                </div>

                {/* Drop zone */}
                <div
                  className={`flex-1 flex flex-col gap-2.5 min-h-32 rounded-2xl transition-all p-1 -m-1 ${
                    isOver ? "bg-indigo-50/60 ring-2 ring-indigo-300 ring-dashed" : ""
                  }`}>
                  {colJobs.map((job) => (
                    <KanbanCard key={job.id} job={job} onDragStart={handleDragStart} />
                  ))}
                  {colJobs.length === 0 && !isOver && (
                    <div className="flex-1 flex items-center justify-center text-xs text-gray-300 py-6">
                      No applications
                    </div>
                  )}
                  {isOver && (
                    <div className="h-16 rounded-xl border-2 border-dashed border-indigo-300 flex items-center justify-center">
                      <span className="text-xs text-indigo-400 font-medium">Drop here</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Add Job Modal ────────────────────────────────────────────────────────────
function AddJobModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (job: Job) => void;
}) {
  const [form, setForm] = useState({
    company: "",
    position: "",
    appliedDate: new Date().toISOString().split("T")[0],
    url: "",
    notes: "",
    status: "Applied" as JobStatus,
  });

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.company || !form.position) return;
    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const d = new Date(form.appliedDate);
    const dateLabel = `${monthNames[d.getMonth()]} ${d.getDate()}`;
    onSave({
      id: Date.now().toString(),
      company: form.company,
      position: form.position,
      status: form.status,
      appliedDate: dateLabel,
      daysAgo: 0,
      notes: form.notes || undefined,
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ fontFamily: "'Inter', sans-serif" }}>
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md border border-black/[0.08]">
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center">
              <FolderKanban size={14} className="text-indigo-600" />
            </div>
            <h2 className="font-semibold text-gray-900 text-sm"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Add New Application
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors">
            <X size={14} className="text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Company Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                placeholder="Stripe"
                required
                className="w-full bg-gray-50 border border-black/[0.08] rounded-xl px-3.5 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Position <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.position}
                onChange={(e) => setForm({ ...form, position: e.target.value })}
                placeholder="SWE Intern"
                required
                className="w-full bg-gray-50 border border-black/[0.08] rounded-xl px-3.5 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Apply Date</label>
              <div className="relative">
                <Calendar size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  value={form.appliedDate}
                  onChange={(e) => setForm({ ...form, appliedDate: e.target.value })}
                  className="w-full bg-gray-50 border border-black/[0.08] rounded-xl pl-9 pr-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Initial Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as JobStatus })}
                className="w-full bg-gray-50 border border-black/[0.08] rounded-xl px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition">
                {COLUMNS.map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              <span className="flex items-center gap-1.5">
                <ExternalLink size={11} /> Job URL
              </span>
            </label>
            <input
              type="url"
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              placeholder="https://careers.stripe.com/..."
              className="w-full bg-gray-50 border border-black/[0.08] rounded-xl px-3.5 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              <span className="flex items-center gap-1.5">
                <FileText size={11} /> Notes
              </span>
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Referral from Alex · Deadline Jul 15 · Role requires React + TypeScript"
              rows={3}
              className="w-full bg-gray-50 border border-black/[0.08] rounded-xl px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 font-medium rounded-xl hover:bg-gray-100 transition-colors">
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200">
              <CheckCircle size={14} /> Save Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── App Layout ───────────────────────────────────────────────────────────────
function AppLayout({
  jobs,
  setJobs,
  onSignOut,
}: {
  jobs: Job[];
  setJobs: (jobs: Job[]) => void;
  onSignOut: () => void;
}) {
  const [activeTab, setActiveTab] = useState<NavTab>("dashboard");
  const [showModal, setShowModal] = useState(false);

  function handleAddJob(job: Job) {
    setJobs([job, ...jobs]);
  }

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Sidebar
        activeTab={activeTab}
        onNav={setActiveTab}
        onQuickAdd={() => setShowModal(true)}
        onSignOut={onSignOut}
      />
      {activeTab === "dashboard" ? (
        <DashboardScreen jobs={jobs} onQuickAdd={() => setShowModal(true)} />
      ) : (
        <KanbanScreen jobs={jobs} setJobs={setJobs} onQuickAdd={() => setShowModal(true)} />
      )}
      {showModal && (
        <AddJobModal onClose={() => setShowModal(false)} onSave={handleAddJob} />
      )}
    </div>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);

  function goToAuth(mode: AuthMode = "register") {
    setAuthMode(mode);
    setScreen("auth");
  }

  if (screen === "landing") {
    return (
      <LandingPage
        onGetStarted={() => goToAuth("register")}
        onSignIn={() => goToAuth("login")}
      />
    );
  }

  if (screen === "auth") {
    return (
      <AuthPage
        mode={authMode}
        onToggleMode={() => setAuthMode(authMode === "login" ? "register" : "login")}
        onAuth={() => setScreen("app")}
      />
    );
  }

  return (
    <AppLayout
      jobs={jobs}
      setJobs={setJobs}
      onSignOut={() => setScreen("landing")}
    />
  );
}
