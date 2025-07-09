"use client"
import {useState} from "react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";

export default function ChatInput({onSend}) {

    const [text, setText] = useState("")
    // Send data (veri gönderme)

    const [error,setError] = useState("")
    // Hata kontrol boş bırakınca (error control not empty inputfield)

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!text.trim()) {
            setError(true)
            return // not send message
        }

        onSend(text.trim())
        setText("")
        setError(false)
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-1 mt-4">
            <div className="flex gap-2">
                <Input
                    placeholder="Bir şey yaz..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className={`flex-1 ${error ? "border-red-500" : ""}`}
                />
                <Button type="submit">Gönder</Button>
            </div>
            {error && (
                <span className="text-red-500 text-sm ml-1">Burası Boş Bırakılamaz.</span>
            )}
        </form>

    )
}