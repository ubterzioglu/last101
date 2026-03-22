// =========================================================
// FILE: /api/newsletter-subscribe.js
// PURPOSE: Newsletter subscription (store + email notify)
// =========================================================

import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

function getIp(req) {
  return (
    req.headers['x-forwarded-for'] ||
    req.headers['x-real-ip'] ||
    req.connection?.remoteAddress ||
    ''
  );
}

function hashIp(ip) {
  if (!ip) return null;
  const salt = process.env.IP_HASH_SALT || '';
  return crypto.createHash('sha256').update(String(ip) + salt).digest('hex').slice(0, 16);
}

export default async function handler(req, res) {
  console.log('Newsletter subscribe request:', { method: req.method, hasBody: !!req.body });
  
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  let body = {};
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
  } catch (parseError) {
    console.error('JSON parse error:', parseError);
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  // Honeypot
  if (body.website || body.name) {
    return res.status(400).json({ error: 'Nope.' });
  }

  const email = String(body.email || '').trim().toLowerCase();
  if (!email || !email.includes('@') || email.length > 200) {
    return res.status(400).json({ error: 'Invalid email.' });
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
  console.log('Environment check:', {
    hasSupabaseUrl: !!SUPABASE_URL,
    hasServiceRole: !!SUPABASE_SERVICE_ROLE_KEY,
    hasAnonKey: !!SUPABASE_ANON_KEY
  });

  const supabaseKey = SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY;
  const supabase = SUPABASE_URL && supabaseKey
    ? createClient(SUPABASE_URL, supabaseKey)
    : null;

  const ip = getIp(req);
  const item = {
    email,
    ip_hash: hashIp(ip),
    user_agent: String(req.headers['user-agent'] || '').slice(0, 255)
  };

  try {
    if (supabase) {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([item]);

      if (error) {
        const msg = String(error.message || '').toLowerCase();
        const code = String(error.code || '').toLowerCase();
        console.log('Supabase error details:', { message: error.message, code: error.code, details: error.details });
        const isDuplicate = code === '23505' || msg.includes('duplicate') || msg.includes('already exists');
        if (!isDuplicate) {
          console.warn('Supabase insert failed; continuing without blocking:', error);
        }
      }
    } else {
      console.warn('Supabase not configured; skipping DB insert.');
    }

    // Email notification
    const {
      ZOHO_SMTP_HOST,
      ZOHO_SMTP_PORT,
      ZOHO_SMTP_USER,
      ZOHO_SMTP_PASS,
      MAIL_TO
    } = process.env;

    if (ZOHO_SMTP_HOST && ZOHO_SMTP_USER && ZOHO_SMTP_PASS) {
      const transporter = nodemailer.createTransport({
        host: ZOHO_SMTP_HOST,
        port: parseInt(ZOHO_SMTP_PORT || '465', 10),
        secure: true,
        auth: {
          user: ZOHO_SMTP_USER,
          pass: ZOHO_SMTP_PASS
        }
      });

      try {
        await transporter.sendMail({
          from: `"almanya101 Bulten" <${ZOHO_SMTP_USER}>`,
          to: MAIL_TO || ZOHO_SMTP_USER,
          subject: 'Yeni Bulten Aboneligi',
          text: `Yeni abone: ${email}`
        });
      } catch (mailError) {
        console.warn('Newsletter email failed:', mailError);
      }
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('Subscribe failed:', e);
    return res.status(500).json({ error: 'Subscribe failed' });
  }
}
