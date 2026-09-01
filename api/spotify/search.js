export default async function handler(req, res) {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ error: 'El parámetro "q" es obligatorio' });
  }

  try {
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const host = req.headers.host;
    
    // Petición interna para obtener el token
    const tokenRes = await fetch(`${protocol}://${host}/api/spotify/token`);
    const tokenData = await tokenRes.json();

    if (!tokenRes.ok) {
      return res.status(tokenRes.status).json({ error: 'Error de autenticación' });
    }

    const spotifySearchUrl = `https://api.spotify.com/v1/search?${new URLSearchParams({
      q: q,
      type: 'album',
      limit: '8',
    })}`;

    const searchRes = await fetch(spotifySearchUrl, {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
      },
    });

    const searchData = await searchRes.json();

    if (!searchRes.ok) {
      return res.status(searchRes.status).json(searchData);
    }

    const albums = searchData.albums.items.map((album) => ({
      id: album.id,
      name: album.name,
      artist: album.artists.map((artist) => artist.name).join(', '),
      releaseDate: album.release_date,
      releaseYear: album.release_date ? album.release_date.split('-')[0] : '',
      coverUrl: album.images[0]?.url || '',
      totalTracks: album.total_tracks,
    }));

    return res.status(200).json({ albums });
  } catch (error) {
    return res.status(500).json({ error: 'Error al realizar la búsqueda' });
  }
}
