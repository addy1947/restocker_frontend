import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FiMessageCircle, FiX, FiSend } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useParams } from 'react-router-dom';


export default function FloatingChat() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([]); // {id, from: 'user'|'bot', text}
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const boxRef = useRef(null);
    const inputRef = useRef(null);
    const scrollRef = useRef(null);
    const { _id } = useAuth();
    const { productId } = useParams();

    // Close when clicking outside
    useEffect(() => {
        const handleOutside = (e) => {
            if (open && boxRef.current && !boxRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleOutside);
        return () => document.removeEventListener('mousedown', handleOutside);
    }, [open]);

    // focus input when opened
    useEffect(() => {
        if (open) inputRef.current?.focus();
    }, [open]);

    // auto-scroll to bottom on new message
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
        }
    }, [messages, open]);

    const sendMessage = async (text) => {
        const trimmed = text?.trim();
        if (!trimmed) return;

        const userMsg = { id: Date.now() + Math.random(), from: 'user', text: trimmed };
        setMessages((s) => [...s, userMsg]);
        setInput('');

        setLoading(true);
        try {
            if (productId) {
                const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/chat/ai`, { message: trimmed, userId: _id, productId });
                const botText = res?.data?.reply ?? res?.data?.message ?? (typeof res?.data === 'string' ? res.data : JSON.stringify(res?.data));
                const botMsg = { id: Date.now() + Math.random(), from: 'bot', text: botText };
                setMessages((s) => [...s, botMsg]);
            }
            else {
                const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/chat/ai`, { message: trimmed, userId: _id });
                // Try a few common response shapes
                const botText = res?.data?.reply ?? res?.data?.message ?? (typeof res?.data === 'string' ? res.data : JSON.stringify(res?.data));
                const botMsg = { id: Date.now() + Math.random(), from: 'bot', text: botText };
                setMessages((s) => [...s, botMsg]);
            }
        } catch (err) {
            console.error('Send message error', err);
            const errMsg = { id: Date.now() + Math.random(), from: 'bot', text: 'Sorry — failed to contact the server.' };
            setMessages((s) => [...s, errMsg]);
        } finally {
            setLoading(false);
        }
    };

    // Enter to send, Shift+Enter for newline
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage(input);
        }
    };

    return (
        <>
            {/* Floating Button */}
            <button
                aria-label={open ? 'Close chat' : 'Open chat'}
                onClick={() => setOpen((s) => !s)}
                className="fixed right-6 bottom-6 z-50 w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-white focus:outline-none transition-transform transform hover:scale-105"
                style={{ background: 'linear-gradient(135deg,#0ea5e9,#6366f1)' }}
            >
                {open ? <FiX size={24} /> : <FiMessageCircle size={24} />}
            </button>

            {/* Chat panel */}
            {open && (
                <div className="fixed right-6 bottom-24 z-50 w-80 md:w-96 h-96 rounded-2xl shadow-2xl backdrop-blur-sm" style={{ background: 'rgba(255,255,255,0.65)' }}>
                    <div ref={boxRef} className="flex flex-col h-full overflow-hidden">
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-2 border-b">
                            <div className="flex items-center gap-2">
                                <div className="w-9 h-9 rounded-full flex items-center justify-center bg-white shadow-sm">
                                    <FiMessageCircle />
                                </div>
                                <div>
                                    <div className="text-sm font-semibold">AI Assistant</div>
                                    <div className="text-xs text-gray-600">Ask me anything — press Enter to send</div>
                                </div>
                            </div>
                            <button onClick={() => setOpen(false)} className="p-2 rounded-md hover:bg-gray-100">
                                <FiX />
                            </button>
                        </div>

                        {/* Messages */}
                        <div ref={scrollRef} className="flex-1 overflow-auto p-4 space-y-3">
                            {messages.length === 0 && (
                                <div className="text-sm text-gray-600">Say hi 👋 — I'll answer here.</div>
                            )}

                            {messages.map((m) => (
                                <div key={m.id} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${m.from === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-gray-900 rounded-bl-none shadow'}`}>
                                        {m.text}
                                    </div>
                                </div>
                            ))}

                            {loading && (
                                <div className="flex justify-start">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <div className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin" />
                                        Thinking...
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input */}
                        <div className="px-3 py-3 border-t bg-transparent">
                            <div className="flex items-center gap-2">
                                <textarea
                                    ref={inputRef}
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    rows={1}
                                    placeholder="Type a message and press Enter"
                                    className="flex-1 resize-none rounded-xl px-3 py-2 text-sm placeholder-gray-500 focus:outline-none focus:ring-0 bg-white/90"
                                />
                                <button
                                    onClick={() => sendMessage(input)}
                                    disabled={loading || !input.trim()}
                                    className="p-2 rounded-lg bg-blue-600 text-white disabled:opacity-50"
                                >
                                    <FiSend />
                                </button>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">Shift+Enter for newline</div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}