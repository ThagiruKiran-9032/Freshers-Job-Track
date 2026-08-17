/**
 * Company Logo Resolver & Deterministic Fallback Generator
 * Resolves company logo URLs and provides deterministic avatar colors/initials when missing or failed.
 */

// Known brand logos mapping (Clean SVG/PNG logos from reliable public CDN / Unsplash brand assets)
const KNOWN_COMPANY_LOGOS = {
  sophos: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=150',
  microsoft: 'https://images.unsplash.com/photo-1642132652075-2b87208b06b0?auto=format&fit=crop&q=80&w=150',
  google: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?auto=format&fit=crop&q=80&w=150',
  amazon: 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?auto=format&fit=crop&q=80&w=150',
  zoho: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=150'
};

const AVATAR_PALETTES = [
  { bg: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: '#ffffff' },
  { bg: 'linear-gradient(135deg, #10b981, #059669)', color: '#ffffff' },
  { bg: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#ffffff' },
  { bg: 'linear-gradient(135deg, #ec4899, #db2777)', color: '#ffffff' },
  { bg: 'linear-gradient(135deg, #06b6d4, #0891b2)', color: '#ffffff' },
  { bg: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', color: '#ffffff' },
  { bg: 'linear-gradient(135deg, #3b82f6, #2563eb)', color: '#ffffff' }
];

/**
 * Generate 1 to 2 letter initials from company name
 */
export function getCompanyInitials(companyName) {
  if (!companyName || typeof companyName !== 'string') return 'C';
  
  const clean = companyName.trim().replace(/[^a-zA-Z0-9\s]/g, '');
  const words = clean.split(/\s+/).filter(Boolean);

  if (words.length === 0) return 'C';
  if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
  
  return (words[0][0] + words[1][0]).toUpperCase();
}

/**
 * Deterministic color palette selector based on company name hash
 */
export function getCompanyColorStyle(companyName) {
  if (!companyName) return AVATAR_PALETTES[0];

  let hash = 0;
  for (let i = 0; i < companyName.length; i++) {
    hash = companyName.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash) % AVATAR_PALETTES.length;
  return AVATAR_PALETTES[index];
}

/**
 * Resolve Company Logo URL or return null if fallback needed
 */
export function resolveCompanyLogoUrl(companyName, providedUrl) {
  if (providedUrl && typeof providedUrl === 'string' && providedUrl.trim().startsWith('http') && !providedUrl.includes('unsplash.com/photo-1618005182384')) {
    return providedUrl.trim();
  }

  if (companyName) {
    const key = companyName.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (KNOWN_COMPANY_LOGOS[key]) {
      return KNOWN_COMPANY_LOGOS[key];
    }
  }

  return null;
}
