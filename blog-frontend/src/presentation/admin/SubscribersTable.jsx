export default function SubscribersTable({ subscribers }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-border">
        <thead className="bg-muted/50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
            >
              Email
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
            >
              Subscribed On
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border bg-transparent">
          {subscribers.map((sub) => (
            <tr key={sub.id} className="hover:bg-muted/20">
              <td className="whitespace-nowrap px-6 py-4 font-medium text-foreground">
                {sub.email}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">
                {new Date(sub.createdAt).toLocaleString()}
              </td>
            </tr>
          ))}
          {subscribers.length === 0 && (
            <tr>
              <td
                colSpan="2"
                className="px-6 py-12 text-center text-muted-foreground"
              >
                No subscribers yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
