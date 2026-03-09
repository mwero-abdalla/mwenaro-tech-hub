"use client";

import React, { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { useTheme } from "next-themes";

export default function Mermaid({ chart }: { chart: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const [svg, setSvg] = useState<string>("");
    const { resolvedTheme } = useTheme();

    useEffect(() => {
        mermaid.initialize({
            startOnLoad: false,
            theme: resolvedTheme === 'dark' ? 'dark' : 'default',
            securityLevel: 'loose',
            fontFamily: 'inherit',
        });

        const renderChart = async () => {
            const id = `mermaid-${Math.random().toString(36).substring(2, 9)}`;
            try {
                const { svg } = await mermaid.render(id, chart);
                setSvg(svg);
            } catch (error) {
                console.error("Failed to render Mermaid chart:", error);
            }
        };

        if (chart) {
            renderChart();
        }
    }, [chart, resolvedTheme]);

    if (!svg) {
        return <div className="animate-pulse h-32 bg-zinc-100 dark:bg-zinc-800 rounded-xl" />;
    }

    return (
        <div 
            ref={ref} 
            className="my-8 flex justify-center py-6 px-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-x-auto shadow-sm"
            dangerouslySetInnerHTML={{ __html: svg }} 
        />
    );
}
