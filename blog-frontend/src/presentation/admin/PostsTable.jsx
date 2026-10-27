"use client";

import React from "react";
import Link from "next/link";

export default function PostsTable({
  posts,
  isDev,
  onBroadcast,
  onTogglePublish,
  onDelete,
}) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-border">
        <thead className="bg-muted/50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
            >
              Status
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
            >
              Title
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
            >
              Stats
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
            >
              Filename
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
            >
              Type
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border bg-transparent">
          {(() => {
            // Split into parents (no series) and sub-pages (have series)
            const parents = posts.filter((p) => !p.series);
            const subPagesByParent = posts
              .filter((p) => p.series)
              .reduce((acc, p) => {
                if (!acc[p.series]) acc[p.series] = [];
                acc[p.series].push(p);
                return acc;
              }, {});
            // Also collect orphan sub-pages whose parent isn't in the list
            const parentSlugs = new Set(parents.map((p) => p.slug));
            const orphans = posts.filter(
              (p) => p.series && !parentSlugs.has(p.series),
            );

            const renderRow = (post, isSubPage = false) => (
              <tr
                key={post.filename}
                className={`hover:bg-muted/20 ${isSubPage ? "bg-muted/10" : ""}`}
              >
                <td className="whitespace-nowrap px-6 py-4">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      post.publish
                        ? "bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-400"
                    }`}
                  >
                    {post.publish ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  {isSubPage ? (
                    <div className="flex items-center gap-2 border-l-2 border-violet-300 pl-4 dark:border-violet-700">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="shrink-0 text-violet-500"
                      >
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                      <div>
                        <div className="text-sm font-medium text-foreground">
                          {post.title}
                        </div>
                        <div className="max-w-[180px] truncate text-xs text-muted-foreground">
                          {post.slug}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center gap-2 font-medium text-foreground">
                        {post.title}
                        {subPagesByParent[post.slug]?.length > 0 && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-violet-50 px-1.5 py-0.5 text-xs font-medium text-violet-700 ring-1 ring-inset ring-violet-600/20 dark:bg-violet-500/10 dark:text-violet-400 dark:ring-violet-500/20">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="9"
                              height="9"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M8 6h13" />
                              <path d="M8 12h13" />
                              <path d="M8 18h13" />
                              <path d="M3 6h.01" />
                              <path d="M3 12h.01" />
                              <path d="M3 18h.01" />
                            </svg>
                            Series · {subPagesByParent[post.slug].length}
                          </span>
                        )}
                      </div>
                      <div className="max-w-[200px] truncate text-xs text-muted-foreground">
                        {post.slug}
                      </div>
                    </div>
                  )}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1" title="Views">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-indigo-500"
                      >
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      {post.views || 0}
                    </span>
                    <span className="flex items-center gap-1" title="Likes">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-rose-500"
                      >
                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                      </svg>
                      {post.likes || 0}
                    </span>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">
                  {post.filename}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm capitalize text-muted-foreground">
                  {isSubPage ? (
                    <span className="font-medium text-violet-500">
                      sub-page
                    </span>
                  ) : (
                    post.type
                  )}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-3">
                    <Link
                      href={`/blogs/${post.series ? `${post.series}/${post.slug}` : post.slug}?preview=true`}
                      target="_blank"
                      className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                      title="Preview"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </Link>
                    {isDev && (
                      <>
                        {!isSubPage && (
                          <button
                            onClick={() => onBroadcast(post.filename)}
                            className="text-amber-600 hover:text-amber-900 dark:text-amber-400 dark:hover:text-amber-300"
                            title="Broadcast Newsletter"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="m22 2-7 20-4-9-9-4Z" />
                              <path d="M22 2 11 13" />
                            </svg>
                          </button>
                        )}
                        {!isSubPage && (
                          <Link
                            href={`/admin/new?series=${post.slug}`}
                            className="text-emerald-600 hover:text-emerald-900 dark:text-emerald-400 dark:hover:text-emerald-300"
                            title="Add Sub-page"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M5 12h14" />
                              <path d="M12 5v14" />
                            </svg>
                          </Link>
                        )}
                        <Link
                          href={`/admin/edit/${post.filename}`}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          title="Edit"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M12 20h9" />
                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                          </svg>
                        </Link>
                        <button
                          onClick={() =>
                            onTogglePublish(post.filename, post.publish)
                          }
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                          title={post.publish ? "Unpublish" : "Publish"}
                        >
                          {post.publish ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
                              <line x1="2" x2="22" y1="2" y2="22" />
                            </svg>
                          )}
                        </button>
                        <button
                          onClick={() => onDelete(post.filename)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          title="Delete"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M3 6h18" />
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                            <line x1="10" x2="10" y1="11" y2="17" />
                            <line x1="14" x2="14" y1="11" y2="17" />
                          </svg>
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            );

            return (
              <>
                {parents.map((post) => (
                  <React.Fragment key={post.filename}>
                    {renderRow(post, false)}
                    {(subPagesByParent[post.slug] || [])
                      .sort(
                        (a, b) => (a.seriesOrder || 0) - (b.seriesOrder || 0),
                      )
                      .map((sub) => renderRow(sub, true))}
                  </React.Fragment>
                ))}
                {orphans.map((post) => renderRow(post, true))}
              </>
            );
          })()}
          {posts.length === 0 && (
            <tr>
              <td
                colSpan="6"
                className="px-6 py-12 text-center text-muted-foreground"
              >
                No posts found. Create one to get started!
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
