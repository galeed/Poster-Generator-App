import React, { useState } from 'react';

export const AlbumSearch = ({ onSelectAlbum }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim().length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/spotify/search?q=${encodeURIComponent(value)}`);
      const data = await res.json();
      setResults(data.albums || []);
    } catch (err) {
      console.error('Error en la búsqueda:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full relative">
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Buscar álbum o artista..."
        className="w-full px-4 py-2 bg-neutral-900 text-white rounded-lg border border-neutral-800 focus:outline-none focus:border-emerald-500 text-sm"
      />

      {loading && <p className="text-xs text-neutral-500 mt-1">Buscando...</p>}

      {results.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 bg-neutral-900 border border-neutral-800 rounded-lg max-h-60 overflow-y-auto shadow-2xl">
          {results.map((album) => (
            <li
              key={album.id}
              onClick={() => {
                onSelectAlbum(album);
                setResults([]);
                setQuery('');
              }}
              className="flex items-center gap-3 p-2 hover:bg-neutral-800 cursor-pointer transition"
            >
              <img src={album.coverUrl} alt={album.name} className="w-10 h-10 object-cover rounded" />
              <div className="overflow-hidden">
                <p className="text-xs font-medium text-white truncate">{album.name}</p>
                <p className="text-[10px] text-neutral-400 truncate">{album.artist} • {album.releaseYear}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
