import type { Conversation, ChatMessage } from '../types/bazaar';

const CONVERSATIONS_KEY = 'easehub_chat_conversations';

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv_cooler_101',
    itemId: 'bz_item_1',
    itemTitle: 'Symphony Touch 35L Personal Air Cooler',
    itemPrice: 2199,
    itemImage: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=600&q=80',
    buyerId: 'current_student',
    buyerName: 'You (Student)',
    sellerId: 'user_rahul_99',
    sellerName: 'Rahul Verma (4th Sem CSE)',
    sellerPhone: '+91 98270 11223',
    lastMessage: 'Bhai cooling ekdum first class hai, cooler bilkul clean hai.',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    unreadCount: 1,
    messages: [
      {
        id: 'msg_1',
        conversationId: 'conv_cooler_101',
        senderId: 'current_student',
        senderName: 'You',
        text: 'Hi Rahul, cooler abhi available hai kya? Condition kaisi hai?',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      },
      {
        id: 'msg_2',
        conversationId: 'conv_cooler_101',
        senderId: 'user_rahul_99',
        senderName: 'Rahul Verma',
        text: 'Haan bhai available hai! Honeycomb pads bilkul fresh hain aur motor ekdum silent chal rahi hai.',
        timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
      },
      {
        id: 'msg_3',
        conversationId: 'conv_cooler_101',
        senderId: 'user_rahul_99',
        senderName: 'Rahul Verma',
        text: 'Bhai cooling ekdum first class hai, cooler bilkul clean hai.',
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      },
    ],
    currentOffer: undefined,
  },
  {
    id: 'conv_drafter_102',
    itemId: 'bz_item_2',
    itemTitle: 'Engineering Graphics Drafter + Omega Mini Board',
    itemPrice: 450,
    itemImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    buyerId: 'current_student',
    buyerName: 'You (Student)',
    sellerId: 'user_sneha_21',
    sellerName: 'Sneha Roy (6th Sem Mech)',
    sellerPhone: '+91 94250 44556',
    lastMessage: 'Offer accepted! Sham ko Central Library ke pass collect kar sakte ho.',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    unreadCount: 0,
    messages: [
      {
        id: 'msg_d1',
        conversationId: 'conv_drafter_102',
        senderId: 'current_student',
        senderName: 'You',
        text: 'Offer sent: ₹400 for Drafter set.',
        timestamp: new Date(Date.now() - 1000 * 60 * 150).toISOString(),
        isOffer: true,
        offerData: {
          offeredAmount: 400,
          status: 'accepted',
          offerId: 'off_demo_drafter',
        },
      },
      {
        id: 'msg_d2',
        conversationId: 'conv_drafter_102',
        senderId: 'user_sneha_21',
        senderName: 'Sneha Roy',
        text: 'Offer accepted! Sham ko Central Library ke pass collect kar sakte ho.',
        timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
        exchangeLocation: 'Central Library Main Lawn',
      },
    ],
    currentOffer: {
      amount: 400,
      status: 'accepted',
    },
  },
];

