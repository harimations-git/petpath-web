import labrador from "../../public/images/auth/labrador-forest-slideshow.jpg";
import husky from "../../public/images/auth/husky-slideshow.jpg";
import cat1 from "../../public/images/auth/cat-slideshow.jpg";
import cat2 from "../../public/images/auth/cat-2-slideshow.jpg";
import cat3 from "../../public/images/auth/cat-3-slideshow.jpg";
import guineaPig from "../../public/images/auth/guinea-pig-slideshow.jpg";

import type { Slide } from "../components/ui/ImageSlideShow";

export const loginSlideshowContent = [
    {
        image: labrador,
        text: "We prioritise helping shelters and charities advertise pets in need of loving homes",
    },
    {
        image: cat1,
        text: "Create clear listings that help adopters make responsible choices",
    },
    {
        image: husky,
        text: "Keep pet information accurate, trusted and easy to manage",
    },
    {
        image: guineaPig,
        text: "Idk lol",
    },
    {
        image: cat2,
        text: "Idk lol",
    },
    {
        image: cat3,
        text: "Idk lol",
    },
] satisfies Slide[];