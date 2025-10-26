const { google } = require('googleapis');
const fs = require('fs').promises;
const path = require('path');

// Ruta a los archivos de credenciales
const CREDENTIALS_PATH = path.join(__dirname, '../config/credentials.json');
const TOKEN_PATH = path.join(__dirname, '../config/token.json');

// Scopes necesarios para Gmail API
const SCOPES = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.modify'
];

class GmailService {
  constructor() {
    this.auth = null;
    this.gmail = null;
  }

  /**
   * Inicializar autenticación OAuth2
   */
  async initialize() {
    try {
      // Leer credenciales
      const credentials = JSON.parse(await fs.readFile(CREDENTIALS_PATH, 'utf8'));
      const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web;

      // Crear cliente OAuth2
      const oAuth2Client = new google.auth.OAuth2(
        client_id,
        client_secret,
        redirect_uris[0] || 'http://localhost:5000/auth/gmail/callback'
      );

      // Verificar si ya existe un token guardado
      try {
        const token = JSON.parse(await fs.readFile(TOKEN_PATH, 'utf8'));
        oAuth2Client.setCredentials(token);
      } catch (error) {
        // Si no hay token, generar uno nuevo
        console.log('No se encontró token. Necesitas autorizar la aplicación.');
        console.log('Genera el token usando la función getAuthUrl()');
        return null;
      }

      this.auth = oAuth2Client;
      this.gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

      return this.gmail;
    } catch (error) {
      console.error('Error al inicializar Gmail Service:', error);
      throw error;
    }
  }

  /**
   * Obtener URL de autorización para OAuth2
   */
  async getAuthUrl() {
    const credentials = JSON.parse(await fs.readFile(CREDENTIALS_PATH, 'utf8'));
    const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web;

    const oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0] || 'http://localhost:5000/auth/gmail/callback'
    );

    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });

    return authUrl;
  }

  /**
   * Guardar token de autorización
   */
  async saveToken(code) {
    const credentials = JSON.parse(await fs.readFile(CREDENTIALS_PATH, 'utf8'));
    const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web;

    const oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0] || 'http://localhost:5000/auth/gmail/callback'
    );

    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    // Guardar token
    await fs.writeFile(TOKEN_PATH, JSON.stringify(tokens));
    console.log('Token guardado en:', TOKEN_PATH);

    return tokens;
  }

  /**
   * Buscar emails que son respuestas a mensajes enviados
   */
  async searchReplies(fromEmail, afterDate) {
    if (!this.gmail) {
      await this.initialize();
    }

    try {
      // Construir query de búsqueda
      const query = `from:${fromEmail} after:${afterDate}`;

      // Buscar mensajes
      const response = await this.gmail.users.messages.list({
        userId: 'me',
        q: query,
        maxResults: 10
      });

      const messages = response.data.messages || [];
      
      // Obtener detalles completos de cada mensaje
      const detailedMessages = await Promise.all(
        messages.map(msg => this.getMessageDetails(msg.id))
      );

      return detailedMessages;
    } catch (error) {
      console.error('Error al buscar respuestas:', error);
      throw error;
    }
  }

  /**
   * Obtener detalles completos de un mensaje
   */
  async getMessageDetails(messageId) {
    try {
      const response = await this.gmail.users.messages.get({
        userId: 'me',
        id: messageId,
        format: 'full'
      });

      const message = response.data;
      const headers = message.payload.headers;

      // Extraer información relevante
      const from = headers.find(h => h.name === 'From')?.value || '';
      const subject = headers.find(h => h.name === 'Subject')?.value || '';
      const date = headers.find(h => h.name === 'Date')?.value || '';
      const inReplyTo = headers.find(h => h.name === 'In-Reply-To')?.value || '';
      const references = headers.find(h => h.name === 'References')?.value || '';

      // Extraer cuerpo del mensaje
      const bodyData = this.extractMessageBody(message.payload);

      return {
        id: message.id,
        threadId: message.threadId,
        from,
        subject,
        date: new Date(date),
        inReplyTo,
        references,
        bodyText: bodyData.text,
        bodyHtml: bodyData.html,
        snippet: message.snippet
      };
    } catch (error) {
      console.error('Error al obtener detalles del mensaje:', error);
      throw error;
    }
  }

  /**
   * Extraer el cuerpo del mensaje (texto y HTML)
   */
  extractMessageBody(payload) {
    let text = '';
    let html = '';

    if (payload.parts) {
      // Mensaje multiparte
      payload.parts.forEach(part => {
        if (part.mimeType === 'text/plain' && part.body.data) {
          text += Buffer.from(part.body.data, 'base64').toString('utf-8');
        } else if (part.mimeType === 'text/html' && part.body.data) {
          html += Buffer.from(part.body.data, 'base64').toString('utf-8');
        } else if (part.parts) {
          // Recursivo para partes anidadas
          const nested = this.extractMessageBody(part);
          text += nested.text;
          html += nested.html;
        }
      });
    } else if (payload.body.data) {
      // Mensaje simple
      const decoded = Buffer.from(payload.body.data, 'base64').toString('utf-8');
      if (payload.mimeType === 'text/plain') {
        text = decoded;
      } else if (payload.mimeType === 'text/html') {
        html = decoded;
      }
    }

    return { text, html };
  }

  /**
   * Extraer email del campo From (ej: "Name <email@example.com>" -> "email@example.com")
   */
  extractEmail(fromField) {
    const match = fromField.match(/<(.+?)>/);
    return match ? match[1] : fromField;
  }
}

module.exports = new GmailService();
