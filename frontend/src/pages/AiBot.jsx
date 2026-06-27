import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Send,
  Bot,
  User,
  Sparkles,
  RefreshCw,
  Wrench,
  Zap,
  Snowflake,
  PaintBucket,
  Hammer,
  MessageCircle,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './AiBot.css';

const SYSTEM_PROMPT = `You are Workly Assistant, a helpful AI chatbot for Workly — a Sri Lanka-based home services marketplace that connects homeowners with verified service professionals including electricians, plumbers, AC technicians, painters, carpenters, cleaners, and general repair workers.

Your job is to:
- Help users find the right service category for their problem
- Give practical home maintenance tips and troubleshooting advice
- Guide users on how to book a service through Workly
- Help them understand pricing expectations for common jobs
- Answer questions about becoming a service provider on Workly
- Be friendly, clear, and concise in your responses

Workly operates in Sri Lanka. Typical pricing is in Sri Lankan Rupees (LKR / Rs.).
Common services on Workly include:
- Electrical: wiring, switchboards, lighting, inverter setup
- Plumbing: pipe leaks, bathroom fittings, water pressure
- AC repair: servicing, gas refill, installation
- Painting: interior/exterior walls
- Carpentry: furniture, doors, windows
- Cleaning: deep clean, post-construction
- Masonry: tiling, brickwork
- General repair: handyman jobs, pest control

When someone describes a home problem, suggest the right service category and encourage them to browse Workly's services or find a provider. Keep responses concise — 3 to 5 sentences unless a detailed answer is clearly needed. Always be warm, helpful, and professional.`;

const suggestedQuestions = [
  { icon: Zap, text: 'My electricity keeps tripping — what should I do?' },
  { icon: Wrench, text: 'There\'s a leaking pipe under my sink. Who do I call?' },
  { icon: Snowflake, text: 'How often should I service my AC unit?' },
  { icon: PaintBucket, text: 'How much does interior painting cost in Sri Lanka?' },
  { icon: Hammer, text: 'I need new kitchen cabinets — can Workly help?' },
  { icon: MessageCircle, text: 'How do I become a service provider on Workly?' },
];

export default function AiBot() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: 'Hi! I\'m your Workly Assistant 👋 I can help you find the right service for any home problem, give you maintenance tips, or answer questions about booking on Workly. What can I help you with today?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;

    setInput('');
    setError('');

    const userMessage = { id: Date.now(), role: 'user', content: userText };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error?.message || 'Something went wrong.');
      }

      const assistantText = data.content
        .filter((block) => block.type === 'text')
        .map((block) => block.text)
        .join('');

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: 'assistant', content: assistantText },
      ]);
    } catch (err) {
      setError('Sorry, I couldn\'t reach the AI right now. Please try again in a moment.');
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleReset = () => {
    setMessages([
      {
        id: Date.now(),
        role: 'assistant',
        content: 'Hi again! I\'ve cleared our conversation. What can I help you with?',
      },
    ]);
    setError('');
    setInput('');
  };

  const showSuggestions = messages.length === 1;

  return (
    <div className="aibot-page">
      <Navbar />

      <div className="aibot-layout">
        {/* Sidebar */}
        <aside className="aibot-sidebar">
          <div className="aibot-sidebar-top">
            <div className="aibot-sidebar-brand">
              <div className="aibot-brand-icon">
                <Bot size={22} aria-hidden="true" />
              </div>
              <div>
                <h2>Workly Assistant</h2>
                <span>AI-powered help</span>
              </div>
            </div>

            <p className="aibot-sidebar-desc">
              Ask me anything about home services, maintenance tips, pricing,
              or how to use Workly.
            </p>

            <button className="aibot-new-chat" onClick={handleReset}>
              <RefreshCw size={15} aria-hidden="true" />
              New conversation
            </button>
          </div>

          <div className="aibot-sidebar-links">
            <p>Quick links</p>
            <Link to="/services">Browse services</Link>
            <Link to="/providers">Find providers</Link>
            <Link to="/contact">Contact support</Link>
          </div>
        </aside>

        {/* Chat area */}
        <main className="aibot-main">
          <div className="aibot-messages">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`aibot-message ${msg.role === 'user' ? 'user' : 'assistant'}`}
              >
                <div className="aibot-message-avatar">
                  {msg.role === 'user'
                    ? <User size={16} aria-hidden="true" />
                    : <Bot size={16} aria-hidden="true" />
                  }
                </div>
                <div className="aibot-message-bubble">
                  {msg.content.split('\n').map((line, i) => (
                    line ? <p key={i}>{line}</p> : <br key={i} />
                  ))}
                </div>
              </div>
            ))}

            {loading && (
              <div className="aibot-message assistant">
                <div className="aibot-message-avatar">
                  <Bot size={16} aria-hidden="true" />
                </div>
                <div className="aibot-message-bubble aibot-typing">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}

            {error && (
              <div className="aibot-error">
                {error}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested questions — only show before first user message */}
          {showSuggestions && (
            <div className="aibot-suggestions">
              <p>
                <Sparkles size={14} aria-hidden="true" />
                Try asking
              </p>
              <div className="aibot-suggestions-grid">
                {suggestedQuestions.map((q) => (
                  <button
                    key={q.text}
                    className="aibot-suggestion-pill"
                    onClick={() => sendMessage(q.text)}
                  >
                    <q.icon size={14} aria-hidden="true" />
                    {q.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="aibot-input-area">
            <div className="aibot-input-wrap">
              <textarea
                ref={inputRef}
                rows={1}
                placeholder="Ask about a home problem, service, or booking..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
              />
              <button
                className="aibot-send"
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                aria-label="Send message"
              >
                <Send size={17} aria-hidden="true" />
              </button>
            </div>
            <p className="aibot-input-hint">
              Press Enter to send · Shift+Enter for new line
            </p>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}