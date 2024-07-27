import express from "express";
import { YtDlp } from "@yemreak/yt-dlp";
import cors from "cors";
import ytdl from "ytdl-core";

const app = express();
const config = { workdir: "./public/downloads" };
const ytDlp = new YtDlp(config);
const PORT = 3000;
const APP_URL = `https://download.evermuzic.me`;

app.use(
  cors({
    origin: ["https://evermuzic.me", "http://localhost:3000"],
  })
);
app.use(express.static("public"));

app.get("/api/info", async (req, res) => {
  const videoId = req.query.videoId;
  if (!videoId || videoId.trim() === "") {
    return res.json(
      {
        message: "Invalid Query",
      },
      404
    );
  }

  const videoURL = `https://www.youtube.com/watch?v=${videoId}`;
  try {
    const info = await ytdl.getBasicInfo(videoURL);
    return res.json({
      title: info.videoDetails.title,
      thumbnail: info.videoDetails.thumbnails[0].url,
      duration: info.videoDetails.lengthSeconds
        ? parseInt(info.videoDetails.lengthSeconds)
        : 0,
      channel: info.videoDetails.author.name,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error getting video info");
  }
});

app.get("/api/download", async (req, res) => {
  const videoId = req.query.videoId;
  if (!videoId || videoId.trim() === "") {
    return res.json(
      {
        message: "Invalid Query",
      },
      404
    );
  }

  const videoURL = `https://www.youtube.com/watch?v=${videoId}`;
  try {
    const isExist = await checkFileExists(videoId);

    if (isExist) {
      return res.json({
        message: "File already exists",
        url: `${APP_URL}/downloads/${videoId}.m4a`,
      });
    }

    await ytDlp.download({
      url: videoURL,
      format: "ba",
    });
    return res.json({
      message: "Downloaded successfully",
      url: `${APP_URL}/downloads/${videoId}.m4a`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error downloading video");
  }
});

async function checkFileExists(videoId) {
  try {
    const url = `${APP_URL}/downloads/${videoId}.m4a`;
    const response = await fetch(url);
    if (response.ok) {
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error accessing file: ${error.message}`);
    return false;
  }
}

app.listen(PORT, () => {
  console.log(`Server is running on ${APP_URL}`);
});
