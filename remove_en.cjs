const fs = require('fs');
const path = require('path');

function processDir(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            
            // Replaces the 'en' section at the end of the translations object
            let newContent = content.replace(/,\s*'en':\s*\{[\s\S]*?\n\s*\}(?=\n\s*\})/g, '');
            
            if (newContent !== content) {
                fs.writeFileSync(fullPath, newContent);
                console.log('Modified:', fullPath);
            }
        }
    }
}

processDir('./data');
