import { useState } from "react";
import axios from "axios";

function Test() {
  const [contentFile, setContentFile] = useState(null);
  const [styleFile, setStyleFile] = useState(null);
  const [outputImage, setOutputImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleUpload = async () => {
    if (!contentFile || !styleFile) {
      alert("Please upload both content and style images.");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("content", contentFile);
    formData.append("style", styleFile);

    try {
      const response = await axios.post("http://127.0.0.1:5000/stylize", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      const imageUrl = `http://127.0.0.1:5000${response.data.output_image}`;
      console.log("Image URL:", imageUrl);
      setOutputImage(imageUrl);
    } catch (err) {
      setError(err.response?.data?.error || "Error processing image.");
    }

    console.log(outputImage);
    setLoading(false);
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Neural Style Transfer</h1>
      <input type="file" accept="image/*" onChange={(e) => setContentFile(e.target.files[0])} />
      <input type="file" accept="image/*" onChange={(e) => setStyleFile(e.target.files[0])} />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Processing..." : "Stylize Image"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {outputImage && (
        <div>
          <h2>Result:</h2>
          <h2>{outputImage}</h2>
          <img src={outputImage} alt="Stylized Output" width="300" />
        </div>
      )}
    </div>
  );
}

export default Test;
