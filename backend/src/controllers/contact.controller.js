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

// Responder mensaje
const replyToMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { replyMessage } = req.body;

    if (!replyMessage || replyMessage.trim() === '') {
      return res.status(400).json({ error: 'El mensaje de respuesta es requerido' });
    }

    // Obtener el mensaje original
    const messageResult = await db.query(
      'SELECT * FROM contact_messages WHERE id = $1',
      [id]
    );

    if (messageResult.rows.length === 0) {
      return res.status(404).json({ error: 'Mensaje no encontrado' });
    }

    const originalMessage = messageResult.rows[0];

    // Enviar correo de respuesta
    try {
      const transporter = createTransporter();
      
      await transporter.sendMail({
        from: `"Proyectos TI Valpo" <${process.env.SMTP_USER}>`,
        to: originalMessage.email,
        replyTo: process.env.SMTP_USER,
        subject: `Re: Tu mensaje desde ProyectosTI Valpo`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0;">Proyectos TI Valpo</h1>
            </div>
            
            <div style="padding: 30px; background-color: #f9f9f9;">
              <p style="color: #333; font-size: 16px;">Hola <strong>${originalMessage.name}</strong>,</p>
              
              <p style="color: #555; line-height: 1.6;">
                Gracias por contactarnos. A continuación, respondemos a tu mensaje:
              </p>
              
              <div style="background-color: white; padding: 20px; border-left: 4px solid #667eea; margin: 20px 0;">
                <p style="color: #333; line-height: 1.8; white-space: pre-wrap;">${replyMessage}</p>
              </div>
              
              <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
              
              <div style="background-color: #f0f0f0; padding: 15px; border-radius: 5px;">
                <p style="color: #666; font-size: 14px; margin: 0 0 10px 0;"><strong>Tu mensaje original:</strong></p>
                <p style="color: #555; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${originalMessage.message}</p>
              </div>
              
              <p style="color: #555; margin-top: 30px;">
                Si tienes más preguntas, no dudes en responder a este correo.
              </p>
              
              <p style="color: #555;">
                Saludos cordiales,<br>
                <strong>Equipo Proyectos TI Valpo</strong>
              </p>
            </div>
            
            <div style="background-color: #333; padding: 20px; text-align: center;">
              <p style="color: #999; font-size: 12px; margin: 0;">
                © ${new Date().getFullYear()} Proyectos TI Valpo - Todos los derechos reservados
              </p>
              <p style="color: #999; font-size: 12px; margin: 10px 0 0 0;">
                <a href="mailto:${process.env.SMTP_USER}" style="color: #667eea; text-decoration: none;">${process.env.SMTP_USER}</a>
              </p>
            </div>
          </div>
        `
      });

      // Actualizar el mensaje como respondido
      await db.query(
        'UPDATE contact_messages SET replied = true, replied_at = CURRENT_TIMESTAMP, reply_message = $1, read = true WHERE id = $2',
        [replyMessage, id]
      );

      res.json({ 
        message: 'Respuesta enviada exitosamente',
        email: originalMessage.email
      });
    } catch (emailError) {
      console.error('Error al enviar correo de respuesta:', emailError);
      return res.status(500).json({ 
        error: 'Error al enviar el correo de respuesta. Verifica la configuración de SMTP.',
        details: emailError.message 
      });
    }
  } catch (error) {
    console.error('Error al responder mensaje:', error);
    res.status(500).json({ error: 'Error al procesar la respuesta' });
  }
};

// Actualizar notas internas
const updateNotes = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;
    const userId = req.user.email; // Del token JWT

    const result = await db.query(
      'UPDATE contact_messages SET notes = $1, last_checked_at = CURRENT_TIMESTAMP, last_checked_by = $2 WHERE id = $3 RETURNING *',
      [notes, userId, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Mensaje no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar notas:', error);
    res.status(500).json({ error: 'Error al actualizar notas' });
  }
};

// Marcar como revisado
const markAsChecked = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.email; // Del token JWT

    const result = await db.query(
      'UPDATE contact_messages SET last_checked_at = CURRENT_TIMESTAMP, last_checked_by = $1 WHERE id = $2 RETURNING *',
      [userId, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Mensaje no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al marcar como revisado:', error);
    res.status(500).json({ error: 'Error al actualizar mensaje' });
  }
};

module.exports = {
  sendContactMessage,
  getAllMessages,
  markAsRead,
  deleteMessage,
  replyToMessage,
  updateNotes,
  markAsChecked
};
