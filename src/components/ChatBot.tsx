import { useState, useRef, useEffect, type KeyboardEvent } from 'react';
import { cn } from '@/lib/utils';
import { MessageCircle, Send, Bot, User, MapPin, ChevronDown } from 'lucide-react';

interface Message {
  id: string;
  role: 'bot' | 'user';
  text: string;
  links?: { label: string; href: string }[];
}

// Knowledge base: map keywords to site sections + responses
const navigationKB: Array<{
  keywords: string[];
  response: string;
  links?: { label: string; href: string }[];
}> = [
  {
    keywords: ['hello', 'hi', 'hey', 'start', 'help', 'what can you do', 'how can you help'],
    response: "Hi there! 👋 I'm the PinPoint assistant. I can help you navigate the site or answer questions about our services. Try asking about:\n• Our services\n• How to get started\n• The interactive map\n• Our portfolio\n• Pricing / contact",
  },
  {
    keywords: ['about', 'who are you', 'company', 'team', 'experience', 'years'],
    response: "PinPoint has 5+ years of experience in interactive location mapping, with 10K+ locations pinned and 500+ happy clients across 50+ cities. Learn more in our About section!",
    links: [{ label: 'Go to About', href: '#about' }],
  },
  {
    keywords: ['service', 'feature', 'offer', 'what do you do', 'capabilities'],
    response: "We offer four core services:\n• **Location Pinning** – Mark any location with custom labels\n• **Layer Management** – Organize with custom categories\n• **Collaborative Mapping** – Share & edit maps with your team\n• **Location Analytics** – Get insights on your pins",
    links: [{ label: 'Explore Services', href: '#services' }],
  },
  {
    keywords: ['pin', 'pinning', 'location pin', 'add location', 'mark location'],
    response: "Our Location Pinning feature lets you click anywhere on the interactive map to drop a pin with a custom label and description. Try it out in the Map section!",
    links: [{ label: 'Try the Map', href: '#map-section' }],
  },
  {
    keywords: ['map', 'interactive map', 'mapping', 'leaflet'],
    response: "Our interactive map lets you drop pins anywhere in the world, manage your locations, and visualize your entire location network at a glance. Head to the Map section to try it live!",
    links: [{ label: 'Open the Map', href: '#map-section' }],
  },
  {
    keywords: ['portfolio', 'project', 'work', 'case study', 'example', 'client'],
    response: "We've worked on exciting projects like city delivery networks, restaurant chain mapping, real estate portfolios, event venue locators, and tourism hotspot guides. Check out our full portfolio!",
    links: [{ label: 'View Portfolio', href: '#portfolio' }],
  },
  {
    keywords: ['testimonial', 'review', 'feedback', 'what do clients say', 'rating'],
    response: "Our clients love us! From logistics directors to real estate teams, they all rate us 5 stars. Read their stories in the Testimonials section.",
    links: [{ label: 'Read Testimonials', href: '#portfolio' }],
  },
  {
    keywords: ['price', 'pricing', 'cost', 'plan', 'free', 'trial', 'how much'],
    response: "We offer a free trial so you can experience PinPoint risk-free! Get in touch with us to discuss pricing plans tailored to your needs.",
    links: [{ label: 'Start Free Trial', href: '#cta' }],
  },
  {
    keywords: ['contact', 'get in touch', 'email', 'reach out', 'start', 'demo', 'cta'],
    response: "Ready to get started? You can reach us at hello@pinpoint.io or click the button below to kick off your free trial!",
    links: [{ label: 'Get Started', href: '#cta' }],
  },
  {
    keywords: ['analytics', 'insight', 'data', 'report', 'statistics'],
    response: "PinPoint's Location Analytics gives you actionable insights about your pinned locations – traffic patterns, hotspots, and user interaction data. It's all in the Services section.",
    links: [{ label: 'See Services', href: '#services' }],
  },
  {
    keywords: ['collaborate', 'team', 'share', 'share map', 'real-time'],
    response: "Collaborative Mapping lets your whole team work on the same map in real-time. Share access, add pins together, and sync changes instantly.",
    links: [{ label: 'Learn More', href: '#services' }],
  },
  {
    keywords: ['navigate', 'scroll', 'go to', 'show me', 'take me to', 'sections', 'pages'],
    response: "Here are all the main sections of our site. Click any link to jump straight there!",
    links: [
      { label: 'About', href: '#about' },
      { label: 'Services', href: '#services' },
      { label: 'Portfolio', href: '#portfolio' },
      { label: 'Map', href: '#map-section' },
      { label: 'Get Started', href: '#cta' },
    ],
  },
];

const FALLBACK: Message = {
  id: 'fallback',
  role: 'bot',
  text: "I'm not sure about that one! I can help you navigate the site or tell you about our services. Try asking about our map, services, portfolio, or how to get started.",
  links: [{ label: 'View All Sections', href: '#about' }],
};

const WELCOME: Message = {
  id: 'welcome',
  role: 'bot',
  text: "Hi! 👋 I'm the PinPoint assistant. Ask me anything about our services, or I can navigate you to any section of the site!",
};

