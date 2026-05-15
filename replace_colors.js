const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    const replacements = {
        'border-blue-600/20 border-t-blue-600': 'border-[var(--primary)]/20 border-t-[var(--primary)]',
        'border-blue-500': 'border-[var(--primary)]',
        'border-blue-400': 'border-[var(--primary)]',
        'focus:ring-blue-600/50': 'focus:ring-[var(--primary)]/50',
        'focus:ring-blue-500/20': 'focus:ring-[var(--primary)]/20',
        'focus:ring-blue-500': 'focus:ring-[var(--primary)]',
        'hover:bg-blue-500': 'hover:bg-[var(--primary-hover)]',
        'hover:bg-blue-700': 'hover:bg-[var(--primary-hover)]',
        'bg-blue-600/20': 'bg-[var(--primary-light)]',
        'bg-blue-600/10': 'bg-[var(--primary-light)]',
        'bg-blue-600/5': 'bg-[var(--primary-light)]',
        'bg-blue-400/5': 'bg-[var(--primary-light)]',
        'bg-blue-500/10': 'bg-[var(--primary-light)]',
        'from-blue-600/20': 'from-[var(--primary-light)]',
        'from-blue-600/10': 'from-[var(--primary-light)]',
        'from-blue-600/5': 'from-[var(--primary-light)]',
        'to-purple-600/20': 'to-[var(--accent-light)]',
        'to-purple-600/10': 'to-[var(--accent-light)]',
        'to-purple-600/5': 'to-[var(--accent-light)]',
        'from-blue-600 to-purple-700': 'from-[var(--primary)] to-[var(--accent)]',
        'from-blue-500 to-purple-500': 'from-[var(--primary)] to-[var(--accent)]',
        'from-blue-400 via-blue-600 to-purple-600': 'from-[var(--primary)] via-[var(--accent)] to-[var(--gold)]',
        'shadow-blue-600/40': 'shadow-[var(--sidebar-active-shadow)]',
        'shadow-blue-600/30': 'shadow-[var(--sidebar-active-shadow)]',
        'shadow-blue-600/10': 'shadow-[var(--sidebar-active-shadow)]',
        'shadow-blue-600/5': 'shadow-[var(--primary-light)]',
        'shadow-blue-500/10': 'shadow-[var(--sidebar-active-shadow)]',
        'shadow-blue-500/5': 'shadow-[var(--primary-light)]',
        'selection:bg-blue-500/30': 'selection:bg-[var(--primary)]/30',
        'selection:text-blue-200': 'selection:text-[var(--foreground)]',
        'text-blue-600': 'text-[var(--primary)]',
        'text-blue-500': 'text-[var(--primary)]',
        'text-blue-400': 'text-[var(--primary)]',
        'text-blue-300': 'text-[var(--primary)]',
        'text-blue-200': 'text-[var(--primary)]',
        'text-blue-100': 'text-white/80',
        'border-blue-600': 'border-[var(--primary)]'
    };

    for (const [key, value] of Object.entries(replacements)) {
        content = content.split(key).join(value);
    }
    
    // Regex replacements
    content = content.replace(/bg-blue-600(?!\/)/g, 'bg-[var(--primary)]');
    content = content.replace(/bg-blue-500(?!\/)/g, 'bg-[var(--primary)]');

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Updated:', filePath);
    }
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else if (fullPath.endsWith('.jsx')) {
            replaceInFile(fullPath);
        }
    }
}

walkDir('./frontend/app');
