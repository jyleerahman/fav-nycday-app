import express from "express";
import ViteExpress from "vite-express";
import 'dotenv/config';

const app = express();

app.get("/hello", (_, res) => {
  res.send("Hello Vite + React + TypeScript!");
});

app.post("/api/directions", (req, res) => {
  const token = process.env.MAPBOX_TOKEN;

})

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000..."),
);
