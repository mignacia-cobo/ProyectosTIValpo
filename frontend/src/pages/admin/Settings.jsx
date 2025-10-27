import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { settingsService } from '../../services';
import { toast } from 'react-toastify';
import { FaSave, FaGlobe, FaEnvelope, FaPhone, FaMapMarkerAlt, FaGithub, FaLinkedin, FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Redes Sociales</h1>
        <p className="text-gray-600">Administra los enlaces a las redes sociales que se muestran en el footer</p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Redes Sociales */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Enlaces a Redes Sociales</h2>
              <p className="text-sm text-gray-600 mb-6">Los enlaces vacíos no se mostrarán en el footer</p>
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
                {submitting ? 'Guardando...' : 'Guardar Redes Sociales'}
              </button>
            </div>
          </form>
        </div>
      )}
    </AdminLayout>
  );
};

export default Settings;
