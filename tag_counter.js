import fs from 'fs';

const content = fs.readFileSync('c:\\Users\\Administrator\\Desktop\\irfo-project\\src\\pages\\RegistrationSetup.tsx', 'utf8');
const lines = content.split('\n');

let openDivs = 0;
let closeDivs = 0;
let openBraces = 0;
let closeBraces = 0;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const divs = line.match(/<div/g);
    const cdivs = line.match(/<\/div>/g);
    const braces = line.match(/{/g);
    const cbraces = line.match(/}/g);

    if (divs) openDivs += divs.length;
    if (cdivs) closeDivs += cdivs.length;
    if (braces) openBraces += braces.length;
    if (cbraces) closeBraces += cbraces.length;

    if (i > 4000) {
        // console.log(`${i+1}: D:${openDivs-closeDivs} B:${openBraces-closeBraces} | ${line.trim()}`);
    }
}

console.log(`Total Divs: Open=${openDivs}, Close=${closeDivs}, Diff=${openDivs - closeDivs}`);
console.log(`Total Braces: Open=${openBraces}, Close=${closeBraces}, Diff=${openBraces - closeBraces}`);
