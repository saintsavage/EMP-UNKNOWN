"use client";

import { useState } from "react";

const categories = [
  { id: "cancelled", number: "01 / UNFILTERED", title: <>Say Something That<br />Will Get You Cancelled</>, description: "The thought you would never post under your own name. Keep it sharp, not dangerous.", placeholder: "Type your unfiltered thought…", symbol: "✳", color: "#56f4ff" },
  { id: "confession", number: "02 / CONFESSIONAL", title: <>Say a Confession</>, description: "Something you have been carrying around. No names required. Get it off your chest.", placeholder: "Let it out here…", symbol: "◌", color: "#c18aff" },
  { id: "emp-exclusive", number: "03 / THE MOVEMENT", title: <>Your Thoughts on<br />EMP Exclusive</>, description: "Opinions, feedback, support, criticism. Let the family know what is on your mind.", placeholder: "Speak on EMP Exclusive…", symbol: "⌁", color: "#ff6db6" },
];

function MessageCard({ item }) {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  async function send(event) {
    event.preventDefault();
    if (!message.trim() || busy) return;
    setBusy(true);
    setStatus("");
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message, category: item.id }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Message could not be sent.");
      setMessage("");
      setStatus("Sent anonymously. Your words are in the inbox.");
    } catch (error) {
      setStatus(error.message || "Could not send right now. Try again later.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <article className="message-card" style={{ "--card-glow": item.color }}>
      <div className="card-head"><span className="card-number">{item.number}</span><span className="card-symbol" aria-hidden="true">{item.symbol}</span></div>
      <h2>{item.title}</h2>
      <p className="card-description">{item.description}</p>
      <form onSubmit={send}>
        <label className="sr-only" htmlFor={"message-" + item.id}>{item.placeholder}</label>
        <textarea id={"message-" + item.id} value={message} maxLength={1500} onChange={event => setMessage(event.target.value)} placeholder={item.placeholder} required />
        <div className="card-foot"><span className="anonymous-label">◉ SENT ANONYMOUSLY</span><button type="submit" disabled={busy || !message.trim()}>{busy ? "SENDING…" : "SEND ↗"}</button></div>
        <div className="card-status" role="status">{status}</div>
      </form>
    </article>
  );
}

export default function Home() {
  return (
    <main className="unknown-scene">
      <div className="wall-stamp">PROPERTY OF EMP EXCLUSIVE</div>
      <header className="topline"><div className="brand">EMP EXCLUSIVE <span>/</span> UNKNOWN</div><div className="live-status"><i /> ANONYMOUS TRANSMISSION</div></header>
      <section className="hero">
        <p className="eyebrow">NO NAMES. NO FILTER.</p>
        <h1><span>SAY IT.</span><br />LEAVE IT HERE.</h1>
        <p className="subtitle">An anonymous corner of the EMP universe. Drop the truth, confess something, or speak on EMP Exclusive. Your identity stays out of the message.</p>
      </section>
      <section className="message-cards" aria-label="Anonymous message categories">
        {categories.map(item => <MessageCard key={item.id} item={item} />)}
      </section>
      <footer className="unknown-footer">A PRIVATE MESSAGE SPACE <span>✦</span> <strong>EMP EXCLUSIVE</strong></footer>
    </main>
  );
}
