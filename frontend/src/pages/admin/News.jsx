import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { newsService } from '../../services';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaCalendar } from 'react-icons/fa';

const News = () => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    summary: '',
    published_date: new Date().toISOString().split('T')[0],
    active: true
  });
  const [imageFile, setImageFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]); // Nuevas imágenes de galería
  const [existingGallery, setExistingGallery] = useState([]); // Imágenes existentes
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      const data = await newsService.getAllAdmin();
      setNewsList(data);
    } catch (error) {
      toast.error('Error al cargar noticias');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = async (news = null) => {
    if (news) {
      setEditingNews(news);
      setFormData({
        title: news.title,
        content: news.content,
        summary: news.summary || '',
        published_date: new Date(news.published_date).toISOString().split('T')[0],
        active: news.active
      });
      
      // Cargar galería desde el servidor
      try {
        const newsDetail = await newsService.getById(news.id);
        setExistingGallery(newsDetail.gallery || []);
      } catch (error) {
        console.error('Error al cargar galería:', error);
        setExistingGallery([]);
      }
    } else {
      setEditingNews(null);
      setFormData({
        title: '',
        content: '',
        summary: '',
        published_date: new Date().toISOString().split('T')[0],
        active: true
      });
      setExistingGallery([]);
    }
    setImageFile(null);
    setGalleryFiles([]);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingNews(null);
    setImageFile(null);
    setGalleryFiles([]);
    setExistingGallery([]);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleGalleryChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setGalleryFiles(prev => [...prev, ...filesArray]);
    }
  };

  const removeGalleryFile = (index) => {
    setGalleryFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingGalleryImage = async (imageId) => {
    if (!confirm('¿Eliminar esta imagen de la galería?')) return;
    
    try {
      await newsService.deleteGalleryImage(imageId);
      setExistingGallery(prev => prev.filter(img => img.id !== imageId));
      toast.success('Imagen eliminada');
    } catch (error) {
      toast.error('Error al eliminar imagen');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('content', formData.content);
      data.append('summary', formData.summary);
      data.append('published_date', formData.published_date);
      data.append('active', formData.active);

      if (imageFile) {
        data.append('image', imageFile);
      }

      // Agregar imágenes de galería
      galleryFiles.forEach((file, index) => {
        data.append('gallery', file);
      });

      if (editingNews) {
        await newsService.update(editingNews.id, data);
        toast.success('Noticia actualizada exitosamente');
      } else {
        await newsService.create(data);
        toast.success('Noticia creada exitosamente');
      }

      handleCloseModal();
      loadNews();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error al guardar noticia');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta noticia?')) return;

    try {
      await newsService.delete(id);
      toast.success('Noticia eliminada exitosamente');
      loadNews();
    } catch (error) {
      toast.error('Error al eliminar noticia');
    }
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return 'https://via.placeholder.com/150';
    return `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${imageUrl}`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <AdminLayout>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Noticias</h1>
          <p className="text-gray-600">Administra las novedades del sitio</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="btn-primary flex items-center"
        >
          <FaPlus className="mr-2" />
          Nueva Noticia
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : newsList.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {newsList.map((news) => (
            <div key={news.id} className="card p-6 flex flex-col md:flex-row gap-6">
              <img
                src={getImageUrl(news.image_url)}
                alt={news.title}
                className="w-full md:w-48 h-48 object-cover rounded"
              />
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{news.title}</h3>
                  <div className="flex items-center space-x-2">
                    {news.active ? (
                      <span className="flex items-center text-green-600 text-sm">
                        <FaToggleOn className="mr-1" /> Activa
                      </span>
                    ) : (
                      <span className="flex items-center text-gray-400 text-sm">
                        <FaToggleOff className="mr-1" /> Inactiva
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center text-gray-500 text-sm mb-3">
                  <FaCalendar className="mr-2" />
                  <span>{formatDate(news.published_date)}</span>
                </div>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {news.summary || news.content}
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleOpenModal(news)}
                    className="text-primary-600 hover:text-primary-700 flex items-center"
                  >
                    <FaEdit className="mr-1" /> Editar
                  </button>
                  <button
                    onClick={() => handleDelete(news.id)}
                    className="text-red-600 hover:text-red-700 flex items-center"
                  >
                    <FaTrash className="mr-1" /> Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center">
          <p className="text-gray-600 mb-4">No hay noticias registradas</p>
          <button
            onClick={() => handleOpenModal()}
            className="btn-primary inline-flex items-center"
          >
            <FaPlus className="mr-2" />
            Crear Primera Noticia
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {editingNews ? 'Editar Noticia' : 'Nueva Noticia'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="label">Título</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="Título de la noticia"
                  />
                </div>

                <div>
                  <label className="label">Resumen (opcional)</label>
                  <textarea
                    name="summary"
                    value={formData.summary}
                    onChange={handleChange}
                    rows={2}
                    className="input-field"
                    placeholder="Breve resumen para vista previa..."
                  />
                </div>

                <div>
                  <label className="label">Contenido</label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    required
                    rows={8}
                    className="input-field"
                    placeholder="Contenido completo de la noticia..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Fecha de Publicación</label>
                    <input
                      type="date"
                      name="published_date"
                      value={formData.published_date}
                      onChange={handleChange}
                      required
                      className="input-field"
                    />
                  </div>

                  <div className="flex items-center pt-8">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="active"
                        checked={formData.active}
                        onChange={handleChange}
                        className="form-checkbox h-5 w-5 text-primary-600"
                      />
                      <span className="ml-2 text-gray-700">Noticia activa</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="label">Imagen Principal</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="input-field"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Imagen de portada (máx. 5MB)
                  </p>
                  {editingNews?.image_url && !imageFile && (
                    <div className="mt-2">
                      <img
                        src={getImageUrl(editingNews.image_url)}
                        alt="Actual"
                        className="h-32 w-auto rounded"
                      />
                    </div>
                  )}
                </div>

                {/* Galería de Imágenes */}
                <div className="border-t pt-4">
                  <label className="label">Galería de Imágenes (Carrusel)</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryChange}
                    className="input-field"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Selecciona múltiples imágenes para el carrusel (máx. 5MB c/u)
                  </p>

                  {/* Imágenes existentes */}
                  {existingGallery.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Imágenes actuales:</p>
                      <div className="grid grid-cols-4 gap-4">
                        {existingGallery.map((img) => (
                          <div key={img.id} className="relative group">
                            <img
                              src={getImageUrl(img.image_url)}
                              alt={img.caption || 'Imagen galería'}
                              className="h-24 w-full object-cover rounded"
                            />
                            <button
                              type="button"
                              onClick={() => removeExistingGalleryImage(img.id)}
                              className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <FaTrash size={12} />
                            </button>
                            {img.caption && (
                              <p className="text-xs text-gray-600 mt-1 truncate">{img.caption}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Nuevas imágenes seleccionadas */}
                  {galleryFiles.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Nuevas imágenes:</p>
                      <div className="grid grid-cols-4 gap-4">
                        {galleryFiles.map((file, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Nueva ${index + 1}`}
                              className="h-24 w-full object-cover rounded"
                            />
                            <button
                              type="button"
                              onClick={() => removeGalleryFile(index)}
                              className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <FaTrash size={12} />
                            </button>
                            <p className="text-xs text-gray-600 mt-1 truncate">{file.name}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-4 pt-4 border-t">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="btn-secondary"
                    disabled={submitting}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={submitting}
                  >
                    {submitting ? 'Guardando...' : 'Guardar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default News;
