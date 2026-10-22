"use client";
import { useEffect, useMemo, useState } from "react";

const CATEGORY_LABELS = {
  cancelled: "GET CANCELLED",
  confession: "CONFESSION",
  "emp-exclusive": "EMP EXCLUSIVE",
  general: "GENERAL",
};

export default function Admin() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [filter, setFilter] = useState("all");

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
      <header className="admin-brand"><span>EMP EXCLUSIVE</span><span className="admin-lock">PRIVATE INBOX</span></header>
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
              <div><strong>{messages.length}</strong><span> messages received</span><small>Showing the latest 200 submissions</small></div>
              <div className="admin-toolbar-actions">
                <button onClick={load} disabled={loading}>{loading ? "REFRESHING..." : "↻ REFRESH"}</button>
                <button className="admin-quiet" onClick={logout}>LOG OUT</button>
              </div>
            </div>
            <section className="admin-share">
              <div><p className="admin-eyebrow">PUBLIC SUBMISSION PAGE</p><p>Share the public link. Replies land here, not in your DMs by magic.</p></div>
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
            <div className="admin-messages">
              {visibleMessages.map((m) => (
                <article className="admin-message" key={m.id}>
                  <div className="admin-message-meta">
                    <span className={"admin-category category-" + (m.category || "general")}>{CATEGORY_LABELS[m.category] || CATEGORY_LABELS.general}</span>
                    <time dateTime={m.created_at}>{new Date(m.created_at).toLocaleString()}</time>
                    <span className="admin-message-id">#{m.id}</span>
                  </div>
                  <p className="admin-message-text">{m.message}</p>
                  <div className="admin-message-actions">
                    <button onClick={() => copyMessage(m.message)}>COPY MESSAGE</button>
                    <button className="admin-delete" onClick={() => remove(m.id)}>DELETE</button>
                  </div>
                </article>
              ))}
            </div>
            {!visibleMessages.length && <div className="admin-empty"><span>✳</span><h2>{messages.length ? "Nothing in this category yet." : "The inbox is quiet."}</h2><p>{messages.length ? "Choose another category to see more submissions." : "Send a test message from the public page to check the full route."}</p></div>}
          </>
        )}
      </section>
      <footer className="admin-footer">EMP UNKNOWN <span>•</span> ANONYMOUS DOES NOT MEAN UNMODERATED</footer>
    </main>
  );
}
