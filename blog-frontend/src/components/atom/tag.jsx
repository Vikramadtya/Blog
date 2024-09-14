import Link from "next/link";

const Tag = ({ text, color }) => {
  return (
    <Link
      href={`/tags`}
      className={`me-2 rounded border ${color} px-2.5 py-0.5 text-xs font-medium `}
      style={{ backgroundColor: `${color}` }}
    >
      <span>{text.split(" ").join("-")}</span>
    </Link>
  );
};

export default Tag;
