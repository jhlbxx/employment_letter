import { CURRENCY_FIELDS, UNIT_FIELDS, UNIT_TRANSLATIONS } from '../constants/uiStrings';

/** Formats a number string with commas and 2 decimal places for the final letter */
export function formatToCurrency(val) {
  if (val === undefined || val === null || val === '') return '';
  const cleanVal = val.toString().replace(/[^-0-9.]/g, '');
  const num = parseFloat(cleanVal);
  if (isNaN(num)) return val;
  return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/** Removes illegal characters from filenames */
export function sanitizeFilename(name) {
  if (!name) return 'document';
  return name.replace(/[\\/:*?"<>|]/g, '_').trim();
}

/** Formats a number string with commas only for display in the input field */
export function formatForInput(val) {
  if (!val) return '';
  const parts = val.toString().replace(/,/g, '').split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}

/** For sidebar display: 'dual' maps to 'zh', otherwise use the lang itself */
export const sidebarLang = (lang) => (lang === 'dual' ? 'zh' : lang);

/** Replace {{key}} vars and {{#key}}...{{/key}} conditional blocks, then clean up leftovers */
export function renderTemplate(content, data = {}, lang, uiLang) {
  if (!content) return '';
  let out = content;

  // Find all keys used in the template
  const sectionMatches = content.match(/{{#(\w+)}}/g) || [];
  const varMatches = content.match(/{{(\w+)}}/g) || [];
  const allKeys = [...new Set([
    ...sectionMatches.map(m => m.replace(/{{#|}}/g, '')),
    ...varMatches.map(m => m.replace(/{{|}}/g, ''))
  ])];

  allKeys.forEach((key) => {
    let val = '';
    const valZh = data[key + '_zh'];
    const valEn = data[key + '_en'];

    // Smart retrieval based on letter language
    if (valZh || valEn) {
      if (lang === 'zh') val = valZh || data[key] || '';
      else if (lang === 'en') val = valEn || data[key] || '';
      else val = valEn && valZh ? `${valEn} (${valZh})` : (valEn || valZh || data[key] || '');
    } else {
      val = data[key] || '';
    }

    // Formatting: Currency
    if (val && CURRENCY_FIELDS.includes(key)) {
      val = formatToCurrency(val);
    }

    // Formatting: Units (Notice Period)
    if (UNIT_FIELDS.includes(key)) {
      const num = data[key + '_num'] || '';
      const unitKey = data[key + '_unit'] || 'day';
      if (num) {
        const unitLabel = UNIT_TRANSLATIONS[lang] ? UNIT_TRANSLATIONS[lang][unitKey] : UNIT_TRANSLATIONS['en'][unitKey];
        val = num + ' ' + unitLabel;
      }
    }

    // Process section {{#key}}
    const sectionRegex = new RegExp(`{{#${key}}}([\\s\\S]*?){{/${key}}}`, 'g');
    if (val) {
      out = out.replace(sectionRegex, '$1');
    } else {
      out = out.replace(sectionRegex, '');
    }

    // Process placeholder {{key}}
    const placeholder = val !== '' ? val : `<span style="color:#aaa">[ ${key} ]</span>`;
    out = out.split('{{' + key + '}}').join(placeholder);
  });

  out = out.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
  return out;
}
