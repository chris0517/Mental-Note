from transformers import pipeline

# Initialize Sentiment Analysis pipeline
sentiment_analyzer = pipeline(
    "sentiment-analysis",
    model="distilbert-base-uncased-finetuned-sst-2-english",
    framework="pt"
)

# Initialize Emotion Classification pipeline
emotion_analyzer = pipeline(
    "text-classification",
    model="j-hartmann/emotion-english-distilroberta-base",
    return_all_scores=True
)

def analyze_sentiment(text):
    """
    Analyzes text for sentiment and emotion.
    Returns a dictionary containing sentiment and emotion analysis results.
    """
    # Get sentiment analysis
    sentiment_result = sentiment_analyzer(text)[0]
    
    # Get emotion analysis
    emotion_result = emotion_analyzer(text)[0]
    
    # Sort emotions by score and get the highest scoring emotion
    top_emotion = sorted(emotion_result, key=lambda x: x['score'], reverse=True)[0]

    return {
        "sentiment": {
            "label": sentiment_result["label"],
            "score": float(sentiment_result["score"])
        },
        "emotion": {
            "label": top_emotion["label"],
            "score": float(top_emotion["score"])
        },
        "all_emotions": [
            {"label": emotion["label"], "score": float(emotion["score"])}
            for emotion in emotion_result
        ]
    }