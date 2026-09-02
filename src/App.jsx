import React, { useState } from 'react';
import { AlbumSearch } from './components/AlbumSearch.jsx';
import { PosterPreview } from './components/PosterPreview.jsx';

export default function App() {
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [albumDetails, setAlbumDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentStyle, setCurrentStyle] = useState('swiss');

  const handleSelectAlbum = async (album) => {
    setSelectedAlbum(album);
    setLoading(true);

    try {
      const res = await fetch(`/api/spotify/album?id=${album.id}`);
      const data = await res.json();
      setAlbumDetails(data);
    } catch (err) {
      console.error('Error al cargar detalles del álbum:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col md:flex-row">
      <aside className="w-full md:w-96 p-6 border-b md:border-b-0 md:border-r border-neutral-800 flex flex-col gap-6">
        <div>
          <h1 className="text-xl font-bold tracking-wide">Poster Generator</h1>
          <p className="text-xs text-neutral-400">Busca un álbum y elige una plantilla.</p>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-neutral-300 uppercase">1. Selecciona Álbum</label>
          <AlbumSearch onSelectAlbum={handleSelectAlbum} />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-neutral-300 uppercase">2. Elige el Estilo</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'swiss', label: 'Suizo / Minimal' },
              { id: 'atmospheric', label: 'Atmospheric (Blur)' },
              { id: 'clean-poster', label: 'Clean Poster' },
              { id: 'vinyl', label: 'Vintage / Vinilo' },
              { id: 'ticket', label: 'Receipt / Ticket' },
              { id: 'cyberpunk', label: 'Cyber / Dark' },
            ].map((style) => (
              <button
                key={style.id}
                onClick={() => setCurrentStyle(style.id)}
                className={`py-2 px-3 text-xs rounded-lg border transition text-left ${
                  currentStyle === style.id
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 font-semibold'
                    : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:border-neutral-700'
                }`}
              >
                {style.label}
              </button>
            ))}
          </div>
        </div>
      </aside>

      <main className="flex-1 p-6 flex flex-col items-center justify-center bg-neutral-900/50">
        {loading ? (
          <p className="text-neutral-500 animate-pulse">Cargando tracklist y portada...</p>
        ) : albumDetails ? (
          <PosterPreview album={albumDetails} styleVariant={currentStyle} />
        ) : (
          <div className="text-center text-neutral-600">
            <p className="text-sm">Busca un álbum para comenzar a diseñar tu poster.</p>
          </div>
        )}
      </main>
    </div>
  );
}
