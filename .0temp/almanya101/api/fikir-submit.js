// =========================================================
// FILE: /api/fikir-submit.js
// PURPOSE: Receive idea submissions and send via SMTP
// =========================================================

import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // CORS
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  let body = {};
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
  } catch {
    return res.status(400).json({ error: "Invalid JSON" });
  }

  const message = String(body.message || "").trim().slice(0, 5000);

  if (!message) {
    return res.status(400).json({ error: "Message is required." });
  }

  // SMTP Settings from .env
  const {
    ZOHO_SMTP_HOST,
    ZOHO_SMTP_PORT,
    ZOHO_SMTP_USER,
    ZOHO_SMTP_PASS,
    MAIL_TO
  } = process.env;

  if (!ZOHO_SMTP_HOST || !ZOHO_SMTP_USER || !ZOHO_SMTP_PASS) {
    return res.status(503).json({ error: "SMTP not configured." });
  }

  // Create transporter
  const transporter = nodemailer.createTransport({
    host: ZOHO_SMTP_HOST,
    port: parseInt(ZOHO_SMTP_PORT || "465"),
    secure: true, // true for 465, false for other ports
    auth: {
      user: ZOHO_SMTP_USER,
      pass: ZOHO_SMTP_PASS,
    },
  });

  try {
    // Send mail
    const info = await transporter.sendMail({
      from: `"almanya101 Fikir" <${ZOHO_SMTP_USER}>`,
      to: MAIL_TO || "qa@almanya101.de",
      subject: "Yeni Fikir Bildirimi",
      text: `Yeni bir fikir aldık:\n\n${message}`,
      html: `<p>Yeni bir fikir aldık:</p><blockquote style="border-left: 5px solid #ccc; padding: 10px; margin: 10px 0;">${message.replace(/\n/g, '<br>')}</blockquote>`,
    });

    console.log("Message sent: %s", info.messageId);
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("SMTP error:", error);
    return res.status(500).json({ error: "Failed to send email", details: error.message });
  }
}
