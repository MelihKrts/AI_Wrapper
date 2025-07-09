export default function ChatHistory({ messages }) {
    return (
        <div className="flex flex-col gap-3 mt-4 px-2 max-h-[60vh] overflow-y-auto">
            {messages.map((msg) => (
                <div
                    key={msg.id}
                    className={`px-4 py-2 rounded-2xl text-sm w-fit max-w-[80%] shadow ${
                        msg.role === "user"
                            ? "bg-blue-600 text-white self-end"
                            : "bg-gray-100 text-gray-800 self-start"
                    }`}
                >
                    {msg.content}
                </div>
            ))}
        </div>
    )
}
