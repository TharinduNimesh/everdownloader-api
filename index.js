import express from "express";
import { YtDlp } from "@yemreak/yt-dlp";
import cors from "cors";
import fs from "fs";

const app = express();
const config = { workdir: "./downloads" };
const ytDlp = new YtDlp(config);

app.use(
  cors({
    origin: ["https://evermuzic.me", "http://localhost:3000"],
  })
);

app.get("/api/download", async (req, res) => {
  const videoId = req.query.videoId;
  if (!videoId && videoId.trim() === "") {
    return res.json(
      {
        message: "Invalid Query",
      },
      404
    );
  }
  const videoURL = `https://www.youtube.com/watch?v=${videoId}`;
  try {
    const path = await ytDlp.download({
      url: videoURL,
      format: "ba",
    });
    res.download(path.toString());
    return res.send("Downloaded");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error downloading video");
  }
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
