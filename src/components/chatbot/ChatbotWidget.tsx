"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  MessageCircle,
  X,
  Send,
  RotateCcw,
  Bot,
  User,
  Sparkles,
  ExternalLink,
  ChevronRight,
} from "lucide-react";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  time: string;
  isAi?: boolean;
  waUrl?: string;
}

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [quickQuestions, setQuickQuestions] = useState<string[]>([
    "Berapa harga cuci AC 1 PK?",
    "Apakah instalasi listrik bergaransi?",
    "Berapa estimasi biaya bor sumur 30 meter?",
    "Area mana saja di Tangsel yang dijangkau?",
    "AC saya tidak dingin, kenapa ya?",
  ]);
  const [greeting, setGreeting] = useState(
    "Halo! Saya Asisten Virtual SiTeknik. Ada yang bisa saya bantu seputar jasa listrik, AC, atau bor sumur di Tangerang Selatan?"
  );
  const [whatsappNumber, setWhatsappNumber] = useState("6281234567890");
  const [hasInitialized, setHasInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chatbot configuration
  useEffect(() => {
    async function loadConfig() {
      try {
        const res = await fetch("/api/chat");
        if (res.ok) {
          const data = await res.json();
          if (data.config?.greeting) setGreeting(data.config.greeting);
          if (data.config?.quickQuestions?.length) {
            setQuickQuestions(data.config.quickQuestions);
          }
          if (data.settings?.whatsappNumber) {
            setWhatsappNumber(data.settings.whatsappNumber);
          }
        }
      } catch (err) {
        console.error("Failed to load chat config", err);
      }
    }
    loadConfig();
  }, []);

  // Initialize greeting message on first open
  useEffect(() => {
    if (isOpen && !hasInitialized && messages.length === 0) {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      setMessages([
        {
          id: "welcome-1",
          sender: "bot",
          text: greeting,
          time: timeStr,
        },
      ]);
      setHasInitialized(true);
    }
  }, [isOpen, hasInitialized, greeting, messages.length]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSendMessage = async (msgText?: string) => {
    const textToSend = msgText || inputMessage;
    if (!textToSend.trim() || isLoading) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: textToSend.trim(),
      time: timeStr,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!msgText) setInputMessage("");
    setIsLoading(true);

    try {
      // Build lightweight conversation history
      const history = messages.slice(-4).map((m) => ({
        role: (m.sender === "user" ? "user" : "model") as "user" | "model",
        text: m.text,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend.trim(), history }),
      });

      if (res.ok) {
        const data = await res.json();
        const botMsg: Message = {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: data.reply,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isAi: data.isAiGenerated,
          waUrl: data.waUrl,
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        const errorMsg: Message = {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: "Mohon maaf, sistem sedang sibuk. Silakan langsung hubungi admin WhatsApp kami untuk respon cepat.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, errorMsg]);
      }
    } catch (err) {
      const errorMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: "Terjadi kesalahan sambungan jaringan. Anda dapat berkonsultasi langsung melalui WhatsApp kami.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: "bot",
        text: greeting,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  // Generate WhatsApp summary message
  const createWhatsAppSummaryUrl = () => {
    const lastUserQuery = messages.filter((m) => m.sender === "user").pop()?.text || "Konsultasi Layanan";
    const lastBotReply = messages.filter((m) => m.sender === "bot").pop()?.text || "";
    const shortSummary = lastBotReply.slice(0, 200).replace(/\n/g, " ");

    const text = `Halo Admin, saya ingin berkonsultasi mengenai layanan.\n\nJenis Layanan: Teknik & Perawatan Rumah\nKebutuhan: ${lastUserQuery}\nLokasi: Tangerang Selatan\nInformasi yang sudah diperoleh dari chatbot: ${shortSummary}...\n\nMohon informasi lebih lanjut. Terima kasih.`;
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Buka Chatbot AI SiTeknik"
          className="relative flex items-center gap-2.5 bg-navy-900 hover:bg-navy-800 text-white px-4 py-3 rounded-full shadow-xl shadow-navy-900/30 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 border border-brand-accent/30"
        >
          <div className="relative w-7 h-7 rounded-full bg-gradient-to-tr from-brand-accent to-amber-500 flex items-center justify-center text-white shadow-sm">
            <Bot className="w-4 h-4" />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold font-heading">Tanya AI SiTeknik</span>
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <p className="text-[10px] text-slate-300">Respon Instan 24 Jam</p>
          </div>
        </button>
      )}

      {/* Chat Window Panel */}
      {isOpen && (
        <div className="w-[90vw] sm:w-[400px] h-[550px] max-h-[85vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900 p-4 text-white flex items-center justify-between border-b border-navy-700">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-accent to-amber-500 flex items-center justify-center text-white shadow-md">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold font-heading leading-tight">Asisten AI SiTeknik</h3>
                  <span className="text-[10px] font-medium bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-500/30">
                    Online
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">Database Resmi Tangerang Selatan</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleResetChat}
                title="Mulai percakapan baru"
                className="p-1.5 text-slate-300 hover:text-white hover:bg-navy-700/60 rounded-lg transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Tutup chat"
                className="p-1.5 text-slate-300 hover:text-white hover:bg-navy-700/60 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/70 text-sm">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.sender === "bot" && (
                  <div className="w-7 h-7 rounded-full bg-navy-800 text-brand-accent flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-navy-900 text-white rounded-br-none shadow-sm"
                      : "bg-white text-slate-800 border border-slate-200/80 rounded-bl-none shadow-sm"
                  }`}
                >
                  <div className="whitespace-pre-line">{msg.text}</div>
                  <div
                    className={`text-[10px] mt-1 text-right ${
                      msg.sender === "user" ? "text-slate-300" : "text-slate-400"
                    }`}
                  >
                    {msg.time}
                  </div>
                </div>

                {msg.sender === "user" && (
                  <div className="w-7 h-7 rounded-full bg-brand-accent text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <div className="flex gap-2.5 items-center text-xs text-slate-500 italic">
                <div className="w-7 h-7 rounded-full bg-navy-800 text-brand-accent flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 animate-bounce" />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none px-3 py-2 flex items-center gap-1.5 shadow-sm">
                  <span className="w-1.5 h-1.5 bg-brand-accent rounded-full animate-pulse"></span>
                  <span className="w-1.5 h-1.5 bg-brand-accent rounded-full animate-pulse delay-150"></span>
                  <span className="w-1.5 h-1.5 bg-brand-accent rounded-full animate-pulse delay-300"></span>
                  <span className="ml-1 text-[11px] text-slate-500">Mencari di database...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions Pill Carousel */}
          {messages.length <= 3 && !isLoading && (
            <div className="px-3 py-2 bg-white border-t border-slate-100">
              <p className="text-[11px] font-semibold text-slate-500 mb-1.5 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-brand-accent" />
                Pertanyaan Populer:
              </p>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                {quickQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(q)}
                    className="text-left text-[11px] bg-slate-100 hover:bg-brand-accent/10 hover:text-brand-accent text-slate-700 px-2.5 py-1 rounded-full border border-slate-200 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action WhatsApp Bridge */}
          <div className="px-3 py-1.5 bg-slate-100/90 border-t border-slate-200 flex items-center justify-between text-xs">
            <span className="text-[11px] text-slate-500">Butuh solusi langsung?</span>
            <a
              href={createWhatsAppSummaryUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-emerald-600 hover:text-emerald-700"
            >
              <span>Hubungi Admin via WhatsApp</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Input Box */}
          <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSendMessage();
              }}
              placeholder="Tanyakan harga, garansi, atau layanan..."
              className="flex-1 text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-accent/30 focus:border-brand-accent"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !inputMessage.trim()}
              aria-label="Kirim Pesan"
              className="p-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 disabled:opacity-40 text-brand-accent hover:text-white transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

