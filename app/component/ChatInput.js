"use client"
import {useRef, useState} from "react";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {Send} from "lucide-react"

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
        <div className="stikcy bottom-0 bg-white/80 backdrop-blur-sm border-t border-gray-200 p-4">
            <div className="max-w-4xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-2">
                    <div className="flex items-end gap-3">
                        <div className="flex-1">
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
                                className={`min-h-[48px] max-h-[120px] resize-none rounded-xl border-2 transition-all duration-200 ${error ? "border-red-400 focus:border-red-500" :"border-gray-200 focus:border-blue-400"}`}
                                disabled={isLoading}
                            />
                        </div>

                        <div className="flex gap-2">
                            <Button
                            type="submit"
                            disabled={!text.trim() || isLoading}
                            className="size-12 rounded-full cursor-pointer bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl">
                                <Send className="size-5" />
                            </Button>
                        </div>
                    </div>

                    {error && (
                        <div
                            className="flex items-center gap-2 text-red-500 text-sm animate-in slide-in-from-top-2 duration-200">
                            <span className="size-1 bg-red-500 rounded-full"></span>
                            {error}
                        </div>
                    )}

                </form>
            </div>
        </div>
    )
}