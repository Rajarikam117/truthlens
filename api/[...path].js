// Vercel serverless entry point for all /api/* requests.
// Express receives the original URL and routes /api/analyze and /api/health.
const app = require("../server");
module.exports = app;
