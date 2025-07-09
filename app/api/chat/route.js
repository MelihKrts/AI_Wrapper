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
// import { GoogleGenerativeAI } from "@google/generative-ai";
//
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
//
// export async function POST(req) {
//     const {message} = await req.json()
//
//     if (!message) {
//         return new Response(JSON.stringify({error: "Mesaj boş olamaz"}), {status: 400})
//     }
//
//     try {
//         // Gemini Flash modelini kullan (ücretsiz)
//         const model = genAI.getGenerativeModel({
//             model: "gemini-1.5-flash",
//             generationConfig: {
//                 temperature: 0.7,
//                 topK: 1,
//                 topP: 1,
//                 maxOutputTokens: 2048,
//             },
//         });
//
//         // Türkçe sistem mesajı ile başlat
//         const prompt = `Sen Türkçe konuşan yardımcı bir asistansın. Tüm sorulara Türkçe cevap ver.
//
// Kullanıcı sorusu: ${message}
//
// Lütfen Türkçe yanıtla:`;
//
//         const result = await model.generateContent(prompt);
//         const reply = result.response.text();
//
//         return new Response(JSON.stringify({reply}), {status: 200})
//     } catch (err) {
//         console.error("Gemini API Hatası:", err)
//         return new Response(JSON.stringify({error: "Yanıt alınamadı"}), {status: 500})
//     }
// }
// app/api/chat/route.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function retryWithBackoff(fn, maxRetries = 3, delay = 1000) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        } catch (error) {
            if (error.status === 503 && i < maxRetries - 1) {
                console.log(`Retry ${i + 1}/${maxRetries} after ${delay}ms`);
                await new Promise(resolve => setTimeout(resolve, delay));
                delay *= 2; // Exponential backoff
            } else {
                throw error;
            }
        }
    }
}

export async function POST(request) {
    try {
        const { message } = await request.json();

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await retryWithBackoff(async () => {
            return await model.generateContent(message);
        });

        const response = await result.response;
        const text = response.text();

        return new Response(JSON.stringify({ message: text }), {
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Gemini API Hatası:", error);

        if (error.status === 503) {
            return new Response(
                JSON.stringify({
                    error: "Servis geçici olarak kullanılamıyor. Lütfen birkaç saniye sonra tekrar deneyin."
                }),
                { status: 503, headers: { "Content-Type": "application/json" } }
            );
        }

        return new Response(
            JSON.stringify({ error: "Bir hata oluştu." }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}