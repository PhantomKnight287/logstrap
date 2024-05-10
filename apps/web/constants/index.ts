export const API_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8000"
    : "https://logstrap-backend.cantcode.fyi";

export const COOKIE_NAME = "logstrap_token";
