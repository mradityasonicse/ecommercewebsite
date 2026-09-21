import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  Tag,
  ShieldCheck,
} from 'lucide-react';
import { ChatService } from '../../services/chatService';
import type { Conversation } from '../../types/bazaar';
import { UpiPaymentModal } from '../payment/UpiPaymentModal';

export interface BazaarChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemId?: string;
  itemTitle?: string;
  itemPrice?: number;
  itemImage?: string;
  sellerId?: string;
  sellerName?: string;
  sellerPhone?: string;
  existingConversationId?: string;
}

export const BazaarChatModal: React.FC<BazaarChatModalProps> = ({
  isOpen,
  onClose,
  itemId = 'bz_item_1',
  itemTitle = 'Symphony Touch 35L Cooler',
  itemPrice = 2199,
  itemImage = 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=600&q=80',
  sellerId = 'user_rahul_99',
  sellerName = 'Rahul Verma',
  sellerPhone = '+91 98270 11223',
  existingConversationId,
}) => {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messageText, setMessageText] = useState('');
  const [showOfferDrawer, setShowOfferDrawer] = useState(false);
  const [offerInput, setOfferInput] = useState<number>(() => Math.round(itemPrice * 0.85));
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [payableAmount, setPayableAmount] = useState<number>(itemPrice);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize or load conversation
  useEffect(() => {
    if (!isOpen) return;

    let conv: Conversation | null = null;
    if (existingConversationId) {
      conv = ChatService.getConversationById(existingConversationId);
    }

    if (!conv && itemId) {
      conv = ChatService.getOrCreateConversation(
        itemId,
        itemTitle,
        itemPrice,
        itemImage,
        sellerId,
        sellerName,
        sellerPhone
      );
    }

    setConversation(conv);
    setOfferInput(Math.round((conv ? conv.itemPrice : itemPrice) * 0.85));
  }, [isOpen, existingConversationId, itemId, itemTitle, itemPrice, itemImage, sellerId, sellerName, sellerPhone]);

  // Listen for real-time messages / simulated seller responses
  useEffect(() => {
    const handleChatUpdate = (e: any) => {
      if (conversation && e.detail?.conversationId === conversation.id) {
        const updated = ChatService.getConversationById(conversation.id);
        if (updated) setConversation({ ...updated });
      }
    };

    window.addEventListener('easehub_chat_updated', handleChatUpdate);
    return () => window.removeEventListener('easehub_chat_updated', handleChatUpdate);
  }, [conversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation?.messages]);

  if (!isOpen || !conversation) return null;

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!messageText.trim()) return;

    ChatService.sendMessage(conversation.id, messageText.trim());
    setMessageText('');
    const updated = ChatService.getConversationById(conversation.id);
    if (updated) setConversation({ ...updated });
  };

  const handleSendOffer = () => {
    if (!offerInput || offerInput <= 0) return;

    ChatService.sendMessage(
      conversation.id,
      `🤝 Made an offer of ₹${offerInput} for "${conversation.itemTitle}"`,
      'current_student',
      'You',
      true,
      {
        offeredAmount: offerInput,
        status: 'pending',
      }
    );

    setShowOfferDrawer(false);
    const updated = ChatService.getConversationById(conversation.id);
    if (updated) setConversation({ ...updated });
  };

  const handleSelectLocation = (loc: string) => {
    ChatService.sendMessage(
      conversation.id,
      `📍 Let's meet at: ${loc}`,
      'current_student',
      'You',
      false,
      undefined,
      loc
    );
    const updated = ChatService.getConversationById(conversation.id);
    if (updated) setConversation({ ...updated });
  };

  const handleOpenPay = (amountToPay: number) => {
    setPayableAmount(amountToPay);
    setIsPayModalOpen(true);
  };

  const currentOfferAmount = conversation.currentOffer?.amount;
  const isOfferAccepted = conversation.currentOffer?.status === 'accepted';

  return (
    <>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99990,
          backgroundColor: 'rgba(15, 23, 42, 0.45)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          animation: 'fadeIn 0.2s ease-out',
        }}
        onClick={onClose}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '560px',
            height: '620px',
            maxHeight: '90vh',
            backgroundColor: '#FFFFFF',
            border: '1.5px solid rgba(22, 163, 74, 0.25)',
            borderRadius: '1.25rem',
            boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            style={{
              padding: '0.85rem 1.25rem',
              borderBottom: '1px solid rgba(22, 163, 74, 0.15)',
              backgroundColor: '#F8FAF7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <img
                src={conversation.itemImage}
                alt={conversation.itemTitle}
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '0.5rem',
                  objectFit: 'cover',
                  border: '1.5px solid rgba(22, 163, 74, 0.25)',
                }}
              />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0F172A' }}>
                    {conversation.sellerName}
                  </span>
                  <span
                    style={{
                      fontSize: '0.65rem',
                      padding: '0.1rem 0.4rem',
                      borderRadius: '9999px',
                      backgroundColor: '#DCFCE7',
                      color: '#15803D',
                      fontWeight: 700,
                      border: '1px solid #86EFAC',
                    }}
                  >
                    Verified Student
                  </span>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                  {conversation.itemTitle} • <strong style={{ color: '#16A34A', fontWeight: 800 }}>₹{conversation.itemPrice}</strong>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => handleOpenPay(isOfferAccepted && currentOfferAmount ? currentOfferAmount : conversation.itemPrice)}
                style={{
                  padding: '0.45rem 0.85rem',
                  borderRadius: '0.5rem',
                  backgroundColor: '#16A34A',
                  border: 'none',
                  color: '#FFFFFF',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  boxShadow: '0 2px 8px rgba(22, 163, 74, 0.3)',
                }}
              >
                <span>Pay ₹{isOfferAccepted && currentOfferAmount ? currentOfferAmount : conversation.itemPrice}</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close chat"
                style={{
                  background: 'rgba(15, 23, 42, 0.05)',
                  border: '1px solid rgba(22, 163, 74, 0.15)',
                  color: '#475569',
                  cursor: 'pointer',
                  padding: '0.35rem',
                  borderRadius: '0.4rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Quick Negotiation Bar */}
          <div
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#F0FDF4',
              borderBottom: '1px solid rgba(22, 163, 74, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Tag size={14} color="#15803D" />
              <span style={{ fontSize: '0.75rem', color: '#15803D', fontWeight: 700 }}>Quick Bargain:</span>
            </div>

            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button
                type="button"
                onClick={() => {
                  setOfferInput(Math.round(conversation.itemPrice * 0.9));
                  setShowOfferDrawer(true);
                }}
                style={chipStyle}
              >
                Offer ₹{Math.round(conversation.itemPrice * 0.9)} (-10%)
              </button>
              <button
                type="button"
                onClick={() => {
                  setOfferInput(Math.round(conversation.itemPrice * 0.8));
                  setShowOfferDrawer(true);
                }}
                style={chipStyle}
              >
                Offer ₹{Math.round(conversation.itemPrice * 0.8)} (-20%)
              </button>
              <button
                type="button"
                onClick={() => setShowOfferDrawer(!showOfferDrawer)}
                style={{
                  ...chipStyle,
                  backgroundColor: '#16A34A',
                  color: '#FFFFFF',
                  borderColor: '#15803D',
                  fontWeight: 700,
                }}
              >
                Custom Offer
              </button>
            </div>
          </div>

          {/* Offer Drawer Overlay */}
          {showOfferDrawer && (
            <div
              style={{
                backgroundColor: '#F8FAF7',
                padding: '0.85rem 1.25rem',
                borderBottom: '1px solid rgba(22, 163, 74, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                animation: 'slideDown 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A' }}>Offer Amount: ₹</span>
                <input
                  type="number"
                  value={offerInput}
                  onChange={(e) => setOfferInput(Number(e.target.value))}
                  style={{
                    width: '100px',
                    padding: '0.4rem 0.6rem',
                    borderRadius: '0.4rem',
                    backgroundColor: '#FFFFFF',
                    border: '1.5px solid #16A34A',
                    color: '#15803D',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    outline: 'none',
                  }}
                />
                <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                  (Original: ₹{conversation.itemPrice})
                </span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={handleSendOffer}
                  style={{
                    padding: '0.45rem 0.9rem',
                    backgroundColor: '#16A34A',
                    border: 'none',
                    borderRadius: '0.4rem',
                    color: '#FFFFFF',
                    fontWeight: 800,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                  }}
                >
                  Submit Offer
                </button>
                <button
                  type="button"
                  onClick={() => setShowOfferDrawer(false)}
                  style={{
                    padding: '0.45rem 0.6rem',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #CBD5E1',
                    borderRadius: '0.4rem',
                    color: '#475569',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Messages Area */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '1rem 1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem',
              backgroundColor: '#F8FAF7',
            }}
          >
            {conversation.messages.map((msg) => {
              const isMe = msg.senderId === 'current_student';
              const isSys = msg.senderId === 'system';

              if (isSys) {
                return (
                  <div
                    key={msg.id}
                    style={{
                      alignSelf: 'center',
                      backgroundColor: '#FEF08A',
                      border: '1px solid #FACC15',
                      borderRadius: '0.75rem',
                      padding: '0.4rem 0.85rem',
                      fontSize: '0.75rem',
                      color: '#854D0E',
                      fontWeight: 600,
                      maxWidth: '85%',
                      textAlign: 'center',
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
                      maxWidth: '80%',
                      backgroundColor: msg.offerData.status === 'accepted' ? '#DCFCE7' : '#FEFCE8',
                      border: msg.offerData.status === 'accepted' ? '1.5px solid #16A34A' : '1.5px solid #FACC15',
                      borderRadius: '1rem',
                      padding: '0.9rem',
                      color: '#0F172A',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                      <Tag size={16} color={msg.offerData.status === 'accepted' ? '#15803D' : '#CA8A04'} />
                      <strong style={{ fontSize: '0.88rem', color: '#0F172A' }}>
                        {msg.offerData.status === 'accepted' ? 'Deal Accepted!' : 'Price Offer'}
                      </strong>
                    </div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#15803D', marginBottom: '0.3rem' }}>
                      ₹{msg.offerData.offeredAmount}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#475569', marginBottom: '0.6rem' }}>
                      {msg.text}
                    </div>

                    {msg.offerData.status === 'accepted' ? (
                      <button
                        type="button"
                        onClick={() => handleOpenPay(msg.offerData!.offeredAmount)}
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          backgroundColor: '#16A34A',
                          border: 'none',
                          borderRadius: '0.5rem',
                          color: '#FFFFFF',
                          fontWeight: 800,
                          fontSize: '0.82rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.4rem',
                          boxShadow: '0 2px 8px rgba(22, 163, 74, 0.3)',
                        }}
                      >
                        <ShieldCheck size={16} />
                        <span>Pay ₹{msg.offerData.offeredAmount} via Fast UPI</span>
                      </button>
                    ) : isMe ? (
                      <span style={{ fontSize: '0.72rem', color: '#854D0E', fontWeight: 600 }}>Waiting for seller to confirm...</span>
                    ) : (
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button
                          type="button"
                          onClick={() => ChatService.respondToOffer(conversation.id, 'accepted')}
                          style={{
                            padding: '0.4rem 0.75rem',
                            backgroundColor: '#16A34A',
                            border: 'none',
                            borderRadius: '0.4rem',
                            color: '#FFFFFF',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          Accept
                        </button>
                        <button
                          type="button"
                          onClick={() => ChatService.respondToOffer(conversation.id, 'declined')}
                          style={{
                            padding: '0.4rem 0.75rem',
                            backgroundColor: '#EF4444',
                            border: 'none',
                            borderRadius: '0.4rem',
                            color: '#FFFFFF',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          Decline
                        </button>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <div
                  key={msg.id}
                  style={{
                    alignSelf: isMe ? 'flex-end' : 'flex-start',
                    maxWidth: '75%',
                    backgroundColor: isMe ? '#16A34A' : '#FFFFFF',
                    color: isMe ? '#FFFFFF' : '#0F172A',
                    border: isMe ? 'none' : '1px solid #E2E8F0',
                    borderRadius: isMe ? '1rem 1rem 0.2rem 1rem' : '1rem 1rem 1rem 0.2rem',
                    padding: '0.65rem 0.95rem',
                    fontSize: '0.84rem',
                    lineHeight: '1.4',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                  }}
                >
                  <div>{msg.text}</div>
                  <div
                    style={{
                      fontSize: '0.65rem',
                      color: isMe ? '#DCFCE7' : '#64748B',
                      textAlign: 'right',
                      marginTop: '0.25rem',
                    }}
                  >
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Meetup Location Chips */}
          <div
            style={{
              padding: '0.4rem 1rem',
              backgroundColor: '#FFFFFF',
              borderTop: '1px solid rgba(22, 163, 74, 0.15)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              overflowX: 'auto',
            }}
          >
            <span style={{ fontSize: '0.68rem', color: '#64748B', whiteSpace: 'nowrap', fontWeight: 600 }}>Campus Spot:</span>
            {['Central Canteen', 'Hostel B Gate', 'Main Library Lawn', 'Gate No. 2'].map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => handleSelectLocation(loc)}
                style={{
                  whiteSpace: 'nowrap',
                  fontSize: '0.7rem',
                  padding: '0.25rem 0.55rem',
                  borderRadius: '9999px',
                  backgroundColor: '#F0FDF4',
                  border: '1px solid #86EFAC',
                  color: '#15803D',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                📍 {loc}
              </button>
            ))}
          </div>

          {/* Message Input Bar */}
          <form
            onSubmit={handleSendMessage}
            style={{
              padding: '0.75rem 1.25rem',
              borderTop: '1px solid rgba(22, 163, 74, 0.15)',
              backgroundColor: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
            }}
          >
            <input
              type="text"
              placeholder="Ask about condition, availability, or negotiate..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              style={{
                flex: 1,
                padding: '0.65rem 0.95rem',
                borderRadius: '9999px',
                backgroundColor: '#F8FAF7',
                border: '1.5px solid #CBD5E1',
                color: '#0F172A',
                fontSize: '0.85rem',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              disabled={!messageText.trim()}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: messageText.trim() ? '#16A34A' : '#E2E8F0',
                color: messageText.trim() ? '#FFFFFF' : '#94A3B8',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: messageText.trim() ? 'pointer' : 'not-allowed',
                transition: 'background-color 0.15s ease',
              }}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>

      {/* Embedded UPI Payment Modal */}
      <UpiPaymentModal
        isOpen={isPayModalOpen}
        onClose={() => setIsPayModalOpen(false)}
        itemTitle={conversation.itemTitle}
        amount={payableAmount}
        category="bazaar"
        payerName="Student Buyer"
        payerPhone=""
        onPaymentSuccess={() => {
          ChatService.sendMessage(
            conversation.id,
            `✅ Paid ₹${payableAmount} via EaseHub UPI Escrow! Ready for campus pickup.`,
            'current_student',
            'You'
          );
        }}
      />
    </>
  );
};

const chipStyle: React.CSSProperties = {
  padding: '0.25rem 0.55rem',
  borderRadius: '0.4rem',
  backgroundColor: '#FFFFFF',
  border: '1px solid #86EFAC',
  color: '#15803D',
  fontSize: '0.72rem',
  fontWeight: 600,
  cursor: 'pointer',
};
