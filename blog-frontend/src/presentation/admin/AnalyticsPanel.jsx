export default function AnalyticsPanel({ analytics }) {
  return (
    <div className="p-6">
      <h3 className="mb-4 text-lg font-medium text-foreground">
        Site Overview
      </h3>
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-background p-4 shadow-sm">
          <div className="mb-1 text-sm font-medium text-muted-foreground">
            Total Views
          </div>
          <div className="text-2xl font-bold text-foreground">
            {analytics.totals.views.toLocaleString()}
          </div>
        </div>
        <div className="rounded-xl border border-border bg-background p-4 shadow-sm">
          <div className="mb-1 text-sm font-medium text-muted-foreground">
            Total Likes
          </div>
          <div className="text-2xl font-bold text-foreground">
            {analytics.totals.likes.toLocaleString()}
          </div>
        </div>
        <div className="rounded-xl border border-border bg-background p-4 shadow-sm">
          <div className="mb-1 text-sm font-medium text-muted-foreground">
            Total Subscribers
          </div>
          <div className="text-2xl font-bold text-foreground">
            {analytics.totals.subscribers.toLocaleString()}
          </div>
        </div>
        <div className="rounded-xl border border-border bg-background p-4 shadow-sm">
          <div className="mb-1 text-sm font-medium text-muted-foreground">
            Total Comments
          </div>
          <div className="text-2xl font-bold text-foreground">
            {analytics.totals.comments.toLocaleString()}
          </div>
        </div>
      </div>

      <h3 className="mb-4 text-lg font-medium text-foreground">Top Posts</h3>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
              >
                Post ID / Slug
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
              >
                Views
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
              >
                Likes
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-transparent">
            {analytics.topPosts.map((post) => (
              <tr key={post.id} className="hover:bg-muted/20">
                <td className="whitespace-nowrap px-6 py-4 font-medium text-foreground">
                  {post.id}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-foreground">
                  {post.views.toLocaleString()}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-foreground">
                  {post.likes.toLocaleString()}
                </td>
              </tr>
            ))}
            {analytics.topPosts.length === 0 && (
              <tr>
                <td
                  colSpan="3"
                  className="px-6 py-12 text-center text-muted-foreground"
                >
                  No metrics recorded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
