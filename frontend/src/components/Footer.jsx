import { useEffect, useState } from 'react';
import { FaGithub, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt, FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import { settingsService } from '../services';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [settings, setSettings] = useState({
    site_name: 'Proyectos TI Valpo',
    site_description: 'Desarrollamos y mantenemos soluciones tecnológicas innovadoras para optimizar procesos y mejorar la experiencia digital.',
    email: 'info@proyectostivalpo.com',
    phone: '+56 9 1234 5678',
    address: 'Valparaíso, Chile',
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
      setSettings(data);
    } catch (error) {
      console.error('Error al cargar configuración:', error);
      // Mantener valores por defecto si hay error
    }
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Columna 1: Sobre nosotros */}
          <div>
            <h3 className="text-lg font-bold mb-3">{settings.site_name}</h3>
            <p className="text-gray-400 text-sm mb-3">
              {settings.site_description}
            </p>
          </div>

          {/* Columna 2: Enlaces rápidos */}
          <div>
            <h3 className="text-lg font-bold mb-3">Enlaces Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#inicio" className="text-gray-400 hover:text-white transition">
                  Inicio
                </a>
              </li>
              <li>
                <a href="#proyectos" className="text-gray-400 hover:text-white transition">
                  Proyectos
                </a>
              </li>
              <li>
                <a href="#noticias" className="text-gray-400 hover:text-white transition">
                  Noticias
                </a>
              </li>
              <li>
                <a href="#contacto" className="text-gray-400 hover:text-white transition">
                  Contacto
                </a>
              </li>
            </ul>
          </div>

          {/* Columna 3: Contacto */}
          <div>
            <h3 className="text-lg font-bold mb-3">Contacto</h3>
            <ul className="space-y-2 text-sm">
              {settings.email && (
                <li className="flex items-center text-gray-400">
                  <FaEnvelope className="mr-2 text-sm" />
                  <span>{settings.email}</span>
                </li>
              )}
              {settings.phone && (
                <li className="flex items-center text-gray-400">
                  <FaPhone className="mr-2 text-sm" />
                  <span>{settings.phone}</span>
                </li>
              )}
              {settings.address && (
                <li className="flex items-center text-gray-400">
                  <FaMapMarkerAlt className="mr-2 text-sm" />
                  <span>{settings.address}</span>
                </li>
              )}
            </ul>
            
            {/* Redes sociales */}
            <div className="flex space-x-3 mt-4">
              {settings.github_url && (
                <a 
                  href={settings.github_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition"
                  title="GitHub"
                >
                  <FaGithub size={20} />
                </a>
              )}
              {settings.linkedin_url && (
                <a 
                  href={settings.linkedin_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition"
                  title="LinkedIn"
                >
                  <FaLinkedin size={20} />
                </a>
              )}
              {settings.facebook_url && (
                <a 
                  href={settings.facebook_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition"
                  title="Facebook"
                >
                  <FaFacebook size={20} />
                </a>
              )}
              {settings.twitter_url && (
                <a 
                  href={settings.twitter_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition"
                  title="Twitter"
                >
                  <FaTwitter size={20} />
                </a>
              )}
              {settings.instagram_url && (
                <a 
                  href={settings.instagram_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition"
                  title="Instagram"
                >
                  <FaInstagram size={20} />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-6 pt-6 text-center text-gray-400 text-sm">
          <p>&copy; {currentYear} {settings.site_name}. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
