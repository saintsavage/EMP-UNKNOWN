"use client";

import { useEffect, useState } from "react";
import "./message-canvas.css";

const categories = [
  { id: "cancelled", number: "01", title: "Anonymous Message", description: "Say what is on your mind without attaching your name.", placeholder: "Type your anonymous message…", symbol: "✳", color: "#8fb6eb" },
  { id: "confession", number: "02", title: "Confession", description: "Something you have been carrying around. No names required.", placeholder: "Let it out here…", symbol: "◌", color: "#dce7f5" },
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
      <header className="topline"><div className="brand">EMP EXCLUSIVE <span>/</span> UNKNOWN</div><div className="live-status"><i /> ANONYMOUS TRANSMISSION</div><div className="collab-stamp" aria-label="EMP Exclusive x Planet Tumi collaboration"><span>COLLABORATION</span><strong>EMP EXCLUSIVE <i>×</i> PLANET TUMI</strong><small>OFFICIAL PROJECT STAMP</small></div></header>
      <section className="hero">
        <p className="eyebrow">A LITTLE SPACE TO LET IT OUT</p>
        <h1><span>{selected ? "LET IT OUT." : "WHAT’S ON"}</span><br />{selected ? "LEAVE IT HERE." : "YOUR MIND?"}</h1>
        <p className="subtitle">{selected ? "One space. One message. Completely anonymous." : "Choose the orb that feels right. Your name stays out of it."}</p>
      </section>

      {!selected ? (
        <section className="message-cards category-picker" aria-label="Choose a message category">
          {categories.map(item => (
            <button className={`message-card category-choice orb-choice ${item.id === "confession" ? "design-butterfly" : "design-stars"}`} key={item.id} onClick={() => { setSelected(item); setError(""); }} style={{ "--card-glow": item.color }}>
              <span className="orb-number">{item.number}</span><span className="orb-symbol" aria-hidden="true">{item.id === "confession" ? "🦋" : "✦"}</span><h2>{item.title}</h2><p className="card-description">{item.description}</p><span className="orb-cta">TAP TO ENTER ↗</span>
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
