// import {GoogleGenerativeAI} from "@google/generative-ai"
// const genAI = new GoogleGenerativeAI({
//     apiKey: process.env.GEMINI_API_KEY,
// })
// export async function POST(req) {
//     const {message} = await req.json()
//
//     if (!message) {
//         return new Response(JSON.stringify({error: "Mesaj boş olamaz"}), {status: 400})
//     }
//
//     try {
//         const chatCompletion = await genAI.chat.completions.create({
//             messages: [{role: "user", content: message}],
//             model: "gemini-pro", // veya "mixtral-8x7b-32768"
//         })
//
//         const reply = chatCompletion.choices[0]?.message?.content
//         return new Response(JSON.stringify({reply}), {status: 200})
//     } catch (err) {
//         console.error(err)
//         return new Response(JSON.stringify({error: "Yanıt alınamadı"}), {status: 500})
//     }
// }

// route.js - Google Gemini API ile
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
    const {message} = await req.json()

    if (!message) {
        return new Response(JSON.stringify({error: "Mesaj boş olamaz"}), {status: 400})
    }

    try {
        // Gemini Flash modelini kullan (ücretsiz)
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            generationConfig: {
                temperature: 0.7,
                topK: 1,
                topP: 1,
                maxOutputTokens: 2048,
            },
        });

        // Türkçe sistem mesajı ile başlat
        const prompt = `Sen Türkçe konuşan yardımcı bir asistansın. Tüm sorulara Türkçe cevap ver.

Kullanıcı sorusu: ${message}

Lütfen Türkçe yanıtla:`;

        const result = await model.generateContent(prompt);
        const reply = result.response.text();

        return new Response(JSON.stringify({reply}), {status: 200})
    } catch (err) {
        console.error("Gemini API Hatası:", err)
        return new Response(JSON.stringify({error: "Yanıt alınamadı"}), {status: 500})
    }
}