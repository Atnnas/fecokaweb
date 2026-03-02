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
    let content = fs.readFileSync(file, 'utf8');

    // Remove ALL rounded classes (e.g. rounded, rounded-lg, rounded-[40px]) global replacement including text inputs, modals, buttons.
    content = content.replace(/className="([^"]+)"/g, (match, classes) => {
        let newClasses = classes.split(/\s+/).filter(c => !c.startsWith('rounded')).join(' ');
        // Adjust heavy paddings that break small screens
        newClasses = newClasses.replace(/\bp-12\b/g, 'p-8').replace(/\bp-16\b/g, 'p-10');
        return `className="${newClasses}"`;
    });

    // Fix the modal structural cutoff by taking the FOOTER OUT of the `overflow-y-auto` block.
    // 1. We replace the start of the form area
    content = content.replace(
        /<div className="([^"]*overflow-y-auto custom-scrollbar flex-1[^"]*)">\s*<form([^>]*)>/g,
        '<form$2 className="flex flex-col flex-1 overflow-hidden">\n                            <div className="$1">'
    );

    // 2. We extract the footer block from the end of the scroll container
    content = content.replace(
        /<div className="([^"]*sticky bottom-0[^"]*)">([\s\S]*?)<\/div>\s*<\/form>\s*<\/div>/g,
        '</div>\n                            <div className="p-8 border-t border-silver-accent/20 bg-mist-white/30 shrink-0">$2</div>\n                        </form>'
    );

    fs.writeFileSync(file, content);
    console.log('Fixed', file);
});
