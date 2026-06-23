import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas, useLoader, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { 
  Compass, 
  Trash2, 
  Lock, 
  Unlock, 
  Plus, 
  Save, 
  Sparkles, 
  ChevronRight,
  ChevronDown,
  Upload,
  Layers,
  Settings,
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
  Type,
  Image as ImageIcon,
  ShoppingCart,
  Home,
  Link,
  Map,
  Eye
} from 'lucide-react';
import { tourData as initialTourData } from '../data/tourData';
import { useParams } from 'react-router-dom';

// Función para redimensionar y comprimir imágenes 360° en el cliente
const optimizePanoramaImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Limitar ancho máximo a 4096px (estándar WebGL óptimo para móviles y TVs)
        const maxWidth = 4096;
        if (width > maxWidth) {
          width = maxWidth;
          height = Math.round(width / 2); // mantener relación de aspecto 2:1 equirrectangular
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Exportar a JPG con calidad 0.85 (balance óptimo de nitidez y peso)
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.85);
        resolve(compressedBase64);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

// Función para redimensionar y comprimir imágenes normales (tarjetas de imagen en 3D)
const optimizeNormalImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Limitar ancho máximo a 1200px para tarjetas planas incrustadas
        const maxWidth = 1200;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Exportar a JPG con calidad 0.85
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.85);
        resolve(compressedBase64);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};


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
      return 'grayscale(100%) contrast(1.25)';
    case 'vivid':
      return 'contrast(1.12) saturate(1.3) brightness(1.02)';
    case 'bright':
      return 'brightness(1.08) contrast(1.02) saturate(1.15)';
    case 'hdr':
      return 'contrast(1.25) saturate(1.25) brightness(0.98)';
    case 'warm':
      return 'sepia(30%) contrast(1.1) saturate(1.25) brightness(1.01)';
    case 'cold':
      return 'hue-rotate(12deg) saturate(1.15) contrast(1.08)';
    default:
      return 'none';
  }
};

// Componente de Zoom por FOV
function FovZoomController({ zoomFov, setZoomFov }) {
  const { camera, gl } = useThree();
  const targetFov = useRef(zoomFov);

  // Sincronizar el FOV objetivo cuando cambie el slider
  useEffect(() => {
    targetFov.current = zoomFov;
  }, [zoomFov]);

  useEffect(() => {
    const canvas = gl.domElement;
    const handleWheel = (e) => {
      e.preventDefault();
      // Sensibilidad un poco más baja para control de zoom fino
      let newFov = targetFov.current + e.deltaY * 0.035;
      // Límites más naturales (15° zoom muy de cerca, 120° gran angular extremo)
      newFov = Math.max(15, Math.min(120, newFov));
      targetFov.current = newFov;
      if (setZoomFov) {
        setZoomFov(Math.round(newFov));
      }
    };
    canvas.addEventListener('wheel', handleWheel, { passive: false });
    return () => canvas.removeEventListener('wheel', handleWheel);
  }, [gl, setZoomFov]);

  useFrame(() => {
    // Interpolar suavemente hacia el FOV objetivo (lerp)
    if (Math.abs(camera.fov - targetFov.current) > 0.01) {
      camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov.current, 0.15);
      camera.updateProjectionMatrix();
    }
  });

  return null;
}

// Esfera 3D
function PanoramaSphere({ imagePath }) {
  const texture = useLoader(THREE.TextureLoader, imagePath);
  
  // Configurar filtros de textura para alta resolución y fluidez sin difuminado
  useEffect(() => {
    if (texture) {
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.generateMipmaps = false;
      texture.colorSpace = THREE.SRGBColorSpace; // Calibración de color sRGB nativo
      texture.needsUpdate = true;
    }
  }, [texture]);

  return (
    <mesh scale={[-1, 1, 1]}>
      <sphereGeometry args={[500, 60, 40]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
}

// Fallback de carga
function LoaderFallback() {
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center bg-slate-950/90 border border-amber-500/20 backdrop-blur-lg px-8 py-6 rounded-3xl text-center shadow-2xl min-w-[260px]">
        <div className="relative flex items-center justify-center w-16 h-16 mb-4">
          <div className="absolute w-full h-full border-4 border-amber-500/20 rounded-full animate-pulse"></div>
          <div className="absolute w-full h-full border-4 border-t-amber-400 rounded-full animate-spin"></div>
          <Compass className="w-6 h-6 text-amber-400" />
        </div>
        <h4 className="text-white font-bold text-sm tracking-wide uppercase">Cargando Panorama 3D</h4>
      </div>
    </Html>
  );
}


// Componente de R3F para orientar la cámara al heading de la escena activa usando el ciclo useFrame para evitar race conditions
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

// Componente de R3F para actualizar la rotación física del Norte Magnético en tiempo real
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
    } else if (posicionTipo === 'muro') {
      const [x, y, z] = posicion || [0, 0, -20];
      const radialYaw = Math.atan2(x, z);
      
      // Muro: Mantiene la perpendicularidad con el piso (se queda sujeto al eje Y vertical)
      // Rotamos horizontalmente para encarar la cámara, pero sin inclinación en X
      node.rotation.set(0, radialYaw + Math.PI, 0);
      
      // Inclinación opcional del usuario en el eje Z local (como un cuadro torcido)
      if (inclinacion) {
        node.rotateZ((inclinacion * Math.PI) / 180);
      }
    } else {
      // 2D (Billboard clásico: mira directamente a la cámara en todos los ejes)
      const [x, y, z] = posicion || [0, 0, -20];
      const distHorizontal = Math.sqrt(x * x + z * z);
      if (distHorizontal < 2.0) {
        node.up.set(0, 0, 1);
      } else {
        node.up.set(0, 1, 0);
      }
      // En lugar de mirar rígidamente al origen 0,0,0, mira dinámicamente a la posición
      // de la cámara activa en tiempo real para asegurar una perpendicularidad perfecta
      node.lookAt(state.camera.position);
      
      // Rotar sobre su eje Z local (Giro/Roll)
      if (inclinacion) {
        node.rotateZ((inclinacion * Math.PI) / 180);
      }
      // Rotar sobre su eje X local (Inclinación frontal/Pitch)
      if (rotacion) {
        node.rotateX((rotacion * Math.PI) / 180);
      }
    }

    // 2. Control de escala (escalaZoom === false mantiene tamaño constante frente al zoom)
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
    <group ref={groupRef} position={posicion}>
      {children}
    </group>
  );
}

// Asigna la referencia de la cámara activa de Three.js al componente padre
function CameraRefAssigner({ cameraRef }) {
  const { camera } = useThree();
  
  useEffect(() => {
    if (cameraRef) {
      cameraRef.current = camera;
    }
  }, [camera, cameraRef]);

  return null;
}

