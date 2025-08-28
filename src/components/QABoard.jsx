import React from "react";

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function loadBoard(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : { questions: [] };
  } catch {
    return { questions: [] };
  }
}

function saveBoard(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export default function QABoard({ boardKey, title }) {
  const storageKey = `qa:${boardKey}`;
  const [data, setData] = React.useState(() => loadBoard(storageKey));
  const [qAuthor, setQAuthor] = React.useState("");
  const [qText, setQText] = React.useState("");

  React.useEffect(() => {
    saveBoard(storageKey, data);
  }, [data, storageKey]);

  const addQuestion = (e) => {
    e.preventDefault();
    if (!qText.trim()) return;
    const question = {
      id: uid(),
      author: qAuthor.trim() || "Anonymous",
      text: qText.trim(),
      createdAt: new Date().toISOString(),
      answers: []
    };
    setData((d) => ({ questions: [question, ...d.questions] }));
    setQAuthor("");
    setQText("");
  };

  const addAnswer = (qid, name, text, reset) => {
    if (!text.trim()) return;
    setData((d) => ({
      questions: d.questions.map((q) =>
        q.id === qid
          ? {
              ...q,
              answers: [
                ...q.answers,
                {
                  id: uid(),
                  author: name.trim() || "Anonymous",
                  text: text.trim(),
                  createdAt: new Date().toISOString()
                }
              ]
            }
          : q
      )
    }));
    reset();
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold">{title}</h2>
        <p className="mt-2 text-slate-600 text-sm">
          Post your question; anyone can answer. (Saved in your browser. For public hosting, consider a backend.)
        </p>
      </div>

      {/* Ask form */}
      <form onSubmit={addQuestion} className="mt-6 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4">
        <div className="grid sm:grid-cols-2 gap-3">
          <input
            className="rounded-xl border border-slate-300 px-4 py-2"
            placeholder="Your name (optional)"
            value={qAuthor}
            onChange={(e) => setQAuthor(e.target.value)}
          />
          <button className="rounded-xl px-4 py-2 bg-slate-900 text-white hover:bg-slate-800" type="submit">
            Ask Question
          </button>
        </div>
        <textarea
          className="rounded-xl border border-slate-300 px-4 py-2"
          rows={3}
          placeholder="Type your question..."
          value={qText}
          onChange={(e) => setQText(e.target.value)}
          required
        />
      </form>

      {/* Questions list */}
      <div className="mt-8 space-y-4">
        {data.questions.length === 0 ? (
          <div className="text-center text-slate-500">No questions yet. Be the first to ask!</div>
        ) : (
          data.questions.map((q) => <QuestionItem key={q.id} q={q} onAddAnswer={addAnswer} />)
        )}
      </div>
    </div>
  );
}

function dateFmt(iso) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return "";
  }
}

function QuestionItem({ q, onAddAnswer }) {
  const [name, setName] = React.useState("");
  const [text, setText] = React.useState("");

  const submit = (e) => {
    e.preventDefault();
    onAddAnswer(q.id, name, text, () => {
      setName("");
      setText("");
    });
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="font-semibold">{q.author}</div>
          <div className="text-slate-600 whitespace-pre-wrap">{q.text}</div>
        </div>
        <div className="text-xs text-slate-500">{dateFmt(q.createdAt)}</div>
      </div>

      {/* Answers */}
      <div className="mt-4 space-y-3">
        {q.answers.map((a) => (
          <div key={a.id} className="rounded-xl border border-slate-200 p-3 bg-slate-50">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm font-medium">{a.author}</div>
                <div className="text-slate-700 whitespace-pre-wrap text-sm">{a.text}</div>
              </div>
              <div className="text-[10px] text-slate-500">{dateFmt(a.createdAt)}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Answer form */}
      <form onSubmit={submit} className="mt-4 grid gap-2 sm:grid-cols-[1fr_auto] items-start">
        <input
          className="rounded-xl border border-slate-300 px-3 py-2"
          placeholder="Your name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button className="rounded-xl px-4 py-2 bg-slate-900 text-white hover:bg-slate-800" type="submit">
          Add Answer
        </button>
        <textarea
          className="rounded-xl border border-slate-300 px-3 py-2 sm:col-span-2"
          rows={3}
          placeholder="Write an answer..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />
      </form>
    </div>
  );
}
