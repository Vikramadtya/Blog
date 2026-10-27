import Link from "next/link";

export default function SubPagesPanel({ subPages, currentSlug, isDev }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-violet-500"><path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M3 6h.01"/><path d="M3 12h.01"/><path d="M3 18h.01"/></svg>
                  Sub-pages
                  {subPages.length > 0 && (
                    <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{subPages.length}</span>
                  )}
                </h3>
                {isDev && (
                  <Link
                    href={`/admin/new?series=${currentSlug}`}
                    className="inline-flex items-center gap-1.5 rounded-md bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-violet-700 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                    Add Sub-page
                  </Link>
                )}
              </div>
              {subPages.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No sub-pages yet. Click &quot;Add Sub-page&quot; to create one.
                </p>
              ) : (
                <div className="space-y-2">
                  {subPages.map((sub, i) => (
                    <div key={sub.filename} className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xs font-mono text-muted-foreground w-4 shrink-0">{i + 1}.</span>
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-foreground truncate">{sub.title}</div>
                          <div className="text-xs text-muted-foreground truncate">{sub.slug}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          sub.publish ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400" : "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400"
                        }`}>
                          {sub.publish ? "Published" : "Draft"}
                        </span>
                        <Link
                          href={`/admin/edit/${sub.filename}`}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          title="Edit"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
  );
}
