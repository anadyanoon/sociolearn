import { useState, useRef, useEffect } from "react";
import { Home, MessageCircle, Headphones, FileText, Zap, Play, Pause, ChevronRight, Plus, ArrowRight, RotateCcw, BookOpen, Flame, Trophy, Star } from "lucide-react";

const API_URL = "https://api.anthropic.com/v1/messages";

const SYSTEM_PROMPT = `You are SocioLearn AI — an expert sociology tutor for exam preparation (A-Level, IB, GCSE, undergraduate).

Your role:
- Give structured, exam-ready answers with clear arguments
- Always cite key theorists (Durkheim, Marx, Weber, Parsons, Giddens, Bourdieu, Becker, Foucault, Gramsci, Habermas, etc.)
- Include both strengths AND criticisms of each perspective
- Use correct sociological terminology
- Connect theories to contemporary real-world examples
- Help students see how concepts link across topics
- Support active recall through comparative analysis

Format responses with clear structure:
**[Concept Name]**
📖 Definition: [Clear, precise definition]
🧑‍🏫 Key Theorists: [Names + specific contributions]
💡 Main Arguments: [Bullet points]
🌍 Real-World Example: [Contemporary illustration]
⚖️ Evaluation: [Strengths then criticisms]
✏️ Exam Tip: [One practical writing tip]

Focus on British sociology curriculum. Be comprehensive but concise. Help students build writing ability and conceptual clarity.`;

const TOPICS = [
  { id: "culture",        name: "Culture & Society",     color: "#a78bfa", bg: "#1e1630", icon: "🌐" },
  { id: "stratification", name: "Social Stratification", color: "#fb923c", bg: "#2a1610", icon: "📊" },
  { id: "deviance",       name: "Deviance & Crime",      color: "#60a5fa", bg: "#101f2e", icon: "⚖️" },
  { id: "family",         name: "Family & Kinship",      color: "#f472b6", bg: "#2e1020", icon: "🏠" },
  { id: "education",      name: "Education",             color: "#34d399", bg: "#0e2820", icon: "📚" },
  { id: "religion",       name: "Religion & Belief",     color: "#fbbf24", bg: "#2e2510", icon: "☯️" },
  { id: "media",          name: "Media & Technology",    color: "#7dd3fc", bg: "#101828", icon: "📱" },
  { id: "power",          name: "Power & Politics",      color: "#c084fc", bg: "#1a1030", icon: "🏛️" },
  { id: "health",         name: "Health & Illness",      color: "#4ade80", bg: "#0e2818", icon: "💊" },
  { id: "global",         name: "Globalisation",         color: "#f97316", bg: "#2a1808", icon: "🌍" },
];

const AUDIO_LESSONS = [
  { id: 1, title: "The Three Sociological Perspectives",   dur: "12:34", topic: "Theory",        color: "#fb923c", desc: "Functionalism, Marxism & Interactionism" },
  { id: 2, title: "Durkheim: Solidarity & Conscience",    dur: "18:20", topic: "Functionalism",  color: "#a78bfa", desc: "Mechanical, organic solidarity, anomie" },
  { id: 3, title: "Marx: Class Conflict & Capitalism",    dur: "15:45", topic: "Marxism",        color: "#60a5fa", desc: "Base, superstructure, alienation" },
  { id: 4, title: "Feminism: First to Fourth Wave",       dur: "14:30", topic: "Feminism",       color: "#f472b6", desc: "Liberal, radical, Marxist, intersectional" },
  { id: 5, title: "Labelling Theory & Moral Panics",      dur: "16:20", topic: "Deviance",       color: "#34d399", desc: "Becker, Lemert, Cohen and folk devils" },
  { id: 6, title: "Bourdieu: Capital & Field",            dur: "19:05", topic: "Education",      color: "#fbbf24", desc: "Cultural, social & economic capital" },
  { id: 7, title: "Weber: Rationality & Social Action",   dur: "13:50", topic: "Theory",         color: "#c084fc", desc: "Verstehen, ideal types, bureaucracy" },
];

