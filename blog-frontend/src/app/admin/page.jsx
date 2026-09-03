"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import NotesAdminTab from "@/presentation/admin/NotesAdminTab";

export default function AdminDashboard() {
  const [posts, setPosts] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState("");
  const [activeTab, setActiveTab] = useState("posts"); // posts, subscribers, contacts, analytics

  const isDev = process.env.NODE_ENV === "development";

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/admin/posts");
      const data = await res.json();
      if (res.ok) {
        setPosts(data.posts);
      } else {
        throw new Error(data.error || "Failed to load posts");
      }
    } catch (err) {
      throw err;
    }
  };

  const fetchCommunityData = async () => {
    try {
      const { fetchSubscribers, fetchContacts, fetchAnalytics } = await import("@/lib/client/api");
      const subs = await fetchSubscribers();
      const conts = await fetchContacts();
      const stats = await fetchAnalytics();
      setSubscribers(subs);
      setContacts(conts);
      setAnalytics(stats);
    } catch (err) {
      console.error("Failed to fetch community data", err);
    }
  };

  const loadData = async () => {
    setStatus("loading");
    try {
      await fetchPosts();
      await fetchCommunityData();
      setStatus("success");
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTogglePublish = async (filename, currentPublishState) => {
    try {
      const res = await fetch("/api/admin/posts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename, publish: !currentPublishState })
      });
      if (res.ok) fetchPosts();
      else alert("Failed to update post status");
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleDelete = async (filename) => {
    if (!confirm(`Are you sure you want to delete ${filename}? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/admin/posts?filename=${encodeURIComponent(filename)}`, {
        method: "DELETE"
      });
      if (res.ok) fetchPosts();
      else alert("Failed to delete post");
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleSyncTags = async () => {
    setIsSyncing(true);
    setSyncMessage("");
    try {
      const res = await fetch("/api/admin/tags", { method: "POST" });
      const data = await res.json();
      if (res.ok) setSyncMessage(`Synced ${data.count} tags successfully!`);
      else setSyncMessage(`Error: ${data.error}`);
    } catch (err) {
      setSyncMessage("Failed to sync tags");
    }
    setIsSyncing(false);
    setTimeout(() => setSyncMessage(""), 3000);
  };

  const handleBroadcast = async (filename) => {
    if (!confirm(`Are you sure you want to broadcast ${filename} to all subscribers? This will send an email immediately.`)) return;
    try {
      const res = await fetch("/api/admin/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename })
      });
      const data = await res.json();
      if (res.ok) alert(`Success! Sent to ${data.count} subscribers.`);
      else alert(`Failed: ${data.error}`);
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-24 sm:py-32">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl flex items-center gap-3">
            Admin Dashboard
            {!isDev && (
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/30 px-2.5 py-1 rounded-full border border-amber-200 dark:border-amber-800">
                Read-Only Mode
              </span>
            )}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {isDev ? "Manage your local markdown blog files directly. Frontmatter is the authoritative source." : "You are viewing the production dashboard. Actions are disabled."}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {syncMessage && <span className="text-sm font-medium text-green-600 dark:text-green-400">{syncMessage}</span>}
            <button
              onClick={handleSyncTags}
              disabled={isSyncing || !isDev}
              className="rounded-md bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground hover:bg-secondary/80 disabled:opacity-50"
            >
              {isSyncing ? "Syncing..." : "Sync Tags"}
            </button>
          </div>
          {isDev ? (
            <Link
              href="/admin/new"
              className="rounded-md bg-[#f05a28] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#d94a1b]"
            >
              + Create New Post
            </Link>
          ) : (
            <button
              disabled
              className="rounded-md bg-[#f05a28] px-4 py-2 text-sm font-semibold text-white shadow-sm opacity-50 cursor-not-allowed"
            >
              + Create New Post
            </button>
          )}
        </div>
      </div>

      <div className="mb-6 flex space-x-1 rounded-xl bg-muted/50 p-1">
        <button
          onClick={() => setActiveTab("posts")}
          className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
            activeTab === "posts"
              ? "bg-background text-foreground shadow"
              : "text-muted-foreground hover:bg-background/50"
          }`}
        >
          Posts ({posts.length})
        </button>
        <button
          onClick={() => setActiveTab("subscribers")}
          className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
            activeTab === "subscribers"
              ? "bg-background text-foreground shadow"
              : "text-muted-foreground hover:bg-background/50"
          }`}
        >
          Subscribers ({subscribers?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab("contacts")}
          className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
            activeTab === "contacts"
              ? "bg-background text-foreground shadow"
              : "text-muted-foreground hover:bg-background/50"
          }`}
        >
          Support Requests ({contacts?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab("analytics")}
          className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
            activeTab === "analytics"
              ? "bg-background text-foreground shadow"
              : "text-muted-foreground hover:bg-background/50"
          }`}
        >
          Analytics 📈
        </button>
        <button
          onClick={() => setActiveTab("notes")}
          className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
            activeTab === "notes"
              ? "bg-background text-foreground shadow"
              : "text-muted-foreground hover:bg-background/50"
          }`}
        >
          Notes
        </button>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        {status === "loading" && <div className="p-8 text-center text-muted-foreground">Loading data...</div>}
        {status === "error" && <div className="p-8 text-center text-red-500">{error}</div>}
        
        {status === "success" && activeTab === "posts" && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted/50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Title</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Stats</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Filename</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Type</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-transparent">
                {posts.map((post) => (
                  <tr key={post.filename} className="hover:bg-muted/20">
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        post.publish ? "bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400" : "bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-400"
                      }`}>
                        {post.publish ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="font-medium text-foreground">{post.title}</div>
                      <div className="text-xs text-muted-foreground truncate max-w-[200px]">{post.slug}</div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1" title="Views">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                          {post.views || 0}
                        </span>
                        <span className="flex items-center gap-1" title="Likes">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-rose-500"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                          {post.likes || 0}
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">
                      {post.filename}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground capitalize">
                      {post.type}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-3">
                        <Link 
                          href={`/blogs/${post.slug}`} 
                          target="_blank"
                          className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                          title="Preview"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                        </Link>
                        {isDev && (
                          <>
                            <button
                              onClick={() => handleBroadcast(post.filename)}
                              className="text-amber-600 hover:text-amber-900 dark:text-amber-400 dark:hover:text-amber-300"
                              title="Broadcast Newsletter"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
                            </button>
                            <Link
                              href={`/admin/edit/${post.filename}`}
                              className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                              title="Edit"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                            </Link>
                            <button 
                              onClick={() => handleTogglePublish(post.filename, post.publish)}
                              className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                              title={post.publish ? "Unpublish" : "Publish"}
                            >
                              {post.publish ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
                              )}
                            </button>
                            <button 
                              onClick={() => handleDelete(post.filename)}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                              title="Delete"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {posts.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-muted-foreground">
                      No posts found. Create one to get started!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {status === "success" && activeTab === "subscribers" && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted/50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Email</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Subscribed On</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-transparent">
                {subscribers.map((sub) => (
                  <tr key={sub.id} className="hover:bg-muted/20">
                    <td className="whitespace-nowrap px-6 py-4 font-medium text-foreground">{sub.email}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">
                      {new Date(sub.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
                {subscribers.length === 0 && (
                  <tr>
                    <td colSpan="2" className="px-6 py-12 text-center text-muted-foreground">
                      No subscribers yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {status === "success" && activeTab === "contacts" && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted/50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">From</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Message</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Received</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-transparent">
                {contacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-muted/20">
                    <td className="whitespace-nowrap px-6 py-4 font-medium text-foreground">{contact.email}</td>
                    <td className="px-6 py-4 text-sm text-foreground whitespace-pre-wrap max-w-md">{contact.message}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">
                      {new Date(contact.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
                {contacts.length === 0 && (
                  <tr>
                    <td colSpan="3" className="px-6 py-12 text-center text-muted-foreground">
                      No support requests yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {status === "success" && activeTab === "analytics" && analytics && (
          <div className="p-6">
            <h3 className="text-lg font-medium text-foreground mb-4">Site Overview</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
              <div className="rounded-xl border border-border bg-background p-4 shadow-sm">
                <div className="text-sm font-medium text-muted-foreground mb-1">Total Views</div>
                <div className="text-2xl font-bold text-foreground">{analytics.totals.views.toLocaleString()}</div>
              </div>
              <div className="rounded-xl border border-border bg-background p-4 shadow-sm">
                <div className="text-sm font-medium text-muted-foreground mb-1">Total Likes</div>
                <div className="text-2xl font-bold text-foreground">{analytics.totals.likes.toLocaleString()}</div>
              </div>
              <div className="rounded-xl border border-border bg-background p-4 shadow-sm">
                <div className="text-sm font-medium text-muted-foreground mb-1">Total Subscribers</div>
                <div className="text-2xl font-bold text-foreground">{analytics.totals.subscribers.toLocaleString()}</div>
              </div>
              <div className="rounded-xl border border-border bg-background p-4 shadow-sm">
                <div className="text-sm font-medium text-muted-foreground mb-1">Total Comments</div>
                <div className="text-2xl font-bold text-foreground">{analytics.totals.comments.toLocaleString()}</div>
              </div>
            </div>

            <h3 className="text-lg font-medium text-foreground mb-4">Top Posts</h3>
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted/50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Post ID / Slug</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Views</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Likes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-transparent">
                  {analytics.topPosts.map((post) => (
                    <tr key={post.id} className="hover:bg-muted/20">
                      <td className="whitespace-nowrap px-6 py-4 font-medium text-foreground">{post.id}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-foreground">{post.views.toLocaleString()}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-foreground">{post.likes.toLocaleString()}</td>
                    </tr>
                  ))}
                  {analytics.topPosts.length === 0 && (
                    <tr>
                      <td colSpan="3" className="px-6 py-12 text-center text-muted-foreground">
                        No metrics recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {status === "success" && activeTab === "notes" && (
          <NotesAdminTab />
        )}
      </div>
    </div>
  );
}
