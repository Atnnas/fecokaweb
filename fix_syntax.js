const fs = require('fs');
const files = [
    'src/app/admin/news/page.tsx',
    'src/app/admin/events/page.tsx',
    'src/app/admin/academies/page.tsx',
    'src/app/admin/rankings/page.tsx',
    'src/app/admin/users/page.tsx'
];

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    let c = fs.readFileSync(file, 'utf8');

    // 1. Fix duplicate className in form
    c = c.replace(/<form([^>]*) className="space-y-10"([^>]*) className="flex flex-col flex-1 overflow-hidden">/g,
        '<form$1$2 className="flex flex-col flex-1 overflow-hidden">');

    // 2. Add back the <div className="space-y-10"> wrapper inside the scroll container
    c = c.replace(/<div className="([^"]*overflow-y-auto custom-scrollbar flex-1[^"]*)">/g,
        '<div className="$1">\n                                <div className="space-y-10">');

    // 3. Add back the closing </div> for the space-y-10 wrapper right before the sticky footer is defined
    c = c.replace(/<\/div>\s*<div className="([^"]*shrink-0([^"]*))">/g,
        '</div>\n                            </div>\n                            <div className="$1">');

    fs.writeFileSync(file, c);
    console.log('Syntax fixed', file);
});
