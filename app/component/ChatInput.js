"use client"
import {useRef, useState} from "react";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {Send, Paperclip} from "lucide-react"

export default function ChatInput({onSend, isLoading}) {
    const [text, setText] = useState("");
    const [error, setError] = useState("");
    const textareaRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!text.trim()) {
            setError("Lütfen bir mesaj yazın")
            return
        }
        if (isLoading) return;

        onSend(text.trim())
        setText("")
        setError("")

        // Textarea yüksekliğini sıfırla
        if (textareaRef.current) {
            textareaRef.current.style.height = "48px"
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e)
        }
    }

    const adjustTextareaHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto"
            textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px"
        }
    }

    return (
        <div className="sticky bottom-0 bg-white/90 backdrop-blur-sm border-t border-gray-200 p-3 sm:p-4">
            <div className="max-w-4xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-2">
                    <div className="flex items-end gap-2 sm:gap-3">
                        <div className="flex-1 relative">
                            <Textarea
                                ref={textareaRef}
                                placeholder="Mesajınızı buraya yazın... (Enter: gönder, Shift+Enter: yeni satır)"
                                value={text}
                                onChange={(e) => {
                                    setText(e.target.value);
                                    adjustTextareaHeight()
                                    if (error) setError("")
                                }}
                                onKeyDown={handleKeyDown}
                                className={`min-h-[48px] max-h-[120px] resize-none rounded-xl border-2 transition-all duration-200 pr-12 text-sm sm:text-base ${
                                    error
                                        ? "border-red-400 focus:border-red-500"
                                        : "border-gray-200 focus:border-blue-400 hover:border-gray-300"
                                } ${isLoading ? 'opacity-50' : ''}`}
                                disabled={isLoading}
                            />

                            {/* Karakter sayısı göstergesi */}
                            <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                                {text.length}/2000
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                type="submit"
                                disabled={!text.trim() || isLoading || text.length > 2000}
                                className="size-10 sm:size-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:hover:scale-100"
                                title={isLoading ? "Mesaj gönderiliyor..." : "Mesajı gönder"}
                            >
                                <Send className="size-4 sm:size-5" />
                            </Button>
                        </div>
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 text-red-500 text-sm animate-in slide-in-from-top-2 duration-200">
                            <span className="size-1 bg-red-500 rounded-full"></span>
                            {error}
                        </div>
                    )}

                    {text.length > 1800 && (
                        <div className="flex items-center gap-2 text-orange-500 text-sm">
                            <span className="size-1 bg-orange-500 rounded-full"></span>
                            Karakter sınırına yaklaşıyorsunuz ({text.length}/2000)
                        </div>
                    )}

                    {/* Klavye kısayolları ipucu */}
                    <div className="text-xs text-gray-400 text-center sm:text-left">
                        💡 <span className="font-medium">Enter</span> ile gönder, <span className="font-medium">Shift + Enter</span> ile yeni satır
                    </div>
                </form>
            </div>
        </div>
    )
}