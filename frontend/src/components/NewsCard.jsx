import { FaCalendar } from 'react-icons/fa';

const NewsCard = ({ news }) => {
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

  return (
    <div className="card overflow-hidden">
      {/* Imagen */}
      <div className="h-48 overflow-hidden bg-gray-200">
        <img 
          src={imageUrl} 
          alt={news.title}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
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
        
        <h3 className="text-xl font-bold text-gray-900 mb-2">{news.title}</h3>
        <p className="text-gray-600 line-clamp-3">
          {news.summary || news.content.substring(0, 150) + '...'}
        </p>
      </div>
    </div>
  );
};

export default NewsCard;
