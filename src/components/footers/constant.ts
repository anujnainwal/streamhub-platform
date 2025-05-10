import {
  Film,
  Tv,
  Bookmark,
  Headphones,
  CreditCard,
  Home,
  User,
  Mail,
} from "lucide-react";

interface FooterItem {
  title: string;
  items: {
    label: string;
    href: string;
    icon?: any;
  }[];
}

export const exploreItems: FooterItem = {
  title: "Explore",
  items: [
    {
      label: "Movies",
      href: "/movies",
      icon: Film,
    },
    {
      label: "Series",
      href: "/series",
      icon: Tv,
    },
    {
      label: "Watchlist",
      href: "/watchlist",
      icon: Bookmark,
    },
    {
      label: "Podcasts",
      href: "/podcasts",
      icon: Headphones,
    },
  ],
};

export const accountItems: FooterItem = {
  title: "Account",
  items: [
    {
      label: "Choose a plan",
      href: "/plans",
      icon: CreditCard,
    },
    {
      label: "Landing Page",
      href: "/",
      icon: Home,
    },
    {
      label: "My Account",
      href: "/account",
      icon: User,
    },
    {
      label: "Contact",
      href: "/contact",
      icon: Mail,
    },
  ],
};

export const contactItems: FooterItem = {
  title: "Contact",
  items: [
    {
      label: "66 Brooklyn Street, NY",
      href: "#",
    },
    {
      label: "United States",
      href: "#",
    },
    {
      label: "1-800-123-4567",
      href: "tel:1-800-123-4567",
    },
    {
      label: "help@company.com",
      href: "mailto:help@company.com",
    },
  ],
};
