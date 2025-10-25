import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaUser, FaEnvelope, FaKey, FaUserTag } from 'react-icons/fa';
import AdminLayout from '../../components/AdminLayout';
import { usersService } from '../../services';

const Users = () => {
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await usersService.getAll();
      setUsersList(data);
    } catch (error) {
      toast.error('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        password: '', // No mostrar contraseña actual
        role: user.role
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'user'
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const userData = { ...formData };
      
      // Si estamos editando y la contraseña está vacía, no enviarla
      if (editingUser && !userData.password) {
        delete userData.password;
      }

      if (editingUser) {
        await usersService.update(editingUser.id, userData);
        toast.success('Usuario actualizado exitosamente');
      } else {
        if (!userData.password) {
          toast.error('La contraseña es requerida para nuevos usuarios');
          setSubmitting(false);
          return;
        }
        await usersService.create(userData);
        toast.success('Usuario creado exitosamente');
      }

      handleCloseModal();
      loadUsers();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error al guardar usuario');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este usuario?')) return;

    try {
      await usersService.delete(id);
      toast.success('Usuario eliminado exitosamente');
      loadUsers();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error al eliminar usuario');
    }
  };

  const getRoleBadge = (role) => {
    const badges = {
      admin: 'bg-purple-100 text-purple-800',
      user: 'bg-blue-100 text-blue-800',
    };
    return badges[role] || badges.user;
  };

  const getRoleLabel = (role) => {
    const labels = {
      admin: 'Administrador',
      user: 'Usuario',
    };
    return labels[role] || 'Usuario';
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Usuarios</h1>
          <p className="text-gray-600">Administra los usuarios del sistema</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="btn-primary flex items-center"
        >
          <FaPlus className="mr-2" />
          Nuevo Usuario
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : usersList.length > 0 ? (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha de Registro
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {usersList.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                          <FaUser className="text-white" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <FaEnvelope className="mr-2" />
                        {user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadge(user.role)}`}>
                        {getRoleLabel(user.role)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleOpenModal(user)}
                        className="text-primary-600 hover:text-primary-900 mr-4"
                      >
                        <FaEdit className="inline mr-1" /> Editar
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FaTrash className="inline mr-1" /> Eliminar
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
          <FaUser className="text-6xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">No hay usuarios registrados</p>
          <button
            onClick={() => handleOpenModal()}
            className="btn-primary inline-flex items-center"
          >
            <FaPlus className="mr-2" />
            Crear Primer Usuario
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="label">
                    <FaUser className="inline mr-2" />
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="Juan Pérez"
                  />
                </div>

                <div>
                  <label className="label">
                    <FaEnvelope className="inline mr-2" />
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="usuario@ejemplo.com"
                  />
                </div>

                <div>
                  <label className="label">
                    <FaKey className="inline mr-2" />
                    Contraseña {editingUser && '(dejar en blanco para no cambiar)'}
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required={!editingUser}
                    className="input-field"
                    placeholder={editingUser ? 'Nueva contraseña (opcional)' : 'Contraseña'}
                  />
                  {!editingUser && (
                    <p className="text-sm text-gray-500 mt-1">
                      Mínimo 6 caracteres
                    </p>
                  )}
                </div>

                <div>
                  <label className="label">
                    <FaUserTag className="inline mr-2" />
                    Rol
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                    className="input-field"
                  >
                    <option value="user">Usuario</option>
                    <option value="admin">Administrador</option>
                  </select>
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

export default Users;
