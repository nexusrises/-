import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Check, 
  Gavel, 
  Camera, 
  Share2, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight,
  HelpCircle
} from 'lucide-react';

export default function VendePropiedad() {
  const [openFaq, setOpenFaq] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const soluciones = [
    {
      title: "1. Filtro y Saneamiento Legal",
      description: "Revisamos detalladamente los títulos, partidas registrales de la SUNARP y el autovalúo del predio. Saneamos preventivamente de la mano de nuestro Abogado Inmobiliario cualquier observación legal para evitar trabas y asegurar firmas rápidas en la notaría.",
      image: "/filtro_sunarp_juliaca.png",
      tag: "Fase 1: Seguridad jurídica",
      icon: <Gavel className="w-5 h-5" />,
      color: "text-[#00f2fe] bg-[#00f2fe]/10 border-[#00f2fe]/20"
    },
    {
      title: "2. Sesión Multimedia con Dron",
      description: "Nos trasladamos a tu predio para realizar vuelos de alta resolución con dron y capturar fotografías 360° panorámicas. Creamos un recorrido interactivo profesional que publicamos en nuestro catálogo y mostramos de forma digital.",
      image: "/vuelos_dron_preview.png",
      tag: "Fase 2: Producción visual premium",
      icon: <Camera className="w-5 h-5" />,
      color: "text-nexus-purple bg-nexus-purple/10 border-nexus-purple/20"
    },
    {
      title: "3. Campaña en Redes Sociales",
      description: "No publicamos anuncios aburridos. Diseñamos campañas pagadas de alto impacto y de forma cruzada en Facebook, Instagram y portales inmobiliarios clave, apuntando directo a inversionistas interesados con presupuesto en el altiplano.",
      image: "/ficha_web_preview.png",
      tag: "Fase 3: Marketing de alta conversión",
      icon: <Share2 className="w-5 h-5" />,
      color: "text-indigo-400 bg-indigo-400/10 border-indigo-400/20"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === soluciones.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? soluciones.length - 1 : prev - 1));
  };

  useEffect(() => {
    document.title = "Vende tu Propiedad más Rápido | Nexus Domo 360°";
    window.scrollTo(0, 0);
  }, []);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "¿Es verdad que la fotografía 360°, videos con dron y ficha web de mi propiedad son a costo cero?",
      answer: "Sí, es totalmente real. En Nexus Domo 360 asumimos el costo completo de la producción multimedia (videos con dron 4K, recorrido virtual interactivo 360° y su ficha web en el portal). No pagas nada por adelantado. Nosotros recuperamos esta inversión de marketing a través de la comisión estándar de corretaje únicamente si logramos vender tu propiedad con éxito. Si no se vende, no nos debes absolutamente nada."
    },
    {
      question: "¿Qué documentos necesito para comenzar a vender mi propiedad?",
      answer: "Requerimos principalmente la Copia Literal de la partida registral (SUNARP) actualizada, los formularios HR/PU del autovalúo municipal al día y copia del DNI de los propietarios. Si te falta algún documento o necesitas sanear herencias o independizaciones, nuestro Abogado Inmobiliario te asesora gratuitamente para poner los papeles en regla antes de firmar."
    },
    {
      question: "¿Cuánto tiempo dura el contrato de intermediación exclusiva?",
      answer: "El acuerdo de corretaje exclusivo se firma usualmente por un periodo de 3 a 6 meses. Este tiempo nos permite invertir nuestro presupuesto de publicidad en redes sociales, hacer la producción audiovisual y filtrar a los interesados calificados para coordinar sus visitas y créditos bancarios de forma eficiente."
    },
    {
      question: "¿Cómo calculan el precio sugerido de venta para mi inmueble?",
      answer: "Realizamos un Análisis Comparativo de Mercado (ACM) totalmente gratuito, comparando transacciones reales de inmuebles similares en tu zona de Juliaca o Puno. Esto nos permite establecer un precio competitivo de alta plusvalía para captar ofertas rápidas sin castigar tu patrimonio."
    },
    {
      question: "¿Cómo ayuda la tecnología 360° y los videos con dron a vender mi casa o terreno más rápido en Juliaca?",
      answer: "En el mercado inmobiliario de Juliaca y Puno, la mayoría de compradores busca desde otras regiones o tiene poco tiempo. Los recorridos virtuales 360° y los videos aéreos con dron permiten que los inversionistas exploren tu propiedad en detalle desde su celular, filtrando a los curiosos y atrayendo únicamente a compradores con intenciones serias de compra y presupuesto listo."
    }
  ];

  return (
    <div className="animate-fade-in font-sans pb-16">
      {/* 1. HERO SECTION */}
      <section className="container mx-auto px-6 pt-28 pb-16 relative z-10 text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-gradient-to-r from-nexus-accent/10 to-nexus-purple/10 rounded-full blur-[80px] pointer-events-none z-0"></div>
        
        <span className="text-xs uppercase text-nexus-accent font-black tracking-widest bg-nexus-accent/10 px-3.5 py-1.5 rounded-full border border-nexus-accent/20 relative z-10 inline-block shadow-[0_2px_10px_rgba(6,182,212,0.15)] font-display">
          TECNOLOGÍA PREMIUM A COSTO CERO PARA TI
        </span>
        
        <h1 className="text-4xl md:text-6xl font-extrabold text-white mt-5 mb-6 leading-[1.15] max-w-4xl mx-auto relative z-10 font-display">
          Vendemos tu propiedad más rápido con <span className="text-gradient-rise">Tecnología y Respaldo Legal</span>
        </h1>
        
        <p className="text-gray-300 max-w-3xl mx-auto text-base md:text-lg mb-10 leading-relaxed relative z-10 font-sans">
          Unimos el marketing digital inmersivo de última generación con el saneamiento documental preventivo de nuestro Abogado Inmobiliario. Captamos compradores reales y firmamos sin trabas notariales. Todo financiado por nosotros.
        </p>

        <div className="flex justify-center items-center gap-4 relative z-10">
          <Link
            to="/contacto"
            className="inline-flex items-center justify-center bg-[#25D366] hover:bg-[#20ba5a] text-black px-8 py-4 rounded-full font-bold uppercase tracking-wider text-xs md:text-sm transition-all duration-200 active:scale-95 shadow-[0_0_20px_rgba(37,211,102,0.25)] gap-2.5 font-display"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.003 5.156 5.158 0 11.516 0c3.08.001 5.976 1.2 8.154 3.379 2.179 2.18 3.377 5.078 3.377 8.16-.003 6.36-5.159 11.516-11.516 11.516-1.996-.001-3.957-.521-5.69-1.513L0 24zm6.59-4.846c1.6.95 3.197 1.45 4.917 1.451 5.438 0 9.864-4.426 9.867-9.864.001-2.63-1.023-5.105-2.883-6.967C16.689 1.912 14.213.887 11.59.887c-5.44 0-9.866 4.426-9.869 9.866-.001 1.782.47 3.522 1.365 5.066l-.993 3.626 3.71-.973zm12.355-6.726c-.346-.173-2.046-1.01-2.362-1.124-.316-.115-.547-.173-.778.173-.23.346-.893 1.124-1.094 1.355-.2.23-.4.26-.746.086-1.393-.696-2.302-1.218-3.123-2.624-.22-.376.22-.35.63-1.162.068-.136.034-.256-.017-.359-.05-.103-.43-1.036-.59-1.422-.155-.373-.325-.32-.475-.328-.123-.007-.264-.009-.406-.009-.142 0-.373.053-.568.267-.194.214-.742.726-.742 1.77 0 1.044.759 2.052.864 2.193.106.14 1.494 2.28 3.618 3.196.505.218.9.348 1.21.446.508.162.97.139 1.336.085.407-.06 1.246-.51 1.421-.998.175-.488.175-.905.123-.998-.052-.093-.19-.14-.537-.313z"/>
            </svg>
            Comenzar a Vender Ahora
          </Link>
        </div>
        
        <p className="text-[10px] sm:text-xs text-gray-400 mt-4 leading-relaxed font-sans italic">
          ¡Inicia tu registro online y agenda la producción con dron y fotos 360° gratis!
        </p>
      </section>

      {/* 2. EXPLICACIÓN DEL COMBO LEGAL-TECNOLÓGICO */}
      <section className="container mx-auto px-6 py-12 relative z-10 border-t border-white/5">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Pilar Tecnológico */}
          <div className="glass-panel border-[#00f2fe]/20 rounded-3xl p-8 bg-[#0a0d16]/60 backdrop-blur-md text-left space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#00f2fe]/10 border border-[#00f2fe]/20 flex items-center justify-center text-[#00f2fe]">
                <Camera className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white font-display">Pilar Tecnológico Premium</h3>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed font-sans">
                Llevamos tu propiedad al siguiente nivel visual. Realizamos tomas y videos aéreos con Dron en calidad 4K para ubicar accesos y entorno, capturamos panoramas 360° equirrectangulares para recorridos interactivos y diseñamos una ficha web dedicada de alta velocidad.
              </p>
            </div>
            <ul className="space-y-2.5 pt-4 border-t border-white/5">
              <li className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-300">
                <Check className="w-4 h-4 text-[#00f2fe] shrink-0" />
                <span>Recorridos interactivos 360° móviles</span>
              </li>
              <li className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-300">
                <Check className="w-4 h-4 text-[#00f2fe] shrink-0" />
                <span>Tomas y videos profesionales con Dron 4K</span>
              </li>
            </ul>
          </div>

          {/* Pilar Legal */}
          <div className="glass-panel border-nexus-purple/20 rounded-3xl p-8 bg-[#0a0d16]/60 backdrop-blur-md text-left space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-nexus-purple/10 border border-nexus-purple/20 flex items-center justify-center text-nexus-purple">
                <Gavel className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white font-display">Pilar de Respaldo Legal</h3>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed font-sans">
                El marketing no sirve si la venta se traba al firmar. Nuestro Abogado Inmobiliario audita de forma preventiva tu Copia Literal (SUNARP) y formularios municipales (PU/HR) para solucionar cualquier observación técnica o legal de manera rápida e impecable.
              </p>
            </div>
            <ul className="space-y-2.5 pt-4 border-t border-white/5">
              <li className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-300">
                <Check className="w-4 h-4 text-nexus-purple shrink-0" />
                <span>Saneamiento preventivo de títulos SUNARP</span>
              </li>
              <li className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-300">
                <Check className="w-4 h-4 text-nexus-purple shrink-0" />
                <span>Redacción de contratos de compraventa seguros</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 3. PROCESO EN 3 PASOS ("Saneamos, Grabamos y Vendemos") */}
      <section className="container mx-auto px-6 py-12 relative z-10 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <span className="text-xs uppercase text-nexus-purple font-bold tracking-widest bg-nexus-purple/10 px-3 py-1 rounded-full border border-nexus-purple/20">¿CÓMO TRABAJAMOS?</span>
          <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight mt-4 font-display">
            Saneamos, Grabamos y Vendemos
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto text-sm md:text-base mt-4 leading-relaxed font-sans">
            Un proceso ágil y transparente diseñado para maximizar el valor comercial de tu propiedad y acelerar la firma del contrato.
          </p>
        </div>

        <div className="max-w-5xl mx-auto relative px-0 md:px-6">
          <div className="overflow-hidden rounded-3xl border border-white/5 glass-panel relative group shadow-[0_15px_60px_rgba(0,0,0,0.6)] bg-[#0a0d16]/60 backdrop-blur-md">
            <div 
              className="flex transition-transform duration-500 ease-out h-full"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {soluciones.map((solucion, idx) => (
                <div key={idx} className="w-full shrink-0 flex flex-col md:flex-row items-stretch min-h-[440px] md:min-h-[480px]">
                  
                  {/* Foto de la etapa */}
                  <div className="w-full md:w-1/2 relative h-48 sm:h-64 md:h-auto overflow-hidden bg-black/40 border-b md:border-b-0 md:border-r border-white/5">
                    <img 
                      src={`${import.meta.env.BASE_URL.replace(/\/$/, "")}${solucion.image}`} 
                      alt={solucion.title} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=600&q=80";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#0a0d14] via-transparent to-transparent"></div>
                    <span className="absolute top-6 left-6 text-[10px] uppercase font-black tracking-widest bg-black/60 backdrop-blur-md px-3.5 py-2 rounded-full border border-white/10 text-white font-display">
                      {solucion.tag}
                    </span>
                  </div>

                  {/* Cuerpo */}
                  <div className="w-full md:w-1/2 p-6 sm:p-10 bg-[#0a0d14]/60 backdrop-blur-md flex flex-col justify-between text-left">
                    <div className="space-y-4 md:space-y-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${solucion.color} shrink-0`}>
                          {solucion.icon}
                        </div>
                        <h3 className="font-bold text-xl md:text-2xl text-white font-display">
                          {solucion.title}
                        </h3>
                      </div>
                      
                      <p className="text-gray-300 text-sm sm:text-base leading-relaxed font-sans font-normal">
                        {solucion.description}
                      </p>
                    </div>

                    <div className="mt-8 pt-5 border-t border-white/5 flex items-start gap-2.5 text-[#00f2fe] text-xs leading-relaxed font-semibold font-sans">
                      <div className="p-0.5 rounded-full bg-[#00f2fe]/10 border border-[#00f2fe]/20 text-[#00f2fe] shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <div>
                        <span className="text-[#00f2fe] font-black uppercase tracking-wider text-[9px] block mb-1 font-display">Compromiso Exclusivo</span>
                        Asumimos el 100% de la inversión de esta etapa sin cobros anticipados.
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
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-[#00f2fe]/10 hover:border-[#00f2fe]/30 transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex justify-center gap-2">
              {soluciones.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    currentSlide === idx ? 'w-8 bg-nexus-accent' : 'w-2 bg-white/20 hover:bg-white/45'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={nextSlide}
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-[#00f2fe]/10 hover:border-[#00f2fe]/30 transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. PREGUNTAS FRECUENTES (FAQs) */}
      <section className="container mx-auto px-6 py-12 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <HelpCircle className="w-8 h-8 text-nexus-accent mx-auto mb-4" />
          <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight font-display">
            Preguntas Frecuentes de Propietarios
          </h2>
          <p className="text-gray-300 text-sm md:text-base mt-4 leading-relaxed font-sans">
            Despejamos las inquietudes más comunes sobre nuestro servicio premium de corretaje exclusivo y despliegue tecnológico.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4 text-left">
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className="glass-panel border-white/5 rounded-2xl overflow-hidden bg-[#0a0d16]/60 backdrop-blur-md transition-all duration-300"
            >
              <h3>
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-6 text-white text-sm sm:text-base font-bold text-left hover:bg-white/[0.02] transition cursor-pointer select-none font-display focus:outline-none"
                >
                  <span>{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-nexus-accent transition-transform duration-300 ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
              </h3>
              
              <div 
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  openFaq === idx ? 'max-h-[300px] border-t border-white/5 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <p className="p-6 text-gray-300 text-xs sm:text-sm leading-relaxed font-sans font-normal tracking-wide">
                  {faq.answer}
                </p>
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
    </div>
  );
}
