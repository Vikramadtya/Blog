import fs from 'fs/promises';
import path from 'path';

function escapeBraces(line) {
  let out = "";
  let inInlineCode = false;
  let inInlineMath = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    // Toggle inline code
    if (char === "`") {
      inInlineCode = !inInlineCode;
      out += char;
      continue;
    }
    
    // Toggle inline math
    if (char === "$" && line[i-1] !== "\\") {
      if (line[i+1] === "$") {
        out += "$$";
        i++;
        inInlineMath = !inInlineMath;
        continue;
      }
      inInlineMath = !inInlineMath;
      out += char;
      continue;
    }
    
    if (!inInlineCode && !inInlineMath) {
      if (char === "{") {
        out += "&#123;";
      } else if (char === "}") {
        out += "&#125;";
      } else if (char === "<" && i + 1 < line.length && (/\d|\s/.test(line[i + 1]))) {
        out += "&lt;";
      } else {
        out += char;
      }
    } else {
      out += char;
    }
  }
  return out;
}

async function fixNotes(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      await fixNotes(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      let content = await fs.readFile(fullPath, 'utf8');
      
      // 1. Fix self-closing HTML tags
      content = content.replace(/<img\b([^>]*[^\/])?>/gi, "<img$1 />");
      content = content.replace(/<br\b([^>]*[^\/])?>/gi, "<br$1 />");
      content = content.replace(/<hr\b([^>]*[^\/])?>/gi, "<hr$1 />");

      // 2. Fix unescaped < > pairs that are not valid HTML tags
      const validHtmlTags = [
        "div", "span", "img", "br", "hr", "p", "a", "b", "i", "u", "strong", 
        "em", "h1", "h2", "h3", "h4", "h5", "h6", "ul", "ol", "li", "table", 
        "tr", "td", "th", "thead", "tbody", "figure", "figcaption", "code", 
        "pre", "blockquote", "del", "s", "iframe", "video", "audio", "source"
      ];

      content = content.replace(/<([^>]+)>/g, (match, inner) => {
        if (inner.startsWith("/")) {
          const tagName = inner.slice(1).split(" ")[0].toLowerCase();
          if (validHtmlTags.includes(tagName)) return match;
          return `&lt;${inner}&gt;`;
        }

        const tagName = inner.split(" ")[0].toLowerCase();
        if (validHtmlTags.includes(tagName)) {
          return match;
        }
        return `&lt;${inner}&gt;`;
      });

      // 3. Fix unescaped curly braces outside of code/math blocks
      const lines = content.split("\n");
      let inFencedCodeBlock = false;
      let inFencedMathBlock = false;
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        if (line.trim().startsWith("```")) {
          inFencedCodeBlock = !inFencedCodeBlock;
          continue;
        }
        
        if (line.trim() === "$$") {
          inFencedMathBlock = !inFencedMathBlock;
          continue;
        }
        
        if (!inFencedCodeBlock && !inFencedMathBlock) {
          lines[i] = escapeBraces(line);
        }
      }
      
      content = lines.join("\n");

      await fs.writeFile(fullPath, content, 'utf8');
    }
  }
}

const notesDir = path.join(process.cwd(), '..', 'blog-datastore', 'notes');
console.log(`Fixing notes in ${notesDir}`);
await fixNotes(notesDir);
console.log('Done!');
