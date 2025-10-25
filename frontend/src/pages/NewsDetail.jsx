import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { FaArrowLeft, FaCalendar, FaImage } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { newsService } from '../services';

const NewsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNewsDetail = async () => {
      try {
        setLoading(true);
        const newsData = await newsService.getById(id);
        setNews(newsData);
      } catch (err) {
        console.error('Error al obtener detalle de noticia:', err);
        setError('No se pudo cargar la noticia');
      } finally {
        setLoading(false);
      }
    };

    fetchNewsDetail();
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 py-20">
          <div className="container mx-auto px-4">
            <div className="skeleton h-96 rounded-xl mb-8"></div>
            <div className="skeleton h-8 w-3/4 mb-4"></div>
            <div className="skeleton h-4 w-1/2 mb-8"></div>
            <div className="skeleton h-64"></div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !news) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 py-20">
          <div className="container mx-auto px-4 text-center">
            <div className="bg-white rounded-xl shadow-lg p-12">
              <FaImage className="text-6xl text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {error || 'Noticia no encontrada'}
              </h2>
              <button
                onClick={() => navigate('/')}
                className="btn-primary mt-4 inline-flex items-center gap-2"
              >
                <FaArrowLeft />
                Volver al inicio
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  // Combinar imagen principal con galería
  const allImages = news.gallery && news.gallery.length > 0 
    ? news.gallery 
    : news.image_url 
    ? [{ image_url: news.image_url, caption: news.title }] 
    : [];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Botón volver */}
          <button
            onClick={() => navigate('/')}
            className="btn-secondary mb-8 inline-flex items-center gap-2 hover-lift"
          >
            <FaArrowLeft />
            Volver a noticias
          </button>

          {/* Card principal */}
          <article className="bg-white rounded-2xl shadow-xl overflow-hidden fade-in">
            {/* Carrusel de imágenes */}
            {allImages.length > 0 && (
              <div className="bg-gray-900">
                <Carousel
                  showThumbs={allImages.length > 1}
                  infiniteLoop={allImages.length > 1}
                  autoPlay={allImages.length > 1}
                  interval={5000}
                  showStatus={false}
                  className="news-carousel"
                >
                  {allImages.map((img, index) => (
                    <div key={img.id || index} className="aspect-video bg-gray-800">
                      <img
                        src={img.image_url}
                        alt={img.caption || news.title}
                        className="w-full h-full object-cover"
                      />
                      {img.caption && (
                        <p className="legend bg-gradient-to-r from-blue-600 to-purple-600">
                          {img.caption}
                        </p>
                      )}
                    </div>
                  ))}
                </Carousel>
              </div>
            )}

            {/* Contenido */}
            <div className="p-8 lg:p-12">
              {/* Badge de estado */}
              {news.is_active && (
                <span className="inline-block px-4 py-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-semibold rounded-full mb-4">
                  ✨ Activa
                </span>
              )}

              {/* Título */}
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                {news.title}
              </h1>

              {/* Fecha */}
              <div className="flex items-center gap-2 text-gray-500 mb-8">
                <FaCalendar className="text-blue-600" />
                <time dateTime={news.published_date}>
                  {formatDate(news.published_date)}
                </time>
              </div>

              {/* Separador */}
              <div className="h-1 w-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-8"></div>

              {/* Contenido principal */}
              <div className="prose prose-lg max-w-none">
                <div 
                  className="text-gray-700 leading-relaxed whitespace-pre-wrap"
                  style={{ fontSize: '1.125rem', lineHeight: '1.75' }}
                >
                  {news.content}
                </div>
              </div>

              {/* Información adicional */}
              {news.gallery && news.gallery.length > 0 && (
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <FaImage className="text-purple-600" />
                    <span>
                      Esta noticia contiene {news.gallery.length} {news.gallery.length === 1 ? 'imagen' : 'imágenes'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </article>

          {/* Botón volver inferior */}
          <div className="mt-8 text-center">
            <button
              onClick={() => navigate('/')}
              className="btn-primary inline-flex items-center gap-2 hover-lift"
            >
              <FaArrowLeft />
              Volver a noticias
            </button>
          </div>
        </div>
      </div>
      <Footer />

      {/* Estilos personalizados para el carrusel */}
      <style jsx>{`
        :global(.news-carousel .carousel .slide) {
          background: transparent;
        }
        
        :global(.news-carousel .carousel .thumbs-wrapper) {
          margin: 20px 0;
        }
        
        :global(.news-carousel .carousel .thumb) {
          border: 3px solid transparent;
          transition: all 0.3s ease;
        }
        
        :global(.news-carousel .carousel .thumb:hover) {
          border-color: #3b82f6;
        }
        
        :global(.news-carousel .carousel .thumb.selected) {
          border-color: #8b5cf6;
        }
        
        :global(.news-carousel .control-arrow) {
          background: rgba(59, 130, 246, 0.8) !important;
          transition: all 0.3s ease;
        }
        
        :global(.news-carousel .control-arrow:hover) {
          background: rgba(139, 92, 246, 0.9) !important;
        }
      `}</style>
    </>
  );
};

export default NewsDetail;
