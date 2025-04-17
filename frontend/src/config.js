const BACKEND_URL =
  process.env.NODE_ENV === "development"
    ? "http://127.0.0.1:5000"
    : "https://geno-graphix-main.onrender.com";

export default BACKEND_URL;