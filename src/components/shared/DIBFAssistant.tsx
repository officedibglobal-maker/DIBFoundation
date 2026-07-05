'use client';

import * as React from 'react';
import { Bot, MessageCircle, Send, Sparkles, X } from 'lucide-react';

type Message = {
  role: 'assistant' | 'user';
  content: string;
};

const suggestedQuestions = [
  'What is the Tinewonsa Project?',
  'How can I volunteer?',
  'Tell me about the Impact Store.',
  'How does the Dollar-A-Day campaign work?',
];

export function DIBFAssistant() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [input, setInput] = React.useState('');
  const [isSending, setIsSending] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>([
    {
      role: 'assistant',
      content:
        'Hello! I am the DIBF Assistant. I can help you understand our mission, explore our initiatives, or find ways to get involved. What would you like to know?',
    },
  ]);

  const sendMessage = async (message: string) => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage || isSending) return;

    setInput('');
    setIsSending(true);

    setMessages((current) => [
      ...current,
      {
        role: 'user',
        content: trimmedMessage,
      },
    ]);

    try {
      const response = await fetch('/api/dibf-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: trimmedMessage }),
      });

      const data = (await response.json()) as { reply?: string };

      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          content:
            data.reply ||
            'I can help with DIBF initiatives, volunteering, donations, partnerships, and the Impact Store.',
        },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          content:
            'Sorry, I could not respond right now. Please try again or contact DIBF directly.',
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white shadow-2xl shadow-primary/30 transition hover:-translate-y-1 hover:bg-primary/90"
        aria-label="Open DIBF Assistant"
      >
        <MessageCircle className="h-7 w-7" />
      </button>

      {isOpen ? (
        <div className="fixed bottom-28 right-8 z-50 w-[min(92vw,420px)] overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl">
          <div className="bg-secondary p-5 text-white">
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary">
                  <Bot className="h-6 w-6" />
                </div>

                <div>
                  <h3 className="text-lg font-black">DIBF Assistant</h3>
                  <p className="mt-1 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-blue-100">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    Always active
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
                aria-label="Close DIBF Assistant"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="max-h-[420px] space-y-4 overflow-y-auto bg-slate-50 p-5">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`rounded-3xl p-4 text-sm leading-7 shadow-sm ${
                  message.role === 'assistant'
                    ? 'mr-8 bg-white text-secondary'
                    : 'ml-8 bg-primary text-white'
                }`}
              >
                {message.content}
              </div>
            ))}

            {messages.length === 1 ? (
              <div className="pt-2">
                <p className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-500">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Suggested questions
                </p>

                <div className="flex flex-wrap gap-2">
                  {suggestedQuestions.map((question) => (
                    <button
                      key={question}
                      type="button"
                      onClick={() => sendMessage(question)}
                      className="rounded-full border border-slate-200 bg-white px-4 py-2 text-left text-xs font-semibold text-secondary shadow-sm transition hover:border-primary hover:text-primary"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              sendMessage(input);
            }}
            className="flex gap-3 border-t border-slate-200 bg-white p-4"
          >
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about our mission or impact..."
              className="h-12 min-w-0 flex-1 rounded-2xl bg-slate-50 px-4 text-sm outline-none transition focus:ring-2 focus:ring-primary/20"
            />

            <button
              type="submit"
              disabled={isSending || !input.trim()}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
              aria-label="Send message"
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
        </div>
      ) : null}
    </>
  );
}