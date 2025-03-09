import axios from "axios";

// Base URL for the backend
const BASE_URL = "http://127.0.0.1:5000";

// Function to analyze text and return emotion + style file
export const analyzeText = async (text) => {
  if (!text) return { error: "Text is required." };

  try {
    const response = await fetch(`${BASE_URL}/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    const data = await response.json();
    const emotion = data.emotion.label;
    const imageUrl = `/imgs/${emotion}.jpg`;

    // Fetch and convert to File object
    const imgResponse = await fetch(imageUrl);
    const blob = await imgResponse.blob();
    const styleFile = new File([blob], `${emotion}.jpg`, { type: blob.type });

    return { emotion, imageUrl, styleFile };
  } catch (error) {
    console.error("Error analyzing text:", error);
    return { error: "Failed to analyze text." };
  }
};

// Function to upload content and style images for stylization
export const uploadImages = async (contentFile, styleFile) => {
  if (!contentFile || !styleFile) {
    return { error: "Please upload a content image and analyze emotion first." };
  }

  const formData = new FormData();
  formData.append("content", contentFile);
  formData.append("style", styleFile);

  try {
    const res = await axios.post(`${BASE_URL}/stylize`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    const outputImageUrl = `${BASE_URL}${res.data.output_image}`;
    return { outputImageUrl };
  } catch (error) {
    console.error("Error uploading images:", error);
    return { error: "Error processing image." };
  }
};
