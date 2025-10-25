-- Script para insertar datos de prueba
-- Ejecutar: docker exec -i proyectosti_db psql -U postgres -d proyectosti < seed.sql

-- Insertar proyectos de ejemplo
INSERT INTO projects (name, description, url, order_index, active) VALUES
('Sistema de Exámenes', 'Plataforma web para la gestión y aplicación de exámenes en línea. Permite crear cuestionarios, asignar a estudiantes y obtener resultados en tiempo real.', 'https://examenes.proyectostivalpo.com', 1, true),
('Gestión de Conciertos', 'Sistema completo para la administración de eventos musicales. Incluye venta de entradas, gestión de artistas y control de asistencia.', 'https://conciertos.proyectostivalpo.com', 2, true),
('Portal Estudiantil', 'Plataforma centralizada para estudiantes con acceso a notas, horarios, biblioteca digital y comunicación con docentes.', 'https://estudiantes.proyectostivalpo.com', 3, true);

-- Insertar noticias de ejemplo
INSERT INTO news (title, content, summary, published_date, active) VALUES
('Lanzamiento del Nuevo Portal Web', 
'Nos complace anunciar el lanzamiento oficial de nuestro nuevo portal web. Este sitio ha sido diseñado con las últimas tecnologías para ofrecer una experiencia moderna y eficiente. 

Características principales:
- Diseño responsivo y moderno
- Panel de administración intuitivo
- Formulario de contacto integrado
- Sección de proyectos actualizable
- Sistema de noticias dinámico

Esperamos que disfruten navegando por nuestra nueva plataforma y conociendo más sobre nuestros proyectos.',
'Presentamos oficialmente nuestro nuevo portal web con diseño moderno y funcionalidades avanzadas.',
'2024-01-20 10:00:00',
true),

('Actualización del Sistema de Exámenes',
'El sistema de exámenes ha recibido importantes mejoras:

1. Nueva interfaz de usuario más intuitiva
2. Soporte para diferentes tipos de preguntas (selección múltiple, verdadero/falso, desarrollo)
3. Temporizador visual mejorado
4. Exportación de resultados en formato Excel
5. Análisis estadísticos avanzados

Estas mejoras buscan facilitar tanto la creación de exámenes por parte de los docentes como la experiencia de los estudiantes al responderlos.

La actualización estará disponible a partir del 1 de febrero de 2024.',
'Nuevas funcionalidades y mejoras en la interfaz del sistema de exámenes en línea.',
'2024-01-18 14:30:00',
true),

('Integración con Plataforma de Pagos',
'A partir del próximo mes, el sistema de gestión de conciertos contará con integración directa con plataformas de pago online.

Beneficios:
- Pagos con tarjetas de crédito y débito
- Transferencias electrónicas
- Confirmación automática de pagos
- Generación de comprobantes digitales
- Mayor seguridad en las transacciones

Esta integración permitirá a los organizadores de eventos recibir pagos de forma más rápida y segura, mientras que los asistentes tendrán más opciones de pago disponibles.',
'Próximamente: pagos online integrados en el sistema de gestión de conciertos.',
'2024-01-15 09:00:00',
true);

-- Insertar mensajes de contacto de ejemplo
INSERT INTO contact_messages (name, email, message, read) VALUES
('Carlos Rodríguez', 'carlos.rodriguez@example.com', 
'Hola, estoy interesado en conocer más sobre el sistema de exámenes. ¿Ofrecen alguna demostración o período de prueba? Me gustaría implementarlo en mi institución educativa.',
false),

('María González', 'maria.gonzalez@example.com',
'Excelente trabajo con el portal. Me gustaría saber si ofrecen servicios de desarrollo personalizado para otros proyectos similares. Tengo una propuesta que me gustaría discutir.',
true),

('Pedro Sánchez', 'pedro.sanchez@example.com',
'Buenos días, soy organizador de eventos y el sistema de gestión de conciertos me parece muy completo. ¿Cuál es el costo de implementación? ¿Ofrecen capacitación?',
false);

-- Mostrar resumen de datos insertados
SELECT 'Proyectos insertados:' as info, COUNT(*) as cantidad FROM projects;
SELECT 'Noticias insertadas:' as info, COUNT(*) as cantidad FROM news;
SELECT 'Mensajes insertados:' as info, COUNT(*) as cantidad FROM contact_messages;
