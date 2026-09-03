"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Icon from "@/presentation/ui/Icon";

export default function NotesAdminTab() {
  const [tree, setTree] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedDirs, setExpandedDirs] = useState({});

  const fetchTree = async () => {
    try {
      const res = await fetch("/api/admin/notes/tree");
      if (!res.ok) throw new Error("Failed to fetch notes tree");
      const data = await res.json();
      setTree(data.tree);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTree();
  }, []);

  const toggleDir = (path) => {
    setExpandedDirs((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  const handleCreate = async (type, parentPath) => {
    const promptMsg = 
      type === "book" ? "Enter the new Book name:" :
      type === "category" ? "Enter the new Category name:" :
      "Enter the new Note name (without .md):";

    const name = prompt(promptMsg);
    if (!name) return;

    try {
      const res = await fetch("/api/admin/notes/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, parentPath, name })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      if (type === "note") {
        // Redirect to edit page
        window.location.href = `/admin/notes/edit/${data.path}`;
      } else {
        // Re-fetch tree
        if (parentPath) {
          setExpandedDirs((prev) => ({ ...prev, [parentPath]: true }));
        }
        fetchTree();
      }
    } catch (err) {
      alert(`Error creating ${type}: ${err.message}`);
    }
  };

  const handleDelete = async (path, type) => {
    if (!confirm(`Are you sure you want to delete this ${type === "directory" ? "directory and ALL its contents" : "note"}?`)) {
      return;
    }
    
    try {
      const res = await fetch(`/api/admin/notes/delete?path=${encodeURIComponent(path)}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      fetchTree();
    } catch (err) {
      alert(`Error deleting ${type}: ${err.message}`);
    }
  };

  const renderTree = (nodes, level = 0, parentPath = "") => {
    return (
      <ul className="space-y-1">
        {nodes.map((node) => {
          if (node.type === "directory") {
            const isExpanded = !!expandedDirs[node.path];
            return (
              <li key={node.path} className="text-sm">
                <div 
                  className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg cursor-pointer group"
                >
                  <div className="flex-1 flex items-center gap-2" onClick={() => toggleDir(node.path)}>
                    {isExpanded ? (
                      <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    ) : (
                      <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    )}
                    <svg className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">{node.name}</span>
                  </div>
                  
                  <div className="hidden group-hover:flex items-center gap-2 pr-2">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleCreate("category", node.path); }}
                      className="text-xs bg-gray-200 dark:bg-zinc-700 px-2 py-1 rounded hover:bg-indigo-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                      title="New Category"
                    >
                      + Folder
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleCreate("note", node.path); }}
                      className="text-xs bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 px-2 py-1 rounded hover:bg-indigo-200 dark:hover:bg-indigo-800 transition"
                      title="New Note"
                    >
                      + Note
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDelete(node.path, "directory"); }}
                      className="text-xs text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/30 px-2 py-1 rounded transition"
                      title="Delete Folder"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                {isExpanded && (
                  <div className="ml-6 border-l border-gray-200 dark:border-zinc-800 pl-2 mt-1">
                    {renderTree(node.children, level + 1, node.path)}
                  </div>
                )}
              </li>
            );
          } else {
            const publicPath = `/notes/${node.path.split("/").map(part => part.toLowerCase().replace(/\.md$/, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")).join("/")}`;
            return (
              <li key={node.path} className="text-sm ml-6">
                <div className="flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg group">
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                    <span className="text-gray-600 dark:text-gray-400">{node.name}</span>
                  </div>
                  
                  <div className="hidden group-hover:flex items-center gap-2 pr-2">
                    <Link 
                      href={publicPath}
                      target="_blank"
                      className="text-xs bg-gray-200 dark:bg-zinc-700 px-2 py-1 rounded hover:bg-gray-300 dark:hover:bg-zinc-600 transition"
                      title="View on site"
                    >
                      View
                    </Link>
                    <Link 
                      href={`/admin/notes/edit/${node.path}`}
                      className="text-xs bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 px-2 py-1 rounded hover:bg-indigo-200 dark:hover:bg-indigo-800 transition"
                      title="Edit Note"
                    >
                      Edit
                    </Link>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDelete(node.path, "note"); }}
                      className="text-xs text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/30 px-2 py-1 rounded transition"
                      title="Delete Note"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </li>
            );
          }
        })}
      </ul>
    );
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading notes tree...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-200 dark:border-zinc-800 p-6">
      <div className="flex justify-between items-center mb-6 border-b border-gray-100 dark:border-zinc-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Notes Manager</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your books, categories, and notes hierarchy.</p>
        </div>
        <button 
          onClick={() => handleCreate("book", "")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition"
        >
          + Create New Book
        </button>
      </div>
      
      <div className="bg-gray-50 dark:bg-zinc-950 p-4 rounded-xl border border-gray-100 dark:border-zinc-800 min-h-[400px]">
        {tree.length === 0 ? (
          <div className="text-center text-gray-500 py-12">No notes found. Create your first book!</div>
        ) : (
          renderTree(tree)
        )}
      </div>
    </div>
  );
}
