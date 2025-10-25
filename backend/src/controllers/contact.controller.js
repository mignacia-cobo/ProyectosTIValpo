const db = require('../config/database');
const nodemailer = require('nodemailer');

// Configurar transporte de correo
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true para 465, false para otros puertos
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// Enviar mensaje de contacto
const sendContactMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validar entrada
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Email inválido' });
    }

    // Guardar en base de datos
    const result = await db.query(
      'INSERT INTO contact_messages (name, email, message) VALUES ($1, $2, $3) RETURNING *',
      [name, email, message]
    );

    // Enviar correo al administrador
    try {
      const transporter = createTransporter();
      
      await transporter.sendMail({
        from: `"Proyectos TI Valpo" <${process.env.SMTP_USER}>`,
        to: process.env.ADMIN_EMAIL,
        subject: `Nuevo mensaje de contacto - ${name}`,
        html: `
          <h2>Nuevo mensaje de contacto</h2>
          <p><strong>Nombre:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Mensaje:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
          <hr>
          <p><small>Este mensaje fue enviado desde el formulario de contacto de proyectostivalpo.com</small></p>
        `
      });
    } catch (emailError) {
      console.error('Error al enviar correo:', emailError);
      // No fallar si el correo no se envía, el mensaje ya está guardado en BD
    }

    res.status(201).json({ 
      message: 'Mensaje enviado exitosamente',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error al enviar mensaje de contacto:', error);
    res.status(500).json({ error: 'Error al enviar mensaje' });
  }
};

// Obtener todos los mensajes (admin)
const getAllMessages = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM contact_messages ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener mensajes:', error);
    res.status(500).json({ error: 'Error al obtener mensajes' });
  }
};

// Marcar mensaje como leído
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await db.query(
      'UPDATE contact_messages SET read = true WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Mensaje no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al marcar mensaje como leído:', error);
    res.status(500).json({ error: 'Error al actualizar mensaje' });
  }
};

// Eliminar mensaje
const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await db.query('DELETE FROM contact_messages WHERE id = $1', [id]);
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Mensaje no encontrado' });
    }

    res.json({ message: 'Mensaje eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar mensaje:', error);
    res.status(500).json({ error: 'Error al eliminar mensaje' });
  }
};

module.exports = {
  sendContactMessage,
  getAllMessages,
  markAsRead,
  deleteMessage
};
