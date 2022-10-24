const express = require('express');
const app = express();
const port = 3010;
const path = require('path');
const fs = require('fs');

// Global Variables
const spotifyFileName = 'utilities/spotify-artists-stats.json';
const artistsStatsJsonFile = fs.readFileSync(spotifyFileName);
const artistsStatsObj = JSON.parse(artistsStatsJsonFile);

//Convert req object to json
const reqJSON = JSON.stringify(artistsStatsObj, null, 2);

//Middlewares
app.use(express.static('static'));
app.use(express.json({ type: 'json' }));

//GET METHOD
app.get('/', (req, res) => {
  res.sendFile(path.resolve(spotifyFileName));
});

//POST METHOD
app.post('/artists', (req, res) => {
  if (!req.is('application/json')) {
    res
      .status(500)
      .send('A server error occured while attempting to add an artist');
  } else {
    //Convert req json text to js object
    const reqPostObj = JSON.parse(req.body);

    //Adding new data to our object
    artistsStatsObj.push(reqPostObj);

    fs.writeFile(spotifyFileName, reqJSON, (err) => {
      if (err) {
        console.log(err);
      }
      console.log(reqJSON);
    });

    res.status(200).send('Artist added');
  }
});

//PUT METHOD
app.put('/artists/:artist_name', (req, res) => {

  
  //Variables
  const req_params_artist_name = req.params.artist_name;
  const reqPutObj = JSON.parse(req.body);
  const req_serial_number = reqPutObj.serial_number - 1;
  const artist_stats_obj_artist_name = artistsStatsObj[req_serial_number]['artist_name']


  if (req_params_artist_name == artist_stats_obj_artist_name) {
    const { lead_streams, feats, tracks, one_billion, last_updated } =
      req.PutObj;

    artistsStatsObj[req_serial_number]['lead_streams'] = lead_streams;
    artistsStatsObj[req_serial_number]['feats'] = feats;
    artistsStatsObj[req_serial_number]['tracks'] = tracks;
    artistsStatsObj[req_serial_number]['one_billion'] = one_billion;
    artistsStatsObj[req_serial_number]['100_million'] =
      reqPutObj['100_million'];
    artistsStatsObj[req_serial_number][last_updated] = last_updated;

    fs.writeFile(spotifyFileName, reqJSON, (err) => {
      if (err) {
        console.log(err);
      }
      console.log(reqJSON);
    });

    res.status(200).send('Artist Updated');
  } else {
    res
      .status(404)
      .send('An error occured while attempting to update the artist');
  }
});


//DELETE METHOD
app.delete('artists/:artist_name', (req, res) => {

  //Variables
  const req_params_artist_name = req.params.artist_name;
  const reqDelObj = JSON.parse(req.body);
  const req_serial_number = reqDelObj.serial_number - 1;
  const artist_stats_obj_artist_name = artistsStatsObj[req_serial_number]['artist_name']
 
  if ( req_params_artist_name == artist_stats_obj_artist_name) {
 
    artistsStatsObj.splice(req_serial_number, 1)
 
  
 
    fs.writeFile(spotifyFileName, reqJSON, (err) => {
      if (err) {
        console.log(err);
      }
      console.log(reqJSON);
    });
 
    res.status(200).send('Artist hase been deleted');
  } else {
    res
      .status(404)
      .send('An error occured while attempting to update the artist');
  }
 
 

 

});





app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
