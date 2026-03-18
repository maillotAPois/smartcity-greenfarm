CREATE TABLE IF NOT EXISTS achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    icon VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS user_achievements (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, achievement_id)
);

CREATE INDEX idx_user_achievements_user ON user_achievements(user_id);

-- Seed default achievements
INSERT INTO achievements (key, name, description, category) VALUES
    ('first_building', 'Premier Batiment', 'Construire votre premier batiment', 'general'),
    ('level_10', 'Apprenti Maire', 'Atteindre le niveau 10', 'progression'),
    ('level_25', 'Maire Confirme', 'Atteindre le niveau 25', 'progression'),
    ('level_50', 'Grand Architecte', 'Atteindre le niveau 50', 'progression'),
    ('traffic_master', 'Maitre du Trafic', 'Zero embouteillage pendant 100 ticks', 'traffic'),
    ('green_energy', 'Ville Verte', 'Atteindre 100% energie renouvelable', 'energy'),
    ('safe_city', 'Ville Sure', 'Score securite de 100 pendant 50 ticks', 'security'),
    ('zero_waste', 'Zero Dechet', 'Taux de recyclage a 100%', 'waste'),
    ('master_farmer', 'Maitre Fermier', 'Produire 100 tonnes de nourriture/mois', 'farm'),
    ('millionaire', 'Millionnaire', 'Accumuler 1,000,000 credits', 'economy'),
    ('crisis_manager', 'Gestionnaire de Crise', 'Resoudre 50 evenements', 'events'),
    ('prestige_1', 'Prestige I', 'Effectuer votre premier prestige', 'prestige')
ON CONFLICT (key) DO NOTHING;
