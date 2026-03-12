const fs = require('fs');
const h = fs.readFileSync('public/index.html', 'utf8');
const j = fs.readFileSync('public/scripts/main.js', 'utf8');

// Check for mismatched braces in JS (very rough)
let braces = 0;
for (const ch of j) { if (ch === '{') braces++; else if (ch === '}') braces--; }
console.log('JS brace balance (should be 0):', braces);

// Check JS for any syntax that might throw early
const lines = j.split('\n');
console.log('JS total lines:', lines.length);

// Find line number of timelineTabs.forEach
const tlLine = lines.findIndex(l => l.includes('timelineTabs.forEach'));
console.log('timelineTabs.forEach at JS line:', tlLine + 1);

// Find line number of workTabs.forEach
const wtLine = lines.findIndex(l => l.includes('workTabs.forEach'));
console.log('workTabs.forEach at JS line:', wtLine + 1);

// Check for unclosed template literals or strings (rough heuristic - backtick count)
const btCount = (j.match(/`/g) || []).length;
console.log('Backtick count (should be even):', btCount, btCount % 2 === 0 ? 'OK' : 'UNEVEN');

// Verify aria-controls/id pairs match
const acMatches = h.match(/aria-controls="([^"]+)"/g) || [];
const idMatches = h.match(/\bid="([^"]+)"/g) || [];
const acIds = acMatches.map(m => m.match(/"([^"]+)"/)[1]);
const domIds = idMatches.map(m => m.match(/"([^"]+)"/)[1]);
acIds.forEach(id => {
    console.log(`aria-controls="${id}" -> id found:`, domIds.includes(id));
});

// Check if timeline section HTML is before or after work section
const tlPos = h.indexOf('class="timeline"');
const wtPos = h.indexOf('class="work-grid"');
console.log('Timeline section at char:', tlPos, '| Work section at char:', wtPos, '| Timeline is before Work:', tlPos < wtPos);
