// WCAG 2.1 contrast audit for every text pairing on pacificfrontdesk.com.
// Exit 1 if any pairing fails its required ratio.
const colors = {
  paper: '#F7F5F0',
  card: '#FFFFFF',
  dayText: '#17222E',
  dayMuted: '#5B6672',
  pacific: '#0E6BA8',
  pacificDeep: '#0A517F',
  white: '#FFFFFF',
  ink: '#0B0E12',
  nightText: '#ECEFF3',
  nightMuted: '#9AA4B2',
  royalLight: '#9E82D4',
  sodium: '#FFB74A',
};

const hexToRgb = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const luminance = (hex) => {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (fg, bg) => {
  const [l1, l2] = [luminance(fg), luminance(bg)].sort((a, b) => b - a);
  return (l1 + 0.05) / (l2 + 0.05);
};

const pairings = [
  ['day text on paper', colors.dayText, colors.paper, 4.5, 'headings, body'],
  ['day text on card', colors.dayText, colors.card, 4.5, 'card titles'],
  ['day muted on paper', colors.dayMuted, colors.paper, 4.5, 'secondary copy'],
  ['day muted on card', colors.dayMuted, colors.card, 4.5, 'card copy'],
  ['pacific on paper', colors.pacific, colors.paper, 4.5, 'links, labels, step numbers'],
  ['pacific on card', colors.pacific, colors.card, 4.5, 'links on cards'],
  ['white on pacific', colors.white, colors.pacific, 4.5, 'primary buttons, CTA band'],
  ['white on pacific-deep (hover)', colors.white, colors.pacificDeep, 4.5, 'button hover'],
  ['day text on white (CTA button)', colors.dayText, colors.white, 4.5, 'white button on CTA band'],
  ['night text on ink', colors.nightText, colors.ink, 4.5, 'night door headline'],
  ['night muted on ink', colors.nightMuted, colors.ink, 4.5, 'night door copy, footer'],
  ['royal-light on ink', colors.royalLight, colors.ink, 4.5, 'nattskift links'],
  ['focus ring pacific vs paper', colors.pacific, colors.paper, 3.0, 'focus indicator'],
  ['focus ring royal-light vs ink', colors.royalLight, colors.ink, 3.0, 'focus indicator (night)'],
];

let failed = false;
console.log('WCAG 2.1 contrast audit — pacificfrontdesk.com\n');
for (const [label, fg, bg, required, use] of pairings) {
  const r = ratio(fg, bg);
  const pass = r >= required;
  if (!pass) failed = true;
  console.log(`${pass ? ' ' : '!'} ${label.padEnd(38)} ${r.toFixed(2)}:1  needs ${required}:1  ${pass ? 'PASS' : 'FAIL'}`);
  console.log(`    ${use}`);
}
process.exit(failed ? 1 : 0);
