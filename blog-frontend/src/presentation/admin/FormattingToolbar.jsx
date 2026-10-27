export default function FormattingToolbar({ onFormat: formatText }) {
  return (
    <div className="flex gap-1 p-2 bg-muted/50 rounded-md border border-border overflow-x-auto">
              <button type="button" onClick={() => formatText("**", "**")} className="p-1.5 hover:bg-muted rounded text-foreground" title="Bold"><strong className="font-serif">B</strong></button>
              <button type="button" onClick={() => formatText("*", "*")} className="p-1.5 hover:bg-muted rounded text-foreground italic" title="Italic"><span className="font-serif">I</span></button>
              <button type="button" onClick={() => formatText("~~", "~~")} className="p-1.5 hover:bg-muted rounded text-foreground line-through" title="Strikethrough"><span className="font-serif">S</span></button>
              <div className="w-px bg-border mx-1 my-1"></div>
              <button type="button" onClick={() => formatText("[", "](url)")} className="p-1.5 hover:bg-muted rounded text-foreground" title="Link">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
              </button>
              <button type="button" onClick={() => formatText("![](", ")")} className="p-1.5 hover:bg-muted rounded text-foreground" title="Image">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
              </button>
              <div className="w-px bg-border mx-1 my-1"></div>
              <button type="button" onClick={() => formatText("`", "`")} className="p-1.5 hover:bg-muted rounded text-foreground" title="Inline Code">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
              </button>
              <button type="button" onClick={() => formatText("\n```\n", "\n```\n")} className="p-1.5 hover:bg-muted rounded text-foreground flex items-center" title="Code Block">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
              </button>
              <button type="button" onClick={() => formatText("> ")} className="p-1.5 hover:bg-muted rounded text-foreground" title="Blockquote">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>
              </button>
            </div>
  );
}
