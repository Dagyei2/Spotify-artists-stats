const express = require('express');
const app = express();
const port = 3010;
const path = require('path');
const fs = require('fs');

// Global Variables - storing the JSON format data in the artists stats object
const artistsStatsJsonFile = fs.readFileSync('utilities/spotify-artists-stats.json');
const artistsStatsObject = JSON.parse(artistsStatsJsonFile);

//Middlewares
app.use(express.static('static'));
app.use(express.json({ type: 'json' }));

//GET Method
app.get('/', (req, res) => {
  res.sendFile(path.resolve('utilities/spotify-artists-stats.json'));
});

//POST Method
app.post('/artists', (req, res) => {
 
  
  if (!req.is('application/json')) {
    res.status(400).send('An error occured while adding the artist')
} else {

   // Defining new data to be added
   const newArtistData = req.body;

   // Adding the new data to our object
   artistsStatsObject.push(newArtistData);
 
   // Converting from a object to JSON
   const newArtistJsonData = JSON.stringify(artistsStatsObject, null, 2);


   fs.writeFile(
    'utilities/spotify-artists-stats.json',
    newArtistJsonData,
    (err) => {
      if (err) {
        console.log(err)
      }
      console.log(newArtistJsonData);

    }
  );

  res.status(200).send('Artist added');

}


});



//PUT Method
app.put('/artists/:artist_name', (req, res) => {


  if( req.params.artist_name !== artistsStatsObject.artist_name) {
    res.status(404).send('The artist doesnt exist');
  } else {

    const { serial_number, artist_name, lead_streams, feats, tracks, one_billion, one_million, last_updated } =  req.body;



    artistsStatsObject.serial_number = serial_number
    artistsStatsObject.artist_name = artist_name
    artistsStatsObject.lead_streams = lead_streams
    artistsStatsObject.feats = feats
    artistsStatsObject.tracks = tracks
    artistsStatsObject.one_billion = one_billion
    artistsStatsObject.one_million = one_million
    artistsStatsObject.last_updated = last_updated



    const updatedArtistJsonData = JSON.stringify(artistsStatsObject, null, 2);

    fs.writeFile(
      'utilities/spotify-artisits-stats.json',
      updatedArtistJsonData,
      (err) => {
        if (err) {
          console.log(err)
        }
        console.log(newArtistJsonData);
  
      }
    );

    res.status(200).send('Artist updated');


  }





});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
