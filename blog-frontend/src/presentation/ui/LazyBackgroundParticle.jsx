"use client";

import dynamic from "next/dynamic";

// `ssr: false` is only allowed in client components (Next 15).
const BackgroundParticle = dynamic(() => import("./BackgroundParticle"), { ssr: false });

export default BackgroundParticle;
