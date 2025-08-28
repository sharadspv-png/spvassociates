import React from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function Admin() {
  const [secret, setSecret] = React.useState(localStorage.getItem("admin:secret") || "");
  const [loading, setLoading] = React.useState(false);
  const [items, setItems] = React.useState([]);
  const [err, setErr] = React.useState("");

  function saveSecret(e){
    e.preventDefault();
    localStorage.setItem("admin:secret", secret);
    load();
  }

  async function load(){
    setLoading(true);
    setErr("");
    try {
      // Load flagged questions and answers (basic, can be optimized)
      const { data: q } = await supabase.from("questions").select("id, author, content, created_at").order("created_at",{ascending:false});
      const { data: a } = await supabase.from("answers").select("id, question_id, author, content, created_at").order("created_at",{ascending:false});
      const { data: f } = await supabase.from("flags").select("kind, target_id, reason");
      const fc = (f||[]).reduce((m, r)=>{ const k=r.kind+":"+r.target_id; m[k]=(m[k]||0)+1; return m; }, {});

      const questions = (q||[]).filter(row => (fc["question:"+row.id]||0) > 0)
        .map(row => ({ type:"question", id: row.id, text: row.content, author: row.author, flags: fc["question:"+row.id]||0, created_at: row.created_at }));
      const answers = (a||[]).filter(row => (fc["answer:"+row.id]||0) > 0)
        .map(row => ({ type:"answer", id: row.id, text: row.content, author: row.author, flags: fc["answer:"+row.id]||0, created_at: row.created_at }));

      setItems([...questions, ...answers].sort((x,y)=> (y.flags - x.flags)));
    } catch (e) {
      setErr(String(e));
    }
    setLoading(false);
  }

  React.useEffect(()=>{ load(); },[]);

  async function act(action, id, kind){
    try{
      const res = await fetch("/api/moderate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, id, kind, secret })
      });
      if(!res.ok){
        const t = await res.text();
        alert("Error: " + t);
        return;
      }
      await load();
    }catch(e){
      alert("Error: " + e.message);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold">Admin Panel</h1>
          <Link to="/" className="text-sm underline">← Back to site</Link>
        </div>

        <form onSubmit={saveSecret} className="mt-4 flex items-center gap-3">
          <input value={secret} onChange={e=>setSecret(e.target.value)} className="rounded-xl border border-slate-300 px-3 py-2 w-64" placeholder="Admin passcode" />
          <button className="rounded-xl px-4 py-2 bg-slate-900 text-white">Save</button>
          <button type="button" onClick={load} className="rounded-xl px-4 py-2 border">Refresh</button>
        </form>

        {err && <div className="mt-4 text-red-600 text-sm">{err}</div>}

        <div className="mt-6">
          {loading ? (
            <div className="text-slate-600">Loading flagged items…</div>
          ) : items.length === 0 ? (
            <div className="text-slate-500">No flagged items 🎉</div>
          ) : (
            <div className="grid gap-3">
              {items.map((it) => (
                <div key={it.type+it.id} className="rounded-2xl border bg-white p-4">
                  <div className="text-xs text-slate-500">{it.type.toUpperCase()} • Flags: {it.flags}</div>
                  <div className="mt-1 font-semibold">{it.author || "Anonymous"}</div>
                  <div className="text-slate-700 whitespace-pre-wrap">{it.text}</div>
                  <div className="mt-3 flex gap-2">
                    <button onClick={()=>act("hide", it.id, it.type)} className="rounded-xl px-3 py-1 bg-amber-500 text-white">Hide</button>
                    <button onClick={()=>act("unhide", it.id, it.type)} className="rounded-xl px-3 py-1 border">Unhide</button>
                    <button onClick={()=>act("delete", it.id, it.type)} className="rounded-xl px-3 py-1 bg-red-600 text-white">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
