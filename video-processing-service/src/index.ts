import express from "express";
import ffmpeg from "fluent-ffmpeg";

const app = express();
app.use(express.json());

app.post("/process-video", (req, res) => {
    const inputVideoPath = req.body.inputVideoPath;
    const outputVideoPath = req.body.outputVideoPath;

    if (!inputVideoPath || !outputVideoPath) {
        res.status(400).send("Bad Request: Missing File Path.");
    }

    ffmpeg(inputVideoPath)
        .outputOptions('-vf', 'scale=-1:360')
        .on("end", () => {
            res.status(200).send("Success: Video Successfully Processed.");
        })
        .on("error", function(err: any) {
            console.log(`An error occurred: ${err.message}`);
            res.status(500).send("Internal Server Error: Unable to Process Video.");
        })
        .save(outputVideoPath);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Video Process Service listening at http://localhost:${port}.`);
});