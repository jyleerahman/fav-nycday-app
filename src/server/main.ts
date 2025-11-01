import express from "express";
import axios from "axios";
import ViteExpress from "vite-express";
import 'dotenv/config';

const app = express();

app.use(express.json());

app.get("/hello", (_, res) => {
  res.send("Hello Vite + React + TypeScript!");
});

app.post("/api/directions", async (req, res) => {
  const token = process.env.MAPBOX_TOKEN;
  const { profile, coords } = req.body;
  try {
    //0. formate coords array into a string [[lng1, lat1], [lng2, lat2]] => "lng1, lat1; lng2, lat2"
    const coordsString = coords.map(coordpair => coordpair.join(",")).join(";")

    //1. get url for the external API
    const EXTERNAL_API_URL = `https://api.mapbox.com/directions/v5/mapbox/${profile}/${coordsString}?steps=true&geometries=geojson&access_token=${token}`;

    console.log('Attempting to fetch URL:', EXTERNAL_API_URL)
    //2. make the GET request to the external API using axios
    const apiResponse = await axios.get(EXTERNAL_API_URL);

    //3. send the data from the external API back to your React client
    res.json(apiResponse.data)
  } catch (error) {
    console.error("Error fetching from external API", error)
    res.status(500).json({ error: "Failed to fetch the data" })
  }

})

const port = process.env.PORT || 3000;

// Configure ViteExpress for production
if (process.env.NODE_ENV === 'production') {
  ViteExpress.config({ mode: 'production' });
}

ViteExpress.listen(app, port, () =>
  console.log(`Server is listening on port ${port}...`),
);
