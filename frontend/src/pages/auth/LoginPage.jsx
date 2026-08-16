import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import AuthShell from "@/components/auth/AuthShell";
import { googleLoginApi, loginApi } from "@/services/authService";
import { useAuthStore } from "@/stores/useAuthStore";
import { getErrorMessage } from "@/utils/getErrorMessage";

import ReactGA from "@/lib/analytics";

const GOOGLE_SCRIPT_ID = "google-identity-services";


export default function LoginPage() {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const { t } = useTranslation();

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

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (!clientId) {
      return;
    }

    const initializeGoogle = () => {
      if (!window.google?.accounts?.id) return;

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      const buttonContainer = document.getElementById("google-signin-button");

      if (buttonContainer) {
        buttonContainer.innerHTML = "";

        window.google.accounts.id.renderButton(buttonContainer, {
          type: "standard",
          theme: "outline",
          size: "large",
          width: 400,
          text: "continue_with",
          shape: "rectangular",
          logo_alignment: "left",
        });
      }
    };

    const existingScript = document.getElementById(GOOGLE_SCRIPT_ID);

    if (existingScript) {
      initializeGoogle();
      return;
    }

    const script = document.createElement("script");

    script.id = GOOGLE_SCRIPT_ID;
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = initializeGoogle;

    document.body.appendChild(script);

    return () => {
      const buttonContainer = document.getElementById("google-signin-button");

      if (buttonContainer) {
        buttonContainer.innerHTML = "";
      }
    };
  }, []);

  async function handleAuthSuccess(result) {

    const user = result?.data?.user;

    if (!user) {
      setError(t("auth.login.errors.invalidLogin"));
      return;
    }

    setUser(user);

    navigate("/application", { replace: true });
  }

  async function handleGoogleCredentialResponse(response) {
    const credential = response?.credential;

    if (!credential) {
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const result = await googleLoginApi({ credential });
      await handleAuthSuccess(result);
      ReactGA.event("login", {
        method: "google",
      });
    } catch {
      setError(t("auth.login.errors.googleFailed"));
    } finally {
      setIsSubmitting(false);
    }
  }

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
      setError(t("auth.login.errors.emptyFields"));
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const result = await loginApi({
        email: form.email.trim(),
        password: form.password,
      });

      const user = result?.data?.user;

      if (!user) {
        setError(t("auth.login.errors.invalidLogin"));
        return;
      }

      setUser(user);

      ReactGA.event("login", {
        method: "email",
      });

      navigate("/application", { replace: true });
    } catch (requestError) {
      setError(
        getErrorMessage(
          requestError,
          t("auth.login.errors.invalidCredentials"),
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthShell
      eyebrow={t("common.interviewTracker")}
      title={t("auth.login.title")}
      description={t("auth.login.description")}
      footerText={t("auth.login.noAccount")}
      footerLinkLabel={t("auth.login.createAccount")}
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
            {t("common.email")}
          </label>
          <input
            id="login-email"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            placeholder={t("auth.login.emailPlaceholder")}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <label
              htmlFor="login-password"
              className="text-sm font-medium text-slate-700"
            >
              {t("common.password")}
            </label>
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              {t("auth.login.forgotPassword")}
            </button>
          </div>
          <input
            id="login-password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={form.password}
            onChange={handleChange}
            placeholder={t("auth.login.passwordPlaceholder")}
            className={inputClassName}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={submitClassName}
        >
          {isSubmitting ? t("auth.login.submitting") : t("auth.login.submit")}
        </button>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-[0.2em] text-slate-400">
            <span className="bg-white px-3">{t("auth.login.or")}</span>
          </div>
        </div>

        <div id="google-signin-button" className="flex justify-center"></div>
      </form>
    </AuthShell>
  );
}
