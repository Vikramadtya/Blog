/** Post to a Discord webhook without ever pinging @everyone/@here/roles/users. */
export async function notifyDiscord(webhookUrl: string | undefined, content: string): Promise<void> {
  if (!webhookUrl) return;
  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: content.slice(0, 1900), allowed_mentions: { parse: [] } }),
    });
  } catch (err) {
    console.error('[Discord] webhook failed:', err);
  }
}
