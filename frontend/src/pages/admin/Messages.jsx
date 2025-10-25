import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { contactService } from '../../services';
import { toast } from 'react-toastify';
import { FaEnvelope, FaEnvelopeOpen, FaTrash, FaCalendar, FaUser } from 'react-icons/fa';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, read, unread

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

              <div className="mt-4">
                <a
                  href={`mailto:${message.email}?subject=Re: Mensaje desde ProyectosTI Valpo`}
                  className="text-primary-600 hover:text-primary-700 text-sm font-semibold"
                >
                  Responder por correo →
                </a>
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
    </AdminLayout>
  );
};

export default Messages;
