// const artist = "colde";

async function getTopTracks(artist) {
  const encodedArtist = encodeURIComponent(artist);
  const url = `http://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=${encodedArtist}&api_key=${process.env.LASTFM_CLIENT_ID}&format=json&limit=3&autocorrect=1`;
  const response = await fetch(url);
  const data = await response.json();

  const tracks = await Promise.all(
    data.toptracks.track.map(async (track) => {
      const trackImage = await getTrackImage(track.artist.name, track.name);
      return {
        name: track.name,
        playcount: track.playcount,
        link: track.url,
        artist: track.artist.name,
        image: trackImage,
      };
    })
  );

  return tracks;
}

async function getTrackImage(artist, track) {
  const encodedArtist = encodeURIComponent(artist);
  const encodedTrack = encodeURIComponent(track);
  const url = `http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${process.env.LASTFM_CLIENT_ID}&artist=${encodedArtist}&track=${encodedTrack}&format=json`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    // Check if album and album.image[2] exist
    if (
      data.track.album &&
      data.track.album.image &&
      data.track.album.image[1]["#text"]
    ) {
      return data.track.album.image[1]["#text"];
    } else {
      return "https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png";
    }
  } catch (error) {
    console.error("Error fetching track information:", error);
    return "https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png";
  }
}

async function getArtistInfo(artist) {
  const encodedArtist = encodeURIComponent(artist);
  const url = `http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${encodedArtist}&api_key=${process.env.LASTFM_CLIENT_ID}&format=json`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.artist.url;
  } catch (error) {
    console.error("Error fetching artist information:", error);
  }
}

module.exports = {
  getTopTracks,
  getTrackImage,
  getArtistInfo,
};
