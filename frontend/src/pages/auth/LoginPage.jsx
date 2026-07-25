import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AuthShell from "@/components/auth/AuthShell";
import { loginApi } from "@/services/authService";
import { useAuthStore } from "@/stores/useAuthStore";
import { getErrorMessage } from "@/utils/getErrorMessage";

import ReactGA from "@/lib/analytics";

export default function LoginPage() {
  const navigate = useNavigate();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setUser = useAuthStore((state) => state.setUser);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputClassName =
    "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100";
  const submitClassName =
    "w-full rounded-2xl bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70";

  function handleChange(event) {
    const { name, value } = event.target;

    // Controlled form: field nào đổi thì cập nhật đúng field đó trong state.
    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.email.trim() || !form.password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const result = await loginApi({
        email: form.email.trim(),
        password: form.password,
      });

      const accessToken = result?.data?.accessToken;
      const user = result?.data?.user;

      if (!accessToken) {
        setError("Invalid login. Please try again.");
        return;
      }

      setAccessToken(accessToken);
      setUser(user ?? null);

      ReactGA.event("login", {
        method: "email",
      });

      navigate("/application", { replace: true });
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Invalid email or password."));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Interview Tracker"
      title="Log in to your account"
      description="Track applications, interviews, and follow-ups in one organized workspace."
      footerText="Don't have an account?"
      footerLinkLabel="Create account"
      footerLinkTo="/register"
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        {error ? (
          <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </p>
        ) : null}

        <div className="space-y-2">
          <label
            htmlFor="login-email"
            className="text-sm font-medium text-slate-700"
          >
            Email
          </label>
          <input
            id="login-email"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@university.edu"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <label
              htmlFor="login-password"
              className="text-sm font-medium text-slate-700"
            >
              Password
            </label>
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              Forgot password?
            </button>
          </div>
          <input
            id="login-password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
            className={inputClassName}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={submitClassName}
        >
          {isSubmitting ? "Logging in..." : "Log in"}
        </button>
      </form>
    </AuthShell>
  );
}
