import { useEffect, useState } from 'react';
import { FaGithub, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt, FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import { settingsService, siteConfigService } from '../services';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [footerData, setFooterData] = useState({
    site_name: 'Proyectos TI Valpo',
    site_description: 'Desarrollamos y mantenemos soluciones tecnológicas innovadoras para optimizar procesos y mejorar la experiencia digital.',
    email: 'info@proyectostivalpo.com',
    phone: '+56 9 1234 5678',
    address: 'Valparaíso, Chile'
  });
  
  const [socialLinks, setSocialLinks] = useState({
    github_url: '',
    linkedin_url: '',
    facebook_url: '',
    twitter_url: '',
    instagram_url: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Cargar datos del footer desde site_config
      const siteConfig = await siteConfigService.getAll();
      if (siteConfig.success && siteConfig.data.footer) {
        setFooterData(siteConfig.data.footer);
      }
      
      // Cargar redes sociales desde settings
      const settings = await settingsService.get();
      setSocialLinks({
        github_url: settings.github_url || '',
        linkedin_url: settings.linkedin_url || '',
        facebook_url: settings.facebook_url || '',
        twitter_url: settings.twitter_url || '',
        instagram_url: settings.instagram_url || ''
      });
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
            <h3 className="text-lg font-bold mb-3">{footerData.site_name}</h3>
            <p className="text-gray-400 text-sm mb-3">
              {footerData.site_description}
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
              {footerData.email && (
                <li className="flex items-center text-gray-400">
                  <FaEnvelope className="mr-2 text-sm" />
                  <span>{footerData.email}</span>
                </li>
              )}
              {footerData.phone && (
                <li className="flex items-center text-gray-400">
                  <FaPhone className="mr-2 text-sm" />
                  <span>{footerData.phone}</span>
                </li>
              )}
              {footerData.address && (
                <li className="flex items-center text-gray-400">
                  <FaMapMarkerAlt className="mr-2 text-sm" />
                  <span>{footerData.address}</span>
                </li>
              )}
            </ul>
            
            {/* Redes sociales */}
            <div className="flex space-x-3 mt-4">
              {socialLinks.github_url && (
                <a 
                  href={socialLinks.github_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition"
                  title="GitHub"
                >
                  <FaGithub size={20} />
                </a>
              )}
              {socialLinks.linkedin_url && (
                <a 
                  href={socialLinks.linkedin_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition"
                  title="LinkedIn"
                >
                  <FaLinkedin size={20} />
                </a>
              )}
              {socialLinks.facebook_url && (
                <a 
                  href={socialLinks.facebook_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition"
                  title="Facebook"
                >
                  <FaFacebook size={20} />
                </a>
              )}
              {socialLinks.twitter_url && (
                <a 
                  href={socialLinks.twitter_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition"
                  title="Twitter"
                >
                  <FaTwitter size={20} />
                </a>
              )}
              {socialLinks.instagram_url && (
                <a 
                  href={socialLinks.instagram_url} 
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
          <p>&copy; {currentYear} {footerData.site_name}. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
