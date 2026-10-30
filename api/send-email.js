const { processMail } = require("./mailCore.cjs");

module.exports = async function sendEmail(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "content-type");
    res.status(204).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ success: false, error: "Méthode refusée." });
    return;
  }

  const ip = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.socket?.remoteAddress || "inconnu";
  const result = await processMail(req.body || {}, process.env, ip);
  res.status(result.status).json(result.body);
};
