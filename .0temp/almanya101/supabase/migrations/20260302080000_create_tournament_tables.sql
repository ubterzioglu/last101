-- Turnuva, Hackathon, Typing ve Promote tabloları

-- Tavla Turnuvası Katılımcıları
CREATE TABLE IF NOT EXISTS tavla_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    whatsapp TEXT,
    linkedin TEXT,
    approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tavla Turnuvası Playoff Bracket
CREATE TABLE IF NOT EXISTS tavla_bracket (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slot_index INTEGER NOT NULL UNIQUE,
    participant_id UUID REFERENCES tavla_participants(id) ON DELETE SET NULL,
    round_name TEXT,
    winner BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vibecoding Tournament Katılımcıları
CREATE TABLE IF NOT EXISTS vct_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    whatsapp TEXT,
    approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Klavye Hız Yarışması Katılımcıları
CREATE TABLE IF NOT EXISTS typing_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    whatsapp TEXT NOT NULL,
    approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Klavye Hız Yarışması Bracket
CREATE TABLE IF NOT EXISTS typing_bracket (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slot_index INTEGER NOT NULL UNIQUE,
    participant_id UUID REFERENCES typing_participants(id) ON DELETE SET NULL,
    round_name TEXT,
    winner BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Promote Your Product Katılımcıları
CREATE TABLE IF NOT EXISTS promote_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    product_name TEXT NOT NULL,
    product_desc TEXT,
    whatsapp TEXT NOT NULL,
    approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies (Row Level Security)

-- Tavla: Herkes okuyabilir (onaylılar), adminler yazabilir
ALTER TABLE tavla_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE tavla_bracket ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tavla: Herkes okuyabilir" ON tavla_participants
    FOR SELECT USING (true);

CREATE POLICY "Tavla: Herkes kaydolabilir" ON tavla_participants
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Tavla: Admin güncelleyebilir" ON tavla_participants
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Tavla Bracket: Herkes okuyabilir" ON tavla_bracket
    FOR SELECT USING (true);

CREATE POLICY "Tavla Bracket: Admin yazabilir" ON tavla_bracket
    FOR ALL USING (auth.role() = 'authenticated');

-- VCT
ALTER TABLE vct_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "VCT: Herkes okuyabilir" ON vct_participants
    FOR SELECT USING (true);

CREATE POLICY "VCT: Herkes kaydolabilir" ON vct_participants
    FOR INSERT WITH CHECK (true);

CREATE POLICY "VCT: Admin güncelleyebilir" ON vct_participants
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Typing
ALTER TABLE typing_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE typing_bracket ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Typing: Herkes okuyabilir" ON typing_participants
    FOR SELECT USING (true);

CREATE POLICY "Typing: Herkes kaydolabilir" ON typing_participants
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Typing: Admin güncelleyebilir" ON typing_participants
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Typing Bracket: Herkes okuyabilir" ON typing_bracket
    FOR SELECT USING (true);

CREATE POLICY "Typing Bracket: Admin yazabilir" ON typing_bracket
    FOR ALL USING (auth.role() = 'authenticated');

-- Promote
ALTER TABLE promote_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Promote: Herkes okuyabilir" ON promote_participants
    FOR SELECT USING (true);

CREATE POLICY "Promote: Herkes kaydolabilir" ON promote_participants
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Promote: Admin güncelleyebilir" ON promote_participants
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_tavla_participants_approved ON tavla_participants(approved);
CREATE INDEX IF NOT EXISTS idx_vct_participants_approved ON vct_participants(approved);
CREATE INDEX IF NOT EXISTS idx_typing_participants_approved ON typing_participants(approved);
CREATE INDEX IF NOT EXISTS idx_promote_participants_approved ON promote_participants(approved);
