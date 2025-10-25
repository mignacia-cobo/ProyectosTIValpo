import { FaExternalLinkAlt } from 'react-icons/fa';

const ProjectCard = ({ project }) => {
  const imageUrl = project.image_url 
    ? `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${project.image_url}`
    : 'https://via.placeholder.com/400x300?text=Proyecto';

  return (
    <div className="card overflow-hidden">
      {/* Imagen */}
      <div className="h-48 overflow-hidden bg-gray-200">
        <img 
          src={imageUrl} 
          alt={project.name}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x300?text=Proyecto';
          }}
        />
      </div>

      {/* Contenido */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{project.name}</h3>
        <p className="text-gray-600 mb-4 line-clamp-3">{project.description}</p>
        
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold transition"
        >
          Visitar proyecto
          <FaExternalLinkAlt className="ml-2 text-sm" />
        </a>
      </div>
    </div>
  );
};

export default ProjectCard;
