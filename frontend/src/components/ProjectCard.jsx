import { FaExternalLinkAlt, FaCode, FaRocket, FaEye } from 'react-icons/fa';
import { useState } from 'react';
import ProjectModal from './ProjectModal';

const ProjectCard = ({ project }) => {
  const [showModal, setShowModal] = useState(false);
  
  const imageUrl = project.image_url 
    ? `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${project.image_url}`
    : 'https://via.placeholder.com/400x300?text=Proyecto';

  const handleViewDetails = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowModal(true);
  };

  return (
    <>
      <div className="group relative card overflow-hidden transform transition-all duration-500 hover:scale-105 hover:shadow-2xl">
        {/* Imagen con overlay */}
        <div className="relative h-56 overflow-hidden bg-gradient-to-br from-primary-500 to-purple-600">
        <img 
          src={imageUrl} 
          alt={project.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x300?text=Proyecto';
          }}
        />
        
        {/* Overlay oscuro con degradado que aparece en hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 right-4 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <div className="flex items-center gap-2 mb-2">
              <FaCode className="text-sm" />
              <span className="text-xs font-semibold uppercase tracking-wider">Tecnología Web</span>
            </div>
            <p className="text-sm line-clamp-2">{project.description}</p>
          </div>
        </div>

        {/* Badge decorativo */}
        <div className="absolute top-4 right-4 flex gap-2">
          {/* Botón Ver Detalles con icono de ojo */}
          <button
            onClick={handleViewDetails}
            className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-primary-600 hover:text-white transition-all duration-300 transform hover:scale-110 group/eye"
            aria-label="Ver detalles del proyecto"
          >
            <FaEye className="text-primary-600 group-hover/eye:text-white text-base transition-colors duration-300" />
          </button>
          
          <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
            <FaRocket className="text-primary-600 text-sm" />
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-6 bg-white relative">
        {/* Borde superior decorativo con gradiente */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors duration-300">
          {project.name}
        </h3>
        
        {/* Descripción visible siempre */}
        <p className="text-gray-600 mb-4 text-sm line-clamp-2">{project.description}</p>
        
        {/* Botón mejorado */}
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-primary-600 hover:text-white font-semibold transition-all duration-300 px-4 py-2 rounded-lg hover:bg-primary-600 border-2 border-primary-600 group/btn"
        >
          Ver proyecto
          <FaExternalLinkAlt className="text-sm group-hover/btn:rotate-12 transition-transform duration-300" />
        </a>
      </div>

        {/* Efecto de brillo en hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        </div>
      </div>

      {/* Modal de detalles */}
      <ProjectModal 
        project={project}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
};

export default ProjectCard;
