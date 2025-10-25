import { useEffect, useState, useRef } from 'react';
import { FaRocket, FaLightbulb, FaCogs, FaCode, FaUsers, FaTrophy, FaArrowDown } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProjectCard from '../components/ProjectCard';
import NewsCard from '../components/NewsCard';
import ContactForm from '../components/ContactForm';
import { projectService, newsService } from '../services';

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const featuresRef = useRef(null);
  const projectsRef = useRef(null);
  const newsRef = useRef(null);

  useEffect(() => {
    loadData();
    
    // Efecto parallax
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Intersection Observer para animaciones al entrar en viewport
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, observerOptions);
    
    const elementsToObserve = document.querySelectorAll('.card-reveal');
    elementsToObserve.forEach(el => observer.observe(el));
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const loadData = async () => {
    try {
      const [projectsData, newsData] = await Promise.all([
        projectService.getAll(),
        newsService.getLatest(3)
      ]);
      setProjects(projectsData);
      setNews(newsData);
    } catch (error) {
      console.error('❌ Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />

      {/* Hero Section - Más compacto */}
      <section 
        id="inicio" 
        className="relative pt-20 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white overflow-hidden"
      >
        {/* Patrón de fondo animado - Solo dentro del hero */}
        <div className="absolute inset-0 opacity-10 overflow-hidden">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full mix-blend-multiply filter blur-xl animate-float" style={{ top: '10%' }}></div>
          <div className="absolute top-20 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-float animation-delay-200" style={{ top: '20%' }}></div>
          <div className="absolute top-32 left-1/3 w-60 h-60 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-float animation-delay-400" style={{ top: '15%' }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-block mb-4 animate-fade-in">
              <span className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-sm font-semibold border border-white/30">
                ✨ Innovación Tecnológica desde Valparaíso
              </span>
            </div>

            {/* Título principal más pequeño */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 animate-fade-in-up">
              <span className="block">Proyectos TI</span>
              <span className="block bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 bg-clip-text text-transparent">
                Valparaíso
              </span>
            </h1>

            {/* Subtítulo más compacto */}
            <p className="text-lg md:text-xl mb-6 text-primary-100 max-w-2xl mx-auto animate-fade-in-up animation-delay-200">
              Desarrollamos y mantenemos soluciones tecnológicas innovadoras
            </p>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up animation-delay-300">
              <a 
                href="#proyectos" 
                className="inline-flex items-center gap-2 bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all shadow-lg hover-lift"
              >
                <FaRocket className="text-lg" />
                Ver Proyectos
              </a>
              <a 
                href="#contacto" 
                className="inline-flex items-center gap-2 bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-all"
              >
                Contáctanos
              </a>
            </div>

            {/* Indicador de scroll más cerca */}
            <div className="mt-10 animate-bounce">
              <FaArrowDown className="mx-auto text-xl text-white/70" />
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0,40L48,45C96,50,192,60,288,56C384,52,480,36,576,32C672,28,768,36,864,40C960,44,1056,44,1152,40C1248,36,1344,28,1392,24L1440,20L1440,80L1392,80C1344,80,1248,80,1152,80C1056,80,960,80,864,80C768,80,672,80,576,80C480,80,384,80,288,80C192,80,96,80,48,80L0,80Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Stats Section - Nueva sección de estadísticas */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center card-reveal p-6">
              <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">
                {projects.length}+
              </div>
              <div className="text-gray-600 font-medium">Proyectos Activos</div>
            </div>
            <div className="text-center card-reveal p-6 animation-delay-100">
              <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">
                100%
              </div>
              <div className="text-gray-600 font-medium">Código Abierto</div>
            </div>
            <div className="text-center card-reveal p-6 animation-delay-200">
              <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">
                24/7
              </div>
              <div className="text-gray-600 font-medium">Disponibilidad</div>
            </div>
            <div className="text-center card-reveal p-6 animation-delay-300">
              <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">
                ∞
              </div>
              <div className="text-gray-600 font-medium">Innovación</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Mejorado */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50" ref={featuresRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 card-reveal">
              ¿Por qué elegirnos?
            </h2>
            <p className="text-xl text-gray-600 card-reveal animation-delay-100">
              Nos comprometemos con la excelencia en cada proyecto
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card-reveal text-center p-8 bg-white rounded-2xl shadow-lg hover-lift">
              <div className="inline-flex p-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-6 transform transition-transform hover:scale-110">
                <FaRocket className="text-white text-5xl" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Innovación Constante</h3>
              <p className="text-gray-600 leading-relaxed">
                Implementamos las últimas tecnologías y mejores prácticas para crear soluciones modernas, escalables y eficientes.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card-reveal animation-delay-200 text-center p-8 bg-white rounded-2xl shadow-lg hover-lift">
              <div className="inline-flex p-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl mb-6 transform transition-transform hover:scale-110">
                <FaLightbulb className="text-white text-5xl" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Soluciones Inteligentes</h3>
              <p className="text-gray-600 leading-relaxed">
                Desarrollamos sistemas que optimizan procesos, mejoran la productividad y generan valor real para tu negocio.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card-reveal animation-delay-300 text-center p-8 bg-white rounded-2xl shadow-lg hover-lift">
              <div className="inline-flex p-6 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl mb-6 transform transition-transform hover:scale-110">
                <FaCogs className="text-white text-5xl" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Mantenimiento Continuo</h3>
              <p className="text-gray-600 leading-relaxed">
                Brindamos soporte y actualizaciones constantes para garantizar el óptimo funcionamiento de todos nuestros sistemas.
              </p>
            </div>
          </div>

          {/* Características adicionales */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card-reveal animation-delay-400 flex items-start gap-4 p-6 bg-white rounded-xl shadow-md">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FaCode className="text-blue-600 text-xl" />
                </div>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Código de Calidad</h4>
                <p className="text-gray-600 text-sm">Seguimos estándares de industria y mejores prácticas de desarrollo.</p>
              </div>
            </div>

            <div className="card-reveal animation-delay-500 flex items-start gap-4 p-6 bg-white rounded-xl shadow-md">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FaUsers className="text-purple-600 text-xl" />
                </div>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Trabajo en Equipo</h4>
                <p className="text-gray-600 text-sm">Colaboración efectiva para entregar resultados excepcionales.</p>
              </div>
            </div>

            <div className="card-reveal animation-delay-600 flex items-start gap-4 p-6 bg-white rounded-xl shadow-md">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                  <FaTrophy className="text-pink-600 text-xl" />
                </div>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Resultados Comprobados</h4>
                <p className="text-gray-600 text-sm">Proyectos exitosos respaldados por usuarios satisfechos.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section - Mejorado */}
      <section id="proyectos" className="py-20 bg-gray-50" ref={projectsRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="card-reveal inline-block px-4 py-2 bg-primary-100 text-primary-600 rounded-full text-sm font-semibold mb-4">
              NUESTRO TRABAJO
            </span>
            <h2 className="card-reveal animation-delay-100 text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Proyectos Destacados
            </h2>
            <p className="card-reveal animation-delay-200 text-xl text-gray-600 max-w-2xl mx-auto">
              Conoce las soluciones tecnológicas que hemos desarrollado para transformar ideas en realidad
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-lg">
                  <div className="skeleton h-48"></div>
                  <div className="p-6 space-y-3">
                    <div className="skeleton h-6 w-3/4"></div>
                    <div className="skeleton h-4 w-full"></div>
                    <div className="skeleton h-4 w-5/6"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <div 
                  key={project.id} 
                  className="card-reveal"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ProjectCard project={project} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 card-reveal">
              <div className="inline-block p-6 bg-gray-100 rounded-full mb-4">
                <FaRocket className="text-gray-400 text-5xl" />
              </div>
              <p className="text-gray-600 text-lg">No hay proyectos disponibles en este momento.</p>
              <p className="text-gray-500 text-sm mt-2">Pronto agregaremos nuevos proyectos innovadores.</p>
            </div>
          )}

          {/* CTA para ver más proyectos */}
          {projects.length > 6 && (
            <div className="text-center mt-12">
              <button className="card-reveal inline-flex items-center gap-2 px-8 py-4 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-all shadow-lg hover-lift">
                Ver Todos los Proyectos
                <FaArrowDown className="rotate-[-90deg]" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* News Section - Mejorado */}
      <section id="noticias" className="py-20 bg-white" ref={newsRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="card-reveal inline-block px-4 py-2 bg-green-100 text-green-600 rounded-full text-sm font-semibold mb-4">
              ACTUALIDAD
            </span>
            <h2 className="card-reveal animation-delay-100 text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Últimas Novedades
            </h2>
            <p className="card-reveal animation-delay-200 text-xl text-gray-600 max-w-2xl mx-auto">
              Mantente informado sobre nuestras actualizaciones, lanzamientos y noticias relevantes
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-lg">
                  <div className="skeleton h-48"></div>
                  <div className="p-6 space-y-3">
                    <div className="skeleton h-6 w-3/4"></div>
                    <div className="skeleton h-4 w-full"></div>
                    <div className="skeleton h-4 w-5/6"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : news.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {news.map((item, index) => (
                <div 
                  key={item.id} 
                  className="card-reveal"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <NewsCard news={item} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 card-reveal">
              <div className="inline-block p-6 bg-gray-100 rounded-full mb-4">
                <FaLightbulb className="text-gray-400 text-5xl" />
              </div>
              <p className="text-gray-600 text-lg">No hay noticias disponibles en este momento.</p>
              <p className="text-gray-500 text-sm mt-2">Mantente atento a nuestras próximas actualizaciones.</p>
            </div>
          )}
        </div>
      </section>

      {/* Contact Section - Mejorado */}
      <section id="contacto" className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
        {/* Patrón de fondo */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="card-reveal inline-block px-4 py-2 bg-primary-100 text-primary-600 rounded-full text-sm font-semibold mb-4">
              CONTÁCTANOS
            </span>
            <h2 className="card-reveal animation-delay-100 text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              ¿Tienes un proyecto en mente?
            </h2>
            <p className="card-reveal animation-delay-200 text-xl text-gray-600">
              Escríbenos y hagamos realidad tu idea. Respondemos en menos de 24 horas
            </p>
          </div>

          <div className="card-reveal animation-delay-300 bg-white rounded-2xl shadow-2xl p-8 md:p-12">
            <ContactForm />
          </div>

          {/* Información de contacto adicional */}
          <div className="card-reveal animation-delay-400 mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-6">
              <div className="inline-flex p-4 bg-primary-100 rounded-full mb-4">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Email</h4>
              <p className="text-gray-600">contacto@proyectostivalpo.com</p>
            </div>

            <div className="p-6">
              <div className="inline-flex p-4 bg-purple-100 rounded-full mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Horario</h4>
              <p className="text-gray-600">24/7 Disponible</p>
            </div>

            <div className="p-6">
              <div className="inline-flex p-4 bg-pink-100 rounded-full mb-4">
                <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Ubicación</h4>
              <p className="text-gray-600">Valparaíso, Chile</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
