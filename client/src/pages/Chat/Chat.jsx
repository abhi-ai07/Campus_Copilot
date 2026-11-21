import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import "./Chat.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const suggestions = [
  "How do I use the college ERP?",
  "What are the library rules?",
  "How can I find scholarship information?",
  "How do I check exam notices?",
];

function Chat() {
  const location = useLocation();

  const [input, setInput] = useState(location.state?.question || "");

  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const inputRef = useRef(null);
  const latestUserMessageRef = useRef(null);
  const autoSentLocationRef = useRef(null);

  // Scroll only when a new user message is added
  useEffect(() => {
    if (messages.length === 0) return;

    const latestMessage = messages[messages.length - 1];

    // Do not scroll when the assistant response arrives
    if (latestMessage.role !== "user") return;

    const frameId = requestAnimationFrame(() => {
      const messageElement = latestUserMessageRef.current;

      if (!messageElement) return;

      const messageTop =
        messageElement.getBoundingClientRect().top + window.scrollY;

      window.scrollTo({
        top: Math.max(0, messageTop - 100),
        behavior: "smooth",
      });
    });

    return () => cancelAnimationFrame(frameId);
  }, [messages]);

  // Send question to CampusCopilot backend
  const sendQuestion = useCallback(async (question) => {
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: trimmedQuestion,
    };

    setMessages((previous) => [...previous, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: trimmedQuestion,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to generate a response.");
      }

      setMessages((previous) => [
        ...previous,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: data.reply,
        },
      ]);
    } catch (error) {
      console.error("CampusCopilot Chat Error:", error);

      setMessages((previous) => [
        ...previous,
        {
          id: Date.now() + 1,
          role: "assistant",
          content:
            error.message ||
            "Unable to connect to CampusCopilot. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle questions received from other pages
  useEffect(() => {
    const question = location.state?.question;

    if (!question) return;

    if (location.state?.autoSend) {
      const requestKey = `${location.key}:${question}`;

      if (autoSentLocationRef.current === requestKey) {
        return;
      }

      autoSentLocationRef.current = requestKey;

      setInput("");
      sendQuestion(question);
    } else {
      setInput(question);
      inputRef.current?.focus();
    }
  }, [location.key, sendQuestion]);

  // Handle manual message submission
  function handleSend(event) {
    event?.preventDefault();

    const question = input.trim();

    if (!question || isLoading) return;

    setInput("");
    sendQuestion(question);
  }

  // Handle suggestion selection
  function handleSuggestion(question) {
    setInput(question);
    inputRef.current?.focus();
  }

  return (
    <main className="chat-page">
      <section className="chat-content">
        {messages.length === 0 ? (
          <div className="chat-welcome">
            <div className="welcome-icon">✦</div>

            <h2>How can I help you today?</h2>

            <p>
              Ask about college ERP processes, notices, scholarships, library
              rules and academic information.
            </p>

            <div className="chat-suggestions">
              {suggestions.map((suggestion) => (
                <button
                  className="suggestion-card"
                  key={suggestion}
                  type="button"
                  onClick={() => handleSuggestion(suggestion)}
                >
                  <span>{suggestion}</span>
                  <span className="suggestion-arrow">↗</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="chat-messages">
            {messages.map((message, index) => (
              <div
                className={`message-row ${message.role}`}
                key={message.id}
                ref={
                  message.role === "user" && index === messages.length - 1
                    ? latestUserMessageRef
                    : null
                }
              >
                {message.role === "assistant" && (
                  <div className="message-avatar">C</div>
                )}

                <div className="message-content">
                  <span className="message-author">
                    {message.role === "user" ? "You" : "CampusCopilot"}
                  </span>

                  <div className="message-bubble">
                    {message.role === "assistant" ? (
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {message.content}
                      </ReactMarkdown>
                    ) : (
                      message.content
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="message-row assistant">
                <div className="message-avatar">C</div>

                <div className="message-content">
                  <span className="message-author">CampusCopilot</span>

                  <div className="typing-indicator" aria-label="Thinking">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      <footer className="chat-composer-area">
        <form className="chat-composer" onSubmit={handleSend}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask anything about your college..."
            aria-label="Type your message"
            rows={1}
          />

          <button
            className="send-button"
            type="submit"
            disabled={!input.trim() || isLoading}
            aria-label="Send message"
          >
            ↑
          </button>
        </form>

        <p className="chat-disclaimer">
          CampusCopilot demo · Verify important information with official
          college notices.
        </p>
      </footer>
    </main>
  );
}

export default Chat;
