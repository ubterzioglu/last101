const fs = require('fs');
let code = fs.readFileSync('app/(site)/hizmet-rehberi/oneri/HizmetOnerClient.tsx', 'utf-8');

code = code.replace(/Hizmet Rehberi \/ Kayıt Öner/g, "Tüm Türkler / Türk Öner");
code = code.replace(/birlikte rehberi büyütelim/g, "birlikte listeyi büyütelim");
code = code.replace(/rehbere eklesin/g, "listeye eklesin");
code = code.replace(/Hizmet ara/g, "Türk Bul");
code = code.replace(/Rehbere dön/g, "Listeye dön");
code = code.replace(/rehbere aktif olarak ekler/g, "listeye aktif olarak ekler");

// Fix the input fields color as well, currently they use white theme classnames but text-white etc which is wrong for light theme! Wait, the file is already mostly light theme, but inputClassName is wrong:
const inputOld = "'w-full rounded-[1.2rem] border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-white/35 focus:border-[#01A1F1]'";
const inputNew = "'w-full rounded-[1.2rem] border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#01A1F1] focus:ring-1 focus:ring-[#01A1F1]'";
code = code.replace(inputOld, inputNew);

fs.writeFileSync('app/(site)/hizmet-rehberi/oneri/HizmetOnerClient.tsx', code);
