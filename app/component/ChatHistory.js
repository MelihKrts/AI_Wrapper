"use client"
import { Bot, User, Clock, Copy, Check } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function ChatHistory({ messages }) {
    const [copiedId, setCopiedId] = useState(null);

    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString('tr-TR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const copyToClipboard = async (text, id) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
        } catch (err) {
            console.error('Kopyalama hatası:', err);
        }
    };

    // Markdown componentları
    const components = {
        code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : 'javascript';
            const codeString = String(children).replace(/\n$/, '');
            // Her render'da aynı ID'yi kullanmak için daha stabil bir yaklaşım
            const codeId = `code-${codeString.slice(0, 20).replace(/[^a-zA-Z0-9]/g, '')}-${codeString.length}`;

            return !inline ? (
                <div className="relative group my-3">
                    <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
                        <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
                            <span className="text-gray-300 text-sm font-medium capitalize">
                                {language}
                            </span>
                            <button
                                onClick={() => copyToClipboard(codeString, codeId)}
                                className="flex items-center gap-1 text-gray-300 hover:text-white text-sm px-2 py-1 rounded hover:bg-gray-700 transition-colors opacity-0 group-hover:opacity-100"
                                title="Kodu Kopyala"
                            >
                                {copiedId === codeId ? (
                                    <>
                                        <Check className="w-3 h-3" />
                                        <span className="hidden sm:inline">Kopyalandı</span>
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-3 h-3" />
                                        <span className="hidden sm:inline">Kopyala</span>
                                    </>
                                )}
                            </button>
                        </div>
                        <SyntaxHighlighter
                            style={oneDark}
                            language={language}
                            PreTag="div"
                            customStyle={{
                                margin: 0,
                                padding: '1rem',
                                fontSize: '0.875rem',
                                lineHeight: '1.5',
                                background: '#1a1a1a',
                            }}
                            codeTagProps={{
                                style: {
                                    fontSize: '0.875rem',
                                    fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
                                }
                            }}
                        >
                            {codeString}
                        </SyntaxHighlighter>
                    </div>
                </div>
            ) : (
                <code
                    className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm font-mono border mx-1"
                    {...props}
                >
                    {children}
                </code>
            );
        },
        // Bu sorunlu p elementi kaldırıldı ve div ile değiştirildi
        p({ children }) {
            return <div className="mb-2 last:mb-0 leading-relaxed">{children}</div>;
        },
        ul({ children }) {
            return <ul className="list-disc pl-5 mb-2 space-y-1">{children}</ul>;
        },
        ol({ children }) {
            return <ol className="list-decimal pl-5 mb-2 space-y-1">{children}</ol>;
        },
        li({ children }) {
            return <li className="text-sm">{children}</li>;
        },
        h1({ children }) {
            return <h1 className="text-lg font-bold mb-2 text-gray-900">{children}</h1>;
        },
        h2({ children }) {
            return <h2 className="text-base font-semibold mb-2 text-gray-800">{children}</h2>;
        },
        h3({ children }) {
            return <h3 className="text-sm font-medium mb-1 text-gray-700">{children}</h3>;
        },
        blockquote({ children }) {
            return (
                <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-2">
                    {children}
                </blockquote>
            );
        },
        a({ href, children }) {
            return (
                <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                >
                    {children}
                </a>
            );
        },
        strong({ children }) {
            return <strong className="font-semibold text-gray-900">{children}</strong>;
        },
        em({ children }) {
            return <em className="italic text-gray-700">{children}</em>;
        }
    };

    return (
        <div className="space-y-3 sm:space-y-4">
            {messages.map((message) => (
                <div
                    key={message.id}
                    className={`flex gap-2 sm:gap-3 ${
                        message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                >
                    {message.role === "assistant" && (
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                        </div>
                    )}

                    <div
                        className={`
                            max-w-[90%] 
                            xs:max-w-[85%] 
                            sm:max-w-[80%] 
                            md:max-w-[75%] 
                            lg:max-w-[70%] 
                            xl:max-w-[65%] 
                            2xl:max-w-[60%] 
                            rounded-2xl px-3 py-2 sm:px-4 sm:py-3 ${
                            message.role === "user"
                                ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-tr-md"
                                : message.isError
                                    ? "bg-red-50 border border-red-200 text-red-700"
                                    : "bg-white shadow-md border border-gray-200 rounded-tl-md"
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
                                <div className="text-sm leading-relaxed">
                                    {message.role === "user" ? (
                                        <p className="whitespace-pre-wrap">{message.content}</p>
                                    ) : (
                                        <div className="prose prose-sm max-w-none">
                                            <ReactMarkdown components={components}>
                                                {message.content}
                                            </ReactMarkdown>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                                    <div className={`flex items-center gap-1 text-xs ${
                                        message.role === "user" ? "text-white/70" : "text-gray-500"
                                    }`}>
                                        <Clock className="w-3 h-3" />
                                        {formatTime(message.timestamp)}
                                    </div>

                                    {message.role === "assistant" && !message.isLoading && (
                                        <button
                                            onClick={() => copyToClipboard(message.content, message.id)}
                                            className="flex items-center gap-1 text-gray-400 hover:text-gray-600 text-xs px-2 py-1 rounded hover:bg-gray-100 transition-colors"
                                            title="Mesajı Kopyala"
                                        >
                                            {copiedId === message.id ? (
                                                <>
                                                    <Check className="w-3 h-3" />
                                                    <span className="hidden sm:inline">Kopyalandı</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="w-3 h-3" />
                                                    <span className="hidden sm:inline">Kopyala</span>
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {message.role === "user" && (
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}