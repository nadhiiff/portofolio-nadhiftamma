const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const replacements = [
  // Backgrounds
  { regex: /\bbg-slate-950\b/g, replacement: 'bg-black' },
  { regex: /\bbg-\[#020617\]\b/g, replacement: 'bg-black' },
  { regex: /\bbg-slate-[789]00\b/g, replacement: 'bg-neutral-900' },
  { regex: /\bbg-slate-200\b/g, replacement: 'bg-neutral-200' },
  
  // Hover Backgrounds
  { regex: /\bhover:bg-slate-[789]00\b/g, replacement: 'hover:bg-neutral-800' },
  { regex: /\bhover:bg-slate-200\b/g, replacement: 'hover:bg-neutral-200' },

  // Borders
  { regex: /\bborder-slate-[78]00\b/g, replacement: 'border-neutral-600' },
  { regex: /\bborder-slate-[56]00\b/g, replacement: 'border-neutral-500' },
  { regex: /\bhover:border-slate-[678]00\b/g, replacement: 'hover:border-white' },

  // Text
  { regex: /\btext-slate-400\b/g, replacement: 'text-neutral-400' },
  { regex: /\btext-slate-300\b/g, replacement: 'text-neutral-300' },
  { regex: /\btext-slate-200\b/g, replacement: 'text-white' },
  { regex: /\btext-slate-950\b/g, replacement: 'text-black' },
  { regex: /\bhover:text-slate-[34]00\b/g, replacement: 'hover:text-white' },

  // Gradients and Blurs (Remove them)
  { regex: /\bbg-gradient-to-[a-z]+\b/g, replacement: '' },
  { regex: /\bfrom-slate-[0-9]+\b/g, replacement: '' },
  { regex: /\bto-slate-[0-9]+\b/g, replacement: '' },
  { regex: /\bvia-slate-[0-9]+\b/g, replacement: '' },
  { regex: /\bfrom-blue-[0-9]+\b/g, replacement: '' },
  { regex: /\bto-blue-[0-9]+\b/g, replacement: '' },
  { regex: /\bvia-blue-[0-9]+\b/g, replacement: '' },
  { regex: /\bfrom-indigo-[0-9]+\b/g, replacement: '' },
  { regex: /\bto-indigo-[0-9]+\b/g, replacement: '' },
  { regex: /\bvia-indigo-[0-9]+\b/g, replacement: '' },
  { regex: /\bblur(-[a-z0-9]+)?\b/g, replacement: '' },
  
  // Other colors like blue, indigo, purple (remove them or neutral)
  { regex: /\btext-blue-[0-9]+\b/g, replacement: 'text-white' },
  { regex: /\bbg-blue-[0-9]+\b/g, replacement: 'bg-neutral-900' },
  { regex: /\bborder-blue-[0-9]+\b/g, replacement: 'border-neutral-600' },
  { regex: /\btext-indigo-[0-9]+\b/g, replacement: 'text-white' },
  { regex: /\btext-purple-[0-9]+\b/g, replacement: 'text-white' }
];

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.css')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;
      
      for (const { regex, replacement } of replacements) {
        content = content.replace(regex, replacement);
      }
      
      // Cleanup extra spaces in className="..." but DO NOT touch newlines
      // Replace two or more spaces with a single space ONLY inside strings on the same line
      content = content.replace(/className="([^"]*)"/g, (match, p1) => {
        return `className="${p1.replace(/ +/g, ' ')}"`;
      });
      
      // Clean up standalone backdrop- caused by removing blur-xl etc
      content = content.replace(/\bbackdrop- /g, '');
      
      // Additional index.css specific cleanup
      if (fullPath.endsWith('index.css')) {
        content = content.replace(/background: #020617;/g, 'background: #000000;');
        content = content.replace(/rgba\(15, 23, 42,/g, 'rgba(23, 23, 23,');
      }
      
      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
}

processDirectory(srcDir);
console.log('Refactoring complete.');
