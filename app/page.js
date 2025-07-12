import ChatWrapper from "@/app/component/ChatWrapper";

export default function Home() {
    return (
        <div className="min-h-dvh bg-gradient-to-br from-slate-50 to-blue-50 px-2 sm:px-4 lg:px-6 xl:px-8">
            <div className="container mx-auto py-4 sm:py-6 lg:py-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-4 sm:mb-6 lg:mb-8">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-800 mb-2">
                            🤖 AI Chat Asistanı
                        </h1>
                        <p className="text-sm sm:text-base lg:text-lg text-gray-600 px-4 max-w-3xl mx-auto">
                            Sorularınızı sorun, size yardımcı olmaktan mutluluk duyarım!
                        </p>
                    </div>
                    <ChatWrapper />
                </div>
            </div>
        </div>
    );
}