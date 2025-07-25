import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import Card from './Card';
import { SendIcon, ChatBubbleIcon } from './icons';

const Chat: React.FC = () => {
    const { chatMessages, sendMessage, currentUser } = useAppContext();
    const [message, setMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatMessages]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim() && currentUser) {
            sendMessage(message.trim());
            setMessage('');
        }
    };

    return (
        <Card className="flex flex-col h-[400px]">
            <h3 className="text-lg font-bold text-brand-primary flex items-center mb-2">
                <ChatBubbleIcon className="mr-2" />
                Discussion de groupe
            </h3>
            <div className="flex-grow overflow-y-auto pr-2 space-y-4">
                {chatMessages.map((msg) => (
                    <div key={msg.id} className={`flex items-end gap-2 ${msg.userId === currentUser?.id ? 'justify-end' : 'justify-start'}`}>
                        {msg.userId !== currentUser?.id && <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center font-bold text-sm text-gray-600">{msg.username.charAt(0)}</div>}
                        <div className={`max-w-xs md:max-w-md p-3 rounded-lg ${msg.userId === currentUser?.id ? 'bg-brand-secondary text-white' : 'bg-gray-200 text-gray-800'}`}>
                            {msg.userId !== currentUser?.id && <p className="text-xs font-bold mb-1">{msg.username}</p>}
                            <p className="text-sm">{msg.message}</p>
                            <p className={`text-xs mt-1 opacity-70 ${msg.userId === currentUser?.id ? 'text-right' : 'text-left'}`}>
                                {new Date(msg.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="mt-4 flex items-center space-x-2">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Votre message..."
                    className="flex-grow p-2 border border-gray-300 rounded-full focus:ring-brand-secondary focus:border-brand-secondary"
                />
                <button type="submit" className="bg-brand-primary text-white rounded-full p-2 hover:bg-blue-800 transition-colors">
                    <SendIcon />
                </button>
            </form>
        </Card>
    );
};

export default Chat;
