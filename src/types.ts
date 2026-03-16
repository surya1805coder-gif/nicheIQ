export type Niche = {
  id: number;
  name: string;
  category: string;
  description: string;
  opportunity_score: number;
  competition_score: number;
  trend_score: number;
  market_size_usd: number;
  audience_size: string;
  monetization_methods: string[];
  pros: string[];
  cons: string[];
  tags: string[];
  created_at: string;
};
