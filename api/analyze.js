import supabase from './_supabase.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('niches')
        .select('category, opportunity_score, competition_score, trend_score, market_size_usd');
      if (error) throw error;

      const categories = {};
      data.forEach(n => {
        if (!categories[n.category]) {
          categories[n.category] = { count: 0, totalOpportunity: 0, totalCompetition: 0, totalTrend: 0, totalMarket: 0 };
        }
        categories[n.category].count++;
        categories[n.category].totalOpportunity += n.opportunity_score;
        categories[n.category].totalCompetition += n.competition_score;
        categories[n.category].totalTrend += n.trend_score;
        categories[n.category].totalMarket += n.market_size_usd;
      });

      const summary = Object.entries(categories).map(([cat, vals]) => ({
        category: cat,
        count: vals.count,
        avgOpportunity: Math.round(vals.totalOpportunity / vals.count),
        avgCompetition: Math.round(vals.totalCompetition / vals.count),
        avgTrend: Math.round(vals.totalTrend / vals.count),
        totalMarket: vals.totalMarket
      }));

      return res.status(200).json({ summary, total: data.length });
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: err.message });
  }
}
