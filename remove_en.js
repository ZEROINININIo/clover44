const fs = require('fs');
const glob = require('glob'); // Not available? I can just use fs.readdirSync recursively
const path = require('path');

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            // We want to match: ,\s*'en':\s*\{ (anything) \}\s*\} (where the last } is the end of translations or the module)
            // It's safer to just match: ,\s*'en':\s*\{[\s\S]*?\}(?=\n    \})
            let newContent = content.replace(/,\s*'en':\s*\{[\s\S]*?\n\s*\}(?=\n\s*\})/g, '');
            if (newContent !== content) {
                fs.writeFileSync(fullPath, newContent);
                console.log('Modified:', fullPath);
            }
        }
    }
}

processDir('./data/chapter_files');
processDir('./data/side_story_files');
// processDir('./data/sideStories.ts'); // Wait, I will just do it for data/
processDir('./data');
