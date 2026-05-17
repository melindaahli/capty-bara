import express from "express";
import cors from "cors";
import { fetchTranscript } from "youtube-transcript";

const app = express();
app.use(cors());

// Cache: "videoId:lang" -> transcript array

// old version without caching:
// const transcriptCache = new Map();

// async function getTranscript(videoId, lang) {
//   const key = `${videoId}:${lang}`;
//   if (transcriptCache.has(key)) return transcriptCache.get(key);
  
//   const transcript = await fetchTranscript(videoId, lang);
//   transcriptCache.set(key, transcript);
//   return transcript;
// }
// end old version

// new version with 
const transcriptCache = new Map();
const fetchingPromises = new Map();

async function getTranscript(videoId, lang) {
  const key = `${videoId}:${lang}`;
  if (transcriptCache.has(key)) return transcriptCache.get(key);

  if (fetchingPromises.has(key)) return fetchingPromises.get(key);

  const promise = fetchTranscript(videoId, { lang })
    .then(transcript => {
      transcriptCache.set(key, transcript);
      fetchingPromises.delete(key);
      return transcript;
    })
    .catch(err => {
      fetchingPromises.delete(key);
      throw err;
    });

  fetchingPromises.set(key, promise);
  return promise;
}
// end new version

// Returns the caption segment active at `time` (seconds).
// youtube-transcript offsets are in milliseconds, so convert before comparing.
function getTranscriptAtTime(transcript, time) {
  const ms = time * 1000;
  return transcript.find((seg) => ms >= seg.offset && ms < seg.offset + seg.duration) ?? null;
}

// GET /transcript?videoId=xxxx&lang=xx
app.get("/transcript", async (req, res) => {
  const { videoId, lang } = req.query;
  if (!videoId) return res.status(400).json({ error: "Missing videoId" });
  if (!lang) return res.status(400).json({ error: "Missing lang" });

  try {
    const transcript = await getTranscript(videoId, lang);
    res.json(transcript);
  } catch (err) {
    console.error(`[/transcript] videoId=${videoId} lang=${lang}:`, err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET /transcript/at-time?videoId=xxxx&lang=xx&time=30.5
// `time` is in seconds (matches video.currentTime). For 1100ms pass time=1.1
app.get("/transcript/at-time", async (req, res) => {
  const { videoId, lang, time } = req.query;
  if (!videoId) return res.status(400).json({ error: "Missing videoId" });
  if (!lang) return res.status(400).json({ error: "Missing lang" });
  if (time === undefined) return res.status(400).json({ error: "Missing time" });

  try {
    const transcript = await getTranscript(videoId, lang);
    const segment = getTranscriptAtTime(transcript, parseFloat(time - 1.5));
    res.json(segment);
  } catch (err) {
    console.error(`[/transcript/at-time] videoId=${videoId} lang=${lang} time=${time}:`, err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3001, () => {
  console.log("Backend running on http://localhost:3001");
});
