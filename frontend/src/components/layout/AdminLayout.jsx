import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  LogOut,
  ShieldCheck
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/stores/useAuthStore";
import Brand from "@/components/common/Brand";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import { toastService } from "@/services/toastService";
import http from "@/services/http";
import { socket } from "@/socket/socket";

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const [activeSection, setActiveSection] = useState("overview");

  const fullName = user?.full_name?.trim() || "Admin";
  const email = user?.email?.trim() || "admin@example.com";
  const avatarInitial = fullName[0]?.toUpperCase() || "A";

  // ScrollSpy: Tự động đổi highlight active của sidebar khi cuộn trang
  useEffect(() => {
    const handleScroll = () => {
      const usersEl = document.getElementById("users-section");
      const jobStatsEl = document.getElementById("job-stats");
      const overviewEl = document.getElementById("overview");

      if (!overviewEl) return;

      const offset = 220; // Khoảng cách nhận diện bên dưới header

      if (usersEl && usersEl.getBoundingClientRect().top <= offset) {
        setActiveSection("users-section");
      } else if (jobStatsEl && jobStatsEl.getBoundingClientRect().top <= offset) {
        setActiveSection("job-stats");
      } else {
        setActiveSection("overview");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    const mainEl = document.querySelector("main");
    if (mainEl) {
      mainEl.addEventListener("scroll", handleScroll, { passive: true });
    }

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (mainEl) {
        mainEl.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  async function handleSignOut() {
    try {
      socket.disconnect();
      await http.post("/auth/logout");
      toastService.showByModule("auth", "logout", "success");
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  const scrollToSection = (id) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f6f8] text-slate-900">
      <div className="relative flex min-h-screen flex-col">
        {/* Header */}
        <header className="sticky top-0 z-20 border-b border-black/[0.06] bg-white/95 backdrop-blur-sm">
          <div className="flex h-[68px] items-center justify-between gap-4 px-5 lg:px-6">
            <div className="flex items-center gap-3">
              <Brand to="/admin" />
              <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-bold text-purple-700 ring-1 ring-inset ring-purple-600/20">
                <ShieldCheck className="h-3.5 w-3.5" />
                {t("admin.badge")}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <LanguageSwitcher />
            </div>
          </div>
        </header>

        {/* Body with Sidebar */}
        <div className="relative flex min-h-0 flex-1">
          {/* Fixed Sidebar container (Zero in-flow width) */}
          <div className="fixed left-0 top-[68px] bottom-0 z-10 h-[calc(100vh-68px)]">
            <aside className="hidden h-full w-[250px] shrink-0 flex-col border-r border-black/[0.06] bg-white lg:flex">
              <div className="px-5 pt-4 pb-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  {t("admin.systemAdmin")}
                </p>
              </div>

              {/* Dedicated Navigation for Admin */}
              <nav className="flex flex-1 flex-col gap-2 px-5 pt-2">
                <button
                  type="button"
                  onClick={() => scrollToSection("overview")}
                  className={`flex w-full items-center gap-3.5 rounded-2xl px-4 py-3.5 text-left text-[14px] font-semibold transition-all duration-200 ${
                    activeSection === "overview"
                      ? "bg-indigo-50 text-indigo-700 shadow-sm"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                  }`}
                >
                  <LayoutDashboard className={`h-5 w-5 transition-colors ${activeSection === "overview" ? "text-indigo-600" : "text-slate-400"}`} />
                  {t("admin.overview")}
                </button>

                <button
                  type="button"
                  onClick={() => scrollToSection("job-stats")}
                  className={`flex w-full items-center gap-3.5 rounded-2xl px-4 py-3.5 text-left text-[14px] font-semibold transition-all duration-200 ${
                    activeSection === "job-stats"
                      ? "bg-indigo-50 text-indigo-700 shadow-sm"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                  }`}
                >
                  <Briefcase className={`h-5 w-5 transition-colors ${activeSection === "job-stats" ? "text-indigo-600" : "text-slate-400"}`} />
                  {t("admin.jobStats")}
                </button>

                <button
                  type="button"
                  onClick={() => scrollToSection("users-section")}
                  className={`flex w-full items-center gap-3.5 rounded-2xl px-4 py-3.5 text-left text-[14px] font-semibold transition-all duration-200 ${
                    activeSection === "users-section"
                      ? "bg-indigo-50 text-indigo-700 shadow-sm"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                  }`}
                >
                  <Users className={`h-5 w-5 transition-colors ${activeSection === "users-section" ? "text-indigo-600" : "text-slate-400"}`} />
                  {t("admin.userManagement")}
                </button>
              </nav>

              {/* Bottom user card & Sign out */}
              <div className="mt-auto border-t border-black/[0.06] p-5">
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-3 py-2 text-sm font-medium text-slate-600 transition hover:text-rose-600"
                >
                  <LogOut className="h-4 w-4 text-slate-400" />
                  {t("admin.signOut")}
                </button>

                <div className="mt-4 flex items-center gap-3 rounded-2xl bg-slate-50 p-2.5">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-purple-600 text-sm font-bold text-white shadow-sm">
                    {avatarInitial}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="truncate text-sm font-bold text-slate-900">
                        {fullName}
                      </p>
                      <span className="rounded bg-purple-100 px-1.5 py-0.2 text-[10px] font-extrabold text-purple-700">
                        ADMIN
                      </span>
                    </div>
                    <p className="truncate text-xs text-slate-400">{email}</p>
                  </div>
                </div>
              </div>
            </aside>
          </div>

          {/* Main content (starts immediately after the 250px sidebar) */}
          <main className="ml-0 min-w-0 flex-1 overflow-y-auto lg:ml-[250px]">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
