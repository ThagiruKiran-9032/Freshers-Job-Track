/**
 * Extract Contact Information (Name, Email, Phone, Location, LinkedIn, GitHub, Portfolio)
 * Dynamically parses contact metadata strictly from the actual uploaded resume text.
 */
export function extractContact(text = '', embeddedLinks = []) {
  if (!text && (!embeddedLinks || embeddedLinks.length === 0)) {
    return {
      name: '',
      email: '',
      phone: '',
      linkedin: '',
      github: '',
      portfolio: '',
      location: ''
    };
  }

  // 1. Candidate Name Extraction (Generic Heuristics)
  let name = '';
  const first300 = text.substring(0, 300).trim();
  const headerLines = first300.split('\n').map(l => l.trim()).filter(Boolean);

  // Blacklisted words that should not be extracted as names
  const nonNamePattern = /^(?:resume|curriculum\s+vitae|cv|profile|contact|email|phone|address|software|developer|engineer|full\s+stack|frontend|backend|data\s+scientist|analyst|summary|objective|education|skills|experience|projects)/i;

  for (const rawLine of headerLines) {
    const line = rawLine.split(/[\:\|\–\-]/)[0].trim();
    if (!line) continue;
    if (nonNamePattern.test(line)) continue;
    if (line.includes('@') || line.includes('http') || line.includes('www.') || /\d/.test(line)) continue;

    // Matches Title Case Names (1 to 4 words, 3 to 40 chars)
    const nameMatch = line.match(/^([A-Z][a-zA-Z\.\'-]+(?:\s+[A-Z][a-zA-Z\.\'-]+){0,3})$/);
    if (nameMatch && nameMatch[1].length >= 3 && nameMatch[1].length <= 40) {
      name = nameMatch[1].trim();
      break;
    }

    // Matches All-Caps Names (1 to 4 words, 3 to 40 chars)
    const capsMatch = line.match(/^([A-Z]{2,}(?:\s+[A-Z]{2,}){0,3})$/);
    if (capsMatch && capsMatch[1].length >= 3 && capsMatch[1].length <= 40) {
      name = capsMatch[1].trim();
      break;
    }
  }

  // Helper to pick candidate's primary link for a category from embedded links
  const getPrimaryLink = (category) => {
    const categoryLinks = (embeddedLinks || []).filter(l => {
      if (!l || !l.url) return false;
      if (category === 'LinkedIn') return l.url.includes('linkedin.com');
      if (category === 'GitHub') return l.url.includes('github.com');
      if (category === 'Email') return l.url.startsWith('mailto:');
      return false;
    });

    if (categoryLinks.length === 0) return '';
    if (categoryLinks.length === 1) return categoryLinks[0].url;

    if (!name) return categoryLinks[0].url;

    const nameTokens = name.toLowerCase().split(/\s+/).filter(t => t.length > 2);
    let bestLink = categoryLinks[0].url;
    let bestScore = -1;

    categoryLinks.forEach(link => {
      const urlLower = link.url.toLowerCase();
      let score = 0;
      nameTokens.forEach(token => {
        if (urlLower.includes(token)) score += 10;
      });
      if (score > bestScore) {
        bestScore = score;
        bestLink = link.url;
      }
    });

    return bestLink;
  };

  // 2. Email Extraction
  let email = getPrimaryLink('Email').replace(/^mailto:/i, '').trim();
  if (!email) {
    const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i;
    const emailMatch = text.match(emailRegex);
    email = emailMatch ? emailMatch[1].trim() : '';
  }

  // 3. Phone Extraction (Generic International & Regional Formats)
  const phoneRegex = /(?:\+?\d{1,3}[\s.-]?)?\(?\d{3,5}\)?[\s.-]?\d{3,5}[\s.-]?\d{3,5}/;
  const phoneMatch = text.match(phoneRegex);
  let phone = phoneMatch ? phoneMatch[0].trim() : '';
  if (phone.replace(/\D/g, '').length < 10) phone = '';

  // 4. LinkedIn URL Extraction
  let linkedin = getPrimaryLink('LinkedIn');
  if (!linkedin) {
    const linkedinRegex = /(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?/i;
    const linkedinMatch = text.match(linkedinRegex);
    linkedin = linkedinMatch ? linkedinMatch[0] : '';
  }

  // 5. GitHub URL Extraction
  let github = getPrimaryLink('GitHub');
  if (!github) {
    const githubRegex = /(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_-]+\/?/i;
    const githubMatch = text.match(githubRegex);
    github = githubMatch ? githubMatch[0] : '';
  }

  // 6. Portfolio / Website URL Extraction
  let portfolio = '';
  const portfolioEmbedded = (embeddedLinks || []).find(l => l && l.url && !l.url.includes('linkedin.com') && !l.url.includes('github.com') && !l.url.startsWith('mailto:'));
  if (portfolioEmbedded) {
    portfolio = portfolioEmbedded.url;
  } else {
    const urlRegex = /(https?:\/\/[^\s]+)/gi;
    const allUrls = text.match(urlRegex) || [];
    portfolio = allUrls.find(u => !u.includes('linkedin.com') && !u.includes('github.com')) || '';
  }

  // 7. Location Extraction (Generic pattern matching e.g. "City, State", "Location: City")
  let location = '';
  const locationLabeledMatch = text.match(/(?:location|address|based\s+in|city)\s*:\s*([A-Za-z\s,-]+)/i);
  if (locationLabeledMatch) {
    location = locationLabeledMatch[1].split('\n')[0].trim();
  } else {
    const locationRegex = /([A-Z][a-zA-Z\s]+,\s*[A-Z][a-zA-Z\s]+(?:\s*-\s*\d{6})?)/;
    const locMatch = text.match(locationRegex);
    if (locMatch) {
      let locStr = locMatch[1].trim();
      if (name && locStr.startsWith(name)) {
        locStr = locStr.replace(name, '').trim();
      }
      location = locStr;
    }
  }

  return {
    name,
    email,
    phone,
    linkedin,
    github,
    portfolio,
    location
  };
}

/**
 * Deduplicate extracted document links list for UI presentation
 */
export function deduplicateLinks(links = [], candidateName = '') {
  if (!links || links.length === 0) return [];

  const uniqueLinks = [];
  const categories = ['Email', 'LinkedIn', 'GitHub'];

  const nameTokens = candidateName ? candidateName.toLowerCase().split(/\s+/).filter(t => t.length > 2) : [];

  categories.forEach(cat => {
    const categoryLinks = links.filter(l => {
      if (!l || !l.url) return false;
      if (cat === 'LinkedIn') return l.url.includes('linkedin.com');
      if (cat === 'GitHub') return l.url.includes('github.com');
      if (cat === 'Email') return l.url.startsWith('mailto:');
      return false;
    });

    if (categoryLinks.length > 0) {
      let bestLink = categoryLinks[0];
      let bestScore = -1;

      categoryLinks.forEach(link => {
        const urlLower = link.url.toLowerCase();
        let score = 0;
        nameTokens.forEach(token => {
          if (urlLower.includes(token)) score += 10;
        });
        if (score > bestScore) {
          bestScore = score;
          bestLink = link;
        }
      });

      uniqueLinks.push({
        ...bestLink,
        label: cat
      });
    }
  });

  links.forEach(l => {
    if (l && l.url && !l.url.includes('linkedin.com') && !l.url.includes('github.com') && !l.url.startsWith('mailto:')) {
      if (!uniqueLinks.some(ul => ul.url === l.url)) {
        uniqueLinks.push(l);
      }
    }
  });

  return uniqueLinks;
}
