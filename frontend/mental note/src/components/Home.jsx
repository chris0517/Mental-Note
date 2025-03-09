import React, { useState } from "react";
import { Container, TextField, Button, Card, CardMedia, Typography } from "@mui/material";
import { analyzeText, uploadImages } from "./api/api"; // Import API functions

const Home = () => {
  const [text, setText] = useState("");
  const [emotion, setEmotion] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [contentFile, setContentFile] = useState(null);
  const [styleFile, setStyleFile] = useState(null);
  const [outputImage, setOutputImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    const result = await analyzeText(text);
    if (result.error) {
      setError(result.error);
      return;
    }

    setEmotion(result.emotion);
    setImageUrl(result.imageUrl);
    setStyleFile(result.styleFile);
    console.log("Analyzed imageUrl:", result.imageUrl);
  };

  const handleUpload = async () => {
    setLoading(true);
    setError(null);

    const result = await uploadImages(contentFile, styleFile);
    if (result.error) {
      setError(result.error);
    } else {
      setOutputImage(result.outputImageUrl);
    }

    setLoading(false);
  };

  return (
    <Container maxWidth="sm" sx={{ textAlign: "center", mt: 5, padding:5}}>
      <TextField
        label="Enter your thoughts..."
        variant="outlined"
        fullWidth
        multiline
        rows={2}
        value={text}
        onChange={(e) => setText(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Button variant="contained" color="primary" onClick={handleAnalyze} sx={{ mb: 2 }}>
        Analyze Emotion
      </Button>

      {emotion && (
        <Card sx={{ mt: 3, p: 2 }}>
          <Typography variant="h6">{`Detected Emotion: ${emotion}`}</Typography>
          <CardMedia
            component="img"
            height="200"
            image={imageUrl}
            alt={emotion}
            sx={{ mt: 2, borderRadius: 2 }}
          />
        </Card>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setContentFile(e.target.files[0])}
        style={{ marginTop: "20px" }}
      />
      <Button onClick={handleUpload} disabled={loading} variant="contained" color="secondary" sx={{ mt: 2 }}>
        {loading ? "Processing..." : "Stylize Image"}
      </Button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {outputImage && (
        <Card sx={{ mt: 3, p: 2 }}>
          <Typography variant="h6">Stylized Image:</Typography>
          <CardMedia
            component="img"
            height="300"
            image={outputImage}
            alt="Stylized Output"
            sx={{ mt: 2, borderRadius: 2 }}
          />
        </Card>
      )}
    </Container>
  );
};

export default Home;
