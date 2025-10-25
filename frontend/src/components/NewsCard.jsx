import { FaCalendar, FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const NewsCard = ({ news }) => {
  const navigate = useNavigate();
  
  const imageUrl = news.image_url 
    ? `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${news.image_url}`
    : 'https://via.placeholder.com/400x300?text=Noticia';

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleClick = () => {
    navigate(`/news/${news.id}`);
  };

  return (
    <div 
      className="card overflow-hidden hover-lift cursor-pointer group" 
      onClick={handleClick}
      role="article"
      tabIndex={0}
      onKeyPress={(e) => e.key === 'Enter' && handleClick()}
    >
      {/* Imagen */}
      <div className="h-48 overflow-hidden bg-gray-200">
        <img 
          src={imageUrl} 
          alt={news.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x300?text=Noticia';
          }}
        />
      </div>

      {/* Contenido */}
      <div className="p-6">
        <div className="flex items-center text-gray-500 text-sm mb-2">
          <FaCalendar className="mr-2" />
          <span>{formatDate(news.published_date)}</span>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {news.title}
        </h3>
        <p className="text-gray-600 line-clamp-3 mb-4">
          {news.summary || news.content.substring(0, 150) + '...'}
        </p>

        {/* Botón leer más */}
        <div className="flex items-center text-blue-600 font-semibold group-hover:gap-2 transition-all">
          <span>Leer más</span>
          <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
