import { FaGithub, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Columna 1: Sobre nosotros */}
          <div>
            <h3 className="text-lg font-bold mb-3">Proyectos TI Valpo</h3>
            <p className="text-gray-400 text-sm mb-3">
              Desarrollamos y mantenemos soluciones tecnológicas innovadoras para 
              optimizar procesos y mejorar la experiencia digital.
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
              <li className="flex items-center text-gray-400">
                <FaEnvelope className="mr-2 text-sm" />
                <span>info@proyectostivalpo.com</span>
              </li>
              <li className="flex items-center text-gray-400">
                <FaPhone className="mr-2 text-sm" />
                <span>+56 9 1234 5678</span>
              </li>
              <li className="flex items-center text-gray-400">
                <FaMapMarkerAlt className="mr-2 text-sm" />
                <span>Valparaíso, Chile</span>
              </li>
            </ul>
            
            {/* Redes sociales */}
            <div className="flex space-x-3 mt-4">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition"
              >
                <FaGithub size={20} />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition"
              >
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-6 pt-6 text-center text-gray-400 text-sm">
          <p>&copy; {currentYear} Proyectos TI Valpo. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
