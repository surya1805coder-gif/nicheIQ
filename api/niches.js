import supabase from './_supabase.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { category, search, sort } = req.query;
      let query = supabase.from('niches').select('*');
      if (category && category !== 'all') query = query.eq('category', category);
      if (search) query = query.ilike('name', `%${search}%`);
      if (sort === 'competition_asc') query = query.order('competition_score', { ascending: true });
      else if (sort === 'competition_desc') query = query.order('competition_score', { ascending: false });
      else if (sort === 'opportunity_desc') query = query.order('opportunity_score', { ascending: false });
      else if (sort === 'trend_desc') query = query.order('trend_score', { ascending: false });
      else query = query.order('id', { ascending: true });
      const { data, error } = await query;
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'POST') {
      const body = req.body;
      const { data, error } = await supabase
        .from('niches')
        .insert(body)
        .select()
        .single();
      if (error) throw error;
      return res.status(201).json(data);
    }
    if (req.method === 'PUT') {
      const { id, ...updates } = req.body;
      const { data, error } = await supabase
        .from('niches')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'DELETE') {
      const { id } = req.body;
      const { error } = await supabase.from('niches').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: err.message });
  }
}
