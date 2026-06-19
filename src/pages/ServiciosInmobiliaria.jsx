import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import VirtualTour from '../components/VirtualTour';
import {
  Building2,
  ArrowRight,
  CheckCircle,
  Shield,
  Layers,
  FileCheck,
  Eye,
  ExternalLink,
  ChevronRight,
  Sparkles,
  MapPin,
  Clock,
  Layout,
  Smartphone,
  MousePointer,
  Heart,
  Target,
  Lightbulb,
  Zap,
  Laptop
} from 'lucide-react';

export default function ServiciosInmobiliaria() {
  const [activeProject, setActiveProject] = useState('residencial');
  const [currentPanorama, setCurrentPanorama] = useState('/tour/sala.jpg');
  const [isTourExpanded, setIsTourExpanded] = useState(false);
  const [topLight, setTopLight] = useState(false);
  const [bottomLight, setBottomLight] = useState(false);

  // Marcadores de la sala
  const salaMarkers = [
    {
      id: 'info-ventanas',
      position: { yaw: 0.2, pitch: 0.1 },
      html: `<div style="background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(4px); border: 1px solid rgba(255,255,255,0.25); width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 14px; font-weight: bold; cursor: pointer; box-shadow: 0 0 10px rgba(0, 242, 254, 0.5);">i</div>`,
      size: { width: 30, height: 30 },
      tooltip: 'Ventanas termoacústicas de doble vidrio con protección UV.'
    },
    {
      id: 'ir-cocina',
      position: { yaw: 2.2, pitch: -0.25 },
      html: `<div style="background: rgba(15, 23, 42, 0.9); backdrop-filter: blur(4px); border: 1px solid rgba(0, 242, 254, 0.5); padding: 8px 14px; border-radius: 20px; color: #fff; font-size: 11px; display: flex; align-items: center; gap: 6px; cursor: pointer; font-weight: bold; box-shadow: 0 4px 15px rgba(0, 242, 254, 0.3);">
               <span>Ir a la Cocina</span>
               <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#00f2fe" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
             </div>`,
      size: { width: 125, height: 40 },
      tooltip: 'Explorar la Cocina Equipada'
    },
    {
      id: 'video-tv',
      position: { yaw: -1.0, pitch: 0.05 },
      html: `<div style="background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(4px); border: 1px solid rgba(255, 255, 255, 0.25); width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 14px; font-weight: bold; cursor: pointer; box-shadow: 0 0 10px rgba(139, 92, 246, 0.5);">▶</div>`,
      size: { width: 30, height: 30 },
      tooltip: {
        content: '<b>Video Presentación</b><br>Haz clic para ver acabados de la sala.',
        position: 'top'
      },
      content: `
        <div style="padding: 12px; max-width: 300px; color: #fff; font-family: sans-serif;">
          <h4 style="margin: 0 0 6px 0; font-size: 14px; font-weight: bold; color: #00f2fe;">Acabados Premium</h4>
          <p style="margin: 0 0 10px 0; font-size: 11px; color: #cbd5e1; line-height: 1.4;">Los acabados incluyen pisos estructurados y sistemas de iluminación inteligentes.</p>
          <iframe width="100%" height="150" src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="border-radius: 6px; border: 1px solid rgba(255,255,255,0.15);"></iframe>
        </div>
      `
    }
  ];

  // Marcadores de la cocina
  const cocinaMarkers = [
    {
      id: 'ir-sala',
      position: { yaw: -0.8, pitch: -0.1 },
      html: `<div style="background: rgba(15, 23, 42, 0.9); backdrop-filter: blur(4px); border: 1px solid rgba(0, 242, 254, 0.5); padding: 8px 14px; border-radius: 20px; color: #fff; font-size: 11px; display: flex; align-items: center; gap: 6px; cursor: pointer; font-weight: bold; box-shadow: 0 4px 15px rgba(0, 242, 254, 0.3);">
               <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#00f2fe" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
               <span>Regresar a la Sala</span>
             </div>`,
      size: { width: 145, height: 40 },
      tooltip: 'Regresar a la Sala Principal'
    },
    {
      id: 'info-mesada',
      position: { yaw: 1.4, pitch: -0.35 },
      html: `<div style="background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(4px); border: 1px solid rgba(255,255,255,0.25); width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 14px; font-weight: bold; cursor: pointer; box-shadow: 0 0 10px rgba(0, 242, 254, 0.5);">i</div>`,
      size: { width: 30, height: 30 },
      tooltip: 'Mesadas de cuarzo importado de alta resistencia.'
    }
  ];

  const currentMarkers = currentPanorama === '/tour/sala.jpg' ? salaMarkers : cocinaMarkers;

  const handleMarkerClick = (marker) => {
    if (marker.id === 'ir-cocina') {
      setCurrentPanorama('/tour/cocina.jpg');
    } else if (marker.id === 'ir-sala') {
      setCurrentPanorama('/tour/sala.jpg');
    }
  };

  const previewScreenshots = {
    residencial: {
      title: 'Tu Sitio Web de Proyectos Inmobiliarios y Lotizaciones',
      subtitle: 'Diseñado para enamorar al comprador y asegurar reservas en planos.',
      heroImg: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      features: [
        'Plano interactivo de lotización: Filtros rápidos por áreas (m²), manzanas y estado de disponibilidad en tiempo real.',
        'Visor inmersivo 360° de linderos: Recorridos virtuales aéreos y a nivel de suelo para experimentar el entorno y vías antes de ir físicamente.',
        'Descarga automática de Brochure PDF: Envío de planos de distribución y precios que educa al cliente y descarta curiosos sin quitar tiempo.',
        'WhatsApp de venta calificada: Enlace de contacto directo con mensajes preestablecidos sobre lotes específicos para acelerar cierres.'
      ],
      deseosCliente: '«Quiero que las personas sientan la emoción de ver su nuevo hogar desde el celular, que puedan ver los avances reales y agendar una visita a la oficina de ventas con un clic.»'
    },
    industrial: {
      title: 'Tu Sitio Web Corporativo de Obras e Infraestructura',
      subtitle: 'Diseñado para transmitir solidez técnica y ganar licitaciones corporativas.',
      heroImg: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1200&q=80',
      features: [
        'Portafolio detallado de obras públicas y privadas ejecutadas con actas de conformidad y entrega.',
        'Certificaciones internacionales e ISO (9001, 14001, 45001) visibles para cumplir estándares de licitación.',
        'Staff de ingenieros colegiados y técnicos especializados con credenciales y currículum empresarial.',
        'Canal exclusivo para alianzas, consorcios y postulación de subcontratistas homologados.'
      ],
      deseosCliente: '«Necesito que los inversionistas y empresas auditoras vean que somos una empresa seria, que cumplimos los plazos, mostremos nuestra maquinaria y tengamos certificaciones visibles.»'
    },
    preventa: {
      title: 'Embudos de Lanzamiento y Landing Pages de Preventa',
      subtitle: 'Diseñadas con gatillos de urgencia para maximizar el registro de compradores interesados.',
      heroImg: '/foco_interactivo.png',
      features: [
        'Formularios ultra-rápidos e integración directa con Meta Ads y WhatsApp para un contacto inmediato.',
        'Gatillos de persuasión: contadores de preventa regresivos y avisos de stock limitado de lotes.',
        'Mapa del entorno interactivo que destaca la plusvalía proyectada y servicios cercanos.',
        'Prueba social estructurada con testimonios, videos del terreno y garantías de la constructora.'
      ],
      deseosCliente: '«Necesito captar prospectos calificados para mis nuevos lanzamientos inmobiliarios de forma rápida, automatizando el registro y filtrando contactos valiosos antes de que llegue la preventa.»'
    }
  };

  const seccionesMuestra = [
    {
      step: "01",
      title: "1. Calificación de Leads (Filtro en 3 Segundos)",
      recomendado: "Reduce la pérdida de tiempo de tus asesores atendiendo a curiosos sin presupuesto. Mostrar la ubicación y el precio base en los primeros 3 segundos autocalifica al prospecto antes de contactar.",
      solucion: "Diseñamos portadas de carga instantánea con renders y filtros dinámicos que aumentan la conversión de visitas en un 25% filtrando leads fríos.",
      img: "/inmobiliaria_filtro_leads_es.png",
      icon1: <Target className="w-4 h-4" />,
      icon2: <Zap className="w-4 h-4" />
    },
    {
      step: "02",
      title: "2. Cierre de Ventas Digital (Lotes Interactivos)",
      recomendado: "Elimina el costo de imprimir dossiers gigantes de planos y maquetas físicas. Permitir que el comprador busque y filtre medidas desde su celular reduce el ciclo de decisión a minutos.",
      solucion: "Desarrollamos planos de lotización en tiempo real interactivos donde los clientes ven la disponibilidad del lote (libre/vendido), fomentando la compra por urgencia visual.",
      img: "/inmobiliaria_lotes_interactivos_es.png",
      icon1: <Building2 className="w-4 h-4" />,
      icon2: <Sparkles className="w-4 h-4" />
    },
    {
      step: "03",
      title: "3. Demostración de Plusvalía (Venta Remota)",
      recomendado: "Ahorra más del 60% en viáticos de visitas. Mostrar la conectividad de la zona (avenidas, centros comerciales) educa al comprador sobre el valor futuro del metro cuadrado sin tener que viajar.",
      solucion: "Integramos mapas inteligentes con filtros que calculan tiempos de viaje y conectividad urbana directamente en la página, agilizando la venta telefónica.",
      img: "/inmobiliaria_mapa_plusvalia_es_v2.png",
      icon1: <MapPin className="w-4 h-4" />,
      icon2: <Laptop className="w-4 h-4" />
    },
    {
      step: "04",
      title: "4. Automatización de Captura (Embudo 24/7)",
      recomendado: "No dependas de que tus asesores estén despiertos. El 70% de las búsquedas ocurren de noche; automatizar la entrega de precios asegura que ningún lead caliente se enfríe.",
      solucion: "Implementamos formularios que envían el brochure en PDF por WhatsApp de forma automatizada al instante y guardan el prospecto en tu CRM listo para su cierre.",
      img: "/inmobiliaria_whatsapp_automation_es_v3.png",
      icon1: <Clock className="w-4 h-4" />,
      icon2: <Smartphone className="w-4 h-4" />
    }
  ];

  const pilaresEnfoque = [
    {
      icon: <Eye className="w-7 h-7 text-nexus-accent" />,
      title: "1. Atracción e Interés Visual",
      desc: "El comprador de terrenos es visual. Al entrar a la web, lo primero que experimenta son renders de alta calidad, mapas de ubicación y el recorrido 360° del proyecto. Esto capta su atención de inmediato y despierta el deseo real de conocer el terreno.",
      neonClass: "card-neon-cian",
      iconBg: "bg-nexus-accent/10 border border-nexus-accent/20"
    },
    {
      icon: <Shield className="w-7 h-7 text-nexus-purple" />,
      title: "2. Filtro de Curiosos Automático",
      desc: "La web presenta de forma clara los precios base, áreas en m² y planos de lotización interactivos. Al tener acceso a esta información clave antes de contactar, los curiosos sin presupuesto o con intereses distintos se auto-descartan solos.",
      neonClass: "card-neon-purple",
      iconBg: "bg-nexus-purple/10 border border-nexus-purple/20"
    },
    {
      icon: <Target className="w-7 h-7 text-blue-400" />,
      title: "3. Visitas y Cierre de Alta Conversión",
      desc: "Una vez pre-calificado y educado por la web, el cliente contacta por WhatsApp o llamada. Tus asesores agendan visitas presenciales al terreno o reuniones en tu oficina solo con leads calificados listos para comprar, maximizando tus cierres.",
      neonClass: "card-neon-blue",
      iconBg: "bg-blue-500/10 border border-blue-500/20"
    }
  ];

  const handleTabClick = (tabId) => {
    setActiveProject(tabId);
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setTimeout(() => {
        const element = document.getElementById(`acordeon-${tabId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
    }
  };

  const renderDetailContent = (projectKey) => {
    const preview = previewScreenshots[projectKey];
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left">
        {/* Contenido / Copys */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div>
            <span className="text-[10px] font-bold text-nexus-purple bg-nexus-purple/10 px-2.5 py-1 rounded-full border border-nexus-purple/20 uppercase tracking-widest w-fit block">
              Así se Estructura tu Sitio Web
            </span>
            <h2 className="text-xl md:text-3.5xl font-bold text-white mt-4 leading-tight">
              {preview.title}
            </h2>
            <p className="text-nexus-accent text-xs md:text-sm font-medium mt-1">
              {preview.subtitle}
            </p>
          </div>

          <div className="bg-white/5 border border-white/5 rounded-2xl p-5 italic text-gray-300 text-xs md:text-sm leading-relaxed relative mt-2">
            <span className="absolute -top-3 left-4 bg-nexus-purple text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">El Deseo de tu Negocio</span>
            {preview.deseosCliente}
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider border-b border-white/5 pb-2">Características Clave de Conversión:</h4>
            {preview.features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-2.5">
                <div className="p-1 rounded-full bg-emerald-500/10 text-emerald-400 mt-0.5 border border-emerald-500/20">
                  <CheckCircle className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs text-gray-300 leading-relaxed">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Simulación del Mockup de Pantalla */}
        <div className="lg:col-span-7 flex flex-col gap-4 w-full">
          <div className="bg-[#0b0f19] border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative w-full">
            {/* Browser Chrome Simulation */}
            <div className="bg-[#182035] px-4 py-2 border-b border-white/5 flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 block"></span>
              </div>
              <div className="bg-white/5 rounded-lg text-[10px] text-gray-400 px-6 py-1 mx-auto w-3/4 text-center font-mono overflow-hidden whitespace-nowrap">
                https://sierra-capital.com
              </div>
            </div>

            {/* Screenshot / Render Content */}
            <div className="relative h-64 md:h-[400px] overflow-hidden w-full">
              {projectKey === 'preventa' ? (
                <div className="relative w-full h-full select-none bg-black">
                  {/* Interactive House Image Swapper */}
                  <img
                    src={`${import.meta.env.BASE_URL.replace(/\/$/, "")}${
                      !topLight && !bottomLight ? '/tour/sinluz.png' :
                      topLight && !bottomLight ? '/tour/luzarriba.png' :
                      !topLight && bottomLight ? '/tour/luzabajo.png' :
                      '/tour/conluz.jpeg'
                    }`}
                    alt="Casa interactiva"
                    className="w-full h-full object-cover transition-all duration-300"
                  />

                  {/* Interactive Buttons */}
                  <button
                    onClick={() => setTopLight(!topLight)}
                    className={`absolute top-[30%] left-[45%] -translate-x-1/2 -translate-y-1/2 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider transition-all duration-300 shadow-md cursor-pointer ${topLight
                        ? 'bg-[#182035] text-white hover:bg-[#182035]/80'
                        : 'bg-white text-black hover:bg-white/95 scale-105'
                      }`}
                  >
                    {topLight ? 'off' : 'on'}
                  </button>

                  <button
                    onClick={() => setBottomLight(!bottomLight)}
                    className={`absolute top-[60%] left-[55%] -translate-x-1/2 -translate-y-1/2 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider transition-all duration-300 shadow-md cursor-pointer ${bottomLight
                        ? 'bg-[#182035] text-white hover:bg-[#182035]/80'
                        : 'bg-white text-black hover:bg-white/95 scale-105'
                      }`}
                  >
                    {bottomLight ? 'off' : 'on'}
                  </button>
                </div>
              ) : (
                <img
                  src={(() => {
                    const imgPath = projectKey === 'residencial' ? '/tour/fotografiaaereamaravillas2.png' : preview.heroImg;
                    return imgPath.startsWith('http') || imgPath.startsWith('data:') ? imgPath : `${import.meta.env.BASE_URL.replace(/\/$/, "")}${imgPath}`;
                  })()}
                  alt="Visualización del diseño web"
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none"></div>

              {/* Floating Web UI Simulation elements */}
              <div className="absolute bottom-4 left-4 right-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="max-w-md">
                  <span className="text-[8px] uppercase font-bold tracking-widest text-nexus-accent bg-nexus-accent/20 border border-nexus-accent/30 px-1.5 py-0.5 rounded">Proyecto Destacado</span>
                  <h4 className="text-sm md:text-lg font-bold text-white mt-1">
                    {projectKey === 'residencial' ? 'Residencial Maravillas - Salida Cusco' : preview.title}
                  </h4>
                  <p className="text-[9px] text-gray-300 mt-0.5 line-clamp-2">
                    {projectKey === 'residencial'
                      ? 'Terrenos con facil acceso vehicular urbano, cuenta con agua dulce y una excelente vista panorámica, a solo 15 minutos del centro de la ciudad de Juliaca.'
                      : preview.subtitle}
                  </p>
                </div>
                
                {/* 3 Botones similares premium cian que llevan al scroll suave del recorrido 360 */}
                {projectKey === 'residencial' ? (
                  <a
                    href="#recorrido-360"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById('recorrido-360')?.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                      });
                    }}
                    className="bg-nexus-accent text-slate-950 font-bold text-[10px] px-4 py-2 rounded-xl flex items-center justify-center gap-1.5 shadow-lg border border-[#00f2fe]/30 hover:bg-white hover:text-black transition-all cursor-pointer whitespace-nowrap w-fit self-start md:self-end"
                  >
                    <span>Probar Recorrido 360°</span>
                    <ArrowRight className="w-3 h-3" />
                  </a>
                ) : projectKey === 'industrial' ? (
                  <a
                    href="#recorrido-360"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById('recorrido-360')?.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                      });
                    }}
                    className="bg-nexus-accent text-slate-950 font-bold text-[10px] px-4 py-2 rounded-xl flex items-center justify-center gap-1.5 shadow-lg border border-[#00f2fe]/30 hover:bg-white hover:text-black transition-all cursor-pointer whitespace-nowrap w-fit self-start md:self-end"
                  >
                    <span>Probar Recorrido Obras</span>
                    <ArrowRight className="w-3 h-3" />
                  </a>
                ) : projectKey === 'preventa' ? (
                  <a
                    href="#recorrido-360"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById('recorrido-360')?.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                      });
                    }}
                    className="bg-nexus-accent text-slate-950 font-bold text-[10px] px-4 py-2 rounded-xl flex items-center justify-center gap-1.5 shadow-lg border border-[#00f2fe]/30 hover:bg-white hover:text-black transition-all cursor-pointer whitespace-nowrap w-fit self-start md:self-end"
                  >
                    <span>Probar Demo Preventa 360°</span>
                    <ArrowRight className="w-3 h-3" />
                  </a>
                ) : null}
              </div>
            </div>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-gray-500 font-sans">Visualización interactiva: La imagen superior emula la estructura de cabecera y hero sección que desarrollaremos para ti.</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={isTourExpanded ? "" : "animate-fade-in-up"}>
      {/* Hero Section */}
      <section className="container mx-auto px-6 pt-20 pb-16 relative z-10 text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-nexus-accent/5 rounded-full blur-[80px] pointer-events-none"></div>
        <span className="text-xs uppercase text-nexus-accent font-bold tracking-widest bg-nexus-accent/10 px-3 py-1 rounded-full border border-nexus-accent/20">
          CONSTRUCTORAS & INMOBILIARIAS
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold text-white mt-4 mb-6 leading-tight max-w-4xl mx-auto">
          ¿Cómo se Vería la Página Web de tu Constructora?
        </h1>
        <p className="text-gray-300 max-w-2xl mx-auto text-base md:text-lg mb-12 leading-relaxed">
          Explora a continuación las propuestas visuales y de contenido que diseñamos específicamente para el sector inmobiliario y de construcción, adaptadas a tus verdaderos objetivos de negocio.
        </p>
      </section>

      {/* Selector de Rubro / Tipo de Web */}
      <section className="container mx-auto px-6 pb-8 relative z-10">
        <div className="max-w-6xl mx-auto">

          {/* DISEÑO EN ESCRITORIO: Pestañas en Grid y Contenedor abajo */}
          <div className="hidden md:block">
            {/* Tabs Nav */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
              <button
                onClick={() => handleTabClick('residencial')}
                className={`p-6 rounded-3xl text-left transition-all duration-300 border border-white/5 cursor-pointer ${activeProject === 'residencial'
                    ? 'bg-white text-nexus-dark border-white shadow-xl translate-y-[-4px]'
                    : 'glass-panel text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                <span className={`text-[10px] font-bold uppercase tracking-wider block mb-2 ${activeProject === 'residencial' ? 'text-nexus-purple' : 'text-nexus-accent'}`}>Sector Inmobiliario</span>
                <h3 className="text-lg font-bold">Proyectos Residenciales</h3>
                <p className="text-xs mt-2 opacity-80 leading-relaxed">Venta y preventa de Terrenos, casas y condominios campestres con renders e interactivos 3D.</p>
              </button>

              <button
                onClick={() => handleTabClick('industrial')}
                className={`p-6 rounded-3xl text-left transition-all duration-300 border border-white/5 cursor-pointer ${activeProject === 'industrial'
                    ? 'bg-white text-nexus-dark border-white shadow-xl translate-y-[-4px]'
                    : 'glass-panel text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                <span className={`text-[10px] font-bold uppercase tracking-wider block mb-2 ${activeProject === 'industrial' ? 'text-nexus-purple' : 'text-nexus-accent'}`}>Sector Obras Civiles</span>
                <h3 className="text-lg font-bold">Constructores & Contratistas</h3>
                <p className="text-xs mt-2 opacity-80 leading-relaxed">Páginas de solidez institucional, maquetas virtuales 360°, recorridos 3D, maquinaria pesada en obras, obras entregadas e ISOs de seguridad.</p>
              </button>

              <button
                onClick={() => handleTabClick('preventa')}
                className={`p-6 rounded-3xl text-left transition-all duration-300 border border-white/5 cursor-pointer ${activeProject === 'preventa'
                    ? 'bg-white text-nexus-dark border-white shadow-xl translate-y-[-4px]'
                    : 'glass-panel text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                <span className={`text-[10px] font-bold uppercase tracking-wider block mb-2 ${activeProject === 'preventa' ? 'text-nexus-purple' : 'text-nexus-accent'}`}>Sector Marketing</span>
                <h3 className="text-lg font-bold">Landings de Preventa y Lotes</h3>
                <p className="text-xs mt-2 opacity-80 leading-relaxed">Embudos rápidos de captación de clientes potenciales altamente interesados en lanzamientos.</p>
              </button>
            </div>

            {/* Maqueta Interactiva - Muestra cómo se vería */}
            <div id="maqueta-interactiva" className="glass-panel border border-white/10 rounded-3xl p-6 md:p-10 animate-fade-in-up mb-8">
              {renderDetailContent(activeProject)}
            </div>
          </div>

          {/* DISEÑO EN MÓVILES: Acordeón Interactivo Colapsable */}
          <div className="block md:hidden space-y-4 mb-12">
            
            {/* Acordeón Residencial */}
            <div id="acordeon-residencial" className="rounded-3xl overflow-hidden border border-white/5 bg-nexus-dark/40">
              <button
                onClick={() => handleTabClick('residencial')}
                className={`w-full p-5 text-left transition-all duration-300 flex justify-between items-center cursor-pointer ${
                  activeProject === 'residencial' ? 'bg-white text-nexus-dark' : 'glass-panel text-gray-400'
                }`}
              >
                <div>
                  <span className={`text-[9px] font-bold uppercase tracking-wider block mb-1 ${activeProject === 'residencial' ? 'text-nexus-purple' : 'text-nexus-accent'}`}>Sector Inmobiliario</span>
                  <h3 className="text-base font-bold">Proyectos Residenciales</h3>
                </div>
                <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${activeProject === 'residencial' ? 'rotate-90 text-nexus-dark' : 'text-gray-500'}`} />
              </button>
              
              {activeProject === 'residencial' && (
                <div className="p-4 border-t border-white/10 glass-panel animate-fade-in bg-nexus-dark/60">
                  {renderDetailContent('residencial')}
                </div>
              )}
            </div>

            {/* Acordeón Industrial */}
            <div id="acordeon-industrial" className="rounded-3xl overflow-hidden border border-white/5 bg-nexus-dark/40">
              <button
                onClick={() => handleTabClick('industrial')}
                className={`w-full p-5 text-left transition-all duration-300 flex justify-between items-center cursor-pointer ${
                  activeProject === 'industrial' ? 'bg-white text-nexus-dark' : 'glass-panel text-gray-400'
                }`}
              >
                <div>
                  <span className={`text-[9px] font-bold uppercase tracking-wider block mb-1 ${activeProject === 'industrial' ? 'text-nexus-purple' : 'text-nexus-accent'}`}>Sector Obras Civiles</span>
                  <h3 className="text-base font-bold">Constructores & Contratistas</h3>
                </div>
                <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${activeProject === 'industrial' ? 'rotate-90 text-nexus-dark' : 'text-gray-500'}`} />
              </button>
              
              {activeProject === 'industrial' && (
                <div className="p-4 border-t border-white/10 glass-panel animate-fade-in bg-nexus-dark/60">
                  {renderDetailContent('industrial')}
                </div>
              )}
            </div>

            {/* Acordeón Preventa */}
            <div id="acordeon-preventa" className="rounded-3xl overflow-hidden border border-white/5 bg-nexus-dark/40">
              <button
                onClick={() => handleTabClick('preventa')}
                className={`w-full p-5 text-left transition-all duration-300 flex justify-between items-center cursor-pointer ${
                  activeProject === 'preventa' ? 'bg-white text-nexus-dark' : 'glass-panel text-gray-400'
                }`}
              >
                <div>
                  <span className={`text-[9px] font-bold uppercase tracking-wider block mb-1 ${activeProject === 'preventa' ? 'text-nexus-purple' : 'text-nexus-accent'}`}>Sector Marketing</span>
                  <h3 className="text-base font-bold">Landings de Preventa y Lotes</h3>
                </div>
                <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${activeProject === 'preventa' ? 'rotate-90 text-nexus-dark' : 'text-gray-500'}`} />
              </button>
              
              {activeProject === 'preventa' && (
                <div className="p-4 border-t border-white/10 glass-panel animate-fade-in bg-nexus-dark/60">
                  {renderDetailContent('preventa')}
                </div>
              )}
            </div>

          </div>

        </div>
      </section>

      {/* Recorrido Virtual 360° a Gran Escala */}
      <section className="container mx-auto px-6 pb-12 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div id="recorrido-360" className={`scroll-mt-28 ${isTourExpanded ? '' : 'reveal-on-scroll revealed'}`}>
            <div className="text-center mb-10">
              <span className="text-xs uppercase text-nexus-accent font-bold tracking-widest bg-nexus-accent/10 px-3 py-1 rounded-full border border-nexus-accent/20">
                Caso de éxito interactivo en vivo
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-white mt-4 mb-4 font-sans">
                ¿Cómo un Recorrido 360° Acelera tus Ventas y Reduce Costos?
              </h2>
              <p className="text-gray-400 max-w-4xl mx-auto text-sm md:text-base leading-relaxed">
                Esta es una demostración interactiva real que diseñamos para uno de nuestros clientes. Imagina a tus clientes y asesores inmobiliarios explorando cada rincón, linderos y conectividad de tu proyecto directamente desde su celular o laptop. Esta herramienta <strong>educa al comprador de forma autónoma</strong>, entrena visualmente a tu fuerza de ventas y <strong>reduce drásticamente los costos de traslado y el tiempo</strong> invertido en visitas físicas improductivas, logrando cierres de preventa de lotes en planos mucho más ágiles.
              </p>
            </div>

            <div className={`w-full h-[400px] md:h-[580px] rounded-3xl transition-all duration-300 ${isTourExpanded
                ? 'z-[9999]'
                : 'overflow-hidden glass-panel border border-white/15 shadow-2xl relative z-20'
              }`}>
              <VirtualTour tourId="inmobiliaria" isExpanded={isTourExpanded} setIsExpanded={setIsTourExpanded} />
            </div>
          </div>
        </div>
      </section>

      {/* NUEVO ENFOQUE: Cómo estructuramos la información de la página */}
      <section className="container mx-auto px-6 pt-6 pb-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="mb-24">
            <div className="text-center mb-16">
              <span className="text-xs uppercase text-nexus-purple font-bold tracking-widest bg-nexus-purple/10 px-3 py-1 rounded-full border border-nexus-purple/20">
                Estrategia y Estructura
              </span>
              <h2 className="text-3xl font-bold text-white mt-4">¿Cómo Estructuramos una Web Inmobiliaria de Alto Rendimiento?</h2>
              <p className="text-gray-400 text-sm mt-2 max-w-xl mx-auto">
                No diseñamos páginas al azar. Implementamos un flujo lógico optimizado para convertir visitas en prospectos calificados e informados.
              </p>
            </div>

            <div className="flex flex-col gap-24">
              {seccionesMuestra.map((sec, i) => {
                const isEven = i % 2 === 0;
                return (
                  <div 
                    key={i} 
                    className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-20 ${
                      isEven ? '' : 'lg:flex-row-reverse'
                    }`}
                  >
                    {/* Contenedor de la Imagen con Luz de Fondo Sutil y Palpitante */}
                    <div className="w-full lg:w-1/2 relative group">
                      {/* Fondo de resplandor sutil (glow) palpitante */}
                      <div className={`absolute -inset-6 rounded-[40px] bg-gradient-to-tr ${
                        isEven ? 'from-nexus-accent/25 to-nexus-blue/15' : 'from-nexus-purple/25 to-pink-500/15'
                      } opacity-40 blur-3xl transition-all duration-700 animate-soft-glow-pulsing pointer-events-none group-hover:opacity-60`} />
                      
                      {/* Tarjeta de Imagen Principal */}
                      <div className="relative overflow-hidden rounded-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] bg-[#070a13] z-10">
                        <img 
                          src={sec.img ? (sec.img.startsWith('http') || sec.img.startsWith('data:') ? sec.img : `${import.meta.env.BASE_URL.replace(/\/$/, "")}${sec.img}`) : ''} 
                          alt={sec.title} 
                          className="w-full h-72 md:h-[420px] object-cover group-hover:scale-105 transition-transform duration-700" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#070a13] via-[#070a13]/10 to-transparent pointer-events-none"></div>
                      </div>
                    </div>

                    {/* Contenedor del Contenido */}
                    <div className="w-full lg:w-1/2 flex flex-col justify-center z-10">
                      <h3 className="text-2xl md:text-3.5xl font-extrabold text-white mb-6 leading-tight tracking-tight">
                        {sec.title}
                      </h3>
                      
                      <div className="flex flex-col gap-4">
                        {/* Caja: Estrategia Recomendada */}
                        <div className="glass-panel border border-white/5 rounded-2xl p-5 flex gap-4 items-start hover:border-nexus-purple/20 transition-all duration-300">
                          <div className="p-2 rounded-xl bg-nexus-purple/10 text-nexus-purple border border-nexus-purple/20 shrink-0 mt-0.5">
                            {sec.icon1}
                          </div>
                          <div>
                            <strong className="text-nexus-purple text-[10px] font-bold uppercase tracking-widest block mb-1">Estrategia Recomendada</strong>
                            <p className="text-gray-300 text-xs md:text-[13px] leading-relaxed font-medium">
                              {sec.recomendado}
                            </p>
                          </div>
                        </div>

                        {/* Caja: Solución Tecnológica */}
                        <div className="glass-panel border border-nexus-accent/10 rounded-2xl p-5 flex gap-4 items-start hover:border-nexus-accent/30 transition-all duration-300 bg-nexus-accent/[0.02]">
                          <div className="p-2 rounded-xl bg-nexus-accent/10 text-nexus-accent border border-nexus-accent/20 shrink-0 mt-0.5">
                            {sec.icon2}
                          </div>
                          <div>
                            <strong className="text-nexus-accent text-[10px] font-bold uppercase tracking-widest block mb-1">Nuestra Solución para tu Empresa</strong>
                            <p className="text-gray-200 text-xs md:text-[13px] leading-relaxed font-medium">
                              {sec.solucion}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pilares de Conversión - Tres bloques informativos */}
          <div className="mb-8 border-t border-white/5 pt-20">
            <div className="text-center mb-16">
              <span className="text-xs uppercase text-nexus-blue font-bold tracking-widest bg-nexus-blue/10 px-3 py-1 rounded-full border border-nexus-blue/20">
                Nuestros Criterios de Calidad
              </span>
              <h2 className="text-3xl font-bold text-white mt-4">Criterios Clave para tu Éxito Digital</h2>
              <p className="text-gray-400 text-sm mt-2 max-w-xl mx-auto">
                Nos enfocamos en lo que realmente importa al cliente final cuando visita tu portal inmobiliario.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pilaresEnfoque.map((pilar, i) => (
                <div 
                  key={i} 
                  className={`p-8 rounded-3xl flex flex-col gap-5 ${pilar.neonClass} border shadow-2xl hover:-translate-y-1.5 duration-300 transition-all`}
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${pilar.iconBg}`}>
                    {pilar.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white tracking-tight">{pilar.title}</h3>
                  <p className="text-xs md:text-[13px] text-gray-400 leading-relaxed font-medium">{pilar.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* CTA Final */}
      <section className="container mx-auto px-6 pb-24">
        <div className="max-w-4xl mx-auto glass-panel border border-nexus-accent/20 rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-nexus-accent opacity-[0.03] rounded-full blur-[80px] pointer-events-none"></div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            ¿Cómo Creamos tu Vitrina Inmobiliaria?
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base mb-10 leading-relaxed">
            Adquirir tu página web es un proceso claro, estructurado y sin complicaciones. Te invitamos a conocer el paso a paso de cómo planificamos, diseñamos y entregamos tu plataforma inmobiliaria optimizada para la conversión.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/proceso"
              className="inline-flex items-center justify-center btn-neon-cian px-8 py-3.5 rounded-full font-bold transition-all duration-200 active:scale-95 group uppercase tracking-wider text-xs md:text-sm font-sans w-full sm:w-auto text-white"
            >
              Ver Proceso de Trabajo
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/contacto"
              className="inline-flex items-center justify-center border border-white/10 hover:border-white/20 hover:bg-white/5 px-8 py-3.5 rounded-full font-bold transition-all duration-200 active:scale-95 text-gray-400 hover:text-white uppercase tracking-wider text-xs md:text-sm font-sans w-full sm:w-auto"
            >
              Contactar
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
