// HIPAA Data Masking and Client-Side Demonstration Encryption
export function maskSensitiveValue(value: string, visibleChars = 4): string {
  if (!value) return '';
  if (value.length <= visibleChars) return '••••';
  const prefix = value.slice(0, 2);
  const suffix = value.slice(-visibleChars);
  return `${prefix}${'•'.repeat(Math.max(4, value.length - (2 + visibleChars)))}${suffix}`;
}

export function maskPhoneNumber(phone: string): string {
  if (!phone) return '';
  // e.g. +91 98250 12345 -> +91 ••••• ••345
  const parts = phone.split(' ');
  if (parts.length >= 2) {
    return `${parts[0]} ••••• ••${parts[parts.length - 1].slice(-3)}`;
  }
  return maskSensitiveValue(phone, 3);
}

export function maskMRN(mrn: string): string {
  // e.g. MRN-7849201 -> MRN-•••9201
  return mrn.replace(/\d{3}(?=\d{4})/, '•••');
}
