const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const classReplacements = {
  // Backgrounds
  'bg-[#030014]': 'bg-slate-950',
  'bg-black/50': 'bg-slate-900/50',
  'bg-white/5': 'bg-slate-900',
  'bg-white/10': 'bg-slate-800/50',
  'bg-[#020617]': 'bg-slate-950',
  
  // Cards and surfaces
  'backdrop-blur-sm': 'backdrop-blur-sm',
  
  // Borders
  'border-white/10': 'border-slate-700',
  'border-white/20': 'border-slate-600',
  'hover:border-white/20': 'hover:border-slate-500',
  
  // Texts
  'text-gray-400': 'text-slate-300',
  'text-gray-300': 'text-slate-300',
  'text-gray-200': 'text-white',
  
  // Buttons (Primary)
  'from-[#4f52c9] to-[#8644c5]': '',
  'bg-[#030014]': 'bg-slate-950',
  
  // Glows
  'from-[#6366f1]/10 to-[#a855f7]/10': 'bg-blue-900/20',
  'from-[#6366f1] to-[#a855f7]': '',
  'from-indigo-500/10 to-purple-500/10': 'bg-blue-900/20'
};

const regexReplacements = [
  // Typography & Text gradients
  { regex: /bg-gradient-to-[a-z]+\s+from-[^\s]+\s+to-[^\s]+\s+bg-clip-text\s+text-transparent/g, replacement: 'text-white' },
  { regex: /bg-gradient-to-[a-z]+\s+from-[^\s]+\s+via-[^\s]+\s+to-[^\s]+\s+bg-clip-text\s+text-transparent/g, replacement: 'text-white' },
  { regex: /text-transparent\s+bg-clip-text\s+from-[^\s]+\s+to-[^\s]+/g, replacement: 'text-white' },
  
  // Glowing backgrounds (remove non-blue glows)
  { regex: /bg-gradient-to-[a-z]+\s+from-\[#[a-f0-9]+\]\s+to-\[#[a-f0-9]+\]/gi, replacement: 'bg-blue-900/20' },
  { regex: /bg-gradient-to-[a-z]+\s+from-\[#[a-f0-9]+\]\/[0-9]+\s+to-\[#[a-f0-9]+\]\/[0-9]+/gi, replacement: 'bg-blue-900/20' },
  
  // Text updates
  { regex: /Eki Zulfar Rachman/g, replacement: 'Muh. Nadhiftamma Ayatilla A.P.' },
  { regex: /EkiZR/g, replacement: 'nadhiftamma' },
  { regex: /ekizr/g, replacement: 'nadhiftamma' }, // For IG/LinkedIn URLs
  { regex: /Frontend Web Developer/gi, replacement: 'Fullstack Developer' },
  { regex: /Frontend Developer/gi, replacement: 'Fullstack Developer' },
  
  // Specifically for Home.jsx data
  { regex: /"Network & Telecom Student", "Tech Enthusiast"/g, replacement: '"Informatics Engineering Student at Hasanuddin University", "Fullstack Developer Intern"' },
  { regex: /"React", "Javascript", "Node.js", "Tailwind"/g, replacement: '"PHP", "Laravel", "CodeIgniter", "Godot Engine", "Figma"' },
  { regex: /"Menciptakan Website Yang Inovatif, Fungsional, dan User-Friendly untuk Solusi Digital\."/g, replacement: '"Building innovative, scalable, and user-friendly web solutions for the modern digital landscape."' },
  { regex: /Menciptakan Website Yang Inovatif, Fungsional, dan User-Friendly untuk Solusi Digital\./g, replacement: 'Building innovative, scalable, and user-friendly web solutions for the modern digital landscape.' }
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
      
      // Simple class replacements
      for (const [key, value] of Object.entries(classReplacements)) {
        content = content.split(key).join(value);
      }
      
      // Regex replacements
      for (const { regex, replacement } of regexReplacements) {
        content = content.replace(regex, replacement);
      }
      
      // Tech stack badges
      content = content.replace(/bg-white\/5 backdrop-blur-sm border border-white\/10 text-sm text-gray-300 hover:bg-white\/10/g, 'bg-slate-800 text-slate-100 border border-slate-700 text-sm hover:bg-slate-700');
      
      // Primary Buttons (CTAButton in Home)
      content = content.replace(/bg-gradient-to-r from-gray-200 to-white bg-clip-text text-transparent/g, 'text-slate-950');
      content = content.replace(/bg-\[#030014\] backdrop-blur-xl rounded-lg border border-slate-700/g, 'bg-white rounded-lg border-none hover:bg-slate-200');
      
      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
}

processDirectory(srcDir);
console.log('Slate Refactoring complete.');
