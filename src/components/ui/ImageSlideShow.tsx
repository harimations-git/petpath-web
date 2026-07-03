import { useEffect, useState } from "react";
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
  intervalMs =  4500,
  className = "",
}: ImageSlideshowProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [slides.length, intervalMs]);

  return (
    <section className={`image-slideshow ${className}`}>
      {slides.map((slide, index) => (
        <img
          key={slide.image}
          src={slide.image}
          alt={slide.alt ?? ""}
          className={`slideshow-image ${index === activeIndex ? "active" : ""}`}
        />
      ))}

      <div className="slideshow-overlay" />

      {slides.map((slide, index) => (
        <h2
          key={`${slide.image}-text`}
          className={`slideshow-text ${index === activeIndex ? "active" : ""}`}
        >
          <span>{slide.text}</span>
        </h2>
      ))}
    </section>
  );
}