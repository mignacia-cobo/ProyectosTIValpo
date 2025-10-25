import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { settingsService } from '../../services';
import { toast } from 'react-toastify';
import { FaSave, FaGlobe, FaEnvelope, FaPhone, FaMapMarkerAlt, FaGithub, FaLinkedin, FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    site_name: '',
    site_description: '',
    email: '',
    phone: '',
    address: '',
    github_url: '',
    linkedin_url: '',
    facebook_url: '',
    twitter_url: '',
    instagram_url: ''
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await settingsService.get();
      setFormData({
        site_name: data.site_name || '',
        site_description: data.site_description || '',
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || '',
        github_url: data.github_url || '',
        linkedin_url: data.linkedin_url || '',
        facebook_url: data.facebook_url || '',
        twitter_url: data.twitter_url || '',
        instagram_url: data.instagram_url || ''
      });
    } catch (error) {
      toast.error('Error al cargar configuración');
    } finally {
      setLoading(false);
    }
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
      await settingsService.update(formData);
      toast.success('Configuración actualizada exitosamente');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error al actualizar configuración');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Configuración del Sitio</h1>
        <p className="text-gray-600">Administra la información general que se muestra en el footer y otras secciones del sitio</p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Información General */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FaGlobe className="text-primary-600" />
                Información General
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="label">Nombre del Sitio</label>
                  <input
                    type="text"
                    name="site_name"
                    value={formData.site_name}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="Proyectos TI Valpo"
                  />
                </div>

                <div>
                  <label className="label">Descripción del Sitio</label>
                  <textarea
                    name="site_description"
                    value={formData.site_description}
                    onChange={handleChange}
                    rows={4}
                    className="input-field"
                    placeholder="Descripción que aparecerá en el footer..."
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Esta descripción se mostrará en el footer del sitio
                  </p>
                </div>
              </div>
            </div>

            {/* Información de Contacto */}
            <div className="border-t pt-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Información de Contacto</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label flex items-center gap-2">
                    <FaEnvelope className="text-gray-400" />
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="info@proyectostivalpo.com"
                  />
                </div>

                <div>
                  <label className="label flex items-center gap-2">
                    <FaPhone className="text-gray-400" />
                    Teléfono
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="+56 9 1234 5678"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="label flex items-center gap-2">
                    <FaMapMarkerAlt className="text-gray-400" />
                    Dirección
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Valparaíso, Chile"
                  />
                </div>
              </div>
            </div>

            {/* Redes Sociales */}
            <div className="border-t pt-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Redes Sociales</h2>
              <div className="space-y-4">
                <div>
                  <label className="label flex items-center gap-2">
                    <FaGithub className="text-gray-400" />
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    name="github_url"
                    value={formData.github_url}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="https://github.com/tu-usuario"
                  />
                </div>

                <div>
                  <label className="label flex items-center gap-2">
                    <FaLinkedin className="text-gray-400" />
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    name="linkedin_url"
                    value={formData.linkedin_url}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="https://linkedin.com/company/tu-empresa"
                  />
                </div>

                <div>
                  <label className="label flex items-center gap-2">
                    <FaFacebook className="text-gray-400" />
                    Facebook URL
                  </label>
                  <input
                    type="url"
                    name="facebook_url"
                    value={formData.facebook_url}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="https://facebook.com/tu-pagina"
                  />
                </div>

                <div>
                  <label className="label flex items-center gap-2">
                    <FaTwitter className="text-gray-400" />
                    Twitter URL
                  </label>
                  <input
                    type="url"
                    name="twitter_url"
                    value={formData.twitter_url}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="https://twitter.com/tu-cuenta"
                  />
                </div>

                <div>
                  <label className="label flex items-center gap-2">
                    <FaInstagram className="text-gray-400" />
                    Instagram URL
                  </label>
                  <input
                    type="url"
                    name="instagram_url"
                    value={formData.instagram_url}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="https://instagram.com/tu-cuenta"
                  />
                </div>
              </div>
            </div>

            {/* Botón Guardar */}
            <div className="border-t pt-6 flex justify-end">
              <button
                type="submit"
                className="btn-primary flex items-center gap-2"
                disabled={submitting}
              >
                <FaSave />
                {submitting ? 'Guardando...' : 'Guardar Configuración'}
              </button>
            </div>
          </form>
        </div>
      )}
    </AdminLayout>
  );
};

export default Settings;
