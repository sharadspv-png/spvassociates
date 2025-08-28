import React from 'react';
import { supabase } from '../lib/supabase';

function cooldownKey(board, type){return `qa:cd:${board}:${type}`}
function tooSoon(board,type,seconds=30){
  try{const t=parseInt(localStorage.getItem(cooldownKey(board,type))||'0',10);return Date.now()<t;}catch{return false;}
}
function setCooldown(board,type,seconds=30){
  try{localStorage.setItem(cooldownKey(board,type), String(Date.now()+seconds*1000));}catch{}
}
function spammy(text){
  const t=(text||'').toLowerCase();
  if (t.length<12) return 'Message is too short.';
  if ((t.match(/https?:\/\//g)||[]).length>1) return 'Too many links.';
  if (/(.)\1{6,}/.test(t)) return 'Please avoid repeated characters.';
  const banned=['viagra','casino','loan approval','xxx'];
  if (banned.some(b=>t.includes(b))) return 'Contains disallowed words.';
  return null;
}
function fmt(d) {
  try { return new Date(d).toLocaleString(); } catch { return ''; }
}

export default function CloudQABoard({ boardKey, title }) {
  const [questions, setQuestions] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [qName, setQName] = React.useState('');
  const [qText, setQText] = React.useState('');

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from('questions')
      .select('id, author, content, created_at, is_hidden, answers(id, author, content, created_at, is_hidden)')
      .eq('board', boardKey)
      .order('created_at', { ascending: false });
    if (!error) { setCooldown(boardKey,'q');

    // Fetch flags count for questions
    const { data: qflags } = await supabase.from('flags').select('target_id').eq('kind','question');
    const { data: aflags } = await supabase.from('flags').select('target_id').eq('kind','answer');
    const qCount = (qflags||[]).reduce((m, r)=>{m[r.target_id]=(m[r.target_id]||0)+1; return m;}, {});
    const aCount = (aflags||[]).reduce((m, r)=>{m[r.target_id]=(m[r.target_id]||0)+1; return m;}, {});
    setQuestions((data||[]).map(q=>({ 
      ...q, 
      flagCount: qCount[q.id]||0, 
      answers: (q.answers||[]).map(a=>({ ...a, flagCount: aCount[a.id]||0 }))
    })));

}
    setLoading(false);
  }

  
  async function flagQuestion(qid, reason='inappropriate'){
    await supabase.from('flags').insert({kind:'question', target_id: qid, reason});
    load();
  }
  async function flagAnswer(aid, reason='inappropriate'){
    await supabase.from('flags').insert({kind:'answer', target_id: aid, reason});
    load();
  }

  React.useEffect(() => {
    load();
    // Realtime channel for inserts
    const channel = supabase.channel('qa-' + boardKey)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'questions', filter: `board=eq.${boardKey}` }, payload => {
        setQuestions(prev => [ { ...payload.new, answers: [] }, ...prev ]);
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'answers' }, payload => {
        setQuestions(prev => prev.map(q => q.id === payload.new.question_id ? { ...q, answers: [ ...(q.answers||[]), payload.new ] } : q));
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [boardKey]);

  async function addQuestion(e) {
    e.preventDefault();
    if (!qText.trim()) return;
    const s=spammy(qText); if(s){ alert(s); return; }
    if(tooSoon(boardKey,'q')){ alert('Please wait a bit before posting again.'); return; }
    const { error } = await supabase.from('questions').insert({
      board: boardKey,
      author: qName.trim() || 'Anonymous',
      content: qText.trim()
    });
    if (!error) { setCooldown(boardKey,'q');
      setQName(''); setQText('');
      // load(); // realtime will push new row, so no need
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold">{title}</h2>
        <p className="mt-2 text-slate-600 text-sm">
          Public Q&A — powered by Supabase. Be respectful; content is visible to everyone.
        </p>
      </div>

      <form onSubmit={addQuestion} className="mt-6 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4">
        <div className="grid sm:grid-cols-2 gap-3">
          <input className="rounded-xl border border-slate-300 px-4 py-2" placeholder="Your name (optional)" value={qName} onChange={e=>setQName(e.target.value)} />
          <button className="rounded-xl px-4 py-2 bg-slate-900 text-white hover:bg-slate-800" type="submit">Ask Question</button>
        </div>
        <textarea className="rounded-xl border border-slate-300 px-4 py-2" rows={3} placeholder="Type your question..." value={qText} onChange={e=>setQText(e.target.value)} required />
      </form>

      <div className="mt-8 space-y-4">
        {loading ? (
          <div className="text-center text-slate-500">Loading…</div>
        ) : questions.length === 0 ? (
          <div className="text-center text-slate-500">No questions yet. Be the first to ask!</div>
        ) : (
          questions.filter(q => !q.is_hidden && (q.flagCount||0) < 3).map(q => <Question key={q.id} q={q} onFlag={flagQuestion} />)
        )}
      </div>
    </div>
  );
}

function Question({ q, onFlag }) {
  const [name, setName] = React.useState('');
  const [text, setText] = React.useState('');
  const [posting, setPosting] = React.useState(false);

  async function addAnswer(e) {
    e.preventDefault();
    if (!text.trim()) return;
    const s=spammy(text); if(s){ alert(s); return; }
    if(tooSoon(''+(q.id||'') ,'a')){ alert('Please wait a bit before posting again.'); return; }
    setPosting(true);
    await supabase.from('answers').insert({
      question_id: q.id,
      author: name.trim() || 'Anonymous',
      content: text.trim()
    });
    setName(''); setText('');
    setPosting(false);
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="font-semibold">{q.author}</div>
          <div className="text-slate-600 whitespace-pre-wrap">{q.content}</div>
        </div>
        <div className="text-xs text-slate-500">{fmt(q.created_at)}</div>
      </div>
      <div className="text-xs text-slate-500">Flags: {q.flagCount||0}</div>
      <button onClick={()=>onFlag(q.id)} className="mt-2 text-xs underline">Flag</button>

      <div className="mt-4 space-y-3">
        {(q.answers || []).filter(a => !a.is_hidden && (a.flagCount||0) < 3).map(a => (
          <div key={a.id} className="rounded-xl border border-slate-200 p-3 bg-slate-50">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm font-medium">{a.author}</div>
                <div className="text-slate-700 whitespace-pre-wrap text-sm">{a.content}</div>
              </div>
              <div className="text-[10px] text-slate-500">{fmt(a.created_at)}</div>
            </div>
            <div className="text-[10px] text-slate-500">Flags: {a.flagCount||0}</div>
            <button onClick={()=>flagAnswer(a.id)} className="mt-1 text-[11px] underline">Flag</button>
          </div>
        ))}
      </div>

      <form onSubmit={addAnswer} className="mt-4 grid gap-2 sm:grid-cols-[1fr_auto] items-start">
        <input className="rounded-xl border border-slate-300 px-3 py-2" placeholder="Your name (optional)" value={name} onChange={e=>setName(e.target.value)} />
        <button disabled={posting} className="rounded-xl px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-60" type="submit">
          {posting ? 'Posting…' : 'Add Answer'}
        </button>
        <textarea className="rounded-xl border border-slate-300 px-3 py-2 sm:col-span-2" rows={3} placeholder="Write an answer..." value={text} onChange={e=>setText(e.target.value)} required />
      </form>
    </div>
  );
}
