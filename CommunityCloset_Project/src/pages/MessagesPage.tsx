import React, { useState } from 'react';
import { Send } from 'lucide-react';
import type { ChatMessage, User, Transaction } from '../types';

interface MessagesPageProps {
  currentUser: User;
  transactions: Transaction[];
  messages: ChatMessage[];
  onSendMessage: (msg: ChatMessage) => void;
}

export const MessagesPage: React.FC<MessagesPageProps> = ({
  currentUser,
  transactions,
  messages,
  onSendMessage
}) => {
  const [selectedTxId, setSelectedTxId] = useState<string>(transactions[0]?.id || 'tx-101');
  const [textInput, setTextInput] = useState('');

  const activeTx = transactions.find(t => t.id === selectedTxId) || transactions[0];
  const txMessages = messages.filter(m => m.transactionId === selectedTxId);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim() || !activeTx) return;

    const receiverId = activeTx.borrowerId === currentUser.id ? activeTx.lenderId : activeTx.borrowerId;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      transactionId: activeTx.id,
      senderId: currentUser.id,
      senderName: currentUser.name,
      receiverId,
      text: textInput,
      readStatus: false,
      timestamp: new Date().toISOString()
    };

    onSendMessage(newMsg);
    setTextInput('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-6">
      <div>
        <h1 className="text-3xl font-black text-gray-900">Katraj Messages Hub</h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">Chat live with lenders and borrowers regarding pickup times and locations.</p>
      </div>

      <div className="bg-white rounded-3xl border border-[#FFC0CB]/80 shadow-md grid grid-cols-1 md:grid-cols-3 min-h-[550px] overflow-hidden">
        
        {/* Transaction Chat List */}
        <div className="border-r border-gray-100 p-4 space-y-3 bg-[#FFF0F5]/30">
          <h3 className="font-extrabold text-xs text-gray-400 uppercase tracking-wider px-2">Active Conversations</h3>
          
          {transactions.length === 0 ? (
            <p className="text-xs text-gray-400 p-2">No active conversations.</p>
          ) : (
            transactions.map((tx) => {
              const active = tx.id === selectedTxId;
              const otherName = tx.borrowerId === currentUser.id ? tx.lenderName : tx.borrowerName;
              return (
                <div
                  key={tx.id}
                  onClick={() => setSelectedTxId(tx.id)}
                  className={`p-3.5 rounded-2xl cursor-pointer transition-all border ${
                    active
                      ? 'bg-white border-[#FFC0CB] shadow-sm'
                      : 'hover:bg-white/60 border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-extrabold text-xs text-gray-900">{otherName}</span>
                    <span className="text-[10px] font-bold uppercase text-[#900C3F] bg-[#FFF0F5] px-2 py-0.5 rounded-md">
                      {tx.status}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-[#900C3F] truncate">{tx.listingTitle}</p>
                </div>
              );
            })
          )}
        </div>

        {/* Chat Conversation Pane */}
        <div className="md:col-span-2 flex flex-col justify-between p-4 sm:p-6 bg-white">
          
          {activeTx ? (
            <>
              {/* Header */}
              <div className="pb-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-gray-900 text-base">{activeTx.listingTitle}</h3>
                  <p className="text-xs text-gray-500">
                    Lender: {activeTx.lenderName} | Borrower: {activeTx.borrowerName}
                  </p>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Katraj Meetup Pickup
                </span>
              </div>

              {/* Message List */}
              <div className="flex-1 py-4 space-y-3 overflow-y-auto max-h-[380px]">
                {txMessages.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-8">No messages yet. Send a message to coordinate pickup in Katraj!</p>
                ) : (
                  txMessages.map((m) => {
                    const isMe = m.senderId === currentUser.id;
                    return (
                      <div
                        key={m.id}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-[75%] p-3 rounded-2xl text-xs leading-relaxed shadow-sm ${
                            isMe
                              ? 'bg-[#900C3F] text-white rounded-br-none'
                              : 'bg-gray-100 text-gray-800 rounded-bl-none'
                          }`}
                        >
                          <span className="font-bold block text-[10px] opacity-75 mb-0.5">{m.senderName}</span>
                          <p>{m.text}</p>
                        </div>
                        <span className="text-[10px] text-gray-400 mt-1 px-1">
                          {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Input Bar */}
              <form onSubmit={handleSend} className="pt-3 border-t border-gray-100 flex gap-2">
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Type a message regarding Katraj pickup..."
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 text-xs focus:outline-none focus:border-[#900C3F]"
                />
                <button
                  type="submit"
                  className="bg-[#900C3F] hover:bg-[#700931] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow transition-all flex items-center space-x-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 text-xs">
              Select a conversation to view chat history.
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
