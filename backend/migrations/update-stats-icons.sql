-- Actualizar stats para incluir iconos
UPDATE site_config 
SET config = '{
    "stats": [
        {
            "id": 1,
            "icon": "Rocket",
            "value": "10+",
            "label": "Años de Experiencia"
        },
        {
            "id": 2,
            "icon": "Users",
            "value": "50+",
            "label": "Proyectos Completados"
        },
        {
            "id": 3,
            "icon": "Award",
            "value": "1000+",
            "label": "Estudiantes Beneficiados"
        },
        {
            "id": 4,
            "icon": "Building",
            "value": "15+",
            "label": "Universidades Colaboradoras"
        }
    ]
}'::jsonb
WHERE section = 'stats';
