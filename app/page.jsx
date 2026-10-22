"use client";

import { useEffect, useState } from "react";

const categories = [
  { id: "cancelled", number: "01", title: "Say Something That Will Get You Cancelled", description: "The thought you would never post under your own name.", placeholder: "Type your unfiltered thought…", symbol: "✳", color: "#56f4ff" },
  { id: "confession", number: "02", title: "Say a Confession", description: "Something you have been carrying around. No names required.", placeholder: "Let it out here…", symbol: "◌", color: "#c18aff" },
  { id: "emp-exclusive", number: "03", title: "Your Thoughts on EMP Exclusive", description: "Opinions, feedback, support, criticism. Speak your mind.", placeholder: "Speak on EMP Exclusive…", symbol: "⌁", color: "#ff6db6" },
];

export default function Home() {
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!success) return;
    const timer = window.setTimeout(() => {
      setSuccess(false);
      setSelected(null);
      setMessage("");
      setError("");
    }, 5000);
    return () => window.clearTimeout(timer);
  }, [success]);

  async function send(event) {
    event.preventDefault();
    if (!selected || !message.trim() || busy) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: message.trim(), category: selected.id }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Message could not be sent.");
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Could not send right now. Try again later.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="unknown-scene">
      <header className="topline"><div className="brand">EMP EXCLUSIVE <span>/</span> UNKNOWN</div><div className="live-status"><i /> ANONYMOUS TRANSMISSION</div></header>
      <section className="hero">
        <p className="eyebrow">NO NAMES. NO FILTER.</p>
        <h1><span>SAY IT.</span><br />LEAVE IT HERE.</h1>
        <p className="subtitle">{selected ? "One space. One message. Completely anonymous." : "What do you want to say? Choose your space, leave your message, and let it go."}</p>
      </section>

      {!selected ? (
        <section className="message-cards category-picker" aria-label="Choose a message category">
          {categories.map(item => (
            <button className="message-card category-choice" key={item.id} onClick={() => { setSelected(item); setError(""); }} style={{ "--card-glow": item.color }}>
              <div className="card-head"><span className="card-number">{item.number} / CHOOSE YOUR SPACE</span><span className="card-symbol" aria-hidden="true">{item.symbol}</span></div>
              <h2>{item.title}</h2>
              <p className="card-description">{item.description}</p>
              <span className="category-continue">ENTER SECTION <span aria-hidden="true">↗</span></span>
            </button>
          ))}
        </section>
      ) : (
        <section className="message-entry-wrap" style={{ "--card-glow": selected.color }}>
          <button className="back-to-categories" onClick={() => { setSelected(null); setError(""); }}>← ALL SECTIONS</button>
          <article className="message-entry-card">
            <div className="card-head"><span className="card-number">{selected.number} / ANONYMOUS</span><span className="card-symbol" aria-hidden="true">{selected.symbol}</span></div>
            <h2>{selected.title}</h2>
            <p className="card-description">{selected.description}</p>
            <form onSubmit={send}>
              <label className="sr-only" htmlFor="anonymous-message">Your anonymous message</label>
              <textarea id="anonymous-message" value={message} maxLength={1500} onChange={event => setMessage(event.target.value)} placeholder={selected.placeholder} required autoFocus />
              <div className="entry-footer"><span className="anonymous-label">◉ SENT ANONYMOUSLY</span><span className="character-count">{message.length}/1500</span></div>
              {error && <p className="entry-error" role="alert">{error}</p>}
              <button className="transmit-button" type="submit" disabled={busy || !message.trim()}>{busy ? "TRANSMITTING…" : "SEND INTO THE UNKNOWN ↗"}</button>
            </form>
          </article>
        </section>
      )}

      {success && (
        <div className="success-veil" role="status" aria-live="polite">
          <div className="success-mark"><span>✓</span><p>TRANSMISSION RECEIVED</p><small>YOUR WORDS HAVE LEFT YOUR HANDS</small></div>
        </div>
      )}
      <footer className="unknown-footer">A PRIVATE MESSAGE SPACE <span>✦</span> <strong>EMP EXCLUSIVE</strong></footer>
    </main>
  );
}
