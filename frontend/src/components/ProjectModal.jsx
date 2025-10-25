import { FaTimes, FaExternalLinkAlt, FaCalendar, FaCode } from 'react-icons/fa';
import { useEffect } from 'react';

const ProjectModal = ({ project, isOpen, onClose }) => {
  const imageUrl = project?.image_url 
    ? `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${project.image_url}`
    : 'https://via.placeholder.com/800x600?text=Proyecto';

  // Cerrar modal con tecla Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !project) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto"
      onClick={onClose}
    >
      {/* Modal simple - Responsivo para móviles */}
      <div 
        className="relative bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-3xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden animate-scale-in my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header con imagen - Ajustado para móviles */}
        <div className="relative h-32 sm:h-48 bg-gray-200">
          <img 
            src={imageUrl} 
            alt={project.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/800x600?text=Proyecto';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          
          {/* Título sobre la imagen - Responsivo */}
          <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
            <h2 className="text-lg sm:text-2xl font-bold text-white">{project.name}</h2>
          </div>

          {/* Botón cerrar - Arriba a la derecha */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-white/90 backdrop-blur-sm p-1.5 sm:p-2 rounded-full shadow-lg hover:bg-red-500 hover:text-white transition-all duration-300 group z-10"
            aria-label="Cerrar"
          >
            <FaTimes className="text-gray-700 group-hover:text-white text-base sm:text-lg" />
          </button>
        </div>

        {/* Contenido con scroll - Optimizado para móviles */}
        <div className="overflow-y-auto max-h-[calc(95vh-8rem)] sm:max-h-[calc(90vh-12rem)] p-4 sm:p-6 space-y-4 sm:space-y-5">
          {/* Metadatos */}
          <div className="flex flex-wrap gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <FaCode className="text-primary-600 text-base sm:text-lg" />
              <div>
                <p className="text-xs text-gray-500">Tecnología</p>
                <p className="text-xs sm:text-sm font-semibold">Web Application</p>
              </div>
            </div>
            
            {project.created_at && (
              <div className="flex items-center gap-2">
                <FaCalendar className="text-purple-600 text-base sm:text-lg" />
                <div>
                  <p className="text-xs text-gray-500">Fecha</p>
                  <p className="text-xs sm:text-sm font-semibold">
                    {new Date(project.created_at).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Descripción */}
          <div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3">Descripción</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line text-sm">
              {project.description}
            </p>
          </div>

          {/* Botón visitar proyecto - Responsivo */}
          <div className="pt-3 sm:pt-4 mt-3 sm:mt-4 border-t border-gray-200">
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg font-medium text-sm transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <FaExternalLinkAlt className="text-sm" />
              <span>Visitar Proyecto</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
