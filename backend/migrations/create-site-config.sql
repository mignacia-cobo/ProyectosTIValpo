-- Crear tabla para configuración del sitio
CREATE TABLE IF NOT EXISTS site_config (
    id SERIAL PRIMARY KEY,
    section VARCHAR(50) NOT NULL UNIQUE,
    config JSONB NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by INTEGER REFERENCES users(id)
);

-- Insertar configuración inicial del Hero
INSERT INTO site_config (section, config) VALUES 
('hero', '{
    "title": "Proyectos de Innovación Tecnológica",
    "subtitle": "Impulsando el desarrollo tecnológico en Valparaíso",
    "description": "Desarrollamos soluciones innovadoras que conectan la academia con la industria, transformando ideas en proyectos reales que impactan positivamente en nuestra región.",
    "buttonText": "Conocer Proyectos",
    "buttonLink": "/projects",
    "backgroundImage": "/images/hero-bg.jpg"
}'::jsonb),

-- Insertar configuración inicial de Estadísticas
('stats', '{
    "stats": [
        {
            "id": 1,
            "value": "10+",
            "label": "Años de Experiencia"
        },
        {
            "id": 2,
            "value": "50+",
            "label": "Proyectos Completados"
        },
        {
            "id": 3,
            "value": "1000+",
            "label": "Estudiantes Beneficiados"
        },
        {
            "id": 4,
            "value": "15+",
            "label": "Universidades Colaboradoras"
        }
    ]
}'::jsonb),

-- Insertar configuración inicial de Características
('features', '{
    "title": "¿Por qué Elegirnos?",
    "subtitle": "Características que nos distinguen",
    "features": [
        {
            "id": 1,
            "icon": "Target",
            "title": "Innovación Constante",
            "description": "Nos mantenemos a la vanguardia de las últimas tecnologías y metodologías para ofrecer soluciones de punta."
        },
        {
            "id": 2,
            "icon": "Users",
            "title": "Equipo Multidisciplinario",
            "description": "Contamos con profesionales especializados en diversas áreas del conocimiento tecnológico."
        },
        {
            "id": 3,
            "icon": "Briefcase",
            "title": "Colaboración Universidad-Empresa",
            "description": "Facilitamos la vinculación entre el mundo académico y el sector productivo."
        },
        {
            "id": 4,
            "icon": "BarChart",
            "title": "Resultados Medibles",
            "description": "Implementamos métricas claras para evaluar el impacto de cada proyecto desarrollado."
        },
        {
            "id": 5,
            "icon": "TrendingUp",
            "title": "Desarrollo Sustentable",
            "description": "Priorizamos soluciones que generen un impacto positivo y sostenible en la región."
        },
        {
            "id": 6,
            "icon": "Lightbulb",
            "title": "Formación Continua",
            "description": "Capacitamos constantemente a estudiantes y profesionales en nuevas tecnologías."
        }
    ]
}'::jsonb);

-- Crear índice para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_site_config_section ON site_config(section);

-- Trigger para actualizar automáticamente updated_at
CREATE OR REPLACE FUNCTION update_site_config_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_site_config_timestamp
BEFORE UPDATE ON site_config
FOR EACH ROW
EXECUTE FUNCTION update_site_config_timestamp();
