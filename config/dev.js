module.exports = {
  DB_STRING: process.env.DB_STRING || "mongodb://localhost",
  DB: process.env.DB || "labfilesubmission",
  JWT_SEC: process.env.JWT_SEC || "devSecret",
};