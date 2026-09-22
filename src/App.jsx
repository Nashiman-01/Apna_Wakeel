import { useEffect, useRef, useState } from "react";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Describe from "./pages/Describe.jsx";
import FollowUp from "./pages/FollowUp.jsx";
import Analysis from "./pages/Analysis.jsx";
import Results from "./pages/Results.jsx";
import { analyzeProblem, logOut } from "./services/api.js";
import { useLanguage } from "./i18n/LanguageContext.jsx";

// The whole app is one "step" at a time:
//   home -> describe -> followup -> analysis -> results
//   (and "login" can be opened from the navbar at any time)
// We keep it simple with useState instead of a router.

export default function App() {
  const { t, language } = useLanguage();
  const [step, setStep] = useState("home");
  const [user, setUser] = useState(null); // null means not logged in
  const [problem, setProblem] = useState({ text: "", province: "" });
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);

  const mainRef = useRef(null);

  // When the screen changes: scroll to top and move focus to the page,
  // so keyboard and screen reader users start at the beginning.
  useEffect(() => {
    window.scrollTo(0, 0);
    mainRef.current?.focus({ preventScroll: true });
  }, [step]);

  // If the person switches language while looking at their results,
  // ask for the results again in the new language.
  useEffect(() => {
    if (step !== "results") return;
    let cancelled = false;

    analyzeProblem({ problem: problem.text, province: problem.province, answers, language })
      .then((data) => {
        if (!cancelled) setResult(data);
      })
      .catch(() => {
        // keep showing the current results if this fails
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  function goToSection(id) {
    setStep("home");
    // wait a moment so the Home page is on screen before scrolling
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  }

  function restart() {
    setProblem({ text: "", province: "" });
    setAnswers([]);
    setResult(null);
    setStep("describe");
  }

  function handleLogout() {
    logOut();
    setUser(null);
    setStep("home");
  }

  return (
    <>
      <a className="skip-link" href="#main">
        {t("skip")}
      </a>

      <Navbar
        user={user}
        onHome={() => setStep("home")}
        onNavigate={goToSection}
        onStart={() => setStep("describe")}
        onLogin={() => setStep("login")}
        onLogout={handleLogout}
      />

      <main id="main" ref={mainRef} tabIndex={-1}>
        {/* key={step} restarts a very gentle fade each time the screen changes */}
        <div key={step} className="page-fade">
        {step === "home" && <Home onStart={() => setStep("describe")} />}

        {step === "login" && (
          <Login
            onSuccess={(loggedInUser) => {
              setUser(loggedInUser);
              setStep("describe");
            }}
            onGuest={() => setStep("describe")}
          />
        )}

        {step === "describe" && (
          <Describe
            initialValue={problem}
            onContinue={(value) => {
              setProblem(value);
              setStep("followup");
            }}
          />
        )}

        {step === "followup" && (
          <FollowUp
            problem={problem}
            onBack={() => setStep("describe")}
            onDone={(list) => {
              setAnswers(list);
              setStep("analysis");
            }}
          />
        )}

        {step === "analysis" && (
          <Analysis
            problem={problem}
            answers={answers}
            onBack={() => setStep("describe")}
            onDone={(data) => {
              setResult(data);
              setStep("results");
            }}
          />
        )}

        {step === "results" && result && <Results result={result} problem={problem} answers={answers} onRestart={restart} />}
        </div>
      </main>

      <Footer />
    </>
  );
}
