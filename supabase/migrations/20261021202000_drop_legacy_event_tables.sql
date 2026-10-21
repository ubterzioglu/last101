-- Kullanıcı kararı (21 Ekim 2026): 20261021180000 ile kilitlenen eski etkinlik/vize tabloları silinir.
-- Kodda kullanılmıyorlar (E1/E2 sayfalarının çağırdığı /api/event-e* route'ları yok, canlıda 404), son yazma
-- Şubat 2026; ad + ip_hash + user_agent içeriyorlar. Bağımlı view/FK yok (pg_depend ile doğrulandı).
-- Satır sayıları silmeden önce: event_e1_date_votes 14, event_e1_questions 14, event_e2_questions 3,
-- event_e2_topic_votes 6, vizeqa_questions 1.
drop table if exists public.event_e1_date_votes;
drop table if exists public.event_e1_questions;
drop table if exists public.event_e2_questions;
drop table if exists public.event_e2_topic_votes;
drop table if exists public.vizeqa_questions;
