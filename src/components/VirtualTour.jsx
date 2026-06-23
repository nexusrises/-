import React, { useState, useEffect, useRef, Suspense } from 'react';
import { createPortal } from 'react-dom';
import { Canvas, useLoader, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import {
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  Compass,
  HelpCircle,
  Info,
  Sparkles,
  Edit,
  Camera,
  Play,
  Volume2,
  Briefcase,
  Eye,
  ShoppingCart,
  Home,
  Link,
  Map,
  Plus,
  Minus,
  Sun,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { tourData } from '../data/tourData';

// Map of icons for hotspots
const IconMap = {
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  Camera,
  Info,
  HelpCircle,
  Play,
  Volume2,
  Briefcase,
  Compass,
  MapPin: Compass, // Fallback mapping
  Sparkles,
  Eye,
  ShoppingCart,
  Home,
  Link,
  Map
};

// CSS Filter mapping
const getFilterCss = (filtro) => {
  switch (filtro) {
    case 'grayscale':
      return 'grayscale(100%)';
    case 'cold':
      return 'contrast(1.1) brightness(0.95) saturate(1.3) hue-rotate(180deg)';
    case 'warm':
      return 'sepia(50%) contrast(1.1) saturate(1.2)';
    default:
      return 'none';
  }
};

// Controlador de zoom real para visor 360° usando FOV (Field of View)
function FovZoomController() {
  const { camera, gl } = useThree();
  const fovRef = useRef(camera.fov);

  useEffect(() => {
    const canvas = gl.domElement;

    const handleWheel = (e) => {
      e.preventDefault();
      fovRef.current += e.deltaY * 0.05;
      fovRef.current = Math.max(35, Math.min(85, fovRef.current));
      camera.fov = fovRef.current;
      camera.updateProjectionMatrix();
    };

    canvas.addEventListener('wheel', handleWheel, { passive: false });
    return () => canvas.removeEventListener('wheel', handleWheel);
  }, [camera, gl]);

  return null;
}

// Controlador de orientación de brújula en tiempo real para el Norte Magnético
function CompassController({ controlsRef, compassRef, northOffset = 0 }) {
  useFrame((state) => {
    const controls = controlsRef?.current || state.controls;
    if (controls && compassRef.current) {
      const azimuth = controls.getAzimuthalAngle() || 0;
      // Convertir azimut a grados (0 a 360)
      const azimuthDeg = (azimuth * 180) / Math.PI;
      // La aguja apunta al Norte físico relativo a la cámara: offset de la escena - azimut
      const rotation = northOffset - azimuthDeg;
      compassRef.current.style.transform = `rotate(${rotation}deg)`;
    }
  });

  return null;
}

// Componente para la esfera 3D con textura panorámica equirrectangular
function PanoramaSphere({ imagePath, onPointerDown }) {
  const texture = useLoader(THREE.TextureLoader, imagePath);

  // Configurar filtros de textura para alta resolución y fluidez sin difuminado
  useEffect(() => {
    if (texture) {
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.generateMipmaps = false;
      texture.needsUpdate = true;
    }
  }, [texture]);

  return (
    <mesh scale={[-1, 1, 1]} onPointerDown={onPointerDown}>
      <sphereGeometry args={[500, 60, 40]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
}

// Componente para manejar la rotación y escala compensada por zoom de cada hotspot
function HotspotGroup({ posicion, posicionTipo, inclinacion, rotacion, escalaZoom, escala, children }) {
  const groupRef = useRef();

  useFrame((state) => {
    if (!groupRef.current) return;
    const node = groupRef.current;

    // 1. Orientación según el tipo
    if (posicionTipo === 'piso') {
      const [x, y, z] = posicion || [0, 0, -20];
      const radialYaw = Math.atan2(x, z);
      const userInclRad = ((inclinacion || 0) * Math.PI) / 180;
      node.rotation.set(-Math.PI / 2, 0, radialYaw + userInclRad + Math.PI);

      // Aplicar inclinación en el eje local X (inclinación frontal/cabeceo)
      if (rotacion) {
        node.rotateX((rotacion * Math.PI) / 180);
      }
    } else {
      const [x, y, z] = posicion || [0, 0, -20];
      const distHorizontal = Math.sqrt(x * x + z * z);
      if (distHorizontal < 2.0) {
        node.up.set(0, 0, 1);
      } else {
        node.up.set(0, 1, 0);
      }
      node.lookAt(0, 0, 0);

      // Rotar sobre su eje Z local (Giro/Roll)
      if (inclinacion) {
        node.rotateZ((inclinacion * Math.PI) / 180);
      }
      // Rotar sobre su eje X local (Inclinación frontal/Pitch)
      if (rotacion) {
        node.rotateX((rotacion * Math.PI) / 180);
      }
    }

    // 2. Control de escala (escalaZoom === true mantiene tamaño constante frente al zoom)
    const isTransform = (posicionTipo === 'piso' || posicionTipo === 'muro');
    const baseScale = escala ?? 1.0;

    if (isTransform && escalaZoom === false) {
      const currentFovRad = (state.camera.fov * Math.PI) / 360;
      const baseFovRad = (75 * Math.PI) / 360;
      const zoomFactor = Math.tan(currentFovRad) / Math.tan(baseFovRad);
      node.scale.setScalar(baseScale * zoomFactor);
    } else {
      node.scale.setScalar(baseScale);
    }
  });

  return (
    <group ref={groupRef} position={posicion || [0, 0, -20]}>
      {children}
    </group>
  );
}

// Funciones de formateo para precio y área
const formatPrecio = (val) => {
  if (!val) return '';
  const clean = String(val).trim();
  if (/^\d+(\.\d+)?$/.test(clean)) {
    return `S/. ${clean}`;
  }
  return clean;
};

const formatArea = (val) => {
  if (!val) return '';
  const clean = String(val).trim();
  if (/^\d+(\.\d+)?$/.test(clean)) {
    return `${clean} m²`;
  }
  return clean;
};

// Visualizador de hotspots interactivos y complementos (texto/imagen)
function Hotspot({
  posicion,
  destino,
  texto,
  onNavigate,
  escala,
  inclinacion,
  rotacion,
  tipo,
  color,
  icono,
  colorTexto,
  colorFondo,
  url,
  ancho,
  alto,
  opacidad,
  posicionTipo,
  escalaZoom,
  sombra,
  fondoTransparente,
  negrita,
  cursiva,
  mostrarTextoSiempre,
  fontSize,
  nombreDestino,
  fuente,
  manzana,
  lote,
  estado,
  precio,
  area
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  const { camera } = useThree();
  // Ref al div contenedor del HTML para toggling de visibilidad sin re-renders
  const visibilityRef = useRef(null);
  // Vectores reutilizables para evitar alojamiento en cada frame
  const _cameraDir = useRef(new THREE.Vector3());
  const _toPoint = useRef(new THREE.Vector3());

  // Verificar cada frame si el hotspot está frente a la cámara.
  // Si está detrás, ocultarlo via CSS para evitar proyecciones invertidas.
  useFrame(() => {
    if (!visibilityRef.current) return;
    const [x, y, z] = posicion || [0, 0, -20];
    // Vector forward de la cámara (hacia dónde apunta)
    camera.getWorldDirection(_cameraDir.current);
    // Vector desde la cámara hacia el hotspot
    _toPoint.current.set(
      x - camera.position.x,
      y - camera.position.y,
      z - camera.position.z
    ).normalize();
    // Producto punto: > 0 = frente a la cámara, < 0 = detrás
    const dot = _toPoint.current.dot(_cameraDir.current);
    const isInFront = dot > 0.0;
    visibilityRef.current.style.visibility = isInFront ? 'visible' : 'hidden';
    visibilityRef.current.style.pointerEvents = isInFront ? 'auto' : 'none';
  });

  const SelectedIcon = IconMap[icono] || ArrowRight;
  const itemTipo = tipo || 'hotspot';

  const shadowFilter = sombra
    ? 'drop-shadow(0 10px 15px rgba(0,0,0,0.65))'
    : 'none';

  const isTransform = (posicionTipo === 'piso' || posicionTipo === 'muro');
  const distFactor = (!isTransform && escalaZoom !== false) ? 15 : undefined;

  const wrapperStyle = {
    opacity: opacidad ?? 1.0,
    transform: isTransform ? undefined : `scale(${escala ?? 1.0}) rotateZ(${inclinacion ?? 0}deg) rotateX(${rotacion ?? 0}deg)`,
    filter: shadowFilter
  };

  return (
    <HotspotGroup
      posicion={posicion}
      posicionTipo={posicionTipo}
      inclinacion={inclinacion}
      rotacion={rotacion}
      escalaZoom={escalaZoom}
      escala={escala}
    >
      <Html
        position={[0, 0, 0]}
        center
        distanceFactor={distFactor}
        transform={isTransform}
      >
        {/* Contenedor con ref para control de visibilidad sin re-renders */}
        <div ref={visibilityRef}>
          {itemTipo === 'hotspot' && (
            <button
              onClick={() => {
                if (destino && destino !== '_self') {
                  onNavigate(destino);
                }
              }}
              style={wrapperStyle}
              className={`group relative flex items-center justify-center transition-all duration-300 focus:outline-none ${(destino && destino !== '_self') ? 'cursor-pointer hover:scale-110 active:scale-95' : 'cursor-default'
                }`}
              title={texto}
            >
              {/* Onda de pulso animada exterior */}
              <span
                className="absolute inline-flex h-12 w-12 rounded-full animate-ping"
                style={{ backgroundColor: fondoTransparente ? 'transparent' : (color ? `${color}33` : 'rgba(6, 182, 212, 0.4)') }}
              ></span>

              {/* Anillo exterior premium con degradado */}
              <div
                className="absolute h-10 w-10 rounded-full border backdrop-blur-sm"
                style={{
                  backgroundColor: fondoTransparente ? 'transparent' : (color ? `${color}1a` : 'rgba(6, 182, 212, 0.2)'),
                  borderColor: fondoTransparente ? 'transparent' : (color ? `${color}40` : 'rgba(6, 182, 212, 0.4)')
                }}
              ></div>

              {/* Botón interactivo central */}
              <div
                className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-white shadow-lg"
                style={{
                  background: color
                    ? `linear-gradient(to top right, ${color}, ${color}dd)`
                    : 'linear-gradient(to top right, #06b6d4, #4f46e5)',
                  boxShadow: `0 0 20px ${color || 'rgba(6, 182, 212, 0.8)'}`
                }}
              >
                <SelectedIcon className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </div>

              {/* Etiqueta de texto (Tooltip) configurable */}
              <div
                className={`absolute bottom-10 border border-white/10 px-2.5 py-1.5 rounded-xl shadow-2xl z-50 pointer-events-none transition-all duration-300 ${mostrarTextoSiempre !== false
                    ? 'scale-100 opacity-100'
                    : 'scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 origin-bottom'
                  }`}
                style={{
                  color: colorTexto || '#ffffff',
                  backgroundColor: fondoTransparente ? 'transparent' : (colorFondo || 'rgba(15, 23, 42, 0.9)'),
                  borderColor: fondoTransparente ? 'transparent' : 'rgba(255, 255, 255, 0.1)',
                  fontSize: `${fontSize || 10}px`,
                  whiteSpace: 'pre-line',
                  textAlign: 'center',
                  backdropFilter: fondoTransparente ? 'none' : 'blur(4px)',
                  width: 'max-content',
                  fontWeight: negrita ? 'bold' : 'normal',
                  fontStyle: cursiva ? 'italic' : 'normal',
                  fontFamily: fuente ? `'${fuente}', sans-serif` : "'Montserrat', sans-serif"
                }}
              >
                <span>{texto || (destino === '_self' ? 'Información' : (nombreDestino ? `👉 ${nombreDestino}` : ''))}</span>
              </div>
            </button>
          )}

          {itemTipo === 'texto' && (
            <div
              style={wrapperStyle}
              className="group relative flex items-center justify-center transition-all duration-300"
            >
              <div
                style={{
                  color: colorTexto || '#ffffff',
                  backgroundColor: fondoTransparente ? 'transparent' : (colorFondo || 'rgba(15, 23, 42, 0.85)'),
                  boxShadow: sombra ? '0 12px 24px rgba(0,0,0,0.5)' : 'none',
                  transform: isTransform ? `scale(${escala ?? 1.0})` : undefined,
                  fontSize: `${fontSize || 14}px`,
                  fontWeight: negrita !== false ? 'bold' : 'normal',
                  fontStyle: cursiva ? 'italic' : 'normal',
                  whiteSpace: 'pre-line',
                  textAlign: 'center',
                  width: 'max-content',
                  fontFamily: fuente ? `'${fuente}', sans-serif` : "'Montserrat', sans-serif"
                }}
                className="px-4 py-2.5 rounded-2xl border border-white/10 backdrop-blur-md flex items-center justify-center gap-2"
              >
                {!fondoTransparente && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>}
                <span>{texto}</span>
              </div>
            </div>
          )}

          {itemTipo === 'imagen' && (
            <div
              style={wrapperStyle}
              className="group relative flex items-center justify-center transition-all duration-300"
            >
              <div
                style={{
                  width: `${ancho || 200}px`,
                  height: `${alto || 150}px`,
                  boxShadow: sombra ? '0 15px 30px rgba(0,0,0,0.55)' : 'none',
                  transform: isTransform ? `scale(${escala ?? 1.0})` : undefined,
                  backgroundColor: fondoTransparente ? 'transparent' : 'rgb(2, 6, 23)'
                }}
                className="rounded-2xl overflow-hidden border border-white/15 flex flex-col"
              >
                {url ? (
                  <img src={url ? (url.startsWith('http') || url.startsWith('data:') ? url : `${import.meta.env.BASE_URL.replace(/\/$/, "")}${url}`) : ''} alt="Complemento" className="w-full h-full object-cover pointer-events-none" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-[10px] text-gray-500 p-4 text-center">
                    <span>Sin imagen</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {itemTipo === 'lote' && (
            <div 
              style={wrapperStyle}
              className="group relative flex items-center justify-center transition-all duration-300"
              onPointerDown={(e) => {
                e.stopPropagation();
                setShowTooltip(!showTooltip);
              }}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              {/* Anillo exterior premium con degradado */}
              <div
                className="absolute h-10 w-10 rounded-full border backdrop-blur-sm bg-black/10 border-white/40"
              ></div>

              {/* Botón interactivo central con el color de su estado */}
              <div
                className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-white font-black text-xs shadow-lg font-sans"
                style={{
                  background: color || '#22c55e',
                  boxShadow: `0 0 15px ${color || '#22c55e'}`
                }}
              >
                {lote || '1'}
              </div>

              {/* Etiqueta de texto (Tooltip) */}
              <div
                className={`absolute bottom-10 border border-white/10 px-2.5 py-1.5 rounded-xl shadow-2xl z-50 pointer-events-none transition-all duration-300 origin-bottom bg-slate-900/95 text-white font-mono text-[9px] w-max text-center backdrop-blur-sm ${
                  showTooltip ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                }`}
              >
                <strong>Mz {manzana || 'A'} - Lote {lote || '1'}</strong>
                <span className="block text-[8px] mt-0.5" style={{ color: color }}>
                  ● {estado || 'Disponible'}
                </span>
                {precio && <span className="block text-[8px] text-gray-300 mt-0.5">{formatPrecio(precio)}</span>}
                {area && <span className="block text-[8px] text-gray-400 mt-0.5">{formatArea(area)}</span>}
              </div>
            </div>
          )}

          {itemTipo === 'manzana' && (
            <div 
              style={{ 
                color: colorTexto || '#ffffff',
                backgroundColor: colorFondo || '#3b82f6',
                boxShadow: sombra ? '0 10px 20px rgba(0,0,0,0.45)' : 'none',
                transform: isTransform ? `scale(${escala ?? 1.0})` : undefined,
                fontSize: `${fontSize || 13}px`,
                fontWeight: negrita !== false ? 'bold' : 'normal',
                fontStyle: cursiva ? 'italic' : 'normal',
                opacity: opacidad ?? 1.0,
                scale: escala ?? 1.0,
                fontFamily: fuente ? `'${fuente}', sans-serif` : "'Montserrat', sans-serif"
              }}
              className="px-3.5 py-1.5 rounded-full border border-white/20 backdrop-blur-sm flex items-center justify-center font-bold tracking-wide uppercase w-max select-none pointer-events-auto transition-all duration-300"
            >
              <span>{texto || 'MZ'}</span>
            </div>
          )}
        </div>
      </Html>
    </HotspotGroup>
  );
}

// Fallback de carga premium mientras se descarga la textura equirrectangular
function LoaderFallback() {
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center bg-slate-950/90 border border-cyan-500/20 backdrop-blur-lg px-8 py-6 rounded-3xl text-center shadow-2xl min-w-[260px]">
        <div className="relative flex items-center justify-center w-16 h-16 mb-4">
          <div className="absolute w-full h-full border-4 border-cyan-500/20 rounded-full"></div>
          <div className="absolute w-full h-full border-4 border-t-cyan-400 rounded-full animate-spin"></div>
          <Compass className="w-6 h-6 text-cyan-400 animate-pulse" />
        </div>
        <h4 className="text-white font-bold text-sm tracking-wide uppercase">Cargando Entorno 3D</h4>
        <p className="text-gray-400 text-xs mt-1">Renderizando texturas en tiempo real...</p>
      </div>
    </Html>
  );
}

// Componente de R3F para orientar la cámara al heading de la escena activa usando useFrame para evitar race conditions
function HeadingController({ heading, activeSceneKey, controlsRef }) {
  const { camera } = useThree();
  const hasOriented = useRef(false);

  useEffect(() => {
    hasOriented.current = false;
  }, [activeSceneKey, heading]);

  useFrame((state) => {
    const controls = controlsRef?.current || state.controls;
    if (!hasOriented.current && controls) {
      const h = heading || { x: 0, y: 0 };
      const azimuth = (h.y * Math.PI) / 180;
      const polar = (h.x * Math.PI) / 180 + Math.PI / 2;

      const radius = 0.1;
      camera.position.x = radius * Math.sin(polar) * Math.sin(azimuth);
      camera.position.y = radius * Math.cos(polar);
      camera.position.z = radius * Math.sin(polar) * Math.cos(azimuth);
      camera.lookAt(0, 0, 0);

      controls.target.set(0, 0, 0);
      controls.update();
      hasOriented.current = true;
    }
  });

  return null;
}

export default function VirtualTour({
  isExpanded: propIsExpanded,
  setIsExpanded: propSetIsExpanded,
  tourId = 'home',
  autoRotate = true,
  showThumbnails = true
}) {
  const [localIsExpanded, localSetIsExpanded] = useState(false);
  const isExpanded = propIsExpanded !== undefined ? propIsExpanded : localIsExpanded;
  const setIsExpanded = propSetIsExpanded !== undefined ? propSetIsExpanded : localSetIsExpanded;

  const [activeSceneKey, setActiveSceneKey] = useState('__loading__');
  // Iniciar con overlay activo para cubrir el frame inicial de carga y orientación de cámara
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [showHelp, setShowHelp] = useState(false);
  const [showDragHint, setShowDragHint] = useState(true);
  const [autoRotateState, setAutoRotateState] = useState(autoRotate);
  const orbitRef = useRef(null);
  const containerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Control interactivo táctil para evitar atascar el scroll en celulares
  const [isInteractive, setIsInteractive] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 768;
    }
    return true;
  });

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;
    try {
      const container = containerRef.current;
      if (!document.fullscreenElement && !document.webkitFullscreenElement) {
        if (container.requestFullscreen) {
          await container.requestFullscreen();
        } else if (container.webkitRequestFullscreen) {
          await container.webkitRequestFullscreen();
        } else {
          // Fallback por CSS para iOS/iPhone
          setIsFullscreen(true);
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          await document.webkitExitFullscreen();
        } else {
          setIsFullscreen(false);
        }
      }
    } catch (err) {
      console.warn("Fallo en fullscreen nativo, aplicando fallback por CSS:", err);
      setIsFullscreen(!isFullscreen);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!(document.fullscreenElement || document.webkitFullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  const compassRef = useRef(null);

  const orientToNorth = () => {
    if (!orbitRef.current) return;
    const controls = orbitRef.current;
    const camera = controls.object;
    if (camera) {
      setAutoRotateState(false);
      setShowDragHint(false);

      const activeScene = scenes[activeSceneKey] || { heading: { x: 0, y: 0 }, northOffset: 0 };
      const northAngleDeg = activeScene.northOffset || 0;
      
      const azimuth = (northAngleDeg * Math.PI) / 180;
      const polar = controls.getPolarAngle() || Math.PI / 2;

      const radius = 0.1;
      camera.position.x = radius * Math.sin(polar) * Math.sin(azimuth);
      camera.position.y = radius * Math.cos(polar);
      camera.position.z = radius * Math.sin(polar) * Math.cos(azimuth);
      camera.lookAt(0, 0, 0);

      controls.target.set(0, 0, 0);
      controls.update();
    }
  };

  // Cargar escenas dinámicamente de localStorage o fallback a tourData
  const [scenes, setScenes] = useState(tourData);

  // Cargar escenas dinámicamente cuando cambia el tourId
  useEffect(() => {
    const fetchTourData = async () => {
      // Activar overlay durante la carga para evitar que hotspots aparezcan sin orientar
      setIsTransitioning(true);

      const finishLoad = (parsed, firstScene) => {
        setScenes(parsed);
        setActiveSceneKey(firstScene);
        // Dar tiempo al HeadingController de orientar la cámara antes de mostrar los hotspots
        setTimeout(() => setIsTransitioning(false), 350);
      };

      // 1. LocalStorage
      const localSaved = localStorage.getItem(`nexus_tour_data_${tourId}`);
      if (localSaved && localSaved !== 'undefined') {
        try {
          // Reemplazar en caliente rutas obsoletas a /descargas_kuula/ por /tour/
          const cleanedSaved = localSaved.replace(/\/descargas_kuula\//g, '/tour/');
          const parsed = JSON.parse(cleanedSaved);
          const firstScene = Object.keys(parsed)[0];
          if (firstScene) {
            if (cleanedSaved !== localSaved) {
              localStorage.setItem(`nexus_tour_data_${tourId}`, cleanedSaved);
            }
            finishLoad(parsed, firstScene);
            return;
          }
        } catch (e) {
          console.error(e);
        }
      }

      // 2. Archivo físico
      try {
        const res = await fetch(`${import.meta.env.BASE_URL.replace(/\/$/, "")}/tours/${tourId}.json`);
        if (res.ok) {
          const parsed = await res.json();
          const firstScene = Object.keys(parsed)[0];
          if (firstScene) {
            finishLoad(parsed, firstScene);
            return;
          }
        }
      } catch (e) {
        console.warn(`No se pudo cargar el archivo físico para tourId: ${tourId}`);
      }

      // 3. Fallback
      finishLoad(tourData, 'sala');
    };

    fetchTourData();
  }, [tourId]);

  // Mantener actualizado el visor con los cambios del editor local (en localStorage)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e && e.key !== null && e.key !== `nexus_tour_data_${tourId}`) return;
      const saved = localStorage.getItem(`nexus_tour_data_${tourId}`);
      if (saved && saved !== 'undefined') {
        try {
          const parsed = JSON.parse(saved);
          setScenes(parsed);
        } catch (err) {
          console.error(err);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [tourId]);

  const activeScene = scenes[activeSceneKey] || { nombre: '', imagen: '', hotspots: [], heading: { x: 0, y: 0 }, filtro: 'normal' };
  const displayImage = activeScene.imagen ? (activeScene.imagen.startsWith('http') || activeScene.imagen.startsWith('data:') ? activeScene.imagen : `${import.meta.env.BASE_URL.replace(/\/$/, "")}${activeScene.imagen}`) : '';

  const isDev = import.meta.env.DEV && import.meta.env.VITE_ENABLE_360_EDITOR === 'true';

  const [filtro, setFiltro] = useState(activeScene.filtro || 'normal');

  useEffect(() => {
    if (activeScene && activeScene.filtro) {
      setFiltro(activeScene.filtro);
    } else {
      setFiltro('normal');
    }
  }, [activeSceneKey, scenes, activeScene]);

  // Lógica para manejar la navegación con fundido de transición suave
  const handleNavigate = (targetDestiny) => {
    if (isTransitioning) return;

    setIsTransitioning(true);

    setTimeout(() => {
      setActiveSceneKey(targetDestiny);
      // Esperar 350ms para que HeadingController oriente la cámara al heading correcto
      // ANTES de que el overlay desaparezca y los hotspots sean visibles
      setTimeout(() => {
        setIsTransitioning(false);
      }, 350);
    }, 450);
  };


  // Deshabilitar scroll en el body y ocultar el navbar cuando el visor está expandido
  useEffect(() => {
    const navbar = document.querySelector('nav');
    if (isExpanded) {
      document.body.style.overflow = 'hidden';
      if (navbar) {
        navbar.style.transform = 'translateY(-100%)';
        navbar.style.opacity = '0';
        navbar.style.pointerEvents = 'none';
      }
    } else {
      document.body.style.overflow = '';
      if (navbar) {
        navbar.style.transform = 'translateY(0)';
        navbar.style.opacity = '1';
        navbar.style.pointerEvents = 'auto';
      }
    }
    return () => {
      document.body.style.overflow = '';
      if (navbar) {
        navbar.style.transform = '';
        navbar.style.opacity = '';
        navbar.style.pointerEvents = '';
      }
    };
  }, [isExpanded]);

  // Manejar el cierre del modo expandido presionando la tecla Escape (Esc)
  useEffect(() => {
    if (!isExpanded) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        setIsExpanded(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isExpanded, setIsExpanded]);

  // Ocultar la pista de arrastrar inicial automáticamente después de 4 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowDragHint(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, [activeSceneKey]);

  // Controles de cámara táctiles / en pantalla
  const handleRotate = (dir) => {
    if (!orbitRef.current) return;
    const controls = orbitRef.current;
    const camera = controls.object;
    if (camera) {
      const step = 0.15; // Radianes
      const polarStep = 0.08;

      let azimuth = controls.getAzimuthalAngle() || 0;
      let polar = controls.getPolarAngle() || Math.PI / 2;

      if (dir === 'left') azimuth += step;
      if (dir === 'right') azimuth -= step;
      if (dir === 'up') polar = Math.max(0.2, polar - polarStep);
      if (dir === 'down') polar = Math.min(Math.PI - 0.2, polar + polarStep);

      const r = 0.1;
      camera.position.x = r * Math.sin(polar) * Math.sin(azimuth);
      camera.position.y = r * Math.cos(polar);
      camera.position.z = r * Math.sin(polar) * Math.cos(azimuth);
      camera.lookAt(0, 0, 0);
      controls.update();
    }
  };

  const handleZoom = (type) => {
    if (!orbitRef.current) return;
    const camera = orbitRef.current.object;
    if (camera) {
      let fov = camera.fov;
      if (type === 'in') {
        fov = Math.max(35, fov - 8);
      } else {
        fov = Math.min(85, fov + 8);
      }
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }
  };

  const tourContent = (
    <div
      ref={containerRef}
      className={
        isFullscreen
          ? "fixed inset-0 w-screen h-screen z-[99999] bg-[#020617] flex flex-col overflow-hidden"
          : isExpanded
          ? "fixed inset-4 md:inset-10 z-[99999] bg-[#020617]/95 backdrop-blur-xl border border-white/15 shadow-[0_0_50px_rgba(0,0,0,0.85)] transition-all duration-300 rounded-3xl overflow-hidden flex flex-col"
          : "w-full h-full relative group/tour transition-all duration-500 overflow-hidden rounded-3xl"
      }
    >
      <Canvas
        camera={{ position: [0, 0, 0.1] }}
        dpr={[1, 2]}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        style={{ filter: getFilterCss(filtro) }}
        onPointerDown={() => {
          setAutoRotateState(false);
          setShowDragHint(false);
        }}
      >
        <Suspense fallback={<LoaderFallback />}>
          {displayImage && <PanoramaSphere imagePath={displayImage} />}

          {activeScene.hotspots?.map((hs, index) => (
            <Hotspot
              key={`${activeSceneKey}-hs-${index}`}
              posicion={hs.posicion}
              destino={hs.destino}
              texto={hs.texto}
              escala={hs.escala}
              inclinacion={hs.inclinacion}
              rotacion={hs.rotacion}
              tipo={hs.tipo}
              color={hs.color}
              icono={hs.icono}
              colorTexto={hs.colorTexto}
              colorFondo={hs.colorFondo}
              url={hs.url}
              ancho={hs.ancho}
              alto={hs.alto}
              opacidad={hs.opacidad}
              posicionTipo={hs.posicionTipo}
              escalaZoom={hs.escalaZoom}
              sombra={hs.sombra}
              fondoTransparente={hs.fondoTransparente}
              negrita={hs.negrita}
              cursiva={hs.cursiva}
              mostrarTextoSiempre={hs.mostrarTextoSiempre}
              fontSize={hs.fontSize}
              nombreDestino={scenes[hs.destino]?.nombre}
              fuente={hs.fuente}
              onNavigate={handleNavigate}
              manzana={hs.manzana}
              lote={hs.lote}
              estado={hs.estado}
              precio={hs.precio}
              area={hs.area}
            />
          ))}
        </Suspense>

        <OrbitControls
          ref={orbitRef}
          enableZoom={false}
          enablePan={false}
          rotateSpeed={-0.22}
          enableDamping={true}
          dampingFactor={0.08}
          autoRotate={autoRotateState}
          autoRotateSpeed={0.3}
          enabled={isInteractive}
        />
        <FovZoomController />
        <HeadingController heading={activeScene.heading} activeSceneKey={activeSceneKey} controlsRef={orbitRef} />
        <CompassController controlsRef={orbitRef} compassRef={compassRef} northOffset={activeScene.northOffset || 0} />
      </Canvas>

      {/* Capa de Fundido a Negro para Transición Suave */}
      <div
        className={`absolute inset-0 bg-slate-950 transition-opacity duration-500 pointer-events-none z-30 ${isTransitioning ? 'opacity-100' : 'opacity-0'
          }`}
      />

      {/* Panel Superior de Control de Escena */}
      <div className="absolute top-6 left-6 right-6 flex items-start justify-between pointer-events-none z-20">
        {/* Panel Unificado: Nombre del Entorno y Descripción */}
        <div className="glass-panel border-white/10 backdrop-blur-md p-4 rounded-2xl pointer-events-auto max-w-xs md:max-w-sm animate-fade-in shadow-lg">
          <div className="flex items-center gap-2 mb-1.5">
            <Compass className="w-4 h-4 text-cyan-400 animate-pulse" />
            <h3 className="text-white font-bold text-xs md:text-sm tracking-tight">{activeScene.nombre}</h3>
          </div>
          <p className="text-gray-400 text-[10px] md:text-xs leading-relaxed">
            {activeScene.descripcion}
          </p>
        </div>

        {/* Botones de Control del Sistema */}
        <div className="flex items-center gap-2 pointer-events-auto">




          {/* Botón de Editor Privado (Solo desarrollo) */}
          {isDev && (
            <button
              onClick={() => window.open(`/editor-360-privado/${tourId}`, '_blank')}
              className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:text-white hover:bg-cyan-500/20 transition-all cursor-pointer shadow-lg"
              title="Abrir Editor Privado"
            >
              <Edit className="w-4.5 h-4.5" />
            </button>
          )}

          {/* Botón de Brújula (Norte Magnético) */}
          <button
            onClick={orientToNorth}
            className="group p-2.5 rounded-xl glass-panel border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200 cursor-pointer shadow-lg flex items-center justify-center relative bg-slate-950/40"
            title="Norte Magnético. Clic para orientar al Norte"
          >
            {/* Círculo de la brújula */}
            <div className="w-6 h-6 rounded-full border border-white/25 flex items-center justify-center relative bg-slate-950/40">
              {/* Marca del Norte "N" */}
              <span className="absolute top-[-2.5px] text-[7.5px] font-bold text-red-500 font-mono tracking-tighter">N</span>
              {/* Aguja Magnética que rota */}
              <div 
                ref={compassRef} 
                className="w-full h-full flex items-center justify-center"
                style={{ transform: `rotate(${(activeScene.northOffset || 0)}deg)` }}
              >
                {/* Aguja de la brújula (SVG Premium) */}
                <svg width="8" height="18" viewBox="0 0 8 18" fill="none" className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                  {/* Punta roja (Norte) */}
                  <path d="M4 1L7 9H1L4 1Z" fill="#ef4444" />
                  {/* Punta plateada (Sur) */}
                  <path d="M4 17L1 9H7L4 17Z" fill="#cbd5e1" />
                </svg>
              </div>
            </div>
          </button>

          <button
            onClick={() => setShowHelp(!showHelp)}
            className={`p-3 rounded-xl border transition-all duration-200 cursor-pointer ${showHelp
                ? 'bg-cyan-500/25 border-cyan-400/40 text-cyan-300'
                : 'glass-panel border-white/10 text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            title="Mostrar Guía de Navegación"
          >
            <HelpCircle className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>





      {/* Overlay de Guía de Navegación (Flotante y limpio) */}
      {showHelp && (
        <div className="absolute top-24 right-6 max-w-xs glass-panel border-cyan-400/20 backdrop-blur-md p-4 rounded-2xl pointer-events-auto animate-fade-in shadow-xl z-20">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h5 className="text-white font-bold text-xs uppercase tracking-wide mb-1">Guía del Recorrido</h5>
              <ul className="text-gray-400 text-[10px] leading-relaxed space-y-1.5 list-disc list-inside">
                <li><strong className="text-gray-200">Rotar:</strong> Clic izquierdo y arrastra.</li>
                <li><strong className="text-gray-200">Zoom:</strong> Rueda del ratón.</li>
                <li><strong className="text-gray-200">Navegar:</strong> Clic en los puntos de escena.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Selector de Miniaturas Flotante (Muy limpio en el pie central del visor) */}
      {showThumbnails && (
        <div className="absolute bottom-6 left-6 right-20 md:left-1/2 md:right-auto md:-translate-x-1/2 z-20 flex gap-2.5 bg-slate-950/70 border border-white/10 p-2 rounded-2xl backdrop-blur-md shadow-2xl pointer-events-auto md:max-w-[90%] overflow-x-auto scrollbar-none">
          {Object.keys(scenes).map((sceneKey) => (
            <button
              key={`thumb-${sceneKey}`}
              onClick={() => handleNavigate(sceneKey)}
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl transition-all duration-300 border cursor-pointer whitespace-nowrap ${activeSceneKey === sceneKey
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold scale-102 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                  : 'bg-white/5 border-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
            >
              <div className="w-6 h-6 rounded-md overflow-hidden border border-white/10 flex-shrink-0">
                <img src={scenes[sceneKey].imagen ? (scenes[sceneKey].imagen.startsWith('http') || scenes[sceneKey].imagen.startsWith('data:') ? scenes[sceneKey].imagen : `${import.meta.env.BASE_URL.replace(/\/$/, "")}${scenes[sceneKey].imagen}`) : ''} alt={scenes[sceneKey].nombre} className="w-full h-full object-cover pointer-events-none" />
              </div>

              <span className="text-[10px] uppercase tracking-wider font-semibold">{scenes[sceneKey].nombre}</span>
            </button>
          ))}
        </div>
      )}

      {/* Botón de Fullscreen nativo / simulado por CSS (Esquina inferior derecha) */}
      <div className="absolute right-6 bottom-6 z-20 flex flex-col gap-2 pointer-events-auto">
        <button
          onClick={toggleFullscreen}
          className="p-3 rounded-xl glass-panel border border-white/15 backdrop-blur-md text-cyan-400 hover:text-white hover:scale-105 active:scale-95 transition-all shadow-2xl cursor-pointer flex items-center justify-center bg-[#0f172a]/80"
          title={isFullscreen ? "Salir de pantalla completa" : "Pantalla Completa (Fullscreen)"}
        >
          {isFullscreen ? (
            <Minimize2 className="w-4.5 h-4.5" />
          ) : (
            <Maximize2 className="w-4.5 h-4.5" />
          )}
        </button>
      </div>

      {/* Overlay de interacción móvil para evitar atascar el scroll vertical de la página */}
      {!isInteractive && (
        <div 
          onClick={() => setIsInteractive(true)}
          className="absolute inset-0 bg-[#070a13]/40 backdrop-blur-[1.5px] flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:bg-[#070a13]/30 z-30 pointer-events-auto"
        >
          <div className="bg-slate-950/90 border border-cyan-400/20 px-6 py-4 rounded-3xl shadow-2xl flex flex-col items-center gap-2.5 text-center max-w-[85%] animate-fade-in">
            <div className="w-10 h-10 border border-cyan-400/30 rounded-full flex items-center justify-center text-cyan-400 mb-0.5 animate-pulse">
              <Compass className="w-5 h-5 animate-spin-slow" />
            </div>
            <span className="text-white font-bold text-xs uppercase tracking-wider font-display">Toca para activar vista 360°</span>
            <span className="text-[10px] text-gray-400 leading-relaxed max-w-[180px]">Permite girar el entorno con tu dedo sin congelar el scroll de la página</span>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {isExpanded && (
        <div
          className="fixed inset-0 bg-[#020617]/85 backdrop-blur-sm z-[99998] transition-opacity duration-300 pointer-events-auto"
          onClick={() => setIsExpanded(false)}
        />
      )}
      {tourContent}
    </>
  );
}
