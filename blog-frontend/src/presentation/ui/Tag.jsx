import Link from "next/link";

const Tag = ({ text, color, id }) => {
  if (text === undefined) return;

  const background = color || "#e0e0e0"; // fallback to light gray
  const textColor =
    background === "#ffffff" || background === "#fff" ? "black" : "white";

  return (
    <Link
      href={`/search?tag=${text}`}
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors duration-150 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-2`}
      style={{
        backgroundColor: background,
        color: textColor,
      }}
    >
      <span>{text.split(" ").join("-")}</span>
    </Link>
  );
};

export default Tag;
