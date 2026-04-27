const SEC_KEY = "DAVE_PARTNER_2024";

/** Encrypts/Decrypts string using simple XOR with SEC_KEY */
export function xorCipher(text) {
  return text.split('').map((char, i) => 
    String.fromCharCode(char.charCodeAt(0) ^ SEC_KEY.charCodeAt(i % SEC_KEY.length))
  ).join('');
}

/** Generates a SECURE obfuscated security string for the QR code */
export function generateSecurityCode(staffId, templateId, data) {
  const ts = new Date().toISOString();
  const empName = data.employeeName || 'UNKNOWN';
  
  // Find ALL fields related to money (salary, pay, bonus, compensation, wage, allowance, base, etc.)
  const moneyFields = Object.keys(data).filter(key => 
    /salary|pay|bonus|comp|wage|income|allowance|base/i.test(key) && data[key]
  ).map(key => `${key}:${data[key]}`).join('; ');
  
  const moneyInfo = moneyFields || 'N/A';
  
  // Payload: StaffId|Template|Name|MoneyInfo|ISO_Time
  const raw = `DAVE|${staffId}|${templateId}|${empName}|${moneyInfo}|${ts}`;
  try {
    // XOR Encryption -> Base64
    return btoa(unescape(encodeURIComponent(xorCipher(raw))));
  } catch(e) {
    return 'SEC-ERR-INVALID-DATA';
  }
}

/** Decodes the obfuscated security string back to readable info */
export function decodeSecurityCode(code) {
  try {
    // Base64 -> XOR Decryption
    const decrypted = xorCipher(decodeURIComponent(escape(atob(code))));
    const parts = decrypted.split('|');
    if (parts[0] !== 'DAVE') throw new Error('Invalid Signature');
    return {
      staffId: parts[1],
      templateId: parts[2],
      employeeName: parts[3],
      salary: parts[4],
      time: parts[5]
    };
  } catch(e) {
    return null;
  }
}
