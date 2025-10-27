-- Actualizar iconos de features para usar lucide-react en lugar de emojis
UPDATE site_config 
SET config = '{
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
}'::jsonb
WHERE section = 'features';
