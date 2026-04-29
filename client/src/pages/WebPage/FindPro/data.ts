import type { Contractor } from "./ContractorCard";
import type { Offer } from "./OffersCarousel";

export const CONTRACTORS: Contractor[] = [
  {
    id: 1,
    name: "Icon Roofing and Construction",
    rating: 4.9,
    reviews: 140,
    elite: true,
    projectsRegistered: 3,
    services: ["Roofing", "Painting", "Gutters"],
    extraServicesCount: 6,
    distanceMiles: 17,
    locationLabel: "Oklahoma City, OK, 73131",
    // Coordenadas reales para Oklahoma City
    lat: 35.4676,
    lng: -97.5164,
    quote: {
      author: "John Sowers",
      text: "I was at my wits end with roofing companies, but I'm glad I heard Dillon out when he knocked on my door. Dillon was prof...",
    },
  },
  {
    id: 2,
    name: "Luxor Roof & Home",
    rating: 5,
    reviews: 41,
    elite: true,
    projectsRegistered: 1,
    services: ["Roofing", "Handyman", "Gutters"],
    extraServicesCount: 1,
    distanceMiles: 4,
    locationLabel: "Oklahoma City, OK, 73131",
    // Coordenadas ligeramente diferentes para mostrar múltiples puntos
    lat: 35.4826,
    lng: -97.5345,
    quote: {
      author: "Elaine Hobson",
      text: "I was lucky enough to work with Jason twice! He put a hail-resistant roof and was amazing to work with...",
    },
  },
  {
    id: 3,
    name: "Oklahoma Home Builders",
    rating: 4.7,
    reviews: 89,
    elite: false,
    projectsRegistered: 5,
    services: ["Construction", "Remodeling", "Electrical"],
    extraServicesCount: 3,
    distanceMiles: 8,
    locationLabel: "Edmond, OK, 73013",
    lat: 35.6528,
    lng: -97.4781,
    quote: {
      author: "Sarah Johnson",
      text: "Professional service and quality work. Highly recommend for home renovation projects...",
    },
  },
  {
    id: 4,
    name: "Premier Plumbing Solutions",
    rating: 4.8,
    reviews: 67,
    elite: true,
    projectsRegistered: 2,
    services: ["Plumbing", "Water Heaters", "Drain Cleaning"],
    extraServicesCount: 4,
    distanceMiles: 12,
    locationLabel: "Norman, OK, 73019",
    lat: 35.2226,
    lng: -97.4395,
    quote: {
      author: "Mike Davis",
      text: "Quick response time and fair pricing. Fixed our plumbing emergency same day...",
    },
  },
  {
    id: 5,
    name: "Elite Landscaping & Irrigation",
    rating: 4.6,
    reviews: 124,
    elite: false,
    projectsRegistered: 7,
    services: ["Landscaping", "Irrigation", "Tree Services"],
    extraServicesCount: 2,
    distanceMiles: 6,
    locationLabel: "Moore, OK, 73160",
    lat: 35.3395,
    lng: -97.4867,
    quote: {
      author: "Lisa Thompson",
      text: "Transformed our backyard into a beautiful outdoor space. Excellent attention to detail...",
    },
  },
];

export const OFFERS: Offer[] = [
  { id: 1, title: "10% off roof inspection" },
  { id: 2, title: "Seasonal gutter cleaning" },
  { id: 3, title: "Free skylight check" },
];
