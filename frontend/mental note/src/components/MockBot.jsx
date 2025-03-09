import React, { useState, useEffect, useRef  } from "react";
import { Container, TextField, Paper, Button } from "@mui/material";
import { analyzeText, uploadImages } from "./api/api"; // Import API functions

const MockBot = () => {
    const [message, setMessage] = useState("How was your day...");
    const [showCursor, setShowCursor] = useState(true);
    const [userInput, setUserInput] = useState("");
    const [chatMode, setChatMode] = useState(false);
    const [messages, setMessages] = useState([{ text: "How was your day...", sender: "bot" }]);
    const [emotion, setEmotion] = useState(null);
    const [imageUrl, setImageUrl] = useState("");
    const [contentFile, setContentFile] = useState(null);
    const [styleFile, setStyleFile] = useState(null);
    const [outputImage, setOutputImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [uploadedImage, setUploadedImage] = useState(null);

    const fileInputRef = useRef(null);


    useEffect(() => {
        if (!chatMode) {
            const cursorInterval = setInterval(() => {
                setShowCursor((prev) => !prev);
            }, 500);
            return () => clearInterval(cursorInterval);
        }
    }, [chatMode]);

    useEffect(() => {
        // DEBUGGING: Log messages whenever they change
        console.log("Current Messages:", messages);
    }, [messages]);

    const handleInputChange = (event) => {
        setUserInput(event.target.value);
    };

    const handleSendMessage = async (event) => {
        if (event.key === "Enter" && userInput.trim() !== "") {
            const newMessages = [...messages, { text: userInput, sender: "user" }];
            setMessages(newMessages);
            setUserInput("");
    
            if (!chatMode) {
                setChatMode(true);
                
                // Add loading message
                // setMessages(prevMessages => [...prevMessages, { text: "Analyzing your emotion...", sender: "bot" }]);
                
                try {
                    // Wait for analysis to complete and get the result directly
                    const analysisResult = await handleAnalyze();
                    
                    // Add emotion message using the result from handleAnalyze
                    setMessages(prevMessages => [
                        ...prevMessages, 
                        { text: `
                            That's such a beautiful mindset to have. 
                            Sometimes, the most meaningful days aren't the ones filled with major events, 
                            but the ones where everything just feels right. 
                            There's something really special about appreciating the little joys—whether 
                            it's a great cup of coffee, a warm conversation, or the comfort of a quality time with
                            family and friends. Let me know if you wantto chat more, or you can upload your image of the day 😊`, 
                            sender: "bot" }
                    ]);
                } catch (error) {
                    // Handle any errors during analysis
                    setMessages(prevMessages => [
                        ...prevMessages, 
                        { text: "Sorry, there was an error analyzing your message.", sender: "bot" }
                    ]);
                    console.error(error);
                }
            }
        }
    };
    

    const handleAnalyze = async () => {
        try {
            const result = await analyzeText(userInput);
            
            if (result.error) {
                setError(result.error);
                throw new Error(result.error);
            }
    
            // Update state with analysis results
            setEmotion(result.emotion);
            setImageUrl(result.imageUrl);
            setStyleFile(result.styleFile);
            
            console.log("Analyzed emotion:", result.emotion);
            
            // Return the entire result object
            return result;
        } catch (error) {
            console.error("Analysis error:", error);
            throw error;
        }
    };
    
    const handleUpload = async () => {
        // Trigger the file input click
        fileInputRef.current.click();
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        setContentFile(file);
        setLoading(true);
        setError(null);

        if (file) {
            // Create an object URL for the selected image
            const imageUrl = URL.createObjectURL(file);

            console.log(imageUrl)
            // Add the image to messages
            setMessages(prevMessages => [
                ...prevMessages, 
                { 
                    type: 'image', 
                    src: imageUrl, 
                    file: file,
                    sender: 'user' 
                }
            ]);
            // Set the uploaded image for potential further processing
            setUploadedImage(file);
            console.log("Stylizing image...");
            const result = await uploadImages(file, styleFile);
            console.log(result)
            if (result.error) {
                setError(result.error);
            } else {
                setOutputImage(result.outputImageUrl);
                setOutputImage(result.outputImageUrl);
                // Add the stylized image as a bot message
                setMessages(prevMessages => [
                    ...prevMessages,
                    {
                        type: 'image',
                        src: result.outputImageUrl,
                        sender: 'bot'
                    }, 
                    { text: `I've blended your image with today's emotions,
                        and here's the final creation! 🎨✨ Every day carries its own unique energy, 
                        and now you have a visual reflection of how you felt today. Whether 
                        it's a burst of joy, a moment of reflection, or a spark of creativity, 
                        this piece captures it all. I hope it serves as a reminder of your journey and the 
                        emotions that shape you. 
                        Take care, and I'll be here whenever you want to check in again!`, 
                        sender: "bot" 
                    }
                ]);

            }
    
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            {!chatMode ? (
                <div style={{ textAlign: 'center', marginTop: '20vh', fontSize: '1.2rem', fontFamily: 'Quicksand, sans-serif' }}>
                    {message}
                    <span style={{ opacity: showCursor ? 1 : 0, marginLeft: '2px' }}>|</span>
                    <TextField
                        fullWidth
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyDown={handleSendMessage}
                        variant="standard"
                        placeholder="Type your message..."
                        sx={{ 
                            marginTop: 2,
                            backgroundColor: 'white',
                            borderRadius: '5px'
                        }}
                    />
                </div>
            ) : (
                <Container
                    sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        height: '90vh', 
                        justifyContent: 'space-between', 
                        padding: 2, 
                        backgroundColor: '#f5f5f5',
                        borderRadius: '10px',
                        boxShadow: 3,
                        marginTop: '85px'
                    }}>

                <Paper elevation={3} sx={{ 
                    flexGrow: 1, 
                    overflowY: 'auto', 
                    padding: 2, 
                    backgroundColor: 'white',
                    borderRadius: '10px'
                }}>
                    {messages.map((msg, index) => (
                        <div key={index} style={{ 
                            display: 'flex', 
                            justifyContent: msg.sender === "user" ? "flex-end" : "flex-start", 
                            marginBottom: '10px' 
                        }}>
                            {msg.type === 'image' ? (
                                <div style={{
                                    width: '300px', // Fixed width for all image containers
                                    maxWidth: '70%',
                                    borderRadius: '15px',
                                    overflow: 'hidden',
                                    backgroundColor: '#f0f0f0', // Optional: adds a background while images load
                                }}>
                                    <img 
                                        src={msg.src} 
                                        alt="Uploaded" 
                                        style={{ 
                                            width: '100%',
                                            height: '300px', // Fixed height to match width
                                            objectFit: 'cover', // Changed to 'cover' to fill the container
                                            borderRadius: '15px'
                                        }} 
                                        onError={(e) => {
                                            console.error("Image load error:", e);
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                </div>
                            ) : (
                                <div style={{ 
                                    maxWidth: '70%', 
                                    padding: '10px', 
                                    borderRadius: '15px', 
                                    backgroundColor: msg.sender === "user" ? "#4caf50" : "#e0e0e0", 
                                    color: msg.sender === "user" ? "white" : "black", 
                                    textAlign: 'left' 
                                }}>
                                    {msg.text}
                                </div>
                            )}
                        </div>
                    ))}
                </Paper>
                <TextField
                    fullWidth
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={handleSendMessage}
                    variant="outlined"
                    placeholder="Type your message..."
                    sx={{ 
                        marginTop: 2,
                        backgroundColor: 'white',
                        borderRadius: '5px'
                    }}
                />
                {/* Hidden file input */}
                <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    style={{ display: 'none' }}
                />
                <Button 
                    onClick={handleUpload} 
                    variant="contained" 
                    color="black" 
                    sx={{ mt: 2 }}
                    disabled={loading}
                >
                    {loading ? "Processing..." : "Upload Image"}                </Button>
            </Container>
            )}
        </Container>
    );
}

export default MockBot;

