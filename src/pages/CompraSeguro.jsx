import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Lock, 
  Scale,
  Search,
  AlertTriangle,
  FileCheck,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function CompraSeguro() {
  const [openFaq, setOpenFaq] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  useEffect(() => {
    document.title = "Compra tu Propiedad Seguro y Sin Riesgos | Nexus Domo 360°";
    window.scrollTo(0, 0);
  }, []);

  const peligros = [
    {
      id: 1,
      titulo: "1. Tráfico de tierras o múltiples dueños",
      descripcion: "Es el fraude más común en terrenos sin independizar en el altiplano. Estafadores venden un mismo lote a dos o más personas distintas utilizando minutas y documentos de posesión falsificados. Los compradores terminan en largos y costosos litigios judiciales por la posesión física de la propiedad.",
      imagen: "/trafico_tierras_puno.png",
      tag: "⚠️ Riesgo de Doble Venta",
      icon: <AlertTriangle className="w-5 h-5 text-red-400" />,
      solucion: "Evitamos ventas duplicadas mediante estudio registral SUNARP obligatorio antes de publicar."
    },
    {
      id: 2,
      titulo: "2. Cargas o hipotecas ocultas",
      descripcion: "Muchas propiedades o casas en venta en Juliaca arrastran deudas imprevistas, embargos por créditos bancarios impagos, litigios de herencias familiares no declarados o cargas técnicas que impiden construir legalmente. El comprador descubre la deuda recién cuando acude a formalizar su firma ante notaría.",
      imagen: "/hipoteca_oculta_puno.png",
      tag: "🔒 Cargas Financieras Ocultas",
      icon: <Lock className="w-5 h-5 text-red-400" />,
      solucion: "Filtramos deudas, gravámenes y realizamos estudio de títulos completo con asesores legales."
    },
    {
      id: 3,
      titulo: "3. Linderos y medidas falsas",
      descripcion: "Terrenos que en los documentos de compraventa dicen medir una superficie determinada (ej. 160 m²), pero al medir físicamente en campo, el lote resulta ser mucho más angosto debido a invasiones de vecinos colindantes o errores de delimitación topográfica en el plano inicial de lotización.",
      imagen: "/medidas_falsas_puno.png",
      tag: "📐 Medidas Físicas Falsas",
      icon: <Scale className="w-5 h-5 text-red-400" />,
      solucion: "Verificamos mediciones perimétricas exactas en campo mediante levantamiento topográfico con dron."
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === peligros.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? peligros.length - 1 : prev - 1));
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "¿Cómo puedo verificar si un terreno en Juliaca tiene un título de propiedad real inscrito en la SUNARP?",
      answer: "El único documento legal que garantiza la propiedad absoluta es la Copia Literal o la Partida Registral emitida por la SUNARP Juliaca. En este registro público se detalla el historial de dueños, las dimensiones exactas del lote y si cuenta con embargos, hipotecas o juicios pendientes. Comprar solo con 'minuta de posesión' o documentos comunales en Juliaca representa un riesgo extremo de doble venta. En Nexus Domo 360, realizamos este estudio legal de forma obligatoria y gratuita para ti antes de publicar cualquier inmueble."
    },
    {
      question: "¿Qué peligro real corro al comprar un lote en Juliaca que solo cuenta con minuta o constancia de posesión?",
      answer: "La constancia de posesión o la minuta de compraventa sin inscripción registral no acreditan propiedad ante la ley peruana; solo certifican quién ocupa físicamente el suelo. Estafadores en Juliaca suelen vender un mismo lote a varias personas usando minutas firmadas legalmente en notaría, pero sin valor en Registros Públicos. Si compras un terreno sin título en la SUNARP, podrías perder toda tu inversión en un litigio judicial. En nuestro portal solo listamos propiedades con Partida Registral independizada o en proyectos de habilitación urbana debidamente aprobados."
    },
    {
      question: "¿Por qué el servicio de verificación legal y topografía de Nexus Domo es 100% gratuito para mí como comprador?",
      answer: "Así es. Como comprador, no nos pagas absolutamente nada por la búsqueda de tu terreno, el estudio de títulos registrales, la verificación topográfica con dron ni el acompañamiento legal en notaría. Nuestros honorarios de corretaje son cubiertos en su totalidad por el propietario vendedor o la constructora del proyecto inmobiliario en Juliaca. Tu único gasto será el precio real del inmueble y las tasas notariales de ley."
    },
    {
      question: "¿Qué pasa si me interesa un lote en una nueva habilitación urbana en las salidas de Juliaca que aún no tiene agua ni luz?",
      answer: "En las zonas de expansión de Juliaca (salida a Puno, Cusco o Huancané), es común que los proyectos estén en fase de desarrollo. En Nexus Domo 360 no nos basamos en promesas verbales. Auditamos los expedientes técnicos municipales y las resoluciones de habilitación urbana. Verificamos que la empresa desarrolladora tenga firmados los plazos obligatorios de entrega de redes de agua, desagüe, luz y pistas en el contrato de compraventa, asegurando que tu lote adquiera alta plusvalía legalmente."
    },
    {
      question: "¿Cómo es el proceso de firma y pago seguro para comprar un terreno verificado con ustedes?",
      answer: "Para tu total seguridad, todo pago importante (cuota inicial o saldo total) se realiza mediante un cheque de gerencia no negociable o transferencia bancaria directa a nombre del titular registral de la SUNARP, nunca a terceros. La firma del contrato de compraventa (minuta) y la firma de la Escritura Pública se realizan exclusivamente de forma física dentro de una Notaría Pública autorizada en Juliaca. Nosotros te guiamos paso a paso hasta que tu propiedad quede debidamente inscrita a tu nombre en Registros Públicos."
    }
  ];

  const [activeStep, setActiveStep] = useState(-1);
  const prevActiveStepRef = useRef(-1);

  useEffect(() => {
    let originalScrollRestoration;
    if ('scrollRestoration' in window.history) {
      originalScrollRestoration = window.history.scrollRestoration;
      window.history.scrollRestoration = 'manual';
    }

    window.scrollTo(0, 0);

    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 50);

    return () => {
      clearTimeout(timer);
      if ('scrollRestoration' in window.history && originalScrollRestoration) {
        window.history.scrollRestoration = originalScrollRestoration;
      }
    };
  }, []);

  useEffect(() => {
    if (activeStep !== -1) {
      const prevActiveStep = prevActiveStepRef.current;
      prevActiveStepRef.current = activeStep;

      const timer = setTimeout(() => {
        const element = document.getElementById(`acordeon-nivel-${activeStep}`);
        if (element) {
          const navbarOffset = 90; // Espaciado para evitar que la Navbar tape el título del nivel
          const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
          const scrollTarget = elementTop - navbarOffset;

          window.scrollTo({
            top: scrollTarget,
            behavior: 'smooth'
          });
        }
      }, 250);

      return () => clearTimeout(timer);
    }
  }, [activeStep]);

  const pasos = [
    {
      id: 0,
      numero: "01",
      titulo: "Filtro 1: Jurídico y Registral (SUNARP)",
      descripcion: "Nuestro Abogado Inmobiliario realiza un estudio minucioso de la partida registral en la SUNARP Juliaca. Verificamos que el vendedor sea el propietario legítimo con facultades completas, y descartamos la existencia de gravámenes, hipotecas ocultas, embargos judiciales o sucesiones intestadas no declaradas que pongan en peligro tu inversión.",
      color: "text-nexus-accent",
      bgColor: "bg-nexus-accent/10",
      borderColor: "border-nexus-accent/20",
      glowColor: "shadow-[0_0_15px_rgba(6,182,212,0.15)]",
      imagen: "/filtro_sunarp_juliaca.png",
      puntos: [
        "Estudio completo de títulos y copia literal archivada",
        "Verificación de gravámenes, cargas judiciales e hipotecas",
        "Validación de facultades del propietario vendedor",
        "Asistencia legal en minutas de compraventa a medida"
      ]
    },
    {
      id: 1,
      numero: "02",
      titulo: "Filtro 2: Técnico e Historial Municipal",
      descripcion: "Auditamos la situación del inmueble ante la municipalidad correspondiente. Exigimos y verificamos que el impuesto predial esté pagado mediante los formularios HR (Hoja de Resumen) y PU (Predio Urbano). Además, analizamos el plano de lotización aprobado y verificamos que la zonificación sea compatible con el uso de suelo residencial o comercial que necesitas.",
      color: "text-nexus-purple",
      bgColor: "bg-nexus-purple/10",
      borderColor: "border-nexus-purple/20",
      glowColor: "shadow-[0_0_15px_rgba(168,85,247,0.15)]",
      imagen: "/filtro_municipal_juliaca.png",
      puntos: [
        "Validación de autovalúo al día (formularios HR y PU)",
        "Verificación de deudas de arbitrios o multas municipales",
        "Análisis de compatibilidad de zonificación del suelo",
        "Validación de planos de lotización aprobados"
      ]
    },
    {
      id: 2,
      numero: "03",
      titulo: "Filtro 3: Físico y Topográfico (Dron)",
      descripcion: "Acudimos físicamente al terreno para realizar un levantamiento topográfico visual mediante vuelos con dron. Verificamos que las colindancias, medidas perimétricas y linderos coincidan con total precisión matemática con el plano archivado en la SUNARP. Asimismo, corroboramos en el lugar el estado real de los servicios básicos (agua, desagüe y luz).",
      color: "text-indigo-400",
      bgColor: "bg-indigo-400/10",
      borderColor: "border-indigo-400/20",
      glowColor: "shadow-[0_0_15px_rgba(129,140,248,0.15)]",
      imagen: "/filtro_dron_juliaca.png",
      puntos: [
        "Inspección física en campo y linderos perimétricos",
        "Levantamiento topográfico aéreo digital mediante dron",
        "Superposición geométrica de coordenadas SUNARP vs. Terreno",
        "Comprobación in situ de la factibilidad de agua, desagüe y luz"
      ]
    }
  ];

  return (
    <div className="animate-fade-in-up font-sans">
      <style>{`
        @keyframes avatarWaterFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .avatar-water-border {
          background-size: 200% 200%;
          animation: avatarWaterFlow 6s ease infinite;
        }
      `}</style>

      {/* 1. HERO SECTION */}
      <section className="container mx-auto px-6 pt-28 pb-16 relative z-10 text-center reveal-on-scroll">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-gradient-to-r from-nexus-accent/10 to-nexus-purple/10 rounded-full blur-[80px] pointer-events-none z-0"></div>
        
        <span className="text-xs uppercase text-nexus-accent font-bold tracking-widest bg-nexus-accent/10 px-3.5 py-1.5 rounded-full border border-nexus-accent/20 relative z-10 inline-block">
          CERO RIESGOS DE ESTAFAS
        </span>
        
        <h1 className="text-4xl md:text-6xl font-extrabold text-white mt-5 mb-6 leading-[1.15] max-w-4xl mx-auto relative z-10 font-display">
          Compra tu propiedad con absoluta <span className="text-gradient-rise">Garantía y Respaldo Legal</span>
        </h1>
        
        <p className="text-gray-300 max-w-3xl mx-auto text-base md:text-lg mb-10 leading-relaxed relative z-10 font-sans">
          En el mercado inmobiliario del departamento de Puno y el sur del Perú, la seguridad de tu dinero es lo primero. En Nexus Domo 360° filtramos legal, técnica y físicamente cada terreno, lote y casa antes de publicarlo en nuestro portal. Nuestro Abogado Inmobiliario dedicado audita cada título en la SUNARP y sanea la documentación correspondiente para que compres sin riesgos de estafas.
        </p>

        <div className="flex justify-center relative z-10">
          <Link
            to="/"
            className="inline-flex items-center justify-center btn-neon-cian px-8 py-4 rounded-full font-bold uppercase tracking-wider text-xs md:text-sm transition-all duration-200 active:scale-95 group font-display"
          >
            <Search className="w-4.5 h-4.5 mr-2" />
            Ver Propiedades Verificadas
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* 2. LA REALIDAD DEL MERCADO (PELIGROS) */}
      <section className="container mx-auto px-6 pb-10 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-16 reveal-on-scroll">
          <span className="text-xs uppercase text-red-400 font-bold tracking-widest bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">ALERTAS DEL MERCADO</span>
          <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight mt-4 font-display">
            Los 3 mayores peligros al comprar un terreno en Juliaca (y cómo te protegemos)
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto text-sm md:text-base mt-4 leading-relaxed font-sans">
            Comprar un lote de manera informal puede costar los ahorros de toda tu vida. A continuación, te mostramos los riesgos más comunes y cómo te protegemos de ellos de forma activa.
          </p>
        </div>

        <div className="max-w-5xl mx-auto relative px-0 md:px-6 reveal-on-scroll">
          <div className="overflow-hidden rounded-3xl border border-white/5 glass-panel relative group shadow-[0_15px_60px_rgba(0,0,0,0.6)]">
            <div 
              className="flex transition-transform duration-500 ease-out h-full"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              {peligros.map((peligro, idx) => (
                <div key={idx} className="w-full shrink-0 flex flex-col md:flex-row items-stretch min-h-[440px] md:min-h-[480px]">
                  <div className="w-full md:w-1/2 relative h-48 sm:h-64 md:h-auto overflow-hidden bg-black/40 border-b md:border-b-0 md:border-r border-white/5">
                    <img 
                      src={peligro.imagen.startsWith('http') || peligro.imagen.startsWith('data:') ? peligro.imagen : `${import.meta.env.BASE_URL.replace(/\/$/, "")}${peligro.imagen}`} 
                      alt={peligro.titulo} 
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" 
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#0a0d14] via-transparent to-transparent md:via-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0a0d14]/50 via-transparent to-transparent pointer-events-none"></div>
                    
                    <span className="absolute top-6 left-6 text-[10px] uppercase font-black tracking-widest bg-red-950/80 border border-red-500/30 backdrop-blur-md px-3.5 py-2 rounded-full text-red-400 shadow-lg select-none">
                      {peligro.tag}
                    </span>
                  </div>

                  <div className="w-full md:w-1/2 p-5 sm:p-8 md:p-12 flex flex-col justify-between bg-[#0a0d14]/95">
                    <div className="space-y-4 md:space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center border border-red-500/20 shrink-0">
                          {peligro.icon}
                        </div>
                        <h3 className="font-bold text-lg sm:text-xl md:text-2xl text-white font-display leading-tight text-left">
                          {peligro.titulo}
                        </h3>
                      </div>
                      
                      <p className="text-gray-300 text-xs sm:text-sm leading-relaxed text-left font-sans font-normal tracking-wide">
                        {peligro.descripcion}
                      </p>
                    </div>

                    <div className="mt-6 md:mt-8 pt-4 md:pt-5 border-t border-white/5 flex items-start gap-2.5 text-[#4ade80] text-[11px] sm:text-xs leading-relaxed text-left font-semibold font-sans">
                      <div className="p-0.5 rounded-full bg-[#09d261]/10 border border-[#09d261]/20 text-[#09d261] shrink-0 mt-0.5">
                        <svg className="w-3.5 h-3.5 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <span className="text-[#4ade80] font-black uppercase tracking-wider text-[9px] block mb-1 font-display">Garantía de Compra Segura</span>
                        {peligro.solucion}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center gap-6 mt-8">
            <button
              onClick={prevSlide}
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-red-500/10 hover:border-red-500/30 transition-all duration-200 active:scale-95 focus:outline-none cursor-pointer"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-5 h-5 text-red-400" />
            </button>

            <div className="flex justify-center gap-2">
              {peligros.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2 rounded-full transition-all duration-300 focus:outline-none cursor-pointer ${
                    currentSlide === idx ? 'w-8 bg-red-500' : 'w-2 bg-white/20 hover:bg-white/40'
                  }`}
                  aria-label={`Ir al peligro ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-red-500/10 hover:border-red-500/30 transition-all duration-200 active:scale-95 focus:outline-none cursor-pointer"
              aria-label="Siguiente"
            >
              <ChevronRight className="w-5 h-5 text-red-400" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. PROTOCOLO DE SEGURIDAD (STEPPER) */}
      <section className="container mx-auto px-6 pb-12 relative z-10 pt-10">
        <div className="max-w-4xl mx-auto text-center mb-16 reveal-on-scroll">
          <span className="text-xs uppercase text-nexus-purple font-bold tracking-widest bg-nexus-purple/10 px-3 py-1 rounded-full border border-nexus-purple/20">PROTOCOLO DE SEGURIDAD</span>
          <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight mt-4 font-display">
            Nuestro Protocolo de Verificación de 3 Niveles
          </h2>
          <p className="text-gray-200 max-w-2xl mx-auto text-sm md:text-base mt-4 leading-relaxed font-sans">
            No dejamos nada al azar. Cada inmueble y lote listado en Nexus Domo 360° atraviesa un riguroso proceso de tres filtros independientes liderados por nuestro Abogado Inmobiliario antes de ser publicado.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* VISTA DE ESCRITORIO */}
          <div className="hidden md:flex gap-8 lg:gap-12 items-stretch min-h-[520px]">
            {(() => {
              const stepToShow = activeStep === -1 ? 0 : activeStep;
              return (
                <>
                  <div className="w-[40%] flex flex-col justify-between relative py-4">
                    <div className="absolute left-12 top-12 bottom-12 w-0.5 bg-white/10 z-0">
                      <div 
                        className="w-full bg-gradient-to-b from-nexus-accent via-nexus-purple to-indigo-400 transition-all duration-500 rounded-full"
                        style={{ 
                          height: `${(stepToShow / (pasos.length - 1)) * 100}%`,
                          boxShadow: '0 0 10px rgba(6, 182, 212, 0.5)'
                        }}
                      />
                    </div>

                    {pasos.map((paso, idx) => (
                      <button
                        key={paso.id}
                        onClick={() => setActiveStep(idx)}
                        className={`w-full flex items-center gap-6 p-6 rounded-2xl border text-left transition-all duration-300 relative z-10 focus:outline-none cursor-pointer ${
                          stepToShow === idx 
                            ? `glass-panel ${paso.borderColor} ${paso.glowColor} bg-[#0a0d14]/70` 
                            : 'border-transparent hover:bg-white/[0.02] bg-transparent'
                        }`}
                      >
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center font-display text-xl font-black shrink-0 border transition-all duration-300 ${
                          stepToShow === idx 
                            ? `${paso.bgColor} ${paso.color} ${paso.borderColor}` 
                            : 'bg-white/5 border-white/5 text-gray-500'
                        }`}>
                          {paso.numero}
                        </div>

                        <div className="space-y-1">
                          <span className={`text-[10px] uppercase font-black tracking-wider transition-colors duration-300 ${
                            stepToShow === idx ? paso.color : 'text-gray-500'
                          }`}>
                            Nivel {paso.numero}
                          </span>
                          <h3 className={`font-bold text-base lg:text-lg font-display transition-colors duration-300 ${
                            stepToShow === idx ? 'text-white' : 'text-gray-400 hover:text-gray-300'
                          }`}>
                            {paso.titulo.split(': ')[1] || paso.titulo}
                          </h3>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="w-[60%] glass-panel border border-white/5 rounded-3xl overflow-hidden flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-[#0a0d14]/60">
                    <div className="w-full h-64 lg:h-72 relative overflow-hidden bg-black/30 border-b border-white/5">
                      {pasos.map((paso, idx) => (
                        <div 
                          key={paso.id}
                          className={`absolute inset-0 transition-all duration-500 ease-in-out ${
                            stepToShow === idx ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 pointer-events-none z-0'
                          }`}
                        >
                          <img 
                            src={`${import.meta.env.BASE_URL.replace(/\/$/, "")}${paso.imagen}`} 
                            alt={paso.titulo} 
                            className="w-full h-full object-cover" 
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0d14] via-[#0a0d14]/40 to-transparent"></div>
                          <span className={`absolute top-6 right-6 text-[9px] uppercase font-black tracking-widest px-3 py-1.5 rounded-full border backdrop-blur-md shadow-md ${paso.bgColor} ${paso.color} ${paso.borderColor}`}>
                            Filtro Activo
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="p-8 lg:p-10 flex-1 flex flex-col justify-between space-y-6">
                      <div className="space-y-4">
                        <h3 className="font-bold text-xl lg:text-2xl font-display text-white transition-colors duration-300">
                          {pasos[stepToShow].titulo}
                        </h3>
                        <p className="text-gray-300 text-xs lg:text-sm leading-relaxed font-sans font-normal">
                          {pasos[stepToShow].descripcion}
                        </p>
                      </div>

                      <div className="border-t border-white/5 pt-6">
                        <span className="text-[10px] uppercase font-black tracking-widest text-gray-500 block mb-3.5 font-display">Tareas de Auditoría Legal y Técnica</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          {pasos[stepToShow].puntos.map((punto, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-[11px] lg:text-xs text-gray-300 font-sans leading-relaxed">
                              <div className={`p-0.5 rounded-full mt-0.5 shrink-0 border ${pasos[stepToShow].bgColor} ${pasos[stepToShow].color} ${pasos[stepToShow].borderColor}`}>
                                <svg className="w-3 h-3 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                              <span>{punto}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>

          {/* VISTA MÓVIL */}
          <div className="flex md:hidden flex-col gap-4">
            {pasos.map((paso, idx) => {
              const isOpen = activeStep === idx;
              return (
                <div 
                  key={paso.id} 
                  id={`acordeon-nivel-${idx}`}
                  className={`glass-panel border rounded-2xl overflow-hidden transition-all duration-300 scroll-mt-24 ${
                    isOpen ? `${paso.borderColor} ${paso.glowColor} bg-[#0a0d14]/80` : 'border-white/5 bg-[#0a0d14]/40'
                  }`}
                >
                  <button
                    onClick={() => setActiveStep(isOpen ? -1 : idx)}
                    className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left focus:outline-none cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-11 h-11 rounded-lg flex items-center justify-center font-display text-sm font-black shrink-0 border transition-all duration-300 ${
                        isOpen 
                          ? `${paso.bgColor} ${paso.color} ${paso.borderColor}` 
                          : 'bg-white/5 border-white/5 text-gray-500'
                      }`}>
                        {paso.numero}
                      </div>
                      
                      <div>
                        <span className={`text-[9px] uppercase font-bold tracking-widest block ${
                          isOpen ? paso.color : 'text-gray-500'
                        }`}>
                          Nivel {paso.numero}
                        </span>
                        <h3 className="font-bold text-sm sm:text-base font-display text-white leading-tight">
                          {paso.titulo.split(': ')[1] || paso.titulo}
                        </h3>
                      </div>
                    </div>

                    <div className={`w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-white' : 'rotate-0 text-gray-500'
                    }`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  <div 
                    className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
                      isOpen 
                        ? 'grid-rows-[1fr] opacity-100 border-t border-white/5' 
                        : 'grid-rows-[0fr] opacity-0 pointer-events-none'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="w-full h-44 relative bg-black/30 overflow-hidden">
                        <img 
                          src={`${import.meta.env.BASE_URL.replace(/\/$/, "")}${paso.imagen}`} 
                          alt={paso.titulo} 
                          className="w-full h-full object-cover" 
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0d14] via-[#0a0d14]/40 to-transparent"></div>
                      </div>

                      <div className="p-5 space-y-5">
                        <p className="text-gray-300 text-xs leading-relaxed font-sans">
                          {paso.descripcion}
                        </p>

                        <div className="border-t border-white/5 pt-4">
                          <span className="text-[9px] uppercase font-black tracking-widest text-gray-500 block mb-3 font-display">Tareas de Auditoría Legal y Técnica</span>
                          <div className="flex flex-col gap-3">
                            {paso.puntos.map((punto, pIdx) => (
                              <div key={pIdx} className="flex items-start gap-2.5 text-[11px] text-gray-300 font-sans leading-relaxed">
                                <div className={`p-0.5 rounded-full mt-0.5 shrink-0 border ${paso.bgColor} ${paso.color} ${paso.borderColor}`}>
                                  <svg className="w-2.5 h-2.5 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                                <span>{punto}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. ASESORÍA Y SANEAMIENTO CON NUESTRO ABOGADO INMOBILIARIO */}
      <section className="container mx-auto px-6 pb-20 relative z-10">
        <div className="max-w-5xl mx-auto glass-panel border-white/5 rounded-3xl p-6 md:p-8 bg-[#0a0d16]/40 backdrop-blur-md flex flex-col md:flex-row gap-8 items-center text-left">
          
          {/* Tarjeta Física de Contacto del Abogado */}
          <div className="w-full md:w-[380px] shrink-0 bg-[#0c0f1d]/90 border border-white/10 rounded-3xl p-8 flex flex-col items-center text-center shadow-[0_15px_30px_rgba(0,0,0,0.5)]">
            <div className="relative group mb-6">
              {/* Efecto glow emerald alrededor de la imagen */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-2xl blur-[15px] opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
              <img
                src={`${import.meta.env.BASE_URL.replace(/\/$/, "")}/abogado_thumb.png`}
                alt="Dr. Carlos Ramirez - Abogado Especialista Inmobiliario"
                className="w-40 h-40 md:w-48 md:h-48 rounded-2xl object-cover border-2 border-white/10 relative z-10 bg-[#070a13] shadow-[0_8px_20px_rgba(0,0,0,0.4)]"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80";
                }}
              />
            </div>
            
            <h4 className="text-white font-bold text-lg md:text-xl font-display">Dr. Carlos Ramirez</h4>
            <p className="text-emerald-400 text-[10px] md:text-xs font-semibold uppercase tracking-widest mt-1.5 opacity-90">
              Abogado Especialista Inmobiliario
            </p>
            
            <div className="w-full border-t border-white/5 my-4"></div>
            
            <a
              href="https://wa.me/51951300535?text=Hola%20Dr.%20Carlos%20Ramirez%2C%20deseo%20agendar%20una%20asesor%C3%ADa%20gratuita%20sobre%20el%20estado%20legal%20de%20una%20propiedad%20para%20comprar%2Fvender%20de%20forma%20segura."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center bg-[#25D366] hover:bg-[#20ba5a] text-black py-3 px-4 rounded-xl font-bold uppercase tracking-wider text-[11px] transition-all duration-200 active:scale-95 shadow-[0_0_15px_rgba(37,211,102,0.2)] gap-2 font-display cursor-pointer"
            >
              <svg className="w-4.5 h-4.5 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.003 5.156 5.158 0 11.516 0c3.08.001 5.976 1.2 8.154 3.379 2.179 2.18 3.377 5.078 3.377 8.16-.003 6.36-5.159 11.516-11.516 11.516-1.996-.001-3.957-.521-5.69-1.513L0 24zm6.59-4.846c1.6.95 3.197 1.45 4.917 1.451 5.438 0 9.864-4.426 9.867-9.864.001-2.63-1.023-5.105-2.883-6.967C16.689 1.912 14.213.887 11.59.887c-5.44 0-9.866 4.426-9.869 9.866-.001 1.782.47 3.522 1.365 5.066l-.993 3.626 3.71-.973zm12.355-6.726c-.346-.173-2.046-1.01-2.362-1.124-.316-.115-.547-.173-.778.173-.23.346-.893 1.124-1.094 1.355-.2.23-.4.26-.746.086-1.393-.696-2.302-1.218-3.123-2.624-.22-.376.22-.35.63-1.162.068-.136.034-.256-.017-.359-.05-.103-.43-1.036-.59-1.422-.155-.373-.325-.32-.475-.328-.123-.007-.264-.009-.406-.009-.142 0-.373.053-.568.267-.194.214-.742.726-.742 1.77 0 1.044.759 2.052.864 2.193.106.14 1.494 2.28 3.618 3.196.505.218.9.348 1.21.446.508.162.97.139 1.336.085.407-.06 1.246-.51 1.421-.998.175-.488.175-.905.123-.998-.052-.093-.19-.14-.537-.313z"/>
              </svg>
              Agendar Asesoría WhatsApp
            </a>
          </div>

          {/* Información de Respaldo Legal y Beneficios */}
          <div className="flex-1 space-y-6">
            <div className="space-y-4">
              <span className="text-[10px] uppercase font-black tracking-widest text-[#4ade80] bg-[#4ade80]/10 px-3.5 py-1.5 rounded-full border border-[#4ade80]/20 inline-block font-display">
                SANEAMIENTO Y RESPALDO LEGAL BILATERAL
              </span>
              
              <h3 className="text-2xl md:text-3xl font-bold text-white font-display leading-tight">
                Protección Jurídica para Comprador y Vendedor
              </h3>
              
              <p className="text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed font-sans font-normal">
                La seguridad jurídica no debe beneficiar solo a una de las partes. El <strong>Dr. Carlos Ramirez</strong> se encarga de analizar los expedientes registrales y sanear la documentación correspondiente de forma neutral. Esto garantiza que el comprador reciba una propiedad limpia de deudas o gravámenes y que el vendedor reciba su pago de manera oportuna, transparente y bajo el amparo de la ley, sin que nadie resulte perjudicado.
              </p>
            </div>

            {/* Listado de Beneficios Clave */}
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-300 pt-2 border-t border-white/5 font-sans">
              <li className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>Estudio exhaustivo de Copia Literal en SUNARP</span>
              </li>
              <li className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>Filtro de hipotecas, embargos y gravámenes</span>
              </li>
              <li className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>Redacción preventiva de minutas y contratos</span>
              </li>
              <li className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>Acompañamiento legal completo en Notaría</span>
              </li>
            </ul>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2 font-display">
              <Link
                to="/"
                className="inline-flex items-center justify-center border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-white px-8 py-3.5 rounded-full font-bold uppercase tracking-wider text-xs transition-all duration-200 active:scale-95 w-full sm:w-auto"
              >
                Ver Propiedades Aptas
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* 5. SECCIÓN DE PREGUNTAS FRECUENTES (FAQs) */}
      <section className="container mx-auto px-6 pb-16 relative z-10 pt-10">
        <div className="max-w-4xl mx-auto text-center mb-16 reveal-on-scroll">
          <span className="text-xs uppercase text-nexus-purple font-bold tracking-widest bg-nexus-purple/10 px-3 py-1 rounded-full border border-nexus-purple/20">INVERSIONISTAS INFORMADOS</span>
          <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight mt-4 font-display">
            Preguntas Frecuentes
          </h2>
          <p className="text-gray-200 max-w-2xl mx-auto text-sm md:text-base mt-4 leading-relaxed font-sans">
            Resolvemos tus dudas legales, técnicas y procedimentales para que compres tu próximo lote con total seguridad.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className="glass-panel border-white/5 rounded-2xl overflow-hidden transition-colors duration-200"
            >
              <h3>
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-6 py-5 text-left flex justify-between items-center gap-4 hover:bg-white/[0.02] transition-colors focus:outline-none"
                >
                  <span className="font-bold text-sm md:text-base text-white font-display leading-snug">
                    {faq.question}
                  </span>
                  <ChevronDown 
                    className={`w-5 h-5 text-nexus-accent transition-transform duration-300 shrink-0 ${
                      openFaq === idx ? 'rotate-180' : 'rotate-0'
                    }`} 
                  />
                </button>
              </h3>
              
              <div 
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  openFaq === idx ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 pb-6 pt-2 text-gray-400 text-xs md:text-sm leading-relaxed border-t border-white/5 font-sans">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Marcado de Datos Estructurados JSON-LD para Google FAQ Rich Snippets */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map((faq) => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
              }
            }))
          })}
        </script>
      </section>

      {/* 6. CTA FINAL */}
      <section className="container mx-auto px-6 pb-24">
        <div className="max-w-4xl mx-auto glass-panel border-nexus-purple/20 rounded-3xl p-10 md:p-16 text-center relative overflow-hidden reveal-on-scroll">
          <div className="absolute top-0 right-0 w-80 h-80 bg-nexus-purple opacity-[0.03] rounded-full blur-[80px]"></div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 font-display">
            ¿Deseas comprar tu lote de forma 100% segura?
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base mb-10 leading-relaxed font-sans">
            Agenda una llamada de asesoría gratuita con nuestro Abogado Inmobiliario. Revisamos tu caso y te asesoramos sobre el estado legal y los planos antes de firmar cualquier minuta.
          </p>
          <a 
            href="https://wa.me/51951300535?text=Hola%20Nexus%2C%20deseo%20agendar%20una%20asesor%C3%ADa%20gratuita%20con%20el%20abogado%20inmobiliario%20para%20comprar%20de%20forma%20segura."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center btn-neon-purple px-8 py-3.5 rounded-full font-bold transition-all duration-200 active:scale-95 group uppercase tracking-wider text-xs md:text-sm font-sans w-full sm:w-auto"
          >
            Agendar Asesoría Legal Gratuita
            <ArrowRight className="w-4.5 h-4.5 ml-2 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </section>
    </div>
  );
}
