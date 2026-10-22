"use client";
import { useState } from "react";

const crew = [
  { id:"reaper", name:"THE REAPER", role:"pc operator", outfit:"reaper", x:"6%", y:"33%", line:"Inbox secured.", device:"⌨" },
  { id:"arab", name:"RED FIT", role:"the strategist", outfit:"arab", x:"34%", y:"47%", line:"Check these EMP cards.", device:"" },
  { id:"princess", name:"BLUE ROYALTY", role:"the princess", outfit:"princess", x:"43%", y:"49%", line:"This one has a story.", device:"" },
  { id:"ryder", name:"OLD SCHOOL", role:"the OG", outfit:"ryder", x:"74%", y:"36%", line:"I know the vibe.", device:"" },
  { id:"poetboy", name:"THE POET", role:"words & rhythm", outfit:"poet", x:"17%", y:"65%", line:"Some words stay with you.", device:"✎" },
  { id:"poetgirl", name:"THE MUSE", role:"words & rhythm", outfit:"poetgirl", x:"25%", y:"67%", line:"Write it. Don't hide it.", device:"✎" },
  { id:"white", name:"GHOST MODE", role:"quiet observer", outfit:"white", x:"58%", y:"65%", line:"Reading between lines.", device:"▣" },
  { id:"suit1", name:"THE CONNECT", role:"blue suit", outfit:"suit", x:"84%", y:"61%", line:"We move as one.", device:"" },
  { id:"suit2", name:"THE FIXER", role:"blue suit", outfit:"suit alt", x:"91%", y:"64%", line:"Say less.", device:"" },
  { id:"drip1", name:"DRIP CHECK", role:"streetwear", outfit:"drip", x:"9%", y:"79%", line:"Who's next?", device:"" },
  { id:"drip2", name:"LOWKEY", role:"streetwear", outfit:"drip alt", x:"72%", y:"80%", line:"Keep it unknown.", device:"" },
  { id:"girl1", name:"BLOOM", role:"floral crew", outfit:"flower", x:"49%", y:"75%", line:"Spill the tea.", device:"" },
  { id:"girl2", name:"PETAL", role:"floral crew", outfit:"flower alt", x:"55%", y:"78%", line:"I heard everything.", device:"" },
  { id:"girl3", name:"ROSE", role:"floral crew", outfit:"flower", x:"64%", y:"80%", line:"No names, no stress.", device:"" },
  { id:"girl4", name:"DAISY", role:"floral crew", outfit:"flower alt", x:"32%", y:"79%", line:"Tell us anonymously.", device:"" }
];

function Doodle({ person, index }) {
  return <div className={"doodle-person " + person.outfit} style={{left:person.x,top:person.y,"--i":index}} aria-label={person.name}>
    <div className="speech">{person.line}</div>
    <div className="toy-shadow"/>
    <div className="toy">
      <div className="head"><span className="eye eye-left"/><span className="eye eye-right"/>{person.id==="reaper"&&<span className="skull-mouth">▤</span>}{person.id==="arab"&&<span className="keffiyeh"/>}{person.id==="princess"&&<span className="crown">♛</span>}{person.id==="ryder"&&<span className="bandana"/>}{person.outfit.includes("flower")&&<span className="hair-flower">✿</span>}</div>
      <div className="body"><span className="arm arm-left"/><span className="arm arm-right"/>{person.device&&<span className="device">{person.device}</span>}</div>
      <div className="legs"><span/><span/></div>
    </div>
    <div className="person-label">{person.name}</div>
  </div>
}

export default function Home() {
 const [message,setMessage]=useState(""); const [status,setStatus]=useState(""); const [busy,setBusy]=useState(false);
 async function send(e) { e.preventDefault(); if(!message.trim()) return; setBusy(true); setStatus(""); try { const r=await fetch("/api/messages",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({message})}); const d=await r.json(); if(!r.ok) throw new Error(d.error||"Message could not be sent."); setMessage(""); setStatus("Your message has been sent anonymously."); } catch(e) { setStatus(e.message||"Could not send right now. Please try again later."); } finally { setBusy(false); } }
 return <main><div className="scanline"/><header className="brand"><span>EMP EXCLUSIVE</span></header>
  <section className="hero">
   <p className="eyebrow">THE UNKNOWN INBOX</p><h1>EMP <em>UNKNOWN</em></h1>
   <p className="tagline">Send an anonymous message to EMP and wait for a review.</p>
  </section>
  <section className="lounge" aria-label="Animated EMP UNKNOWN lounge">
   <div className="lounge-top"><span>EMP SOCIAL CLUB</span><span className="live-dot">● LIVE LOUNGE</span></div>
   <div className="wall-logo"><span className="wall-crown">♛</span><strong>EMP <i>UNKNOWN</i></strong><small>PROPERTY OF EMP EXCLUSIVE</small></div>
   <div className="window-glow"/><div className="plant plant-left">♣</div><div className="plant plant-right">♣</div>
   <div className="sofa sofa-one"/><div className="sofa sofa-two"/><div className="coffee-table"><span>EMP</span><b>▰ ▰ ▰</b></div>
   {crew.map((person,index)=><Doodle key={person.id} person={person} index={index}/>)}
   <div className="lounge-caption">Different stories. One family. Anonymous voices.</div>
  </section>
  <section className="message-section" id="send-message"><div className="form-heading"><p className="eyebrow">YOUR WORDS. YOUR CALL.</p><h2>Drop it in the <em>UNKNOWN.</em></h2><p>No names. Just your message.</p></div>
   <form onSubmit={send}><label htmlFor="message">Your message</label><textarea id="message" maxLength={1500} value={message} onChange={e=>setMessage(e.target.value)} placeholder="Say what you need to say..." required/><div className="formfoot"><span>{message.length}/1500</span><button disabled={busy||!message.trim()}>{busy?"SENDING...":"SEND ANONYMOUSLY ↗"}</button></div>{status&&<p className="status" role="status">{status}</p>}</form>
   <p className="privacy">No account needed. Please do not include passwords or sensitive personal information. Technical systems may still process limited connection logs, so absolute anonymity cannot be guaranteed.</p>
  </section><footer>EMP EXCLUSIVE <span>•</span> PRIVATE WORDS. UNKNOWN VOICES.</footer></main>;
}
