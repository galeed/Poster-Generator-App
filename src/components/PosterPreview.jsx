import React, { useRef } from 'react';
import { toPng } from 'html-to-image';

export const PosterPreview = ({ album, styleVariant }) => {
  const posterRef = useRef(null);

  const handleExport = async () => {
    if (!posterRef.current) return;
    try {
      const dataUrl = await toPng(posterRef.current, { pixelRatio: 3 });
      const link = document.createElement('a');
      link.download = `${album.name.replace(/\s+/g, '-').toLowerCase()}-poster.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error al exportar poster:', err);
    }
  };

  const isAtmospheric = styleVariant === 'atmospheric';
  const trackCount = album.tracks?.length || 0;

  // Ajuste dinámico de clases de texto según la longitud del tracklist y nombre del álbum
  const getTrackTextSize = () => {
    if (trackCount > 16) return 'text-[7px] leading-tight';
    if (trackCount > 10) return 'text-[8px] leading-snug';
    return 'text-[9px] leading-normal';
  };

  const getTitleTextSize = () => {
    if (album.name.length > 25) return 'text-base';
    if (album.name.length > 15) return 'text-lg';
    return 'text-xl';
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Contenedor del Poster */}
      <div
        ref={posterRef}
        className={`w-[380px] h-[570px] p-6 shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden relative ${getStyleClasses(styleVariant)}`}
      >
        {/* Fondo Desenfoque Dinámico (Atmospheric) */}
        {isAtmospheric && (
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img
              src={album.coverUrl}
              alt=""
              className="w-full h-full object-cover scale-150 blur-3xl opacity-50 saturate-200"
              crossOrigin="anonymous"
            />
            <div className="absolute inset-0 bg-neutral-950/60 backdrop-blur-sm" />
          </div>
        )}

        {/* Contenido */}
        <div className="relative z-10 flex flex-col h-full justify-between">
          {/* Header y Portada */}
          <div>
            <div className="w-full aspect-square overflow-hidden mb-3 shadow-2xl rounded-sm">
              <img
                src={album.coverUrl}
                alt={album.name}
                className="w-full h-full object-cover"
                crossOrigin="anonymous"
              />
            </div>

            <div className="flex justify-between items-end border-b border-current/20 pb-2 mb-2">
              <div className="max-w-[75%]">
                <h2 className={`${getTitleTextSize()} font-extrabold uppercase tracking-tight leading-none truncate`}>
                  {album.name}
                </h2>
                <p className="text-xs opacity-80 font-medium mt-1 truncate">{album.artist}</p>
              </div>
              <span className="text-xs font-mono opacity-60 pb-0.5">{album.releaseYear}</span>
            </div>
          </div>

          {/* Tracklist Adaptativo */}
          <div className={`grid grid-cols-2 gap-x-4 gap-y-0.5 font-mono opacity-85 my-auto overflow-hidden ${getTrackTextSize()}`}>
            {album.tracks?.slice(0, 18).map((track) => (
              <div key={track.trackNumber} className="flex justify-between border-b border-current/10 pb-0.5">
                <span className="truncate pr-1">{track.trackNumber}. {track.name}</span>
                <span className="opacity-60">{track.duration}</span>
              </div>
            ))}
          </div>

          {/* Pie de Poster */}
          <div className="pt-2 border-t border-current/20 flex justify-between items-center text-[8px] font-mono opacity-60">
            <span className="truncate max-w-[60%]">{album.label || 'STEREO'}</span>
            <span>DURACIÓN: {album.totalDurationMinutes} MIN</span>
          </div>
        </div>
      </div>

      {/* Botón */}
      <button
        onClick={handleExport}
        className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-lg text-sm transition shadow-lg"
      >
        Descargar Poster (PNG)
      </button>
    </div>
  );
};

function getStyleClasses(variant) {
  switch (variant) {
    case 'atmospheric':
      return 'bg-neutral-950 text-white border border-white/10';
    case 'clean-poster':
      return 'bg-[#fcfbf9] text-[#111111] font-sans border-[10px] border-white shadow-2xl';
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
