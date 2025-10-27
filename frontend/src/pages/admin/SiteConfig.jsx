import { useState, useEffect } from 'react';
import { siteConfigService } from '../../services';
import { toast } from 'react-toastify';
import AdminLayout from '../../components/AdminLayout';
import {
  Target, Lightbulb, Users, Zap, Award, TrendingUp, CheckCircle, Star,
  Rocket, Heart, Shield, Code, Globe, Sparkles, Trophy, Briefcase,
  BookOpen, GraduationCap, Cpu, Database, Lock, Workflow, Settings,
  BarChart, LineChart, PieChart, Activity, Gauge, MessageCircle,
  Phone, Mail, Calendar, Clock, DollarSign, CreditCard, ShoppingCart,
  Package, Truck, MapPin, Home, Building, Factory, Store
} from 'lucide-react';
import '../../index.css';

// Lista de iconos disponibles con categorías
const AVAILABLE_ICONS = [
  // Negocios y Objetivos
  { name: 'Target', component: Target, label: 'Objetivo', category: 'Negocios' },
  { name: 'Trophy', component: Trophy, label: 'Trofeo', category: 'Negocios' },
  { name: 'Award', component: Award, label: 'Premio', category: 'Negocios' },
  { name: 'Briefcase', component: Briefcase, label: 'Maletín', category: 'Negocios' },
  { name: 'TrendingUp', component: TrendingUp, label: 'Crecimiento', category: 'Negocios' },
  
  // Innovación y Tecnología
  { name: 'Lightbulb', component: Lightbulb, label: 'Innovación', category: 'Tecnología' },
  { name: 'Rocket', component: Rocket, label: 'Cohete', category: 'Tecnología' },
  { name: 'Zap', component: Zap, label: 'Energía', category: 'Tecnología' },
  { name: 'Code', component: Code, label: 'Código', category: 'Tecnología' },
  { name: 'Cpu', component: Cpu, label: 'Procesador', category: 'Tecnología' },
  { name: 'Database', component: Database, label: 'Base de Datos', category: 'Tecnología' },
  { name: 'Workflow', component: Workflow, label: 'Flujo', category: 'Tecnología' },
  { name: 'Settings', component: Settings, label: 'Configuración', category: 'Tecnología' },
  
  // Personas y Colaboración
  { name: 'Users', component: Users, label: 'Equipo', category: 'Personas' },
  { name: 'Heart', component: Heart, label: 'Corazón', category: 'Personas' },
  { name: 'MessageCircle', component: MessageCircle, label: 'Mensaje', category: 'Personas' },
  { name: 'Phone', component: Phone, label: 'Teléfono', category: 'Personas' },
  { name: 'Mail', component: Mail, label: 'Email', category: 'Personas' },
  
  // Seguridad y Calidad
  { name: 'Shield', component: Shield, label: 'Escudo', category: 'Seguridad' },
  { name: 'Lock', component: Lock, label: 'Candado', category: 'Seguridad' },
  { name: 'CheckCircle', component: CheckCircle, label: 'Verificado', category: 'Seguridad' },
  
  // Educación y Aprendizaje
  { name: 'BookOpen', component: BookOpen, label: 'Libro', category: 'Educación' },
  { name: 'GraduationCap', component: GraduationCap, label: 'Graduación', category: 'Educación' },
  
  // Datos y Análisis
  { name: 'BarChart', component: BarChart, label: 'Gráfico Barras', category: 'Análisis' },
  { name: 'LineChart', component: LineChart, label: 'Gráfico Líneas', category: 'Análisis' },
  { name: 'PieChart', component: PieChart, label: 'Gráfico Circular', category: 'Análisis' },
  { name: 'Activity', component: Activity, label: 'Actividad', category: 'Análisis' },
  { name: 'Gauge', component: Gauge, label: 'Velocímetro', category: 'Análisis' },
  
  // Otros
  { name: 'Star', component: Star, label: 'Estrella', category: 'Otros' },
  { name: 'Globe', component: Globe, label: 'Globo', category: 'Otros' },
  { name: 'Sparkles', component: Sparkles, label: 'Destellos', category: 'Otros' },
  { name: 'Calendar', component: Calendar, label: 'Calendario', category: 'Otros' },
  { name: 'Clock', component: Clock, label: 'Reloj', category: 'Otros' },
  { name: 'DollarSign', component: DollarSign, label: 'Dólar', category: 'Otros' },
  { name: 'CreditCard', component: CreditCard, label: 'Tarjeta', category: 'Otros' },
  { name: 'ShoppingCart', component: ShoppingCart, label: 'Carrito', category: 'Otros' },
  { name: 'Package', component: Package, label: 'Paquete', category: 'Otros' },
  { name: 'Truck', component: Truck, label: 'Camión', category: 'Otros' },
  { name: 'MapPin', component: MapPin, label: 'Ubicación', category: 'Otros' },
  { name: 'Home', component: Home, label: 'Casa', category: 'Otros' },
  { name: 'Building', component: Building, label: 'Edificio', category: 'Otros' },
  { name: 'Factory', component: Factory, label: 'Fábrica', category: 'Otros' },
  { name: 'Store', component: Store, label: 'Tienda', category: 'Otros' },
];

