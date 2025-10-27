import { useEffect, useState, useRef } from 'react';
import { FaRocket, FaLightbulb, FaCogs, FaCode, FaUsers, FaTrophy, FaArrowDown, FaChartLine, FaAward, FaStar } from 'react-icons/fa';
import CountUp from 'react-countup';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProjectCard from '../components/ProjectCard';
import NewsCard from '../components/NewsCard';
import ContactForm from '../components/ContactForm';
import Team from '../components/Team';
import { projectService, newsService, siteConfigService } from '../services';
import {
  Target, Lightbulb, Users, Zap, Award, TrendingUp, CheckCircle, Star,
  Rocket, Heart, Shield, Code, Globe, Sparkles, Trophy, Briefcase,
  BookOpen, GraduationCap, Cpu, Database, Lock, Workflow, Settings,
  BarChart, LineChart, PieChart, Activity, Gauge, MessageCircle,
  Phone, Mail, Calendar, Clock, DollarSign, CreditCard, ShoppingCart,
  Package, Truck, MapPin, Home as HomeIcon, Building, Factory, Store
} from 'lucide-react';

// Mapa de iconos de lucide-react
const ICON_MAP = {
  Target, Lightbulb, Users, Zap, Award, TrendingUp, CheckCircle, Star,
  Rocket, Heart, Shield, Code, Globe, Sparkles, Trophy, Briefcase,
  BookOpen, GraduationCap, Cpu, Database, Lock, Workflow, Settings,
  BarChart, LineChart, PieChart, Activity, Gauge, MessageCircle,
  Phone, Mail, Calendar, Clock, DollarSign, CreditCard, ShoppingCart,
  Package, Truck, MapPin, HomeIcon, Building, Factory, Store
};

