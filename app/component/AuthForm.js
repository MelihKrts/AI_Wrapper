
"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function AuthForm() {
    const [email, setEmail] = useState("")
    const [message, setMessage] = useState("")

    const handleLogin = async (e) => {
        e.preventDefault()

        // Dinamik olarak mevcut URL'yi al
        const redirectUrl = window.location.origin

        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: redirectUrl,
            },
        })

        if (error) {
            setMessage("Bir hata oluştu: " + error.message)
        } else {
            setMessage("Giriş bağlantısı e-posta adresinize gönderildi.")
        }
    }

    return (
        <form onSubmit={handleLogin} className="space-y-4">
            <input
                type="email"
                placeholder="E-posta adresi"
                className="w-full border p-2 rounded"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                Giriş Yap
            </button>
            {message && <p className="text-sm text-gray-600">{message}</p>}
        </form>
    )
}