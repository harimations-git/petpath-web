import {
    useEffect,
    useState,
} from "react";

import "./ImageSlideShow.css";

export type Slide = {
    image: string;
    text?: string;
    alt?: string;
};

type ImageSlideshowProps = {
    slides: Slide[];
    intervalMs?: number;
    className?: string;
};

export default function ImageSlideshow({
    slides,
    intervalMs = 4500,
    className = "",
}: ImageSlideshowProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [firstImageLoaded, setFirstImageLoaded] = useState(false);
    const [shouldLoadAllSlides, setShouldLoadAllSlides] = useState(false);

    useEffect(() => {
        setActiveIndex(0);
        setFirstImageLoaded(false);
        setShouldLoadAllSlides(false);
    }, [slides]);

    /*
     * Load the rest of the slideshow after the first
     * visible image has appeared.
     */
    useEffect(() => {
        if (
            !firstImageLoaded ||
            slides.length <= 1
        ) {
            return;
        }

        const timer = window.setTimeout(() => {
            setShouldLoadAllSlides(true);
        }, 600);

        return () =>
            window.clearTimeout(timer);
    }, [
        firstImageLoaded,
        slides.length,
    ]);

    /*
     * Do not start changing slides until the rest
     * have had a chance to load.
     */
    useEffect(() => {
        if (
            !shouldLoadAllSlides ||
            slides.length <= 1
        ) {
            return;
        }

        const timer = window.setInterval(() => {
            setActiveIndex(
                (current) =>
                    (current + 1) % slides.length
            );
        }, intervalMs);

        return () =>
            window.clearInterval(timer);
    }, [
        shouldLoadAllSlides,
        slides.length,
        intervalMs,
    ]);

    if (slides.length === 0) {
        return null;
    }

    const visibleSlides =
        shouldLoadAllSlides
            ? slides
            : slides.slice(0, 1);

    return (
        <section className={`image-slideshow ${className}`}>
            {visibleSlides.map((slide, index) => (
                <img
                    key={`${slide.image}-${index}`}
                    src={slide.image}
                    alt={slide.alt ?? ""}
                    className={`slideshow-image ${
                        index === activeIndex
                            ? "active"
                            : ""
                    }`}
                    loading={index === 0 ? "eager" : "lazy"}
                    decoding="async"
                    onLoad={
                        index === 0
                            ? () => setFirstImageLoaded(true)
                            : undefined
                    }
                />
            ))}

            <div className="slideshow-overlay" />

            {shouldLoadAllSlides &&
                slides.map((slide, index) =>
                    slide.text ? (
                        <h2
                            key={`${slide.image}-text-${index}`}
                            className={`slideshow-text ${
                                index === activeIndex
                                    ? "active"
                                    : ""
                            }`}
                        >
                            <span>{slide.text}</span>
                        </h2>
                    ) : null
                )}
        </section>
    );
}