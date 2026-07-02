import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Lock, 
  Scale,
  Search,
  AlertTriangle,
  FileCheck,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Gavel,
  Check,
  UserCheck,
  HelpCircle
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
    document.title = "Compra Seguro con Garantía Legal | Nexus Domo 360°";
    window.scrollTo(0, 0);
  }, []);

  const peligros = [
    {
      id: 1,
      titulo: "1. Tráfico de tierras y dobles ventas",
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
      titulo: "3. Linderos y medidas falsas en campo",
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
      answer: "El único documento legal que garantiza la propiedad absoluta es la Copia Literal o la Partida Registral emitida por la SUNARP. En ella se detalla el historial de dueños, las dimensiones exactas y si cuenta con embargos, hipotecas o juicios pendientes. Comprar solo con 'minuta de posesión' o documentos comunales representa un riesgo extremo de doble venta. En Nexus Domo 360, realizamos este estudio legal de forma obligatoria y gratuita antes de publicar."
    },
    {
      question: "¿Qué peligro real corro al comprar un lote en Juliaca que solo cuenta con minuta o constancia de posesión?",
      answer: "La constancia de posesión o la minuta de compraventa sin inscripción registral no acreditan propiedad ante la ley peruana; solo certifican quién ocupa físicamente el suelo. Estafadores suelen vender un mismo lote a varias personas usando minutas firmadas en notaría, pero sin valor en Registros Públicos. Si compras un terreno sin título en la SUNARP, podrías perder toda tu inversión. En nuestro portal solo listamos propiedades con Partida Registral independizada."
    },
    {
      question: "¿Por qué el servicio de asesoría y topografía de Nexus Domo es 100% gratuito para mí como comprador?",
      answer: "Así es. Como comprador, no nos pagas absolutamente nada por la búsqueda, el estudio de títulos registrales, la verificación topográfica con dron ni el acompañamiento legal en notaría del Abogado Inmobiliario. Nuestros honorarios de corretaje son cubiertos en su totalidad por el propietario vendedor o la constructora del proyecto inmobiliario. Tu único gasto será el precio real del inmueble y las tasas notariales de ley."
    },
    {
      question: "¿Qué pasa si me interesa un lote en una nueva habilitación urbana que aún no tiene agua ni luz?",
      answer: "Auditamos los expedientes técnicos municipales y las resoluciones de habilitación urbana. Verificamos que la empresa desarrolladora tenga firmados los plazos obligatorios de entrega de redes de agua, desagüe, luz y pistas en el contrato de compraventa, asegurando que tu lote adquiera alta plusvalía legalmente."
    },
    {
      question: "¿Cómo es el proceso de firma y pago seguro para comprar un terreno verificado con ustedes?",
      answer: "Para tu total seguridad, todo pago importante (cuota inicial o saldo total) se realiza mediante un cheque de gerencia no negociable o transferencia bancaria directa a nombre del titular registral de la SUNARP, nunca a terceros. La firma de la Escritura Pública se realiza exclusivamente de forma física dentro de una Notaría Pública autorizada, guiándote de la mano de nuestro Abogado Inmobiliario."
    }
  ];

  const [activeStep, setActiveStep] = useState(0);
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

      const element = document.getElementById(`acordeon-nivel-${activeStep}`);
      if (element) {
        const yOffset = -96;
        let y = element.getBoundingClientRect().top + window.scrollY + yOffset;

        if (prevActiveStep !== -1 && prevActiveStep < activeStep) {
          const prevElement = document.getElementById(`acordeon-nivel-${prevActiveStep}`);
          if (prevElement) {
            const panel = prevElement.children[1];
            if (panel) {
              const panelHeight = panel.scrollHeight;
              y -= panelHeight;
            }
          }
        }
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    } else {
      prevActiveStepRef.current = activeStep;
    }
  }, [activeStep]);

  const pasos = [
    {
      id: 0,
      numero: "01",
      titulo: "Filtro 1: Legal Registral (SUNARP)",
      descripcion: "Validamos que cada propiedad cuente con una partida registral activa y título de propiedad inscrito en SUNARP. Extraemos y analizamos la Copia Literal completa para certificar que esté libre de gravámenes, hipotecas, cargas técnicas, demandas activas o litigios familiares de herencias (sucesión intestada).",
      color: "text-[#00f2fe]",
      bgColor: "bg-[#00f2fe]/10",
      borderColor: "border-[#00f2fe]/20",
      glowColor: "shadow-[0_0_15px_rgba(0,242,254,0.15)]",
      imagen: "/filtro_sunarp_juliaca.png",
      puntos: [
        "Estudio integral de Partida Registral y Copia Literal",
        "Verificación de gravámenes, hipotecas y embargos activos",
        "Estudio de tracto sucesivo y antecedentes de transferencia",
        "Certificación de firmas limpias ante Notaría Pública"
      ]
    },
    {
      id: 1,
      numero: "02",
      titulo: "Filtro 2: Municipal y Tributario (Técnico)",
      descripcion: "Verificamos que los impuestos prediales autovalúo (Hoja de Resumen HR y Predio Urbano PU) estén pagados al día ante la municipalidad correspondiente. Corroboramos la inexistencia de multas administrativas de construcción, linderos proyectados de habilitación urbana y la plena compatibilidad de zonificación del predio.",
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
      descripcion: "Acudimos físicamente al terreno para realizar un levantamiento topográfico visual mediante vuelos con dron. Verificamos que las colindancias, medidas perimétricas y linderos coincidan con total precisión matemática con el plano archivado en la SUNARP y comprobamos los servicios básicos in situ.",
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
    <div className="animate-fade-in font-sans pb-16">
      {/* 1. HERO SECTION */}
      <section className="container mx-auto px-6 pt-28 pb-16 relative z-10 text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-gradient-to-r from-nexus-accent/10 to-nexus-purple/10 rounded-full blur-[80px] pointer-events-none z-0"></div>
        
        <span className="text-xs uppercase text-nexus-accent font-black tracking-widest bg-nexus-accent/10 px-3.5 py-1.5 rounded-full border border-nexus-accent/20 relative z-10 inline-block shadow-[0_2px_10px_rgba(6,182,212,0.15)]">
          CERO RIESGOS DE ESTAFAS
        </span>
        
        <h1 className="text-4xl md:text-6xl font-extrabold text-white mt-5 mb-6 leading-[1.15] max-w-4xl mx-auto relative z-10 font-display">
          Compra tu lote o casa en el Sur del Perú con absoluta <br /> <span className="text-gradient-rise">Garantía Legal</span>
        </h1>
        
        <p className="text-gray-300 max-w-3xl mx-auto text-sm md:text-base mb-10 leading-relaxed relative z-10 font-sans">
          Nuestro Abogado Inmobiliario audita y sanea los títulos de cada propiedad para que tu inversión esté 100% protegida de litigios o dobles ventas. Compra con total transparencia y seguridad jurídica en Juliaca, Puno y todo el Sur del Perú.
        </p>

        <div className="flex justify-center relative z-10">
          <Link
            to="/"
            className="inline-flex items-center justify-center btn-neon-cian px-8 py-4 rounded-full font-bold uppercase tracking-wider text-xs md:text-sm transition-all duration-200 active:scale-95 group font-display"
          >
            <Search className="w-4.5 h-4.5 mr-2" />
            Explorar Catálogo Seguro
            <ArrowRight className="w-4.5 h-4.5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* 2. PRESENTACIÓN DEL ABOGADO INMOBILIARIO */}
      <section className="container mx-auto px-6 py-12 relative z-10 border-t border-white/5">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Ilustración / Foto de perfil del Abogado */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative group w-72 h-72 sm:w-80 sm:h-80 rounded-3xl overflow-hidden border border-[#00f2fe]/20 shadow-[0_0_30px_rgba(0,242,254,0.05)] bg-[#070a13]">
              <img 
                src={`${import.meta.env.BASE_URL.replace(/\/$/, "")}/tour/abogado_thumb.png`} 
                alt="Abogado Inmobiliario Especialista"
                className="w-full h-full object-cover transition-all duration-500"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0d14] via-transparent to-transparent"></div>
              
              <div className="absolute bottom-5 left-5 right-5 text-left">
                <span className="text-[9px] uppercase font-black tracking-widest text-[#00f2fe] bg-[#00f2fe]/10 border border-[#00f2fe]/20 px-2 py-1 rounded">
                  Área Legal
                </span>
                <h4 className="text-white text-base font-bold font-display mt-2">Dr. Roger Apaza</h4>
                <p className="text-gray-400 text-xs font-sans">Abogado Especialista Inmobiliario</p>
              </div>
            </div>
          </div>

          {/* Texto de la propuesta de valor legal */}
          <div className="lg:col-span-7 text-left space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300 font-medium font-display">
              <Gavel className="w-3.5 h-3.5 text-nexus-accent" />
              <span>Soporte Legal Bilateral</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-extrabold text-white leading-tight font-display">
              Asesoría que protege tanto al comprador como al vendedor
            </h2>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed font-sans font-normal">
              Creemos en transacciones transparentes y justas. Nuestro Abogado Inmobiliario no solo se encarga de corroborar que los documentos del predio estén en regla, sino que acompaña activamente a ambas partes para redactar contratos limpios y seguros, organizar los cheques de gerencia y registrar formalmente la Escritura Pública ante notario.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3 text-[#e4e7ec] text-xs sm:text-sm">
                <div className="p-0.5 rounded-full bg-[#09d261]/10 border border-[#09d261]/20 text-[#09d261] shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <div>
                  <h5 className="font-bold text-white font-display">Saneamiento Preventivo</h5>
                  <p className="text-gray-400 text-xs sm:text-sm">Liberación de deudas, gravámenes e independizaciones.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-[#e4e7ec] text-xs sm:text-sm">
                <div className="p-0.5 rounded-full bg-[#09d261]/10 border border-[#09d261]/20 text-[#09d261] shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <div>
                  <h5 className="font-bold text-white font-display">Inscripción Registral</h5>
                  <p className="text-gray-400 text-xs sm:text-sm">Contratos e inscripciones en SUNARP bajo estricto rigor notarial.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. EL STEPPER INTERACTIVO (3 NIVELES DE FILTRO) */}
      <section className="container mx-auto px-6 py-12 relative z-10 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <span className="text-xs uppercase text-nexus-purple font-bold tracking-widest bg-nexus-purple/10 px-3 py-1 rounded-full border border-nexus-purple/20">Filtro de Seguridad</span>
          <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight mt-4 font-display">
            Nuestro Protocolo de Verificación de 3 Niveles
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto text-sm md:text-base mt-4 leading-relaxed font-sans">
            No dejamos nada a la improvisación. Cada lote o inmueble publicado atraviesa un riguroso proceso de tres filtros independientes antes de concretar su venta.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Contenedor Stepper Desktop */}
          <div className="hidden md:flex justify-between items-center gap-4 mb-12 relative">
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-white/5 z-0"></div>
            {pasos.map((paso) => (
              <button
                key={paso.id}
                onClick={() => setActiveStep(paso.id)}
                className={`relative z-10 flex flex-col items-center gap-3 w-1/3 p-4 rounded-2xl border transition-all duration-300 bg-[#070a13] cursor-pointer ${
                  activeStep === paso.id 
                    ? `border-[#00f2fe] shadow-[0_0_20px_rgba(0,242,254,0.15)] scale-[1.02]` 
                    : 'border-white/5 hover:border-white/10'
                }`}
              >
                <span className={`text-2xl font-black font-display ${activeStep === paso.id ? 'text-[#00f2fe]' : 'text-gray-500'}`}>
                  {paso.numero}
                </span>
                <span className={`text-xs font-bold font-display uppercase tracking-wider ${activeStep === paso.id ? 'text-white' : 'text-gray-400'}`}>
                  {paso.titulo}
                </span>
              </button>
            ))}
          </div>

          {/* Panel Informativo del Filtro Activo */}
          <div className="glass-panel border-white/5 rounded-3xl p-6 sm:p-10 bg-[#0a0d16]/70 backdrop-blur-md">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Imagen del Filtro */}
              <div className="lg:col-span-5 h-48 sm:h-64 lg:h-[320px] rounded-2xl overflow-hidden border border-white/10 relative bg-black/40">
                <img 
                  src={`${import.meta.env.BASE_URL.replace(/\/$/, "")}${pasos[activeStep].imagen}`} 
                  alt={pasos[activeStep].titulo}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0d14] via-transparent to-transparent"></div>
              </div>

              {/* Contenido del Filtro */}
              <div className="lg:col-span-7 text-left space-y-6">
                <span className={`px-3 py-1 rounded-md text-[9px] font-black tracking-widest uppercase border inline-block ${pasos[activeStep].bgColor} ${pasos[activeStep].borderColor} ${pasos[activeStep].color}`}>
                  Nivel de Verificación {pasos[activeStep].numero}
                </span>
                
                <h3 className="text-white text-xl sm:text-2xl md:text-3xl font-extrabold font-display leading-tight">
                  {pasos[activeStep].titulo}
                </h3>
                
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed font-sans font-normal">
                  {pasos[activeStep].descripcion}
                </p>

                <div className="pt-2 border-t border-white/5">
                  <h4 className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-3">Qué evaluamos</h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {pasos[activeStep].puntos.map((punto, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-[#e4e7ec] text-xs font-sans font-medium">
                        <div className="p-0.5 rounded-full bg-[#00f2fe]/10 border border-[#00f2fe]/20 text-[#00f2fe] shrink-0 mt-0.5">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                        <span>{punto}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. COMPRAR SIN SORPRESAS (RIESGOS EVITADOS) */}
      <section className="container mx-auto px-6 py-12 relative z-10 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <span className="text-xs uppercase text-red-400 font-bold tracking-widest bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">Comprar Sin Sorpresas</span>
          <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight mt-4 font-display">
            Riesgos que evitamos activamente para ti
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto text-sm md:text-base mt-4 leading-relaxed font-sans">
            Comprar un lote o casa de manera informal puede arruinar tus ahorros de años. Te protegemos de los fraudes más comunes en el Altiplano.
          </p>
        </div>

        <div className="max-w-5xl mx-auto relative px-0 md:px-6">
          <div className="overflow-hidden rounded-3xl border border-white/5 glass-panel relative group shadow-[0_15px_60px_rgba(0,0,0,0.6)] bg-[#0a0d16]/70 backdrop-blur-md">
            <div 
              className="flex transition-transform duration-500 ease-out h-full"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              {peligros.map((peligro, idx) => (
                <div key={idx} className="w-full shrink-0 flex flex-col md:flex-row items-stretch min-h-[440px] md:min-h-[480px]">
                  {/* Foto del Peligro */}
                  <div className="w-full md:w-1/2 relative h-48 sm:h-64 md:h-auto overflow-hidden bg-black/40 border-b md:border-b-0 md:border-r border-white/5">
                    <img 
                      src={`${import.meta.env.BASE_URL.replace(/\/$/, "")}${peligro.imagen}`} 
                      alt={peligro.titulo} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#0a0d14] via-transparent to-transparent"></div>
                    <span className="absolute top-6 left-6 text-[10px] uppercase font-black tracking-widest bg-red-950/80 border border-red-500/30 backdrop-blur-md px-3.5 py-2 rounded-full text-red-400 shadow-lg">
                      {peligro.tag}
                    </span>
                  </div>

                  {/* Detalle */}
                  <div className="w-full md:w-1/2 p-5 sm:p-8 md:p-12 flex flex-col justify-between bg-[#0a0d14]/70 backdrop-blur-md text-left">
                    <div className="space-y-4 md:space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center border border-red-500/20 shrink-0">
                          {peligro.icon}
                        </div>
                        <h3 className="font-bold text-lg sm:text-xl md:text-2xl text-white font-display leading-tight">
                          {peligro.titulo}
                        </h3>
                      </div>
                      <p className="text-gray-300 text-sm sm:text-base leading-relaxed font-sans font-normal">
                        {peligro.descripcion}
                      </p>
                    </div>

                    <div className="mt-6 md:mt-8 pt-4 md:pt-5 border-t border-white/5 flex items-start gap-2.5 text-[#4ade80] text-[11px] sm:text-xs leading-relaxed font-semibold font-sans">
                      <div className="p-0.5 rounded-full bg-[#09d261]/10 border border-[#09d261]/20 text-[#09d261] shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <div>
                        <span className="text-[#4ade80] font-black uppercase tracking-wider text-[9px] block mb-1 font-display">Garantía Nexus Domo 360</span>
                        {peligro.solucion}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Controles de Slide */}
          <div className="flex items-center justify-center gap-6 mt-8">
            <button
              onClick={prevSlide}
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-red-500/10 hover:border-red-500/30 transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 text-red-400" />
            </button>
            <div className="flex justify-center gap-2">
              {peligros.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    currentSlide === idx ? 'w-8 bg-red-500' : 'w-2 bg-white/20 hover:bg-white/45'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={nextSlide}
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-red-500/10 hover:border-red-500/30 transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <ChevronRight className="w-5 h-5 text-red-400" />
            </button>
          </div>
        </div>
      </section>

      {/* 5. CTA DE CONVERSIÓN LEGAL (WhatsApp) */}
      <section className="container mx-auto px-6 py-12 relative z-10 border-t border-white/5">
        <div className="max-w-4xl mx-auto glass-panel border-[#09d261]/20 bg-gradient-to-r from-[#070b14] to-[#051c0f]/40 p-8 sm:p-12 rounded-3xl text-center shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <span className="text-xs uppercase text-[#09d261] font-black tracking-widest bg-[#09d261]/10 px-3.5 py-1.5 rounded-full border border-[#09d261]/20 inline-block mb-6">
            CONSULTORÍA 100% GRATUITA
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight font-display mb-4">
            ¿Quieres auditar una propiedad antes de comprarla?
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto text-sm sm:text-base font-sans mb-8 leading-relaxed">
            Agenda una llamada privada con nuestro Abogado Inmobiliario. Te ayudamos a revisar partidas de SUNARP o minutas municipales de posesión a costo cero y sin ningún compromiso.
          </p>

          <div className="flex justify-center">
            <a
              href="https://wa.me/51951300535?text=Hola%20Nexus%2C%20me%20gustar%C3%ADa%20agendar%20una%20Asesor%C3%ADa%20Legal%20Gratuita%20con%20el%20Abogado%20Inmobiliario%20para%20comprar%20una%20propiedad."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center p-4 px-8 rounded-full bg-[#09d261] text-black font-black uppercase tracking-wider text-xs md:text-sm hover:bg-[#09d261]/90 shadow-[0_0_20px_rgba(9,210,97,0.3)] hover:shadow-[0_0_30px_rgba(9,210,97,0.5)] transition-all duration-300 active:scale-95 select-none font-display cursor-pointer"
            >
              <svg className="w-5 h-5 mr-2.5 fill-black" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.454 5.709 1.455h.008c6.56 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Agendar Asesoría Legal Gratuita
            </a>
          </div>
        </div>
      </section>

      {/* 6. FAQS SECTION */}
      <section className="container mx-auto px-6 py-12 relative z-10 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <HelpCircle className="w-8 h-8 text-nexus-accent mx-auto mb-4" />
          <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight font-display">
            Preguntas Frecuentes Legales
          </h2>
          <p className="text-gray-300 text-sm md:text-base mt-4 font-sans">
            Todo lo que necesitas saber sobre la seguridad en Registros Públicos y Notarías en el Altiplano.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-4 text-left">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="glass-panel border-white/5 rounded-2xl overflow-hidden bg-[#0a0d16]/70 backdrop-blur-md transition-all duration-300"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full flex items-center justify-between p-6 text-white text-sm sm:text-base font-bold text-left hover:bg-white/[0.02] transition cursor-pointer select-none font-display"
              >
                <span>{faq.question}</span>
                <ChevronDown className={`w-5 h-5 text-[#00f2fe] transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`} />
              </button>
              
              <div 
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  openFaq === index ? 'max-h-[300px] border-t border-white/5 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <p className="p-6 text-gray-300 text-xs sm:text-sm leading-relaxed font-sans font-normal tracking-wide">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
