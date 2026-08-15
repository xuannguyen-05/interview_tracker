import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import AuthShell from "@/components/auth/AuthShell";
import { resetPasswordApi } from "@/services/authService";
import { getErrorMessage } from "@/utils/getErrorMessage";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { t } = useTranslation();

  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
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

    if (!form.password.trim()) {
      setError(t('auth.resetPassword.errors.emptyPassword'));
      return;
    }

    if (form.password.length < 8) {
      setError(t('auth.resetPassword.errors.tooShort'));
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError(t('auth.resetPassword.errors.noMatch'));
      return;
    }

    if (!token) {
      setError(t('auth.resetPassword.errors.invalidToken'));
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      await resetPasswordApi({
        token,
        password: form.password.trim(),
      });

      setIsSuccess(true);
    } catch (requestError) {
      setError(getErrorMessage(requestError, t('auth.resetPassword.errors.resetFailed')));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSuccess) {
    return (
      <AuthShell
        eyebrow={t('common.interviewTracker')}
        title={t('auth.resetPassword.success.title')}
        description={t('auth.resetPassword.success.description')}
        footerText=""
        footerLinkLabel=""
        footerLinkTo=""
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
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="mt-4 rounded-2xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-500 w-full"
          >
            {t('auth.resetPassword.success.goToLogin')}
          </button>
        </div>
      </AuthShell>
    );
  }

  if (!token) {
    return (
      <AuthShell
        eyebrow={t('common.interviewTracker')}
        title={t('auth.resetPassword.invalidLink.title')}
        description={t('auth.resetPassword.invalidLink.description')}
        footerText=""
        footerLinkLabel=""
        footerLinkTo=""
      >
        <div className="flex flex-col items-center justify-center py-8">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-100">
            <svg
              className="h-8 w-8 text-rose-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <button
            type="button"
            onClick={() => navigate("/forgot-password")}
            className="mt-4 rounded-2xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-500 w-full"
          >
            {t('auth.resetPassword.invalidLink.requestNew')}
          </button>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      eyebrow={t('common.interviewTracker')}
      title={t('auth.resetPassword.title')}
      description={t('auth.resetPassword.description')}
      footerText={t('auth.resetPassword.rememberPassword')}
      footerLinkLabel={t('auth.resetPassword.backToLogin')}
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
            htmlFor="reset-password"
            className="text-sm font-medium text-slate-700"
          >
            {t('auth.resetPassword.newPassword')}
          </label>
          <input
            id="reset-password"
            name="password"
            type="password"
            autoComplete="new-password"
            value={form.password}
            onChange={handleChange}
            placeholder={t('auth.resetPassword.passwordPlaceholder')}
            className={inputClassName}
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="reset-confirm-password"
            className="text-sm font-medium text-slate-700"
          >
            {t('auth.resetPassword.confirmPassword')}
          </label>
          <input
            id="reset-confirm-password"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder={t('auth.resetPassword.passwordPlaceholder')}
            className={inputClassName}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={submitClassName}
        >
          {isSubmitting ? t('auth.resetPassword.submitting') : t('auth.resetPassword.submit')}
        </button>
      </form>
    </AuthShell>
  );
}
