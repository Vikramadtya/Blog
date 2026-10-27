"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import NotesAdminTab from "@/presentation/admin/NotesAdminTab";
import AdminTabs from "@/presentation/admin/AdminTabs";
import PostsTable from "@/presentation/admin/PostsTable";
import SubscribersTable from "@/presentation/admin/SubscribersTable";
import ContactsTable from "@/presentation/admin/ContactsTable";
import AnalyticsPanel from "@/presentation/admin/AnalyticsPanel";

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
      const res = await fetch("/api/admin/community");
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || "Failed to load community data");
      setSubscribers(data.subscribers);
      setContacts(data.contacts);
      setAnalytics(data.analytics);
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
        body: JSON.stringify({ filename, publish: !currentPublishState }),
      });
      if (res.ok) fetchPosts();
      else alert("Failed to update post status");
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleDelete = async (filename) => {
    if (
      !confirm(
        `Are you sure you want to delete ${filename}? This cannot be undone.`,
      )
    )
      return;
    try {
      const res = await fetch(
        `/api/admin/posts?filename=${encodeURIComponent(filename)}`,
        {
          method: "DELETE",
        },
      );
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
    if (
      !confirm(
        `Are you sure you want to broadcast ${filename} to all subscribers? This will send an email immediately.`,
      )
    )
      return;
    try {
      const res = await fetch("/api/admin/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename }),
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
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Admin Dashboard
            {!isDev && (
              <span className="rounded-full border border-amber-200 bg-amber-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-amber-600 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                Read-Only Mode
              </span>
            )}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {isDev
              ? "Manage your local markdown blog files directly. Frontmatter is the authoritative source."
              : "You are viewing the production dashboard. Actions are disabled."}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {syncMessage && (
              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                {syncMessage}
              </span>
            )}
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
              className="cursor-not-allowed rounded-md bg-[#f05a28] px-4 py-2 text-sm font-semibold text-white opacity-50 shadow-sm"
            >
              + Create New Post
            </button>
          )}
        </div>
      </div>

      <AdminTabs
        activeTab={activeTab}
        onChange={setActiveTab}
        tabs={[
          { id: "posts", label: `Posts (${posts.length})` },
          { id: "subscribers", label: `Subscribers (${subscribers.length})` },
          { id: "contacts", label: `Support Requests (${contacts.length})` },
          { id: "analytics", label: "Analytics 📈" },
          { id: "notes", label: "Notes" },
        ]}
      />

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        {status === "loading" && (
          <div className="p-8 text-center text-muted-foreground">
            Loading data...
          </div>
        )}
        {status === "error" && (
          <div className="p-8 text-center text-red-500">{error}</div>
        )}

        {status === "success" && activeTab === "posts" && (
          <PostsTable
            posts={posts}
            isDev={isDev}
            onBroadcast={handleBroadcast}
            onTogglePublish={handleTogglePublish}
            onDelete={handleDelete}
          />
        )}

        {status === "success" && activeTab === "subscribers" && (
          <SubscribersTable subscribers={subscribers} />
        )}

        {status === "success" && activeTab === "contacts" && (
          <ContactsTable contacts={contacts} />
        )}

        {status === "success" && activeTab === "analytics" && analytics && (
          <AnalyticsPanel analytics={analytics} />
        )}
        {status === "success" && activeTab === "notes" && <NotesAdminTab />}
      </div>
    </div>
  );
}
