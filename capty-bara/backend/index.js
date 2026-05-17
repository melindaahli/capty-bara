import express from "express";
import cors from "cors";
import { fetchTranscript } from "youtube-transcript";


const app = express();


app.use(cors()); // allow frontend requests


// GET /transcript?videoId=xxxx&lang=x
app.get("/transcript", async (req, res) => {
 try {
   console.log("Received request with query:");
   const { videoId, lang } = req.query;
   console.log("Received request for videoId:", videoId, "lang:", lang);


   if (!videoId) {
     return res.status(400).json({ error: "Missing videoId" });
   }


   if (!lang) {
     return res.status(400).json({ error: "Missing lang" });
   }


   const transcript = await fetchTranscript(`https://www.youtube.com/watch?v=${videoId}`, { lang });
   console.log("Fetched transcript for videoId:", videoId);


   console.log("Fetched transcript:", transcript);


   res.json(transcript);


 } catch (err) {
   console.error(err);
   res.status(500).json({
     error: "Failed to fetch transcript"
   });
 }
});


app.listen(3001, () => {
 console.log("Backend running on http://localhost:3001");
});
