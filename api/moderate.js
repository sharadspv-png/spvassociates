// Vercel Serverless Function for moderation
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  try {
    const { action, id, kind, secret } = req.body || {};
    const adminSecret = process.env.ADMIN_SECRET;
    const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!secret || secret !== adminSecret) {
      return res.status(401).send('Invalid admin secret');
    }
    if (!url || !serviceKey) {
      return res.status(500).send('Supabase env not configured');
    }
    if (!id || !kind || !['question','answer'].includes(kind)) {
      return res.status(400).send('Invalid request');
    }

    const supabase = createClient(url, serviceKey);

    if (action === 'hide') {
      const table = kind === 'question' ? 'questions' : 'answers';
      const { error } = await supabase.from(table).update({ is_hidden: true }).eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }
    if (action === 'unhide') {
      const table = kind === 'question' ? 'questions' : 'answers';
      const { error } = await supabase.from(table).update({ is_hidden: false }).eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }
    if (action === 'delete') {
      const table = kind === 'question' ? 'questions' : 'answers';
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }

    return res.status(400).send('Unknown action');
  } catch (e) {
    return res.status(500).send(e.message || 'Server error');
  }
}
