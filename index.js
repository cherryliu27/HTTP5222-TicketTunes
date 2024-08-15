//import required modules
const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
require("util").inspect.defaultOptions.depth = null;
dotenv.config();

// const trakt = require("./modules/trakt/api");
const ticketmaster = require("./modules/ticketmaster/api");
const lastfm = require("./modules/lastfm/api");
// const shazam = require("./modules/shazam/api");

//set up Express app
const app = express();
const port = process.env.PORT || 8555;

//define important folders and set pug as template engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

//setup public folder
app.use(express.static(path.join(__dirname, "public")));

// PAGE ROUTES
app.get("/", async (req, res) => {
  try {
    let concerts = await ticketmaster.getConcerts();
    const concertData = [];

    for (let concert of concerts) {
      let artist = concert.artist;
      let topTracks = await lastfm.getTopTracks(artist);
      let artistInfo = await lastfm.getArtistInfo(artist);
      // let topAlbums = await lastfm.getTopAlbums(artist);

      concertData.push({
        eventName: concert.name,
        eventImg: concert.eventImg,
        sales: concert.sales,
        venue: concert.venue,
        date: concert.date,
        time: concert.time,
        artistName: artist,
        artistUrl: artistInfo,
        tracks: topTracks,
        // albums: topAlbums,
      });
    }

    res.render("index", { events: concertData });
    console.log(concertData);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  }
});

//set up server listening
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
