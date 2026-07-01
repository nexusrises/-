import React, { useState, useEffect } from 'react';
import { MapPin, Maximize2, ArrowRight, X, ExternalLink, Check, Search } from 'lucide-react';
import VirtualTour from '../components/VirtualTour';

const propiedades = [
  {
    id: 1,
    titulo: 'Residencial Maravillas',
    tipo: 'TERRENO / LOTE',
    tipoColor: 'bg-[#080d1a]/95 text-[#59b2ff] border-blue-500/45 shadow-[0_2px_8px_rgba(59,130,246,0.15)]',
    tiene360: true,
    ubicacion: 'Salida a Puno, Juliaca - Puno',
    direccion: 'Av. Circunvalación Norte Km 4.5',
    urbanizacion: 'Urb. Pte. Maravillas',
    referencia: 'A 3 cuadras del Pte. Maravillas',
    mapsLink: 'https://maps.google.com/?q=-15.434612,-70.1434597',
    mapsIframe: 'https://www.google.com/maps/embed?pb=!1m13!1m8!1m3!1d4792.382800364904!2d-70.1434597!3d-15.434612!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTXCsDI2JzA0LjQiUyA3MMKwMDgnMzUuMyJX!5e1!3m2!1ses!2spe!4v1782271697782!5m2!1ses!2spe',
    descripcionCorta: 'Condominio exclusivo de terrenos campestres rodeado de los majestuosos Apus del Valle Sagrado. Diseñado bajo...',
    descripcionCompleta: 'Valle Hermoso Residencial Club es un condominio campestre exclusivo diseñado para quienes buscan vivir en armonía con la naturaleza en el corazón del Valle Sagrado de los Incas. Ofrece un diseño urbanístico de vanguardia integrado con el entorno paisajístico, ideal para residencias de campo familiares o proyectos turísticos boutique.',
    beneficios: [
      'Pórtico de ingreso monumental controlado las 24 horas con seguridad privada.',
      'Habilitación urbana completa con redes de agua potable, desagüe y electricidad subterránea.',
      'Vías de acceso pavimentadas con veredas y cunetas de evacuación pluvial.',
      'Más de 10,000 m² de áreas verdes destinadas a parques, senderos ecológicos y zonas de fogata.',
      'Reglamento interno de construcción que garantiza la armonía arquitectónica y plusvalía.'
    ],
    area: '160 m²',
    precio: 'S/. 32,000',
    portada: '/tour/Vista Aerea Residencial Maravillas.jpg',
    tourId: 'inmobiliaria'
  },
  {
    id: 2,
    titulo: 'Condominio Residencial Mirador Juliaca',
    tipo: 'TERRENO / LOTE',
    tipoColor: 'bg-[#080d1a]/95 text-[#59b2ff] border-blue-500/45 shadow-[0_2px_8px_rgba(59,130,246,0.15)]',
    tiene360: true,
    ubicacion: 'Salida a Puno, Juliaca - Puno',
    direccion: 'Jr. Los Tulipanes N° 450',
    urbanizacion: 'Urb. Mirador del Altiplano',
    referencia: 'A espaldas del Colegio Adventista',
    mapsLink: 'https://maps.google.com/?q=Salida+a+Puno,Juliaca',
    mapsIframe: 'https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3388.726375826678!2d-70.14345967956788!3d-15.434612021624718!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTXCsDI2JzA0LjQiUyA3MMKwMDgnMzUuMyJX!5e1!3m2!1ses!2spe!4v1782262972077!5m2!1ses!2spe',
    descripcionCorta: 'El primer gran proyecto de lotización inteligente con habilitación urbana completa en el corazón comercial d...',
    descripcionCompleta: 'Condominio Residencial Mirador Juliaca representa el primer proyecto inmobiliario inteligente y planificado de la región. Ubicado de forma estratégica en la zona de mayor expansión urbana y comercial (Salida a Puno), ofrece el respaldo de un desarrollo formal para asegurar tu inversión.',
    beneficios: [
      'Pistas pavimentadas de alta resistencia y veredas anchas de concreto fluido.',
      'Servicios básicos instalados a pie de lote (agua, alcantarillado y energía eléctrica de red).',
      'Alumbrado público integral de tecnología LED para mayor seguridad nocturna.',
      'Parques temáticos recreacionales equipados con juegos para niños y minicanchas deportivas.',
      'Ubicación privilegiada libre de inundaciones y con conectividad directa al transporte público.'
    ],
    area: '150 m²',
    precio: '$115,000',
    portada: '/tour/02_residencial_maravillas.jpg',
    tourId: 'inmobiliaria'
  },
  {
    id: 3,
    titulo: 'Hacienda del Sol Campestre',
    tipo: 'CASA RESIDENCIAL',
    tipoColor: 'bg-[#060e17]/95 text-[#22d3ee] border-cyan-500/45 shadow-[0_2px_8px_rgba(34,211,238,0.15)]',
    tiene360: true,
    ubicacion: 'Sabandía, Arequipa',
    direccion: 'Calle Bolognesi N° 102',
    urbanizacion: 'Fundo El Sol',
    referencia: 'Al costado de la piscina municipal de Sabandía',
    mapsLink: 'https://maps.google.com/?q=Sabandia,Arequipa',
    mapsIframe: 'https://maps.google.com/maps?q=Sabandia,Arequipa&t=&z=13&ie=UTF8&iwloc=&output=embed',
    descripcionCorta: 'Exclusivas casas de campo con arquitectura moderna que integra el tradicional sillar blanco arequipeño. Ubic...',
    descripcionCompleta: 'Hacienda del Sol Campestre es una propuesta residencial premium de casas campestres que fusiona de forma impecable el confort de la vida moderna con la tranquilidad del campo. Ubicadas en la tradicional campiña de Sabandía, estas casas destacan por su excelente diseño estructural y espacial.',
    beneficios: [
      'Construcción antisísmica con acabados finos utilizando sillar blanco de canteras arequipeñas.',
      'Distribución óptima de doble altura con grandes ventanales de vidrio templado termoacústico.',
      'Amplia cocina tipo americana con isla central y mesones de cuarzo de alta resistencia.',
      'Jardín interior privado de más de 80 m² con zona de parrilla y horno de sillar preinstalado.',
      'Espectacular vista panorámica garantizada en 360 grados hacia el volcán Misti y la campiña.'
    ],
    area: '180 m²',
    precio: '$295,000',
    portada: '/tour/sala.jpg',
    tourId: 'home'
  },
  {
    id: 4,
    titulo: 'Moderno Duplex Industrial San Román',
    tipo: 'DEPARTAMENTO',
    tipoColor: 'bg-[#090b14]/95 text-[#f59e0b] border-amber-500/45 shadow-[0_2px_8px_rgba(245,158,11,0.15)]',
    tiene360: true,
    ubicacion: 'Urb. La Rinconada, Juliaca - Puno',
    direccion: 'Pasaje San Martín N° 128',
    urbanizacion: 'Urb. La Rinconada I Etapa',
    referencia: 'Cerca del parque zonal Rinconada',
    mapsLink: 'https://maps.google.com/?q=La+Rinconada,Juliaca',
    mapsIframe: 'https://maps.google.com/maps?q=La+Rinconada,Juliaca&t=&z=13&ie=UTF8&iwloc=&output=embed',
    descripcionCorta: 'Exclusivo departamento duplex con acabados industriales de lujo, concreto expuesto, iluminación inteligent...',
    descripcionCompleta: 'Moderno Duplex Industrial San Román es un departamento de diseño vanguardista que integra concreto visto, detalles en fierro negro y sutil iluminación LED. Ubicado en la zona residencial más tranquila y segura de la Urb. La Rinconada, ofrece un confort termoacústico excelente para el clima del altiplano.',
    beneficios: [
      'Ventanas de doble vidrio termoacústico con aislamiento térmico reforzado contra heladas.',
      'Sistema de calefacción por suelo radiante zonificado en sala, comedor y dormitorio principal.',
      'Amplia cocina abierta con mesada de granito negro absoluto y grifería de alta gama.',
      'Área común en terraza con zona de parrilla techada, fogatero de sillar y vista a toda la ciudad.',
      'Cochera independiente con portón levadizo eléctrico y sistema de videovigilancia las 24 horas.'
    ],
    area: '120 m²',
    precio: '$135,000',
    portada: '/tour/sala.jpg',
    tourId: 'home'
  },
  {
    id: 5,
    titulo: 'Smart Apartment Vista Hermosa',
    tipo: 'DEPARTAMENTO',
    tipoColor: 'bg-[#090b14]/95 text-[#f59e0b] border-amber-500/45 shadow-[0_2px_8px_rgba(245,158,11,0.15)]',
    tiene360: true,
    ubicacion: 'Salida a Puno Km 2, Juliaca - Puno',
    direccion: 'Av. Andrés Avelino Cáceres N° 1204',
    urbanizacion: 'Urb. Vista Hermosa',
    referencia: 'Frente al centro comercial Real Plaza Juliaca',
    mapsLink: 'https://maps.google.com/?q=-15.434612,-70.1434597',
    mapsIframe: 'https://www.google.com/maps/embed?pb=!1m13!1m8!1m3!1d4792.382800364904!2d-70.1434597!3d-15.434612!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTXCsDI2JzA0LjQiUyA3MMKwMDgnMzUuMyJX!5e1!3m2!1ses!2spe!4v1782271697782!5m2!1ses!2spe',
    descripcionCorta: 'Departamento inteligente en piso 6 con domótica integrada, vistas panorámicas, conectividad de fibra ópt...',
    descripcionCompleta: 'Smart Apartment Vista Hermosa redefine el concepto de vivienda inteligente en Juliaca. Equipado con domótica integral para controlar luces, temperatura, accesos y sonido mediante comandos de voz. Su ubicación en el Edificio Domo Tower le garantiza una vista privilegiada y excelente asoleamiento directo durante todo el día.',
    beneficios: [
      'Dormitorio principal con walk-in closet y baño con acabados de cuarzo y jacuzzi de hidromasajes.',
      'Doble puerta de ingreso con cerradura biométrica de reconocimiento facial y huella dactilar.',
      'Red de fibra óptica dedicada con puntos de acceso de alta velocidad en todos los ambientes.',
      'Ascensor panorámico de última generación con acceso directo y restringido mediante tarjeta digital.',
      'Edificio antisísmico equipado con sistema de paneles solares para áreas comunes y terma solar propia.'
    ],
    area: '95 m²',
    precio: '$98,000',
    portada: '/tour/02_residencial_maravillas.jpg',
    tourId: 'inmobiliaria'
  },
  {
    id: 6,
    titulo: 'Villa Residencial Los Portales',
    tipo: 'CASA RESIDENCIAL',
    tipoColor: 'bg-[#060e17]/95 text-[#22d3ee] border-cyan-500/45 shadow-[0_2px_8px_rgba(34,211,238,0.15)]',
    tiene360: true,
    ubicacion: 'Urb. Aeropuerto, Juliaca - Puno',
    direccion: 'Jr. Jorge Chávez N° 850',
    urbanizacion: 'Urb. Aeropuerto IV Sector',
    referencia: 'A media cuadra del aeropuerto Inca Manco Cápac',
    mapsLink: 'https://maps.google.com/?q=-15.434612,-70.1434597',
    mapsIframe: 'https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3388.726375826678!2d-70.14345967956788!3d-15.434612021624718!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTXCsDI2JzA0LjQiUyA3MMKwMDgnMzUuMyJX!5e1!3m2!1ses!2spe!4v1782262972077!5m2!1ses!2spe',
    descripcionCorta: 'Hermosa casa de estreno de 3 pisos con acabados de primera, amplios salones, terraza social y cochera par...',
    descripcionCompleta: 'Villa Residencial Los Portales es una espectacular residencia familiar de 3 niveles de estreno con una arquitectura moderna y distribución espacial excelente. Ubicada en la zona de mayor plusvalía de la Urb. Aeropuerto, cuenta con acabados premium y diseño sismorresistente con columnas reforzadas, ideal para familias numerosas que valoran el espacio y la seguridad.',
    beneficios: [
      '5 dormitorios amplios, 3 de ellos con baño privado incorporado y clósets empotrados de melamina.',
      'Sala de estar familiar e independiente en el segundo piso con balcón hacia la calle pavimentada.',
      'Terraza social en el tercer piso con área de lavandería techada, depósito y patio de tendido.',
      'Cochera techada para 2 camionetas con portón de madera cedro maciza automatizado.',
      'Cerco eléctrico perimetral, alarma contra robos y cámaras de seguridad externas instaladas.'
    ],
    area: '220 m²',
    precio: '$215,000',
    portada: '/tour/Vista Aerea Residencial Maravillas.jpg',
    tourId: 'inmobiliaria'
  }
];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('todos');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTourLoaded, setIsTourLoaded] = useState(false);

  const openPropertyModal = (propiedad) => {
    setSelectedProperty(propiedad);
    setIsTourLoaded(false);
    // Disparar la transición de entrada suave de inmediato
    setTimeout(() => {
      setIsModalOpen(true);
    }, 20);
    // Postergar la renderización del tour y mapa pesados 400ms para asegurar apertura instantánea
    setTimeout(() => {
      setIsTourLoaded(true);
    }, 400);
  };

  const closePropertyModal = () => {
    setIsModalOpen(false);
    // Esperar a que finalice la animación de desvanecimiento y reducción de escala antes de desmontar
    setTimeout(() => {
      setSelectedProperty(null);
      setIsTourLoaded(false);
    }, 300);
  };

  // Estado para el texto dinámico y giratorio del Hero
  const words = ['Proyecto de Inversión', 'Departamento Ideal', 'Hogar Soñado'];
  const [wordIndex, setWordIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    document.title = "Nexus Domo 360° | Venta de Terrenos y Casas en el Sur del Perú";
  }, []);

  // Intervalo para cambiar la palabra con micro-animaciones premium
  useEffect(() => {
    const interval = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setWordIndex((prev) => (prev + 1) % words.length);
        setIsFading(false);
      }, 300); // Duración de la animación de salida
    }, 4000); // Cambia cada 4 segundos

    return () => clearInterval(interval);
  }, []);

  // Filtrado en tiempo real interactivo
  const propiedadesFiltradas = propiedades.filter((p) => {
    const matchCategory = activeCategory === 'todos' ||
      (activeCategory === 'terrenos' && p.tipo === 'TERRENO / LOTE') ||
      (activeCategory === 'casas' && (p.tipo === 'CASA RESIDENCIAL' || p.tipo === 'DEPARTAMENTO'));

    const term = searchTerm.toLowerCase();
    const matchSearch = p.titulo.toLowerCase().includes(term) ||
      p.ubicacion.toLowerCase().includes(term) ||
      p.descripcionCorta.toLowerCase().includes(term) ||
      p.descripcionCompleta.toLowerCase().includes(term);

    return matchCategory && matchSearch;
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && selectedProperty) {
        closePropertyModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProperty]);

  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isModalOpen]);

  return (
    <div className="relative min-h-screen text-white flex flex-col items-center overflow-x-hidden bg-transparent">

      <header className="relative w-full pt-24 pb-2 md:pt-28 md:pb-4 px-6 overflow-hidden flex flex-col justify-center items-center">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-nexus-blue/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-nexus-purple/5 rounded-full blur-[100px] pointer-events-none z-0"></div>

        <div className="max-w-4xl w-full mx-auto relative z-10 flex flex-col items-center text-center">
          <span className="text-[#00f2fe] text-xs md:text-sm font-black tracking-widest uppercase block mb-3 font-display drop-shadow-[0_2px_8px_rgba(0,242,254,0.3)]">
            PORTAL INMOBILIARIO INMERSIVO 3D
          </span>

          <h1
            style={{ textWrap: 'balance' }}
            className="text-3xl sm:text-4xl md:text-6xl font-black text-white leading-[1.15] mb-4.5 tracking-tight font-display"
          >
            Encuentra tu próximo<br />
            <span
              className={`text-gradient-rise inline-block transition-all duration-300 transform ${isFading
                  ? 'opacity-0 -translate-y-2 scale-95'
                  : 'opacity-100 translate-y-0 scale-100'
                }`}
            >
              {words[wordIndex]}
            </span>
          </h1>

          <p
            style={{ textWrap: 'pretty' }}
            className="text-gray-400 text-base md:text-lg max-w-2xl leading-relaxed mb-8"
          >
            Visita y recorre de forma interactiva tu próxima propiedad sin moverte de casa. Explora lotes, terrenos y viviendas verificadas en Juliaca y el sur de Perú con vuelos de dron y visores 360° en alta definición.
          </p>
        </div>
      </header>

      {/* 2. BARRA DE BÚSQUEDA Y FILTROS INTERACTIVOS */}
      <div className="w-full max-w-4xl mx-auto px-6 mb-12 relative z-20">
        <div className="glass-panel border-white/10 rounded-3xl p-4 md:p-6 shadow-[0_15px_50px_rgba(0,0,0,0.5)] flex flex-col gap-5 items-center">
          
          {/* Input de Búsqueda */}
          <div className="w-full relative group">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#00f2fe] transition-colors duration-300">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar terreno, casa o ubicación..."
              className="w-full pl-13 pr-12 py-3.5 bg-[#0a0f1d]/40 border border-white/10 hover:border-white/20 focus:border-[#00f2fe]/40 focus:outline-none focus:ring-1 focus:ring-[#00f2fe]/40 rounded-2xl text-xs md:text-sm text-white placeholder-gray-500 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.3)] focus:shadow-[0_4px_25px_rgba(0,242,254,0.08)] transition-all duration-300 font-sans"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-4 flex items-center px-2 text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer"
                aria-label="Limpiar búsqueda"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Botones de Categorías (Desplazamiento horizontal en móvil con snap magnético) */}
          <div className="flex flex-row md:flex-wrap items-center justify-start md:justify-center gap-2.5 w-full overflow-x-auto md:overflow-x-visible pb-1 md:pb-0 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <button
              onClick={() => setActiveCategory('todos')}
              className={`px-4 md:px-6 py-2.5 md:py-3.5 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-wider transition-all duration-300 cursor-pointer select-none border shrink-0 snap-align-start ${
                activeCategory === 'todos'
                  ? 'bg-[#00f2fe]/10 text-[#00f2fe] border-[#00f2fe]/45 shadow-[0_0_15px_rgba(0,242,254,0.15)] scale-[1.01]'
                  : 'bg-white/[0.02] text-gray-400 border-white/5 hover:text-white hover:bg-white/[0.05] hover:border-white/10'
              }`}
            >
              Todos ({propiedades.length})
            </button>
            <button
              onClick={() => setActiveCategory('terrenos')}
              className={`px-4 md:px-6 py-2.5 md:py-3.5 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-wider transition-all duration-300 cursor-pointer select-none border shrink-0 snap-align-start ${
                activeCategory === 'terrenos'
                  ? 'bg-[#00f2fe]/10 text-[#00f2fe] border-[#00f2fe]/45 shadow-[0_0_15px_rgba(0,242,254,0.15)] scale-[1.01]'
                  : 'bg-white/[0.02] text-gray-400 border-white/5 hover:text-white hover:bg-white/[0.05] hover:border-white/10'
              }`}
            >
              <span className="md:hidden">Terrenos ({propiedades.filter(p => p.tipo === 'TERRENO / LOTE').length})</span>
              <span className="hidden md:inline">Terrenos / Lotizaciones ({propiedades.filter(p => p.tipo === 'TERRENO / LOTE').length})</span>
            </button>
            <button
              onClick={() => setActiveCategory('casas')}
              className={`px-4 md:px-6 py-2.5 md:py-3.5 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-wider transition-all duration-300 cursor-pointer select-none border shrink-0 snap-align-start ${
                activeCategory === 'casas'
                  ? 'bg-[#00f2fe]/10 text-[#00f2fe] border-[#00f2fe]/45 shadow-[0_0_15px_rgba(0,242,254,0.15)] scale-[1.01]'
                  : 'bg-white/[0.02] text-gray-400 border-white/5 hover:text-white hover:bg-white/[0.05] hover:border-white/10'
              }`}
            >
              <span className="md:hidden">Casas/Dptos ({propiedades.filter(p => p.tipo === 'CASA RESIDENCIAL' || p.tipo === 'DEPARTAMENTO').length})</span>
              <span className="hidden md:inline">Casas y Departamentos ({propiedades.filter(p => p.tipo === 'CASA RESIDENCIAL' || p.tipo === 'DEPARTAMENTO').length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. GRID DE PROPIEDADES */}
      <section className="w-full max-w-7xl mx-auto px-3.5 md:px-6 pb-8 md:pb-12 relative z-10">

        {propiedadesFiltradas.length === 0 ? (
          <div className="w-full py-20 text-center bg-[#0c111d]/40 border border-white/5 rounded-3xl backdrop-blur-md">
            <p className="text-gray-400 text-base">No se encontraron propiedades que coincidan con los criterios de búsqueda.</p>
            <button
              onClick={() => { setSearchTerm(''); setActiveCategory('todos'); }}
              className="mt-4 px-6 py-2 rounded-full font-bold text-xs text-[#00f2fe] border border-[#00f2fe]/20 bg-[#00f2fe]/5 hover:bg-[#00f2fe]/15 transition duration-200"
            >
              Restablecer Filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 lg:gap-8">
            {propiedadesFiltradas.map((propiedad) => (
              <div
                key={propiedad.id}
                className="group/card bg-[#0c111d]/70 backdrop-blur-md border border-white/5 rounded-3xl overflow-hidden shadow-xl hover:border-[#00f2fe]/20 hover:shadow-[0_10px_30px_rgba(0,242,254,0.05)] transition-all duration-300 flex flex-col justify-between h-full"
              >
                {/* Cabecera de la Tarjeta: Imagen de Portada y Etiquetas */}
                <div 
                  onClick={() => openPropertyModal(propiedad)}
                  className="relative aspect-video w-full overflow-hidden bg-black/40 border-b border-white/5 cursor-pointer"
                >
                  <img
                    src={propiedad.portada.startsWith('http') || propiedad.portada.startsWith('data:') ? propiedad.portada : `${import.meta.env.BASE_URL.replace(/\/$/, "")}${propiedad.portada}`}
                    alt={propiedad.titulo}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/30 pointer-events-none"></div>

                  {/* Etiqueta de Tipo de Propiedad */}
                  <span className={`absolute top-4 left-4 px-3 py-1.5 rounded-md text-[9px] font-black tracking-wider uppercase border backdrop-blur-md flex items-center gap-1.5 ${propiedad.tipoColor}`}>
                    <span className={`w-1 h-1 rounded-full ${propiedad.tipo === 'TERRENO / LOTE' ? 'bg-blue-400 animate-pulse' : 'bg-cyan-400 animate-pulse'}`}></span>
                    {propiedad.tipo}
                  </span>

                  {/* Etiqueta Vista 360° */}
                  {propiedad.tiene360 && (
                    <button
                      onClick={(e) => { e.stopPropagation(); openPropertyModal(propiedad); }}
                      className="absolute top-4 right-4 bg-[#05140b]/95 border border-[#09d261]/45 text-[#4ade80] px-3 py-1.5 rounded-md text-[9px] font-black tracking-wider uppercase backdrop-blur-md flex items-center gap-1.5 hover:bg-[#09d261]/20 hover:border-[#09d261] transition duration-200 cursor-pointer shadow-[0_2px_8px_rgba(9,210,97,0.15)]"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#09d261] animate-pulse"></span>
                      Vista 360°
                    </button>
                  )}
                </div>

                {/* Contenido de la Tarjeta */}
                <div className="p-6 flex flex-col flex-grow">
                  {/* Ubicación */}
                  <div className="flex items-center gap-1.5 text-[#00f2fe] text-xs font-bold mb-2.5">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{propiedad.ubicacion}</span>
                  </div>

                  {/* Título */}
                  <h3 className="text-xl md:text-2xl font-black text-white mb-3 font-display group-hover/card:text-[#00f2fe] transition-colors duration-300 leading-snug">
                    {propiedad.titulo}
                  </h3>

                  {/* Descripción corta */}
                  <p className="text-gray-400 text-xs md:text-sm leading-relaxed mb-4 flex-grow">
                    {propiedad.descripcionCorta}
                  </p>

                  {/* Ficha de Ubicación Detallada */}
                  <div className="bg-[#0f1626]/60 border border-white/[0.04] rounded-2xl p-3.5 mb-4 space-y-2.5 text-left shadow-inner">
                    <div className="flex items-start gap-2">
                      <span className="text-[#00f2fe] mt-0.5 flex-shrink-0 font-bold text-[9px] bg-[#00f2fe]/10 border border-[#00f2fe]/20 px-1.5 py-0.5 rounded">DIR</span>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider leading-none mb-0.5">Dirección</span>
                        <span className="text-gray-200 text-xs font-medium truncate" title={propiedad.direccion}>{propiedad.direccion}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3.5 pt-2 border-t border-white/[0.04]">
                      <div className="flex flex-col min-w-0">
                        <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider leading-none mb-1">Urbanización</span>
                        <span className="text-gray-200 text-xs font-semibold truncate" title={propiedad.urbanizacion}>{propiedad.urbanizacion}</span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider leading-none mb-1">Referencia</span>
                        <span className="text-gray-200 text-xs font-medium truncate" title={propiedad.referencia}>{propiedad.referencia}</span>
                      </div>
                    </div>
                  </div>

                  {/* Área */}
                  <div className="flex items-center gap-2 text-gray-300 text-xs font-bold py-3.5 border-t border-b border-white/5 mb-4">
                    <Maximize2 className="w-4 h-4 text-[#00f2fe] flex-shrink-0" />
                    <span>Área desde: <span className="text-[#00f2fe]">{propiedad.area}</span></span>
                  </div>

                  {/* Pie de Tarjeta: Precio y Acción */}
                  <div className="flex flex-wrap items-center justify-between gap-3.5 pt-1">
                    <div className="flex flex-col">
                      <span className="text-[9px] text-[#00f2fe] font-bold uppercase tracking-widest">PRECIO DESDE</span>
                      <span className="text-xl font-black text-[#4ade80] font-display leading-none mt-1">{propiedad.precio}</span>
                    </div>

                    <button
                      onClick={() => openPropertyModal(propiedad)}
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider text-white bg-white/5 border border-white/10 hover:bg-[#00f2fe] hover:text-black hover:border-[#00f2fe] hover:shadow-[0_0_15px_rgba(0,242,254,0.25)] transition-all duration-300 cursor-pointer select-none btn-mobile-dynamic"
                    >
                      Ver Proyecto
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 3. VENTANA MODAL DE DETALLES Y VISOR 360° AVANZADO */}
      {selectedProperty && (
        <>
          {/* Botón de Cierre Flotante (Solo Móviles) - Fixed con Transparencia 70 y Desenfocado */}
          <button
            onClick={closePropertyModal}
            className={`fixed md:hidden left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-[#0c111d]/50 backdrop-blur-md border border-[#00f2fe]/15 text-[#00f2fe] hover:text-white transition-all duration-300 cursor-pointer z-55 shadow-lg opacity-70 hover:opacity-100 active:scale-90 btn-close-pulse ${
              isModalOpen ? 'opacity-70 scale-100' : 'opacity-0 scale-90 pointer-events-none'
            }`}
            aria-label="Cerrar modal"
          >
            <X className="w-4 h-4" />
          </button>

          <div 
            className={`fixed inset-0 z-50 flex items-start md:items-center justify-center p-2 md:p-6 bg-black/90 backdrop-blur-md overflow-y-auto transition-all duration-300 ease-out ${
              isModalOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            {/* Contenedor del Modal */}
            <div 
              className={`bg-[#0c111d] border border-white/10 rounded-3xl w-full max-w-6xl h-fit md:h-[85vh] max-h-none md:max-h-[85vh] overflow-visible md:overflow-hidden relative shadow-[0_25px_60px_rgba(0,0,0,0.85)] flex flex-col my-8 md:my-0 transition-all duration-300 ease-out ${
                isModalOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'
              }`}
            >
              
              {/* Botón de Cierre Superior Derecha (Solo para Computadoras / PC) */}
              <button
                onClick={closePropertyModal}
                className="hidden md:flex absolute top-4 right-4 p-2.5 rounded-full bg-black/55 border border-white/15 text-gray-400 hover:text-white hover:bg-white/15 hover:border-white/35 transition-all duration-200 cursor-pointer z-50 shadow-md"
                aria-label="Cerrar modal"
              >
                <X className="w-5 h-5" />
              </button>

            {/* ENCABEZADO SUPERIOR */}
            <div className="p-3.5 md:p-8 pb-1 md:pb-4 border-b border-white/5 space-y-2 md:space-y-3 z-30 flex flex-col items-center text-center">
              <div className="flex flex-wrap items-center justify-center gap-3.5 w-full">
                <span className={`px-3 py-1 rounded-md text-[9px] font-black tracking-wider uppercase border backdrop-blur-md flex items-center gap-1.5 ${selectedProperty.tipoColor}`}>
                  <span className={`w-1 h-1 rounded-full ${selectedProperty.tipo === 'TERRENO / LOTE' ? 'bg-blue-400 animate-pulse' : 'bg-cyan-400 animate-pulse'}`}></span>
                  {selectedProperty.tipo}
                </span>

                {/* Ubicación Google Maps */}
                <a
                  href={selectedProperty.mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[9px] font-black tracking-wider uppercase text-gray-400 hover:text-[#00f2fe] border border-white/5 hover:border-[#00f2fe]/20 bg-white/[0.02] hover:bg-[#00f2fe]/5 transition-all duration-200 select-none cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#00f2fe] flex-shrink-0" />
                  Abrir en Google Maps
                  <ExternalLink className="w-3 h-3 flex-shrink-0" />
                </a>
              </div>

              <h2 className="text-2xl md:text-4xl font-black text-white font-display leading-tight w-full">
                {selectedProperty.titulo}
              </h2>
            </div>

            {/* CUERPO DEL MODAL */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 p-3 md:p-8 pt-2.5 md:pt-6 overflow-visible md:overflow-hidden h-fit md:h-[calc(100%-120px)] flex-grow">

              {/* Columna Izquierda: Visor VirtualTour 360° */}
              <div className="relative md:col-span-7 h-[270px] sm:h-[320px] md:h-full min-h-[200px] md:min-h-[400px] bg-black rounded-2xl overflow-hidden border border-white/5 shadow-inner z-10">
                {isTourLoaded ? (
                  <VirtualTour
                    tourId={selectedProperty.tourId}
                    isExpanded={false}
                    setIsExpanded={() => {}}
                    autoRotate={false}
                    showThumbnails={true}
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#070a13]">
                    <img 
                      src={selectedProperty.portada.startsWith('http') || selectedProperty.portada.startsWith('data:') ? selectedProperty.portada : `${import.meta.env.BASE_URL.replace(/\/$/, "")}${selectedProperty.portada}`}
                      alt="Cargando visor" 
                      className="absolute inset-0 w-full h-full object-cover opacity-20 blur-sm pointer-events-none"
                    />
                    <div className="relative z-10 flex flex-col items-center gap-4">
                      <div className="w-10 h-10 border-2 border-[#00f2fe]/20 border-t-[#00f2fe] rounded-full animate-spin"></div>
                      <span className="text-[10px] font-bold text-gray-500 tracking-widest uppercase font-display">Cargando Visor 360°</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Columna Derecha: Información Detallada */}
              <div className="md:col-span-5 h-auto md:h-full flex flex-col justify-between px-0.5 py-4 md:p-8 md:overflow-y-auto bg-transparent md:bg-[#0a0d16]/30 rounded-none md:rounded-2xl border-0 md:border border-white/5 z-20">

                {/* Contenido Informativo y Técnico */}
                <div className="space-y-6">

                  {/* Tarjeta Técnica Unificada (Área, Precio y Ubicación) */}
                  <div className="p-4 rounded-2xl bg-[#0f1626]/40 space-y-4 text-left shadow-inner">
                    
                    {/* Tabla/Fichas de Datos Técnicos */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3.5 rounded-2xl bg-white/[0.02] flex flex-col">
                        <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Área Total</span>
                        <span className="text-base font-black text-white mt-1.5 flex items-center gap-1.5">
                          <Maximize2 className="w-4 h-4 text-[#00f2fe] flex-shrink-0" />
                          {selectedProperty.area}
                        </span>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-white/[0.02] flex flex-col">
                        <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Precio de Venta</span>
                        <span className="text-base font-black text-[#00f2fe] mt-1.5 font-display">
                          {selectedProperty.precio}
                        </span>
                      </div>
                    </div>

                    {/* Separador */}
                    <div className="h-px bg-white/5 w-full"></div>

                    {/* Detalles de Ubicación Completa en el Modal */}
                    <div className="space-y-3.5">
                      <span className="text-[#00f2fe] text-[9px] font-black tracking-widest uppercase block">Ubicación y Referencias</span>
                      
                      <div className="space-y-3">
                        <div className="flex items-start gap-2.5">
                          <MapPin className="w-4 h-4 text-[#00f2fe] mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block mb-0.5">Dirección Exacta</span>
                            <span className="text-gray-200 text-xs md:text-sm font-medium">{selectedProperty.direccion}</span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/[0.04]">
                          <div>
                            <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block mb-0.5">Urbanización / Zona</span>
                            <span className="text-gray-200 text-xs md:text-sm font-semibold">{selectedProperty.urbanizacion}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block mb-0.5">Referencia de Acceso</span>
                            <span className="text-gray-200 text-xs md:text-sm font-medium">{selectedProperty.referencia}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Separador */}
                  <div className="h-px bg-white/5 w-full"></div>

                  {/* Descripción del Proyecto */}
                  <div className="space-y-2">
                    <span className="text-gray-500 text-[10px] font-bold tracking-widest uppercase block">Descripción del Proyecto</span>
                    <p className="text-[#e4e7ec] text-sm md:text-base leading-relaxed font-sans text-left tracking-wide font-normal">
                      {selectedProperty.descripcionCompleta}
                    </p>
                  </div>

                  {/* Beneficios Destacados */}
                  <div className="space-y-3">
                    <span className="text-gray-500 text-[10px] font-bold tracking-widest uppercase block">Beneficios Clave</span>
                    <ul className="space-y-2.5">
                      {selectedProperty.beneficios.map((beneficio, index) => (
                        <li key={index} className="flex items-start gap-2.5 text-[#e4e7ec] text-sm md:text-base leading-relaxed tracking-wide">
                          <div className="p-0.5 rounded-full bg-[#00f2fe]/10 border border-[#00f2fe]/20 text-[#00f2fe] mt-0.5 flex-shrink-0">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                          <span>{beneficio}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>

                {/* Botón de WhatsApp Corporativo */}
                <div className="pt-6 border-t border-white/5 mt-6 flex flex-col gap-3.5">
                  <a
                    href={`https://wa.me/51951300535?text=Hola%20Nexus%2C%20estoy%20interesado%20en%20el%20proyecto%20*${encodeURIComponent(selectedProperty.titulo)}*%2C%20me%20gustar%C3%ADa%20recibir%20m%C3%A1s%20informaci%C3%B3n%20sobre%20esta%20propiedad.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center gap-4 p-4 rounded-2xl bg-[#09d261]/10 border border-[#09d261]/25 text-left hover:bg-[#09d261]/15 hover:border-[#09d261]/40 transition-all duration-300 shadow-[0_0_20px_rgba(9,210,97,0.02)] hover:shadow-[0_0_30px_rgba(9,210,97,0.1)] cursor-pointer select-none group animate-pulse-glow-green"
                  >
                    <div className="w-11 h-11 rounded-xl bg-[#09d261] flex items-center justify-center text-white shadow-[0_0_15px_rgba(9,210,97,0.35)] transition-transform duration-300 group-hover:scale-105 flex-shrink-0">
                      <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.454 5.709 1.455h.008c6.56 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                    </div>

                    {/* Textos del Botón */}
                    <div className="flex flex-col gap-0.5 select-none">
                      <span className="text-white text-sm md:text-base font-black tracking-wide font-display group-hover:text-[#00f2fe] transition-colors duration-200">
                        Consultar Lotes Disponibles
                      </span>
                      <span className="text-gray-400 text-[10px] md:text-xs font-semibold leading-none">
                        Pregunta por precios y ubicaciones en tiempo real
                      </span>
                    </div>
                  </a>

                  {/* Botón Cerrar Proyecto (Volver al listado) en móviles */}
                  <button
                    onClick={closePropertyModal}
                    className="w-full md:hidden inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl border border-white/10 hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.05] text-gray-400 hover:text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 active:scale-[0.98] select-none cursor-pointer mt-1"
                  >
                    Volver al listado
                  </button>
                </div>

                {/* Mapa de ubicación del lote en tiempo real */}
                <div className="pt-6 border-t border-white/5 mt-6 space-y-3">
                  <span className="text-gray-500 text-[10px] font-bold tracking-widest uppercase block">Ubicación Geográfica</span>
                  <div className="w-full h-[200px] rounded-2xl overflow-hidden border border-white/5 shadow-md relative bg-black/40">
                    {isTourLoaded ? (
                      <iframe
                        src={selectedProperty.mapsIframe}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="strict-origin-when-cross-origin"
                        title={`Mapa de ubicación de ${selectedProperty.titulo}`}
                        className="w-full h-full filter invert-[0.9] hue-rotate-[180deg] contrast-[1.2]"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-[#070a13]/50">
                        <div className="w-6 h-6 border-2 border-white/5 border-t-white/20 rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>
      </>
      )}
    </div>
  );
}
