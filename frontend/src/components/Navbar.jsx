import { Link } from 'react-router-dom';
import { FaBars, FaTimes, FaShieldAlt } from 'react-icons/fa';
import { useState } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-primary-600">
              Proyectos TI Valpo
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#inicio" className="text-gray-700 hover:text-primary-600 transition">
              Inicio
            </a>
            <a href="#proyectos" className="text-gray-700 hover:text-primary-600 transition">
              Proyectos
            </a>
            <a href="#noticias" className="text-gray-700 hover:text-primary-600 transition">
              Noticias
            </a>
            <a href="#contacto" className="text-gray-700 hover:text-primary-600 transition">
              Contacto
            </a>
            <Link 
              to="/admin" 
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
              title="Administración"
            >
              <FaShieldAlt className="text-lg" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-primary-600 focus:outline-none"
            >
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-3">
              <a 
                href="#inicio" 
                className="text-gray-700 hover:text-primary-600 transition"
                onClick={() => setIsOpen(false)}
              >
                Inicio
              </a>
              <a 
                href="#proyectos" 
                className="text-gray-700 hover:text-primary-600 transition"
                onClick={() => setIsOpen(false)}
              >
                Proyectos
              </a>
              <a 
                href="#noticias" 
                className="text-gray-700 hover:text-primary-600 transition"
                onClick={() => setIsOpen(false)}
              >
                Noticias
              </a>
              <a 
                href="#contacto" 
                className="text-gray-700 hover:text-primary-600 transition"
                onClick={() => setIsOpen(false)}
              >
                Contacto
              </a>
              <Link 
                to="/admin" 
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition text-center flex items-center justify-center gap-2"
                onClick={() => setIsOpen(false)}
                title="Administración"
              >
                <FaShieldAlt className="text-lg" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
