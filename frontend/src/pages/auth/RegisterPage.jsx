import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AuthShell from "@/components/auth/AuthShell";
import { registerApi } from "@/services/authService";
import { useAuthStore } from "@/stores/useAuthStore";
import { getErrorMessage } from "@/utils/getErrorMessage";

import ReactGA from "@/lib/analytics";

export default function RegisterPage() {
  const navigate = useNavigate();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  const [form, setForm] = useState({
    fullName: "",
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

    if (!form.fullName.trim() || !form.email.trim() || !form.password.trim()) {
      setError("Please enter your full name, email and password.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const result = await registerApi({
        full_name: form.fullName.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      ReactGA.event("sign_up", {
        method: "email",
      });

      navigate("/login", { replace: true });
    } catch (requestError) {
      console.log("ERROR:", requestError);
      console.log("MESSAGE:", requestError?.message);
      console.log("RESPONSE:", requestError?.response?.data);
      console.log("STATUS:", requestError?.response?.status);

      setError(
        getErrorMessage(
          requestError,
          "Could not create account. Please try again.",
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Interview Tracker"
      title="Create new account"
      description="Start managing your internship with a clear and scalable workspace."
      footerText="Already have an account?"
      footerLinkLabel="Log in"
      footerLinkTo="/login"
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        {error ? (
          <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </p>
        ) : null}

        <div className="space-y-2">
          <label
            htmlFor="register-full-name"
            className="text-sm font-medium text-slate-700 mb-2"
          >
            Full Name
          </label>
          <input
            id="register-full-name"
            name="fullName"
            type="text"
            autoComplete="name"
            value={form.fullName}
            onChange={handleChange}
            placeholder="Nguyen Van A"
            className={inputClassName}
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="register-email"
            className="text-sm font-medium text-slate-700"
          >
            Email
          </label>
          <input
            id="register-email"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@university.edu"
            className={inputClassName}
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="register-password"
            className="text-sm font-medium text-slate-700"
          >
            Password
          </label>
          <input
            id="register-password"
            name="password"
            type="password"
            autoComplete="new-password"
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
          {isSubmitting ? "Creating account..." : "Create account"}
        </button>
      </form>
    </AuthShell>
  );
}
