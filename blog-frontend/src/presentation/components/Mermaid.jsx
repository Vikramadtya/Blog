"use client";

import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { useTheme } from 'next-themes';

export default function Mermaid({ chart }) {
  const [svg, setSvg] = useState('');
  const id = useRef(`mermaid-${Math.random().toString(36).substring(2, 9)}`);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: resolvedTheme === 'dark' ? 'dark' : 'default',
      securityLevel: 'loose',
    });

    const renderChart = async () => {
      try {
        const { svg: renderedSvg } = await mermaid.render(id.current, chart);
        setSvg(renderedSvg);
      } catch (err) {
        console.error('Mermaid render error:', err);
        setSvg(`<div class="text-red-500 p-4 border border-red-500 rounded">Failed to render diagram</div>`);
      }
    };

    if (chart) {
      renderChart();
    }
  }, [chart, resolvedTheme]);

  if (!svg) {
    return <div className="animate-pulse bg-muted h-32 rounded-lg flex items-center justify-center text-sm text-muted-foreground my-8">Loading diagram...</div>;
  }

  return (
    <div className="flex justify-center my-8 overflow-x-auto" dangerouslySetInnerHTML={{ __html: svg }} />
  );
}
