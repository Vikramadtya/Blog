import { notFound } from "next/navigation";
import { noteService } from "@/core";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getMDXComponents } from "@/presentation/ui/MdxComponents";
import { rehypePrettyCode } from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { prettyCodeOptions } from "@/lib/markdownConstants";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

export async function generateMetadata({ params }) {
  const { bookSlug, slug } = params;
  const noteData = await noteService.getNote(bookSlug, slug);
  if (!noteData) return {};

  return {
    title: noteData.title,
    description: noteData.metadata?.description || noteData.title,
  };
}

import Link from "next/link";
import notesConfig from "../../../../../config/notes.json";
import { getNotesTree,  } from "@/core";

export default async function NotePage({ params }) {
  const { bookSlug, slug } = params;
  
  const noteData = await noteService.getNote(bookSlug, slug);
  
  if (!noteData) {
    notFound();
  }

  const bookConfig = notesConfig.find(b => b.link.endsWith(bookSlug));
  const bookTitle = bookConfig ? bookConfig.title : bookSlug.replace(/-/g, " ");

  const tree = await noteService.getNoteTree(bookSlug);
  const flatTree = noteService.flattenTree(tree);
  
  const currentPathStr = slug.join("/");
  const currentIndex = flatTree.findIndex(node => node.path.join("/") === currentPathStr);
  
  const prevNode = currentIndex > 0 ? flatTree[currentIndex - 1] : null;
  const nextNode = currentIndex !== -1 && currentIndex < flatTree.length - 1 ? flatTree[currentIndex + 1] : null;

  // Next-mdx-remote options
  const options = {
    mdxOptions: {
      remarkPlugins: [remarkGfm, remarkMath],
      rehypePlugins: [
        rehypeKatex,
        [rehypePrettyCode, prettyCodeOptions],
        rehypeSlug,
        [
          rehypeAutolinkHeadings,
          {
            behavior: "wrap",
            properties: { className: ["anchor"] },
          },
        ],
      ],
    },
  };

  return (
    <div className="max-w-3xl mx-auto xl:max-w-4xl pt-4 pb-12">
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm font-medium text-blue-500 dark:text-blue-400">
          <Link href={`/notes/${bookSlug}`} className="hover:underline">
            {bookTitle}
          </Link>
        </div>
      </div>

      <article className="prose prose-neutral dark:prose-invert max-w-none mb-16">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-8">
          {noteData.title}
        </h1>
        <MDXRemote
          source={noteData.content}
          components={getMDXComponents()}
          options={options}
        />
      </article>

      {/* Pagination */}
      <div className="mt-12 flex border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden divide-x divide-gray-200 dark:divide-zinc-800">
        {prevNode ? (
          <Link href={`/notes/${bookSlug}/${prevNode.path.join("/")}`} className="flex-1 p-6 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors flex flex-col items-start text-left">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Previous</span>
            <span className="text-base font-semibold text-blue-600 dark:text-blue-400">{prevNode.title}</span>
          </Link>
        ) : (
          <div className="flex-1 p-6" />
        )}
        
        {nextNode ? (
          <Link href={`/notes/${bookSlug}/${nextNode.path.join("/")}`} className="flex-1 p-6 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors flex flex-col items-end text-right">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Next</span>
            <span className="text-base font-semibold text-blue-600 dark:text-blue-400">{nextNode.title}</span>
          </Link>
        ) : (
          <div className="flex-1 p-6" />
        )}
      </div>
    </div>
  );
}
