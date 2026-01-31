"use client"

import { cn } from "@/lib/utils"

interface VideoPlayerProps {
    url: string
    className?: string
}

export function VideoPlayer({ url, className }: VideoPlayerProps) {
    if (!url) return null

    // Helper to get embed URL
    const getEmbedUrl = (url: string) => {
        // YouTube: https://www.youtube.com/watch?v=... or https://youtu.be/...
        const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)
        if (ytMatch) {
            return `https://www.youtube.com/embed/${ytMatch[1]}`
        }

        // Vimeo: https://vimeo.com/...
        const vimeoMatch = url.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/)
        if (vimeoMatch) {
            return `https://player.vimeo.com/video/${vimeoMatch[1]}`
        }

        return null
    }

    const embedUrl = getEmbedUrl(url)

    if (embedUrl) {
        return (
            <div className={cn("relative aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-2xl", className)}>
                <iframe
                    src={embedUrl}
                    className="absolute inset-0 h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="Lesson Video"
                />
            </div>
        )
    }

    // Fallback for direct video links
    return (
        <div className={cn("relative aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-2xl", className)}>
            <video
                src={url}
                controls
                className="absolute inset-0 h-full w-full"
            >
                Your browser does not support the video tag.
            </video>
        </div>
    )
}
