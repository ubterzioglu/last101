CREATE TABLE vatandaslik_sorulari (
    id SERIAL PRIMARY KEY,
    soru_almanca TEXT NOT NULL,
    soru_turkce TEXT NOT NULL,
    secenekler JSONB NOT NULL,
    dogru_cevap TEXT NOT NULL,
    eyalet TEXT NOT NULL
);
