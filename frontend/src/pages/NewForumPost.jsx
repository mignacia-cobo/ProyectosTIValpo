import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, CheckCircle } from 'lucide-react';
import { createPost } from '../services/forum.service';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const NewForumPost = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author_name: '',
    author_email: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      await createPost(formData);
      
      setShowSuccess(true);
      setFormData({ title: '', content: '', author_name: '', author_email: '' });
      
      // Redirigir al foro después de 3 segundos
      setTimeout(() => {
        navigate('/forum');
      }, 3000);
    } catch (error) {
      console.error('Error al crear publicación:', error);
      alert('Error al crear la publicación. Por favor intenta nuevamente.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
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
                  ¡Publicación enviada exitosamente!
                </p>
                <p className="text-sm text-green-700 mt-1">
                  Tu publicación estará visible una vez sea aprobada por el administrador. Redirigiendo...
                </p>
              </div>
            </div>
          )}

          {/* Formulario */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Nueva Publicación
            </h1>
            <p className="text-gray-600 mb-8">
              Comparte tus ideas, preguntas o conocimientos con la comunidad
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="¿Sobre qué quieres hablar?"
                  maxLength={255}
                />
                <p className="text-sm text-gray-500 mt-1">
                  {formData.title.length}/255 caracteres
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contenido *
                </label>
                <textarea
                  name="content"
                  required
                  value={formData.content}
                  onChange={handleChange}
                  rows="10"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Escribe el contenido de tu publicación aquí..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tu nombre *
                  </label>
                  <input
                    type="text"
                    name="author_name"
                    required
                    value={formData.author_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Juan Pérez"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tu email *
                  </label>
                  <input
                    type="email"
                    name="author_email"
                    required
                    value={formData.author_email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="juan@example.com"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    No será publicado públicamente
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Nota:</strong> Tu publicación será revisada por un administrador antes de ser publicada. 
                  Recibirás una notificación cuando sea aprobada.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-semibold"
                >
                  <Send className="w-5 h-5" />
                  {submitting ? 'Enviando...' : 'Publicar'}
                </button>
                <Link
                  to="/forum"
                  className="px-8 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-semibold"
                >
                  Cancelar
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default NewForumPost;
