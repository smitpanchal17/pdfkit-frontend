// ─────────────────────────────────────────────────────────────────────────────
// lib/pricing.ts — Geo-aware pricing config
// ─────────────────────────────────────────────────────────────────────────────

export interface PricingPlan {
  currency: string;
  symbol: string;
  pro: number; proAnnual: number;
  proPlus: number; proPlusAnnual: number;
  business: number; businessAnnual: number;
}

export const PRICING: Record<string, PricingPlan> = {
  IN:      { currency:'₹',  symbol:'INR', pro:249,   proPlus:399,   business:799,   proAnnual:1999,  proPlusAnnual:3199,  businessAnnual:6399 },
  US:      { currency:'$',  symbol:'USD', pro:5.99,  proPlus:8.99,  business:15.99, proAnnual:59,    proPlusAnnual:79,    businessAnnual:149  },
  GB:      { currency:'£',  symbol:'GBP', pro:4.99,  proPlus:7.99,  business:13.99, proAnnual:49,    proPlusAnnual:69,    businessAnnual:129  },
  AU:      { currency:'$',  symbol:'AUD', pro:8.99,  proPlus:13.99, business:23.99, proAnnual:89,    proPlusAnnual:119,   businessAnnual:219  },
  JP:      { currency:'¥',  symbol:'JPY', pro:899,   proPlus:1399,  business:2399,  proAnnual:8900,  proPlusAnnual:13900, businessAnnual:23900},
  CA:      { currency:'$',  symbol:'CAD', pro:7.99,  proPlus:11.99, business:20.99, proAnnual:79,    proPlusAnnual:109,   businessAnnual:199  },
  EU:      { currency:'€',  symbol:'EUR', pro:5.99,  proPlus:8.99,  business:15.99, proAnnual:59,    proPlusAnnual:79,    businessAnnual:149  },
  DEFAULT: { currency:'₹',  symbol:'INR', pro:249,   proPlus:399,   business:799,   proAnnual:1999,  proPlusAnnual:3199,  businessAnnual:6399 },
};

export const EU_COUNTRIES = ['DE','FR','ES','IT','NL','BE','AT','PT','FI','SE','DK','NO','PL','CZ','HU'];

export function getPricingForCountry(countryCode: string): PricingPlan {
  if (PRICING[countryCode]) return PRICING[countryCode];
  if (EU_COUNTRIES.includes(countryCode)) return PRICING.EU;
  return PRICING.DEFAULT;
}
