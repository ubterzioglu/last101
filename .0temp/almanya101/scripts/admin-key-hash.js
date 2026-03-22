#!/usr/bin/env node
const crypto = require('crypto');

function usage() {
  console.error('Usage: node scripts/admin-key-hash.js "<plain_admin_key>" [iterations]');
  process.exit(1);
}

const plainKey = process.argv[2];
const iterationsArg = Number.parseInt(process.argv[3] || '210000', 10);
const iterations = Number.isFinite(iterationsArg) && iterationsArg >= 1000 ? iterationsArg : 210000;

if (!plainKey || typeof plainKey !== 'string' || !plainKey.trim()) {
  usage();
}

const salt = crypto.randomBytes(16).toString('hex');
const hash = crypto.pbkdf2Sync(plainKey.trim(), salt, iterations, 32, 'sha256').toString('hex');

console.log(JSON.stringify({ key_salt: salt, key_hash: hash, hash_iterations: iterations }, null, 2));
