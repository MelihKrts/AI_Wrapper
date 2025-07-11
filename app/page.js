import ChatWrapper from "@/app/component/ChatWrapper";

export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-gray-800 mb-2">
                            AI Chat Asistanı
                        </h1>
                        <p className="text-gray-600">
                            Sorularınızı sorun, size yardımcı olmaktan mutluluk duyarım!
                        </p>
                    </div>
                    <ChatWrapper />
                </div>
            </div>
        </div>
    );
}