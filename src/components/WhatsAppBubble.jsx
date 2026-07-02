import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function WhatsAppBubble() {
  const location = useLocation();
  const [showTooltip, setShowTooltip] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  const messages = [
    "¿Buscas comprar un lote en Juliaca sin riesgo de estafas? Te enviamos planos de terrenos con títulos limpios y auditados en SUNARP 📲",
    "¿Quieres vender tu propiedad rápido y sin trabas notariales? Saneamos tus títulos con nuestro abogado y te hacemos fotos 360° gratis 🏡",
    "¿Eres agente o constructora y quieres una web interactiva con planos 3D y recorridos 360° como esta? Cotiza tu web aquí 💻",
    "¿Quieres duplicar tus ventas inmobiliarias con mapas de lotes dinámicos y tours virtuales? Desarrollamos tu sistema a medida 🚀"
  ];

  const whatsappTexts = [
    "Hola Nexus, busco comprar un lote en Juliaca/Puno de forma segura y deseo ver opciones libres de tráfico de tierras o dobles ventas.",
    "Hola Nexus, soy propietario y deseo asesoría gratuita de su abogado y el servicio multimedia de dron y 360° para vender mi propiedad.",
    "Hola Nexus, vi su plataforma interactiva y me gustaría cotizar el desarrollo de una página web personalizada para mi empresa inmobiliaria.",
    "Hola Nexus, estoy interesado en implementar mapas interactivos de lotizaciones y tours virtuales en la página web de mi constructora/inmobiliaria."
  ];

  useEffect(() => {
    if (isHovered) {
      setShowTooltip(true);
      return;
    }

    let timeoutId;

    const runCycle = (step) => {
      if (isHovered) return;

      if (step === 'show') {
        setShowTooltip(true);
        // Se mantiene visible durante 9 segundos para permitir una lectura tranquila
        timeoutId = setTimeout(() => runCycle('hide'), 9000);
      } else if (step === 'hide') {
        setShowTooltip(false);
        // Permanece oculto durante 20 segundos antes de cambiar al siguiente mensaje (más dinámico)
        timeoutId = setTimeout(() => {
          setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
          runCycle('show');
        }, 20000);
      }
    };

    // Primer tooltip aparece a los 7 segundos de cargar la página (captura rápida de atención)
    timeoutId = setTimeout(() => runCycle('show'), 7000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isHovered, messages.length]);

  if (location.pathname === '/contacto') {
    return null;
  }

  return (
    <div 
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 select-none whatsapp-global-bubble transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Tooltip elegante animado con auto-ajuste de ancho para móvil */}
      <div className={`px-4 py-2.5 rounded-2xl bg-white/90 backdrop-blur-md border border-[#25d366]/30 text-slate-800 font-bold text-[11px] sm:text-xs shadow-2xl transition-all duration-300 transform origin-right max-w-[210px] sm:max-w-[290px] whitespace-normal ${
        showTooltip 
          ? 'opacity-100 scale-100 translate-x-0 visible' 
          : 'opacity-0 scale-95 translate-x-4 invisible pointer-events-none'
      }`}>
        <span className="flex items-start gap-2">
          <span className="w-2 h-2 rounded-full bg-[#25d366] animate-pulse shrink-0 mt-1"></span>
          <span className="leading-relaxed font-sans">{messages[currentMessageIndex]}</span>
        </span>
      </div>

      {/* Botón flotante interactivo */}
      <a 
        href={`https://wa.me/51915300535?text=${encodeURIComponent(whatsappTexts[currentMessageIndex])}`} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="w-14 h-14 rounded-full bg-[#25d366] text-white flex items-center justify-center shadow-[0_4px_20px_rgba(37,211,102,0.4)] hover:shadow-[0_4px_30px_rgba(37,211,102,0.7)] hover:bg-[#20ba5a] transition-all duration-300 hover:scale-110 active:scale-95 group relative"
        aria-label="Contactar por WhatsApp"
      >
        {/* Efecto radar de pulsación verde neón */}
        <span className="absolute inset-0 rounded-full bg-[#25d366] opacity-35 animate-ping pointer-events-none"></span>
        <span className="absolute inset-0 rounded-full bg-[#25d366] opacity-20 animate-pulse pointer-events-none scale-125"></span>

        {/* Icono de WhatsApp nativo SVG para máxima calidad */}
        <svg 
          className="w-7 h-7 drop-shadow-md fill-white" 
          viewBox="0 0 448 512" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
        </svg>
      </a>
    </div>
  );
}
