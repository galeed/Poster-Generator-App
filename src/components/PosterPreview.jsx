import React, { useRef, useState } from 'react';
import { toPng } from 'html-to-image';

export const PosterPreview = ({ album, styleVariant }) => {
  const posterRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  const handleExport = async () => {
    if (!posterRef.current || downloading) return;
    setDownloading(true);

    try {
      // Configuración robusta para evitar fallos por imágenes cross-origin de Spotify
      const dataUrl = await toPng(posterRef.current, {
        quality: 0.95,
        pixelRatio: 2,
        cacheBust: true,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left'
        }
      });

      const link = document.createElement('a');
      const cleanFileName = (album.name || 'poster')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-');

      link.download = `${cleanFileName}-poster.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error al exportar poster:', err);
      alert('Ocurrió un error al generar la imagen. Intenta de nuevo.');
    } finally {
      setDownloading(false);
    }
  };

  const isAtmospheric = styleVariant === 'atmospheric';
  const tracks = album.tracks || [];
  const trackCount = tracks.length;

  // Cálculo inteligente de tamaño de fuente y columnas para que NUNCA se corten
  const getTracklistConfig = () => {
    if (trackCount > 20) {
      return { cols: 'grid-cols-3 gap-x-2 gap-y-0.5', text: 'text-[6px] leading-[8px]' };
    }
    if (trackCount > 12) {
      return { cols: 'grid-cols-2 gap-x-3 gap-y-0.5', text: 'text-[7.5px] leading-[10px]' };
    }
    if (trackCount > 6) {
      return { cols: 'grid-cols-2 gap-x-4 gap-y-1', text: 'text-[9px] leading-[12px]' };
    }
    return { cols: 'grid-cols-1 gap-y-1.5', text: 'text-[10px] leading-[14px]' };
  };

  const trackConfig = getTracklistConfig();

  return (
    <div className="flex flex-col items-center gap-6 my-4">
      {/* Contenedor con proporciones físicas de póster (380px x 570px) */}
      <div
        ref={posterRef}
        id="poster-canvas"
        className={`w-[380px] min-h-[570px] h-[570px] p-6 shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden relative ${getStyleClasses(styleVariant)}`}
      >
        {/* Fondo Atmosférico (Atmospheric Style) */}
        {isAtmospheric && (
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <img
              src={album.coverUrl}
              alt=""
              className="w-full h-full object-cover scale-150 blur-3xl opacity-50 saturate-200"
              crossOrigin="anonymous"
            />
            <div className="absolute inset-0 bg-neutral-950/70 backdrop-blur-md" />
          </div>
        )}

        {/* Estructura Interna */}
        <div className="relative z-10 flex flex-col h-full justify-between gap-2">
          {/* Cabecera: Portada + Detalles del Álbum */}
          <div className="flex-shrink-0">
            <div className="w-full aspect-square overflow-hidden mb-3 shadow-xl rounded-sm bg-neutral-800">
              <img
                src={album.coverUrl}
                alt={album.name}
                className="w-full h-full object-cover"
                crossOrigin="anonymous"
              />
            </div>

            <div className="flex justify-between items-end border-b border-current/20 pb-1.5 mb-1">
              <div className="max-w-[75%]">
                <h2 className="text-base font-extrabold uppercase tracking-tight leading-snug truncate">
                  {album.name}
                </h2>
                <p className="text-xs opacity-80 font-medium truncate">{album.artist}</p>
              </div>
              <span className="text-xs font-mono opacity-60 shrink-0">{album.releaseYear}</span>
            </div>
          </div>

          {/* Área Central: Lista de Pistas (Ajuste Flexible) */}
          <div className="flex-1 flex items-center justify-center my-1 overflow-hidden">
            <div className={`w-full grid ${trackConfig.cols} font-mono opacity-90 ${trackConfig.text}`}>
              {tracks.map((track) => (
                <div key={track.trackNumber} className="flex justify-between border-b border-current/10 pb-[1px] min-w-0">
                  <span className="truncate pr-1">
                    {track.trackNumber}. {track.name}
                  </span>
                  <span className="opacity-60 shrink-0">{track.duration}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pie del Póster */}
          <div className="flex-shrink-0 pt-1.5 border-t border-current/20 flex justify-between items-center text-[8px] font-mono opacity-60">
            <span className="truncate max-w-[60%]">{album.label || 'STEREO RECORDING'}</span>
            <span>DURACIÓN: {album.totalDurationMinutes} MIN</span>
          </div>
        </div>
      </div>

      {/* Botón Descargar PNG */}
      <button
        onClick={handleExport}
        disabled={downloading}
        className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:bg-neutral-700 text-black font-bold rounded-lg text-sm transition shadow-lg"
      >
        {downloading ? 'Generando PNG...' : 'Descargar Poster (PNG)'}
      </button>
    </div>
  );
};

function getStyleClasses(variant) {
  switch (variant) {
    case 'atmospheric':
      return 'bg-neutral-950 text-white border border-white/10';
    case 'clean-poster':
      return 'bg-[#fcfbf9] text-[#111111] font-sans border-[12px] border-white shadow-2xl';
    case 'vinyl':
      return 'bg-[#e0d6c3] text-[#1a1a1a] font-serif border-4 border-[#1a1a1a]';
    case 'ticket':
      return 'bg-[#f4f4f0] text-[#111111] font-mono border-t-8 border-dashed border-neutral-400';
    case 'cyberpunk':
      return 'bg-black text-emerald-400 border border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.2)]';
    case 'swiss':
    default:
      return 'bg-white text-black font-sans';
  }
}