function getBotResponse(input: string): Message {
  const lower = input.toLowerCase();
  for (const entry of navigationKB) {
    if (entry.keywords.some((kw) => lower.includes(kw))) {
      return {
        id: Date.now().toString(),
        role: 'bot',
        text: entry.response,
        links: entry.links,
      };
    }
  }
  return { ...FALLBACK, id: Date.now().toString() };
}

function scrollToSection(href: string) {
  const el = document.querySelector(href);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

// Render text with **bold** markdown
function RenderText({ text }: { text: string }) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return (
    <span>
      {parts.map((p, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="font-semibold">
            {p}
          </strong>
        ) : (
          <span key={i} className="whitespace-pre-line">
            {p}
          </span>
        )
      )}
    </span>
  );
}

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate a short think delay for realism
    setTimeout(() => {
      const botMsg = getBotResponse(trimmed);
      setIsTyping(false);
      setMessages((prev) => [...prev, botMsg]);
    }, 650);
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') sendMessage();
  };

  const quickPrompts = ['Our services', 'Try the map', 'View portfolio', 'Get started'];

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          'fixed bottom-6 right-6 z-50 flex items-center justify-center rounded-full shadow-2xl transition-all duration-500',
          'bg-gradient-to-br from-violet-600 to-indigo-700 text-white w-14 h-14',
          'hover:scale-110 hover:shadow-violet-400/40',
          isOpen && 'scale-0 opacity-0 pointer-events-none'
        )}
        aria-label="Open chat assistant"
      >
        <MessageCircle className="w-6 h-6" />
        {hasUnread && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full border-2 border-white animate-pulse" />
        )}
      </button>

      {/* Chat window */}
      <div
        className={cn(
          'fixed bottom-6 right-6 z-50 flex flex-col rounded-2xl shadow-2xl overflow-hidden',
          'w-[360px] max-h-[580px] transition-all duration-500 ease-out',
          'bg-white border border-gray-100',
          isOpen
            ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
            : 'opacity-0 translate-y-8 scale-95 pointer-events-none'
        )}
        style={{ boxShadow: '0 24px 64px rgba(109, 40, 217, 0.18)' }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3.5 bg-gradient-to-r from-violet-600 to-indigo-700 text-white shrink-0">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-full bg-white/20">
            <MapPin className="w-5 h-5" />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm leading-tight">PinPoint Assistant</p>
            <p className="text-white/70 text-xs">Online · Replies instantly</p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
            aria-label="Close chat"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50/50 min-h-0">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                'flex gap-2 items-end',
                msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              )}
            >
              {/* Avatar */}
              <div
                className={cn(
                  'flex items-center justify-center w-7 h-7 rounded-full shrink-0 mb-0.5',
                  msg.role === 'bot'
                    ? 'bg-gradient-to-br from-violet-600 to-indigo-700 text-white'
                    : 'bg-gray-200 text-gray-600'
                )}
              >
                {msg.role === 'bot' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              <div className={cn('max-w-[78%] space-y-1.5', msg.role === 'user' && 'items-end flex flex-col')}>
                <div
                  className={cn(
                    'px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed',
                    msg.role === 'bot'
                      ? 'bg-white text-gray-800 rounded-bl-sm shadow-sm border border-gray-100'
                      : 'bg-gradient-to-br from-violet-600 to-indigo-700 text-white rounded-br-sm'
                  )}
                >
                  <RenderText text={msg.text} />
                </div>

                {/* Navigation links */}
                {msg.links && msg.links.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {msg.links.map((link) => (
                      <button
                        key={link.href + link.label}
                        onClick={() => {
                          scrollToSection(link.href);
                          setIsOpen(false);
                        }}
                        className="text-xs px-3 py-1.5 rounded-full bg-violet-50 text-violet-700 border border-violet-200 hover:bg-violet-100 transition-colors font-medium"
                      >
                        {link.label} →
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex gap-2 items-end">
              <div className="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-violet-600 to-indigo-700 text-white shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-gray-100 shadow-sm px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1.5">
                <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick prompts */}
        {messages.length <= 1 && (
          <div className="px-4 pb-2 pt-1 flex flex-wrap gap-1.5 bg-gray-50/50 shrink-0">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => {
                  setInput(prompt);
                  setTimeout(() => {
                    const msg: Message = { id: Date.now().toString(), role: 'user', text: prompt };
                    setMessages((prev) => [...prev, msg]);
                    setInput('');
                    setIsTyping(true);
                    setTimeout(() => {
                      setIsTyping(false);
                      setMessages((prev) => [...prev, getBotResponse(prompt)]);
                    }, 650);
                  }, 0);
                }}
                className="text-xs px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 hover:border-violet-300 hover:text-violet-700 hover:bg-violet-50 transition-all"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="px-3 py-3 bg-white border-t border-gray-100 flex items-center gap-2 shrink-0">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask me anything..."
            className="flex-1 text-sm px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-400/50 focus:border-violet-400 transition-all bg-gray-50 placeholder:text-gray-400"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className={cn(
              'w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 shrink-0',
              input.trim()
                ? 'bg-gradient-to-br from-violet-600 to-indigo-700 text-white shadow-md hover:shadow-violet-400/40 hover:scale-105'
                : 'bg-gray-100 text-gray-300 cursor-not-allowed'
            )}
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );
}
