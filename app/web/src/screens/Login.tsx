"use client";

import { useState } from "react";
import { ApiError } from "../lib/api";
import { useAuth } from "../lib/auth";
import { useI18n } from "../lib/i18n";
import { BrandMark } from "../ui/Icon";

/**
 * Signing in -- and the one screen that comes before it.
 *
 * There is no "create an account" link. The installer creates the first
 * account from the username and password it was given; if this panel has no
 * account (a dev checkout, or an install where that step was skipped) the
 * form becomes first-run setup instead. An open signup form on an
 * internet-facing panel means the first stranger to find the URL owns it.
 */
export function Login() {
  const { login, setup, needsSetup } = useAuth();
  const { t, lang, setLang } = useI18n();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (needsSetup && password !== confirm) {
      setError(t("login.error.match"));
      return;
    }
    setBusy(true);
    try {
      if (needsSetup) await setup(username.trim(), password);
      else await login(username.trim(), password);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("login.error.generic"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth">
      <div className="auth__card">
        <div className="auth__mark">
          <BrandMark size={38} />
          <div>
            <div className="auth__t">{needsSetup ? t("login.setup") : t("login.title")}</div>
            <div className="auth__s">
              {needsSetup ? t("login.setup.desc") : t("login.desc")}
            </div>
          </div>
        </div>

        <div className="plate auth__box">
          {error && <div className="alert alert--err">{error}</div>}
          <form onSubmit={submit}>
            <div className="field">
              <label htmlFor="u">{t("login.username")}</label>
              <input
                id="u"
                className="input mono"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                autoComplete="username"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                enterKeyHint="next"
                required
              />
            </div>
            <div className="field">
              <label htmlFor="p">{t("login.password")}</label>
              <input
                id="p"
                className="input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={needsSetup ? "new-password" : "current-password"}
                enterKeyHint={needsSetup ? "next" : "go"}
                required
                minLength={1}
              />
            </div>
            {needsSetup && (
              <div className="field">
                <label htmlFor="p2">{t("login.confirm")}</label>
                <input
                  id="p2"
                  className="input"
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  autoComplete="new-password"
                  enterKeyHint="go"
                  required
                  minLength={1}
                />
              </div>
            )}
            <button className="btn btn--primary btn--block" disabled={busy} type="submit">
              {busy && <span className="spin" />}
              {needsSetup ? t("login.setup.submit") : t("login.submit")}
            </button>
          </form>
          <div className="auth__lang" style={{ marginTop: 16, textAlign: "center", display: "flex", gap: 8, justifyContent: "center" }}>
            <button
              type="button"
              className={`btn btn--ghost btn--sm ${lang === "fa" ? "btn--active" : ""}`}
              onClick={() => setLang("fa")}
            >
              فارسی
            </button>
            <button
              type="button"
              className={`btn btn--ghost btn--sm ${lang === "en" ? "btn--active" : ""}`}
              onClick={() => setLang("en")}
            >
              English
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
