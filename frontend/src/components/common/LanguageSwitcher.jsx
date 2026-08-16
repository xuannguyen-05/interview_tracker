import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const languages = [
    { code: "vi", label: "VI" },
    { code: "en", label: "EN" },
  ];

  return (
    <div className="inline-flex items-center rounded-lg border border-slate-200 bg-white p-0.5 shadow-sm">
      {languages.map(({ code, label }) => {
        const active = i18n.language.startsWith(code);

        return (
          <button
            key={code}
            type="button"
            onClick={() => i18n.changeLanguage(code)}
            className={`rounded-md px-2 py-1 text-[11px] font-semibold transition-all duration-200 ${
              active
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}