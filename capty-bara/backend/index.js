import express from "express";
import cors from "cors";
import { fetchTranscript } from "youtube-transcript";

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Private-Network', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});


const transcriptCache = new Map();
const fetchingPromises = new Map();

const FAILED_SENTINEL = Symbol('FAILED');

async function getTranscript(videoId, lang) {
  const key = `${videoId}:${lang}`;
  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Check both success and failure cache
  if (transcriptCache.has(key)) {
    const cached = transcriptCache.get(key);
    if (cached === FAILED_SENTINEL) return null; // already known to fail
    return cached;
  }

  // Dedup in-flight requests
  if (fetchingPromises.has(key)) return fetchingPromises.get(key);

  const fetchLogic = (async () => {
    try {
      console.log("trying to fetch", { videoId, lang });
      const transcript = await fetchTranscript(videoId, { lang });
      transcriptCache.set(key, transcript);
      return transcript;

    } catch (err) {
      // Cache the failure so we never retry this key
      transcriptCache.set(key, FAILED_SENTINEL);
      console.warn(`Transcript unavailable for ${videoId}:${lang}, won't retry.`);
      return null;
    } finally {
      fetchingPromises.delete(key);
    }
  })();

  fetchingPromises.set(key, fetchLogic);
  return fetchLogic;
}
// end new version 2

// Returns the caption segment active at `time` (seconds).
// youtube-transcript offsets are in milliseconds, so convert before comparing.
function getTranscriptAtTime(transcript, time) {
  if (!transcript) return null;
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

    if (!transcript) {
      return res.json({ unavailable: true, text: "" });
    }

    const segment = getTranscriptAtTime(transcript, parseFloat(time) + 0.5);
    res.json(segment);
  } catch (err) {
    console.error(`[/transcript/at-time] videoId=${videoId} lang=${lang} time=${time}:`, err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3001, () => {
  console.log("Backend running on http://localhost:3001");
});
