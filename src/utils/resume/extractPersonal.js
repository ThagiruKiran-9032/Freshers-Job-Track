/**
 * Personal Information Extractor
 */

const INDIAN_CITIES_AND_STATES = [
  // Tier 1 & Tech Hubs
  'Bengaluru', 'Bangalore', 'Hyderabad', 'Pune', 'Mumbai', 'Delhi', 'Gurugram', 'Gurgaon', 'Noida', 'Chennai', 'Kolkata', 'Ahmedabad', 'Kochi', 'Indore',
  // AP & Telangana
  'Tirupati', 'Vijayawada', 'Visakhapatnam', 'Vizag', 'Guntur', 'Warangal', 'Nellore', 'Kakinada', 'Rajahmundry', 'Anantapur', 'Kurnool', 'Kadapa', 'Eluru', 'Ongole', 'Secunderabad', 'Karimnagar',
  // Karnataka & TN
  'Mysuru', 'Mysore', 'Mangalore', 'Mandalay', 'Hubli', 'Dharwad', 'Belgaum', 'Coimbatore', 'Madurai', 'Trichy', 'Tiruchirappalli', 'Salem', 'Vellore', 'Erode', 'Tirunelveli',
  // MH, GJ & West
  'Nagpur', 'Nashik', 'Thane', 'Navi Mumbai', 'Aurangabad', 'Solapur', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Panaji', 'Goa',
  // North & Central
  'Jaipur', 'Chandigarh', 'Lucknow', 'Kanpur', 'Varanasi', 'Agra', 'Meerut', 'Ghaziabad', 'Dehradun', 'Faridabad', 'Bhopal', 'Gwalior', 'Jabalpur', 'Ujjain',
  // East & South
  'Patna', 'Ranchi', 'Bhubaneswar', 'Cuttack', 'Guwahati', 'Trivandrum', 'Thiruvananthapuram', 'Kozhikode', 'Thrissur', 'Kollam',
  // States
  'Andhra Pradesh', 'Telangana', 'Karnataka', 'Tamil Nadu', 'Maharashtra', 'Gujarat', 'Kerala', 'West Bengal', 'Uttar Pradesh', 'Rajasthan', 'Madhya Pradesh', 'Punjab', 'Haryana', 'Bihar', 'Odisha', 'Assam'
];

export function extractPersonal(rawText, headerSectionText) {
  const combined = `${headerSectionText}\n${rawText}`;
  const lines = combined.split('\n').map(l => l.trim()).filter(Boolean);

  // 1. Email Extraction
  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i;
  const emailMatch = combined.match(emailRegex);
  const email = emailMatch ? emailMatch[1] : '';

  // 2. Phone Extraction
  const phoneRegex = /(\+?\d{1,4}[-.\s]?)?\(?\d{2,5}\)?[-.\s]?\d{3,5}[-.\s]?\d{3,5}|\b[6-9]\d{9}\b/;
  const phoneMatch = combined.match(phoneRegex);
  const phone = phoneMatch ? phoneMatch[0] : '';

  // 3. URLs
  const linkedinRegex = /(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+/i;
  const githubRegex = /(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_-]+/i;
  const portfolioRegex = /(https?:\/\/[a-zA-Z0-9._-]+\.[a-zA-Z]{2,})/i;

  const linkedinMatch = combined.match(linkedinRegex);
  const githubMatch = combined.match(githubRegex);
  const portfolioMatch = combined.match(portfolioRegex);

  // 4. Name Extraction Heuristics
  let name = '';
  for (const line of lines.slice(0, 8)) {
    const cleanLine = line.replace(/[^a-zA-Z\s.]/g, '').trim();
    if (
      cleanLine &&
      !line.includes('@') &&
      !line.includes('http') &&
      !line.includes('www') &&
      !/resume|curriculum|vitae|cv|contact|profile|objective|summary|email|phone|address|education|location/i.test(line) &&
      cleanLine.length >= 3 &&
      cleanLine.length < 35 &&
      cleanLine.split(/\s+/).length <= 4
    ) {
      name = cleanLine;
      break;
    }
  }

  // 5. Location Detection Engine
  let location = '';

  // 5a. Check explicit label like "Location: Tirupati" or "Address: Tirupati, AP"
  const labelMatch = combined.match(/(?:Location|Address|City|Place|Native)[\s:]*([A-Za-z\s,.-]{3,40})/i);
  if (labelMatch) {
    const candidateLoc = labelMatch[1].split('\n')[0].replace(/[-_=|]+/g, '').trim();
    if (candidateLoc.length > 2 && candidateLoc.length < 35) {
      location = candidateLoc;
    }
  }

  // 5b. Match city or state from taxonomy dictionary
  if (!location) {
    for (const city of INDIAN_CITIES_AND_STATES) {
      if (new RegExp(`\\b${city.replace('.', '\\.')}\\b`, 'i').test(combined)) {
        location = city.includes('Andhra') || city.includes('Pradesh') || city.includes('Karnataka') || city.includes('Nadu') || city.includes('Maharashtra')
          ? `${city}, India`
          : `${city}, India`;
        break;
      }
    }
  }

  // 5c. Match Pincode line format (e.g. "Tirupati - 517501" or "Hyderabad, 500081")
  if (!location) {
    const pincodeMatch = combined.match(/([A-Z][a-zA-Z\s]{2,20})[\s,.-]+(\b\d{6}\b)/);
    if (pincodeMatch) {
      location = `${pincodeMatch[1].trim()}, India`;
    }
  }

  return {
    name: name || '',
    email: email || '',
    phone: phone || '',
    location: location || '',
    linkedin: linkedinMatch ? linkedinMatch[0] : '',
    github: githubMatch ? githubMatch[0] : '',
    portfolio: portfolioMatch && !portfolioMatch[0].includes('linkedin') && !portfolioMatch[0].includes('github') ? portfolioMatch[0] : ''
  };
}
