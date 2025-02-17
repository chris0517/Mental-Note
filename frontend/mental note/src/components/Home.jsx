import React, { useState } from "react";
import { Container, TextField, Button, Card, CardMedia, Typography } from "@mui/material";

const Home = () => {
  const [text, setText] = useState("");
  const [emotion, setEmotion] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  const handleAnalyze = async () => {
    if (!text) return;

    try {
      const response = await fetch("http://127.0.0.1:5000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();
      setEmotion(data.emotion.label);
      setImageUrl(`/imgs/${data.emotion.label}.jpg`); // Load from public/imgs/
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    console.log(imageUrl);
  };

  const handleStyle = async () => {
    if (!text) return;

    try {
      const response = await fetch("http://127.0.0.1:5000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();
      setEmotion(data.emotion.label);
      setImageUrl(`/imgs/${data.emotion.label}.jpg`); // Load from public/imgs/
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    console.log(imageUrl);
  };

  return (
    <Container maxWidth="sm" sx={{ textAlign: "center", mt: 5 }}>
      <Typography variant="h4" gutterBottom>Mental Notes</Typography>
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
      <Button variant="contained" color="primary" onClick={handleAnalyze}>
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
    </Container>
  );
}

export default Home;
