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
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setUser = useAuthStore((state) => state.setUser);
  const { t } = useTranslation();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleReady, setIsGoogleReady] = useState(false);

  const inputClassName =
    "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100";
  const submitClassName =
    "w-full rounded-2xl bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70";
  const googleButtonClassName =
    "flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-700 transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-sm active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-70";

  function handleGooglePrompt() {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (!googleClientId || !window.google?.accounts?.id) {
      setError(t("auth.login.errors.googleUnavailable"));
      return;
    }

    setError("");

    window.google.accounts.id.prompt((notification) => {
      const isNotDisplayed = typeof notification?.isNotDisplayed === "function" ? notification.isNotDisplayed() : undefined;
      const isDismissedMoment = typeof notification?.isDismissedMoment === "function" ? notification.isDismissedMoment() : undefined;

      if (isDismissedMoment) {
        return;
      }

      if (isNotDisplayed) {
        return;
      }
    });
  }

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (!clientId) {
      return;
    }

    const onGoogleReady = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });
        setIsGoogleReady(true);
      }
    };

    const existingScript = document.getElementById(GOOGLE_SCRIPT_ID);

    if (existingScript) {
      onGoogleReady();
      return;
    }

    const script = document.createElement("script");
    script.id = GOOGLE_SCRIPT_ID;
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = onGoogleReady;
    document.body.appendChild(script);

    return () => {
      const scriptNode = document.getElementById(GOOGLE_SCRIPT_ID);
      if (scriptNode && scriptNode.parentNode) {
        scriptNode.parentNode.removeChild(scriptNode);
      }
    };
  }, []);

  async function handleAuthSuccess(result) {
    const accessToken = result?.data?.accessToken;
    const user = result?.data?.user;

    if (!accessToken) {
      setError(t("auth.login.errors.invalidLogin"));
      return;
    }

    setAccessToken(accessToken);
    setUser(user ?? null);

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
      setError(t('auth.login.errors.emptyFields'));
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
        setError(t('auth.login.errors.invalidLogin'));
        return;
      }

      setAccessToken(accessToken);
      setUser(user ?? null);

      ReactGA.event("login", {
        method: "email",
      });

      navigate("/application", { replace: true });
    } catch (requestError) {
      setError(getErrorMessage(requestError, t('auth.login.errors.invalidCredentials')));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthShell
      eyebrow={t('common.interviewTracker')}
      title={t('auth.login.title')}
      description={t('auth.login.description')}
      footerText={t('auth.login.noAccount')}
      footerLinkLabel={t('auth.login.createAccount')}
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
            {t('common.email')}
          </label>
          <input
            id="login-email"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            placeholder={t('auth.login.emailPlaceholder')}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <label
              htmlFor="login-password"
              className="text-sm font-medium text-slate-700"
            >
              {t('common.password')}
            </label>
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              {t('auth.login.forgotPassword')}
            </button>
          </div>
          <input
            id="login-password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={form.password}
            onChange={handleChange}
            placeholder={t('auth.login.passwordPlaceholder')}
            className={inputClassName}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={submitClassName}
        >
          {isSubmitting ? t('auth.login.submitting') : t('auth.login.submit')}
        </button>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-[0.2em] text-slate-400">
            <span className="bg-white px-3">{t('auth.login.or')}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGooglePrompt}
          disabled={isSubmitting || !isGoogleReady}
          className={googleButtonClassName}
        >
          <span className="flex h-5 w-5 shrink-0 items-center justify-center" aria-hidden="true">
            <svg viewBox="0 0 18 18" className="h-[18px] w-[18px]" aria-hidden="true">
              <path
                fill="#EA4335"
                d="M9 3.48c1.69 0 2.84.73 3.49 1.34l2.54-2.54C13.46.83 11.43 0 9 0 5.48 0 2.44 2.02.96 4.96l2.96 2.3C4.63 5.17 6.63 3.48 9 3.48z"
              />
              <path
                fill="#4285F4"
                d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84c-.21 1.12-.84 2.07-1.8 2.71l2.91 2.26c1.7-1.57 2.69-3.88 2.69-6.61z"
              />
              <path
                fill="#FBBC05"
                d="M3.92 10.74a5.41 5.41 0 0 1 0-3.48l-2.96-2.3a8.94 8.94 0 0 0 0 8.08l2.96-2.3z"
              />
              <path
                fill="#34A853"
                d="M9 18c2.43 0 4.46-.8 5.95-2.18l-2.91-2.26c-.81.54-1.85.86-3.04.86-2.37 0-4.37-1.6-5.08-3.74l-2.96 2.3C2.44 15.98 5.48 18 9 18z"
              />
            </svg>
          </span>
          <span className="leading-none">{t('auth.login.continueWithGoogle')}</span>
        </button>
      </form>
    </AuthShell>
  );
}
