import fs from 'fs';
import path from 'path';

const activitiesDir = 'c:\\Users\\ASUS\\OneDrive\\Desktop\\skilizee\\E-waste\\public\\activities';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else {
      callback(dirPath);
    }
  });
}

function processHtmlFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Replace Tailwind class text-xs, text-sm, text-base, text-lg
  content = content.replace(/\btext-(xs|sm|base|lg)\b/g, 'text-xl');

  // Replace text-[...] where px value is < 20
  content = content.replace(/\btext-\[(\d+)px\]/g, (match, val) => {
    let px = parseInt(val, 10);
    if (px < 20) {
      return `text-[20px]`;
    }
    return match;
  });

  // Replace text-[...] where rem/em value is < 1.25
  content = content.replace(/\btext-\[([\d.]+)rem\]/g, (match, val) => {
    let rem = parseFloat(val);
    if (rem < 1.25) {
      return `text-[20px]`;
    }
    return match;
  });
  content = content.replace(/\btext-\[([\d.]+)em\]/g, (match, val) => {
    let em = parseFloat(val);
    if (em < 1.25) {
      return `text-[20px]`;
    }
    return match;
  });

  // Replace raw css font-size in style blocks/inline styles
  content = content.replace(/font-size\s*:\s*([^;!'"\s>]+)(!important)?/g, (match, val, imp) => {
    val = val.trim();
    let isImportant = imp ? ' !important' : '';

    // Check pixels
    let pxMatch = val.match(/^([\d.]+)\s*px$/i);
    if (pxMatch) {
      let px = parseFloat(pxMatch[1]);
      if (px < 20) {
        return `font-size: 20px${isImportant}`;
      }
    }

    // Check rem
    let remMatch = val.match(/^([\d.]+)\s*rem$/i);
    if (remMatch) {
      let rem = parseFloat(remMatch[1]);
      if (rem < 1.25) {
        return `font-size: 1.25rem${isImportant}`;
      }
    }

    // Check em
    let emMatch = val.match(/^([\d.]+)\s*em$/i);
    if (emMatch) {
      let em = parseFloat(emMatch[1]);
      if (em < 1.25) {
        return `font-size: 1.25em${isImportant}`;
      }
    }

    // Check percent
    let percentMatch = val.match(/^([\d.]+)\s*%$/);
    if (percentMatch) {
      let percent = parseFloat(percentMatch[1]);
      if (percent < 125) {
        return `font-size: 125%${isImportant}`;
      }
    }

    return match;
  });

  // Inject a global style fallback in <head> if not already present
  if (!content.includes('/* Global font size override fallback */')) {
    const styleFallback = `
    <style>
        /* Global font size override fallback */
        body, p, span, button, input, select, textarea, li, a, label, td, th {
            font-size: 20px;
        }
        h1, h2, h3, h4, h5, h6 {
            font-size: max(20px, 1.25em);
        }
    </style>
    </head>`;
    content = content.replace('</head>', styleFallback);
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated HTML activity: ${filePath}`);
  }
}

function processJsFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Replace Tailwind class text-xs, text-sm, text-base, text-lg
  content = content.replace(/\btext-(xs|sm|base|lg)\b/g, 'text-xl');

  // Replace text-[...] where px value is < 20
  content = content.replace(/\btext-\[(\d+)px\]/g, (match, val) => {
    let px = parseInt(val, 10);
    if (px < 20) {
      return `text-[20px]`;
    }
    return match;
  });

  // Replace text-[...] where rem/em value is < 1.25
  content = content.replace(/\btext-\[([\d.]+)rem\]/g, (match, val) => {
    let rem = parseFloat(val);
    if (rem < 1.25) {
      return `text-[20px]`;
    }
    return match;
  });
  content = content.replace(/\btext-\[([\d.]+)em\]/g, (match, val) => {
    let em = parseFloat(val);
    if (em < 1.25) {
      return `text-[20px]`;
    }
    return match;
  });

  // Replace font-size declarations in JS templates
  content = content.replace(/\bfontSize\s*:\s*(\d+)\b/g, (match, val) => {
    let px = parseInt(val, 10);
    if (px < 20) {
      return `fontSize: 20`;
    }
    return match;
  });

  content = content.replace(/\bfontSize\s*:\s*(['"`])([\d.]+)px\1/g, (match, quote, val) => {
    let px = parseFloat(val);
    if (px < 20) {
      return `fontSize: ${quote}20px${quote}`;
    }
    return match;
  });

  content = content.replace(/\bfontSize\s*:\s*(['"`])([\d.]+)rem\1/g, (match, quote, val) => {
    let rem = parseFloat(val);
    if (rem < 1.25) {
      return `fontSize: ${quote}1.25rem${quote}`;
    }
    return match;
  });

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated JS activity: ${filePath}`);
  }
}

walkDir(activitiesDir, filePath => {
  let ext = path.extname(filePath);
  if (ext === '.html') {
    processHtmlFile(filePath);
  } else if (ext === '.js') {
    processJsFile(filePath);
  }
});

console.log('Public activities font correction process complete.');
