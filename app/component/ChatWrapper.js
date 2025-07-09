"use client"

import {useState} from "react"
import ChatInput from "@/app/component/ChatInput"
import ChatHistory from "@/app/component/ChatHistory"

export default function ChatWrapper() {
    const [messages, setMessages] = useState([
        {
            id: 1,
            role: "assistant",
            content: "Merhaba! Size nasıl yardımcı olabilirim?",
        },
    ])

    const handleMessage = async (text) => {
        const userMessage = {
            id: Date.now(),
            role: "user",
            content: text,
        }

        const loadingMessage = {
            id: Date.now() + 1,
            role: "assistant",
            content: "...",
        }

        setMessages((prev) => [...prev, userMessage, loadingMessage])

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message: text }),
            })

            const data = await res.json()

            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === loadingMessage.id
                        ? { ...msg, content: data.reply || "Yanıt alınamadı." }
                        : msg
                )
            )
        } catch (error) {
            console.error("API Hatası:", error)
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === loadingMessage.id
                        ? { ...msg, content: "⚠️ Hata oluştu. Lütfen tekrar deneyin." }
                        : msg
                )
            )
        }
    }

    return (
        <div className="p-4 max-w-xl mx-auto min-h-screen flex flex-col justify-between">
            <ChatHistory messages={messages}/>
            <ChatInput onSend={handleMessage}/>
        </div>
    )
}
