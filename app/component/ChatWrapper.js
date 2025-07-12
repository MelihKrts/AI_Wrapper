"use client"
import {useEffect, useRef, useState} from "react";
import ChatHistory from "@/app/component/ChatHistory";
import ChatInput from "@/app/component/ChatInput";
import Image from "next/image";

export default function ChatWrapper() {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // LocalStorage key
    const MESSAGES_KEY = 'chat_messages';

    // Mesajları localStorage'dan yükle
    useEffect(() => {
        const savedMessages = localStorage.getItem(MESSAGES_KEY);
        if (savedMessages) {
            try {
                const parsedMessages = JSON.parse(savedMessages);
                setMessages(parsedMessages);
            } catch (error) {
                console.error('Mesajlar yüklenirken hata:', error);
                // Hata durumunda varsayılan mesajı ekle
                setDefaultMessage();
            }
        } else {
            // İlk kez açıldığında varsayılan mesajı ekle
            setDefaultMessage();
        }
    }, []);

    // Varsayılan hoş geldin mesajını ayarla
    const setDefaultMessage = () => {
        const defaultMessage = {
            id: 1,
            role: "assistant",
            content: "Merhaba! Size nasıl yardımcı olabilirim? Herhangi bir sorunuz varsa çekinmeden sorabilirsiniz.",
            timestamp: new Date().toISOString(),
        };
        setMessages([defaultMessage]);
    };

    // Mesajları localStorage'a kaydet
    useEffect(() => {
        if (messages.length > 0) {
            localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
        }
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages]);

    // Sohbeti temizle
    const clearChat = () => {
        localStorage.removeItem(MESSAGES_KEY);
        setDefaultMessage();
    };

    const handleMessage = async (text) => {
        const userMessage = {
            id: Date.now(),
            role: "user",
            content: text,
            timestamp: new Date().toISOString(),
        }

        const loadingMessage = {
            id: Date.now() + 1,
            role: "assistant",
            content: "",
            isLoading: true,
            timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, userMessage, loadingMessage])
        setIsLoading(true)

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({message: text})
            })
            const data = await res.json()

            setMessages((prev) => prev.map((msg) => msg.id === loadingMessage.id ? {
                ...msg,
                content: data.reply || "Yanıt Alınamadı",
                isLoading: false
            } : msg))
        } catch (error) {
            console.error("API Hatası:", error);
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === loadingMessage.id
                        ? {
                            ...msg,
                            content: "⚠️ Hata oluştu. Lütfen tekrar deneyin.",
                            isLoading: false,
                            isError: true
                        }
                        : msg
                )
            );
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex flex-col h-[calc(100dvh-120px)] sm:h-[calc(100dvh-160px)] lg:h-[calc(100dvh-200px)] bg-white/50 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-3 sm:p-4 flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
                    <div className="size-8 sm:size-10 bg-white/20 overflow-hidden rounded-full flex items-center justify-center">
                        <Image src="/img/roboteset.png" alt="robot eset" width={40} height={40} />
                    </div>
                    <div>
                        <h2 className="font-semibold text-sm sm:text-base">Chat Asistanı</h2>
                        <p className="text-xs text-white/80">
                            {isLoading ? "Yazıyor..." : "Çevrimiçi"}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={clearChat}
                        className="text-white/80 hover:text-white text-xs sm:text-sm px-2 py-1 rounded-lg hover:bg-white/10 transition-colors"
                        title="Sohbeti Temizle"
                    >
                        Temizle
                    </button>
                    <div className={`size-2 rounded-full ${isLoading ? 'bg-yellow-300 animate-pulse' : 'bg-green-300'}`}></div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
                <ChatHistory messages={messages} />
                <div ref={messagesEndRef} />
            </div>

            <ChatInput onSend={handleMessage} isLoading={isLoading} />
        </div>
    )
}