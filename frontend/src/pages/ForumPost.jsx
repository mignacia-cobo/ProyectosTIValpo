import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MessageCircle, Send, CheckCircle, X } from 'lucide-react';
import { getPostById, createComment } from '../services/forum.service';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ForumPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [commentForm, setCommentForm] = useState({
    author_name: '',
    author_email: '',
    content: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadPost();
  }, [id]);

  const loadPost = async () => {
    try {
      setLoading(true);
      const response = await getPostById(id);
      setPost(response.data.post);
      setComments(response.data.comments);
    } catch (error) {
      console.error('Error al cargar publicación:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      await createComment({
        post_id: parseInt(id),
        ...commentForm
      });
      
      setShowSuccess(true);
      setCommentForm({ author_name: '', author_email: '', content: '' });
      setShowCommentForm(false);
      
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    } catch (error) {
      console.error('Error al enviar comentario:', error);
      alert('Error al enviar el comentario. Por favor intenta nuevamente.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Cargando publicación...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!post) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Publicación no encontrada
            </h2>
            <Link
              to="/forum"
              className="text-blue-600 hover:text-blue-700"
            >
              Volver al foro
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Botón volver */}
            <Link
              to="/forum"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al foro
          </Link>

          {/* Mensaje de éxito */}
          {showSuccess && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-green-800">
                  ¡Comentario enviado exitosamente!
                </p>
                <p className="text-sm text-green-700 mt-1">
                  Tu comentario estará visible una vez sea aprobado por el administrador.
                </p>
              </div>
            </div>
          )}

          {/* Publicación principal */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>
            
            <div className="flex items-center gap-6 text-sm text-gray-500 mb-6 pb-6 border-b">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(post.created_at)}</span>
              </div>
              <div className="text-gray-700 font-medium">
                Por: {post.author_name}
              </div>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {post.content}
              </p>
            </div>
          </div>

          {/* Sección de comentarios */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <MessageCircle className="w-6 h-6 text-blue-600" />
                Comentarios ({comments.length})
              </h2>
              <button
                onClick={() => setShowCommentForm(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center gap-2 font-semibold"
              >
                <Send className="w-4 h-4" />
                Agregar Comentario
              </button>
            </div>

            {/* Lista de comentarios */}
            {comments.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-2">No hay comentarios aún</p>
                <p className="text-gray-400 text-sm">¡Sé el primero en comentar!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {comments.map((comment, index) => (
                  <div
                    key={comment.id}
                    className={`p-6 rounded-xl border-2 transition-all duration-300 hover:shadow-md ${
                      comment.is_admin_reply
                        ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-300 shadow-sm'
                        : 'bg-white border-gray-200 hover:border-blue-200'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                          comment.is_admin_reply 
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600' 
                            : 'bg-gradient-to-r from-gray-400 to-gray-500'
                        }`}>
                          {comment.author_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-900">
                              {comment.author_name}
                            </span>
                            {comment.is_admin_reply && (
                              <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs px-2.5 py-1 rounded-full font-semibold shadow-sm">
                                Administrador
                              </span>
                            )}
                          </div>
                          <span className="text-sm text-gray-500">
                            {formatDate(comment.created_at)}
                          </span>
                        </div>
                      </div>
                      <span className="text-sm font-medium text-gray-400">
                        #{comments.length - index}
                      </span>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed ml-13">
                      {comment.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    <Footer />

    {/* Modal de comentario */}
    {showCommentForm && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl flex items-center justify-between">
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <MessageCircle className="w-6 h-6" />
              Agregar Comentario
            </h3>
            <button
              onClick={() => setShowCommentForm(false)}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all duration-300"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmitComment} className="p-6">
            <div className="mb-4 bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-800">
                <strong>Nota:</strong> Tu comentario será revisado por un administrador antes de ser publicado.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tu nombre *
                </label>
                <input
                  type="text"
                  required
                  value={commentForm.author_name}
                  onChange={(e) => setCommentForm({...commentForm, author_name: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  placeholder="Juan Pérez"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tu email *
                </label>
                <input
                  type="email"
                  required
                  value={commentForm.author_email}
                  onChange={(e) => setCommentForm({...commentForm, author_email: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  placeholder="juan@example.com"
                />
                <p className="text-xs text-gray-500 mt-1">No será publicado públicamente</p>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tu comentario *
              </label>
              <textarea
                required
                value={commentForm.content}
                onChange={(e) => setCommentForm({...commentForm, content: e.target.value})}
                rows="6"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 resize-none"
                placeholder="Escribe tu comentario aquí..."
              />
              <p className="text-xs text-gray-500 mt-1">
                {commentForm.content.length} caracteres
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 font-semibold"
              >
                <Send className="w-5 h-5" />
                {submitting ? 'Enviando...' : 'Enviar Comentario'}
              </button>
              <button
                type="button"
                onClick={() => setShowCommentForm(false)}
                className="px-8 py-3 border-2 border-gray-300 rounded-full hover:bg-gray-50 transition-all duration-300 font-semibold"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
    </>
  );
};

export default ForumPost;
