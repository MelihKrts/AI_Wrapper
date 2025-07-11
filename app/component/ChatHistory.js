"use client"
import { Bot, User, Clock } from "lucide-react";

export default function ChatHistory({ messages }) {
    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString('tr-TR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="space-y-4">
            {messages.map((message) => (
                <div
                    key={message.id}
                    className={`flex gap-3 ${
                        message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                >
                    {message.role === "assistant" && (
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <Bot className="w-4 h-4 text-white" />
                        </div>
                    )}

                    <div
                        className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                            message.role === "user"
                                ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                                : message.isError
                                    ? "bg-red-50 border border-red-200 text-red-700"
                                    : "bg-white shadow-md border border-gray-200"
                        }`}
                    >
                        {message.isLoading ? (
                            <div className="flex items-center gap-2">
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                                <span className="text-sm text-gray-500">Yazıyor...</span>
                            </div>
                        ) : (
                            <div>
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                    {message.content}
                                </p>
                                <div className={`flex items-center gap-1 mt-2 text-xs ${
                                    message.role === "user" ? "text-white/70" : "text-gray-500"
                                }`}>
                                    <Clock className="w-3 h-3" />
                                    {formatTime(message.timestamp)}
                                </div>
                            </div>
                        )}
                    </div>

                    {message.role === "user" && (
                        <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4 text-white" />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}