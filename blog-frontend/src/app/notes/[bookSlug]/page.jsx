import { redirect } from "next/navigation";
import { noteService } from "@/core";

export default async function BookIndexPage({ params }) {
  const { bookSlug } = params;
  
  const tree = await noteService.getNoteTree(bookSlug);
  const flat = noteService.flattenTree(tree);
  
  if (flat.length > 0) {
    // Redirect to the first file in the book
    const firstNode = flat[0];
    redirect(`/notes/${bookSlug}/${firstNode.path.join('/')}`);
  }
  
  return (
    <div className="py-12 text-center">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">This book is empty</h2>
      <p className="mt-2 text-gray-600 dark:text-gray-400">There are no notes found in this directory.</p>
    </div>
  );
}