const QUIZ_QUESTIONS = [
  {
    q: "Which sociologist coined the concept of 'collective conscience'?",
    opts: ["Karl Marx", "Émile Durkheim", "Max Weber", "Howard Becker"],
    ans: 1,
    exp: "Durkheim's 'collective conscience' refers to the shared moral beliefs and values that bind society together, creating social solidarity. It weakens in modern societies leading to anomie."
  },
  {
    q: "Bourdieu's 'cultural capital' refers primarily to:",
    opts: ["Money and financial assets", "Social networks and connections", "Knowledge, skills, and cultural tastes", "Political power and influence"],
    ans: 2,
    exp: "Cultural capital includes embodied dispositions, cultural knowledge, educational credentials and aesthetic tastes that provide advantages. Schools reward middle-class cultural capital, reproducing inequality."
  },
  {
    q: "What does Howard Becker mean by 'moral entrepreneur'?",
    opts: ["An ethical businessperson", "One who creates/enforces moral rules on others", "A socialist economist", "A community religious leader"],
    ans: 1,
    exp: "Becker defined moral entrepreneurs as those who campaign to create or enforce rules — they define what counts as deviant behaviour and seek to impose their moral worldview on others."
  },
  {
    q: "The 'dark figure of crime' refers to:",
    opts: ["Crime committed at night", "Crime by organised gangs", "Unreported or unrecorded crime", "Crime in deprived urban areas"],
    ans: 2,
    exp: "The 'dark figure' is crime that goes unreported or unrecorded, meaning official statistics significantly underestimate the true extent of crime. Victim surveys like the CSEW reveal it."
  },
  {
    q: "Which feminist perspective argues capitalism AND patriarchy together oppress women?",
    opts: ["Liberal feminism", "Radical feminism", "Marxist/Socialist feminism", "Postmodern feminism"],
    ans: 2,
    exp: "Marxist/Socialist feminists like Juliet Mitchell and Sylvia Walby argue women face a 'dual burden' — oppressed both by the capitalist system and by patriarchal structures simultaneously."
  },
  {
    q: "Gramsci's concept of 'hegemony' refers to:",
    opts: ["Military dominance of a state", "Ruling class dominance through ideology and consent", "Democratic majority rule", "Economic monopoly power"],
    ans: 1,
    exp: "Gramsci argued the ruling class maintains power not just through force but through cultural hegemony — getting subordinate classes to accept ruling class values as 'common sense' and natural."
  },
];

const THEORISTS = [
  { name: "Émile Durkheim", era: "1858–1917", perspective: "Functionalism", key: "Collective conscience, anomie, mechanical/organic solidarity", color: "#a78bfa" },
  { name: "Karl Marx", era: "1818–1883", perspective: "Marxism", key: "Class conflict, base/superstructure, alienation, false consciousness", color: "#fb923c" },
  { name: "Max Weber", era: "1864–1920", perspective: "Social Action", key: "Verstehen, rationality, ideal types, Protestant ethic", color: "#60a5fa" },
  { name: "Pierre Bourdieu", era: "1930–2002", perspective: "Neo-Marxism", key: "Cultural capital, habitus, field, social reproduction", color: "#34d399" },
  { name: "Howard Becker", era: "1928–2023", perspective: "Interactionism", key: "Labelling theory, moral entrepreneurs, outsiders", color: "#fbbf24" },
  { name: "Michel Foucault", era: "1926–1984", perspective: "Post-structuralism", key: "Discourse, power/knowledge, surveillance, panopticon", color: "#f472b6" },
];

