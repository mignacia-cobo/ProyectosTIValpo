import { FaCalendar, FaArrowRight, FaNewspaper } from 'react-icons/fa';
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
      className="group relative card overflow-hidden hover-lift cursor-pointer transform transition-all duration-500 hover:shadow-2xl" 
      onClick={handleClick}
      role="article"
      tabIndex={0}
      onKeyPress={(e) => e.key === 'Enter' && handleClick()}
    >
      {/* Imagen con overlay mejorado */}
      <div className="relative h-56 overflow-hidden bg-gradient-to-br from-green-500 to-blue-600">
        <img 
          src={imageUrl} 
          alt={news.title}
          className="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-2 transition-all duration-700"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x300?text=Noticia';
          }}
        />
        
        {/* Overlay con gradiente */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
        
        {/* Badge de fecha flotante */}
        <div className="absolute top-4 left-4">
          <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg">
            <div className="flex items-center gap-2 text-gray-700">
              <FaCalendar className="text-xs text-green-600" />
              <span className="text-xs font-bold">{formatDate(news.published_date)}</span>
            </div>
          </div>
        </div>

        {/* Icono decorativo */}
        <div className="absolute top-4 right-4">
          <div className="bg-green-500/90 backdrop-blur-sm p-2.5 rounded-full shadow-lg">
            <FaNewspaper className="text-white text-sm" />
          </div>
        </div>
      </div>

      {/* Contenido mejorado */}
      <div className="p-6 bg-white relative">
        {/* Borde superior decorativo */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-green-600 transition-colors duration-300 leading-snug">
          {news.title}
        </h3>
        
        <p className="text-gray-600 line-clamp-3 mb-6 text-sm leading-relaxed">
          {news.summary || news.content.substring(0, 150) + '...'}
        </p>

        {/* Botón mejorado */}
        <div className="inline-flex items-center gap-2 text-green-600 font-semibold group-hover:gap-3 transition-all duration-300 px-4 py-2 rounded-lg border-2 border-transparent group-hover:border-green-600 group-hover:bg-green-50">
          <span>Leer más</span>
          <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform duration-300" />
        </div>
      </div>

      {/* Efecto de brillo en hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      </div>
    </div>
  );
};

export default NewsCard;
