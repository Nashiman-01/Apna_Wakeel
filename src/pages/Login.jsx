import { useState } from "react";
import { logIn, signUp } from "../services/api.js";
import Logo from "../components/Logo.jsx";
import Button from "../components/Button.jsx";
import Alert from "../components/Alert.jsx";
import { useLanguage } from "../i18n/LanguageContext.jsx";

// One page for both "Log in" and "Create an account".
// The small link at the bottom switches between the two.
// "Continue without an account" lets people skip logging in.

const MIN_PASSWORD = 6;

export default function Login({ onSuccess, onGuest }) {
  const { t } = useLanguage();
  const [mode, setMode] = useState("login"); // "login" or "signup"
  const [name, setName] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [busy, setBusy] = useState(false);

  const isSignup = mode === "signup";

  function switchMode() {
    setMode(isSignup ? "login" : "signup");
    setErrors({});
    setServerError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setServerError("");

    const newErrors = {};
    if (isSignup && name.trim() === "") newErrors.name = t("login.errName");
    if (identifier.trim() === "") newErrors.identifier = t("login.errIdentifier");
    if (password.length < MIN_PASSWORD) newErrors.password = t("login.errPassword");

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setBusy(true);
    try {
      const user = isSignup
        ? await signUp({ name: name.trim(), identifier: identifier.trim(), password })
        : await logIn({ identifier: identifier.trim(), password });
      onSuccess(user);
    } catch (error) {
      setServerError(t("login.errFailed"));
      setBusy(false);
    }
  }

  return (
    <div className="container auth-page">
      <Logo size={72} className="auth-emblem" />
      <h1 className="page-title">{isSignup ? t("login.signupTitle") : t("login.title")}</h1>
      <p className="page-intro">{t("login.intro")}</p>

      <form onSubmit={handleSubmit} noValidate className="form auth-card">
        <Alert tone="warning" icon="alert">
          {t("login.demoNote")}
        </Alert>

        {isSignup && (
          <div className="field">
            <label htmlFor="name">{t("login.name")}</label>
            <input
              id="name"
              type="text"
              className="text-input"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-invalid={errors.name ? "true" : "false"}
              aria-describedby={errors.name ? "name-error" : undefined}
            />
            {errors.name && (
              <p id="name-error" className="error" role="alert">
                {errors.name}
              </p>
            )}
          </div>
        )}

        <div className="field">
          <label htmlFor="identifier">{t("login.identifier")}</label>
          {/* dir="ltr" keeps emails and phone numbers reading left to right, even in Urdu */}
          <input
            id="identifier"
            type="text"
            dir="ltr"
            className="text-input"
            autoComplete="username"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            aria-invalid={errors.identifier ? "true" : "false"}
            aria-describedby={errors.identifier ? "identifier-error" : undefined}
          />
          {errors.identifier && (
            <p id="identifier-error" className="error" role="alert">
              {errors.identifier}
            </p>
          )}
        </div>

        <div className="field">
          <label htmlFor="password">{t("login.password")}</label>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            dir="ltr"
            className="text-input"
            autoComplete={isSignup ? "new-password" : "current-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-invalid={errors.password ? "true" : "false"}
            aria-describedby={errors.password ? "password-error" : undefined}
          />
          {errors.password && (
            <p id="password-error" className="error" role="alert">
              {errors.password}
            </p>
          )}
          <div className="check-row">
            <input id="show-password" type="checkbox" checked={showPassword} onChange={(e) => setShowPassword(e.target.checked)} />
            <label htmlFor="show-password">{t("login.showPassword")}</label>
          </div>
        </div>

        {serverError && (
          <p className="error" role="alert">
            {serverError}
          </p>
        )}

        <Button type="submit" size="lg" disabled={busy}>
          {busy ? t("login.working") : isSignup ? t("login.signupSubmit") : t("login.submit")}
        </Button>
      </form>

      <div className="auth-links">
        <button type="button" className="link-button" onClick={switchMode}>
          {isSignup ? t("login.switchToLogin") : t("login.switchToSignup")}
        </button>
        <button type="button" className="link-button" onClick={onGuest}>
          {t("login.guest")}
        </button>
      </div>
    </div>
  );
}
