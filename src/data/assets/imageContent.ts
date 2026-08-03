import cat1 from "../../assets/auth/cat-slideshow.jpg";
import cat2 from "../../assets/auth/cat-2-slideshow.jpg";
import cat3 from "../../assets/auth/cat-3-slideshow.jpg";

import dog1 from "../../assets/auth/labrador-forest-slideshow.jpg";
import dog2 from "../../assets/auth/grass-dog-slideshow.jpg";
import dog3 from "../../assets/auth/dog-3-slideshow.jpg";
import dog4 from "../../assets/auth/dog-4-slideshow.jpg";
import puppy from "../../assets/auth/puppy-slideshow.jpg";

import rabbit from "../../assets/auth/rabbit-slideshow.jpg";

import guineaPig from "../../assets/auth/guinea-pig-slideshow.jpg";
import guineaPig2 from "../../assets/auth/guinea-pig-2-slideshow.jpg";
import guineaPig3 from "../../assets/auth/guinea-pig-3-slideshow.jpg";
import guineaPig4 from "../../assets/auth/guinea-pig-4-slideshow.jpg";
import guineaPig5 from "../../assets/auth/guinea-pig-5-slideshow.jpg";

import catDog from "../../assets/auth/cat-dog-slideshow.jpg";
import catTower from "../../assets/auth/cat-tower-slideshow.jpg";
import dogGuineaPig from "../../assets/auth/dog-guinea-pig-slideshow.jpg";

import rescue from "../../assets/auth/rescue-animal-slideshow.jpg";

import type { Slide } from "../../components/ui/decorative/ImageSlideShow";

// Store the images in the order they should appear.
const loginSlideshowImages = [
    dog1,
    guineaPig3,
    rescue,
    rabbit,
    guineaPig2,
    puppy,
    cat2,
    dog4,
    catDog,
    cat1,
    dog2,
    dogGuineaPig,
    catTower,
    guineaPig,
    guineaPig4,
    cat3,
    guineaPig5,
    dog3,
];

// Converts each image into a slide object and map them to display them
export const loginSlideshowContent =
    loginSlideshowImages.map(
        (image): Slide => ({
            image,
        })
    );