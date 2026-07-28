// List of popular disposable/temporary email provider domains
const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com',
  'guerrillamail.com',
  '10minutemail.com',
  'tempmail.com',
  'trashmail.com',
  'yopmail.com',
  'dispostable.com',
  'sharklasers.com',
  'getnada.com',
  'temp-mail.org',
  'throwawaymail.com',
  'maildrop.cc',
  'fakeinbox.com',
  'mytemp.email',
  'crazymailing.com',
  'nada.ltd'
]);

/**
 * Checks if the honeypot field is filled.
 * Humans will leave hidden fields empty, while bots fill all inputs.
 */
const isHoneypotFilled = (reqBody = {}) => {
  if (!reqBody) return false;
  const honeypotVal = reqBody.website || reqBody.hp_field || reqBody.fax || reqBody.company_url;
  return typeof honeypotVal === 'string' && honeypotVal.trim().length > 0;
};

/**
 * Checks if the provided email domain is disposable or uses dot-stuffing tricks.
 */
const isDisposableEmail = (email = '') => {
  if (!email || typeof email !== 'string') return true;
  const normalized = email.trim().toLowerCase();
  const parts = normalized.split('@');
  if (parts.length !== 2) return true;

  const [localPart, domain] = parts;

  // Check against disposable domain list
  if (DISPOSABLE_DOMAINS.has(domain)) {
    return true;
  }

  // Detect artificial dot-stuffed local parts (e.g. ma.na.c.um.il.i.ya0.9)
  const dotCount = (localPart.match(/\./g) || []).length;
  if (dotCount >= 4 || (dotCount >= 3 && localPart.length / dotCount < 4)) {
    return true;
  }

  return false;
};

/**
 * Validates full name format.
 * Rejects random gibberish strings and non-human names.
 */
const isValidName = (name = '') => {
  if (!name || typeof name !== 'string') return false;
  const trimmed = name.trim();

  // Name length boundary
  if (trimmed.length < 2 || trimmed.length > 50) return false;

  // Only letters, spaces, dots, hyphens, and apostrophes allowed
  const nameRegex = /^[A-Za-z\s.'-]{2,50}$/;
  if (!nameRegex.test(trimmed)) return false;

  // Gibberish check: name must contain at least one vowel
  const hasVowels = /[aeiouAEIOU]/.test(trimmed);
  if (!hasVowels) return false;

  // Single word without spaces that has weird camel/random casing (e.g. EToLCMWITUlEyUEoxI)
  if (!trimmed.includes(' ') && /[a-z][A-Z][a-z][A-Z]/.test(trimmed)) {
    return false;
  }

  return true;
};

/**
 * Validates email structure.
 */
const isValidEmail = (email = '') => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim()) && !isDisposableEmail(email);
};

/**
 * Validates message content for minimum length, word count, and gibberish detection.
 */
const isValidMessageQuality = (message = '') => {
  if (!message || typeof message !== 'string') return false;
  const trimmed = message.trim();

  // Minimum length check (15 chars)
  if (trimmed.length < 15) return false;

  // Minimum word count check (at least 3 words)
  const words = trimmed.split(/\s+/).filter(w => w.length > 0);
  if (words.length < 3 && trimmed.length < 30) {
    return false;
  }

  // Detect single-token random strings without spaces (e.g. "VBOXmNNSydwXZbdPHSCj")
  if (words.length === 1 && trimmed.length >= 15) {
    return false;
  }

  // Vowel ratio check for gibberish (English words generally have 20-50% vowels)
  const lettersOnly = trimmed.replace(/[^a-zA-Z]/g, '');
  if (lettersOnly.length >= 12) {
    const vowelCount = (lettersOnly.match(/[aeiouAEIOU]/g) || []).length;
    const vowelRatio = vowelCount / lettersOnly.length;
    // Extremely low vowel count (<10%) or zero vowels indicates random string spam
    if (vowelRatio < 0.10) {
      return false;
    }
  }

  return true;
};

module.exports = {
  isHoneypotFilled,
  isDisposableEmail,
  isValidName,
  isValidEmail,
  isValidMessageQuality
};
