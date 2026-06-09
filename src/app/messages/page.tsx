"use client";

import { useGlobal } from '@/context/GlobalContext';
import { Send, UserCircle, Search, Paperclip, MoreVertical, MessageSquare } from 'lucide-react';
import { useState } from 'react';

export default function MessagesPage() {
  const { state, sendMessage } = useGlobal();
  const { currentUser, messages, tutors, students } = state;
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');

  if (!currentUser) {
    return <div className="p-20 text-center text-xl font-bold">Please log in to view messages.</div>;
  }

  // Get unique contacts
  const myMessages = messages.filter(m => m.senderId === currentUser.id || m.receiverId === currentUser.id);
  const contactIds = Array.from(new Set(myMessages.map(m => m.senderId === currentUser.id ? m.receiverId : m.senderId)));
  
  // Contacts data
  const contacts = contactIds.map(id => {
    const isTutor = tutors.some(t => t.id === id);
    return isTutor ? tutors.find(t => t.id === id) : students.find(s => s.id === id);
  }).filter(Boolean);

  const activeContact = activeChatId ? contacts.find(c => c?.id === activeChatId) : null;
  const activeMessages = myMessages.filter(m => (m.senderId === currentUser.id && m.receiverId === activeChatId) || (m.senderId === activeChatId && m.receiverId === currentUser.id));

  // If no active chat but contacts exist, select the first one
  if (!activeChatId && contacts.length > 0) {
    setActiveChatId(contacts[0]?.id as string);
  }

  const handleSend = () => {
    if (newMessage.trim() && activeChatId) {
      sendMessage({
        senderId: currentUser.id,
        receiverId: activeChatId,
        content: newMessage.trim(),
      });
      setNewMessage('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-64px)]">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex h-full">
        
        {/* Left Sidebar (Contacts) */}
        <div className="w-1/3 border-r border-slate-200 flex flex-col bg-slate-50">
          <div className="p-4 border-b border-slate-200 bg-white">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Messages</h2>
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" />
              <input type="text" placeholder="Search messages..." className="w-full bg-slate-100 text-slate-800 rounded-full pl-10 pr-4 py-2 outline-none focus:ring-2 focus:ring-highfive-blue" />
            </div>
          </div>
          
          <div className="flex-grow overflow-y-auto">
            {contacts.map(contact => {
              if (!contact) return null;
              const lastMsg = myMessages.filter(m => m.senderId === contact.id || m.receiverId === contact.id).pop();
              return (
                <div 
                  key={contact.id} 
                  onClick={() => setActiveChatId(contact.id)}
                  className={`flex items-center p-4 cursor-pointer transition-colors ${activeChatId === contact.id ? 'bg-blue-50 border-l-4 border-highfive-blue' : 'hover:bg-slate-100 border-l-4 border-transparent'}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {'avatar' in contact ? (
                    <img src={contact.avatar} alt={contact.name} className="w-12 h-12 rounded-full object-cover mr-4" />
                  ) : (
                    <UserCircle className="w-12 h-12 text-slate-400 mr-4" />
                  )}
                  <div className="flex-grow min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-semibold text-slate-900 truncate">{contact.name}</h3>
                      {lastMsg && <span className="text-xs text-slate-500">{new Date(lastMsg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>}
                    </div>
                    <p className="text-sm text-slate-500 truncate">{lastMsg?.content}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Area (Chat Interface) */}
        {activeChatId && activeContact ? (
          <div className="w-2/3 flex flex-col bg-slate-50 relative">
            <div className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6">
              <div className="flex items-center space-x-3">
                <span className="font-bold text-slate-900">{activeContact.name}</span>
              </div>
              <MoreVertical className="w-5 h-5 text-slate-400 cursor-pointer" />
            </div>

            <div className="flex-grow overflow-y-auto p-6 space-y-4">
              {activeMessages.map(msg => {
                const isMe = msg.senderId === currentUser.id;
                return (
                  <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[70%] rounded-2xl px-5 py-3 ${isMe ? 'bg-highfive-blue text-white rounded-tr-sm' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm'}`}>
                      {msg.content}
                    </div>
                    <span className="text-xs text-slate-400 mt-1">{new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                );
              })}
            </div>

            <div className="p-4 bg-white border-t border-slate-200 flex items-center space-x-2">
              <button className="p-2 text-slate-400 hover:text-highfive-blue transition-colors">
                <Paperclip className="w-5 h-5" />
              </button>
              <input 
                type="text" 
                placeholder="Type your message..." 
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                className="flex-grow bg-slate-100 border-transparent rounded-full px-4 py-3 outline-none focus:ring-2 focus:ring-highfive-blue"
              />
              <button 
                onClick={handleSend}
                disabled={!newMessage.trim()}
                className="p-3 bg-highfive-blue text-white rounded-full hover:bg-blue-800 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5 ml-1" />
              </button>
            </div>
          </div>
        ) : (
          <div className="w-2/3 flex items-center justify-center bg-slate-50">
            <div className="text-center text-slate-500">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 text-slate-300" />
              <p>Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
