"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "fa";

type Dict = Record<string, string>;

const en: Dict = {
  "app.name": "SoftEther Manager",
  "login.title": "SoftEther Manager",
  "login.setup": "Set up this panel",
  "login.setup.desc": "No account exists yet. The first one you create signs in from now on.",
  "login.desc": "Sign in to manage your VPN servers",
  "login.username": "Username",
  "login.password": "Password",
  "login.confirm": "Confirm password",
  "login.submit": "Sign in",
  "login.setup.submit": "Create account",
  "login.error.match": "The two passwords do not match",
  "login.error.generic": "Something went wrong",
  "nav.dashboard": "Dashboard",
  "nav.users": "Users",
  "nav.connections": "Connections",
  "nav.logs": "Logs",
  "nav.console": "Console",
  "nav.settings": "Settings",
  "nav.server": "Server",
  "nav.connect": "Connect",
  "theme.light": "Light",
  "theme.dark": "Dark",
  "theme.system": "System",
  "lang.en": "English",
  "lang.fa": "فارسی",
  "common.save": "Save",
  "common.cancel": "Cancel",
  "common.delete": "Delete",
  "common.edit": "Edit",
  "common.create": "Create",
  "common.search": "Search",
  "common.loading": "Loading…",
  "common.online": "Online",
  "common.offline": "Offline",
  "dashboard.greeting": "Server health",
  "dashboard.cpu": "CPU",
  "dashboard.memory": "Memory",
  "dashboard.disk": "Disk",
  "dashboard.network": "Network",
  "users.title": "All users",
  "settings.title": "Settings",
  "settings.language": "Language",
  "settings.theme": "Theme",
};

const fa: Dict = {
  "app.name": "مدیر سافت‌اتر",
  "login.title": "مدیر سافت‌اتر",
  "login.setup": "راه‌اندازی پنل",
  "login.setup.desc": "هنوز حسابی وجود ندارد. اولین حسابی که می‌سازید از این به بعد وارد می‌شود.",
  "login.desc": "برای مدیریت سرورهای VPN وارد شوید",
  "login.username": "نام کاربری",
  "login.password": "رمز عبور",
  "login.confirm": "تأیید رمز عبور",
  "login.submit": "ورود",
  "login.setup.submit": "ایجاد حساب",
  "login.error.match": "دو رمز عبور یکسان نیستند",
  "login.error.generic": "مشکلی پیش آمد",
  "nav.dashboard": "داشبورد",
  "nav.users": "کاربران",
  "nav.connections": "اتصالات",
  "nav.logs": "لاگ‌ها",
  "nav.console": "کنسول",
  "nav.settings": "تنظیمات",
  "nav.server": "سرور",
  "nav.connect": "اتصال",
  "theme.light": "روشن",
  "theme.dark": "تاریک",
  "theme.system": "سیستم",
  "lang.en": "English",
  "lang.fa": "فارسی",
  "common.save": "ذخیره",
  "common.cancel": "لغو",
  "common.delete": "حذف",
  "common.edit": "ویرایش",
  "common.create": "ایجاد",
  "common.search": "جستجو",
  "common.loading": "در حال بارگذاری…",
  "common.online": "آنلاین",
  "common.offline": "آفلاین",
  "dashboard.greeting": "سلامت سرور",
  "dashboard.cpu": "پردازنده",
  "dashboard.memory": "حافظه",
  "dashboard.disk": "دیسک",
  "dashboard.network": "شبکه",
  "users.title": "همه کاربران",
  "settings.title": "تنظیمات",
  "settings.language": "زبان",
  "settings.theme": "تم",
};

const dicts: Record<Lang, Dict> = { en, fa };

interface I18nApi {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string, fallback?: string) => string;
  dir: "ltr" | "rtl";
}

const I18nContext = createContext<I18nApi>(null as unknown as I18nApi);

const STORAGE_KEY = "sem_lang";

function readStored(): Lang {
  if (typeof window === "undefined") return "fa";
  const v = localStorage.getItem(STORAGE_KEY);
  return v === "en" || v === "fa" ? v : "fa";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => readStored());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "fa" ? "rtl" : "ltr";
  }, [lang]);

  const setLang = (l: Lang) => setLangState(l);
  const t = (key: string, fallback?: string) =>
    dicts[lang][key] ?? dicts.en[key] ?? fallback ?? key;
  const dir = lang === "fa" ? "rtl" : "ltr";

  return (
    <I18nContext.Provider value={{ lang, setLang, t, dir }}>
      {children}
    </I18nContext.Provider>
  );
}

export const useI18n = () => useContext(I18nContext);
