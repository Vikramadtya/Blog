"use client";

import dynamic from "next/dynamic";

// Mermaid is heavy; only load it on pages that actually render a diagram.
const Mermaid = dynamic(() => import("./Mermaid"), { ssr: false });

export default Mermaid;
