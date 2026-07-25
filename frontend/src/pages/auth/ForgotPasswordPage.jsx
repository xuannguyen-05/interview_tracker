import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AuthShell from "@/components/auth/AuthShell";
import { forgotPasswordApi } from "@/services/authService";
import { getErrorMessage } from "@/utils/getErrorMessage";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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

    if (!form.email.trim()) {
      setError("Please enter your email.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      await forgotPasswordApi({
        email: form.email.trim(),
      });

      setIsSuccess(true);
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Failed to send reset link. Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSuccess) {
    return (
      <AuthShell
        eyebrow="Interview Tracker"
        title="Check your email"
        description="We've sent a password reset link to your email. Please check your inbox and follow the instructions."
        footerText="Remember your password?"
        footerLinkLabel="Back to login"
        footerLinkTo="/login"
      >
        <div className="flex flex-col items-center justify-center py-8">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-8 w-8 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <p className="text-center text-sm text-slate-600">
            The link will expire in 15 minutes.
          </p>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      eyebrow="Interview Tracker"
      title="Reset your password"
      description="Enter your email address and we'll send you a link to reset your password."
      footerText="Remember your password?"
      footerLinkLabel="Back to login"
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
            htmlFor="forgot-email"
            className="text-sm font-medium text-slate-700"
          >
            Email
          </label>
          <input
            id="forgot-email"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@university.edu"
            className={inputClassName}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={submitClassName}
        >
          {isSubmitting ? "Sending..." : "Send reset link"}
        </button>
      </form>
    </AuthShell>
  );
}
