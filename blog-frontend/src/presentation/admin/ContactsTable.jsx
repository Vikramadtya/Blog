export default function ContactsTable({ contacts }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-border">
        <thead className="bg-muted/50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
            >
              From
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
            >
              Message
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
            >
              Received
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border bg-transparent">
          {contacts.map((contact) => (
            <tr key={contact.id} className="hover:bg-muted/20">
              <td className="whitespace-nowrap px-6 py-4 font-medium text-foreground">
                {contact.email}
              </td>
              <td className="max-w-md whitespace-pre-wrap px-6 py-4 text-sm text-foreground">
                {contact.message}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">
                {new Date(contact.createdAt).toLocaleString()}
              </td>
            </tr>
          ))}
          {contacts.length === 0 && (
            <tr>
              <td
                colSpan="3"
                className="px-6 py-12 text-center text-muted-foreground"
              >
                No support requests yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
