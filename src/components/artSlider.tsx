import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ArtSliderProps {
    images: string[];
    alt: string;
    interval?: number;
    paused?: boolean;
}

export default function ArtSlider({ images, alt, interval = 3500, paused = false }: ArtSliderProps) {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        if (images.length <= 1 || paused) return;
        const id = setInterval(() => setCurrent((c) => (c + 1) % images.length), interval);
        return () => clearInterval(id);
    }, [images.length, interval, paused]);

    if (images.length === 0) return null;

    const primary = images[0];

    return (
        <div className="relative w-full overflow-hidden">
            <img
                src={primary}
                alt={alt}
                loading="lazy"
                decoding="async"
                className="h-auto w-full"
            />
            {images.slice(1).map((url, i) => (
                <img
                    key={url}
                    src={url}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className={cn(
                        "absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
                        current === i + 1 ? "opacity-100" : "opacity-0",
                    )}
                />
            ))}
            {images.length > 1 && (
                <div className="absolute left-3 top-3 flex gap-1.5">
                    {images.map((_, i) => (
                        <span
                            key={i}
                            className={cn(
                                "h-1.5 rounded-full bg-white/70 shadow-sm transition-all duration-300",
                                i === current ? "w-4" : "w-1.5 opacity-50",
                            )}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}