// Función para obtener el componente del icono por nombre
const getIconComponent = (iconName) => {
  return ICON_MAP[iconName] || Target;
};

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const featuresRef = useRef(null);
  const projectsRef = useRef(null);
  const newsRef = useRef(null);
  
  // Estados para configuración del sitio
  const [heroConfig, setHeroConfig] = useState({
    title: 'Proyectos de Innovación Tecnológica',
    subtitle: 'Impulsando el desarrollo tecnológico en Valparaíso',
    description: 'Desarrollamos soluciones innovadoras que conectan la academia con la industria',
    buttonText: 'Conocer Proyectos',
    buttonLink: '/projects'
  });
  const [statsConfig, setStatsConfig] = useState({ stats: [] });
  const [featuresConfig, setFeaturesConfig] = useState({ 
    title: '¿Por qué Elegirnos?',
    subtitle: 'Características que nos distinguen',
    features: [] 
  });
  const [technologiesConfig, setTechnologiesConfig] = useState({ items: ['React', 'Node.js', 'PostgreSQL', 'Docker'] });
  const [contactInfoConfig, setContactInfoConfig] = useState({
    email: { icon: 'Mail', title: 'Email', value: 'contacto@proyectostivalpo.com', color: 'primary' },
    schedule: { icon: 'Clock', title: 'Horario', value: '24/7 Disponible', color: 'purple' },
    location: { icon: 'MapPin', title: 'Ubicación', value: 'Valparaíso, Chile', color: 'pink' }
  });

  useEffect(() => {
    loadData();
    
    // Efecto parallax
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Intersection Observer separado - se ejecuta cuando cambian projects/news
  useEffect(() => {
    if (loading) return; // No ejecutar hasta que termine de cargar
    
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
      observer.disconnect();
    };
  }, [loading, projects, news]); // Re-ejecutar cuando cambien los datos

  const loadData = async () => {
    try {
      const [projectsData, newsData, siteConfigData] = await Promise.all([
        projectService.getAll(),
        newsService.getLatest(3),
        siteConfigService.getAll()
      ]);
      setProjects(projectsData);
      setNews(newsData);
      
      // Cargar configuración del sitio
      if (siteConfigData.success) {
        const { data } = siteConfigData;
        if (data.hero) setHeroConfig(data.hero);
        if (data.stats) setStatsConfig(data.stats);
        if (data.features) setFeaturesConfig(data.features);
        if (data.technologies) setTechnologiesConfig(data.technologies);
        if (data.contactInfo) setContactInfoConfig(data.contactInfo);
      }
    } catch (error) {
      console.error('❌ Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />

      {/* Hero Section - Rediseñado */}
      <section 
        id="inicio" 
        className="relative pt-20 min-h-screen flex items-center bg-gradient-to-br from-primary-600 via-primary-700 to-purple-900 text-white overflow-hidden"
      >
        {/* Patrón de fondo animado mejorado */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-float"></div>
          <div className="absolute top-1/3 right-10 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl animate-float animation-delay-200"></div>
          <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl animate-float animation-delay-400"></div>
        </div>

        {/* Grid pattern decorativo */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            {/* Badge animado */}
            <div className="inline-block mb-6 animate-fade-in">
              <span className="px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md text-sm font-semibold border border-white/20 shadow-lg inline-flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                Innovación Tecnológica desde Valparaíso
              </span>
            </div>

            {/* Título principal mejorado */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 animate-fade-in-up leading-tight">
              <span className="block mb-2">{heroConfig.title}</span>
              <span className="block bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 bg-clip-text text-transparent drop-shadow-lg">
                {heroConfig.subtitle}
              </span>
            </h1>

            {/* Subtítulo mejorado */}
            <p className="text-xl md:text-2xl mb-8 text-primary-50 max-w-3xl mx-auto animate-fade-in-up animation-delay-200 leading-relaxed">
              {heroConfig.description}
            </p>

            {/* Botones de acción mejorados */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up animation-delay-300 mb-12">
              <a 
                href={heroConfig.buttonLink || "#proyectos"}
                className="group inline-flex items-center gap-3 bg-white text-primary-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-50 transition-all shadow-2xl hover-lift transform hover:scale-105"
              >
                <FaRocket className="text-xl group-hover:rotate-12 transition-transform" />
                {heroConfig.buttonText}
              </a>
              <a 
                href="#contacto" 
                className="group inline-flex items-center gap-3 bg-transparent border-2 border-white/30 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-bold hover:bg-white/10 hover:border-white transition-all"
              >
                Contáctanos
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </a>
            </div>

            {/* Tecnologías destacadas */}
            <div className="flex flex-wrap justify-center gap-4 animate-fade-in-up animation-delay-400">
              {technologiesConfig.items && technologiesConfig.items.length > 0 ? (
                technologiesConfig.items.map((tech, index) => (
                  <span key={index} className="px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg text-sm font-medium">
                    {tech}
                  </span>
                ))
              ) : (
                ['React', 'Node.js', 'PostgreSQL', 'Docker'].map((tech, index) => (
                  <span key={index} className="px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg text-sm font-medium">
                    {tech}
                  </span>
                ))
              )}
            </div>

            {/* Indicador de scroll animado */}
            <div className="mt-16 animate-bounce">
              <div className="inline-flex flex-col items-center gap-2">
                <span className="text-sm text-white/70 font-medium">Descubre más</span>
                <FaArrowDown className="text-2xl text-white/70" />
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider mejorado */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Stats Section - Mejorado con animaciones */}
      <section className="py-20 bg-gradient-to-r from-primary-50 to-purple-50 relative overflow-hidden">
        {/* Patrón de fondo decorativo */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-400 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400 rounded-full filter blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {statsConfig.stats && statsConfig.stats.length > 0 ? (
              statsConfig.stats.map((stat, index) => {
                const IconComponent = getIconComponent(stat.icon || 'TrendingUp');
                const colors = [
                  'text-primary-600',
                  'text-purple-600',
                  'text-blue-600',
                  'text-yellow-500'
                ];
                const gradients = [
                  'from-primary-600 to-purple-600',
                  'from-purple-600 to-pink-600',
                  'from-blue-600 to-cyan-600',
                  'from-yellow-500 to-orange-500'
                ];
                
                return (
                  <div key={stat.id} className={`text-center card-reveal ${index > 0 ? `animation-delay-${index * 100}` : ''}`}>
                    <div className="inline-flex p-4 bg-white rounded-2xl shadow-lg mb-4">
                      <IconComponent className={`w-14 h-14 ${colors[index % colors.length]}`} strokeWidth={2.5} />
                    </div>
                    <div className={`text-5xl md:text-6xl font-bold bg-gradient-to-r ${gradients[index % gradients.length]} bg-clip-text text-transparent mb-2`}>
                      {stat.value}
                    </div>
                    <div className="text-gray-700 font-semibold text-lg">{stat.label}</div>
                  </div>
                );
              })
            ) : (
              <>
                {/* Fallback stats si no hay configuración */}
                <div className="text-center card-reveal">
                  <div className="inline-flex p-4 bg-white rounded-2xl shadow-lg mb-4">
                    <FaRocket className="text-4xl text-primary-600" />
                  </div>
                  <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    <CountUp end={projects.length || 5} duration={2.5} />+
                  </div>
                  <div className="text-gray-700 font-semibold text-lg">Proyectos Activos</div>
                </div>

                <div className="text-center card-reveal animation-delay-100">
                  <div className="inline-flex p-4 bg-white rounded-2xl shadow-lg mb-4">
                    <FaUsers className="text-4xl text-purple-600" />
                  </div>
                  <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                    <CountUp end={150} duration={2.5} />+
                  </div>
                  <div className="text-gray-700 font-semibold text-lg">Usuarios Activos</div>
                </div>

                <div className="text-center card-reveal animation-delay-200">
                  <div className="inline-flex p-4 bg-white rounded-2xl shadow-lg mb-4">
                    <FaAward className="text-4xl text-blue-600" />
                  </div>
                  <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                    <CountUp end={99} duration={2.5} />%
                  </div>
                  <div className="text-gray-700 font-semibold text-lg">Satisfacción</div>
                </div>

                <div className="text-center card-reveal animation-delay-300">
                  <div className="inline-flex p-4 bg-white rounded-2xl shadow-lg mb-4">
                    <FaStar className="text-4xl text-yellow-500" />
                  </div>
                  <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent mb-2">
                    <CountUp end={24} duration={2.5} />/7
                  </div>
                  <div className="text-gray-700 font-semibold text-lg">Disponibilidad</div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section - Mejorado */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50" ref={featuresRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 card-reveal">
              {featuresConfig.title}
            </h2>
            <p className="text-xl text-gray-600 card-reveal animation-delay-100">
              {featuresConfig.subtitle}
            </p>
          </div>

          {featuresConfig.features && featuresConfig.features.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuresConfig.features.map((feature, index) => {
                const IconComponent = getIconComponent(feature.icon);
                const gradients = [
                  'from-blue-500 to-blue-600',
                  'from-purple-500 to-purple-600',
                  'from-pink-500 to-pink-600',
                  'from-green-500 to-green-600',
                  'from-yellow-500 to-yellow-600',
                  'from-red-500 to-red-600',
                ];
                
                return (
                  <div 
                    key={feature.id} 
                    className={`card-reveal ${index > 0 ? `animation-delay-${Math.min(index * 100, 600)}` : ''} text-center p-8 bg-white rounded-2xl shadow-lg hover-lift`}
                  >
                    <div className={`inline-flex p-6 bg-gradient-to-br ${gradients[index % gradients.length]} rounded-2xl mb-6 transform transition-transform hover:scale-110`}>
                      <IconComponent className="text-white w-16 h-16" strokeWidth={2.5} />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-gray-900">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 - Fallback */}
              <div className="card-reveal text-center p-8 bg-white rounded-2xl shadow-lg hover-lift">
                <div className="inline-flex p-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-6 transform transition-transform hover:scale-110">
                  <FaRocket className="text-white text-5xl" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Innovación Constante</h3>
                <p className="text-gray-600 leading-relaxed">
                  Implementamos las últimas tecnologías y mejores prácticas para crear soluciones modernas, escalables y eficientes.
                </p>
              </div>

              {/* Feature 2 - Fallback */}
              <div className="card-reveal animation-delay-200 text-center p-8 bg-white rounded-2xl shadow-lg hover-lift">
                <div className="inline-flex p-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl mb-6 transform transition-transform hover:scale-110">
                  <FaLightbulb className="text-white text-5xl" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Soluciones Inteligentes</h3>
                <p className="text-gray-600 leading-relaxed">
                  Desarrollamos sistemas que optimizan procesos, mejoran la productividad y generan valor real para tu negocio.
                </p>
              </div>

              {/* Feature 3 - Fallback */}
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
          )}
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
      <section id="noticias" className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden" ref={newsRef}>
        {/* Decoración de fondo */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 right-10 w-72 h-72 bg-purple-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary-500 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <span className="card-reveal inline-block px-4 py-2 bg-primary-50 text-primary-700 rounded-full text-sm font-semibold mb-4 animate-fade-in">
              📰 ACTUALIDAD
            </span>
            <h2 className="card-reveal animation-delay-100 text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                Últimas Novedades
              </span>
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
              <div className="inline-block p-6 bg-gradient-to-br from-primary-50 to-purple-50 rounded-full mb-4">
                <FaLightbulb className="text-primary-600 text-5xl" />
              </div>
              <p className="text-gray-600 text-lg">No hay noticias disponibles en este momento.</p>
              <p className="text-gray-500 text-sm mt-2">Mantente atento a nuestras próximas actualizaciones.</p>
            </div>
          )}
        </div>
      </section>

      {/* Team Section */}
      <Team />

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
            {/* Email */}
            <div className="p-6">
              <div className={`inline-flex p-4 bg-${contactInfoConfig.email.color}-100 rounded-full mb-4`}>
                {(() => {
                  const IconComponent = getIconComponent(contactInfoConfig.email.icon);
                  return <IconComponent className={`w-6 h-6 text-${contactInfoConfig.email.color}-600`} strokeWidth={2} />;
                })()}
              </div>
              <h4 className="font-bold text-gray-900 mb-2">{contactInfoConfig.email.title}</h4>
              <p className="text-gray-600">{contactInfoConfig.email.value}</p>
            </div>

            {/* Horario */}
            <div className="p-6">
              <div className={`inline-flex p-4 bg-${contactInfoConfig.schedule.color}-100 rounded-full mb-4`}>
                {(() => {
                  const IconComponent = getIconComponent(contactInfoConfig.schedule.icon);
                  return <IconComponent className={`w-6 h-6 text-${contactInfoConfig.schedule.color}-600`} strokeWidth={2} />;
                })()}
              </div>
              <h4 className="font-bold text-gray-900 mb-2">{contactInfoConfig.schedule.title}</h4>
              <p className="text-gray-600">{contactInfoConfig.schedule.value}</p>
            </div>

            {/* Ubicación */}
            <div className="p-6">
              <div className={`inline-flex p-4 bg-${contactInfoConfig.location.color}-100 rounded-full mb-4`}>
                {(() => {
                  const IconComponent = getIconComponent(contactInfoConfig.location.icon);
                  return <IconComponent className={`w-6 h-6 text-${contactInfoConfig.location.color}-600`} strokeWidth={2} />;
                })()}
              </div>
              <h4 className="font-bold text-gray-900 mb-2">{contactInfoConfig.location.title}</h4>
              <p className="text-gray-600">{contactInfoConfig.location.value}</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
