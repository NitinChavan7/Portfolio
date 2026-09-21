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
      "Nitin brings clarity, ownership, and calm execution to the work. He pays attention to details and keeps communication steady throughout delivery.",
  },
  {
    name: "Shirish Yenganti",
    image: "/images/testimonials/shirish-yenganti.png",
    quote:
      "Nitin handles frontend implementation with care. His work is reliable, reusable, and aligned with the product requirement instead of only the screen.",
  },
  {
    name: "Muzzamil Shaikh",
    image: "/images/testimonials/muzzamil-shaikh.png",
    quote:
      "Nitin is easy to collaborate with because he thinks through the requirement, debugs patiently, and responds quickly when changes are needed.",
  },
  {
    name: "Muzammil Alloli",
    image: "/images/testimonials/muzammil-alloli.png",
    quote:
      "Nitin turns requirements into usable product screens with solid execution, clear user flows, and dependable follow-through.",
  },
];
