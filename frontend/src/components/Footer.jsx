import { FaGithub, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Columna 1: Sobre nosotros */}
          <div>
            <h3 className="text-xl font-bold mb-4">Proyectos TI Valpo</h3>
            <p className="text-gray-400 mb-4">
              Desarrollamos y mantenemos soluciones tecnológicas innovadoras para 
              optimizar procesos y mejorar la experiencia digital.
            </p>
          </div>

          {/* Columna 2: Enlaces rápidos */}
          <div>
            <h3 className="text-xl font-bold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
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
            <h3 className="text-xl font-bold mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-center text-gray-400">
                <FaEnvelope className="mr-3" />
                <span>info@proyectostivalpo.com</span>
              </li>
              <li className="flex items-center text-gray-400">
                <FaPhone className="mr-3" />
                <span>+56 9 1234 5678</span>
              </li>
              <li className="flex items-center text-gray-400">
                <FaMapMarkerAlt className="mr-3" />
                <span>Valparaíso, Chile</span>
              </li>
            </ul>
            
            {/* Redes sociales */}
            <div className="flex space-x-4 mt-6">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition"
              >
                <FaGithub size={24} />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition"
              >
                <FaLinkedin size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {currentYear} Proyectos TI Valpo. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
