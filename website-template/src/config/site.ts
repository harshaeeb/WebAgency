// src/config/site.ts
//
// Only Paws TX — client configuration
// All client-specific content lives here. Never hard-code business details in components.

export interface Service {
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  image?: string;
}

export interface SiteImages {
  hero?: string;
  about?: string;
}

export interface Testimonial {
  name: string;
  role?: string;
  text: string;
  rating?: number;
}

export interface SiteTheme {
  headerStyle?: "white" | "brand";
  heroLayout?: "split" | "centered";
  heroPattern?: boolean;
  footerStyle?: "dark" | "brand";
  showTrustBar?: boolean;
  roundness?: "sm" | "md" | "lg" | "full";
}

export interface SiteConfig {
  business: string;
  tagline: string;
  heroEyebrow?: string;
  phone: string;
  phoneDisplay: string;
  email: string;
  emailDomain: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  serviceAreas: string[];
  services: Service[];
  images: SiteImages;
  brandColor: string;
  yearsInBusiness: number;
  googleReviewLink: string;
  googleRating: number;
  googleReviewCount: number;
  footerTagline?: string;
  theme?: SiteTheme;
  testimonials?: Testimonial[];
  features: {
    reviewsWidget: boolean;
    booking: boolean;
    smsForwarding: boolean;
  };
  calLink: string;
  ownerCell: string;
}

export const site: SiteConfig = {
  business: "Only Paws TX",
  tagline: "Premium pet grooming & boarding — where every pet gets the royal treatment",
  heroEyebrow: "North Dallas's Favorite Pet Spa",
  phone: "+19725550199",
  phoneDisplay: "(972) 555-0199",
  email: "hello@onlypawstx.com",
  emailDomain: "onlypawstx.com",
  address: "5200 Legacy Drive, Frisco, TX 75034",
  city: "Frisco",
  state: "TX",
  zip: "75034",
  serviceAreas: ["Frisco", "Plano", "McKinney", "Allen", "Prosper", "Little Elm", "The Colony"],

  services: [
    {
      name: "Full-Service Dog Grooming",
      slug: "dog-grooming",
      shortDescription: "Bath, breed-specific haircut, blow dry, nail trim, ear cleaning — your pup leaves looking and smelling their best.",
      description:
        "Our signature full-service groom includes a relaxing bath with premium shampoo and conditioner, professional blow dry and brush out, breed-specific haircut, ear cleaning and plucking, nail trim and filing, paw pad conditioning, and a fresh spritz or bandana. We take our time — no rushing, no stress. Every dog is treated like the star they are. Pricing is based on breed, coat condition, and size.",
    },
    {
      name: "Bath & Brush Out",
      slug: "bath-and-brush",
      shortDescription: "Deep conditioning bath, blow dry, and full brush out — perfect between full grooms to keep coats healthy and mat-free.",
      description:
        "Not every visit needs a full haircut. Our Bath & Brush Out includes a deep conditioning bath, professional blow dry, thorough brush out to remove loose fur and prevent matting, nail trim, and ear cleaning. Ideal for double-coated breeds like Huskies and Goldens, senior dogs who need gentle handling, or any dog due for a refresh. A great option to keep your pet looking and feeling clean between full grooms.",
    },
    {
      name: "Dog Boarding",
      slug: "dog-boarding",
      shortDescription: "Private, comfortable suites for overnight stays — your dog rests easy while you travel worry-free.",
      description:
        "Our boarding suites are designed for dogs who deserve more than a cold kennel. Each dog gets their own private suite with a raised cot, cozy bedding, and personal attention from our staff throughout the day. We include three outdoor potty breaks and two supervised play sessions daily. Feeding follows your dog's normal schedule using their food from home. We're happy to send photos and updates — because we know you miss them.",
    },
    {
      name: "Doggy Daycare",
      slug: "doggy-daycare",
      shortDescription: "Supervised play and socialization all day — tired, happy pups are the best kind.",
      description:
        "Doggy Daycare at Only Paws TX means a full day of supervised play, healthy socialization, and structured rest in a safe, enriching environment. Dogs are grouped by size and temperament, and our staff monitors playtime constantly. We build in rest periods so your dog doesn't overdo it. Drop off in the morning, pick up a happy, tired pup in the evening. Perfect for working pet parents who want the best for their dogs during the day.",
    },
    {
      name: "Nail Trim & Grinding",
      slug: "nail-trim",
      shortDescription: "Quick, gentle nail trims with optional grinding for smooth edges — walk-ins welcome.",
      description:
        "Overgrown nails can cause pain, posture problems, and even long-term joint issues. Our nail trim service is quick, gentle, and stress-free — we work at your dog's pace and never rush. Add on nail grinding for smooth, snag-free edges that last longer between trims and are safer for your floors and furniture. No appointment needed for nail-only services during regular business hours — just walk in.",
    },
    {
      name: "Cat Grooming",
      slug: "cat-grooming",
      shortDescription: "Gentle, stress-reduced grooming for cats — baths, lion cuts, dematting, and nail trims.",
      description:
        "We love cats too — and we know they're not just small dogs. Cat grooming sessions are scheduled separately from dogs to keep the environment calm and quiet. Services include baths, blow dry, lion cuts, sanitary trims, dematting, nail trims, and ear cleaning. Our groomers are trained in low-stress feline handling techniques. We take our time, go at your cat's pace, and never force what isn't working. Cats deserve patience, not a rushed appointment.",
    },
  ],

  images: {
    // Place client photos in public/images/ and set paths here
    // hero: "/images/hero.jpg",
    // about: "/images/about.jpg",
  },

  brandColor: "#7c3aed",
  yearsInBusiness: 8,
  googleReviewLink: "https://g.page/r/PLACEHOLDER/review",
  googleRating: 4.9,
  googleReviewCount: 156,

  footerTagline: "Premium pet grooming & boarding in Frisco, TX and the North Dallas area.",

  testimonials: [
    {
      name: "Sarah M.",
      role: "Dog Mom, Frisco TX",
      text: "My golden retriever Max has been coming to Only Paws for 3 years. They always take their time with him, and he comes home looking absolutely gorgeous. I love that they send a photo when he's done!",
      rating: 5,
    },
    {
      name: "Carlos R.",
      role: "Pet Parent, Plano TX",
      text: "Best doggy daycare in North Dallas, hands down. My two labs come home exhausted (in the best way), and the staff clearly loves what they do. I trust Only Paws TX completely with my boys.",
      rating: 5,
    },
    {
      name: "Jennifer T.",
      role: "Cat Mom, McKinney TX",
      text: "I was nervous about grooming my Persian — she's not easy. But the team here was incredibly patient and gentle. The lion cut is perfect and she barely seemed stressed. We'll definitely be back!",
      rating: 5,
    },
  ],

  theme: {
    headerStyle: "white",
    heroLayout: "split",
    heroPattern: true,
    footerStyle: "dark",
    showTrustBar: true,
    roundness: "lg",
  },

  features: {
    reviewsWidget: false,
    booking: false,
    smsForwarding: false,
  },

  calLink: "",
  ownerCell: "",
};
