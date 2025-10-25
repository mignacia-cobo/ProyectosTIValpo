import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { projectService } from '../../services';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaExternalLinkAlt, FaToggleOn, FaToggleOff } from 'react-icons/fa';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    description: '',
    url: '',
    order_index: 0,
    active: true
  });
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await projectService.getAllAdmin();
      setProjects(data);
    } catch (error) {
      toast.error('Error al cargar proyectos');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (project = null) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        name: project.name,
        title: project.title || '',
        description: project.description,
        url: project.url,
        order_index: project.order_index,
        active: project.active
      });
    } else {
      setEditingProject(null);
      setFormData({
        name: '',
        title: '',
        description: '',
        url: '',
        order_index: 0,
        active: true
      });
    }
    setImageFile(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProject(null);
    setImageFile(null);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('url', formData.url);
      data.append('order_index', formData.order_index);
      data.append('active', formData.active);

      if (imageFile) {
        data.append('image', imageFile);
      }

      if (editingProject) {
        await projectService.update(editingProject.id, data);
        toast.success('Proyecto actualizado exitosamente');
      } else {
        await projectService.create(data);
        toast.success('Proyecto creado exitosamente');
      }

      handleCloseModal();
      loadProjects();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error al guardar proyecto');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este proyecto?')) return;

    try {
      await projectService.delete(id);
      toast.success('Proyecto eliminado exitosamente');
      loadProjects();
    } catch (error) {
      toast.error('Error al eliminar proyecto');
    }
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return 'https://via.placeholder.com/150';
    return `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${imageUrl}`;
  };

  return (
    <AdminLayout>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Proyectos</h1>
          <p className="text-gray-600">Administra los proyectos mostrados en el sitio</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="btn-primary flex items-center"
        >
          <FaPlus className="mr-2" />
          Nuevo Proyecto
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : projects.length > 0 ? (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Imagen
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    URL
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Orden
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        src={getImageUrl(project.image_url)}
                        alt={project.name}
                        className="h-12 w-12 rounded object-cover"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{project.name}</div>
                      <div className="text-sm text-gray-500 line-clamp-1">{project.description}</div>
                    </td>
                    <td className="px-6 py-4">
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700 flex items-center text-sm"
                      >
                        Ver <FaExternalLinkAlt className="ml-1 text-xs" />
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {project.order_index}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {project.active ? (
                        <span className="flex items-center text-green-600 text-sm">
                          <FaToggleOn className="mr-1" /> Activo
                        </span>
                      ) : (
                        <span className="flex items-center text-gray-400 text-sm">
                          <FaToggleOff className="mr-1" /> Inactivo
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleOpenModal(project)}
                        className="text-primary-600 hover:text-primary-900 mr-4"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="card p-12 text-center">
          <p className="text-gray-600 mb-4">No hay proyectos registrados</p>
          <button
            onClick={() => handleOpenModal()}
            className="btn-primary inline-flex items-center"
          >
            <FaPlus className="mr-2" />
            Crear Primer Proyecto
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {editingProject ? 'Editar Proyecto' : 'Nuevo Proyecto'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="label">Nombre del Proyecto</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="Ej: Sistema de Exámenes"
                  />
                </div>

                <div>
                  <label className="label">Título del Proyecto</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="Ej: Gestión de Exámenes Transversales"
                  />
                </div>

                <div>
                  <label className="label">Descripción</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="input-field"
                    placeholder="Describe el proyecto..."
                  />
                </div>

                <div>
                  <label className="label">URL del Proyecto</label>
                  <input
                    type="url"
                    name="url"
                    value={formData.url}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="https://examenes.proyectostivalpo.com"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Orden de Visualización</label>
                    <input
                      type="number"
                      name="order_index"
                      value={formData.order_index}
                      onChange={handleChange}
                      className="input-field"
                      min="0"
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
                      <span className="ml-2 text-gray-700">Proyecto activo</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="label">Imagen del Proyecto</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="input-field"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Formatos permitidos: JPG, PNG, GIF, WebP (máx. 5MB)
                  </p>
                  {editingProject?.image_url && !imageFile && (
                    <div className="mt-2">
                      <img
                        src={getImageUrl(editingProject.image_url)}
                        alt="Actual"
                        className="h-32 w-auto rounded"
                      />
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-4 pt-4">
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

export default Projects;