// Componente Modal interactivo para seleccionar imágenes ya cargadas en el servidor del proyecto
function ProjectImageSelectorModal({ isOpen, onClose, onSelect, tourId, imageSelectorMode }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Imágenes Generales');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);

  // Limpiar seleccionados al abrir la modal
  useEffect(() => {
    if (isOpen) {
      setSelectedItems([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const fetchImages = async () => {
      setImages([]); // Reset de imágenes anteriores
      setLoading(true);
      try {
        const res = await fetch(`/api/list-project-images?tourId=${tourId}`);
        if (res.ok) {
          const data = await res.json();
          setImages(data.images || []);
          
          if (data.images && data.images.length > 0) {
            const categories = [...new Set(data.images.map(img => img.category))];
            if (categories.includes('Imágenes Generales')) {
              setActiveCategory('Imágenes Generales');
            } else if (categories.length > 0) {
              setActiveCategory(categories[0]);
            }
          }
        }
      } catch (err) {
        console.error('Error al listar imágenes del proyecto:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [isOpen, tourId]);

  if (!isOpen) return null;

  const categories = [...new Set(images.map(img => img.category))];

  const filteredImages = images.filter(img => {
    const matchesCategory = img.category === activeCategory;
    const matchesSearch = img.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleItemClick = (img) => {
    if (imageSelectorMode === 'hotspot') {
      // Selección única e inmediata para hotspot
      onSelect([{ url: img.url, filename: img.name }]);
      onClose();
    } else {
      // Selección múltiple para agregar al tour
      const isAlreadySelected = selectedItems.some(item => item.url === img.url);
      if (isAlreadySelected) {
        setSelectedItems(selectedItems.filter(item => item.url !== img.url));
      } else {
        setSelectedItems([...selectedItems, { url: img.url, filename: img.name }]);
      }
    }
  };

  const handleConfirmSelection = () => {
    if (selectedItems.length > 0) {
      onSelect(selectedItems);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={onClose}>
      <div 
        className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-white font-bold text-sm tracking-wide uppercase">
                {imageSelectorMode === 'tour' ? 'Selección Múltiple de Panorámicas' : 'Galería de Imágenes del Proyecto'}
              </h3>
              <p className="text-[10px] text-gray-500 mt-0.5">
                {imageSelectorMode === 'tour' 
                  ? 'Marca una o varias imágenes para agregarlas todas juntas al recorrido 360' 
                  : 'Selecciona una imagen alojada en las carpetas de tu servidor local'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 w-8 h-8 rounded-full transition-all cursor-pointer font-bold text-xs flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        {/* Filtros */}
        <div className="px-6 py-3 border-b border-white/5 bg-slate-950/40 flex flex-col sm:flex-row gap-3 items-center justify-between shrink-0">
          <div className="flex gap-1 bg-slate-950 p-1 rounded-xl border border-white/5 w-full sm:w-auto">
            {categories.length === 0 ? (
              <span className="text-[10px] text-gray-500 px-3 py-1.5">Sin categorías</span>
            ) : (
              categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {cat}
                </button>
              ))
            )}
          </div>

          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-slate-950 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-amber-400 font-medium w-full sm:w-64"
          />
        </div>

        {/* Grid de imágenes */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/10 min-h-[300px]">
          {loading ? (
            <div className="w-full h-full flex flex-col items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-amber-500/20 border-t-amber-400 rounded-full animate-spin"></div>
              <span className="text-xs text-gray-400 mt-3 font-semibold">Buscando imágenes locales...</span>
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="w-full h-full flex flex-col items-center justify-center py-20 text-center border border-dashed border-white/5 rounded-2xl">
              <ImageIcon className="w-12 h-12 text-gray-750 mb-2" />
              <span className="text-xs text-gray-400 font-semibold">No se encontraron imágenes</span>
              <p className="text-[10px] text-gray-600 mt-1 max-w-md">No hay archivos coincidentes en la carpeta seleccionada de `public/descargas_kuula/` o `public/tour/{tourId}/`</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {filteredImages.map((img) => {
                const isSelected = selectedItems.some(item => item.url === img.url);
                return (
                  <div
                    key={img.url}
                    onClick={() => handleItemClick(img)}
                    className={`bg-slate-950 border rounded-2xl overflow-hidden cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg flex flex-col group select-none relative ${
                      isSelected ? 'border-amber-500 ring-2 ring-amber-500/30' : 'border-white/5 hover:border-amber-400/40'
                    }`}
                  >
                    {/* Indicador visual de selección en modo Tour */}
                    {imageSelectorMode === 'tour' && (
                      <div className={`absolute top-2.5 right-2.5 z-10 w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                        isSelected 
                          ? 'bg-amber-500 border-amber-400 text-slate-950 font-bold text-[10px]' 
                          : 'bg-black/40 border-white/30 text-transparent'
                      }`}>
                        {isSelected ? '✓' : ''}
                      </div>
                    )}

                    <div className="aspect-video w-full bg-slate-900 border-b border-white/5 overflow-hidden flex items-center justify-center relative">
                      <img 
                        src={img.url ? (img.url.startsWith('http') || img.url.startsWith('data:') ? img.url : `${import.meta.env.BASE_URL.replace(/\/$/, "")}${img.url}`) : ''} 
                        alt={img.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-[10px] bg-amber-500 text-slate-950 font-bold py-1 px-2.5 rounded-full uppercase tracking-wider shadow">
                          {imageSelectorMode === 'tour' ? (isSelected ? 'Quitar' : 'Marcar') : 'Seleccionar'}
                        </span>
                      </div>
                    </div>
                    <div className="p-2.5 flex flex-col justify-between flex-1">
                      <span className="text-[10px] font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1 break-all" title={img.name}>
                        {img.name}
                      </span>
                      <span className="text-[8px] font-semibold text-gray-500 uppercase tracking-wider mt-1 block">
                        {img.category}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer con subida directa */}
        <div className="px-6 py-4 border-t border-white/10 bg-slate-950/20 flex justify-between items-center shrink-0">
          <div className="flex gap-3 items-center">
            <label className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-[10px] font-bold uppercase tracking-wider py-2.5 px-4 rounded-xl cursor-pointer transition-all active:scale-95 text-center">
              <Upload className="w-3.5 h-3.5" />
              <span>Subir archivo nuevo desde PC</span>
              <input 
                type="file" 
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  
                  setLoading(true);
                  try {
                    const base64 = await (imageSelectorMode === 'tour' ? optimizePanoramaImage(file) : optimizeNormalImage(file));
                    const rawName = file.name.replace(/\.[^/.]+$/, "");
                    const finalFilename = `${Date.now()}_${rawName}.jpg`;
                    
                    const res = await fetch('/api/upload-tour-image', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        tourId,
                        filename: finalFilename,
                        base64
                      })
                    });
                    if (res.ok) {
                      const data = await res.json();
                      if (imageSelectorMode === 'tour') {
                        setSelectedItems([...selectedItems, { url: data.url, filename: finalFilename }]);
                      } else {
                        onSelect([{ url: data.url, filename: finalFilename }]);
                        onClose();
                      }
                    } else {
                      const err = await res.json();
                      alert(`Error al subir: ${err.error}`);
                    }
                  } catch (err) {
                    console.error(err);
                    alert('Error al procesar la imagen.');
                  } finally {
                    setLoading(false);
                  }
                }}
                className="hidden" 
              />
            </label>

            {imageSelectorMode === 'tour' && selectedItems.length > 0 && (
              <span className="text-[10px] text-gray-400 font-bold font-mono">
                {selectedItems.length} seleccionada(s)
              </span>
            )}
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={onClose}
              className="bg-slate-950 hover:bg-white/5 border border-white/10 text-gray-300 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Cancelar
            </button>

            {imageSelectorMode === 'tour' && (
              <button
                disabled={selectedItems.length === 0}
                onClick={handleConfirmSelection}
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                Añadir seleccionadas ({selectedItems.length})
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
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

export default function TourEditorPage() {
  const { paramTourId } = useParams();
  const [tourId, setTourId] = useState(paramTourId || 'home');

  useEffect(() => {
    if (paramTourId) {
      setTourId(paramTourId);
    }
  }, [paramTourId]);

  const [password, setPassword] = useState('');

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('nexus_editor_auth') === 'true';
  });

  const [scenes, setScenes] = useState(initialTourData);
  const [activeSceneKey, setActiveSceneKey] = useState('sala');
  const [hoveredLoteIndex, setHoveredLoteIndex] = useState(null);

  // Estados para el modal personalizado de renombrado de imagen
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [renameTargetKey, setRenameTargetKey] = useState(null);
  const [renameValue, setRenameValue] = useState('');

  // Estados para la modal del selector de imágenes del proyecto
  const [imageSelectorOpen, setImageSelectorOpen] = useState(false);
  const [imageSelectorMode, setImageSelectorMode] = useState('hotspot'); // 'hotspot' | 'tour'
  const [targetHotspotIndex, setTargetHotspotIndex] = useState(null);

  // Al seleccionar una imagen desde la modal del proyecto
  const handleSelectProjectImage = (selection) => {
    const items = Array.isArray(selection) ? selection : [selection];
    if (items.length === 0) return;

    if (imageSelectorMode === 'hotspot' && targetHotspotIndex !== null) {
      // Caso 1: Asignar imagen al hotspot seleccionado (primer elemento)
      const newHotspots = [...activeScene.hotspots];
      newHotspots[targetHotspotIndex].url = items[0].url;
      const updated = {
        ...scenes,
        [activeSceneKey]: {
          ...activeScene,
          hotspots: newHotspots
        }
      };
      saveToLocal(updated, true);
    } else if (imageSelectorMode === 'tour') {
      // Caso 2: Agregar múltiples escenas 360 del recorrido
      const updated = { ...scenes };
      let lastSceneId = activeSceneKey;
      
      items.forEach((item, index) => {
        const rawName = item.filename.replace(/\.[^/.]+$/, "");
        // Crear un id de escena único concatenando timestamp secuencial
        const sceneId = rawName.toLowerCase().replace(/[^a-z0-9]/g, '_') + '_' + (Date.now() + index).toString().slice(-4);
        
        updated[sceneId] = {
          nombre: rawName.replace(/^[0-9]+_/, '').replace(/_/g, ' '), // Nombre legible y limpio
          imagen: item.url,
          hotspots: [],
          heading: { x: 0, y: 0 },
          norteMagnetico: 0,
          filtro: 'normal'
        };
        lastSceneId = sceneId;
      });

      saveToLocal(updated, true);
      setActiveSceneKey(lastSceneId);
      alert(`Se agregaron ${items.length} imágenes panorámicas al recorrido con éxito.`);
    }
  };

  useEffect(() => {
    const loadTourData = async () => {
      const localSaved = localStorage.getItem(`nexus_tour_data_${tourId}`);
      if (localSaved && localSaved !== 'undefined') {
        try {
          // Reemplazar en caliente rutas obsoletas a /descargas_kuula/ por /tour/
          const cleanedSaved = localSaved.replace(/\/descargas_kuula\//g, '/tour/');
          const parsed = JSON.parse(cleanedSaved);
          setScenes(parsed);
          const firstScene = Object.keys(parsed)[0];
          if (firstScene) {
            if (cleanedSaved !== localSaved) {
              localStorage.setItem(`nexus_tour_data_${tourId}`, cleanedSaved);
            }
            setActiveSceneKey(firstScene);
          }
          return;
        } catch (e) {
          console.error(e);
        }
      }

      try {
        const res = await fetch(`/src/data/tours/${tourId}.json`);
        if (res.ok) {
          const parsed = await res.json();
          setScenes(parsed);
          const firstScene = Object.keys(parsed)[0];
          if (firstScene) setActiveSceneKey(firstScene);
          localStorage.setItem(`nexus_tour_data_${tourId}`, JSON.stringify(parsed));
          return;
        }
      } catch (e) {
        console.warn(`No se encontró archivo físico para el tour: ${tourId}`);
      }

      setScenes(initialTourData);
      setActiveSceneKey('sala');
    };

    loadTourData();
  }, [tourId]);
  const [contextMenu, setContextMenu] = useState(null); // { x, y, index }
  const [activeHotspotIndex, setActiveHotspotIndex] = useState(null);
  const [activeHotspotTab, setActiveHotspotTab] = useState('contenido');
  const [galleryContextMenu, setGalleryContextMenu] = useState(null); // { x, y, sceneKey }

  useEffect(() => {
    setActiveHotspotTab('contenido');
  }, [activeHotspotIndex]);
  
  const [activeTab, setActiveTab] = useState('elementos');

  const [isDragging, setIsDragging] = useState(false);

  const [zoomFov, setZoomFov] = useState(75);
  const [isHeadingSavedFeedback, setIsHeadingSavedFeedback] = useState(false);
  const [isFinishedSavedFeedback, setIsFinishedSavedFeedback] = useState(false);
  const [isNorthSavedFeedback, setIsNorthSavedFeedback] = useState(false);
  
  // Referencia para drag and drop del recorrido
  const draggedSceneKeyRef = useRef(null);
  
  // Referencia para OrbitControls
  const orbitRef = useRef(null);
  // Referencia para capturar la cámara activa de Three.js
  const cameraRef = useRef(null);
  // Referencia para la brújula en tiempo real
  const compassRef = useRef(null);

  // Referencias para diferenciar click de drag
  const isDraggingHotspot = useRef(false);
  const dragIndex = useRef(null);

  const activeScene = scenes[activeSceneKey] || { nombre: '', imagen: '', hotspots: [], heading: { x: 0, y: 0 }, norteMagnetico: 0, filtro: 'normal' };
  const displayImage = activeScene.imagen ? (activeScene.imagen.startsWith('http') || activeScene.imagen.startsWith('data:') ? activeScene.imagen : `${import.meta.env.BASE_URL.replace(/\/$/, "")}${activeScene.imagen}`) : '';


  // Referencia para el guardado diferido (evitar lag al arrastrar sliders)
  const saveTimeoutRef = useRef(null);

  // Persistencia local con debounce para evitar lag en operaciones de alta frecuencia
  const saveToLocal = (newScenes, immediate = false) => {
    setScenes(newScenes);
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    
    if (immediate) {
      localStorage.setItem(`nexus_tour_data_${tourId}`, JSON.stringify(newScenes));
    } else {
      saveTimeoutRef.current = setTimeout(() => {
        localStorage.setItem(`nexus_tour_data_${tourId}`, JSON.stringify(newScenes));
      }, 300); // 300ms de debounce
    }
  };

  // Manejador global de pointer up para evitar bloqueos
  useEffect(() => {
    const handleGlobalPointerUp = () => {
      if (isDraggingHotspot.current) {
        isDraggingHotspot.current = false;
        dragIndex.current = null;
        setIsDragging(false);
        saveToLocal(scenes);
      }
    };
    window.addEventListener('pointerup', handleGlobalPointerUp);
    return () => window.removeEventListener('pointerup', handleGlobalPointerUp);
  }, [scenes]);

  // Obtener punto central del campo visual de la cámara para insertar elementos
  const getSpawnPosition = () => {
    const dir = new THREE.Vector3();
    if (cameraRef.current) {
      cameraRef.current.getWorldDirection(dir);
    } else {
      dir.set(0, 0, -1);
    }
    return [
      Math.round(dir.x * 20 * 100) / 100,
      Math.round(dir.y * 20 * 100) / 100,
      Math.round(dir.z * 20 * 100) / 100
    ];
  };

  // Agregar hotspot nuevo al frente
  const handleAddHotspot = () => {
    const newHs = {
      tipo: 'hotspot',
      posicion: getSpawnPosition(),
      destino: '_self',
      texto: 'Siguiente estancia',
      opacidad: 1.0,
      escala: 1.0,
      icono: 'ArrowRight',
      color: '#f59e0b',
      inclinacion: 0,
      posicionTipo: '2d',
      escalaZoom: false,
      sombra: true,
      fijo: false,
      negrita: false,
      cursiva: false,
      mostrarTextoSiempre: true,
      fuente: 'Montserrat'
    };
    const updated = {
      ...scenes,
      [activeSceneKey]: {
        ...activeScene,
        hotspots: [...(activeScene.hotspots || []), newHs]
      }
    };
    saveToLocal(updated);
    setActiveHotspotIndex((activeScene.hotspots || []).length);
    setActiveTab('elementos');
  };

  // Agregar complemento de texto
  const handleAddTextComplement = () => {
    const newText = {
      tipo: 'texto',
      posicion: getSpawnPosition(),
      texto: 'Información del espacio',
      colorTexto: '#ffffff',
      colorFondo: '#0f172a',
      opacidad: 0.9,
      escala: 1.0,
      inclinacion: 0,
      posicionTipo: '2d',
      escalaZoom: false,
      sombra: true,
      fijo: false,
      negrita: true,
      cursiva: false,
      mostrarTextoSiempre: true,
      fuente: 'Montserrat'
    };
    const updated = {
      ...scenes,
      [activeSceneKey]: {
        ...activeScene,
        hotspots: [...(activeScene.hotspots || []), newText]
      }
    };
    saveToLocal(updated);
    setActiveHotspotIndex((activeScene.hotspots || []).length);
    setActiveTab('elementos');
  };

  // Agregar complemento de imagen
  const handleAddImageComplement = () => {
    const newImage = {
      tipo: 'imagen',
      posicion: getSpawnPosition(),
      url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=600&auto=format&fit=crop',
      ancho: 200,
      alto: 150,
      opacidad: 1.0,
      escala: 1.0,
      inclinacion: 0,
      posicionTipo: '2d',
      escalaZoom: false,
      sombra: true,
      fijo: false
    };
    const updated = {
      ...scenes,
      [activeSceneKey]: {
        ...activeScene,
        hotspots: [...(activeScene.hotspots || []), newImage]
      }
    };
    saveToLocal(updated);
    setActiveHotspotIndex((activeScene.hotspots || []).length);
    setActiveTab('elementos');
  };

  // Clic derecho para abrir menú contextual
  const handleContextMenu = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      index
    });
    setActiveHotspotIndex(index);
    setActiveTab('elementos');
  };

  // Mover el punto interactivo seleccionado por drag
  const handlePointerMoveContainer = (e) => {
    if (isDraggingHotspot.current && dragIndex.current !== null && cameraRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      const mouse = new THREE.Vector2(x, y);
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, cameraRef.current);

      const targetSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 20);
      const intersectionPoint = new THREE.Vector3();
      raycaster.ray.intersectSphere(targetSphere, intersectionPoint);

      if (intersectionPoint) {
        const newHotspots = [...activeScene.hotspots];
        if (newHotspots[dragIndex.current] && !newHotspots[dragIndex.current].fijo) {
          newHotspots[dragIndex.current].posicion = [
            parseFloat(intersectionPoint.x.toFixed(2)),
            parseFloat(intersectionPoint.y.toFixed(2)),
            parseFloat(intersectionPoint.z.toFixed(2))
          ];
          const updated = {
            ...scenes,
            [activeSceneKey]: {
              ...activeScene,
              hotspots: newHotspots
            }
          };
          setScenes(updated);
        }
      }
    }
  };

  // Opción del menú contextual: Fijar / Desfijar
  const handleToggleLock = (index) => {
    const newHotspots = [...activeScene.hotspots];
    newHotspots[index].fijo = !newHotspots[index].fijo;
    const updated = {
      ...scenes,
      [activeSceneKey]: {
        ...activeScene,
        hotspots: newHotspots
      }
    };
    saveToLocal(updated);
    setContextMenu(null);
  };

  // Opción del menú contextual: Deshacer / Eliminar
  const handleDeleteHotspot = (index) => {
    const updated = {
      ...scenes,
      [activeSceneKey]: {
        ...activeScene,
        hotspots: activeScene.hotspots.filter((_, idx) => idx !== index)
      }
    };
    saveToLocal(updated);
    setContextMenu(null);
    if (activeHotspotIndex === index) {
      setActiveHotspotIndex(null);
    }
  };

  // Duplicar Hotspot/Elemento
  const handleDuplicateHotspot = (index) => {
    const hotspotToDuplicate = activeScene.hotspots[index];
    if (!hotspotToDuplicate) return;

    // Clonar en profundidad el hotspot
    const cloned = JSON.parse(JSON.stringify(hotspotToDuplicate));

    // Desplazar la posición ligeramente para evitar superposición exacta
    if (cloned.posicion) {
      cloned.posicion[0] = Math.round((cloned.posicion[0] + 0.8) * 100) / 100;
      cloned.posicion[1] = Math.round((cloned.posicion[1] + 0.8) * 100) / 100;
    }

    if (cloned.texto) {
      cloned.texto = cloned.texto + " (copia)";
    }

    const newHotspots = [...activeScene.hotspots];
    // Insertamos el duplicado después del original
    newHotspots.splice(index + 1, 0, cloned);

    const updated = {
      ...scenes,
      [activeSceneKey]: {
        ...activeScene,
        hotspots: newHotspots
      }
    };

    saveToLocal(updated, true);
    // Cambiar la selección al hotspot duplicado y abrir la pestaña de contenido
    setActiveHotspotIndex(index + 1);
    setActiveHotspotTab('contenido');
  };

  // Enfocar Hotspot en el visor 3D
  const handleFocusHotspot = (posicion) => {
    if (!posicion || !cameraRef.current || !orbitRef.current) return;
    const [x, y, z] = posicion;
    
    // Normalizar la dirección hacia el hotspot
    const direction = new THREE.Vector3(x, y, z).normalize();
    const radius = 0.1; // Radio de distancia de la cámara respecto al origen
    
    // Posicionar la cámara en el lado opuesto de la esfera, mirando hacia el hotspot (origen)
    cameraRef.current.position.set(-direction.x * radius, -direction.y * radius, -direction.z * radius);
    cameraRef.current.lookAt(0, 0, 0);
    
    orbitRef.current.target.set(0, 0, 0);
    orbitRef.current.update();
  };

  // Ajustar transparencia
  const handleOpacityChange = (index, value) => {
    const newHotspots = [...activeScene.hotspots];
    newHotspots[index].opacidad = parseFloat(value);
    const updated = {
      ...scenes,
      [activeSceneKey]: {
        ...activeScene,
        hotspots: newHotspots
      }
    };
    saveToLocal(updated);
  };

  // Ajustar escala/zoom individual del hotspot
  const handleScaleChange = (index, value) => {
    const newHotspots = [...activeScene.hotspots];
    newHotspots[index].escala = parseFloat(value);
    const updated = {
      ...scenes,
      [activeSceneKey]: {
        ...activeScene,
        hotspots: newHotspots
      }
    };
    saveToLocal(updated);
  };

  // Cambiar Destino de un Hotspot
  const handleTargetChange = (index, target) => {
    const newHotspots = [...activeScene.hotspots];
    newHotspots[index].destino = target;
    const updated = {
      ...scenes,
      [activeSceneKey]: {
        ...activeScene,
        hotspots: newHotspots
      }
    };
    saveToLocal(updated);
  };

  // Cambiar Nombre/Texto de un Hotspot
  const handleTextChange = (index, text) => {
    const newHotspots = [...activeScene.hotspots];
    newHotspots[index].texto = text;
    const updated = {
      ...scenes,
      [activeSceneKey]: {
        ...activeScene,
        hotspots: newHotspots
      }
    };
    saveToLocal(updated);
  };

  // Agregar Lote de Terreno nuevo en la escena
  const handleAddLote = () => {
    const newLote = {
      tipo: 'lote',
      posicion: getSpawnPosition(),
      manzana: 'A',
      lote: '1',
      estado: 'Disponible',
      precio: '',
      area: '',
      color: '#22c55e', // Verde para disponible por defecto
      opacidad: 1.0,
      escala: 1.0,
      inclinacion: 0,
      posicionTipo: '2d',
      escalaZoom: false,
      sombra: true,
      fijo: false,
      negrita: true,
      cursiva: false,
      mostrarTextoSiempre: true,
      fuente: 'Montserrat'
    };
    const updated = {
      ...scenes,
      [activeSceneKey]: {
        ...activeScene,
        hotspots: [...(activeScene.hotspots || []), newLote]
      }
    };
    saveToLocal(updated);
    setActiveHotspotIndex((activeScene.hotspots || []).length);
    setActiveTab('elementos');
  };

  // Agregar Manzana nueva en la escena
  const handleAddManzana = () => {
    const newManzana = {
      tipo: 'manzana',
      posicion: getSpawnPosition(),
      texto: 'MZ A',
      colorTexto: '#ffffff',
      colorFondo: '#3b82f6', // Azul por defecto
      opacidad: 1.0,
      escala: 1.0,
      inclinacion: 0,
      posicionTipo: '2d',
      escalaZoom: false,
      sombra: true,
      fijo: false,
      negrita: true,
      cursiva: false,
      mostrarTextoSiempre: true,
      fuente: 'Montserrat'
    };
    const updated = {
      ...scenes,
      [activeSceneKey]: {
        ...activeScene,
        hotspots: [...(activeScene.hotspots || []), newManzana]
      }
    };
    saveToLocal(updated);
    setActiveHotspotIndex((activeScene.hotspots || []).length);
    setActiveTab('elementos');
  };

  // Cambiar cualquier propiedad de un hotspot/elemento de forma genérica
  const handleFieldChange = (index, field, value) => {
    const newHotspots = [...activeScene.hotspots];
    newHotspots[index] = {
      ...newHotspots[index],
      [field]: value
    };
    
    // Si se modifica el estado del lote, actualizar automáticamente su color correspondiente
    if (field === 'estado') {
      const mapping = {
        'Disponible': '#22c55e',            // Verde
        'Reservado con S/. 100': '#f59e0b', // Amarillo
        'Financiado': '#f97316',            // Naranja
        'Vendido': '#ef4444'                // Rojo
      };
      newHotspots[index].color = mapping[value] || '#22c55e';
    }

    const updated = {
      ...scenes,
      [activeSceneKey]: {
        ...activeScene,
        hotspots: newHotspots
      }
    };
    saveToLocal(updated);
  };

  // Modificar Norte Magnético de la escena
  const handleNorteChange = (val) => {
    const updated = {
      ...scenes,
      [activeSceneKey]: {
        ...activeScene,
        norteMagnetico: parseInt(val) || 0
      }
    };
    saveToLocal(updated);
  };

  // Capturar vista inicial actual de la cámara
  const handleCaptureHeading = () => {
    if (orbitRef.current) {
      const azimuth = orbitRef.current.getAzimuthalAngle();
      const polar = orbitRef.current.getPolarAngle();
      
      const degY = Math.round((azimuth * 180) / Math.PI);
      const degX = Math.round(((polar - Math.PI / 2) * 180) / Math.PI);
      
      const updated = {
        ...scenes,
        [activeSceneKey]: {
          ...activeScene,
          heading: { x: degX, y: degY }
        }
      };
      saveToLocal(updated);
      
      setIsHeadingSavedFeedback(true);
      setTimeout(() => {
        setIsHeadingSavedFeedback(false);
      }, 1500);
    }
  };

  // Actualizar coordenadas manuales de la vista inicial
  const handleManualHeadingChange = (axis, val) => {
    const heading = activeScene.heading || { x: 0, y: 0 };
    const updated = {
      ...scenes,
      [activeSceneKey]: {
        ...activeScene,
        heading: {
          ...heading,
          [axis]: parseInt(val) || 0
        }
      }
    };
    saveToLocal(updated);
  };

  // Guardar orientación del Norte Magnético manualmente
  const handleManualNorthChange = (val) => {
    let angle = parseInt(val) || 0;
    angle = (angle + 360) % 360;
    const updated = {
      ...scenes,
      [activeSceneKey]: {
        ...activeScene,
        northOffset: angle
      }
    };
    saveToLocal(updated);
  };

  // Capturar el Norte Magnético en la orientación actual de la cámara
  const handleCaptureNorth = () => {
    const controls = orbitRef.current;
    if (controls) {
      const azimuth = controls.getAzimuthalAngle() || 0;
      // Convertir azimut a grados (normalizado 0 a 359)
      let azimuthDeg = Math.round((azimuth * 180) / Math.PI);
      const normalizedDeg = (azimuthDeg + 360) % 360;

      const updated = {
        ...scenes,
        [activeSceneKey]: {
          ...activeScene,
          northOffset: normalizedDeg
        }
      };
      saveToLocal(updated, true);

      setIsNorthSavedFeedback(true);
      setTimeout(() => {
        setIsNorthSavedFeedback(false);
      }, 1500);
    }
  };

  // Subir Nueva Imagen (Guardado físico local con compresión y optimización en cliente)
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      // Optimizar y comprimir en el cliente usando canvas
      const base64 = await optimizePanoramaImage(file);
      
      // Asegurar extensión .jpg por la conversión a JPEG
      const rawName = file.name.replace(/\.[^/.]+$/, "");
      const finalFilename = `${rawName}.jpg`;

      const res = await fetch('/api/upload-tour-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tourId,
          filename: finalFilename,
          base64
        })
      });
      if (res.ok) {
        const data = await res.json();
        const sceneId = rawName.toLowerCase().replace(/[^a-z0-9]/g, '_');
        const updated = {
          ...scenes,
          [sceneId]: {
            nombre: rawName,
            imagen: data.url, // Dirección física local (/tour/...)
            hotspots: [],
            heading: { x: 0, y: 0 },
            norteMagnetico: 0,
            filtro: 'normal'
          }
        };
        saveToLocal(updated, true);
        setActiveSceneKey(sceneId);
        alert(`Imagen panorámica "${file.name}" optimizada con éxito y guardada en: public/tour/${tourId}/`);
      } else {
        const err = await res.json();
        alert(`Error al subir imagen: ${err.error}`);
      }
    } catch (err) {
      console.error(err);
      alert('Error al procesar u optimizar la imagen panorámica.');
    }
  };

  // Subir imagen del complemento de tarjeta de imagen
  const handleHotspotImageUpload = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      // Optimizar la imagen antes de subirla
      const base64 = await optimizeNormalImage(file);
      
      const rawName = file.name.replace(/\.[^/.]+$/, "");
      const finalFilename = `${Date.now()}_${rawName}.jpg`;

      const res = await fetch('/api/upload-tour-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tourId,
          filename: finalFilename,
          base64
        })
      });
      if (res.ok) {
        const data = await res.json();
        const newHotspots = [...activeScene.hotspots];
        newHotspots[index].url = data.url;
        const updated = {
          ...scenes,
          [activeSceneKey]: {
            ...activeScene,
            hotspots: newHotspots
          }
        };
        saveToLocal(updated, true);
      } else {
        const err = await res.json();
        alert(`Error al subir imagen: ${err.error}`);
      }
    } catch (err) {
      console.error(err);
      alert('Error al procesar la imagen.');
    }
  };

  // Botón Terminado: Guardar configuración en archivo JSON físico
  const handleFinished = async () => {
    try {
      const res = await fetch('/api/save-tour-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tourId, scenes })
      });
      if (res.ok) {
        // Guardar copia local también
        localStorage.setItem(`nexus_tour_data_${tourId}`, JSON.stringify(scenes));
        setIsFinishedSavedFeedback(true);
        setTimeout(() => {
          setIsFinishedSavedFeedback(false);
        }, 1500);
      } else {
        const err = await res.json();
        alert(`Error al guardar: ${err.error}`);
      }
    } catch (e) {
      console.error(e);
      alert('Error de conexión al intentar guardar en disco.');
    }
  };

  // Controladores para Drag and Drop de la galería inferior (reordenación de estancias)
  const handleDragStart = (e, key) => {
    draggedSceneKeyRef.current = key;
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetKey) => {
    e.preventDefault();
    const draggedKey = draggedSceneKeyRef.current;
    if (!draggedKey || draggedKey === targetKey) return;

    const keys = Object.keys(scenes);
    const draggedIdx = keys.indexOf(draggedKey);
    const targetIdx = keys.indexOf(targetKey);
    if (draggedIdx === -1 || targetIdx === -1) return;

    const newKeys = [...keys];
    newKeys.splice(draggedIdx, 1);
    newKeys.splice(targetIdx, 0, draggedKey);

    const updated = {};
    newKeys.forEach(k => {
      updated[k] = scenes[k];
    });
    saveToLocal(updated);
    draggedSceneKeyRef.current = null;
  };

  // Clic derecho sobre una miniatura de la galería inferior
  const handleGalleryContextMenu = (e, key) => {
    e.preventDefault();
    e.stopPropagation();
    setGalleryContextMenu({
      x: e.clientX,
      y: e.clientY,
      sceneKey: key
    });
  };

  // Eliminar una escena completa de la galería
  const handleDeleteScene = (sceneKey) => {
    const newScenes = { ...scenes };
    delete newScenes[sceneKey];
    
    if (activeSceneKey === sceneKey) {
      const remainingKeys = Object.keys(newScenes);
      if (remainingKeys.length > 0) {
        setActiveSceneKey(remainingKeys[0]);
      }
    }
    saveToLocal(newScenes);
    setGalleryContextMenu(null);
  };

  // Renombrar una escena en la galería (abre modal personalizado)
  const handleRenameScene = (sceneKey) => {
    const sc = scenes[sceneKey];
    if (!sc) return;
    setRenameTargetKey(sceneKey);
    setRenameValue(sc.nombre);
    setRenameModalOpen(true);
  };

  const handleRenameConfirm = () => {
    if (renameTargetKey && renameValue.trim() !== "") {
      const sc = scenes[renameTargetKey];
      if (sc) {
        const updated = {
          ...scenes,
          [renameTargetKey]: {
            ...sc,
            nombre: renameValue.trim()
          }
        };
        saveToLocal(updated, true);
      }
    }
    setRenameModalOpen(false);
    setRenameTargetKey(null);
  };

  // Limpiar menús contextuales al hacer clic fuera
  useEffect(() => {
    const closeMenus = () => {
      setContextMenu(null);
      setGalleryContextMenu(null);
    };
    window.addEventListener('click', closeMenus);
    return () => window.removeEventListener('click', closeMenus);
  }, []);

  return (
    <div className="fixed inset-0 w-screen h-screen z-[999] bg-slate-950 flex flex-col font-sans select-none text-gray-300">
      
      {/* 1. Header Superior */}
      <div className="bg-slate-900 border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest font-mono">Editor Interno de Recorrido 3D</span>
            <h1 className="text-white text-base font-bold tracking-tight">Nexus Rise 360° Studio</h1>
          </div>
        </div>

        <button 
          onClick={handleFinished}
          className={`font-bold text-xs px-6 py-3 rounded-full uppercase tracking-wider transition-all shadow-lg flex items-center gap-2 cursor-pointer active:scale-95 ${
            isFinishedSavedFeedback 
              ? 'bg-green-500 text-slate-950 shadow-[0_0_20px_rgba(34,197,94,0.4)] animate-pulse' 
              : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.25)]'
          }`}
        >
          <Save className="w-4 h-4" />
          {isFinishedSavedFeedback ? "✓ ¡Copiado y Guardado!" : "Terminado y Guardar"}
        </button>
      </div>

      {/* 2. Cuerpo del Editor (Dividido en 80% Visor / 20% Panel) */}
      <div className="flex-1 flex flex-row overflow-hidden relative">
        
        {/* 80% Visor de Edición (Izquierda) */}
        <div className="w-[80%] h-full relative flex flex-col bg-black">
          
          {/* Espacio del Canvas 3D */}
          <div 
            className="flex-1 w-full relative overflow-hidden"
            onPointerMove={handlePointerMoveContainer}
          >
            <Canvas 
              camera={{ position: [0, 0, 0.1] }}
              dpr={[1, 2]}
              className="w-full h-full"
              style={{ filter: getFilterCss(activeScene.filtro) }}
              gl={{ 
                antialias: true, 
                toneMapping: THREE.ACESFilmicToneMapping, 
                toneMappingExposure: 1.05,
                preserveDrawingBuffer: true
              }}
            >
              <Suspense fallback={<LoaderFallback />}>
                {displayImage && <PanoramaSphere imagePath={displayImage} />}
                
                {activeScene.hotspots?.map((hs, index) => {
                  const itemTipo = hs.tipo || 'hotspot';
                  const shadowFilter = hs.sombra 
                    ? 'drop-shadow(0 10px 15px rgba(0,0,0,0.65))' 
                    : 'none';
                  
                  const isTransform = (hs.posicionTipo === 'piso' || hs.posicionTipo === 'muro');
                  const distFactor = (!isTransform && hs.escalaZoom !== false) ? 15 : undefined;

                  const wrapperStyle = {
                    opacity: hs.opacidad ?? 1,
                    transform: isTransform ? undefined : `scale(${hs.escala ?? 1.0}) rotateZ(${hs.inclinacion ?? 0}deg) rotateX(${hs.rotacion ?? 0}deg)`,
                    filter: shadowFilter
                  };

                  return (
                    <HotspotGroup
                      key={index}
                      posicion={hs.posicion}
                      posicionTipo={hs.posicionTipo}
                      inclinacion={hs.inclinacion}
                      rotacion={hs.rotacion}
                      escalaZoom={hs.escalaZoom}
                      escala={hs.escala}
                    >
                      <Html 
                        position={[0, 0, 0]}
                        center 
                        distanceFactor={distFactor}
                        transform={isTransform}
                      >
                        <div 
                          onPointerDown={(e) => {
                            e.stopPropagation();
                            setActiveHotspotIndex(index);
                            setActiveTab('elementos');
                            setHoveredLoteIndex(hoveredLoteIndex === index ? null : index);
                            if (hs.fijo) return;
                            isDraggingHotspot.current = true;
                            dragIndex.current = index;
                            setIsDragging(true);
                          }}
                          onMouseEnter={() => setHoveredLoteIndex(index)}
                          onMouseLeave={() => setHoveredLoteIndex(null)}
                          onContextMenu={(e) => handleContextMenu(e, index)}
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            if (itemTipo === 'hotspot') {
                              if (hs.destino && hs.destino !== '_self') {
                                setActiveSceneKey(hs.destino);
                                setActiveHotspotIndex(null);
                              }
                            }
                          }}
                          className={`group flex items-center justify-center transition-all duration-200 select-none ${
                            hs.fijo ? 'cursor-not-allowed' : 'cursor-grab active:cursor-grabbing hover:scale-105'
                          }`}
                          style={wrapperStyle}
                        >
                          {itemTipo === 'hotspot' && (
                            <>
                              <div 
                                className="absolute inline-flex h-10 w-10 rounded-full animate-ping"
                                style={{ 
                                  backgroundColor: hs.fondoTransparente ? 'transparent' : (hs.color ? `${hs.color}33` : 'rgba(245, 158, 11, 0.2)'),
                                  border: hs.fondoTransparente ? 'none' : `1px solid ${hs.color || '#f59e0b'}` 
                                }}
                              ></div>
                              <div 
                                className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-white shadow-lg"
                                style={{
                                  background: hs.color 
                                    ? `linear-gradient(to top right, ${hs.color}, ${hs.color}dd)` 
                                    : 'linear-gradient(to top right, #f59e0b, #d97706)',
                                  boxShadow: `0 0 15px ${hs.color || '#f59e0b'}`
                                }}
                              >
                                {(() => {
                                  const IconComponent = IconMap[hs.icono] || ChevronRight;
                                  return <IconComponent className="w-4 h-4" />;
                                })()}
                              </div>
                              <div 
                                className="absolute bottom-10 border border-white/10 px-2.5 py-1.5 rounded-xl font-medium shadow-2xl z-50 pointer-events-none"
                                style={{
                                  color: hs.colorTexto || '#ffffff',
                                  backgroundColor: hs.fondoTransparente ? 'transparent' : (hs.colorFondo || 'rgba(15, 23, 42, 0.9)'),
                                  borderColor: hs.fondoTransparente ? 'transparent' : 'rgba(255, 255, 255, 0.1)',
                                  fontSize: `${hs.fontSize || 10}px`,
                                  whiteSpace: 'pre-line',
                                  textAlign: 'center',
                                  backdropFilter: hs.fondoTransparente ? 'none' : 'blur(4px)',
                                  width: 'max-content',
                                  fontWeight: hs.negrita ? 'bold' : 'normal',
                                  fontStyle: hs.cursiva ? 'italic' : 'normal',
                                  fontFamily: hs.fuente ? `'${hs.fuente}', sans-serif` : "'Montserrat', sans-serif"
                                }}
                              >
                                <span>{hs.texto || (hs.destino === '_self' ? 'Información' : `👉 ${scenes[hs.destino]?.nombre || hs.destino}`)}</span>
                              </div>
                            </>
                          )}

                          {itemTipo === 'texto' && (
                            <div 
                              style={{ 
                                color: hs.colorTexto || '#ffffff',
                                backgroundColor: hs.fondoTransparente ? 'transparent' : (hs.colorFondo || 'rgba(15, 23, 42, 0.85)'),
                                boxShadow: hs.sombra ? '0 12px 24px rgba(0,0,0,0.5)' : 'none',
                                transform: isTransform ? `scale(${hs.escala ?? 1.0})` : undefined,
                                fontSize: `${hs.fontSize || 14}px`,
                                whiteSpace: 'pre-line',
                                textAlign: 'center',
                                width: 'max-content',
                                fontWeight: hs.negrita !== false ? 'bold' : 'normal',
                                fontStyle: hs.cursiva ? 'italic' : 'normal',
                                fontFamily: hs.fuente ? `'${hs.fuente}', sans-serif` : "'Montserrat', sans-serif"
                              }}
                              className="px-4 py-2.5 rounded-2xl border border-white/10 backdrop-blur-md flex items-center justify-center gap-2"
                            >
                              {!hs.fondoTransparente && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shrink-0"></span>}
                              <span>{hs.texto}</span>
                            </div>
                          )}

                          {itemTipo === 'imagen' && (
                            <div 
                              style={{ 
                                width: `${hs.ancho || 200}px`,
                                height: `${hs.alto || 150}px`,
                                boxShadow: hs.sombra ? '0 15px 30px rgba(0,0,0,0.55)' : 'none',
                                transform: isTransform ? `scale(${hs.escala ?? 1.0})` : undefined,
                                backgroundColor: hs.fondoTransparente ? 'transparent' : 'rgb(2, 6, 23)'
                              }}
                              className="rounded-2xl overflow-hidden border border-white/15 flex flex-col"
                            >
                              {hs.url ? (
                                <img src={hs.url ? (hs.url.startsWith('http') || hs.url.startsWith('data:') ? hs.url : `${import.meta.env.BASE_URL.replace(/\/$/, "")}${hs.url}`) : ''} alt="Vista" className="w-full h-full object-cover pointer-events-none" />

                              ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-[10px] text-gray-500 p-4 text-center">
                                  <span>Sin imagen</span>
                                </div>
                              )}
                            </div>
                          )}

                          {itemTipo === 'lote' && (
                            <div 
                              style={{ 
                                scale: hs.escala ?? 1.0,
                                transform: isTransform ? `scale(${hs.escala ?? 1.0})` : undefined,
                              }}
                              className="group relative flex items-center justify-center transition-all duration-300"
                            >
                              {/* Anillo exterior premium con degrandado */}
                              <div
                                className="absolute h-10 w-10 rounded-full border backdrop-blur-sm bg-black/10 border-white/40"
                              ></div>

                              {/* Botón interactivo central con el color de su estado */}
                              <div
                                className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-white font-black text-xs shadow-lg font-sans"
                                style={{
                                  background: hs.color || '#22c55e',
                                  boxShadow: `0 0 15px ${hs.color || '#22c55e'}`
                                }}
                              >
                                {hs.lote || '1'}
                              </div>

                              {/* Etiqueta de texto (Tooltip) */}
                              <div
                                className={`absolute bottom-10 border border-white/10 px-2.5 py-1.5 rounded-xl shadow-2xl z-50 pointer-events-none transition-all duration-300 origin-bottom bg-slate-900/90 text-white font-mono text-[9px] w-max text-center backdrop-blur-sm ${
                                  hoveredLoteIndex === index ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                                }`}
                              >
                                <strong>Mz {hs.manzana || 'A'} - Lote {hs.lote || '1'}</strong>
                                <span className="block text-[8px] mt-0.5" style={{ color: hs.color }}>
                                  ● {hs.estado || 'Disponible'}
                                </span>
                                {hs.precio && <span className="block text-[8px] text-gray-300 mt-0.5">{formatPrecio(hs.precio)}</span>}
                                {hs.area && <span className="block text-[8px] text-gray-400 mt-0.5">{formatArea(hs.area)}</span>}
                              </div>
                            </div>
                          )}

                          {itemTipo === 'manzana' && (
                            <div 
                              style={{ 
                                color: hs.colorTexto || '#ffffff',
                                backgroundColor: hs.colorFondo || '#3b82f6',
                                boxShadow: hs.sombra ? '0 10px 20px rgba(0,0,0,0.45)' : 'none',
                                transform: isTransform ? `scale(${hs.escala ?? 1.0})` : undefined,
                                fontSize: `${hs.fontSize || 13}px`,
                                fontWeight: hs.negrita !== false ? 'bold' : 'normal',
                                fontStyle: hs.cursiva ? 'italic' : 'normal',
                                opacity: hs.opacidad ?? 1.0,
                                scale: hs.escala ?? 1.0,
                                fontFamily: hs.fuente ? `'${hs.fuente}', sans-serif` : "'Montserrat', sans-serif"
                              }}
                              className="px-3.5 py-1.5 rounded-full border border-white/20 backdrop-blur-sm flex items-center justify-center font-bold tracking-wide uppercase w-max select-none pointer-events-auto transition-all duration-300"
                            >
                              <span>{hs.texto || 'MZ'}</span>
                            </div>
                          )}
                        </div>
                      </Html>
                    </HotspotGroup>
                  );
                })}
              </Suspense>
 
              <OrbitControls 
                ref={orbitRef}
                enableZoom={false}
                enablePan={false}
                rotateSpeed={-0.45}
                enableDamping={false}
                enabled={!isDragging}
              />
              <FovZoomController zoomFov={zoomFov} setZoomFov={setZoomFov} />
              <CameraRefAssigner cameraRef={cameraRef} />
              <HeadingController heading={activeScene.heading} activeSceneKey={activeSceneKey} controlsRef={orbitRef} />
              <CompassController controlsRef={orbitRef} compassRef={compassRef} northOffset={activeScene.northOffset || 0} />
            </Canvas>

            {/* Menú Contextual (Clic derecho) */}
            {contextMenu && (
              <div 
                className="absolute bg-slate-900 border border-white/10 p-2 rounded-2xl shadow-2xl w-48 z-[999] flex flex-col gap-1 text-xs"
                style={{ top: contextMenu.y - 65, left: contextMenu.x }}
                onClick={(e) => e.stopPropagation()}
              >
                <button 
                  onClick={() => handleToggleLock(contextMenu.index)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/5 text-left w-full transition-colors cursor-pointer text-gray-300 font-semibold"
                >
                  {activeScene.hotspots[contextMenu.index]?.fijo ? (
                    <>
                      <Unlock className="w-3.5 h-3.5 text-green-400" />
                      <span>Desbloquear</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Fijar posición</span>
                    </>
                  )}
                </button>

                {(!activeScene.hotspots[contextMenu.index]?.tipo || activeScene.hotspots[contextMenu.index]?.tipo === 'hotspot') && (
                  <>
                    <div className="px-3 py-2 flex flex-col gap-1 border-t border-white/5">
                      <span className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Cambiar Icono</span>
                      <div className="grid grid-cols-4 gap-1 mt-1">
                        {Object.keys(IconMap).slice(0, 8).map((iconName) => {
                          const IconComp = IconMap[iconName];
                          const isSelected = activeScene.hotspots[contextMenu.index]?.icono === iconName || (!activeScene.hotspots[contextMenu.index]?.icono && iconName === 'ArrowRight');
                          return (
                            <button
                              key={iconName}
                              onClick={() => {
                                const newHotspots = [...activeScene.hotspots];
                                newHotspots[contextMenu.index].icono = iconName;
                                const updated = {
                                  ...scenes,
                                  [activeSceneKey]: {
                                    ...activeScene,
                                    hotspots: newHotspots
                                  }
                                };
                                saveToLocal(updated);
                              }}
                              className={`p-1 rounded flex items-center justify-center border transition-all ${
                                isSelected ? 'bg-amber-500/20 border-amber-400 text-amber-400' : 'bg-slate-950 border-white/5 text-gray-400 hover:text-white'
                              }`}
                              title={iconName}
                            >
                              <IconComp className="w-3.5 h-3.5" />
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="px-3 py-2 flex flex-col gap-1 border-t border-white/5">
                      <span className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Color del Icono</span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <input
                          type="color"
                          value={activeScene.hotspots[contextMenu.index]?.color || '#f59e0b'}
                          onChange={(e) => {
                            const newHotspots = [...activeScene.hotspots];
                            newHotspots[contextMenu.index].color = e.target.value;
                            const updated = {
                              ...scenes,
                              [activeSceneKey]: {
                                ...activeScene,
                                hotspots: newHotspots
                              }
                            };
                            saveToLocal(updated);
                          }}
                          className="w-6 h-6 rounded bg-transparent border-0 cursor-pointer"
                        />
                        <span className="text-[10px] font-mono text-gray-300">{activeScene.hotspots[contextMenu.index]?.color || '#f59e0b'}</span>
                      </div>
                    </div>
                  </>
                )}

                <div className="px-3 py-2 flex flex-col gap-1 border-t border-white/5">
                  <span className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Transparencia</span>
                  <input 
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.1"
                    value={activeScene.hotspots[contextMenu.index]?.opacidad ?? 1.0}
                    onChange={(e) => handleOpacityChange(contextMenu.index, e.target.value)}
                    className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                </div>

                <div className="px-3 py-2 flex flex-col gap-1 border-t border-b border-white/5">
                  <span className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Escala ({Math.round((activeScene.hotspots[contextMenu.index]?.escala ?? 1.0) * 100)}%)</span>
                  <input 
                    type="range"
                    min="0.2"
                    max="5.0"
                    step="0.1"
                    value={activeScene.hotspots[contextMenu.index]?.escala ?? 1.0}
                    onChange={(e) => handleScaleChange(contextMenu.index, e.target.value)}
                    className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                </div>

                <button 
                  onClick={() => handleDeleteHotspot(contextMenu.index)}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-red-500/10 text-left w-full transition-colors cursor-pointer text-red-400 font-semibold"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Eliminar Elemento</span>
                </button>
              </div>
            )}

            {/* Botón flotante de Brújula (Norte Magnético) */}
            <div className="absolute top-4 right-4 z-20 pointer-events-auto">
              <button
                onClick={() => {
                  if (!orbitRef.current) return;
                  const controls = orbitRef.current;
                  const camera = controls.object;
                  if (camera) {
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
                }}
                className="group p-2.5 rounded-xl glass-panel border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200 cursor-pointer shadow-lg flex items-center justify-center relative bg-slate-950/40"
                title="Norte Magnético. Clic para orientar al Norte"
              >
                <div className="w-6 h-6 rounded-full border border-white/25 flex items-center justify-center relative bg-slate-950/40">
                  <span className="absolute top-[-2.5px] text-[7.5px] font-bold text-red-500 font-mono tracking-tighter">N</span>
                  <div 
                    ref={compassRef} 
                    className="w-full h-full flex items-center justify-center"
                    style={{ transform: `rotate(${(activeScene.northOffset || 0)}deg)` }}
                  >
                    <svg width="8" height="18" viewBox="0 0 8 18" fill="none" className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                      <path d="M4 1L7 9H1L4 1Z" fill="#ef4444" />
                      <path d="M4 17L1 9H7L4 17Z" fill="#cbd5e1" />
                    </svg>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Galería Inferior del Recorrido */}
          <div className="bg-slate-900 border-t border-white/10 p-4 flex flex-col gap-2.5 z-20 select-none">
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Recorrido de Imágenes del Proyecto</span>
              <button 
                onClick={() => {
                  setImageSelectorMode('tour');
                  setImageSelectorOpen(true);
                }}
                className="flex items-center gap-1.5 text-[10px] text-amber-400 hover:text-amber-300 font-bold uppercase tracking-wider bg-transparent border-0 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Agregar Imagen 360</span>
              </button>
            </div>
            
            <div className="flex gap-4 overflow-x-auto pb-1 px-1 scrollbar-thin scrollbar-thumb-white/10">
              {Object.keys(scenes).map((sceneKey) => {
                const sc = scenes[sceneKey];
                const isActive = activeSceneKey === sceneKey;
                return (
                  <div 
                    key={`gallery-scene-${sceneKey}`}
                    onClick={() => {
                      setActiveSceneKey(sceneKey);
                      setActiveHotspotIndex(null);
                    }}
                    onContextMenu={(e) => handleGalleryContextMenu(e, sceneKey)}
                    draggable
                    onDragStart={(e) => handleDragStart(e, sceneKey)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, sceneKey)}
                    className="flex flex-col items-center gap-1.5 cursor-grab active:cursor-grabbing min-w-[125px] group select-none"
                  >
                    <div className={`w-full h-14 rounded-xl bg-cover bg-center border-2 transition-all relative overflow-hidden ${
                      isActive 
                        ? 'border-amber-400 scale-[1.02] shadow-[0_0_12px_rgba(245,158,11,0.4)]' 
                        : 'border-white/10 hover:border-white/30'
                    }`} style={{ backgroundImage: `url(${sc.imagen ? (sc.imagen.startsWith('http') || sc.imagen.startsWith('data:') ? sc.imagen : `${import.meta.env.BASE_URL.replace(/\/$/, "")}${sc.imagen}`) : ''})` }}>

                      <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors" />
                    </div>
                    <span className={`text-[9px] font-bold truncate max-w-full text-center tracking-wide uppercase ${
                      isActive ? 'text-amber-400' : 'text-gray-400 group-hover:text-white'
                    }`}>
                      {sc.nombre}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Menú Contextual de la Galería */}
          {galleryContextMenu && (
            <div 
              className="fixed bg-slate-900 border border-white/10 p-2 rounded-2xl shadow-2xl w-44 z-[999] flex flex-col gap-1 text-xs"
              style={{ top: galleryContextMenu.y - 75, left: galleryContextMenu.x }}
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => {
                  handleRenameScene(galleryContextMenu.sceneKey);
                  setGalleryContextMenu(null);
                }}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/5 text-left w-full transition-colors cursor-pointer text-gray-300 font-semibold"
              >
                <Type className="w-3.5 h-3.5 text-amber-400" />
                <span>Renombrar Imagen</span>
              </button>

              <button 
                onClick={() => handleDeleteScene(galleryContextMenu.sceneKey)}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-red-500/10 text-left w-full transition-colors cursor-pointer text-red-400 font-semibold border-t border-white/5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Eliminar Imagen</span>
              </button>
            </div>
          )}

        </div>

        {/* 20% Panel Lateral con Navegación por Pestañas (Derecha) */}
        <div className="w-[20%] min-w-[300px] h-full bg-slate-950 border-l border-white/10 flex flex-col z-20">
          
          {/* Navegación por Pestañas */}
          <div className="flex border-b border-white/10 text-[10px] uppercase font-bold tracking-wider select-none shrink-0">
            <button
              onClick={() => setActiveTab('añadir')}
              className={`flex-1 py-3.5 text-center transition-all border-b-2 font-mono ${
                activeTab === 'añadir'
                  ? 'border-amber-400 text-amber-400 bg-white/5'
                  : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              ➕ Añadir
            </button>
            <button
              onClick={() => setActiveTab('elementos')}
              className={`flex-1 py-3.5 text-center transition-all border-b-2 font-mono ${
                activeTab === 'elementos'
                  ? 'border-amber-400 text-amber-400 bg-white/5'
                  : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              ✏️ Elementos
            </button>
            <button
              onClick={() => setActiveTab('ajustes')}
              className={`flex-1 py-3.5 text-center transition-all border-b-2 font-mono ${
                activeTab === 'ajustes'
                  ? 'border-amber-400 text-amber-400 bg-white/5'
                  : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              ⚙️ Ajustes
            </button>
          </div>

          {/* Contenido de la Pestaña Activa */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-white/10">
            
            {/* Pestaña: AJUSTES */}
            {activeTab === 'ajustes' && (
              <div className="space-y-5 animate-fade-in">
                {/* Nombre de la Estancia Activa */}
                <div className="space-y-1.5 p-3.5 bg-slate-900/50 border border-white/5 rounded-2xl">
                  <label className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">Nombre de la Imagen</label>
                  <input
                    type="text"
                    value={activeScene.nombre || ''}
                    onChange={(e) => {
                      const updated = {
                        ...scenes,
                        [activeSceneKey]: {
                          ...activeScene,
                          nombre: e.target.value
                        }
                      };
                      saveToLocal(updated);
                    }}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-400 font-semibold"
                    placeholder="ej: Sala Principal, Entrada"
                  />
                </div>

                {/* ID del Proyecto / Carpeta */}
                <div className="space-y-1.5 p-3.5 bg-slate-900/50 border border-white/5 rounded-2xl">
                  <label className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">Proyecto ID (Carpeta)</label>
                  <input
                    type="text"
                    value={tourId}
                    onChange={(e) => setTourId(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-400 font-mono font-semibold"
                    placeholder="ej: home, residencial_las_lomas"
                  />
                  <p className="text-[9px] text-gray-500 italic mt-1.5 leading-relaxed">
                    Las fotos 360 se guardarán en `public/tour/[Proyecto ID]/` y la configuración en `src/data/tours/[Proyecto ID].json`.
                  </p>
                </div>


                {/* Zoom de Visualización Slider */}
                <div className="space-y-2 pt-1.5 border-t border-white/5">
                  <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    <span>Zoom de Cámara (FOV)</span>
                    <span className="font-mono text-white">{zoomFov}°</span>
                  </div>
                  <input 
                    type="range"
                    min="5"
                    max="150"
                    value={zoomFov}
                    onChange={(e) => setZoomFov(parseInt(e.target.value))}
                    className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                </div>

                {/* Filtros de Imagen */}
                <div className="space-y-2 pt-3 border-t border-white/5">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Filtro de Escena</span>
                  <select
                    value={activeScene.filtro || 'normal'}
                    onChange={(e) => {
                      const updated = {
                        ...scenes,
                        [activeSceneKey]: {
                          ...activeScene,
                          filtro: e.target.value
                        }
                      };
                      saveToLocal(updated);
                    }}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white outline-none focus:border-amber-400 transition-all font-semibold"
                  >
                    <option value="normal">Normal (Sin Filtro)</option>
                    <option value="vivid">Mejora de Color (Vívido)</option>
                    <option value="bright">Luminoso (Interiores Amplios)</option>
                    <option value="hdr">HDR Realista (Alto Detalle)</option>
                    <option value="warm">Cálido Atardecer (Warm)</option>
                    <option value="cold">Frío Refrescante (Cool)</option>
                    <option value="grayscale">Blanco y Negro Artístico</option>
                  </select>
                </div>

                {/* Vista Inicial (Heading) */}
                <div className="space-y-3 p-3 bg-slate-900/50 border border-white/5 rounded-2xl">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Vista Inicial</span>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 bg-slate-900 border border-white/10 px-2.5 py-2 rounded-xl flex-1">
                      <span className="text-[9px] font-mono text-gray-500">Lat (X)</span>
                      <input 
                        type="number" 
                        value={activeScene.heading?.x || 0}
                        onChange={(e) => handleManualHeadingChange('x', e.target.value)}
                        className="w-full bg-transparent text-xs text-white border-none outline-none font-mono"
                      />
                      <span className="text-[9px] text-gray-500">°</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-slate-900 border border-white/10 px-2.5 py-2 rounded-xl flex-1">
                      <span className="text-[9px] font-mono text-gray-500">Lon (Y)</span>
                      <input 
                        type="number" 
                        value={activeScene.heading?.y || 0}
                        onChange={(e) => handleManualHeadingChange('y', e.target.value)}
                        className="w-full bg-transparent text-xs text-white border-none outline-none font-mono"
                      />
                      <span className="text-[9px] text-gray-500">°</span>
                    </div>
                  </div>
                  <button 
                    onClick={handleCaptureHeading}
                    className={`w-full font-bold text-[10px] py-2.5 rounded-xl uppercase tracking-wider transition-colors cursor-pointer text-center block ${
                      isHeadingSavedFeedback 
                        ? 'bg-green-500 text-slate-950 border border-green-400 shadow-[0_0_15px_rgba(34,197,94,0.3)] animate-pulse'
                        : 'bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400'
                    }`}
                  >
                    {isHeadingSavedFeedback ? "✓ ¡Vista Guardada!" : "Capturar Vista Actual"}
                  </button>
                </div>

                {/* Norte Magnético (Brújula) */}
                <div className="space-y-3 p-3 bg-slate-900/50 border border-white/5 rounded-2xl">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Norte Magnético</span>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 bg-slate-900 border border-white/10 px-2.5 py-2 rounded-xl flex-1">
                      <span className="text-[9px] font-mono text-gray-500">Ángulo (Z)</span>
                      <input 
                        type="number" 
                        value={activeScene.northOffset || 0}
                        onChange={(e) => handleManualNorthChange(e.target.value)}
                        className="w-full bg-transparent text-xs text-white border-none outline-none font-mono"
                        min="0"
                        max="359"
                      />
                      <span className="text-[9px] text-gray-500">°</span>
                    </div>
                  </div>
                  <button 
                    onClick={handleCaptureNorth}
                    className={`w-full font-bold text-[10px] py-2.5 rounded-xl uppercase tracking-wider transition-colors cursor-pointer text-center block ${
                      isNorthSavedFeedback 
                        ? 'bg-green-500 text-slate-950 border border-green-400 shadow-[0_0_15px_rgba(34,197,94,0.3)] animate-pulse'
                        : 'bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400'
                    }`}
                  >
                    {isNorthSavedFeedback ? "✓ ¡Norte Guardado!" : "Establecer Norte Aquí"}
                  </button>
                </div>
              </div>
            )}

            {/* Pestaña: AÑADIR */}
            {activeTab === 'añadir' && (
              <div className="space-y-4 animate-fade-in select-none">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Crear Elemento en Escena</span>
                
                <button
                  onClick={handleAddHotspot}
                  className="w-full flex items-center justify-between p-4 bg-slate-900 hover:bg-slate-850 border border-white/5 hover:border-amber-500/30 rounded-2xl transition-all text-left text-xs cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-105 transition-transform">
                      <Plus className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white">Punto de Conexión</h4>
                      <p className="text-[10px] text-gray-500 mt-0.5">Enlace a otra fotografía 360°</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                </button>

                <button
                  onClick={handleAddTextComplement}
                  className="w-full flex items-center justify-between p-4 bg-slate-900 hover:bg-slate-850 border border-white/5 hover:border-cyan-500/30 rounded-2xl transition-all text-left text-xs cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:scale-105 transition-transform">
                      <Type className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white">Nota de Texto</h4>
                      <p className="text-[10px] text-gray-500 mt-0.5">Anotación o título flotante en 3D</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                </button>

                <button
                  onClick={handleAddImageComplement}
                  className="w-full flex items-center justify-between p-4 bg-slate-900 hover:bg-slate-850 border border-white/5 hover:border-green-500/30 rounded-2xl transition-all text-left text-xs cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-green-500/10 text-green-400 group-hover:scale-105 transition-transform">
                      <ImageIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white">Tarjeta de Imagen</h4>
                      <p className="text-[10px] text-gray-500 mt-0.5">Carga una imagen plana descriptiva</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                </button>

                <button
                  onClick={handleAddLote}
                  className="w-full flex items-center justify-between p-4 bg-slate-900 hover:bg-slate-850 border border-white/5 hover:border-emerald-500/30 rounded-2xl transition-all text-left text-xs cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-105 transition-transform">
                      <Home className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white">Lote de Terreno</h4>
                      <p className="text-[10px] text-gray-500 mt-0.5">Marcador de lote con estado y color</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                </button>

                <button
                  onClick={handleAddManzana}
                  className="w-full flex items-center justify-between p-4 bg-slate-900 hover:bg-slate-850 border border-white/5 hover:border-cyan-500/30 rounded-2xl transition-all text-left text-xs cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:scale-105 transition-transform">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white">Etiqueta de Manzana</h4>
                      <p className="text-[10px] text-gray-500 mt-0.5">Identificador de manzana con color personalizado</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                </button>

                <p className="text-[9px] text-gray-500 italic mt-6 leading-relaxed bg-white/5 p-3 rounded-xl border border-white/5">
                  💡 Los elementos nuevos se insertarán directamente en el centro de tu campo visual actual. Podrás arrastrarlos libremente por la pantalla para reubicarlos.
                </p>
              </div>
            )}

            {/* Pestaña: ELEMENTOS */}
            {activeTab === 'elementos' && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                  <Layers className="w-4 h-4 text-amber-400" />
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ajustes de Elementos</span>
                </div>

                {activeScene.hotspots?.length === 0 ? (
                  <p className="text-gray-600 text-[10px] italic py-6 text-center border border-dashed border-white/5 rounded-2xl">
                    Ningún elemento en esta escena. Ve a la pestaña "Añadir" para crear uno.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {activeScene.hotspots?.map((hs, index) => {
                      const itemTipo = hs.tipo || 'hotspot';

                      if (activeHotspotIndex !== index) {
                        return (
                          <div 
                            key={index}
                            onClick={() => {
                              setActiveHotspotIndex(index);
                              setActiveTab('elementos');
                            }}
                            className="p-3 bg-slate-900/40 border border-white/5 hover:border-white/10 rounded-2xl transition-all cursor-pointer flex justify-between items-center text-xs group"
                          >
                            <div className="flex items-center gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteHotspot(index);
                                }}
                                className="p-1 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer mr-0.5"
                                title="Eliminar Elemento"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                              <span className="text-[10px] font-bold font-mono text-amber-400/80">#{index + 1}</span>
                              <span className="font-semibold text-white/90 truncate max-w-[170px] flex items-center gap-1.5">
                                {itemTipo === 'hotspot' && `🔗 Conexión: ${hs.destino}`}
                                {itemTipo === 'texto' && `📝 Texto: ${hs.texto}`}
                                {itemTipo === 'imagen' && `🖼️ Imagen`}
                                {itemTipo === 'lote' && (
                                  <>
                                    <span 
                                      className="w-2 h-2 rounded-full inline-block shrink-0 animate-pulse" 
                                      style={{ backgroundColor: hs.color || '#22c55e' }}
                                    />
                                    <span>🏡 Lote Mz {hs.manzana || 'A'}-{hs.lote || '1'}</span>
                                  </>
                                )}
                                {itemTipo === 'manzana' && (
                                  <>
                                    <span 
                                      className="w-2 h-2 rounded-full inline-block shrink-0" 
                                      style={{ backgroundColor: hs.colorFondo || '#3b82f6' }}
                                    />
                                    <span>🏷️ Mz: {hs.texto}</span>
                                  </>
                                )}
                              </span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-amber-400 transition-colors" />
                          </div>
                        );
                      }

                      return (
                        <div 
                          key={index}
                          className="p-3 bg-slate-900 border border-amber-400/40 rounded-2xl transition-all text-white space-y-3"
                        >
                          <div 
                            className="flex justify-between items-center cursor-pointer select-none"
                            onClick={() => setActiveHotspotIndex(null)}
                          >
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-bold font-mono text-amber-400">Punto #{index + 1}</span>
                              <span className="text-[9px] bg-white/10 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider text-gray-300">
                                {itemTipo === 'hotspot' && 'Conexión'}
                                {itemTipo === 'texto' && 'Texto'}
                                {itemTipo === 'imagen' && 'Imagen'}
                                {itemTipo === 'lote' && 'Lote'}
                                {itemTipo === 'manzana' && 'Manzana'}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                              <button
                                type="button"
                                onClick={() => handleFocusHotspot(hs.posicion)}
                                className="p-1 rounded bg-slate-950 border border-white/10 hover:border-amber-400 hover:text-amber-400 text-gray-400 transition-colors cursor-pointer"
                                title="Enfocar en visor 3D"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDuplicateHotspot(index)}
                                className="p-1 rounded bg-slate-950 border border-white/10 hover:border-amber-400 hover:text-amber-400 text-gray-400 transition-colors cursor-pointer"
                                title="Duplicar elemento"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleToggleLock(index)}
                                className="text-[8px] bg-slate-950 border border-white/10 hover:bg-white/5 text-gray-400 px-1.5 py-1 rounded-lg font-mono cursor-pointer"
                              >
                                {hs.fijo ? '🔒 Fijo' : '🔓 Libre'}
                              </button>
                              <div className="cursor-pointer p-0.5 text-amber-400" onClick={() => setActiveHotspotIndex(null)}>
                                <ChevronDown className="w-4 h-4" />
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3 text-xs">
                            {/* Selector de Sub-pestañas */}
                            <div className="flex bg-slate-950 p-1 rounded-xl border border-white/5 gap-1 select-none text-[9px] font-bold uppercase tracking-wider">
                              <button
                                type="button"
                                onClick={() => setActiveHotspotTab('contenido')}
                                className={`flex-1 py-1.5 rounded-lg text-center transition-all cursor-pointer ${
                                  activeHotspotTab === 'contenido'
                                    ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                              >
                                Contenido
                              </button>
                              {(itemTipo === 'hotspot' || itemTipo === 'texto' || itemTipo === 'manzana') && (
                                <button
                                  type="button"
                                  onClick={() => setActiveHotspotTab('estilo')}
                                  className={`flex-1 py-1.5 rounded-lg text-center transition-all cursor-pointer ${
                                    activeHotspotTab === 'estilo'
                                      ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                                  }`}
                                >
                                  Estilo
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => setActiveHotspotTab('dimensiones')}
                                className={`flex-1 py-1.5 rounded-lg text-center transition-all cursor-pointer ${
                                  activeHotspotTab === 'dimensiones'
                                    ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                              >
                                Posición & 3D
                              </button>
                            </div>

                            {/* SUB-PESTAÑA 1: CONTENIDO */}
                            {activeHotspotTab === 'contenido' && (
                              <div className="space-y-2.5 animate-fade-in">
                                {itemTipo === 'hotspot' && (
                                  <>
                                    <div className="space-y-1">
                                      <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block">Texto descriptivo</label>
                                      <textarea 
                                        rows={3}
                                        value={hs.texto} 
                                        onChange={(e) => handleTextChange(index, e.target.value)}
                                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white outline-none focus:border-amber-400 font-medium"
                                      />
                                    </div>

                                    <div className="space-y-1">
                                      <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block">Estancia Destino</label>
                                      <select 
                                        value={hs.destino}
                                        onChange={(e) => handleTargetChange(index, e.target.value)}
                                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-2 py-1.5 text-xs text-white outline-none focus:border-amber-400 font-semibold"
                                      >
                                        <option value="_self">Ninguno (Solo etiqueta informativa)</option>
                                        {Object.keys(scenes).map((sceneKey) => (
                                          <option key={sceneKey} value={sceneKey}>
                                            {scenes[sceneKey].nombre}
                                          </option>
                                        ))}
                                      </select>
                                    </div>

                                    <div className="space-y-1">
                                      <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block">Icono</label>
                                      <select
                                        value={hs.icono || 'ArrowRight'}
                                        onChange={(e) => {
                                          const newHotspots = [...activeScene.hotspots];
                                          newHotspots[index].icono = e.target.value;
                                          const updated = {
                                            ...scenes,
                                            [activeSceneKey]: {
                                              ...activeScene,
                                              hotspots: newHotspots
                                            }
                                          };
                                          saveToLocal(updated);
                                        }}
                                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-2 py-1.5 text-xs text-white outline-none focus:border-amber-400 font-semibold"
                                      >
                                        {Object.keys(IconMap).map((iconKey) => (
                                          <option key={iconKey} value={iconKey}>
                                            {iconKey}
                                          </option>
                                        ))}
                                      </select>
                                    </div>

                                    <div className="space-y-1">
                                      <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block">Color del Icono</label>
                                      <div className="flex items-center gap-2">
                                        <input
                                          type="color"
                                          value={hs.color || '#f59e0b'}
                                          onChange={(e) => {
                                            const newHotspots = [...activeScene.hotspots];
                                            newHotspots[index].color = e.target.value;
                                            const updated = {
                                              ...scenes,
                                              [activeSceneKey]: {
                                                ...activeScene,
                                                hotspots: newHotspots
                                              }
                                            };
                                            saveToLocal(updated);
                                          }}
                                          className="w-8 h-8 rounded-lg bg-transparent border-0 cursor-pointer"
                                        />
                                        <span className="text-[10px] font-mono">{hs.color || '#f59e0b'}</span>
                                      </div>
                                    </div>
                                  </>
                                )}

                                {itemTipo === 'texto' && (
                                  <div className="space-y-1">
                                    <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block">Texto de la nota</label>
                                    <textarea 
                                      rows={3}
                                      value={hs.texto} 
                                      onChange={(e) => handleTextChange(index, e.target.value)}
                                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white outline-none focus:border-amber-400 font-medium"
                                    />
                                  </div>
                                )}

                                {itemTipo === 'imagen' && (
                                  <>
                                    <div className="space-y-2.5">
                                      <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block">Imagen del Elemento</span>
                                      
                                      <div className="border border-white/10 bg-slate-950 rounded-2xl p-3 flex flex-col gap-2.5 items-center justify-center min-h-[110px] relative overflow-hidden group/img">
                                        {hs.url ? (
                                          <>
                                            <img 
                                              src={hs.url ? (hs.url.startsWith('http') || hs.url.startsWith('data:') ? hs.url : `${import.meta.env.BASE_URL.replace(/\/$/, "")}${hs.url}`) : ''} 
                                              alt="Vista previa" 
                                              className="max-h-[100px] object-contain rounded-lg border border-white/10"
                                            />
                                            <button
                                              type="button"
                                              onClick={() => {
                                                const newHotspots = [...activeScene.hotspots];
                                                newHotspots[index].url = '';
                                                const updated = {
                                                  ...scenes,
                                                  [activeSceneKey]: {
                                                    ...activeScene,
                                                    hotspots: newHotspots
                                                  }
                                                };
                                                saveToLocal(updated, true);
                                              }}
                                              className="absolute top-1.5 right-1.5 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full shadow-lg transition-transform scale-90 active:scale-75 cursor-pointer z-10"
                                              title="Quitar Imagen"
                                            >
                                              <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                          </>
                                        ) : (
                                          <div className="text-center py-2 flex flex-col items-center justify-center">
                                            <ImageIcon className="w-7 h-7 text-gray-600 mb-1" />
                                            <span className="text-[10px] text-gray-500">Sin archivo seleccionado</span>
                                          </div>
                                        )}
                                      </div>

                                      <div className="flex gap-2">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setImageSelectorMode('hotspot');
                                            setTargetHotspotIndex(index);
                                            setImageSelectorOpen(true);
                                          }}
                                          className="flex-1 flex items-center justify-center gap-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-[10px] font-bold uppercase tracking-wider py-2.5 px-4 rounded-xl transition-all active:scale-95 cursor-pointer text-center"
                                        >
                                          <Layers className="w-3.5 h-3.5" />
                                          <span>Galería</span>
                                        </button>

                                        <label className="flex-1 flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-[10px] font-bold uppercase tracking-wider py-2.5 px-4 rounded-xl cursor-pointer transition-all active:scale-95 text-center">
                                          <Upload className="w-3.5 h-3.5" />
                                          <span>Subir PC</span>
                                          <input 
                                            type="file" 
                                            accept="image/*"
                                            onChange={(e) => handleHotspotImageUpload(e, index)}
                                            className="hidden" 
                                          />
                                        </label>
                                      </div>

                                      <div className="space-y-1">
                                        <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block">O pegar URL externa</label>
                                        <input 
                                          type="text" 
                                          value={hs.url || ''} 
                                          onChange={(e) => {
                                            const newHotspots = [...activeScene.hotspots];
                                            newHotspots[index].url = e.target.value;
                                            const updated = {
                                              ...scenes,
                                              [activeSceneKey]: {
                                                ...activeScene,
                                                hotspots: newHotspots
                                              }
                                            };
                                            saveToLocal(updated);
                                          }}
                                          placeholder="https://..."
                                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-2 py-1.5 text-xs text-white outline-none focus:border-amber-400 font-mono"
                                        />
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                      <div className="space-y-1">
                                        <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block">Ancho (px)</label>
                                        <input 
                                          type="number" 
                                          value={hs.ancho || 200} 
                                          onChange={(e) => {
                                            const newHotspots = [...activeScene.hotspots];
                                            newHotspots[index].ancho = parseInt(e.target.value) || 200;
                                            const updated = {
                                              ...scenes,
                                              [activeSceneKey]: {
                                                ...activeScene,
                                                hotspots: newHotspots
                                              }
                                            };
                                            saveToLocal(updated);
                                          }}
                                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-2 py-1.5 text-xs text-white outline-none focus:border-amber-400"
                                        />
                                      </div>
                                      <div className="space-y-1">
                                        <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block">Alto (px)</label>
                                        <input 
                                          type="number" 
                                          value={hs.alto || 150} 
                                          onChange={(e) => {
                                            const newHotspots = [...activeScene.hotspots];
                                            newHotspots[index].alto = parseInt(e.target.value) || 150;
                                            const updated = {
                                              ...scenes,
                                              [activeSceneKey]: {
                                                ...activeScene,
                                                hotspots: newHotspots
                                              }
                                            };
                                            saveToLocal(updated);
                                          }}
                                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-2 py-1.5 text-xs text-white outline-none focus:border-amber-400"
                                        />
                                      </div>
                                    </div>
                                  </>
                                )}

                                {itemTipo === 'lote' && (
                                  <>
                                    <div className="space-y-3">
                                      <div className="space-y-1">
                                        <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block">Letra de la Manzana</label>
                                        <input 
                                          type="text" 
                                          value={hs.manzana || ''} 
                                          onChange={(e) => handleFieldChange(index, 'manzana', e.target.value.toUpperCase())}
                                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white outline-none focus:border-amber-400 font-semibold"
                                          placeholder="ej: A, B, C..."
                                        />
                                      </div>

                                      <div className="space-y-1">
                                        <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block">Número de Lote</label>
                                        <input 
                                          type="text" 
                                          value={hs.lote || ''} 
                                          onChange={(e) => handleFieldChange(index, 'lote', e.target.value)}
                                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white outline-none focus:border-amber-400 font-semibold"
                                          placeholder="ej: 1, 2, 3..."
                                        />
                                      </div>

                                      <div className="space-y-1">
                                        <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block">Estado de Disponibilidad</label>
                                        <select
                                          value={hs.estado || 'Disponible'}
                                          onChange={(e) => handleFieldChange(index, 'estado', e.target.value)}
                                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white outline-none focus:border-amber-400 font-semibold cursor-pointer"
                                        >
                                          <option value="Disponible">Disponible (🟢 Verde)</option>
                                          <option value="Reservado con S/. 100">Reservado con S/. 100 (🟡 Amarillo)</option>
                                          <option value="Financiado">Financiado (🟠 Naranja)</option>
                                          <option value="Vendido">Vendido (🔴 Rojo)</option>
                                        </select>
                                      </div>

                                      <div className="space-y-1">
                                        <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block">Precio (Opcional)</label>
                                        <input 
                                          type="text" 
                                          value={hs.precio || ''} 
                                          onChange={(e) => handleFieldChange(index, 'precio', e.target.value)}
                                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white outline-none focus:border-amber-400 font-semibold"
                                          placeholder="ej: S/. 45,000"
                                        />
                                      </div>

                                      <div className="space-y-1">
                                        <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block">Área m² (Opcional)</label>
                                        <input 
                                          type="text" 
                                          value={hs.area || ''} 
                                          onChange={(e) => handleFieldChange(index, 'area', e.target.value)}
                                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white outline-none focus:border-amber-400 font-semibold"
                                          placeholder="ej: 120 m²"
                                        />
                                      </div>
                                    </div>
                                  </>
                                )}

                                {itemTipo === 'manzana' && (
                                  <>
                                    <div className="space-y-3">
                                      <div className="space-y-1">
                                        <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block">Nombre / Letra de la Manzana</label>
                                        <input 
                                          type="text" 
                                          value={hs.texto || ''} 
                                          onChange={(e) => handleFieldChange(index, 'texto', e.target.value)}
                                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white outline-none focus:border-amber-400 font-semibold"
                                          placeholder="ej: MZ A, MANZANA B..."
                                        />
                                      </div>
                                      
                                      <p className="text-[9px] text-gray-500 italic mt-4 leading-relaxed bg-white/5 p-3 rounded-xl border border-white/5">
                                        💡 Puedes personalizar el color de fondo, color del texto, tamaño y fuente de este elemento en la pestaña superior "Estilo".
                                      </p>
                                    </div>
                                  </>
                                )}
                              </div>
                            )}

                            {/* SUB-PESTAÑA 2: ESTILO */}
                            {activeHotspotTab === 'estilo' && (itemTipo === 'hotspot' || itemTipo === 'texto' || itemTipo === 'manzana') && (
                              <div className="space-y-2.5 animate-fade-in">
                                {/* Tamaño de Letra */}
                                <div className="space-y-1">
                                  <div className="flex justify-between items-center text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                                    <span>Tamaño de Letra</span>
                                    <span className="font-mono text-white">{hs.fontSize || (itemTipo === 'texto' ? 14 : (itemTipo === 'manzana' ? 13 : 10))}px</span>
                                  </div>
                                  <input 
                                    type="range"
                                    min="10"
                                    max="40"
                                    value={hs.fontSize || (itemTipo === 'texto' ? 14 : (itemTipo === 'manzana' ? 13 : 10))}
                                    onChange={(e) => {
                                      const newHotspots = [...activeScene.hotspots];
                                      newHotspots[index].fontSize = parseInt(e.target.value);
                                      const updated = {
                                        ...scenes,
                                        [activeSceneKey]: {
                                          ...activeScene,
                                          hotspots: newHotspots
                                        }
                                      };
                                      saveToLocal(updated);
                                    }}
                                    className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                                  />
                                </div>

                                {/* Color de Texto */}
                                <div className="space-y-1">
                                  <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block">Color del Texto</label>
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="color"
                                      value={hs.colorTexto || '#ffffff'}
                                      onChange={(e) => {
                                        const newHotspots = [...activeScene.hotspots];
                                        newHotspots[index].colorTexto = e.target.value;
                                        const updated = {
                                          ...scenes,
                                          [activeSceneKey]: {
                                            ...activeScene,
                                            hotspots: newHotspots
                                          }
                                        };
                                        saveToLocal(updated);
                                      }}
                                      className="w-8 h-8 rounded-lg bg-transparent border-0 cursor-pointer"
                                    />
                                    <span className="text-[10px] font-mono">{hs.colorTexto || '#ffffff'}</span>
                                  </div>
                                </div>

                                {/* Color de Fondo */}
                                <div className="space-y-1">
                                  <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block">Color de Fondo del Texto</label>
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="color"
                                      disabled={hs.fondoTransparente}
                                      value={hs.colorFondo || '#0f172a'}
                                      onChange={(e) => {
                                        const newHotspots = [...activeScene.hotspots];
                                        newHotspots[index].colorFondo = e.target.value;
                                        const updated = {
                                          ...scenes,
                                          [activeSceneKey]: {
                                            ...activeScene,
                                            hotspots: newHotspots
                                          }
                                        };
                                        saveToLocal(updated);
                                      }}
                                      className="w-8 h-8 rounded-lg bg-transparent border-0 cursor-pointer disabled:opacity-40"
                                    />
                                    <span className="text-[10px] font-mono">{hs.fondoTransparente ? 'Transparente' : (hs.colorFondo || '#0f172a')}</span>
                                  </div>
                                </div>

                                {/* Tipografía */}
                                <div className="space-y-1">
                                  <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block">Tipografía</label>
                                  <select
                                    value={hs.fuente || 'Montserrat'}
                                    onChange={(e) => {
                                      const newHotspots = [...activeScene.hotspots];
                                      newHotspots[index].fuente = e.target.value;
                                      const updated = {
                                        ...scenes,
                                        [activeSceneKey]: {
                                          ...activeScene,
                                          hotspots: newHotspots
                                        }
                                      };
                                      saveToLocal(updated);
                                    }}
                                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white outline-none focus:border-amber-400 font-semibold"
                                  >
                                    <option value="Montserrat">Montserrat (Geométrica Premium)</option>
                                    <option value="Poppins">Poppins (Redondeada Moderna)</option>
                                    <option value="Archivo Black">Archivo Black (Ultra Robusta)</option>
                                    <option value="Syne">Syne (Ancha Artística)</option>
                                    <option value="Outfit">Outfit (Geométrica Fuerte)</option>
                                    <option value="Anton">Anton (Condensada de Impacto)</option>
                                    <option value="Unbounded">Unbounded (Súper Ancha Futurista)</option>
                                  </select>
                                </div>

                                {/* Fondo Transparente */}
                                <div className="pt-1 select-none">
                                  <label className="flex items-center gap-2 cursor-pointer text-[9px] font-bold uppercase tracking-wider text-gray-400">
                                    <input
                                      type="checkbox"
                                      checked={hs.fondoTransparente ?? false}
                                      onChange={(e) => {
                                        const newHotspots = [...activeScene.hotspots];
                                        newHotspots[index].fondoTransparente = e.target.checked;
                                        const updated = {
                                          ...scenes,
                                          [activeSceneKey]: {
                                            ...activeScene,
                                            hotspots: newHotspots
                                          }
                                        };
                                        saveToLocal(updated, true);
                                      }}
                                      className="w-3.5 h-3.5 rounded border-white/10 text-amber-500 bg-slate-950 accent-amber-500 cursor-pointer"
                                    />
                                    <span>Fondo Transparente</span>
                                  </label>
                                </div>

                                {/* Mostrar texto siempre */}
                                <div className="pt-1 select-none">
                                  <label className="flex items-center gap-2 cursor-pointer text-[9px] font-bold uppercase tracking-wider text-gray-400">
                                    <input
                                      type="checkbox"
                                      checked={hs.mostrarTextoSiempre ?? true}
                                      onChange={(e) => {
                                        const newHotspots = [...activeScene.hotspots];
                                        newHotspots[index].mostrarTextoSiempre = e.target.checked;
                                        const updated = {
                                          ...scenes,
                                          [activeSceneKey]: {
                                            ...activeScene,
                                            hotspots: newHotspots
                                          }
                                        };
                                        saveToLocal(updated, true);
                                      }}
                                      className="w-3.5 h-3.5 rounded border-white/10 text-amber-500 bg-slate-950 accent-amber-500 cursor-pointer"
                                    />
                                    <span>Mostrar texto siempre</span>
                                  </label>
                                </div>

                                {/* Negrita y Cursiva */}
                                <div className="flex gap-4 pt-1 select-none">
                                  <label className="flex items-center gap-2 cursor-pointer text-[9px] font-bold uppercase tracking-wider text-gray-400">
                                    <input
                                      type="checkbox"
                                      checked={itemTipo === 'texto' ? (hs.negrita !== false) : (hs.negrita ?? false)}
                                      onChange={(e) => {
                                        const newHotspots = [...activeScene.hotspots];
                                        newHotspots[index].negrita = e.target.checked;
                                        const updated = {
                                          ...scenes,
                                          [activeSceneKey]: {
                                            ...activeScene,
                                            hotspots: newHotspots
                                          }
                                        };
                                        saveToLocal(updated, true);
                                      }}
                                      className="w-3.5 h-3.5 rounded border-white/10 text-amber-500 bg-slate-950 accent-amber-500 cursor-pointer"
                                    />
                                    <span className="font-bold">Negrita (B)</span>
                                  </label>

                                  <label className="flex items-center gap-2 cursor-pointer text-[9px] font-bold uppercase tracking-wider text-gray-400">
                                    <input
                                      type="checkbox"
                                      checked={hs.cursiva ?? false}
                                      onChange={(e) => {
                                        const newHotspots = [...activeScene.hotspots];
                                        newHotspots[index].cursiva = e.target.checked;
                                        const updated = {
                                          ...scenes,
                                          [activeSceneKey]: {
                                            ...activeScene,
                                            hotspots: newHotspots
                                          }
                                        };
                                        saveToLocal(updated, true);
                                      }}
                                      className="w-3.5 h-3.5 rounded border-white/10 text-amber-500 bg-slate-950 accent-amber-500 cursor-pointer"
                                    />
                                    <span className="italic">Cursiva (I)</span>
                                  </label>
                                </div>
                              </div>
                            )}

                            {/* SUB-PESTAÑA 3: DIMENSIONES Y 3D */}
                            {activeHotspotTab === 'dimensiones' && (
                              <div className="space-y-2.5 animate-fade-in">
                                {/* Orientación (2D, Piso, Muro) */}
                                <div className="space-y-1">
                                  <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block">Orientación Espacial</label>
                                  <div className="flex gap-1 bg-slate-950 p-1 rounded-xl border border-white/5">
                                    {['2d', 'piso', 'muro'].map((mode) => (
                                      <button
                                        type="button"
                                        key={mode}
                                        onClick={() => {
                                          const newHotspots = [...activeScene.hotspots];
                                          newHotspots[index].posicionTipo = mode;
                                          if (mode === 'piso') {
                                            newHotspots[index].inclinacion = 0;
                                          } else if (mode === 'muro') {
                                            newHotspots[index].rotacion = 0;
                                          }
                                          const updated = {
                                            ...scenes,
                                            [activeSceneKey]: {
                                              ...activeScene,
                                              hotspots: newHotspots
                                            }
                                          };
                                          saveToLocal(updated);
                                        }}
                                        className={`flex-1 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                                          (hs.posicionTipo || '2d') === mode
                                            ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        }`}
                                      >
                                        {mode === '2d' ? '2D' : mode === 'piso' ? 'PISO' : 'MURO'}
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                {/* Transparencia */}
                                <div className="space-y-1">
                                  <div className="flex justify-between items-center text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                                    <span>Transparencia</span>
                                    <span className="font-mono text-white">{hs.opacidad ?? 1.0}</span>
                                  </div>
                                  <input 
                                    type="range"
                                    min="0.1"
                                    max="1.0"
                                    step="0.1"
                                    value={hs.opacidad ?? 1.0}
                                    onChange={(e) => handleOpacityChange(index, e.target.value)}
                                    className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                                  />
                                </div>

                                {/* Escala */}
                                <div className="space-y-1">
                                  <div className="flex justify-between items-center text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                                    <span>Escala ({Math.round((hs.escala ?? 1.0) * 100)}%)</span>
                                    <span className="font-mono text-white">{hs.escala ?? 1.0}</span>
                                  </div>
                                  <input 
                                    type="range"
                                    min="0.2"
                                    max="5.0"
                                    step="0.1"
                                    value={hs.escala ?? 1.0}
                                    onChange={(e) => handleScaleChange(index, e.target.value)}
                                    className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                                  />
                                </div>

                                {/* Checkbox Escala al Hacer Zoom */}
                                <div className="pt-1 select-none">
                                  <label className="flex items-center gap-2 cursor-pointer text-[9px] font-bold uppercase tracking-wider text-gray-400">
                                    <input
                                      type="checkbox"
                                      checked={hs.escalaZoom !== false}
                                      onChange={(e) => {
                                        const newHotspots = [...activeScene.hotspots];
                                        newHotspots[index].escalaZoom = e.target.checked;
                                        const updated = {
                                          ...scenes,
                                          [activeSceneKey]: {
                                            ...activeScene,
                                            hotspots: newHotspots
                                          }
                                        };
                                        saveToLocal(updated);
                                      }}
                                      className="w-3.5 h-3.5 rounded border-white/10 text-amber-500 bg-slate-950 accent-amber-500 cursor-pointer"
                                    />
                                    <span>Escala al hacer zoom</span>
                                  </label>
                                </div>

                                {/* Checkbox Sombra */}
                                <div className="pt-1 select-none">
                                  <label className="flex items-center gap-2 cursor-pointer text-[9px] font-bold uppercase tracking-wider text-gray-400">
                                    <input
                                      type="checkbox"
                                      checked={hs.sombra ?? true}
                                      onChange={(e) => {
                                        const newHotspots = [...activeScene.hotspots];
                                        newHotspots[index].sombra = e.target.checked;
                                        const updated = {
                                          ...scenes,
                                          [activeSceneKey]: {
                                            ...activeScene,
                                            hotspots: newHotspots
                                          }
                                        };
                                        saveToLocal(updated);
                                      }}
                                      className="w-3.5 h-3.5 rounded border-white/10 text-amber-500 bg-slate-950 accent-amber-500 cursor-pointer"
                                    />
                                    <span>Activar Sombra</span>
                                  </label>
                                </div>

                                {/* Fondo Transparente para Imágenes */}
                                {itemTipo === 'imagen' && (
                                  <div className="pt-1 select-none">
                                    <label className="flex items-center gap-2 cursor-pointer text-[9px] font-bold uppercase tracking-wider text-gray-400">
                                      <input
                                        type="checkbox"
                                        checked={hs.fondoTransparente ?? false}
                                        onChange={(e) => {
                                          const newHotspots = [...activeScene.hotspots];
                                          newHotspots[index].fondoTransparente = e.target.checked;
                                          const updated = {
                                            ...scenes,
                                            [activeSceneKey]: {
                                              ...activeScene,
                                              hotspots: newHotspots
                                            }
                                          };
                                          saveToLocal(updated, true);
                                        }}
                                        className="w-3.5 h-3.5 rounded border-white/10 text-amber-500 bg-slate-950 accent-amber-500 cursor-pointer"
                                      />
                                      <span>Fondo Transparente</span>
                                    </label>
                                  </div>
                                )}

                                {/* Inclinación en el Espacio */}
                                <div className="space-y-2.5 pt-3 border-t border-white/5">
                                  <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block">Inclinación en el Espacio</span>
                                  
                                  {/* Inclinación Eje X */}
                                  <div className={`space-y-1 ${(hs.posicionTipo === 'muro') ? 'opacity-40 pointer-events-none' : ''}`}>
                                    <div className="flex justify-between items-center text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                                      <span>Inclinación Eje X {(hs.posicionTipo === 'muro') && <span className="text-amber-500 font-mono text-[8px]">(Fijo a 0°)</span>}</span>
                                      <div className="flex items-center gap-1.5">
                                        <input 
                                          type="number"
                                          min="-180"
                                          max="180"
                                          disabled={hs.posicionTipo === 'muro'}
                                          value={hs.posicionTipo === 'muro' ? 0 : (hs.rotacion ?? 0)}
                                          onChange={(e) => {
                                            let val = parseInt(e.target.value);
                                            if (isNaN(val)) val = 0;
                                            val = Math.max(-180, Math.min(180, val));
                                            const newHotspots = [...activeScene.hotspots];
                                            newHotspots[index].rotacion = val;
                                            const updated = {
                                              ...scenes,
                                              [activeSceneKey]: {
                                                ...activeScene,
                                                hotspots: newHotspots
                                              }
                                            };
                                            saveToLocal(updated);
                                          }}
                                          className="w-14 bg-slate-950 border border-white/10 rounded px-1.5 py-0.5 text-center text-white font-mono text-[9px] outline-none focus:border-amber-400"
                                        />
                                        <span>°</span>
                                      </div>
                                    </div>
                                    <input 
                                      type="range"
                                      min="-180"
                                      max="180"
                                      disabled={hs.posicionTipo === 'muro'}
                                      value={hs.posicionTipo === 'muro' ? 0 : (hs.rotacion ?? 0)}
                                      onChange={(e) => {
                                        const newHotspots = [...activeScene.hotspots];
                                        newHotspots[index].rotacion = parseInt(e.target.value);
                                        const updated = {
                                          ...scenes,
                                          [activeSceneKey]: {
                                            ...activeScene,
                                            hotspots: newHotspots
                                          }
                                        };
                                        saveToLocal(updated);
                                      }}
                                      className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                                    />
                                  </div>

                                  {/* Inclinación Eje Y */}
                                  <div className={`space-y-1 ${(hs.posicionTipo === 'piso') ? 'opacity-40 pointer-events-none' : ''}`}>
                                    <div className="flex justify-between items-center text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                                      <span>Inclinación Eje Y {(hs.posicionTipo === 'piso') && <span className="text-amber-500 font-mono text-[8px]">(Fijo a 0°)</span>}</span>
                                      <div className="flex items-center gap-1.5">
                                        <input 
                                          type="number"
                                          min="-180"
                                          max="180"
                                          disabled={hs.posicionTipo === 'piso'}
                                          value={hs.posicionTipo === 'piso' ? 0 : (hs.inclinacion ?? 0)}
                                          onChange={(e) => {
                                            let val = parseInt(e.target.value);
                                            if (isNaN(val)) val = 0;
                                            val = Math.max(-180, Math.min(180, val));
                                            const newHotspots = [...activeScene.hotspots];
                                            newHotspots[index].inclinacion = val;
                                            const updated = {
                                              ...scenes,
                                              [activeSceneKey]: {
                                                ...activeScene,
                                                hotspots: newHotspots
                                              }
                                            };
                                            saveToLocal(updated);
                                          }}
                                          className="w-14 bg-slate-950 border border-white/10 rounded px-1.5 py-0.5 text-center text-white font-mono text-[9px] outline-none focus:border-amber-400"
                                        />
                                        <span>°</span>
                                      </div>
                                    </div>
                                    <input 
                                      type="range"
                                      min="-180"
                                      max="180"
                                      disabled={hs.posicionTipo === 'piso'}
                                      value={hs.posicionTipo === 'piso' ? 0 : (hs.inclinacion ?? 0)}
                                      onChange={(e) => {
                                        const newHotspots = [...activeScene.hotspots];
                                        newHotspots[index].inclinacion = parseInt(e.target.value);
                                        const updated = {
                                          ...scenes,
                                          [activeSceneKey]: {
                                            ...activeScene,
                                            hotspots: newHotspots
                                          }
                                        };
                                        saveToLocal(updated);
                                      }}
                                      className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                                    />
                                  </div>
                                </div>

                                {/* Coordenadas Físicas */}
                                <div className="space-y-1 pt-3 border-t border-white/5">
                                  <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block">Coordenadas X, Y, Z</label>
                                  <div className="grid grid-cols-3 gap-1 font-mono text-[9px] text-center text-gray-400">
                                    <div className="bg-slate-950 px-1.5 py-1 rounded">X: {hs.posicion[0]}</div>
                                    <div className="bg-slate-950 px-1.5 py-1 rounded">Y: {hs.posicion[1]}</div>
                                    <div className="bg-slate-950 px-1.5 py-1 rounded">Z: {hs.posicion[2]}</div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Botón de Eliminar siempre visible abajo para comodidad */}
                            <div className="pt-3 border-t border-white/5">
                              <button 
                                type="button"
                                onClick={() => handleDeleteHotspot(index)}
                                className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 w-full transition-colors cursor-pointer text-xs font-semibold"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Eliminar Elemento</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Modal interactiva de Galería del Proyecto */}
      <ProjectImageSelectorModal
        isOpen={imageSelectorOpen}
        onClose={() => setImageSelectorOpen(false)}
        onSelect={handleSelectProjectImage}
        tourId={tourId}
        imageSelectorMode={imageSelectorMode}
      />

      {/* Modal Personalizado de Renombrado de Imagen */}
      {renameModalOpen && (
        <div 
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in"
          onClick={() => {
            setRenameModalOpen(false);
            setRenameTargetKey(null);
          }}
        >
          <div 
            className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-sm flex flex-col shadow-2xl overflow-hidden p-6 gap-4 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
                <Type className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-white font-bold text-xs tracking-wide uppercase">
                  Renombrar Imagen
                </h3>
                <p className="text-[10px] text-gray-500 mt-0.5">
                  Modifica el nombre de visualización en el editor
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Nuevo Nombre de la Imagen</label>
              <input
                type="text"
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                autoFocus
                onFocus={(e) => e.currentTarget.select()}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleRenameConfirm();
                  } else if (e.key === 'Escape') {
                    setRenameModalOpen(false);
                    setRenameTargetKey(null);
                  }
                }}
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-amber-400 font-semibold"
                placeholder="ej: Sala Principal"
              />
            </div>

            <div className="flex gap-2 justify-end pt-1">
              <button 
                onClick={() => {
                  setRenameModalOpen(false);
                  setRenameTargetKey(null);
                }}
                className="bg-slate-950 hover:bg-white/5 border border-white/10 text-gray-300 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Cancelar
              </button>

              <button
                disabled={renameValue.trim() === ''}
                onClick={handleRenameConfirm}
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