// Función para obtener el componente del icono por nombre
const getIconComponent = (iconName) => {
  const icon = AVAILABLE_ICONS.find(i => i.name === iconName);
  return icon ? icon.component : Target;
};

const SiteConfig = () => {
  const [activeTab, setActiveTab] = useState('hero');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [iconPickerOpen, setIconPickerOpen] = useState(null); // Índice de la característica con el picker abierto

  // Estados para cada sección
  const [heroConfig, setHeroConfig] = useState({
    title: '',
    subtitle: '',
    description: '',
    buttonText: '',
    buttonLink: '',
    backgroundImage: ''
  });

  const [statsConfig, setStatsConfig] = useState({
    stats: []
  });

  const [featuresConfig, setFeaturesConfig] = useState({
    title: '',
    subtitle: '',
    features: []
  });

  const [technologiesConfig, setTechnologiesConfig] = useState({
    items: []
  });

  const [contactInfoConfig, setContactInfoConfig] = useState({
    email: { icon: 'Mail', title: 'Email', value: '', color: 'primary' },
    schedule: { icon: 'Clock', title: 'Horario', value: '', color: 'purple' },
    location: { icon: 'MapPin', title: 'Ubicación', value: '', color: 'pink' }
  });

  const [footerConfig, setFooterConfig] = useState({
    site_name: '',
    site_description: '',
    email: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      setLoading(true);
      const response = await siteConfigService.getAll();
      
      if (response.success) {
        const { data } = response;
        setHeroConfig(data.hero || heroConfig);
        setStatsConfig(data.stats || statsConfig);
        setFeaturesConfig(data.features || featuresConfig);
        setTechnologiesConfig(data.technologies || technologiesConfig);
        setContactInfoConfig(data.contactInfo || contactInfoConfig);
        setFooterConfig(data.footer || footerConfig);
      }
    } catch (error) {
      console.error('Error al cargar configuración:', error);
      toast.error('Error al cargar la configuración');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveHero = async () => {
    try {
      setSaving(true);
      const response = await siteConfigService.update('hero', heroConfig);
      
      if (response.success) {
        toast.success('Configuración del Hero actualizada');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al guardar la configuración');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveStats = async () => {
    try {
      setSaving(true);
      const response = await siteConfigService.update('stats', statsConfig);
      
      if (response.success) {
        toast.success('Estadísticas actualizadas');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al guardar las estadísticas');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveFeatures = async () => {
    try {
      setSaving(true);
      const response = await siteConfigService.update('features', featuresConfig);
      
      if (response.success) {
        toast.success('Características actualizadas');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al guardar las características');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveTechnologies = async () => {
    try {
      setSaving(true);
      const response = await siteConfigService.update('technologies', technologiesConfig);
      
      if (response.success) {
        toast.success('Tecnologías actualizadas');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al guardar las tecnologías');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveContactInfo = async () => {
    try {
      setSaving(true);
      const response = await siteConfigService.update('contactInfo', contactInfoConfig);
      
      if (response.success) {
        toast.success('Información de contacto actualizada');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al guardar la información de contacto');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveFooter = async () => {
    try {
      setSaving(true);
      const response = await siteConfigService.update('footer', footerConfig);
      
      if (response.success) {
        toast.success('Footer actualizado');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al guardar el footer');
    } finally {
      setSaving(false);
    }
  };

  const updateStat = (index, field, value) => {
    const newStats = [...statsConfig.stats];
    newStats[index] = { ...newStats[index], [field]: value };
    setStatsConfig({ stats: newStats });
  };

  const updateFeature = (index, field, value) => {
    const newFeatures = [...featuresConfig.features];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    setFeaturesConfig({ ...featuresConfig, features: newFeatures });
  };

  const selectIcon = (index, iconName) => {
    updateFeature(index, 'icon', iconName);
    setIconPickerOpen(null); // Cerrar el picker después de seleccionar
  };

  const addFeature = () => {
    const newFeature = {
      id: featuresConfig.features.length + 1,
      icon: '✨',
      title: 'Nueva Característica',
      description: 'Descripción de la característica'
    };
    setFeaturesConfig({
      ...featuresConfig,
      features: [...featuresConfig.features, newFeature]
    });
  };

  const removeFeature = (index) => {
    const newFeatures = featuresConfig.features.filter((_, i) => i !== index);
    setFeaturesConfig({ ...featuresConfig, features: newFeatures });
  };

  const addTechnology = () => {
    setTechnologiesConfig({
      items: [...technologiesConfig.items, 'Nueva Tecnología']
    });
  };

  const updateTechnology = (index, value) => {
    const newItems = [...technologiesConfig.items];
    newItems[index] = value;
    setTechnologiesConfig({ items: newItems });
  };

  const removeTechnology = (index) => {
    const newItems = technologiesConfig.items.filter((_, i) => i !== index);
    setTechnologiesConfig({ items: newItems });
  };

  const updateContactInfo = (section, field, value) => {
    setContactInfoConfig({
      ...contactInfoConfig,
      [section]: { ...contactInfoConfig[section], [field]: value }
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Configuración del Sitio</h1>
        <p className="text-gray-600 mt-2">Personaliza el contenido de la página principal</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('hero')}
            className={`${
              activeTab === 'hero'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
          >
            Hero Section
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`${
              activeTab === 'stats'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
          >
            Estadísticas
          </button>
          <button
            onClick={() => setActiveTab('features')}
            className={`${
              activeTab === 'features'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
          >
            ¿Por qué Elegirnos?
          </button>
          <button
            onClick={() => setActiveTab('technologies')}
            className={`${
              activeTab === 'technologies'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
          >
            Tecnologías
          </button>
          <button
            onClick={() => setActiveTab('contactInfo')}
            className={`${
              activeTab === 'contactInfo'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
          >
            Información de Contacto
          </button>
          <button
            onClick={() => setActiveTab('footer')}
            className={`${
              activeTab === 'footer'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
          >
            Footer
          </button>
        </nav>
      </div>

      {/* Hero Section Tab */}
      {activeTab === 'hero' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Sección Hero</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título Principal
              </label>
              <input
                type="text"
                value={heroConfig.title}
                onChange={(e) => setHeroConfig({ ...heroConfig, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subtítulo
              </label>
              <input
                type="text"
                value={heroConfig.subtitle}
                onChange={(e) => setHeroConfig({ ...heroConfig, subtitle: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                value={heroConfig.description}
                onChange={(e) => setHeroConfig({ ...heroConfig, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Texto del Botón
                </label>
                <input
                  type="text"
                  value={heroConfig.buttonText}
                  onChange={(e) => setHeroConfig({ ...heroConfig, buttonText: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link del Botón
                </label>
                <input
                  type="text"
                  value={heroConfig.buttonLink}
                  onChange={(e) => setHeroConfig({ ...heroConfig, buttonLink: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="/projects"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imagen de Fondo (URL)
              </label>
              <input
                type="text"
                value={heroConfig.backgroundImage}
                onChange={(e) => setHeroConfig({ ...heroConfig, backgroundImage: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="/images/hero-bg.jpg"
              />
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={handleSaveHero}
                disabled={saving}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Tab */}
      {activeTab === 'stats' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Estadísticas</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {statsConfig.stats.map((stat, index) => {
              const IconComponent = getIconComponent(stat.icon || 'TrendingUp');
              const categories = [...new Set(AVAILABLE_ICONS.map(i => i.category))];
              
              return (
                <div key={stat.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                  <h3 className="font-medium mb-3">Estadística {index + 1}</h3>
                  
                  <div className="space-y-3">
                    {/* Selector de Icono */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Icono
                      </label>
                      
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setIconPickerOpen(iconPickerOpen === `stat-${index}` ? null : `stat-${index}`)}
                          className="flex items-center gap-3 px-3 py-2 border-2 border-gray-300 rounded-lg hover:border-blue-500 transition-colors bg-white w-full"
                        >
                          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                            <IconComponent className="w-7 h-7 text-blue-600" strokeWidth={2.5} />
                          </div>
                          <div className="text-left flex-1">
                            <div className="text-sm font-medium text-gray-900">
                              {AVAILABLE_ICONS.find(i => i.name === stat.icon)?.label || 'Seleccionar icono'}
                            </div>
                          </div>
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>

                        {/* Panel del Icon Picker */}
                        {iconPickerOpen === `stat-${index}` && (
                          <>
                            <div 
                              className="fixed inset-0 z-40"
                              onClick={() => setIconPickerOpen(null)}
                            />
                            
                            <div className="absolute left-0 mt-2 w-full sm:w-80 bg-white border-2 border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden">
                              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-semibold text-gray-900 text-sm">Seleccionar Icono</h4>
                                  <button
                                    onClick={() => setIconPickerOpen(null)}
                                    className="text-gray-400 hover:text-gray-600"
                                  >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                </div>
                              </div>

                              <div className="max-h-64 overflow-y-auto p-3">
                                {categories.map(category => (
                                  <div key={category} className="mb-3 last:mb-0">
                                    <h5 className="text-xs font-bold text-gray-500 uppercase mb-2 px-1 sticky top-0 bg-white py-1">
                                      {category}
                                    </h5>
                                    <div className="grid grid-cols-5 gap-2">
                                      {AVAILABLE_ICONS
                                        .filter(iconOption => iconOption.category === category)
                                        .map((iconOption) => {
                                          const Icon = iconOption.component;
                                          const isSelected = stat.icon === iconOption.name;
                                          
                                          return (
                                            <button
                                              key={iconOption.name}
                                              type="button"
                                              onClick={() => {
                                                updateStat(index, 'icon', iconOption.name);
                                                setIconPickerOpen(null);
                                              }}
                                              className={`group relative p-2 rounded-lg flex items-center justify-center transition-all ${
                                                isSelected
                                                  ? 'bg-blue-100 border-2 border-blue-500 shadow-md'
                                                  : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent hover:border-gray-300'
                                              }`}
                                              title={iconOption.label}
                                            >
                                              <Icon 
                                                className={`w-5 h-5 transition-colors ${
                                                  isSelected ? 'text-blue-600' : 'text-gray-600 group-hover:text-gray-900'
                                                }`}
                                              />
                                              
                                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                                {iconOption.label}
                                              </div>
                                            </button>
                                          );
                                        })}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Valor
                      </label>
                      <input
                        type="text"
                        value={stat.value}
                        onChange={(e) => updateStat(index, 'value', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="10+"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Etiqueta
                      </label>
                      <input
                        type="text"
                        value={stat.label}
                        onChange={(e) => updateStat(index, 'label', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Años de Experiencia"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={handleSaveStats}
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </div>
      )}

      {/* Features Tab */}
      {activeTab === 'features' && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">¿Por qué Elegirnos?</h2>
            <button
              onClick={addFeature}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              + Agregar Característica
            </button>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título de la Sección
              </label>
              <input
                type="text"
                value={featuresConfig.title}
                onChange={(e) => setFeaturesConfig({ ...featuresConfig, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subtítulo
              </label>
              <input
                type="text"
                value={featuresConfig.subtitle}
                onChange={(e) => setFeaturesConfig({ ...featuresConfig, subtitle: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="space-y-4">
            {featuresConfig.features.map((feature, index) => {
              const IconComponent = getIconComponent(feature.icon);
              const categories = [...new Set(AVAILABLE_ICONS.map(i => i.category))];
              
              return (
                <div key={feature.id} className="border border-gray-200 rounded-lg p-6 bg-white">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-medium text-lg">Característica {index + 1}</h3>
                    <button
                      onClick={() => removeFeature(index)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Eliminar
                    </button>
                  </div>
                  
                  {/* Selector de Icono tipo Emoji Picker */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Icono
                    </label>
                    
                    {/* Botón para abrir el picker */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setIconPickerOpen(iconPickerOpen === index ? null : index)}
                        className="flex items-center gap-3 px-4 py-3 border-2 border-gray-300 rounded-lg hover:border-blue-500 transition-colors bg-white w-full sm:w-auto"
                      >
                        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                          <IconComponent className="w-8 h-8 text-blue-600" strokeWidth={2.5} />
                        </div>
                        <div className="text-left flex-1">
                          <div className="text-sm font-medium text-gray-900">
                            {AVAILABLE_ICONS.find(i => i.name === feature.icon)?.label || 'Objetivo'}
                          </div>
                          <div className="text-xs text-gray-500">
                            Click para cambiar
                          </div>
                        </div>
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {/* Panel del Icon Picker (tipo emoji picker) */}
                      {iconPickerOpen === index && (
                        <>
                          {/* Overlay para cerrar al hacer click afuera */}
                          <div 
                            className="fixed inset-0 z-40"
                            onClick={() => setIconPickerOpen(null)}
                          />
                          
                          {/* Panel del picker */}
                          <div className="absolute left-0 mt-2 w-full sm:w-96 bg-white border-2 border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden">
                            {/* Header */}
                            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                              <div className="flex items-center justify-between">
                                <h4 className="font-semibold text-gray-900">Seleccionar Icono</h4>
                                <button
                                  onClick={() => setIconPickerOpen(null)}
                                  className="text-gray-400 hover:text-gray-600"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            </div>

                            {/* Contenido con scroll */}
                            <div className="max-h-80 overflow-y-auto p-4">
                              {categories.map(category => (
                                <div key={category} className="mb-4 last:mb-0">
                                  <h5 className="text-xs font-bold text-gray-500 uppercase mb-2 px-1 sticky top-0 bg-white py-1">
                                    {category}
                                  </h5>
                                  <div className="grid grid-cols-6 gap-2">
                                    {AVAILABLE_ICONS
                                      .filter(iconOption => iconOption.category === category)
                                      .map((iconOption) => {
                                        const Icon = iconOption.component;
                                        const isSelected = feature.icon === iconOption.name;
                                        
                                        return (
                                          <button
                                            key={iconOption.name}
                                            type="button"
                                            onClick={() => selectIcon(index, iconOption.name)}
                                            className={`group relative p-3 rounded-lg flex items-center justify-center transition-all ${
                                              isSelected
                                                ? 'bg-blue-100 border-2 border-blue-500 shadow-md'
                                                : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent hover:border-gray-300'
                                            }`}
                                            title={iconOption.label}
                                          >
                                            <Icon 
                                              className={`w-6 h-6 transition-colors ${
                                                isSelected ? 'text-blue-600' : 'text-gray-600 group-hover:text-gray-900'
                                              }`}
                                            />
                                            
                                            {/* Tooltip */}
                                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                              {iconOption.label}
                                            </div>
                                          </button>
                                        );
                                      })}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Título y Descripción */}
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Título
                      </label>
                      <input
                        type="text"
                        value={feature.title}
                        onChange={(e) => updateFeature(index, 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Título de la característica"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Descripción
                      </label>
                      <textarea
                        value={feature.description}
                        onChange={(e) => updateFeature(index, 'description', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Descripción de la característica"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={handleSaveFeatures}
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </div>
      )}

      {/* Pestaña Tecnologías */}
      {activeTab === 'technologies' && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Tecnologías</h2>
            <p className="text-gray-600 text-sm">Gestiona las tecnologías que se muestran en el Hero Section</p>
          </div>

          <div className="space-y-4">
            {technologiesConfig.items.map((tech, index) => (
              <div key={index} className="flex gap-3">
                <input
                  type="text"
                  value={tech}
                  onChange={(e) => updateTechnology(index, e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nombre de la tecnología"
                />
                <button
                  onClick={() => removeTechnology(index)}
                  className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                >
                  Eliminar
                </button>
              </div>
            ))}

            <button
              onClick={addTechnology}
              className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors"
            >
              + Agregar Tecnología
            </button>
          </div>

          <div className="flex justify-end pt-6">
            <button
              onClick={handleSaveTechnologies}
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </div>
      )}

      {/* Pestaña Información de Contacto */}
      {activeTab === 'contactInfo' && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Información de Contacto</h2>
            <p className="text-gray-600 text-sm">Configura la información que se muestra debajo del formulario de contacto</p>
          </div>

          <div className="space-y-6">
            {/* Email */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                {(() => {
                  const IconComponent = getIconComponent(contactInfoConfig.email.icon);
                  return <IconComponent className="w-5 h-5 text-primary-600" />;
                })()}
                Email
              </h3>
              <div className="space-y-4">
                {/* Selector de Icono */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Icono
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIconPickerOpen(iconPickerOpen === 'contact-email' ? null : 'contact-email')}
                      className="flex items-center gap-3 px-3 py-2 border-2 border-gray-300 rounded-lg hover:border-blue-500 transition-colors bg-white w-full"
                    >
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                        {(() => {
                          const IconComponent = getIconComponent(contactInfoConfig.email.icon);
                          return <IconComponent className="w-7 h-7 text-blue-600" strokeWidth={2.5} />;
                        })()}
                      </div>
                      <div className="text-left flex-1">
                        <div className="text-sm font-medium text-gray-900">
                          {AVAILABLE_ICONS.find(i => i.name === contactInfoConfig.email.icon)?.label || 'Seleccionar icono'}
                        </div>
                      </div>
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {iconPickerOpen === 'contact-email' && (
                      <>
                        <div 
                          className="fixed inset-0 z-40"
                          onClick={() => setIconPickerOpen(null)}
                        />
                        
                        <div className="absolute left-0 mt-2 w-full sm:w-80 bg-white border-2 border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden">
                          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold text-gray-900 text-sm">Seleccionar Icono</h4>
                              <button
                                onClick={() => setIconPickerOpen(null)}
                                className="text-gray-400 hover:text-gray-600"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          </div>
                          <div className="overflow-y-auto p-4" style={{ maxHeight: '400px' }}>
                            {['Negocios', 'Tecnología', 'Personas', 'Seguridad', 'Educación', 'Análisis', 'Otros'].map((category) => {
                              const categoryIcons = AVAILABLE_ICONS.filter(icon => icon.category === category);
                              if (categoryIcons.length === 0) return null;
                              
                              return (
                                <div key={category} className="mb-4">
                                  <h5 className="text-xs font-semibold text-gray-500 mb-2 uppercase">{category}</h5>
                                  <div className="grid grid-cols-6 gap-2">
                                    {categoryIcons.map((icon) => {
                                      const IconComponent = getIconComponent(icon.name);
                                      return (
                                        <button
                                          key={icon.name}
                                          onClick={() => {
                                            updateContactInfo('email', 'icon', icon.name);
                                            setIconPickerOpen(null);
                                          }}
                                          className="p-3 hover:bg-gray-100 rounded-lg transition-colors group relative"
                                          title={icon.label}
                                        >
                                          <IconComponent className="w-6 h-6 text-gray-700 group-hover:text-blue-600 mx-auto" strokeWidth={2} />
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título
                  </label>
                  <input
                    type="text"
                    value={contactInfoConfig.email.title}
                    onChange={(e) => updateContactInfo('email', 'title', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valor
                  </label>
                  <input
                    type="email"
                    value={contactInfoConfig.email.value}
                    onChange={(e) => updateContactInfo('email', 'value', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Horario */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                {(() => {
                  const IconComponent = getIconComponent(contactInfoConfig.schedule.icon);
                  return <IconComponent className="w-5 h-5 text-purple-600" />;
                })()}
                Horario
              </h3>
              <div className="space-y-4">
                {/* Selector de Icono */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Icono
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIconPickerOpen(iconPickerOpen === 'contact-schedule' ? null : 'contact-schedule')}
                      className="flex items-center gap-3 px-3 py-2 border-2 border-gray-300 rounded-lg hover:border-blue-500 transition-colors bg-white w-full"
                    >
                      <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                        {(() => {
                          const IconComponent = getIconComponent(contactInfoConfig.schedule.icon);
                          return <IconComponent className="w-7 h-7 text-purple-600" strokeWidth={2.5} />;
                        })()}
                      </div>
                      <div className="text-left flex-1">
                        <div className="text-sm font-medium text-gray-900">
                          {AVAILABLE_ICONS.find(i => i.name === contactInfoConfig.schedule.icon)?.label || 'Seleccionar icono'}
                        </div>
                      </div>
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {iconPickerOpen === 'contact-schedule' && (
                      <>
                        <div 
                          className="fixed inset-0 z-40"
                          onClick={() => setIconPickerOpen(null)}
                        />
                        
                        <div className="absolute left-0 mt-2 w-full sm:w-80 bg-white border-2 border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden">
                          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold text-gray-900 text-sm">Seleccionar Icono</h4>
                              <button
                                onClick={() => setIconPickerOpen(null)}
                                className="text-gray-400 hover:text-gray-600"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          </div>
                          <div className="overflow-y-auto p-4" style={{ maxHeight: '400px' }}>
                            {['Negocios', 'Tecnología', 'Personas', 'Seguridad', 'Educación', 'Análisis', 'Otros'].map((category) => {
                              const categoryIcons = AVAILABLE_ICONS.filter(icon => icon.category === category);
                              if (categoryIcons.length === 0) return null;
                              
                              return (
                                <div key={category} className="mb-4">
                                  <h5 className="text-xs font-semibold text-gray-500 mb-2 uppercase">{category}</h5>
                                  <div className="grid grid-cols-6 gap-2">
                                    {categoryIcons.map((icon) => {
                                      const IconComponent = getIconComponent(icon.name);
                                      return (
                                        <button
                                          key={icon.name}
                                          onClick={() => {
                                            updateContactInfo('schedule', 'icon', icon.name);
                                            setIconPickerOpen(null);
                                          }}
                                          className="p-3 hover:bg-gray-100 rounded-lg transition-colors group relative"
                                          title={icon.label}
                                        >
                                          <IconComponent className="w-6 h-6 text-gray-700 group-hover:text-blue-600 mx-auto" strokeWidth={2} />
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título
                  </label>
                  <input
                    type="text"
                    value={contactInfoConfig.schedule.title}
                    onChange={(e) => updateContactInfo('schedule', 'title', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valor
                  </label>
                  <input
                    type="text"
                    value={contactInfoConfig.schedule.value}
                    onChange={(e) => updateContactInfo('schedule', 'value', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Ubicación */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                {(() => {
                  const IconComponent = getIconComponent(contactInfoConfig.location.icon);
                  return <IconComponent className="w-5 h-5 text-pink-600" />;
                })()}
                Ubicación
              </h3>
              <div className="space-y-4">
                {/* Selector de Icono */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Icono
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIconPickerOpen(iconPickerOpen === 'contact-location' ? null : 'contact-location')}
                      className="flex items-center gap-3 px-3 py-2 border-2 border-gray-300 rounded-lg hover:border-blue-500 transition-colors bg-white w-full"
                    >
                      <div className="w-10 h-10 bg-pink-50 rounded-lg flex items-center justify-center">
                        {(() => {
                          const IconComponent = getIconComponent(contactInfoConfig.location.icon);
                          return <IconComponent className="w-7 h-7 text-pink-600" strokeWidth={2.5} />;
                        })()}
                      </div>
                      <div className="text-left flex-1">
                        <div className="text-sm font-medium text-gray-900">
                          {AVAILABLE_ICONS.find(i => i.name === contactInfoConfig.location.icon)?.label || 'Seleccionar icono'}
                        </div>
                      </div>
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {iconPickerOpen === 'contact-location' && (
                      <>
                        <div 
                          className="fixed inset-0 z-40"
                          onClick={() => setIconPickerOpen(null)}
                        />
                        
                        <div className="absolute left-0 mt-2 w-full sm:w-80 bg-white border-2 border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden">
                          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold text-gray-900 text-sm">Seleccionar Icono</h4>
                              <button
                                onClick={() => setIconPickerOpen(null)}
                                className="text-gray-400 hover:text-gray-600"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          </div>
                          <div className="overflow-y-auto p-4" style={{ maxHeight: '400px' }}>
                            {['Negocios', 'Tecnología', 'Personas', 'Seguridad', 'Educación', 'Análisis', 'Otros'].map((category) => {
                              const categoryIcons = AVAILABLE_ICONS.filter(icon => icon.category === category);
                              if (categoryIcons.length === 0) return null;
                              
                              return (
                                <div key={category} className="mb-4">
                                  <h5 className="text-xs font-semibold text-gray-500 mb-2 uppercase">{category}</h5>
                                  <div className="grid grid-cols-6 gap-2">
                                    {categoryIcons.map((icon) => {
                                      const IconComponent = getIconComponent(icon.name);
                                      return (
                                        <button
                                          key={icon.name}
                                          onClick={() => {
                                            updateContactInfo('location', 'icon', icon.name);
                                            setIconPickerOpen(null);
                                          }}
                                          className="p-3 hover:bg-gray-100 rounded-lg transition-colors group relative"
                                          title={icon.label}
                                        >
                                          <IconComponent className="w-6 h-6 text-gray-700 group-hover:text-blue-600 mx-auto" strokeWidth={2} />
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título
                  </label>
                  <input
                    type="text"
                    value={contactInfoConfig.location.title}
                    onChange={(e) => updateContactInfo('location', 'title', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valor
                  </label>
                  <input
                    type="text"
                    value={contactInfoConfig.location.value}
                    onChange={(e) => updateContactInfo('location', 'value', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-6">
            <button
              onClick={handleSaveContactInfo}
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </div>
      )}

      {/* Pestaña Footer */}
      {activeTab === 'footer' && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Configuración del Footer</h2>
            <p className="text-gray-600 text-sm">Información general que se muestra en el footer del sitio</p>
          </div>

          <div className="space-y-6">
            {/* Información General */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Información General</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Sitio
                </label>
                <input
                  type="text"
                  value={footerConfig.site_name}
                  onChange={(e) => setFooterConfig({ ...footerConfig, site_name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Proyectos TI Valpo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción del Sitio
                </label>
                <textarea
                  value={footerConfig.site_description}
                  onChange={(e) => setFooterConfig({ ...footerConfig, site_description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Descripción que aparecerá en el footer..."
                />
                <p className="text-sm text-gray-500 mt-1">
                  Esta descripción se mostrará en el footer del sitio
                </p>
              </div>
            </div>

            {/* Información de Contacto */}
            <div className="border-t pt-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Información de Contacto</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={footerConfig.email}
                    onChange={(e) => setFooterConfig({ ...footerConfig, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="info@proyectostivalpo.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="text"
                    value={footerConfig.phone}
                    onChange={(e) => setFooterConfig({ ...footerConfig, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+56 9 1234 5678"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección
                  </label>
                  <input
                    type="text"
                    value={footerConfig.address}
                    onChange={(e) => setFooterConfig({ ...footerConfig, address: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Valparaíso, Chile"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-6 border-t mt-6">
            <button
              onClick={handleSaveFooter}
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </div>
      )}
    </div>
    </AdminLayout>
  );
};

export default SiteConfig;
