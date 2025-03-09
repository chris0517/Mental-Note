import OpenAI from "openai";

// Check if the API key exists
// console.log("API Key:", import.meta.env.VITE_OPENAI_API_KEY);

const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY, // ✅ Correct way
    dangerouslyAllowBrowser: true
});

export async function sendMessageToChatbot(userMessage) {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: userMessage }
            ],
        });

        return response.choices[0].message.content;
    } catch (error) {
        console.error("Chatbot error:", error);
        return "Sorry, something went wrong.";
    }
}

// ✅ Add default export
export default sendMessageToChatbot;
