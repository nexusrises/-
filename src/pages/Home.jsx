import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  HeartPulse, 
  Briefcase, 
  ArrowRight, 
  Sparkles, 
  Compass,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Zap,
  TrendingUp,
  Users,
  Target
} from 'lucide-react';
import InteractiveGlobe from '../components/InteractiveGlobe';
import AnimatedCounter from '../components/AnimatedCounter';
import PhotoSphereViewer from '../components/PhotoSphereViewer';

export default function Home() {
  const [activeProject, setActiveProject] = useState(0);
  const [activeSector, setActiveSector] = useState(0);

  useEffect(() => {
    document.title = "Nexus Rise | Diseño y Desarrollo Web Premium & Visores 360°";
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSector((prev) => (prev + 1) % sectores.length);
    }, 15000); // Rotación cada 15 segundos
    return () => clearInterval(timer);
  }, [activeSector]);

  const carouselProyectos = [
    {
      id: 'sillar-inmobiliaria',
      title: 'Sierra Capital - Inmobiliaria 360°',
      category: 'Inmobiliaria 3D',
      icon: Building2,
      desc: '¿Compradores que dudan de invertir en planos por temor a la informalidad? Sierra Capital implementó un portal corporativo interactivo 360°. Al mostrar de forma transparente los linderos, accesos y vías reales, transmitió la seguridad de una empresa formal, logrando reservas seguras y un +40% en ventas.',
      stat: 'Formalidad & +40% en Ventas',
      imagen: '/tour/Vista Aerea Residencial Maravillas.jpg',
      color: 'from-nexus-accent to-nexus-blue',
      glow: 'shadow-[0_0_50px_rgba(0,242,254,0.15)]',
      border: 'border-nexus-accent/30',
      tagColor: 'text-nexus-accent border-nexus-accent/20 bg-nexus-accent/10',
      link: '/servicios/Constructoras&Inmobiliarias#recorrido-360'
    },
    {
      id: 'clinica-isabel',
      title: 'Centro Ginecólogo Especializado Materno-Fetal "Santa Rosa"',
      category: 'Clínicas & Centros Médicos',
      icon: HeartPulse,
      desc: '¿Pacientes que buscan especialistas médicos en internet pero dudan por falta de información formal? Diseñamos portales médicos completos con vitrina de staff (CMP/RNE), especialidades y agendamiento online 24/7. Al integrar alertas automáticas de WhatsApp, el Centro "Santa Rosa" consolidó su prestigio y redujo el ausentismo de pacientes en un 30%.',
      stat: 'Prestigio & -30% Ausentismo',
      imagen: '/salud_portal_juliaca.png',
      color: 'from-nexus-purple to-pink-500',
      glow: 'shadow-[0_0_50px_rgba(168,85,247,0.15)]',
      border: 'border-nexus-purple/30',
      tagColor: 'text-nexus-purple border-nexus-purple/20 bg-nexus-purple/10',
      link: '/servicios/Clínicas&CentrosMédicos'
    },
    {
      id: 'cafe-arequipa',
      title: 'Consorcio Vial & Logística del Sur B2B',
      category: 'Empresas & Comercios',
      icon: Briefcase,
      desc: '¿Grandes contratistas y mineras que dudan de subcontratar tu empresa por falta de información técnica formal? Diseñamos portales B2B e industriales para empresas de transporte pesado, asfalto y metalmecánica. Al digitalizar tu pool de maquinarias, flota pesada y certificados de homologación ISO/AWS, demuestras solvencia operativa inmediata y aseguras contratos de alto valor.',
      stat: 'Solvencia & Homologación B2B',
      imagen: '/constructora_v2.png',
      color: 'from-rose-500 to-amber-500',
      glow: 'shadow-[0_0_50px_rgba(244,63,94,0.15)]',
      border: 'border-rose-500/30',
      tagColor: 'text-rose-400 border-rose-500/20 bg-rose-500/10',
      link: '/servicios/empresas&comercios'
    },
    {
      id: 'soluciones-profesionales',
      title: 'Dra. Andrea Valdivia — Portal Jurídico y Marca Personal',
      category: 'Profesionales & Consultores',
      icon: Users,
      desc: '¿Horas perdidas atendiendo consultas de redes sociales que no se concretan? Diseñamos portales de marca personal y blogs de autoridad enfocados en SEO. Con un embudo y cuestionario de calificación automatizado, filtras a prospectos sin presupuesto antes de agendar llamadas, asegurando solo consultas y contratos de alto valor.',
      stat: 'Autoridad & Filtro de Leads',
      imagen: '/legal_portal_preview.png',
      color: 'from-nexus-purple to-indigo-500',
      glow: 'shadow-[0_0_50px_rgba(168,85,247,0.15)]',
      border: 'border-nexus-purple/30',
      tagColor: 'text-nexus-purple border-nexus-purple/20 bg-nexus-purple/10',
      link: '/servicios/Profesionales&Consultores'
    }
  ];

  const nextProject = () => {
    setActiveProject((prev) => (prev + 1) % carouselProyectos.length);
  };

  const prevProject = () => {
    setActiveProject((prev) => (prev - 1 + carouselProyectos.length) % carouselProyectos.length);
  };

  const sectores = [
    {
      id: "inmobiliarias",
      titulo: "Constructoras & Inmobiliarias",
      gancho: "Consolida tu presencia corporativa y vende con seguridad.",
      descripcion: "Diseñamos plataformas corporativas interactivas con visores 360° integrados. Posiciona tus proyectos inmobiliarios directamente en Google y redes sociales, brindando una presentación estructurada que inspire confianza y concrete preventas.",
      enlace: "/servicios/Constructoras&Inmobiliarias",
      etiquetaBoton: "Ver Presencia Inmobiliaria",
      colorClass: "card-neon-cian animate-pulse-glow-cian",
      glowBg: "bg-nexus-accent",
      colorText: "text-nexus-accent",
      colorBtn: "btn-neon-cian",
      icon: Building2
    },
    {
      id: "clinicas",
      titulo: "Clínicas & Centros Médicos",
      gancho: "Establece tu reputación digital y destaca tu especialidad.",
      descripcion: "Creamos portales de salud corporativos que organizan tus especialidades médicas. Más allá de un agendador, estructuramos un perfil digital confiable y bien segmentado para que los pacientes te elijan con la seguridad que otorga una marca consolidada.",
      enlace: "/servicios/Clínicas&CentrosMédicos",
      etiquetaBoton: "Ver Portal de Salud",
      colorClass: "card-neon-blue animate-pulse-glow-blue",
      glowBg: "bg-nexus-blue",
      colorText: "text-nexus-blue",
      colorBtn: "btn-neon-blue",
      icon: HeartPulse
    },
    {
      id: "empresas",
      titulo: "Empresas & Comercios",
      gancho: "El núcleo independiente de tu identidad comercial en la web.",
      descripcion: "Desarrollamos páginas corporativas premium y catálogos digitales interactivos. Asegura que tu negocio sea el primero en aparecer cuando busquen tus productos en Google, construyendo una presencia sólida que brinde tranquilidad a tus clientes.",
      enlace: "/servicios/empresas&comercios",
      etiquetaBoton: "Ver Presencia Corporativa",
      colorClass: "card-neon-amber animate-pulse-glow-amber",
      glowBg: "bg-amber-500",
      colorText: "text-amber-400",
      colorBtn: "btn-neon-amber",
      icon: Briefcase
    },
    {
      id: "profesionales",
      titulo: "Profesionales & Consultores",
      gancho: "Diferénciate del resto con un perfil digital segmentado.",
      descripcion: "Construimos portafolios corporativos y blogs de autoridad que reflejan tu trayectoria. Genera la credibilidad que buscan tus clientes corporativos y de alto valor al contar con un dominio propio y correos corporativos que garantizan seriedad.",
      enlace: "/servicios/Profesionales&Consultores",
      etiquetaBoton: "Ver Marca Personal",
      colorClass: "card-neon-purple animate-pulse-glow-purple",
      glowBg: "bg-nexus-purple",
      colorText: "text-nexus-purple",
      colorBtn: "btn-neon-purple",
      icon: Users
    }
  ];


  return (
    <div className="relative">

      {/* 1. HERO SECTION */}
      <header id="hero" className="container mx-auto px-6 pt-28 pb-20 md:py-32 relative z-10 scroll-mt-24 animate-fade-in-up overflow-hidden">
        {/* Blobs de brillo de fondo para profundidad 3D premium */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-nexus-accent/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-nexus-purple/5 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Columna Izquierda: Globo 3D Interactivo (SIN TOCAR) */}
          <div className="lg:col-span-5 flex justify-center items-center relative w-full overflow-visible">
            <InteractiveGlobe />
          </div>

          {/* Columna Derecha: Contenido de Texto */}
          <div className="lg:col-span-7 text-center lg:text-left flex flex-col items-center lg:items-start">
            <h1 
              style={{ textWrap: 'balance' }} 
              className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-100 to-gray-400 mb-8 leading-[1.12] tracking-tight font-display"
            >
              Estudio de Desarrollo Web <span className="text-gradient-rise font-display font-black">Corporativo e Interactivo</span>
            </h1>
            
            <p 
              style={{ textWrap: 'pretty' }} 
              className="text-base md:text-lg text-gray-200 max-w-2xl leading-relaxed"
            >
              Creamos sitios web interactivos y experiencias 360° diseñadas para convertir visitas en clientes reales.
            </p>
          </div>
        </div>
      </header>

      {/* 4. SECCIÓN PREMIUM DE CASOS DE ÉXITO CON SELECTOR DE PESTAÑAS */}
      <section className="container mx-auto px-6 pb-28 relative z-10 reveal-on-scroll">
        {/* Contenedor Principal con Transición */}
        <div className="max-w-6xl mx-auto relative">
          <div className="glass-panel border-white/10 rounded-3xl p-6 md:p-12 relative overflow-hidden transition-all duration-500 hover:border-white/15">
            {/* Resplandor de fondo según proyecto activo */}
            <div className={`absolute -right-32 -top-32 w-[450px] h-[450px] rounded-full blur-[130px] opacity-20 transition-all duration-700 bg-gradient-to-br ${carouselProyectos[activeProject].color}`}></div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              {/* Información del Proyecto */}
              <div className="lg:col-span-6 flex flex-col justify-center animate-fade-in">
                <span className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold border w-fit mb-6 ${carouselProyectos[activeProject].tagColor}`}>
                  <Sparkles className="w-3.5 h-3.5" />
                  {carouselProyectos[activeProject].category}
                </span>

                <h3 className="text-2xl md:text-4xl font-extrabold text-white mb-4 transition-all duration-300 font-display">
                  {carouselProyectos[activeProject].title}
                </h3>

                <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-6">
                  {carouselProyectos[activeProject].desc}
                </p>

                {/* Stat destacado del proyecto */}
                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 w-fit mb-8">
                  <span className="text-xs text-gray-400 uppercase tracking-widest font-bold block mb-1">Impacto Logrado</span>
                  <span className={`text-xl md:text-2xl font-black bg-gradient-to-r bg-clip-text text-transparent ${carouselProyectos[activeProject].color} font-display`}>
                    {carouselProyectos[activeProject].stat}
                  </span>
                </div>

                <div className="flex gap-4">
                  <Link 
                    to={carouselProyectos[activeProject].link}
                    className="inline-flex items-center text-xs md:text-sm font-bold uppercase tracking-wider text-white hover:text-nexus-accent transition-colors group"
                  >
                    Ver Detalles
                    <ArrowUpRight className="w-4 h-4 ml-1 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>

              {/* Imagen/Mockup del Proyecto (Estático con lazy load para optimizar carga instantánea) */}
              <div className="lg:col-span-6 relative flex justify-center items-center w-full">
                <Link 
                  to={carouselProyectos[activeProject].link}
                  className="w-full h-full block cursor-pointer"
                >
                  <div className={`w-full aspect-video rounded-2xl overflow-hidden border ${carouselProyectos[activeProject].border} ${carouselProyectos[activeProject].glow} transition-all duration-500 relative group bg-black/40`}>
                    <img 
                      src={carouselProyectos[activeProject].imagen ? (carouselProyectos[activeProject].imagen.startsWith('http') || carouselProyectos[activeProject].imagen.startsWith('data:') ? carouselProyectos[activeProject].imagen : `${import.meta.env.BASE_URL.replace(/\/$/, "")}${carouselProyectos[activeProject].imagen}`) : ''} 
                      alt={carouselProyectos[activeProject].title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-nexus-dark/80 via-transparent to-transparent pointer-events-none"></div>

                    {/* Indicador interactivo para abrir vista 360° */}
                    {carouselProyectos[activeProject].id === 'sillar-inmobiliaria' && (
                      <div className="absolute top-4 left-4 bg-nexus-dark/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 text-[10px] uppercase tracking-wider text-nexus-accent font-bold font-mono flex items-center gap-1.5 shadow-lg animate-pulse">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                        Toca para abrir Recorrido 360°
                      </div>
                    )}
                  </div>
                </Link>
              </div>

            </div>

            {/* Controles Auxiliares e Indicadores */}
            <div className="flex items-center justify-between mt-10 pt-6 border-t border-white/5 relative z-20">
              <div className="flex gap-2.5">
                {carouselProyectos.map((_, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveProject(idx)}
                    className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                      activeProject === idx ? 'w-8 bg-white' : 'w-2.5 bg-white/20 hover:bg-white/40'
                    }`}
                    aria-label={`Ir al proyecto ${idx + 1}`}
                  />
                ))}
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={prevProject}
                  className="p-3 rounded-full border border-white/10 text-white hover:bg-white/5 hover:border-white/20 transition-all duration-200 active:scale-90 cursor-pointer"
                  aria-label="Proyecto anterior"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={nextProject}
                  className="p-3 rounded-full border border-white/10 text-white hover:bg-white/5 hover:border-white/20 transition-all duration-200 active:scale-90 cursor-pointer"
                  aria-label="Siguiente proyecto"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* 3. SECCIÓN DE SECTORES / BENTO GRID */}
      <section className="container mx-auto px-6 pb-28 reveal-on-scroll">
        <div className="text-center mb-16">
          <span className="text-xs uppercase text-nexus-purple font-bold tracking-widest bg-nexus-purple/10 px-3 py-1 rounded-full border border-nexus-purple/20">Especialización de Alto Impacto</span>
          <h2 
            style={{ textWrap: 'balance' }} 
            className="text-3xl md:text-5xl font-bold text-white mt-4 mb-4 font-display"
          >
            Soluciones Web por Sectores
          </h2>
          <p 
            style={{ textWrap: 'pretty' }} 
            className="text-gray-200 max-w-2xl mx-auto text-sm md:text-base"
          >
            Diseñamos arquitecturas específicas y optimizadas que resuelven los problemas reales de tu industria, maximizando la retención de usuarios y la conversión de clientes.
          </p>
        </div>

        {/* Estilos locales para las micro-animaciones premium del carrusel */}
        <style>{`
          @keyframes slide-in-left {
            0% { opacity: 0; transform: translateX(-24px); }
            100% { opacity: 1; transform: translateX(0); }
          }
          @keyframes slide-in-right {
            0% { opacity: 0; transform: translateX(24px); }
            100% { opacity: 1; transform: translateX(0); }
          }
          @keyframes float-icon {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-12px) rotate(2deg); }
          }
          .animate-slide-left {
            animation: slide-in-left 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          .animate-slide-right {
            animation: slide-in-right 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          .animate-float-icon {
            animation: float-icon 6s ease-in-out infinite;
          }
        `}</style>

        {/* Carrusel de Sectores */}
        <div className="max-w-5xl mx-auto relative mb-12 group/sec-carousel">
          <div className={`rounded-3xl p-8 md:p-12 flex flex-col md:flex-row gap-8 md:gap-12 items-center justify-between group relative overflow-hidden transition-all duration-500 min-h-[380px] ${sectores[activeSector].colorClass}`}>
            
            {/* Resplandor de fondo animado */}
            <div className={`absolute top-0 right-0 w-[400px] h-[400px] ${sectores[activeSector].glowBg} opacity-[0.04] rounded-full blur-[100px]`}></div>
            
            {/* Lado Izquierdo: Contenido Informativo */}
            <div className="flex-1 space-y-5 relative z-10 animate-slide-left" key={`text-${activeSector}`}>
              <div className={`p-3 rounded-2xl bg-slate-950/85 border border-white/10 ${sectores[activeSector].colorText} w-fit mb-2 shadow-xl`}>
                {(() => {
                  const Icon = sectores[activeSector].icon;
                  return <Icon className="w-8 h-8" />;
                })()}
              </div>
              <h3 className="text-2xl md:text-4xl font-extrabold text-white font-display tracking-tight leading-none">{sectores[activeSector].titulo}</h3>
              <h4 className={`text-base md:text-lg font-bold font-sans leading-snug ${sectores[activeSector].colorText}`}>{sectores[activeSector].gancho}</h4>
              <p 
                style={{ textWrap: 'pretty' }} 
                className="text-slate-200 text-sm md:text-base leading-relaxed font-sans"
              >
                {sectores[activeSector].descripcion}
              </p>
              
              <div className="pt-4 flex items-center gap-3">
                {/* Flecha Izquierda */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveSector((prev) => (prev - 1 + sectores.length) % sectores.length);
                  }}
                  className="p-3 rounded-full border border-white/10 text-white bg-slate-950/60 hover:bg-slate-900 hover:border-white/20 hover:scale-110 hover:shadow-[0_0_15px_rgba(255,255,255,0.15)] transition-all duration-300 active:scale-95 cursor-pointer flex-shrink-0"
                  aria-label="Sector anterior"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Botón Principal de Enlace */}
                <Link 
                  to={sectores[activeSector].enlace} 
                  className={`inline-flex items-center justify-center ${sectores[activeSector].colorBtn} px-6 py-3.5 rounded-full font-bold text-xs md:text-sm hover:text-white group uppercase tracking-wider shadow-lg transition-all duration-300`}
                >
                  {sectores[activeSector].etiquetaBoton}
                  <ArrowUpRight className="w-4 h-4 ml-2 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>

                {/* Flecha Derecha */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveSector((prev) => (prev + 1) % sectores.length);
                  }}
                  className="p-3 rounded-full border border-white/10 text-white bg-slate-950/60 hover:bg-slate-900 hover:border-white/20 hover:scale-110 hover:shadow-[0_0_15px_rgba(255,255,255,0.15)] transition-all duration-300 active:scale-95 cursor-pointer flex-shrink-0"
                  aria-label="Siguiente sector"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Lado Derecho: Elemento Gráfico Levitante (Premium) */}
            <div className="hidden md:flex flex-1 justify-center items-center relative z-10 animate-slide-right" key={`visual-${activeSector}`}>
              <div className="relative group/visual flex justify-center items-center w-full max-w-[280px] aspect-square">
                {/* Resplandor orbital animado */}
                <div className={`absolute inset-4 rounded-full bg-gradient-to-tr ${
                  sectores[activeSector].colorClass.includes('cian') ? 'from-nexus-accent/20 to-cyan-500/10' : 
                  sectores[activeSector].colorClass.includes('blue') ? 'from-nexus-blue/20 to-indigo-500/10' : 
                  sectores[activeSector].colorClass.includes('amber') ? 'from-amber-500/20 to-orange-500/10' : 
                  'from-nexus-purple/20 to-pink-500/10'
                } opacity-30 blur-2xl animate-pulse`}></div>
                
                {/* Anillos orbitales decorativos */}
                <div className="absolute w-[200px] h-[200px] rounded-full border border-white/5 border-dashed animate-spin [animation-duration:35s]"></div>
                <div className="absolute w-[240px] h-[240px] rounded-full border border-white/10 border-double animate-spin [animation-duration:18s] [animation-direction:reverse]"></div>

                {/* Caja de visualización flotante */}
                <div className="w-36 h-36 rounded-3xl bg-slate-900/90 border border-white/10 flex items-center justify-center shadow-2xl relative overflow-hidden group-hover/visual:border-white/20 transition-colors duration-500 animate-float-icon">
                  <div className={`absolute -bottom-8 -right-8 w-24 h-24 rounded-full ${sectores[activeSector].glowBg} opacity-10 blur-xl`}></div>
                  {(() => {
                    const Icon = sectores[activeSector].icon;
                    return <Icon className={`w-16 h-16 ${sectores[activeSector].colorText} drop-shadow-[0_0_15px_rgba(255,255,255,0.15)] transition-transform duration-700 group-hover/visual:scale-110`} />;
                  })()}
                </div>
              </div>
            </div>
          </div>

          {/* Indicadores de progreso (Dotted) */}
          <div className="flex justify-center gap-3 mt-6">
            {sectores.map((_, idx) => (
              <button 
                key={idx}
                onClick={() => setActiveSector(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer hover:bg-white/40 ${
                  activeSector === idx ? 'w-8 bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]' : 'w-2.5 bg-white/20'
                }`}
                aria-label={`Ir al sector ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Resto del Bento Grid Layout (Estadísticas y Proceso) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {/* Estadísticas de Impacto (Movidas aquí) */}
          <div className="md:col-span-2 glass-panel border-white/5 rounded-3xl p-8 md:p-10 relative overflow-hidden reveal-on-scroll">
            <div className="absolute top-0 right-0 w-80 h-80 bg-nexus-blue opacity-[0.02] rounded-full blur-[80px]"></div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 text-center">
              {/* Stat 1 */}
              <div className="flex flex-col items-center p-4 group cursor-pointer">
                <div className="p-3 bg-nexus-accent/10 text-nexus-accent rounded-2xl mb-4 transition-all duration-300 group-hover:bg-nexus-accent/20 group-hover:shadow-[0_0_25px_rgba(0,242,254,0.25)] group-hover:scale-105 animate-icon-pulse-cian">
                  <Zap className="w-6 h-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
                </div>
                <span className="text-3xl md:text-4xl font-extrabold text-white font-display mb-1">
                  <AnimatedCounter target={98} prefix="+" suffix="%" />
                </span>
                <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Optimización Lighthouse</span>
              </div>

              {/* Stat 2 */}
              <div className="flex flex-col items-center p-4 border-l border-white/5 max-md:border-none group cursor-pointer">
                <div className="p-3 bg-nexus-blue/10 text-nexus-blue rounded-2xl mb-4 transition-all duration-300 group-hover:bg-nexus-blue/20 group-hover:shadow-[0_0_25px_rgba(0,102,255,0.25)] group-hover:scale-105 animate-icon-pulse-blue">
                  <TrendingUp className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:scale-110" />
                </div>
                <span className="text-3xl md:text-4xl font-extrabold text-white font-display mb-1">
                  <AnimatedCounter target={3} suffix="x" />
                </span>
                <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Más Cierre de Ventas</span>
              </div>

              {/* Stat 3 */}
              <div className="flex flex-col items-center p-4 border-l border-white/5 max-md:border-none group cursor-pointer">
                <div className="p-3 bg-nexus-purple/10 text-nexus-purple rounded-2xl mb-4 transition-all duration-300 group-hover:bg-nexus-purple/20 group-hover:shadow-[0_0_25px_rgba(168,85,247,0.25)] group-hover:scale-105 animate-icon-pulse-purple">
                  <Users className="w-6 h-6 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1" />
                </div>
                <span className="text-3xl md:text-4xl font-extrabold text-white font-display mb-1">
                  <AnimatedCounter target={10} prefix="+" suffix="K" />
                </span>
                <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Visitas en Tours 3D</span>
              </div>

              {/* Stat 4 */}
              <div className="flex flex-col items-center p-4 border-l border-white/5 max-md:border-none group cursor-pointer">
                <div className="p-3 bg-rose-500/10 text-rose-500 rounded-2xl mb-4 transition-all duration-300 group-hover:bg-rose-500/20 group-hover:shadow-[0_0_25px_rgba(244,63,94,0.25)] group-hover:scale-105 animate-icon-pulse-rose">
                  <Target className="w-6 h-6 transition-transform duration-500 group-hover:rotate-[360deg] group-hover:scale-110" />
                </div>
                <span className="text-3xl md:text-4xl font-extrabold text-white font-display mb-1">
                  <AnimatedCounter target={100} suffix="%" />
                </span>
                <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Código Exclusivo a Medida</span>
              </div>
            </div>
          </div>

          {/* Card D: Proceso / CTA integrador */}
          <div className="md:col-span-2 glass-panel rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between border-white/5 hover:border-white/10 transition-all duration-300 gap-6 reveal-on-scroll reveal-delay-100 animate-pulse-glow-gradient">
            <div className="flex-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300 font-medium mb-4">
                <Compass className="w-3.5 h-3.5 text-nexus-accent" />
                <span>NUESTRO MÉTODO TRANSPARENTE</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2 font-display">¿Cómo trabajamos tu proyecto?</h3>
              <p 
                style={{ textWrap: 'pretty' }} 
                className="text-gray-400 text-sm leading-relaxed max-w-xl"
              >
                Eliminamos la incertidumbre de contratar desarrollo de software. Conoce en tiempo real nuestra línea de tiempo interactiva paso a paso para supervisar cada hito de desarrollo.
              </p>
            </div>
            <Link 
              to="/proceso" 
              className="inline-flex btn-neumorphic px-6 py-3 w-full md:w-auto text-center justify-center items-center font-semibold text-sm transition-all duration-300"
            >
              Ver Línea de Tiempo
            </Link>
          </div>
        </div>
      </section>


      {/* 6. LLAMADO A LA ACCIÓN (CTA) FINAL OPTIMIZADO */}
      <section className="container mx-auto px-6 pb-28 reveal-on-scroll">
        <div className="max-w-5xl mx-auto glass-panel border-nexus-accent/20 rounded-3xl p-10 md:p-16 text-center relative overflow-hidden animate-pulse-glow-cian">
          {/* Focos de luz y malla de fondo */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-nexus-accent opacity-[0.03] rounded-full blur-[90px] pointer-events-none"></div>
          <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-nexus-purple opacity-[0.03] rounded-full blur-[80px] pointer-events-none"></div>
          
          <span className="text-xs uppercase text-nexus-accent font-bold tracking-widest bg-nexus-accent/10 px-4 py-1.5 rounded-full border border-nexus-accent/20 mb-6 inline-block">
            Nuestros Casos de Éxito
          </span>
          
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 font-display leading-tight">
            Descubre el impacto de una presencia digital formal y de alta confianza
          </h2>
          
          <p className="text-gray-300 max-w-2xl mx-auto text-sm md:text-base mb-12 leading-relaxed">
            Explora nuestra galería de proyectos en inmobiliaria, salud digital, comercio electrónico y marcas personales. Descubre cómo ayudamos a otros negocios a consolidar su seriedad y cerrar más clientes.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
            <Link 
              to="/portafolio" 
              className="inline-flex items-center justify-center btn-neon-cian px-8 py-3.5 rounded-full font-bold transition-all duration-200 active:scale-95 group uppercase tracking-wider text-xs md:text-sm font-sans w-full sm:w-auto"
            >
              Explorar Portafolio
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