export default function SociologyApp() {
  const [screen, setScreen] = useState("onboarding");
  const [step, setStep] = useState(0);
  const [selTopics, setSelTopics] = useState(["culture", "stratification", "education"]);
  const [tab, setTab] = useState("home");
  const [msgs, setMsgs] = useState([
    { role: "assistant", content: "Welcome to SocioLearn! 📚 I'm your AI sociology tutor.\n\nAsk me anything — a theory, a concept, a comparison, or an essay question. I'll give you a structured, exam-ready answer with key theorists, arguments, examples, and evaluations." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [playId, setPlayId] = useState(null);
  const [audioPct, setAudioPct] = useState(0);
  const [notes, setNotes] = useState([
    { id: 1, title: "Functionalism Key Points", body: "Society as organism • consensus • social institutions perform functions • Durkheim's solidarity • Parsons' AGIL schema • criticism: ignores conflict and inequality", date: "Today", color: "#a78bfa" },
    { id: 2, title: "Marxist Core Concepts", body: "Base & superstructure • ruling class ideology • alienation • false consciousness • reserve army of labour • ISAs & RSAs (Althusser)", date: "Yesterday", color: "#fb923c" },
    { id: 3, title: "Feminist Perspectives", body: "Liberal: equal rights & opportunities • Radical: patriarchy is root cause • Marxist: capitalism + patriarchy • Black feminism: intersectionality (Crenshaw)", date: "2 days ago", color: "#f472b6" },
  ]);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteBody, setNoteBody] = useState("");
  const [addingNote, setAddingNote] = useState(false);
  const [qi, setQi] = useState(0);
  const [sel, setSel] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [homeView, setHomeView] = useState("overview");
  const endRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, loading]);

  useEffect(() => {
    if (playId) {
      timerRef.current = setInterval(() => setAudioPct(p => p >= 100 ? 0 : p + 0.35), 200);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [playId]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const text = input.trim();
    setInput("");
    setMsgs(m => [...m, { role: "user", content: text }]);
    setLoading(true);
    try {
      const r = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: [
            ...msgs.slice(1).map(m => ({ role: m.role, content: m.content })),
            { role: "user", content: text }
          ]
        })
      });
      const data = await r.json();
      setMsgs(m => [...m, { role: "assistant", content: data.content?.[0]?.text || "Sorry, couldn't respond." }]);
    } catch {
      setMsgs(m => [...m, { role: "assistant", content: "Connection error. Please try again." }]);
    }
    setLoading(false);
  };

  const answer = (i) => {
    if (sel !== null) return;
    setSel(i);
    if (i === QUIZ_QUESTIONS[qi].ans) setScore(s => s + 1);
  };

  const nextQ = () => {
    if (qi < QUIZ_QUESTIONS.length - 1) { setQi(q => q + 1); setSel(null); }
    else setDone(true);
  };

  const restart = () => { setQi(0); setSel(null); setScore(0); setDone(false); };

  const saveNote = () => {
    if (!noteTitle.trim()) return;
    const cs = ["#a78bfa","#fb923c","#34d399","#f472b6","#fbbf24","#60a5fa"];
    setNotes(n => [{ id: Date.now(), title: noteTitle, body: noteBody, date: "Just now", color: cs[n.length % cs.length] }, ...n]);
    setNoteTitle(""); setNoteBody(""); setAddingNote(false);
  };

  /* ── ONBOARDING ── */
  if (screen === "onboarding") {
    const slides = [
      {
        gradient: "linear-gradient(160deg, #120a28 0%, #1e1040 50%, #0e0820 100%)",
        accent: "#a78bfa",
        badge: "NEW",
        title: "Welcome to\nSocioLearn",
        sub: "Master sociology through understanding, not memorization. Ace every exam.",
        cta: "Start Now →",
        visual: (
          <div style={{ display:"flex", justifyContent:"center", alignItems:"center", height:200, position:"relative" }}>
            <div style={{ position:"absolute", width:120, height:120, borderRadius:"50%", border:"2px solid #a78bfa40", animation:"spin 12s linear infinite" }} />
            <div style={{ position:"absolute", width:160, height:160, borderRadius:"50%", border:"2px solid #a78bfa20", animation:"spin 18s linear infinite reverse" }} />
            <div style={{ width:80, height:80, borderRadius:"50%", background:"linear-gradient(135deg, #1e1040, #2d1860)", border:"2px solid #a78bfa", display:"flex", alignItems:"center", justifyContent:"center", fontSize:36 }}>🧠</div>
            {[["📊","top:10px,left:20px"],["🌐","top:10px,right:20px"],["⚖️","bottom:10px,left:20px"],["📚","bottom:10px,right:20px"]].map(([em, pos], i) => {
              const style = Object.fromEntries(pos.split(",").map(p => { const [k,v]=p.split(":"); return [k,v]; }));
              return (
                <div key={i} style={{ position:"absolute", ...style, width:44, height:44, borderRadius:12, background:"rgba(167,139,250,0.1)", border:"1px solid rgba(167,139,250,0.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>{em}</div>
              );
            })}
          </div>
        )
      },
      {
        gradient: "linear-gradient(160deg, #2a0e08 0%, #3d1a0c 50%, #1a0a04 100%)",
        accent: "#fb923c",
        badge: "HOW IT WORKS",
        title: "Learn Sociology\nDifferently",
        sub: "Connect theories, theorists, and real-world examples — then test yourself.",
        cta: "See Features →",
        visual: (
          <div style={{ margin:"24px 0" }}>
            {[
              { icon:"🤖", label:"AI Tutor", desc:"Exam-ready answers with key theorists" },
              { icon:"🎧", label:"Audio Lessons", desc:"Learn on the go, anywhere" },
              { icon:"✏️", label:"Active Recall Quiz", desc:"Test what you know, fill the gaps" },
              { icon:"📝", label:"Smart Notes", desc:"Capture and organise your thinking" },
            ].map((f, i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:14, padding:"12px 0", borderBottom: i<3 ? "1px solid rgba(255,255,255,0.07)":"none" }}>
                <div style={{ width:40, height:40, borderRadius:12, background:"rgba(251,146,60,0.12)", border:"1px solid rgba(251,146,60,0.25)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>{f.icon}</div>
                <div>
                  <div style={{ fontSize:14, fontWeight:700 }}>{f.label}</div>
                  <div style={{ fontSize:12, color:"rgba(255,255,255,0.5)", marginTop:1 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        )
      },
      {
        gradient: "linear-gradient(160deg, #0d0d18 0%, #121220 100%)",
        accent: "#34d399",
        badge: "STEP 3 OF 3",
        title: "Choose Your\nTopics",
        sub: "Select what you're studying. You can change this later.",
        cta: "Start Learning →",
        visual: null
      }
    ];

    const sl = slides[step];
    return (
      <div style={{ background: sl.gradient, minHeight:"100vh", display:"flex", flexDirection:"column", padding:"56px 22px 36px", fontFamily:"'Nunito', sans-serif", color:"#fff", maxWidth:420, margin:"0 auto" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap'); @keyframes spin { to { transform: rotate(360deg); } } * { box-sizing:border-box; } ::-webkit-scrollbar { display:none; }`}</style>

        {/* Progress */}
        <div style={{ display:"flex", gap:6, marginBottom:32 }}>
          {[0,1,2].map(i => (
            <div key={i} style={{ height:4, flex: i===step?2:1, borderRadius:2, background: i<=step ? sl.accent : "rgba(255,255,255,0.15)", transition:"all 0.4s" }} />
          ))}
        </div>

        <div style={{ display:"inline-block", background:`${sl.accent}18`, border:`1px solid ${sl.accent}30`, borderRadius:20, padding:"4px 10px", fontSize:10, fontWeight:800, color:sl.accent, letterSpacing:1, width:"fit-content", marginBottom:16 }}>{sl.badge}</div>
        <h1 style={{ fontSize:32, fontWeight:900, lineHeight:1.15, marginBottom:10, whiteSpace:"pre-line" }}>{sl.title}</h1>
        <p style={{ fontSize:14, color:"rgba(255,255,255,0.6)", lineHeight:1.7, marginBottom:4 }}>{sl.sub}</p>

        {sl.visual}

        {/* Topic grid */}
        {step === 2 && (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, margin:"16px 0", flex:1 }}>
            {TOPICS.map(t => {
              const on = selTopics.includes(t.id);
              return (
                <button key={t.id} onClick={() => setSelTopics(p => on ? p.filter(x=>x!==t.id) : [...p, t.id])} style={{ background: on ? t.bg : "rgba(255,255,255,0.04)", border:`1.5px solid ${on ? t.color+"60" : "rgba(255,255,255,0.08)"}`, borderRadius:14, padding:"12px 10px", cursor:"pointer", display:"flex", alignItems:"center", gap:8, color:"#fff", fontSize:13, fontWeight: on?700:400, transition:"all 0.2s" }}>
                  <span style={{ fontSize:16 }}>{t.icon}</span>
                  <span style={{ flex:1, textAlign:"left" }}>{t.name}</span>
                  {on && <span style={{ fontSize:10, color:t.color }}>✓</span>}
                </button>
              );
            })}
          </div>
        )}

        <button onClick={() => { if (step<2) setStep(s=>s+1); else setScreen("main"); }} style={{ background:sl.accent, color:"#000", border:"none", borderRadius:16, padding:"15px", fontSize:15, fontWeight:800, cursor:"pointer", width:"100%", marginTop: step===2?8:0 }}>
          {sl.cta}
        </button>
      </div>
    );
  }

  /* ── MAIN APP ── */
  const Home = () => (
    <div style={{ padding:"22px 18px 90px" }}>
      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:22 }}>
        <div>
          <p style={{ color:"#6060808", fontSize:13, margin:0, color:"#60607a" }}>Good morning 👋</p>
          <h2 style={{ fontSize:22, fontWeight:900, margin:"2px 0 0" }}>Sociology Student</h2>
        </div>
        <div style={{ width:44, height:44, borderRadius:"50%", background:"#1e1630", border:"2px solid #a78bfa60", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>🎓</div>
      </div>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:22 }}>
        {[
          { label:"Day Streak", val:"7", icon:"🔥", color:"#fb923c" },
          { label:"Topics", val:selTopics.length, icon:"📚", color:"#a78bfa" },
          { label:"Quiz Best", val:"83%", icon:"🏆", color:"#34d399" },
        ].map((s,i) => (
          <div key={i} style={{ background:"#14141e", borderRadius:14, padding:"14px 8px", textAlign:"center", border:"1px solid #1e1e30" }}>
            <div style={{ fontSize:20, marginBottom:2 }}>{s.icon}</div>
            <div style={{ fontSize:21, fontWeight:900, color:s.color }}>{s.val}</div>
            <div style={{ fontSize:10, color:"#60607a", marginTop:1 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <h3 style={{ fontSize:15, fontWeight:800, marginBottom:10, color:"#d0d0e0" }}>Quick Actions</h3>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:22 }}>
        {[
          { label:"Ask AI Tutor",   sub:"Instant exam answers",    icon:"🤖", color:"#a78bfa", bg:"#1e1630", t:"tutor" },
          { label:"Audio Lessons",  sub:`${AUDIO_LESSONS.length} lessons`,    icon:"🎧", color:"#fb923c", bg:"#2a1610", t:"audio" },
          { label:"My Notes",       sub:`${notes.length} saved`,   icon:"📝", color:"#34d399", bg:"#0e2818", t:"notes" },
          { label:"Active Recall",  sub:"Test your knowledge",     icon:"⚡", color:"#fbbf24", bg:"#2e2510", t:"quiz"  },
        ].map((a,i) => (
          <button key={i} onClick={()=>setTab(a.t)} style={{ background:a.bg, border:`1px solid ${a.color}25`, borderRadius:16, padding:"16px 14px", textAlign:"left", cursor:"pointer", color:"#fff" }}>
            <span style={{ fontSize:26, display:"block", marginBottom:8 }}>{a.icon}</span>
            <div style={{ fontSize:14, fontWeight:700 }}>{a.label}</div>
            <div style={{ fontSize:11, color:"#60607a", marginTop:2 }}>{a.sub}</div>
          </button>
        ))}
      </div>

      {/* Theorist spotlight */}
      <h3 style={{ fontSize:15, fontWeight:800, marginBottom:10, color:"#d0d0e0" }}>Key Theorists</h3>
      <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:22 }}>
        {THEORISTS.map((t,i) => (
          <div key={i} style={{ background:"#14141e", border:`1px solid ${t.color}20`, borderRadius:14, padding:"12px 14px", display:"flex", alignItems:"flex-start", gap:12 }}>
            <div style={{ width:36, height:36, borderRadius:10, background:`${t.color}18`, border:`1px solid ${t.color}40`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>👤</div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ fontSize:13, fontWeight:800 }}>{t.name}</span>
                <span style={{ fontSize:10, color:"#60607a" }}>{t.era}</span>
              </div>
              <div style={{ fontSize:10, color:t.color, fontWeight:700, margin:"2px 0 3px" }}>{t.perspective}</div>
              <div style={{ fontSize:11, color:"#80809a", lineHeight:1.5 }}>{t.key}</div>
            </div>
          </div>
        ))}
      </div>

      {/* My topics */}
      <h3 style={{ fontSize:15, fontWeight:800, marginBottom:10, color:"#d0d0e0" }}>Your Topics</h3>
      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {TOPICS.filter(t=>selTopics.includes(t.id)).map(t => (
          <div key={t.id} style={{ background:t.bg, border:`1px solid ${t.color}30`, borderRadius:14, padding:"13px 14px", display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ fontSize:18 }}>{t.icon}</span>
            <span style={{ flex:1, fontSize:14, fontWeight:700 }}>{t.name}</span>
            <button onClick={()=>{setTab("tutor"); setInput(`Explain key concepts in ${t.name}`);}} style={{ background:`${t.color}20`, border:`1px solid ${t.color}40`, borderRadius:8, padding:"4px 10px", color:t.color, fontSize:11, fontWeight:700, cursor:"pointer" }}>Study →</button>
          </div>
        ))}
      </div>
    </div>
  );

  const Tutor = () => (
    <div style={{ display:"flex", flexDirection:"column", height:"100vh" }}>
      <div style={{ padding:"18px 18px 10px", background:"#0d0d14", borderBottom:"1px solid #1a1a28", flexShrink:0 }}>
        <h2 style={{ fontSize:20, fontWeight:900, margin:0 }}>AI Sociology Tutor</h2>
        <p style={{ fontSize:12, color:"#60607a", margin:"3px 0 0" }}>Exam-ready answers · Key theorists · Evaluations</p>
      </div>

      {/* Chips */}
      <div style={{ padding:"10px 14px", display:"flex", gap:7, overflowX:"auto", flexShrink:0, background:"#0d0d14", paddingBottom:8 }}>
        {["Explain Functionalism","Marxist view of education","Feminist perspectives","What is anomie?","Compare Marx & Weber","Bourdieu's cultural capital"].map(q => (
          <button key={q} onClick={()=>setInput(q)} style={{ background:"#16162a", border:"1px solid #2a2a40", borderRadius:20, padding:"5px 11px", color:"#aaa", fontSize:11, cursor:"pointer", whiteSpace:"nowrap", flexShrink:0 }}>{q}</button>
        ))}
      </div>

      {/* Messages */}
      <div style={{ flex:1, overflowY:"auto", padding:"14px 16px", display:"flex", flexDirection:"column", gap:10, paddingBottom:70 }}>
        {msgs.map((m,i) => (
          <div key={i} style={{ display:"flex", justifyContent: m.role==="user"?"flex-end":"flex-start" }}>
            {m.role==="assistant" && (
              <div style={{ width:28, height:28, borderRadius:"50%", background:"#1e1630", border:"1px solid #a78bfa60", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, marginRight:7, flexShrink:0, marginTop:2 }}>🤖</div>
            )}
            <div style={{ background: m.role==="user" ? "linear-gradient(135deg,#6d28d9,#8b5cf6)" : "#16162a", color:"#fff", borderRadius: m.role==="user"?"18px 18px 4px 18px":"4px 18px 18px 18px", padding:"10px 13px", maxWidth:"82%", fontSize:13, lineHeight:1.65, whiteSpace:"pre-wrap" }}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display:"flex", gap:8 }}>
            <div style={{ width:28, height:28, borderRadius:"50%", background:"#1e1630", border:"1px solid #a78bfa60", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, flexShrink:0 }}>🤖</div>
            <div style={{ background:"#16162a", borderRadius:"4px 18px 18px 18px", padding:"12px 16px", display:"flex", gap:4, alignItems:"center" }}>
              {[0,1,2].map(i => <div key={i} style={{ width:6, height:6, borderRadius:"50%", background:"#a78bfa", animation:`dot 1.2s ${i*0.2}s infinite` }} />)}
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div style={{ position:"fixed", bottom:56, left:0, right:0, maxWidth:420, margin:"0 auto", padding:"10px 14px", background:"#0d0d14", borderTop:"1px solid #1a1a28", display:"flex", gap:8 }}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Ask any sociology question..." style={{ flex:1, background:"#16162a", border:"1px solid #2a2a40", borderRadius:13, padding:"10px 13px", color:"#fff", fontSize:13, outline:"none" }} />
        <button onClick={send} style={{ background: loading?"#2a2a40":"#8b5cf6", border:"none", borderRadius:13, width:42, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
          <ArrowRight size={17} color="#fff" />
        </button>
      </div>
    </div>
  );

  const Audio = () => {
    const playing = AUDIO_LESSONS.find(l=>l.id===playId);
    return (
      <div style={{ padding:"22px 18px 90px" }}>
        <h2 style={{ fontSize:22, fontWeight:900, marginBottom:3 }}>Audio Lessons</h2>
        <p style={{ fontSize:13, color:"#60607a", marginBottom:20 }}>Learn sociology anywhere, anytime</p>

        {playing && (
          <div style={{ background:`linear-gradient(135deg, ${playing.color}18, ${playing.color}06)`, border:`1.5px solid ${playing.color}50`, borderRadius:20, padding:18, marginBottom:20 }}>
            <div style={{ fontSize:10, color:playing.color, fontWeight:800, letterSpacing:1, marginBottom:8 }}>▶ NOW PLAYING</div>
            <h3 style={{ fontSize:15, fontWeight:800, marginBottom:3 }}>{playing.title}</h3>
            <p style={{ fontSize:12, color:"#80809a", marginBottom:14 }}>{playing.desc}</p>
            <div style={{ height:3, background:"rgba(255,255,255,0.08)", borderRadius:2, marginBottom:10 }}>
              <div style={{ width:`${audioPct}%`, height:"100%", background:playing.color, borderRadius:2, transition:"width 0.2s" }} />
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontSize:11, color:"#60607a" }}>{Math.floor(audioPct/100*12).toString().padStart(2,"0")}:{Math.floor((audioPct/100*12%1)*60).toString().padStart(2,"0")}</span>
              <button onClick={()=>setPlayId(null)} style={{ background:playing.color, border:"none", borderRadius:"50%", width:44, height:44, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Pause size={18} color="#fff" />
              </button>
              <span style={{ fontSize:11, color:"#60607a" }}>{playing.dur}</span>
            </div>
          </div>
        )}

        <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
          {AUDIO_LESSONS.map(l => (
            <button key={l.id} onClick={()=>{setPlayId(l.id===playId?null:l.id); setAudioPct(0);}} style={{ background: l.id===playId ? `${l.color}10` : "#14141e", border:`1.5px solid ${l.id===playId ? l.color+"50" : "#1e1e30"}`, borderRadius:15, padding:"13px 14px", display:"flex", alignItems:"center", gap:12, cursor:"pointer", color:"#fff", textAlign:"left" }}>
              <div style={{ width:44, height:44, borderRadius:13, background:`${l.color}18`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, border:`1px solid ${l.color}30` }}>
                {l.id===playId ? <Pause size={18} color={l.color} /> : <Play size={18} color={l.color} />}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:13, fontWeight:700, marginBottom:2 }}>{l.title}</div>
                <div style={{ fontSize:11, color:"#60607a" }}>{l.topic} · {l.dur}</div>
              </div>
              {l.id===playId && <div style={{ width:7, height:7, borderRadius:"50%", background:l.color, flexShrink:0 }} />}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const Notes = () => (
    <div style={{ padding:"22px 18px 90px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
        <div>
          <h2 style={{ fontSize:22, fontWeight:900, margin:0 }}>My Notes</h2>
          <p style={{ fontSize:13, color:"#60607a", margin:"3px 0 0" }}>{notes.length} notes saved</p>
        </div>
        <button onClick={()=>setAddingNote(true)} style={{ background:"#8b5cf6", border:"none", borderRadius:12, padding:"8px 13px", color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:5 }}>
          <Plus size={15} /> New
        </button>
      </div>

      {addingNote && (
        <div style={{ background:"#14141e", border:"1px solid #2a2a40", borderRadius:17, padding:16, marginBottom:14 }}>
          <input value={noteTitle} onChange={e=>setNoteTitle(e.target.value)} placeholder="Note title..." style={{ width:"100%", background:"#1a1a2e", border:"1px solid #2a2a40", borderRadius:10, padding:"9px 12px", color:"#fff", fontSize:14, outline:"none", marginBottom:8 }} />
          <textarea value={noteBody} onChange={e=>setNoteBody(e.target.value)} placeholder="Write your sociology notes here — key theories, theorists, evaluation points..." rows={5} style={{ width:"100%", background:"#1a1a2e", border:"1px solid #2a2a40", borderRadius:10, padding:"9px 12px", color:"#fff", fontSize:13, outline:"none", resize:"none", lineHeight:1.65 }} />
          <div style={{ display:"flex", gap:8, marginTop:10 }}>
            <button onClick={saveNote} style={{ flex:1, background:"#8b5cf6", border:"none", borderRadius:10, padding:10, color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer" }}>Save Note</button>
            <button onClick={()=>setAddingNote(false)} style={{ background:"#1a1a2e", border:"1px solid #2a2a40", borderRadius:10, padding:"10px 14px", color:"#80809a", fontSize:13, cursor:"pointer" }}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {notes.map(n => (
          <div key={n.id} style={{ background:"#14141e", borderRadius:15, padding:"14px 15px", borderLeft:`3.5px solid ${n.color}` }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
              <h3 style={{ fontSize:14, fontWeight:800, margin:0 }}>{n.title}</h3>
              <span style={{ fontSize:11, color:"#60607a" }}>{n.date}</span>
            </div>
            <p style={{ fontSize:13, color:"#9090aa", margin:0, lineHeight:1.65 }}>{n.body}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const Quiz = () => {
    if (done) {
      const pct = Math.round((score/QUIZ_QUESTIONS.length)*100);
      const msg = pct>=80 ? "Excellent work! 🏆" : pct>=60 ? "Good effort! Keep going ⭐" : "Keep practising! 📚";
      return (
        <div style={{ padding:"60px 24px", textAlign:"center", display:"flex", flexDirection:"column", alignItems:"center" }}>
          <div style={{ fontSize:56, marginBottom:14 }}>{pct>=80?"🏆":pct>=60?"⭐":"📖"}</div>
          <h2 style={{ fontSize:26, fontWeight:900, marginBottom:6 }}>Quiz Complete!</h2>
          <p style={{ fontSize:14, color:"#80809a", marginBottom:28 }}>{msg}</p>
          <div style={{ width:110, height:110, borderRadius:"50%", background:"#14141e", border:`3px solid ${pct>=80?"#34d399":pct>=60?"#fbbf24":"#a78bfa"}`, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:10 }}>
            <span style={{ fontSize:30, fontWeight:900, color: pct>=80?"#34d399":pct>=60?"#fbbf24":"#a78bfa" }}>{pct}%</span>
          </div>
          <p style={{ fontSize:13, color:"#60607a", marginBottom:36 }}>{score}/{QUIZ_QUESTIONS.length} correct</p>
          <button onClick={restart} style={{ background:"#8b5cf6", border:"none", borderRadius:16, padding:"14px 44px", color:"#fff", fontSize:15, fontWeight:800, cursor:"pointer" }}>Try Again</button>
        </div>
      );
    }

    const q = QUIZ_QUESTIONS[qi];
    return (
      <div style={{ padding:"22px 18px 90px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
          <h2 style={{ fontSize:20, fontWeight:900, margin:0 }}>Active Recall</h2>
          <div style={{ background:"#14141e", borderRadius:10, padding:"4px 12px", fontSize:12, color:"#a78bfa", fontWeight:800 }}>{qi+1}/{QUIZ_QUESTIONS.length}</div>
        </div>

        <div style={{ height:4, background:"#1a1a28", borderRadius:2, marginBottom:16 }}>
          <div style={{ width:`${(qi/QUIZ_QUESTIONS.length)*100}%`, height:"100%", background:"#8b5cf6", borderRadius:2, transition:"width 0.4s" }} />
        </div>

        <div style={{ display:"flex", gap:5, marginBottom:18 }}>
          {Array(score).fill(0).map((_,i) => <div key={i} style={{ width:8, height:8, borderRadius:"50%", background:"#34d399" }} />)}
        </div>

        <div style={{ background:"#14141e", borderRadius:18, padding:"18px 16px", marginBottom:14, border:"1px solid #1e1e30" }}>
          <p style={{ fontSize:10, color:"#8b5cf6", fontWeight:800, letterSpacing:1, marginBottom:8 }}>QUESTION {qi+1}</p>
          <h3 style={{ fontSize:15, fontWeight:800, lineHeight:1.55, margin:0 }}>{q.q}</h3>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:9, marginBottom:14 }}>
          {q.opts.map((o,i) => {
            let bg="#14141e", border="1px solid #1e1e30", color="#fff";
            if (sel!==null) {
              if (i===q.ans) { bg="#0e2818"; border="1.5px solid #34d399"; color="#34d399"; }
              else if (i===sel&&i!==q.ans) { bg="#2a1010"; border="1.5px solid #f87171"; color="#f87171"; }
            }
            return (
              <button key={i} onClick={()=>answer(i)} style={{ background:bg, border, borderRadius:13, padding:"13px 14px", color, fontSize:13, textAlign:"left", cursor: sel!==null?"default":"pointer", display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:26, height:26, borderRadius:"50%", background: sel!==null&&i===q.ans?"#34d399":sel!==null&&i===sel?"#f87171":"#1a1a2e", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:11, fontWeight:800, color: sel!==null?(i===q.ans||i===sel?"#fff":"#60607a"):"#60607a" }}>
                  {sel!==null ? (i===q.ans?"✓":i===sel?"✗":String.fromCharCode(65+i)) : String.fromCharCode(65+i)}
                </div>
                {o}
              </button>
            );
          })}
        </div>

        {sel!==null && (
          <>
            <div style={{ background: sel===q.ans?"#0e2818":"#2a1010", border:`1px solid ${sel===q.ans?"#34d399":"#f87171"}`, borderRadius:13, padding:13, marginBottom:13 }}>
              <p style={{ fontSize:11, color: sel===q.ans?"#34d399":"#f87171", fontWeight:800, marginBottom:5 }}>{sel===q.ans?"✓ Correct!":"✗ Not quite"}</p>
              <p style={{ fontSize:12, color:"#9090aa", margin:0, lineHeight:1.65 }}>{q.exp}</p>
            </div>
            <button onClick={nextQ} style={{ width:"100%", background:"#8b5cf6", border:"none", borderRadius:15, padding:14, color:"#fff", fontSize:14, fontWeight:800, cursor:"pointer" }}>
              {qi<QUIZ_QUESTIONS.length-1 ? "Next Question →" : "See Results"}
            </button>
          </>
        )}
      </div>
    );
  };

  const TABS = [
    { id:"home",  Icon:Home,        label:"Home"   },
    { id:"tutor", Icon:MessageCircle,label:"Tutor" },
    { id:"audio", Icon:Headphones,  label:"Audio"  },
    { id:"notes", Icon:FileText,    label:"Notes"  },
    { id:"quiz",  Icon:Zap,         label:"Quiz"   },
  ];

  return (
    <div style={{ background:"#0d0d14", minHeight:"100vh", fontFamily:"'Nunito', sans-serif", color:"#fff", maxWidth:420, margin:"0 auto", position:"relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
        @keyframes dot { 0%,100%{opacity:.25;transform:scale(.8)} 50%{opacity:1;transform:scale(1.2)} }
        * { box-sizing:border-box; }
        ::-webkit-scrollbar { display:none; }
        button { font-family:'Nunito',sans-serif; }
        input, textarea { font-family:'Nunito',sans-serif; }
        textarea::placeholder, input::placeholder { color:#40405a; }
      `}</style>

      <div style={{ paddingTop:6 }}>
        {tab==="home"  && <Home />}
        {tab==="tutor" && <Tutor />}
        {tab==="audio" && <Audio />}
        {tab==="notes" && <Notes />}
        {tab==="quiz"  && <Quiz />}
      </div>

      {/* Bottom Nav */}
      <div style={{ position:"fixed", bottom:0, left:0, right:0, maxWidth:420, margin:"0 auto", background:"#10101c", borderTop:"1px solid #1a1a28", display:"flex", paddingBottom:12, paddingTop:6 }}>
        {TABS.map(({id,Icon,label}) => {
          const on = tab===id;
          return (
            <button key={id} onClick={()=>setTab(id)} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:3, background:"none", border:"none", cursor:"pointer", color: on?"#a78bfa":"#40405a", padding:"5px 0" }}>
              <Icon size={20} strokeWidth={on?2.5:1.8} />
              <span style={{ fontSize:10, fontWeight: on?800:500 }}>{label}</span>
              {on && <div style={{ width:18, height:2.5, borderRadius:2, background:"#8b5cf6", marginTop:1 }} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
