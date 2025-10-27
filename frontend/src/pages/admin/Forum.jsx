import { useState, useEffect } from 'react';
import { 
  MessageSquare, CheckCircle, XCircle, Trash2, MessageCircle, 
  Calendar, User, Mail, AlertCircle, Eye, Send 
} from 'lucide-react';
import { toast } from 'react-toastify';
import AdminLayout from '../../components/AdminLayout';
import {
  getAllPosts,
  getAllComments,
  moderatePost,
  moderateComment,
  deletePost,
  deleteComment,
  createAdminReply
} from '../../services/forum.service';

const ForumAdmin = () => {
  const [activeTab, setActiveTab] = useState('posts');
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('pending');
  const [selectedPost, setSelectedPost] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [showReplyModal, setShowReplyModal] = useState(false);

  useEffect(() => {
    loadData();
  }, [activeTab, filterStatus]);

  const loadData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'posts') {
        const response = await getAllPosts(filterStatus);
        setPosts(response.data);
      } else {
        const response = await getAllComments(filterStatus);
        setComments(response.data);
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
      toast.error('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleModeratePost = async (id, status, notes = '') => {
    try {
      await moderatePost(id, status, notes);
      toast.success(`Publicación ${status === 'approved' ? 'aprobada' : 'rechazada'} exitosamente`);
      loadData();
    } catch (error) {
      console.error('Error al moderar publicación:', error);
      toast.error('Error al moderar la publicación');
    }
  };

  const handleModerateComment = async (id, status) => {
    try {
      await moderateComment(id, status);
      toast.success(`Comentario ${status === 'approved' ? 'aprobado' : 'rechazado'} exitosamente`);
      loadData();
    } catch (error) {
      console.error('Error al moderar comentario:', error);
      toast.error('Error al moderar el comentario');
    }
  };

  const handleDeletePost = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta publicación?')) {
      return;
    }

    try {
      await deletePost(id);
      toast.success('Publicación eliminada exitosamente');
      loadData();
    } catch (error) {
      console.error('Error al eliminar publicación:', error);
      toast.error('Error al eliminar la publicación');
    }
  };

  const handleDeleteComment = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este comentario?')) {
      return;
    }

    try {
      await deleteComment(id);
      toast.success('Comentario eliminado exitosamente');
      loadData();
    } catch (error) {
      console.error('Error al eliminar comentario:', error);
      toast.error('Error al eliminar el comentario');
    }
  };

  const handleAdminReply = async (postId) => {
    if (!replyContent.trim()) {
      toast.error('Por favor escribe una respuesta');
      return;
    }

    try {
      await createAdminReply(postId, replyContent);
      toast.success('Respuesta publicada exitosamente');
      setReplyContent('');
      setShowReplyModal(false);
      setSelectedPost(null);
    } catch (error) {
      console.error('Error al publicar respuesta:', error);
      toast.error('Error al publicar la respuesta');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pendiente' },
      approved: { bg: 'bg-green-100', text: 'text-green-800', label: 'Aprobado' },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rechazado' }
    };
    const badge = badges[status] || badges.pending;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-blue-600" />
            Moderación del Foro
          </h1>
          <p className="text-gray-600 mt-2">
            Administra las publicaciones y comentarios del foro
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b">
          <button
            onClick={() => setActiveTab('posts')}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === 'posts'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Publicaciones
          </button>
          <button
            onClick={() => setActiveTab('comments')}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === 'comments'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Comentarios
          </button>
        </div>

        {/* Filtros */}
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filterStatus === 'pending'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Pendientes
          </button>
          <button
            onClick={() => setFilterStatus('approved')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filterStatus === 'approved'
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Aprobados
          </button>
          <button
            onClick={() => setFilterStatus('rejected')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filterStatus === 'rejected'
                ? 'bg-red-100 text-red-800'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Rechazados
          </button>
          <button
            onClick={() => setFilterStatus(null)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filterStatus === null
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Todos
          </button>
        </div>

        {/* Contenido */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Cargando...</p>
          </div>
        ) : activeTab === 'posts' ? (
          <div className="space-y-4">
            {posts.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <AlertCircle className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">
                  No hay publicaciones {filterStatus ? `en estado "${filterStatus}"` : ''}
                </p>
              </div>
            ) : (
              posts.map((post) => (
                <div key={post.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {post.title}
                        </h3>
                        {getStatusBadge(post.status)}
                      </div>
                      <p className="text-gray-700 mb-4 whitespace-pre-wrap">
                        {post.content}
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>{post.author_name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          <span>{post.author_email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(post.created_at)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MessageCircle className="w-4 h-4" />
                          <span>
                            {post.total_comments} comentarios
                            {post.pending_comments > 0 && 
                              ` (${post.pending_comments} pendientes)`
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {post.admin_notes && (
                    <div className="bg-gray-50 rounded p-3 mb-4">
                      <p className="text-sm text-gray-600">
                        <strong>Notas del admin:</strong> {post.admin_notes}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {post.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleModeratePost(post.id, 'approved')}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Aprobar
                        </button>
                        <button
                          onClick={() => handleModeratePost(post.id, 'rejected')}
                          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                        >
                          <XCircle className="w-4 h-4" />
                          Rechazar
                        </button>
                      </>
                    )}
                    {post.status === 'approved' && (
                      <button
                        onClick={() => {
                          setSelectedPost(post);
                          setShowReplyModal(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                      >
                        <Send className="w-4 h-4" />
                        Responder
                      </button>
                    )}
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                      Eliminar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {comments.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <AlertCircle className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">
                  No hay comentarios {filterStatus ? `en estado "${filterStatus}"` : ''}
                </p>
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-semibold text-gray-700">
                          En: {comment.post_title}
                        </span>
                        {getStatusBadge(comment.status)}
                        {comment.is_admin_reply && (
                          <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
                            Respuesta Admin
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700 mb-4 whitespace-pre-wrap">
                        {comment.content}
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>{comment.author_name}</span>
                        </div>
                        {!comment.is_admin_reply && (
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            <span>{comment.author_email}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(comment.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {comment.status === 'pending' && !comment.is_admin_reply && (
                      <>
                        <button
                          onClick={() => handleModerateComment(comment.id, 'approved')}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Aprobar
                        </button>
                        <button
                          onClick={() => handleModerateComment(comment.id, 'rejected')}
                          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                        >
                          <XCircle className="w-4 h-4" />
                          Rechazar
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                      Eliminar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Modal de respuesta */}
        {showReplyModal && selectedPost && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
              <h3 className="text-xl font-bold mb-4">
                Responder a: {selectedPost.title}
              </h3>
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                rows="6"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
                placeholder="Escribe tu respuesta como administrador..."
              />
              <div className="flex gap-3">
                <button
                  onClick={() => handleAdminReply(selectedPost.id)}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <Send className="w-4 h-4" />
                  Publicar Respuesta
                </button>
                <button
                  onClick={() => {
                    setShowReplyModal(false);
                    setSelectedPost(null);
                    setReplyContent('');
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ForumAdmin;
