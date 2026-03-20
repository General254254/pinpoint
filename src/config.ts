// Site configuration
// Replace placeholder values with your own content

export interface SiteConfig {
  language: string;
  title: string;
  description: string;
}

export const siteConfig: SiteConfig = {
  language: "en",
  title: "PinPoint - Interactive Location Mapping",
  description: "PinPoint is an interactive location mapping service that allows clients to pin and manage locations with ease.",
};

// Navigation configuration
export interface NavLink {
  label: string;
  href: string;
}

export interface NavigationConfig {
  logo: string;
  links: NavLink[];
  contactLabel: string;
  contactHref: string;
}

export const navigationConfig: NavigationConfig = {
  logo: "PinPoint",
  links: [
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Portfolio", href: "#portfolio" },
    { label: "Map", href: "#map-section" },
  ],
  contactLabel: "Get Started",
  contactHref: "#cta",
};

// Hero section configuration
export interface HeroConfig {
  name: string;
  roles: string[];
  backgroundImage: string;
}

export const heroConfig: HeroConfig = {
  name: "PinPoint",
  roles: ["Location Mapping", "Interactive Pins", "Client Management", "Geo Services"],
  backgroundImage: "/images/hero-bg.jpg",
};

// About section configuration
export interface AboutStat {
  value: string;
  label: string;
}

export interface AboutImage {
  src: string;
  alt: string;
}

export interface AboutConfig {
  label: string;
  description: string;
  experienceValue: string;
  experienceLabel: string;
  stats: AboutStat[];
  images: AboutImage[];
}

export const aboutConfig: AboutConfig = {
  label: "About Us",
  description: "PinPoint is a cutting-edge location mapping platform designed to help businesses and individuals pin, organize, and manage locations with precision. Our intuitive interface combined with powerful mapping technology makes location management effortless.",
  experienceValue: "5+",
  experienceLabel: "Years of\nExperience",
  stats: [
    { value: "10K+", label: "Locations Pinned" },
    { value: "500+", label: "Happy Clients" },
    { value: "50+", label: "Cities Covered" },
  ],
  images: [
    { src: "/images/about-1.jpg", alt: "Team working on maps" },
    { src: "/images/about-2.jpg", alt: "Location analytics" },
    { src: "/images/about-3.jpg", alt: "Mobile mapping" },
    { src: "/images/about-4.jpg", alt: "Global coverage" },
  ],
};

// Services section configuration
export interface ServiceItem {
  iconName: string;
  title: string;
  description: string;
  image: string;
}

export interface ServicesConfig {
  label: string;
  heading: string;
  services: ServiceItem[];
}

export const servicesConfig: ServicesConfig = {
  label: "Our Services",
  heading: "What We Offer",
  services: [
    {
      iconName: "MapPin",
      title: "Location Pinning",
      description: "Easily pin and mark locations on an interactive map with custom labels and descriptions.",
      image: "/images/service-1.jpg",
    },
    {
      iconName: "Layers",
      title: "Layer Management",
      description: "Organize your locations with custom layers and categories for better visualization.",
      image: "/images/service-2.jpg",
    },
    {
      iconName: "Share2",
      title: "Collaborative Mapping",
      description: "Share your maps with team members and collaborate in real-time on location data.",
      image: "/images/service-3.jpg",
    },
    {
      iconName: "BarChart3",
      title: "Location Analytics",
      description: "Get insights and analytics about your pinned locations and user interactions.",
      image: "/images/service-4.jpg",
    },
  ],
};

// Portfolio section configuration
export interface ProjectItem {
  title: string;
  category: string;
  year: string;
  image: string;
  featured?: boolean;
}

export interface PortfolioCTA {
  label: string;
  heading: string;
  linkText: string;
  linkHref: string;
}

export interface PortfolioConfig {
  label: string;
  heading: string;
  description: string;
  projects: ProjectItem[];
  cta: PortfolioCTA;
  viewAllLabel: string;
}

export const portfolioConfig: PortfolioConfig = {
  label: "Our Work",
  heading: "Featured Projects",
  description: "Explore how businesses and organizations use PinPoint to manage their locations effectively.",
  projects: [
    {
      title: "City Delivery Network",
      category: "Logistics",
      year: "2024",
      image: "/images/portfolio-1.jpg",
      featured: true,
    },
    {
      title: "Restaurant Chain Mapping",
      category: "Food & Beverage",
      year: "2024",
      image: "/images/portfolio-2.jpg",
    },
    {
      title: "Real Estate Portfolio",
      category: "Real Estate",
      year: "2023",
      image: "/images/portfolio-3.jpg",
    },
    {
      title: "Event Venue Locator",
      category: "Events",
      year: "2023",
      image: "/images/portfolio-4.jpg",
    },
    {
      title: "Tourism Hotspots Guide",
      category: "Travel",
      year: "2023",
      image: "/images/portfolio-5.jpg",
    },
  ],
  cta: {
    label: "Start Your Project",
    heading: "Ready to map your world?",
    linkText: "Get in touch",
    linkHref: "#cta",
  },
  viewAllLabel: "View All Projects",
};

