// -----------------------------------------------------------------------------
// API SERVICE
// This is the ONLY file that talks to the back end.
//
// Right now it returns DEMO data. To connect your teammate's back end:
//   1. Copy .env.example to .env
//   2. Set VITE_API_URL=http://localhost:8000   (or wherever the API runs)
//   3. Check the endpoints below match, and you're done.
//
// LANGUAGE: every request includes `language` ("en", "ur", later "khw").
// The back end should return all text (questions, explanation, steps...) in
// that language.
//
// Expected endpoints (change the paths here if your teammate uses different ones):
//
//   POST /api/auth/login
//     body:     { identifier: string, password: string }
//     returns:  { token: string, user: { name: string } }
//
//   POST /api/auth/signup
//     body:     { name, identifier, password }
//     returns:  { token: string, user: { name: string } }
//
//   POST /api/follow-up-questions
//     body:     { problem, province, language }
//     returns:  { questions: [ { id, text, type, options?, hint? } ] }
//               type is "choice", "yesno" or "text"
//
//   POST /api/analyze
//     body:     { problem, province, language, answers: [ { questionId, question, answer } ] }
//     returns:  a "result" object shaped like demoResult.en in ../data/demoData.js
// -----------------------------------------------------------------------------

import { demoQuestions, demoResult } from "../data/demoData.js";

const BASE_URL = import.meta.env.VITE_API_URL || "";
const USE_DEMO_DATA = BASE_URL === "";

// After login we keep the token here (in memory) and send it with every request.
let authToken = null;

// Pretend the network takes a moment (demo mode only).
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// One small helper so every real request behaves the same way.
async function postJson(path, body) {
  const headers = { "Content-Type": "application/json" };
  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error("The server could not complete this request.");
  }
  return response.json();
}

// ----- Login and sign up -----

export async function logIn({ identifier, password }) {
  if (USE_DEMO_DATA) {
    await wait(600);
    return { name: identifier.split("@")[0] };
  }
  const data = await postJson("/api/auth/login", { identifier, password });
  authToken = data.token;
  return data.user;
}

export async function signUp({ name, identifier, password }) {
  if (USE_DEMO_DATA) {
    await wait(600);
    return { name };
  }
  const data = await postJson("/api/auth/signup", { name, identifier, password });
  authToken = data.token;
  return data.user;
}

export function logOut() {
  authToken = null;
}

// ----- The legal flow -----

export async function getFollowUpQuestions({ problem, province, language }) {
  if (USE_DEMO_DATA) {
    await wait(600);
    return demoQuestions[language] || demoQuestions.en;
  }
  const data = await postJson("/api/follow-up-questions", { problem, province, language });
  return data.questions;
}

export async function analyzeProblem({ problem, province, answers, language }) {
  if (USE_DEMO_DATA) {
    await wait(300);
    return demoResult[language] || demoResult.en;
  }
  return postJson("/api/analyze", { problem, province, answers, language });
}
