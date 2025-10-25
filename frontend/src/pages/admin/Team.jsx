import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { teamService } from '../../services';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaLinkedin, FaGithub, FaEnvelope, FaToggleOn, FaToggleOff } from 'react-icons/fa';

const Team = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    bio: '',
    email: '',
    linkedin_url: '',
    github_url: '',
    order_index: 0,
    active: true
  });
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadTeamMembers();
  }, []);

  const loadTeamMembers = async () => {
    try {
      const data = await teamService.getAllAdmin();
      setTeamMembers(data);
    } catch (error) {
      toast.error('Error al cargar miembros del equipo');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (member = null) => {
    if (member) {
      setEditingMember(member);
      setFormData({
        name: member.name,
        role: member.role,
        bio: member.bio || '',
        email: member.email || '',
        linkedin_url: member.linkedin_url || '',
        github_url: member.github_url || '',
        order_index: member.order_index,
        active: member.active
      });
    } else {
      setEditingMember(null);
      setFormData({
        name: '',
        role: '',
        bio: '',
        email: '',
        linkedin_url: '',
        github_url: '',
        order_index: 0,
        active: true
      });
    }
    setImageFile(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingMember(null);
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
      data.append('role', formData.role);
      data.append('bio', formData.bio);
      data.append('email', formData.email);
      data.append('linkedin_url', formData.linkedin_url);
      data.append('github_url', formData.github_url);
      data.append('order_index', formData.order_index);
      data.append('active', formData.active);

      if (imageFile) {
        data.append('image', imageFile);
      }

      if (editingMember) {
        await teamService.update(editingMember.id, data);
        toast.success('Miembro actualizado exitosamente');
      } else {
        await teamService.create(data);
        toast.success('Miembro creado exitosamente');
      }

      handleCloseModal();
      loadTeamMembers();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error al guardar miembro');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este miembro del equipo?')) return;

    try {
      await teamService.delete(id);
      toast.success('Miembro eliminado exitosamente');
      loadTeamMembers();
    } catch (error) {
      toast.error('Error al eliminar miembro');
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión del Equipo</h1>
          <p className="text-gray-600">Administra los miembros del equipo mostrados en el sitio</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="btn-primary flex items-center"
        >
          <FaPlus className="mr-2" />
          Nuevo Miembro
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : teamMembers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member) => (
            <div key={member.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex flex-col items-center text-center p-6">
                <img
                  src={getImageUrl(member.image_url)}
                  alt={member.name}
                  className="w-32 h-32 rounded-full object-cover mb-4"
                />
                <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-primary-600 font-medium mb-3">{member.role}</p>
                {member.bio && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{member.bio}</p>
                )}
                
                <div className="flex space-x-3 mb-4">
                  {member.email && (
                    <a href={`mailto:${member.email}`} className="text-gray-600 hover:text-primary-600">
                      <FaEnvelope size={18} />
                    </a>
                  )}
                  {member.linkedin_url && (
                    <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-primary-600">
                      <FaLinkedin size={18} />
                    </a>
                  )}
                  {member.github_url && (
                    <a href={member.github_url} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-primary-600">
                      <FaGithub size={18} />
                    </a>
                  )}
                </div>

                <div className="flex items-center space-x-2 mb-4">
                  {member.active ? (
                    <span className="flex items-center text-green-600 text-sm">
                      <FaToggleOn className="mr-1" /> Activo
                    </span>
                  ) : (
                    <span className="flex items-center text-gray-400 text-sm">
                      <FaToggleOff className="mr-1" /> Inactivo
                    </span>
                  )}
                  <span className="text-gray-500 text-sm">| Orden: {member.order_index}</span>
                </div>

                <div className="flex space-x-2 w-full">
                  <button
                    onClick={() => handleOpenModal(member)}
                    className="flex-1 btn-secondary text-sm"
                  >
                    <FaEdit className="inline mr-1" /> Editar
                  </button>
                  <button
                    onClick={() => handleDelete(member.id)}
                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm"
                  >
                    <FaTrash className="inline mr-1" /> Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center">
          <p className="text-gray-600 mb-4">No hay miembros del equipo registrados</p>
          <button
            onClick={() => handleOpenModal()}
            className="btn-primary inline-flex items-center"
          >
            <FaPlus className="mr-2" />
            Crear Primer Miembro
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {editingMember ? 'Editar Miembro' : 'Nuevo Miembro'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Nombre Completo</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="input-field"
                      placeholder="Ej: Juan Pérez"
                    />
                  </div>

                  <div>
                    <label className="label">Cargo/Rol</label>
                    <input
                      type="text"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      required
                      className="input-field"
                      placeholder="Ej: Desarrollador Full Stack"
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Biografía</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={4}
                    className="input-field"
                    placeholder="Breve descripción del miembro..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="correo@ejemplo.com"
                    />
                  </div>

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
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">LinkedIn URL</label>
                    <input
                      type="url"
                      name="linkedin_url"
                      value={formData.linkedin_url}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="https://linkedin.com/in/..."
                    />
                  </div>

                  <div>
                    <label className="label">GitHub URL</label>
                    <input
                      type="url"
                      name="github_url"
                      value={formData.github_url}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="https://github.com/..."
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Foto de Perfil</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="input-field"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Formatos permitidos: JPG, PNG, GIF, WebP (máx. 5MB). Recomendado: 400x400px
                  </p>
                  {editingMember?.image_url && !imageFile && (
                    <div className="mt-2">
                      <img
                        src={getImageUrl(editingMember.image_url)}
                        alt="Actual"
                        className="h-32 w-32 rounded-full object-cover"
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="active"
                      checked={formData.active}
                      onChange={handleChange}
                      className="form-checkbox h-5 w-5 text-primary-600"
                    />
                    <span className="ml-2 text-gray-700">Miembro activo (visible en el sitio)</span>
                  </label>
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

export default Team;