export class ChatService {
  public static getConversations(): Conversation[] {
    if (typeof window === 'undefined') return INITIAL_CONVERSATIONS;
    try {
      const saved = localStorage.getItem(CONVERSATIONS_KEY);
      if (saved) return JSON.parse(saved);
      localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(INITIAL_CONVERSATIONS));
    } catch {
      // Fallback
    }
    return INITIAL_CONVERSATIONS;
  }

  public static getConversationById(id: string): Conversation | null {
    const all = this.getConversations();
    return all.find(c => c.id === id) || null;
  }

  public static getOrCreateConversation(
    itemId: string,
    itemTitle: string,
    itemPrice: number,
    itemImage: string,
    sellerId: string,
    sellerName: string,
    sellerPhone: string,
    buyerId = 'current_student',
    buyerName = 'You (Student)'
  ): Conversation {
    const all = this.getConversations();
    const existing = all.find(c => c.itemId === itemId && c.sellerId === sellerId);
    if (existing) return existing;

    const newConv: Conversation = {
      id: `conv_${itemId}_${Date.now()}`,
      itemId,
      itemTitle,
      itemPrice,
      itemImage,
      buyerId,
      buyerName,
      sellerId,
      sellerName,
      sellerPhone,
      lastMessage: 'Chat initiated',
      lastMessageTime: new Date().toISOString(),
      unreadCount: 0,
      messages: [
        {
          id: `msg_init_${Date.now()}`,
          conversationId: `conv_${itemId}_${Date.now()}`,
          senderId: 'system',
          senderName: 'EaseHub Shield',
          text: `👋 Safe Campus Exchange initiated for "${itemTitle}". Discuss condition, negotiate price, or arrange a safe meetup point.`,
          timestamp: new Date().toISOString(),
        },
      ],
    };

    const updated = [newConv, ...all];
    try {
      localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(updated));
    } catch {
      // Storage unavailable
    }
    return newConv;
  }

  public static sendMessage(
    conversationId: string,
    text: string,
    senderId = 'current_student',
    senderName = 'You',
    isOffer = false,
    offerData?: { offeredAmount: number; status: 'pending' | 'accepted' | 'declined' },
    exchangeLocation?: string
  ): ChatMessage {
    const all = this.getConversations();
    const idx = all.findIndex(c => c.id === conversationId);
    if (idx === -1) throw new Error('Conversation not found');

    const msg: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      conversationId,
      senderId,
      senderName,
      text,
      timestamp: new Date().toISOString(),
      isOffer,
      offerData,
      exchangeLocation,
    };

    all[idx].messages.push(msg);
    all[idx].lastMessage = text;
    all[idx].lastMessageTime = msg.timestamp;
    if (isOffer && offerData) {
      all[idx].currentOffer = {
        amount: offerData.offeredAmount,
        status: offerData.status,
      };
    }

    try {
      localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(all));
    } catch {
      // Storage unavailable
    }

    // Interactive Demo Simulation: If user sent an offer or message to another student,
    // trigger a smart contextual seller response after 1.5s!
    if (senderId === 'current_student' && !all[idx].sellerId.startsWith('current_student')) {
      setTimeout(() => {
        ChatService.handleSimulatedSellerResponse(conversationId, text, isOffer, offerData?.offeredAmount);
      }, 1500);
    }

    return msg;
  }

  public static respondToOffer(
    conversationId: string,
    status: 'accepted' | 'declined',
    notes?: string
  ): void {
    const all = this.getConversations();
    const idx = all.findIndex(c => c.id === conversationId);
    if (idx === -1) return;

    if (all[idx].currentOffer) {
      all[idx].currentOffer!.status = status;
    }

    const offerAmount = all[idx].currentOffer?.amount || all[idx].itemPrice;

    const responseText = status === 'accepted'
      ? `🎉 Deal Confirmed! Offer of ₹${offerAmount} accepted. ${notes || 'Ready for campus handover.'}`
      : `❌ Offer of ₹${offerAmount} was declined. Let's find a middle ground.`;

    const msg: ChatMessage = {
      id: `msg_${Date.now()}_status`,
      conversationId,
      senderId: all[idx].sellerId,
      senderName: all[idx].sellerName,
      text: responseText,
      timestamp: new Date().toISOString(),
      isOffer: true,
      offerData: {
        offeredAmount: offerAmount,
        status,
      },
    };

    all[idx].messages.push(msg);
    all[idx].lastMessage = responseText;
    all[idx].lastMessageTime = msg.timestamp;

    try {
      localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(all));
    } catch {
      // Storage unavailable
    }
  }

  private static handleSimulatedSellerResponse(
    conversationId: string,
    _lastUserText: string,
    wasOffer: boolean,
    offeredAmount?: number
  ) {
    const all = this.getConversations();
    const idx = all.findIndex(c => c.id === conversationId);
    if (idx === -1) return;

    const conv = all[idx];
    let replyText = '';
    let isOfferResponse = false;

    if (wasOffer && offeredAmount) {
      const discount = (conv.itemPrice - offeredAmount) / conv.itemPrice;
      if (discount <= 0.25) {
        // Reasonable offer (<25% discount) -> Accept!
        replyText = `Deal pakki bhai! ₹${offeredAmount} done. Sham ko 5:30 baje Canteen ya Library ke samne aake le jao. UPI se advance ya cash dono chalega.`;
        conv.currentOffer = { amount: offeredAmount, status: 'accepted' };
        isOfferResponse = true;
      } else {
        // High discount -> Counter offer
        const counter = Math.round((conv.itemPrice + offeredAmount) / 2);
        replyText = `Bhai ₹${offeredAmount} thoda kam ho jayega. Final ₹${counter} me done karte hain, item bilkul genuine hai. Batao chalega?`;
        conv.currentOffer = { amount: counter, status: 'pending' };
      }
    } else {
      const replies = [
        `Haan bhai 100% working hai, khud aake test karke le ja sakte ho!`,
        `Hostel Block B me hu main, jab bolo dikha dunga.`,
        `Bilkul genuine condition hai brother, bills aur box bhi mil jayega agar chahiye.`,
      ];
      replyText = replies[Math.floor(Math.random() * replies.length)];
    }

    const sellerMsg: ChatMessage = {
      id: `msg_seller_${Date.now()}`,
      conversationId,
      senderId: conv.sellerId,
      senderName: conv.sellerName,
      text: replyText,
      timestamp: new Date().toISOString(),
      isOffer: isOfferResponse,
      offerData: isOfferResponse && offeredAmount ? { offeredAmount, status: 'accepted' } : undefined,
    };

    conv.messages.push(sellerMsg);
    conv.lastMessage = replyText;
    conv.lastMessageTime = sellerMsg.timestamp;
    conv.unreadCount = (conv.unreadCount || 0) + 1;

    try {
      localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(all));
      window.dispatchEvent(new CustomEvent('easehub_chat_updated', { detail: { conversationId } }));
    } catch {
      // Storage unavailable
    }
  }
}
