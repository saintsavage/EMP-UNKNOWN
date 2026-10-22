"use client";
import { useEffect, useMemo, useState } from "react";

const CATEGORY_LABELS = {
  cancelled: "GET CANCELLED",
  confession: "CONFESSION",
  "emp-exclusive": "EMP EXCLUSIVE",
  general: "GENERAL",
};

const CARD_STYLES = ["violet", "crimson", "ice", "gold", "emerald", "rose"];

export default function Admin() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [filter, setFilter] = useState("all");
  const [spinningId, setSpinningId] = useState(null);
  const [revealed, setRevealed] = useState([]);

  async function load() {
    setLoading(true);
    try {
      const r = await fetch("/api/admin/messages", { cache: "no-store" });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Could not load inbox.");
      setMessages(d.messages || []);
      setAuthed(true);
      setError("");
    } catch (e) {
      setError(e.message || "Could not load inbox.");
    } finally {
      setLoading(false);
    }
  }

  async function login(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const r = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Login failed.");
      setPassword("");
      await load();
    } catch (e) {
      setError(e.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  async function revealCard(id) {
    if (revealed.includes(id) || spinningId !== null) return;
    setSpinningId(id);
    window.setTimeout(() => {
      setRevealed((current) => current.includes(id) ? current : [...current, id]);
      setSpinningId(null);
    }, 1500);
  }

  async function remove(id) {
    if (!confirm("Delete this message permanently?")) return;
    try {
      const r = await fetch("/api/admin/messages", {
        method: "DELETE",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Delete failed.");
      setMessages((current) => current.filter((m) => m.id !== id));
      setRevealed((current) => current.filter((messageId) => messageId !== id));
      setError("");
    } catch (e) {
      setError(e.message || "Delete failed.");
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthed(false);
    setMessages([]);
    setFilter("all");
    setRevealed([]);
  }

  async function copyPublicLink() {
    try {
      await navigator.clipboard.writeText(window.location.origin);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Could not copy the link. Copy the public page address from your browser.");
    }
  }

  async function copyMessage(message) {
    try {
      await navigator.clipboard.writeText(message);
      setError("");
    } catch {
      setError("Could not copy that message. Select and copy the text manually.");
    }
  }

  useEffect(() => { load(); }, []);

  const visibleMessages = useMemo(
    () => filter === "all" ? messages : messages.filter((m) => (m.category || "general") === filter),
    [messages, filter]
  );

  return (
    <main className="admin">
      <div className="admin-stars" aria-hidden="true" />
      <div className="admin-space-copy" aria-hidden="true">EMP EXCLUSIVE · EMP UNKNOWN · SAYNT · EMP EXCLUSIVE · EMP UNKNOWN · SAYNT · EMP EXCLUSIVE · EMP UNKNOWN · SAYNT · EMP EXCLUSIVE · EMP UNKNOWN · SAYNT</div>
      <header className="admin-brand"><span>EMP EXCLUSIVE</span><span className="admin-lock">PRIVATE INBOX / DEEP SPACE</span></header>
      <section className="admin-shell">
        <p className="admin-eyebrow">RESTRICTED ACCESS / EMP UNKNOWN</p>
        <h1>UNKNOWN <em>INBOX</em></h1>
        {!authed ? (
          <form className="admin-login" onSubmit={login}>
            <label htmlFor="password">Admin password</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
            <button disabled={loading}>{loading ? "CHECKING..." : "UNLOCK INBOX"}</button>
            {error && <p className="admin-error" role="alert">{error}</p>}
          </form>
        ) : (
          <>
            <div className="admin-toolbar">
              <div><strong>{messages.length}</strong><span> transmissions received</span><small>Latest 200 anonymous submissions / tap a card to decrypt</small></div>
              <div className="admin-toolbar-actions">
                <button onClick={load} disabled={loading}>{loading ? "REFRESHING..." : "↻ REFRESH"}</button>
                <button className="admin-quiet" onClick={() => { if (spinningId === null) setRevealed([]); }} disabled={spinningId !== null}>↺ RESET DECK</button>
                <button className="admin-quiet" onClick={logout}>LOG OUT</button>
              </div>
            </div>
            <section className="admin-share">
              <div><p className="admin-eyebrow">PUBLIC SUBMISSION PAGE</p><p>Share the portal. Anonymous transmissions land here, not in your DMs by magic.</p></div>
              <div className="admin-toolbar-actions">
                <button onClick={() => window.open(window.location.origin, "_blank", "noopener,noreferrer")}>OPEN PUBLIC PAGE</button>
                <button className="admin-quiet" onClick={copyPublicLink}>{copied ? "LINK COPIED" : "COPY LINK"}</button>
              </div>
            </section>
            <div className="admin-filter-row">
              <span>FILTER BY CATEGORY</span>
              <select value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filter messages by category">
                <option value="all">All messages ({messages.length})</option>
                <option value="cancelled">Get cancelled</option>
                <option value="confession">Confessions</option>
                <option value="emp-exclusive">EMP Exclusive</option>
                <option value="general">General / older messages</option>
              </select>
            </div>
            {error && <p className="admin-error" role="alert">{error}</p>}
            <section className="cosmic-decks" aria-label="Anonymous message card decks">
              <div className="deck-heading"><div><span className="deck-kicker">01 / SEALED TRANSMISSIONS</span><h2>Mystery deck <span>{visibleMessages.filter((m) => !revealed.includes(m.id)).length}</span></h2></div><p>Spin to reveal</p></div>
              <div className="confession-deck">
                {visibleMessages.filter((m) => !revealed.includes(m.id)).map((m) => {
                  const index = messages.findIndex((item) => item.id === m.id);
                  const isSpinning = spinningId === m.id;
                  const style = CARD_STYLES[index % CARD_STYLES.length];
                  return <article className={"confession-card card-design-" + style + (isSpinning ? " is-spinning" : "")} key={m.id}>
                    <button className="card-flip-trigger" onClick={() => revealCard(m.id)} disabled={isSpinning || spinningId !== null} aria-label="Shake, cut, and reveal anonymous message">
                      <span className="card-back-design" aria-hidden="true"><span className="card-brand-repeat">EMP EXCLUSIVE · EMP UNKNOWN · SAYNT</span><span className="card-question">?</span><span className="card-secret-label">{isSpinning ? "CUTTING TRANSMISSION..." : "TAP TO REVEAL"}</span><span className="card-corner card-corner-one">EMP / {String(index + 1).padStart(3, "0")}</span><span className="card-corner card-corner-two">ANONYMOUS</span></span>
                      <span className="card-slice card-slice-top" aria-hidden="true"><span>✦</span></span><span className="card-slice card-slice-bottom" aria-hidden="true"><span>EMP UNKNOWN</span></span>
                      <span className="card-confession-face"><span className="revealed-category">{CATEGORY_LABELS[m.category] || CATEGORY_LABELS.general}</span><span className="revealed-message">{m.message}</span><span className="revealed-date">{new Date(m.created_at).toLocaleString()}</span><span className="revealed-ornament">✦ ✧ EMP ✧ ✦</span></span>
                    </button>
                    <div className="confession-card-actions"><span>TRANSMISSION #{m.id}</span><button onClick={() => copyMessage(m.message)}>COPY</button><button className="admin-delete" onClick={() => remove(m.id)}>DELETE</button></div>
                  </article>;
                })}
              </div>
              {!visibleMessages.some((m) => !revealed.includes(m.id)) && <div className="deck-empty">{messages.length ? "Every card in this sector has been revealed." : "The universe is quiet. New transmissions will appear here."}</div>}
              <div className="deck-divider"><span>✦</span><i /><span>EMP EXCLUSIVE / ARCHIVE</span><i /><span>✦</span></div>
              <div className="deck-heading revealed-heading"><div><span className="deck-kicker">02 / DECRYPTED TRANSMISSIONS</span><h2>Revealed deck <span>{visibleMessages.filter((m) => revealed.includes(m.id)).length}</span></h2></div><p>Collected secrets</p></div>
              <div className="confession-deck revealed-deck">
                {visibleMessages.filter((m) => revealed.includes(m.id)).map((m) => {
                  const index = messages.findIndex((item) => item.id === m.id);
                  const style = CARD_STYLES[index % CARD_STYLES.length];
                  return <article className={"confession-card card-design-" + style + " is-revealed"} key={m.id}>
                    <div className="card-flip-trigger revealed-static"><span className="card-back-design" aria-hidden="true"><span className="card-question">?</span></span><span className="card-confession-face"><span className="revealed-category">{CATEGORY_LABELS[m.category] || CATEGORY_LABELS.general}</span><span className="revealed-message">{m.message}</span><span className="revealed-date">{new Date(m.created_at).toLocaleString()}</span><span className="revealed-ornament">✦ ✧ EMP ✧ ✦</span></span></div>
                    <div className="confession-card-actions"><span>TRANSMISSION #{m.id}</span><button onClick={() => copyMessage(m.message)}>COPY</button><button className="admin-delete" onClick={() => remove(m.id)}>DELETE</button></div>
                  </article>;
                })}
              </div>
              {!visibleMessages.some((m) => revealed.includes(m.id)) && <div className="deck-empty deck-empty-quiet">Your revealed cards will land here after their spin.</div>}
            </section>
          </>
        )}
      </section>
      <footer className="admin-footer">EMP UNKNOWN <span>•</span> ANONYMOUS DOES NOT MEAN UNMODERATED</footer>
    </main>
  );
}
