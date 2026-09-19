export type Testimonial = {
  name: string;
  quote: string;
  image: string;
  role?: string;
  company?: string;
  link?: string;
};
export const testimonials: Testimonial[] = [
  {
    name: "Rahul Chavan",
    image: "/images/testimonials/rahul-chavan.jpg",
    quote:
      "Working with Nitin was a fantastic experience. His attention to detail, ownership, and steady communication helped the work move with strong quality.",
  },
  {
    name: "Shirish Yenganti",
    image: "/images/testimonials/shirish-yenganti.png",
    quote:
      "Highly impressed with Nitin's work. He handled frontend details carefully and stayed focused on reliable, reusable implementation.",
  },
  {
    name: "Muzzamil Shaikh",
    image: "/images/testimonials/muzzamil-shaikh.png",
    quote:
      "An excellent experience from start to finish. Nitin's thoughtful approach, debugging discipline, and responsiveness made collaboration smooth.",
  },
  {
    name: "Muzammil Alloli",
    image: "/images/testimonials/muzammil-alloli.png",
    quote:
      "Nitin translated requirements into working product screens with strong execution and practical attention to user flows.",
  },
];
