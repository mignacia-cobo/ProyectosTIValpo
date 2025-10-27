import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Calendar, MessageCircle, Plus, X, Send, User } from 'lucide-react';
import { getApprovedPosts, createPost } from '../services/forum.service';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Forum = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [postForm, setPostForm] = useState({
    title: '',
    content: '',
    author_name: '',
    author_email: ''
  });

  useEffect(() => {
    loadPosts();
  }, [currentPage]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const response = await getApprovedPosts(currentPage, 10);
      setPosts(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error al cargar publicaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleSubmitPost = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      await createPost(postForm);
      
      setShowSuccess(true);
      setPostForm({ title: '', content: '', author_name: '', author_email: '' });
      setShowNewPostModal(false);
      
      setTimeout(() => {
        setShowSuccess(false);
        loadPosts();
      }, 3000);
    } catch (error) {
      console.error('Error al crear publicación:', error);
      alert('Error al crear la publicación. Por favor intenta nuevamente.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-16">
        {/* Hero del Foro */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-block p-4 bg-white/10 rounded-full mb-6 backdrop-blur-sm">
                <MessageSquare className="w-12 h-12" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Foro de Discusión
              </h1>
              <p className="text-xl text-blue-50 mb-8">
                Comparte ideas, haz preguntas y conecta con la comunidad tecnológica
              </p>
              <button
                onClick={() => setShowNewPostModal(true)}
                className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition transform hover:scale-105 shadow-lg"
              >
                <Plus className="w-5 h-5" />
                Nueva Publicación
              </button>
            </div>
          </div>
        </div>

        {/* Lista de Publicaciones */}
        <div className="container mx-auto px-4 py-12">
          {/* Mensaje de éxito */}
          {showSuccess && (
            <div className="mb-6 bg-green-50 border-2 border-green-300 rounded-xl p-4 flex items-start gap-3 max-w-4xl mx-auto">
              <svg className="w-6 h-6 flex-shrink-0 mt-0.5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-semibold text-green-800">¡Publicación enviada exitosamente!</p>
                <p className="text-sm text-green-600">Estará visible una vez que sea aprobada por un administrador.</p>
              </div>
            </div>
          )}

          <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Cargando publicaciones...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <div className="inline-block p-4 bg-blue-50 rounded-full mb-4">
                <MessageSquare className="w-16 h-16 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                No hay publicaciones aún
              </h3>
              <p className="text-gray-600 mb-6">
                Sé el primero en crear una publicación
              </p>
              <button
                onClick={() => setShowNewPostModal(true)}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full hover:shadow-lg transition transform hover:scale-105 font-semibold"
              >
                <Plus className="w-5 h-5" />
                Crear Publicación
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="block bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-blue-200 transform hover:-translate-y-1"
                  >
                    <Link to={`/forum/post/${post.id}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition">
                            {post.title}
                          </h3>
                          <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                            {post.content}
                          </p>
                          <div className="flex items-center gap-6 text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-blue-500" />
                              <span className="font-medium">{post.author_name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span>{formatDate(post.created_at)}</span>
                            </div>
                            <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full">
                              <MessageCircle className="w-4 h-4 text-blue-600" />
                              <span className="text-blue-700 font-medium">
                                {post.comments_count || 0}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>

              {/* Paginación */}
              {pagination.pages > 1 && (
                <div className="mt-8 flex justify-center gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-6 py-2 rounded-full border-2 border-blue-600 text-blue-600 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 hover:text-white transition"
                  >
                    Anterior
                  </button>
                  <div className="flex items-center gap-2">
                    {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 rounded-full font-semibold transition ${
                          currentPage === page
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                            : 'border-2 border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-600'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(pagination.pages, p + 1))}
                    disabled={currentPage === pagination.pages}
                    className="px-6 py-2 rounded-full border-2 border-blue-600 text-blue-600 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 hover:text-white transition"
                  >
                    Siguiente
                  </button>
                </div>
              )}
            </>
          )}
          </div>
        </div>
      </div>
      <Footer />

      {/* Modal de nueva publicación */}
      {showNewPostModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl flex items-center justify-between">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <Plus className="w-6 h-6" />
                Nueva Publicación
              </h3>
              <button
                onClick={() => setShowNewPostModal(false)}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all duration-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmitPost} className="p-6">
              <div className="mb-4 bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm text-blue-800">
                  <strong>Nota:</strong> Tu publicación será revisada por un administrador antes de ser publicada.
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Título *
                </label>
                <input
                  type="text"
                  required
                  value={postForm.title}
                  onChange={(e) => setPostForm({...postForm, title: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  placeholder="¿Sobre qué quieres hablar?"
                  maxLength={255}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {postForm.title.length}/255 caracteres
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Contenido *
                </label>
                <textarea
                  required
                  value={postForm.content}
                  onChange={(e) => setPostForm({...postForm, content: e.target.value})}
                  rows="8"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 resize-none"
                  placeholder="Escribe el contenido de tu publicación aquí..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  {postForm.content.length} caracteres
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tu nombre *
                  </label>
                  <input
                    type="text"
                    required
                    value={postForm.author_name}
                    onChange={(e) => setPostForm({...postForm, author_name: e.target.value})}
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
                    value={postForm.author_email}
                    onChange={(e) => setPostForm({...postForm, author_email: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                    placeholder="juan@example.com"
                  />
                  <p className="text-xs text-gray-500 mt-1">No será publicado públicamente</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 font-semibold"
                >
                  <Send className="w-5 h-5" />
                  {submitting ? 'Publicando...' : 'Publicar'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewPostModal(false)}
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

export default Forum;
