import { Link } from "react-router-dom";
import logo from "@/assets/job-interview.png";

export default function Brand({ to = "/", size = "default" }) {
  const isLarge = size === "large";

  return (
    <Link
      to={to}
      className="group inline-flex items-center gap-2.5 transition-all duration-200 hover:opacity-90"
    >
      <div className="rounded-xl bg-white p-1 shadow-sm ring-1 ring-slate-200 transition-transform duration-300 group-hover:scale-105">
        <img
          src={logo}
          alt="Interview Tracker"
          className={isLarge ? "h-10 w-10" : "h-8 w-8"}
        />
      </div>

      <span
        className={
          isLarge
            ? "text-xl font-bold tracking-tight"
            : "text-[17px] font-bold tracking-tight"
        }
      >
        <span className="text-slate-900">Interview</span>{" "}
        <span className="text-blue-600">Tracker</span>
      </span>
    </Link>
  );
}
