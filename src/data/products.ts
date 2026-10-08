export type ProductCategory =
  | "Choma"
  | "Meals"
  | "Combos"
  | "Sides"
  | "Butchery";

export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  badge?: string;
  portion: string;
  image: string;
  popular?: boolean;
};

export const products: Product[] = [
  // ---- CHOMA ----
  {
    id: 1,
    name: "Pork Choma Half Kilo",
    description: "Flame-grilled pork, seasoned the Halisi way and served hot.",
    price: 400,
    category: "Choma",
    badge: "Bestseller",
    portion: "500 g",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxUTynD4UhSWRJbJa1RIRLFGzpneeCkzFFZ1NSmAs2Tg&s=10",
    popular: true,
  },
  {
    id: 2,
    name: "Pork Choma honey glazed",
    description: "A full kilo of our signature grilled pork , honey glazed.",
    price: 750,
    category: "Choma",
    portion: "1 kg",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRXRFlxOd9qew4hxZnGGR8vtbeqdZMfrmMnPsmX9tan1dAADTkgsLiZeaG&s=10",
    popular: true,
  },

  // ---- MEALS ----
  {
    id: 3,
    name: "Pork Ribs",
    description: "Tender ribs, charred at the edges, full of flavour.",
    price: 650,
    category: "Meals",
    portion: "One portion",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTeB83oG9AXD1xZ1yPk_N4lf8dMlyt0pmrYWbZc09UhI8kS6WzqPTyAK71&s=10",
    popular: true,
  },
  {
    id: 4,
    name: "Pork Chops",
    description: "Thick-cut chops, grilled and finished with house spice.",
    price: 600,
    category: "Meals",
    portion: "One portion",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-BVmW_-IauvL6aisknm1xvlU0Bf6kAp8iTYI9Ish76RKY-oMVWHVnyBVx&s=10",
  },
  {
    id: 5,
    name: "Pork Steak",
    description: "Juicy pork steak, seared and served with your choice of side.",
    price: 650,
    category: "Meals",
    badge: "Popular",
    portion: "One portion",
    image: "public/assets/menu/chomapork.jpeg",
  },
  {
    id: 6,
    name: "Pork Sausage",
    description: "Homemade pork sausages, grilled to order.",
    price: 400,
    category: "Meals",
    portion: "One portion",
    image: "https://artcaffe.co.ke/cdn/shop/files/seasoned-chips-sausage-7747130.jpg?v=1789081229",
  },
  {
    id: 7,
    name: "Pork Curry",
    description: "Slow-cooked pork in a rich, spiced curry sauce.",
    price: 550,
    category: "Meals",
    portion: "One portion",
    image: "https://i.ytimg.com/vi/0WTFskZe5Cs/maxresdefault.jpg",
  },
  {
    id: 8,
    name: "Pork Mixed",
    description: "A bit of everything: ribs, chops, sausage and more.",
    price: 800,
    category: "Meals",
    badge: "Chef's pick",
    portion: "One portion",
    image: "public/assets/menu/ChipsvurugaPH.jpeg",
  },

  // ---- COMBOS ----
  {
    id: 9,
    name: "Pork Roasted",
    description: "Slow-roasted pork, carved and served with kachumbari.",
    price: 700,
    category: "Combos",
    badge: "Weekend special",
    portion: "One portion",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuSrHR8YVM19bxfKXLXEdpyRzm5X1g1epRDJAmRYhDRf5YzZ03JGLvhL0p&s=10",
  },
  {
    id: 10,
    name: "Halisi Family Platter",
    description: "Ribs, chops, sausage, chips and kachumbari. Built to share.",
    price: 2400,
    category: "Combos",
    badge: "Serves three to four",
    portion: "Family",
    image: "https://sonder.sg/cdn/shop/files/IMG_1296a.jpg?v=1703147759&width=1946",
    popular: true,
  },

  // ---- SIDES ----
  {
    id: 11,
    name: "Ugali",
    description: "Freshly made ugali, the classic companion.",
    price: 100,
    category: "Sides",
    portion: "One serving",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRASnSpPCWmay6PnIn2-sIfk3PBP1NZskMew4Hjk7tDj37JQsk2hqXRAKEl&s=10",
  },
  {
    id: 12,
    name: "Chips",
    description: "Golden, crisp and freshly fried.",
    price: 200,
    category: "Sides",
    portion: "Regular",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCWzRS_KaVibbvi1I1swzO1eQRlDpj6_MEGnnFtEWfsezTSG3HBzbw35g&s=10",
    popular: true,
  },
  // {
  //   id: 13,
  //   name: "Rice",
  //   description: "Steamed white rice.",
  //   price: 150,
  //   category: "Sides",
  //   portion: "One serving",
  //   image: "/assets/menu/rice.jpg",
  // },
  {
    id: 14,
    name: "Chapati",
    description: "Soft, layered chapati.",
    price: 50,
    category: "Sides",
    portion: "One piece",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStYbNuNF8ohQN9pepMk6rI1DVFlqJnETSXtqPgXyIF1F1mhiHkvJ17kQra&s=10",
  },
  {
    id: 15,
    name: "Kachumbari",
    description: "Fresh tomato and onion salad.",
    price: 100,
    category: "Sides",
    portion: "One serving",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUpWsM7MyvG2jFYQrUIpto13ktW0cqDUcYfLALn6rdHd5YUb8Zklmt7b0A&s=10",
  },

  // ---- BUTCHERY ----
  {
    id: 16,
    name: "Fresh Pork Per Kilo",
    description: "Fresh butchery cuts, prepared to order. Ask about today's selection.",
    price: 700,
    category: "Butchery",
    badge: "Fresh daily",
    portion: "Per kilo",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-t8Rjx11LWa-evA8ZxZ22PQwk2ek0QpYkasPWsVPO6cRWDRNsepq_rUOC&s=10",
  },
];

export const categories: ("All" | ProductCategory)[] = [
  "All",
  "Choma",
  "Meals",
  "Combos",
  "Sides",
  "Butchery",
];