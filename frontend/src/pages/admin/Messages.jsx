import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { contactService } from '../../services';
import { toast } from 'react-toastify';
import { FaEnvelope, FaEnvelopeOpen, FaTrash, FaCalendar, FaUser, FaReply, FaTimes, FaPaperPlane, FaCheck, FaStickyNote, FaExternalLinkAlt, FaClock } from 'react-icons/fa';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, read, unread
  const [replyModal, setReplyModal] = useState({ isOpen: false, message: null });
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const [notesModal, setNotesModal] = useState({ isOpen: false, message: null });
  const [notesText, setNotesText] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const data = await contactService.getAllMessages();
      setMessages(data);
    } catch (error) {
      toast.error('Error al cargar mensajes');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await contactService.markAsRead(id);
      toast.success('Mensaje marcado como leído');
      loadMessages();
    } catch (error) {
      toast.error('Error al marcar mensaje');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este mensaje?')) return;

    try {
      await contactService.deleteMessage(id);
      toast.success('Mensaje eliminado exitosamente');
      loadMessages();
    } catch (error) {
      toast.error('Error al eliminar mensaje');
    }
  };

  const openReplyModal = (message) => {
    setReplyModal({ isOpen: true, message });
    setReplyText('');
  };

  const closeReplyModal = () => {
    setReplyModal({ isOpen: false, message: null });
    setReplyText('');
  };

  const handleSendReply = async () => {
    if (!replyText.trim()) {
      toast.error('Escribe un mensaje de respuesta');
      return;
    }

    setSending(true);
    try {
      await contactService.replyToMessage(replyModal.message.id, replyText);
      toast.success('Respuesta enviada exitosamente');
      closeReplyModal();
      loadMessages();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error al enviar respuesta');
    } finally {
      setSending(false);
    }
  };

  const openNotesModal = (message) => {
    setNotesModal({ isOpen: true, message });
    setNotesText(message.notes || '');
  };

  const closeNotesModal = () => {
    setNotesModal({ isOpen: false, message: null });
    setNotesText('');
  };

  const handleSaveNotes = async () => {
    setSavingNotes(true);
    try {
      await contactService.updateNotes(notesModal.message.id, notesText);
      toast.success('Notas guardadas exitosamente');
      closeNotesModal();
      loadMessages();
    } catch (error) {
      toast.error('Error al guardar notas');
    } finally {
      setSavingNotes(false);
    }
  };

  const handleMarkAsChecked = async (id) => {
    try {
      await contactService.markAsChecked(id);
      toast.success('Marcado como revisado');
      loadMessages();
    } catch (error) {
      toast.error('Error al marcar como revisado');
    }
  };

  const openInGmail = (email) => {
    const gmailUrl = `https://mail.google.com/mail/u/0/#search/from%3A${encodeURIComponent(email)}`;
    window.open(gmailUrl, '_blank');
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredMessages = messages.filter(msg => {
    if (filter === 'read') return msg.read;
    if (filter === 'unread') return !msg.read;
    return true;
  });

  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mensajes de Contacto</h1>
        <p className="text-gray-600">
          {unreadCount > 0 && (
            <span className="text-red-600 font-semibold">
              {unreadCount} mensaje{unreadCount !== 1 ? 's' : ''} sin leer
            </span>
          )}
          {unreadCount === 0 && 'No hay mensajes sin leer'}
        </p>
      </div>

      {/* Filtros */}
      <div className="mb-6 flex space-x-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg transition ${
            filter === 'all'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Todos ({messages.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-2 rounded-lg transition ${
            filter === 'unread'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Sin leer ({unreadCount})
        </button>
        <button
          onClick={() => setFilter('read')}
          className={`px-4 py-2 rounded-lg transition ${
            filter === 'read'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Leídos ({messages.length - unreadCount})
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : filteredMessages.length > 0 ? (
        <div className="space-y-4">
          {filteredMessages.map((message) => (
            <div
              key={message.id}
              className={`card p-6 ${
                !message.read ? 'border-l-4 border-primary-600' : ''
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-start space-x-3">
                  <div className={`mt-1 ${!message.read ? 'text-primary-600' : 'text-gray-400'}`}>
                    {!message.read ? <FaEnvelope size={20} /> : <FaEnvelopeOpen size={20} />}
                  </div>
                  <div>
                    <div className="flex items-center space-x-3 mb-1">
                      <h3 className="text-lg font-bold text-gray-900 flex items-center">
                        <FaUser className="mr-2 text-gray-500" />
                        {message.name}
                      </h3>
                      {!message.read && (
                        <span className="bg-red-100 text-red-600 text-xs font-semibold px-2 py-1 rounded">
                          Nuevo
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm">
                      <a href={`mailto:${message.email}`} className="hover:text-primary-600">
                        {message.email}
                      </a>
                    </p>
                    <div className="flex items-center text-gray-500 text-xs mt-1">
                      <FaCalendar className="mr-1" />
                      <span>{formatDate(message.created_at)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  {!message.read && (
                    <button
                      onClick={() => handleMarkAsRead(message.id)}
                      className="text-primary-600 hover:text-primary-700 text-sm"
                      title="Marcar como leído"
                    >
                      <FaEnvelopeOpen />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(message.id)}
                    className="text-red-600 hover:text-red-700 text-sm"
                    title="Eliminar"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 whitespace-pre-wrap">{message.message}</p>
              </div>

              {message.replied && (
                <div className="mt-4 bg-green-50 border border-green-200 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <FaCheck className="text-green-600 mr-2" />
                    <span className="text-green-700 font-semibold text-sm">
                      Respondido el {formatDate(message.replied_at)}
                    </span>
                  </div>
                  {message.reply_message && (
                    <p className="text-gray-600 text-sm whitespace-pre-wrap">{message.reply_message}</p>
                  )}
                </div>
              )}

              {message.notes && (
                <div className="mt-4 bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <FaStickyNote className="text-yellow-600 mr-2" />
                    <span className="text-yellow-700 font-semibold text-sm">Notas internas:</span>
                  </div>
                  <p className="text-gray-700 text-sm whitespace-pre-wrap">{message.notes}</p>
                </div>
              )}

              {message.last_checked_at && (
                <div className="mt-3 text-xs text-gray-500 flex items-center">
                  <FaClock className="mr-1" />
                  <span>Última revisión: {formatDate(message.last_checked_at)}</span>
                  {message.last_checked_by && <span className="ml-2">por {message.last_checked_by}</span>}
                </div>
              )}

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  onClick={() => openReplyModal(message)}
                  className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 text-sm font-semibold transition"
                >
                  <FaReply />
                  <span>{message.replied ? 'Responder nuevamente' : 'Responder por correo'}</span>
                </button>
                
                <button
                  onClick={() => openInGmail(message.email)}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm font-semibold transition"
                >
                  <FaExternalLinkAlt />
                  <span>Revisar en Gmail</span>
                </button>
                
                <button
                  onClick={() => openNotesModal(message)}
                  className="flex items-center space-x-2 text-amber-600 hover:text-amber-700 text-sm font-semibold transition"
                >
                  <FaStickyNote />
                  <span>{message.notes ? 'Editar notas' : 'Agregar notas'}</span>
                </button>
                
                <button
                  onClick={() => handleMarkAsChecked(message.id)}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-700 text-sm transition"
                >
                  <FaClock />
                  <span>Marcar como revisado</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center">
          <FaEnvelope className="mx-auto text-gray-400 text-5xl mb-4" />
          <p className="text-gray-600">
            {filter === 'all' && 'No hay mensajes'}
            {filter === 'unread' && 'No hay mensajes sin leer'}
            {filter === 'read' && 'No hay mensajes leídos'}
          </p>
        </div>
      )}

      {/* Modal de Respuesta */}
      {replyModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header del modal */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">Responder mensaje</h2>
                <p className="text-gray-600 text-sm">
                  Respondiendo a: <span className="font-semibold">{replyModal.message?.name}</span> ({replyModal.message?.email})
                </p>
              </div>
              <button
                onClick={closeReplyModal}
                className="text-gray-400 hover:text-gray-600 transition"
                disabled={sending}
              >
                <FaTimes size={24} />
              </button>
            </div>

            {/* Contenido del modal */}
            <div className="p-6">
              {/* Mensaje original */}
              <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Mensaje original:</p>
                <p className="text-gray-700 whitespace-pre-wrap">{replyModal.message?.message}</p>
                <div className="flex items-center text-gray-500 text-xs mt-3">
                  <FaCalendar className="mr-1" />
                  <span>{formatDate(replyModal.message?.created_at)}</span>
                </div>
              </div>

              {/* Área de respuesta */}
              <div>
                <label htmlFor="replyText" className="block text-sm font-semibold text-gray-700 mb-2">
                  Tu respuesta:
                </label>
                <textarea
                  id="replyText"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Escribe tu respuesta aquí..."
                  rows="8"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  disabled={sending}
                />
                <p className="text-xs text-gray-500 mt-2">
                  Este mensaje se enviará desde: contacto@proyectostivalpo.com
                </p>
              </div>

              {/* Vista previa del formato */}
              {replyText && (
                <div className="mt-4 bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <p className="text-xs text-blue-700 uppercase font-semibold mb-2">Vista previa:</p>
                  <div className="text-sm text-gray-700">
                    <p className="mb-2">Hola <strong>{replyModal.message?.name}</strong>,</p>
                    <p className="mb-2">Gracias por contactarnos. A continuación, respondemos a tu mensaje:</p>
                    <div className="bg-white p-3 border-l-4 border-blue-500 my-2">
                      <p className="whitespace-pre-wrap">{replyText}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      + Tu mensaje original y firma del equipo
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer del modal */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 flex justify-end space-x-3">
              <button
                onClick={closeReplyModal}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
                disabled={sending}
              >
                Cancelar
              </button>
              <button
                onClick={handleSendReply}
                disabled={!replyText.trim() || sending}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {sending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Enviando...</span>
                  </>
                ) : (
                  <>
                    <FaPaperPlane />
                    <span>Enviar respuesta</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Notas Internas */}
      {notesModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
            {/* Header del modal */}
            <div className="bg-amber-50 border-b border-amber-200 p-6 flex justify-between items-start rounded-t-lg">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1 flex items-center">
                  <FaStickyNote className="text-amber-600 mr-2" />
                  Notas Internas
                </h2>
                <p className="text-gray-600 text-sm">
                  Mensaje de: <span className="font-semibold">{notesModal.message?.name}</span> ({notesModal.message?.email})
                </p>
              </div>
              <button
                onClick={closeNotesModal}
                className="text-gray-400 hover:text-gray-600 transition"
                disabled={savingNotes}
              >
                <FaTimes size={24} />
              </button>
            </div>

            {/* Contenido del modal */}
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-4">
                Estas notas son <strong>privadas</strong> y solo visibles para el equipo de administración.
                Úsalas para registrar conversaciones, seguimientos o cualquier información relevante sobre este mensaje.
              </p>

              {/* Área de notas */}
              <div>
                <label htmlFor="notesText" className="block text-sm font-semibold text-gray-700 mb-2">
                  Tus notas:
                </label>
                <textarea
                  id="notesText"
                  value={notesText}
                  onChange={(e) => setNotesText(e.target.value)}
                  placeholder="Ejemplo: Usuario preguntó por precios. Le respondí por teléfono el 26/10..."
                  rows="8"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                  disabled={savingNotes}
                />
                <p className="text-xs text-gray-500 mt-2">
                  {notesModal.message?.last_checked_at && (
                    <>Última revisión: {formatDate(notesModal.message.last_checked_at)}</>
                  )}
                </p>
              </div>
            </div>

            {/* Footer del modal */}
            <div className="bg-gray-50 border-t border-gray-200 p-6 flex justify-end space-x-3 rounded-b-lg">
              <button
                onClick={closeNotesModal}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
                disabled={savingNotes}
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveNotes}
                disabled={savingNotes}
                className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {savingNotes ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Guardando...</span>
                  </>
                ) : (
                  <>
                    <FaStickyNote />
                    <span>Guardar notas</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Messages;
