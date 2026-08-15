import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const languages = [
    { code: 'vi', label: 'VI' },
    { code: 'en', label: 'EN' },
  ];

  return (
    <div className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 p-0.5 shadow-sm">
      {languages.map(({ code, label }) => {
        const active = i18n.language?.startsWith(code);

        return (
          <button
            key={code}
            type="button"
            onClick={() => changeLanguage(code)}
            className={`min-h-[30px] min-w-[36px] rounded-md px-2 py-1 text-[14px] font-semibold leading-none transition ${
              active
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