// Testimonials section configuration
export interface TestimonialItem {
  quote: string;
  author: string;
  role: string;
  company: string;
  image: string;
  rating: number;
}

export interface TestimonialsConfig {
  label: string;
  heading: string;
  testimonials: TestimonialItem[];
}

export const testimonialsConfig: TestimonialsConfig = {
  label: "Testimonials",
  heading: "What Our Clients Say",
  testimonials: [
    {
      quote: "PinPoint transformed how we manage our delivery routes. The interactive map makes it incredibly easy to visualize and optimize our logistics network.",
      author: "Sarah Johnson",
      role: "Operations Director",
      company: "FastTrack Logistics",
      image: "/images/testimonial-1.jpg",
      rating: 5,
    },
    {
      quote: "The ability to pin and categorize all our restaurant locations has streamlined our expansion planning. Highly recommend for any multi-location business.",
      author: "Michael Chen",
      role: "CEO",
      company: "Bistro Group",
      image: "/images/testimonial-2.jpg",
      rating: 5,
    },
    {
      quote: "PinPoint's collaborative features allow our real estate team to share property locations seamlessly. It's become an essential tool for our business.",
      author: "Emily Rodriguez",
      role: "Team Lead",
      company: "Premier Properties",
      image: "/images/testimonial-3.jpg",
      rating: 5,
    },
  ],
};

// Map section configuration
export interface MapPin {
  id: string;
  lat: number;
  lng: number;
  label: string;
}

export interface MapConfig {
  label: string;
  heading: string;
  description: string;
  defaultCenter: [number, number];
  defaultZoom: number;
  mapHeight: string;
  initialPins: MapPin[];
}

export const mapConfig: MapConfig = {
  label: "Interactive Map",
  heading: "Pin Your Locations",
  description: "Click anywhere on the map to add a new location pin. Manage your pins, add labels, and organize your locations with ease.",
  defaultCenter: [40.7128, -74.006],
  defaultZoom: 12,
  mapHeight: "550px",
  initialPins: [
    { id: "1", lat: 40.7128, lng: -74.006, label: "Headquarters" },
    { id: "2", lat: 40.7589, lng: -73.9851, label: "Branch Office" },
    { id: "3", lat: 40.7484, lng: -73.9857, label: "Client Meeting Point" },
  ],
};

// CTA section configuration
export interface CTAConfig {
  tags: string[];
  heading: string;
  description: string;
  buttonText: string;
  buttonHref: string;
  email: string;
  backgroundImage: string;
}

export const ctaConfig: CTAConfig = {
  tags: ["Location Mapping", "Interactive Pins", "Client Management"],
  heading: "Ready to start pinning?",
  description: "Get in touch with us today and discover how PinPoint can transform your location management workflow.",
  buttonText: "Start Your Free Trial",
  buttonHref: "mailto:hello@pinpoint.io",
  email: "hello@pinpoint.io",
  backgroundImage: "/images/cta-bg.jpg",
};

// Footer section configuration
export interface FooterLinkColumn {
  title: string;
  links: { label: string; href: string }[];
}

export interface SocialLink {
  iconName: string;
  href: string;
  label: string;
}

export interface FooterConfig {
  logo: string;
  description: string;
  columns: FooterLinkColumn[];
  socialLinks: SocialLink[];
  newsletterHeading: string;
  newsletterDescription: string;
  newsletterButtonText: string;
  newsletterPlaceholder: string;
  copyright: string;
  credit: string;
}

export const footerConfig: FooterConfig = {
  logo: "PinPoint",
  description: "Interactive location mapping platform for businesses and individuals. Pin, organize, and manage your world with precision.",
  columns: [
    {
      title: "Product",
      links: [
        { label: "Features", href: "#services" },
        { label: "Pricing", href: "#" },
        { label: "Integrations", href: "#" },
        { label: "API", href: "#" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "#about" },
        { label: "Blog", href: "#" },
        { label: "Careers", href: "#" },
        { label: "Contact", href: "#cta" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Documentation", href: "#" },
        { label: "Help Center", href: "#" },
        { label: "Community", href: "#" },
        { label: "Status", href: "#" },
      ],
    },
  ],
  socialLinks: [
    { iconName: "Twitter", href: "https://twitter.com", label: "Twitter" },
    { iconName: "Linkedin", href: "https://linkedin.com", label: "LinkedIn" },
    { iconName: "Github", href: "https://github.com", label: "GitHub" },
    { iconName: "Instagram", href: "https://instagram.com", label: "Instagram" },
  ],
  newsletterHeading: "Stay Updated",
  newsletterDescription: "Subscribe to our newsletter for the latest updates and features.",
  newsletterButtonText: "Subscribe",
  newsletterPlaceholder: "Enter your email",
  copyright: "© 2024 PinPoint. All rights reserved.",
  credit: "Made with precision",
};
