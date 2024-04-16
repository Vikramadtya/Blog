import Link from "next/link";

const colors = {
  1: "border-blue-400 bg-blue-100 text-blue-800",
  2: "border-gray-500 bg-gray-100 text-gray-800",
  3: "border-red-400 bg-red-100 text-red-800",
  4: "border-green-400 bg-green-100 text-green-800",
  5: "border-yellow-300 bg-yellow-100 text-yellow-800",
  6: "border-indigo-400 bg-indigo-100 text-indigo-800",
  7: "border-purple-400 bg-purple-100 text-purple-800",
  8: "border-pink-400 bg-pink-100 text-pink-800",
};

const Tag = ({ text, id }) => {
  let color = colors[id];
  return (
    <Link
      href={`/tags`}
      className={`me-2 rounded border ${color} px-2.5 py-0.5 text-xs font-medium `}
    >
      <span>{text.split(" ").join("-")}</span>
    </Link>
  );
};

export default Tag;
