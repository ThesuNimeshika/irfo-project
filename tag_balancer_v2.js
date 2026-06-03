import fs from 'fs';

const content = fs.readFileSync('c:\\Users\\Administrator\\Desktop\\irfo-project\\src\\pages\\RegistrationSetup.tsx', 'utf8');

// Simple tag balancer
let stack = [];
const tagRegex = /<\/?([a-zA-Z0-9]+)(\s|>)/g;
let match;

while ((match = tagRegex.exec(content)) !== null) {
    const full = match[0];
    const name = match[1];

    if (full.startsWith('</')) {
        const last = stack.pop();
        if (last !== name) {
            console.log(`Mismatch at pos ${match.index}: expected close for ${last}, found ${name}`);
            // console.log(content.substring(match.index - 100, match.index + 100));
        }
    } else if (!full.endsWith('/>') && !['img', 'br', 'hr', 'input'].includes(name.toLowerCase())) {
        stack.push(name);
    }
}

console.log('Final stack:', stack);
