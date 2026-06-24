import React, { useMemo, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL, getStoredUser } from '../utils/userSession';

const quickPrompts = [
  'Món bán chạy',
  'Gợi ý theo khẩu vị của tôi',
  'Thanh toán thế nào',
  'Đơn hàng của tôi',
];

const styles = {
  launcher: {
    position: 'fixed',
    right: '24px',
    bottom: '24px',
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    border: 'none',
    backgroundColor: '#8f2e26',
    color: '#fff7ef',
    fontSize: '28px',
    cursor: 'pointer',
    boxShadow: '0 18px 34px rgba(107,18,24,0.28)',
    zIndex: 1100,
  },
  panel: {
    position: 'fixed',
    right: '24px',
    bottom: '100px',
    width: '360px',
    maxHeight: '72vh',
    backgroundColor: '#fffaf6',
    borderRadius: '24px',
    overflow: 'hidden',
    boxShadow: '0 26px 48px rgba(0,0,0,0.18)',
    border: '1px solid rgba(143,46,38,0.10)',
    display: 'grid',
    gridTemplateRows: 'auto 1fr auto',
    zIndex: 1100,
  },
  header: {
    padding: '18px 20px',
    background: 'linear-gradient(135deg, rgba(143,46,38,0.96) 0%, rgba(107,18,24,0.94) 100%)',
    color: '#fff7ef',
  },
  title: {
    margin: 0,
    fontSize: '20px',
  },
  subtitle: {
    margin: '8px 0 0',
    color: 'rgba(255,247,239,0.84)',
    lineHeight: 1.6,
    fontSize: '14px',
  },
  messages: {
    padding: '18px',
    overflowY: 'auto',
    backgroundColor: '#fffaf6',
    display: 'grid',
    gap: '12px',
  },
  bubbleBot: {
    maxWidth: '88%',
    padding: '12px 14px',
    borderRadius: '18px 18px 18px 6px',
    backgroundColor: '#f4e6d8',
    color: '#5a352d',
    lineHeight: 1.7,
    whiteSpace: 'pre-line',
  },
  bubbleUser: {
    maxWidth: '88%',
    padding: '12px 14px',
    borderRadius: '18px 18px 6px 18px',
    backgroundColor: '#8f2e26',
    color: '#fff7ef',
    lineHeight: 1.7,
    justifySelf: 'end',
    whiteSpace: 'pre-line',
  },
  quickWrap: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  quickButton: {
    padding: '9px 12px',
    borderRadius: '999px',
    border: '1px solid rgba(143,46,38,0.14)',
    backgroundColor: '#fff',
    color: '#8f2e26',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '13px',
  },
  footer: {
    padding: '14px',
    borderTop: '1px solid rgba(143,46,38,0.08)',
    backgroundColor: '#fff',
  },
  composer: {
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    gap: '10px',
  },
  input: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '12px 14px',
    borderRadius: '14px',
    border: '1px solid #dcc2b3',
    fontSize: '14px',
  },
  sendButton: {
    padding: '12px 16px',
    borderRadius: '14px',
    border: 'none',
    backgroundColor: '#8f2e26',
    color: '#fff7ef',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
};

const createInitialMessages = () => [
  {
    id: 'welcome',
    role: 'bot',
    text: 'Xin chào, mình có thể hỗ trợ về đồ uống, món bán chạy, gợi ý theo khẩu vị, giao hàng, thanh toán và đơn hàng của bạn.',
  },
];

const CustomerSupportChat = () => {
  const user = getStoredUser();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(createInitialMessages());
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const suggestions = useMemo(() => {
    const latestBotMessage = [...messages].reverse().find((item) => item.role === 'bot');
    return latestBotMessage?.suggestions || quickPrompts;
  }, [messages]);

  const sendMessage = async (rawMessage) => {
    const trimmed = String(rawMessage || '').trim();
    if (!trimmed || loading) {
      return;
    }

    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: trimmed,
    };
    setMessages((current) => [...current, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/chatbot/message`, {
        message: trimmed,
        userId: user?.id,
      });

      setMessages((current) => [
        ...current,
        {
          id: `bot-${Date.now()}`,
          role: 'bot',
          text: response.data.reply,
          suggestions: response.data.suggestions || [],
        },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          id: `bot-error-${Date.now()}`,
          role: 'bot',
          text: error.response?.data?.message || 'Hiện mình chưa trả lời được câu này. Bạn vui lòng thử lại sau.',
          suggestions: quickPrompts,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {open ? (
        <div style={styles.panel}>
          <div style={styles.header}>
            <h3 style={styles.title}>Hỗ trợ tự động</h3>
            <p style={styles.subtitle}>
              Hỏi về đồ uống, món bán chạy, gợi ý theo lịch sử mua hàng, thanh toán, giao hàng hoặc đơn hàng.
            </p>
          </div>

          <div style={styles.messages}>
            {messages.map((message) => (
              <div key={message.id} style={message.role === 'user' ? styles.bubbleUser : styles.bubbleBot}>
                {message.text}
              </div>
            ))}

            <div style={styles.quickWrap}>
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  style={styles.quickButton}
                  onClick={() => sendMessage(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          <div style={styles.footer}>
            <form
              style={styles.composer}
              onSubmit={(event) => {
                event.preventDefault();
                sendMessage(input);
              }}
            >
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Nhập câu hỏi..."
                style={styles.input}
              />
              <button type="submit" style={styles.sendButton} disabled={loading}>
                Gửi
              </button>
            </form>
          </div>
        </div>
      ) : null}

      <button type="button" style={styles.launcher} onClick={() => setOpen((current) => !current)}>
        {open ? '×' : '💬'}
      </button>
    </>
  );
};

export default CustomerSupportChat;
