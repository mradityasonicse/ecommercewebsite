import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Search,
  Tag,
  ShieldCheck,
  Send,
} from 'lucide-react';
import { ChatService } from '../services/chatService';
import type { Conversation, ChatMessage } from '../types/bazaar';
import { UpiPaymentModal } from '../components/payment/UpiPaymentModal';

export const ChatPage: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string>('');
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [offerInput, setOfferInput] = useState<number>(0);
  const [showOfferDrawer, setShowOfferDrawer] = useState(false);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [payAmount, setPayAmount] = useState(0);

  const loadConversations = () => {
    const list = ChatService.getConversations();
    setConversations(list);
    if (!activeConvId && list.length > 0) {
      setActiveConvId(list[0].id);
      setOfferInput(Math.round(list[0].itemPrice * 0.85));
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    const handleUpdate = () => {
      const list = ChatService.getConversations();
      setConversations([...list]);
    };
    window.addEventListener('easehub_chat_updated', handleUpdate);
    return () => window.removeEventListener('easehub_chat_updated', handleUpdate);
  }, []);

  const activeConv = conversations.find((c) => c.id === activeConvId);

  useEffect(() => {
    if (activeConv) {
      setOfferInput(Math.round(activeConv.itemPrice * 0.85));
    }
  }, [activeConvId]);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!messageText.trim() || !activeConv) return;

    ChatService.sendMessage(activeConv.id, messageText.trim());
    setMessageText('');
    loadConversations();
  };

  const handleSendOffer = () => {
    if (!offerInput || !activeConv) return;

    ChatService.sendMessage(
      activeConv.id,
      `🤝 Made an offer of ₹${offerInput} for "${activeConv.itemTitle}"`,
      'current_student',
      'You',
      true,
      {
        offeredAmount: offerInput,
        status: 'pending',
      }
    );

    setShowOfferDrawer(false);
    loadConversations();
  };

  const filteredConversations = conversations.filter(
    (c) =>
      c.sellerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.itemTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAF7', color: '#0F172A', paddingTop: '5.5rem', paddingBottom: '2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', height: 'calc(100vh - 8rem)' }}>
        <div
          style={{
            height: '100%',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '1.25rem',
            boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
            display: 'grid',
            gridTemplateColumns: '340px 1fr',
            overflow: 'hidden',
          }}
        >
          {/* Sidebar Conversations */}
          <div style={{ borderRight: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', backgroundColor: '#F8FAF7' }}>
            {/* Sidebar Header */}
            <div style={{ padding: '1.25rem', borderBottom: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MessageSquare size={20} color="#15803D" />
                  <h2 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: '#0F172A' }}>Campus Chats</h2>
                </div>
                <span style={{ fontSize: '0.72rem', backgroundColor: '#DCFCE7', border: '1px solid #86EFAC', padding: '0.2rem 0.6rem', borderRadius: '9999px', color: '#15803D', fontWeight: 800 }}>
                  {conversations.length} Active
                </span>
              </div>

              {/* Search in Chats */}
              <div style={{ position: 'relative' }}>
                <Search size={15} color="#94A3B8" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Search chats or items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem 0.5rem 2.25rem',
                    borderRadius: '0.5rem',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #CBD5E1',
                    color: '#0F172A',
                    fontSize: '0.82rem',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            {/* Conversation List */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {filteredConversations.map((conv) => {
                const isSelected = conv.id === activeConvId;
                return (
                  <div
                    key={conv.id}
                    onClick={() => setActiveConvId(conv.id)}
                    style={{
                      padding: '0.9rem 1.25rem',
                      borderBottom: '1px solid #E2E8F0',
                      cursor: 'pointer',
                      backgroundColor: isSelected ? '#EFF5EC' : 'transparent',
                      borderLeft: isSelected ? '3px solid #16A34A' : '3px solid transparent',
                      display: 'flex',
                      gap: '0.75rem',
                      alignItems: 'center',
                      transition: 'background-color 0.15s ease',
                    }}
                  >
                    <img
                      src={conv.itemImage}
                      alt={conv.itemTitle}
                      style={{ width: '46px', height: '46px', borderRadius: '0.5rem', objectFit: 'cover', border: '1px solid #E2E8F0' }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.86rem', color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {conv.sellerName}
                        </span>
                        <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>
                          {new Date(conv.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#15803D', fontWeight: 700, marginBottom: '0.15rem' }}>
                        ₹{conv.itemPrice} • {conv.itemTitle}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#64748B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {conv.lastMessage}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chat Window */}
          {activeConv ? (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#FFFFFF' }}>
              {/* Chat Window Header */}
              <div
                style={{
                  padding: '1rem 1.5rem',
                  borderBottom: '1px solid #E2E8F0',
                  backgroundColor: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <img
                    src={activeConv.itemImage}
                    alt={activeConv.itemTitle}
                    style={{ width: '48px', height: '48px', borderRadius: '0.5rem', objectFit: 'cover', border: '1px solid #E2E8F0' }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0F172A' }}>
                        {activeConv.sellerName}
                      </h3>
                      <span
                        style={{
                          fontSize: '0.65rem',
                          backgroundColor: '#DCFCE7',
                          color: '#15803D',
                          padding: '0.15rem 0.45rem',
                          borderRadius: '9999px',
                          fontWeight: 700,
                          border: '1px solid #86EFAC',
                        }}
                      >
                        Verified Student
                      </span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#475569', marginTop: '0.15rem' }}>
                      {activeConv.itemTitle} • Listed at <strong style={{ color: '#15803D' }}>₹{activeConv.itemPrice}</strong>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={() => {
                      const amount = activeConv.currentOffer?.status === 'accepted' ? activeConv.currentOffer.amount : activeConv.itemPrice;
                      setPayAmount(amount);
                      setIsPayModalOpen(true);
                    }}
                    style={{
                      padding: '0.55rem 1rem',
                      backgroundColor: '#16A34A',
                      border: 'none',
                      borderRadius: '0.5rem',
                      color: '#FFFFFF',
                      fontWeight: 800,
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      boxShadow: '0 4px 12px rgba(22, 163, 74, 0.3)',
                    }}
                  >
                    <span>
                      Pay ₹{activeConv.currentOffer?.status === 'accepted' ? activeConv.currentOffer.amount : activeConv.itemPrice} (UPI)
                    </span>
                  </button>
                </div>
              </div>

              {/* Bargaining Action Bar */}
              <div
                style={{
                  padding: '0.5rem 1.5rem',
                  backgroundColor: '#F8FAF7',
                  borderBottom: '1px solid #E2E8F0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Tag size={15} color="#15803D" />
                  <span style={{ fontSize: '0.78rem', color: '#475569', fontWeight: 600 }}>Bargain with Seller:</span>
                </div>

                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setOfferInput(Math.round(activeConv.itemPrice * 0.9));
                      setShowOfferDrawer(true);
                    }}
                    style={chipStyle}
                  >
                    Offer ₹{Math.round(activeConv.itemPrice * 0.9)} (-10%)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setOfferInput(Math.round(activeConv.itemPrice * 0.8));
                      setShowOfferDrawer(true);
                    }}
                    style={chipStyle}
                  >
                    Offer ₹{Math.round(activeConv.itemPrice * 0.8)} (-20%)
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowOfferDrawer(!showOfferDrawer)}
                    style={{ ...chipStyle, backgroundColor: '#15803D', color: '#FFFFFF', borderColor: '#15803D' }}
                  >
                    Make Custom Offer
                  </button>
                </div>
              </div>

              {/* Offer Drawer */}
              {showOfferDrawer && (
                <div
                  style={{
                    backgroundColor: '#EFF5EC',
                    padding: '0.85rem 1.5rem',
                    borderBottom: '1px solid #DCFCE7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A' }}>Your Offer: ₹</span>
                    <input
                      type="number"
                      value={offerInput}
                      onChange={(e) => setOfferInput(Number(e.target.value))}
                      style={{
                        width: '110px',
                        padding: '0.4rem 0.6rem',
                        borderRadius: '0.4rem',
                        backgroundColor: '#FFFFFF',
                        border: '1.5px solid #16A34A',
                        color: '#0F172A',
                        fontWeight: 800,
                        fontSize: '0.95rem',
                        outline: 'none',
                      }}
                    />
                    <span style={{ fontSize: '0.75rem', color: '#64748B' }}>(Listed at ₹{activeConv.itemPrice})</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={handleSendOffer}
                      style={{
                        padding: '0.45rem 1rem',
                        backgroundColor: '#16A34A',
                        border: 'none',
                        borderRadius: '0.4rem',
                        color: '#FFFFFF',
                        fontWeight: 700,
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                      }}
                    >
                      Send Offer
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowOfferDrawer(false)}
                      style={{
                        padding: '0.45rem 0.75rem',
                        backgroundColor: 'transparent',
                        border: '1px solid #CBD5E1',
                        borderRadius: '0.4rem',
                        color: '#64748B',
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Message List */}
              <div
                style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem',
                  backgroundColor: '#FFFFFF',
                }}
              >
                {activeConv.messages.map((msg: ChatMessage) => {
                  const isMe = msg.senderId === 'current_student';
                  const isSys = msg.senderId === 'system';

                  if (isSys) {
                    return (
                      <div
                        key={msg.id}
                        style={{
                          alignSelf: 'center',
                          backgroundColor: '#EFF5EC',
                          border: '1px solid #DCFCE7',
                          borderRadius: '0.75rem',
                          padding: '0.5rem 0.85rem',
                          fontSize: '0.75rem',
                          color: '#15803D',
                          fontWeight: 600,
                          textAlign: 'center',
                          maxWidth: '85%',
                        }}
                      >
                        {msg.text}
                      </div>
                    );
                  }

                  if (msg.isOffer && msg.offerData) {
                    return (
                      <div
                        key={msg.id}
                        style={{
                          alignSelf: isMe ? 'flex-end' : 'flex-start',
                          maxWidth: '75%',
                          backgroundColor: msg.offerData.status === 'accepted' ? '#DCFCE7' : '#FEF08A',
                          border: msg.offerData.status === 'accepted' ? '1px solid #86EFAC' : '1px solid #FDE047',
                          borderRadius: '1rem',
                          padding: '1rem',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                          <Tag size={16} color={msg.offerData.status === 'accepted' ? '#15803D' : '#854D0E'} />
                          <strong style={{ fontSize: '0.9rem', color: msg.offerData.status === 'accepted' ? '#15803D' : '#854D0E' }}>
                            {msg.offerData.status === 'accepted' ? 'Deal Confirmed!' : 'Negotiation Offer'}
                          </strong>
                        </div>
                        <div style={{ fontSize: '1.3rem', fontWeight: 900, color: msg.offerData.status === 'accepted' ? '#15803D' : '#854D0E', marginBottom: '0.3rem' }}>
                          ₹{msg.offerData.offeredAmount}
                        </div>
                        <p style={{ fontSize: '0.78rem', color: '#475569', margin: '0 0 0.75rem' }}>{msg.text}</p>

                        {msg.offerData.status === 'accepted' ? (
                          <button
                            type="button"
                            onClick={() => {
                              setPayAmount(msg.offerData!.offeredAmount);
                              setIsPayModalOpen(true);
                            }}
                            style={{
                              width: '100%',
                              padding: '0.55rem',
                              backgroundColor: '#16A34A',
                              border: 'none',
                              borderRadius: '0.5rem',
                              color: '#FFFFFF',
                              fontWeight: 800,
                              fontSize: '0.85rem',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '0.4rem',
                            }}
                          >
                            <ShieldCheck size={16} />
                            <span>Pay ₹{msg.offerData.offeredAmount} with Instant UPI</span>
                          </button>
                        ) : null}
                      </div>
                    );
                  }

                  return (
                    <div
                      key={msg.id}
                      style={{
                        alignSelf: isMe ? 'flex-end' : 'flex-start',
                        maxWidth: '70%',
                        backgroundColor: isMe ? '#16A34A' : '#F1F5F9',
                        color: isMe ? '#FFFFFF' : '#0F172A',
                        borderRadius: isMe ? '1rem 1rem 0.2rem 1rem' : '1rem 1rem 1rem 0.2rem',
                        padding: '0.7rem 1rem',
                        fontSize: '0.85rem',
                        lineHeight: 1.4,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                      }}
                    >
                      <div>{msg.text}</div>
                      <div style={{ fontSize: '0.65rem', color: isMe ? '#DCFCE7' : '#94A3B8', textAlign: 'right', marginTop: '0.25rem' }}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Chat Input */}
              <form
                onSubmit={handleSendMessage}
                style={{
                  padding: '1rem 1.5rem',
                  borderTop: '1px solid #E2E8F0',
                  backgroundColor: '#FFFFFF',
                  display: 'flex',
                  gap: '0.75rem',
                  alignItems: 'center',
                }}
              >
                <input
                  type="text"
                  placeholder="Type a message or discuss meetup location..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '0.75rem 1rem',
                    borderRadius: '9999px',
                    backgroundColor: '#F8FAF7',
                    border: '1px solid #CBD5E1',
                    color: '#0F172A',
                    fontSize: '0.88rem',
                    outline: 'none',
                  }}
                />
                <button
                  type="submit"
                  disabled={!messageText.trim()}
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    backgroundColor: messageText.trim() ? '#16A34A' : '#CBD5E1',
                    color: '#FFFFFF',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: messageText.trim() ? 'pointer' : 'not-allowed',
                    boxShadow: messageText.trim() ? '0 2px 8px rgba(22, 163, 74, 0.3)' : 'none',
                  }}
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#64748B' }}>
              Select a conversation from the sidebar
            </div>
          )}
        </div>
      </div>

      {/* Embedded UPI Payment Modal */}
      {activeConv && (
        <UpiPaymentModal
          isOpen={isPayModalOpen}
          onClose={() => setIsPayModalOpen(false)}
          itemTitle={activeConv.itemTitle}
          amount={payAmount}
          category="bazaar"
          payerName="Student Buyer"
          onPaymentSuccess={() => {
            ChatService.sendMessage(
              activeConv.id,
              `✅ Paid ₹${payAmount} via EaseHub UPI Escrow! Ready for campus pickup.`,
              'current_student',
              'You'
            );
            loadConversations();
          }}
        />
      )}
    </div>
  );
};

const chipStyle: React.CSSProperties = {
  padding: '0.3rem 0.6rem',
  borderRadius: '0.4rem',
  backgroundColor: '#FEF08A',
  border: '1px solid #FDE047',
  color: '#854D0E',
  fontSize: '0.74rem',
  fontWeight: 700,
  cursor: 'pointer',
};
