import { useEffect, useMemo, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { products, categories } from "./data/products";
import type { Product } from "./data/products";

/* ============================================================
   BUSINESS CONFIGURATION
   Replace these values with your own when they change.
   ============================================================ */
const CONFIG = {
  phoneDisplay: "0181 544 910",
  phoneIntl: "254181544910",
  whatsappBase: "https://wa.me/254181544910",
  mpesaTill: "1658917",
  restaurantQuery: "Pork Halisi, Kiambu, Kenya",
  restaurantLat: -1.1714,
  restaurantLng: 36.8356,
  restaurantAddress: "Kiambu Town, next to Sakina, 200m from Kiambu Mall",
  openingHours: "Open daily 8am to 11pm",
  googlePlaceId: "ChIJT4DVjNE9LxgRZKvGaN0KR7A",
  googleSheetUrl: "https://script.google.com/macros/s/AKfycby4cKIyxFfD_H5yigPNRGz5eyh7yWDlYH8EY6gzvZuUBwHUKsA8p7AcjzZC67xnvNwC/exec",
};

const DELIVERY_ZONES = [
  { maxKm: 2, fee: 100, label: "Within Kiambu Town" },
  { maxKm: 5, fee: 150, label: "Kiambu outskirts" },
  { maxKm: 10, fee: 250, label: "Nearby estates" },
  { maxKm: 15, fee: 350, label: "Further areas" },
  { maxKm: Infinity, fee: null, label: "Confirm on WhatsApp or use your own rider" },
];

/* ============================================================
   ICONS
   ============================================================ */
type IconName =
  | "arrow"
  | "bag"
  | "call"
  | "check"
  | "chevron"
  | "clock"
  | "close"
  | "edit"
  | "home"
  | "instagram"
  | "map"
  | "minus"
  | "moto"
  | "pin"
  | "plate"
  | "plus"
  | "route"
  | "star"
  | "store"
  | "tiktok"
  | "trash"
  | "user"
  | "whatsapp";

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
    bag: (
      <>
        <path d="M5 8h14l-1 13H6L5 8Z" />
        <path d="M9 9V6a3 3 0 0 1 6 0v3" />
      </>
    ),
    call: (
      <path d="m7 3 3 5-3 3c2 3 3 4 6 6l3-3 5 3c0 4-3 5-6 4C8 19 3 14 2 7c0-3 2-4 5-4Z" />
    ),
    check: <path d="m5 12 4 4L19 6" />,
    chevron: <path d="m9 18 6-6-6-6" />,
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    close: <path d="m6 6 12 12M18 6 6 18" />,
    edit: (
      <>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
      </>
    ),
    home: (
      <>
        <path d="m3 10 9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
        <path d="M9 22V12h6v10" />
      </>
    ),
    instagram: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r=".7" fill="currentColor" stroke="none" />
      </>
    ),
    map: (
      <>
        <path d="M9 4 3 7v13l6-3 6 3 6-3V4l-6 3Z" />
        <path d="M9 4v13M15 7v13" />
      </>
    ),
    minus: <path d="M5 12h14" />,
    moto: (
      <>
        <circle cx="5" cy="18" r="2.5" />
        <circle cx="19" cy="18" r="2.5" />
        <path d="M7 18h6l2-8h-3M14 10h5l3 8M9 10H4l3 8" />
      </>
    ),
    pin: (
      <>
        <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    plate: (
      <>
        <circle cx="13" cy="12" r="7" />
        <path d="M3 4v6m3-6v6M3 7h3M4.5 10v10" />
      </>
    ),
    plus: <path d="M12 5v14M5 12h14" />,
    route: (
      <>
        <circle cx="6" cy="18" r="2" />
        <circle cx="18" cy="6" r="2" />
        <path d="M8 18h2a3 3 0 0 0 3-3v-6a3 3 0 0 1 3-3" />
      </>
    ),
    star: (
      <path d="m12 3 2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 18l-5.9 3 1.2-6.5L2.5 9.9 9.1 9 12 3Z" />
    ),
    store: (
      <>
        <path d="M4 10v10h16V10M3 10l2-7h14l2 7" />
        <path d="M3 10c1 3 4 3 5 0 1 3 4 3 5 0 1 3 4 3 5 0 1 3 3 3 3 0M9 20v-6h6v6" />
      </>
    ),
    tiktok: (
      <path d="M15 3v2a5 5 0 0 0 5 5h1v3h-1a8 8 0 0 1-5-1.7V16a5 5 0 1 1-5-5v3a2 2 0 1 0 2 2V3h3Z" />
    ),
    trash: (
      <>
        <path d="M3 6h18M8 6V4h8v2M6 6l1 15h10l1-15" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </>
    ),
    whatsapp: (
      <>
        <path d="M20.5 11.7a8.4 8.4 0 0 1-12.4 7.4L3 20.5l1.4-4.9A8.4 8.4 0 1 1 20.5 11.7Z" />
        <path d="M8.1 7.5c.2-.4.4-.4.7-.4h.4c.2 0 .3.1.4.4l.8 1.8c.1.3 0 .5-.1.7l-.6.7c-.2.2-.1.4 0 .6.7 1.2 1.7 2.2 3 2.8.2.1.4.1.6-.1l.8-1c.2-.2.4-.3.7-.2l1.8.9c.3.1.4.3.4.5 0 .4-.2 1.3-.8 1.8-.5.5-1.2.7-2 .6-1.1-.2-2.8-.8-4.7-2.5-1.6-1.4-2.7-3.2-3-4.3-.3-1.1 0-1.9.4-2.4.4-.4.8-.6 1.2-.6Z" />
      </>
    ),
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

/* ============================================================
   TYPES
   ============================================================ */
type CartLine = { product: Product; quantity: number };
type OrderType = "Delivery" | "Pickup" | "Dine-in";
type GeoPoint = { lat: number; lng: number; accuracy: number };
type SavedAddress = {
  id: string;
  label: string;
  street: string;
  landmark: string;
  point?: GeoPoint;
};
type CustomerProfile = {
  name: string;
  phone: string;
  addresses: SavedAddress[];
  defaultOrderType: OrderType;
  defaultPayment: string;
  lastTable?: string;
  ordersPlaced: number;
};
type PastOrder = {
  number: string;
  date: number;
  items: CartLine[];
  orderType: OrderType;
  total: number;
};

/* ============================================================
   STORAGE
   ============================================================ */
const KEYS = {
  cart: "pork_halisi_cart_v1",
  profile: "pork_halisi_profile_v1",
  history: "pork_halisi_history_v1",
};

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota or private mode */
  }
}

const emptyProfile: CustomerProfile = {
  name: "",
  phone: "",
  addresses: [],
  defaultOrderType: "Delivery",
  defaultPayment: "M-Pesa",
  ordersPlaced: 0,
};

/* ============================================================
   HELPERS
   ============================================================ */
const money = (value: number) =>
  `KSh ${Math.round(value).toLocaleString("en-KE")}`;

const haversineKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const zoneFor = (km: number) =>
  DELIVERY_ZONES.find((zone) => km <= zone.maxKm) ?? DELIVERY_ZONES[DELIVERY_ZONES.length - 1];

const generateOrderNumber = () => {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `PH${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(
    now.getHours()
  )}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
};

const googleReviewUrl = () =>
  CONFIG.googlePlaceId && CONFIG.googlePlaceId !== "PASTE_YOUR_GOOGLE_PLACE_ID_HERE"
    ? `https://search.google.com/local/writereview?placeid=${CONFIG.googlePlaceId}`
    : "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent(CONFIG.restaurantQuery);

const directionsUrl = (lat?: number, lng?: number) =>
  lat != null && lng != null
    ? `https://www.google.com/maps?q=${lat},${lng}`
    : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
        CONFIG.restaurantQuery
      )}`;

/* ============================================================
   PRIMITIVE COMPONENTS
   ============================================================ */
function Button({
  children,
  kind = "primary",
  onClick,
  type = "button",
  disabled,
  full,
}: {
  children: ReactNode;
  kind?: "primary" | "secondary" | "whatsapp" | "ghost";
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  full?: boolean;
}) {
  return (
    <button
      className={`button ${kind}${full ? " full" : ""}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

function SafeImage({
  src,
  alt,
  className,
  fallback = "/assets/pork-halisi-hero.jpg",
}: {
  src: string;
  alt: string;
  className?: string;
  fallback?: string;
}) {
  const [broken, setBroken] = useState(false);
  return (
    <img
      src={broken ? fallback : src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setBroken(true)}
    />
  );
}

function OrderTypePicker({
  value,
  onChange,
}: {
  value: OrderType;
  onChange: (t: OrderType) => void;
}) {
  const options: { label: OrderType; copy: string; icon: IconName }[] = [
    { label: "Delivery", copy: "We come to you", icon: "route" },
    { label: "Pickup", copy: "Collect in Kiambu", icon: "bag" },
    { label: "Dine-in", copy: "Order at your table", icon: "plate" },
  ];
  return (
    <div className="order-type-picker">
      {options.map((option) => (
        <button
          key={option.label}
          type="button"
          className={value === option.label ? "selected" : ""}
          onClick={() => onChange(option.label)}
        >
          <span className="type-icon">
            <Icon name={option.icon} />
          </span>
          <span>
            <strong>{option.label}</strong>
            <small>{option.copy}</small>
          </span>
          <span className="radio">{value === option.label && <span />}</span>
        </button>
      ))}
    </div>
  );
}

function ProductCard({
  product,
  onAdd,
}: {
  product: Product;
  onAdd: () => void;
}) {
  return (
    <article className="menu-card">
      <div className="menu-card-photo">
        <SafeImage src={product.image} alt={product.name} />
        {product.badge && <span>{product.badge}</span>}
      </div>
      <div className="menu-card-copy">
        <div>
          <p className="portion">{product.portion}</p>
          <h3>{product.name}</h3>
          <p>{product.description}</p>
        </div>
        <div className="menu-card-bottom">
          <strong>{money(product.price)}</strong>
          <button type="button" onClick={onAdd} aria-label={`Add ${product.name}`}>
            <Icon name="plus" size={18} /> Add
          </button>
        </div>
      </div>
    </article>
  );
}

/* ============================================================
   MAIN APP
   ============================================================ */
export default function App() {
  const tableFromUrl = useMemo(() => {
    if (typeof window === "undefined") return null;
    return new URLSearchParams(window.location.search).get("table");
  }, []);

  const [profile, setProfile] = useState<CustomerProfile>(() => {
    const saved = readStorage<CustomerProfile>(KEYS.profile, emptyProfile);
    if (tableFromUrl) saved.lastTable = tableFromUrl;
    return saved;
  });

  const [history, setHistory] = useState<PastOrder[]>(() =>
    readStorage<PastOrder[]>(KEYS.history, [])
  );

  const [cart, setCart] = useState<CartLine[]>(() =>
    readStorage<CartLine[]>(KEYS.cart, [])
  );

  const [view, setView] = useState<"home" | "menu" | "checkout" | "sent">("home");
  const [orderType, setOrderType] = useState<OrderType>(
    tableFromUrl ? "Dine-in" : profile.defaultOrderType
  );
  const [category, setCategory] = useState<string>("All");
  const [cartOpen, setCartOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [showTop, setShowTop] = useState(false);

  const [point, setPoint] = useState<GeoPoint | null>(null);
  const [locationError, setLocationError] = useState("");
  const [locating, setLocating] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    profile.addresses[0]?.id ?? null
  );
  const [saveAddress, setSaveAddress] = useState(true);
  const [saveProfile, setSaveProfile] = useState(true);
  const [lastOrderText, setLastOrderText] = useState("");
  const [lastOrderNumber, setLastOrderNumber] = useState("");
  const [mpesaCode, setMpesaCode] = useState("");
  const [ownRider, setOwnRider] = useState(false);

  const subtotal = cart.reduce((sum, line) => sum + line.product.price * line.quantity, 0);
  const count = cart.reduce((sum, line) => sum + line.quantity, 0);

  const distanceKm = useMemo(
    () =>
      point
        ? haversineKm(CONFIG.restaurantLat, CONFIG.restaurantLng, point.lat, point.lng)
        : null,
    [point]
  );

  const deliveryZone = useMemo(
    () => (distanceKm != null ? zoneFor(distanceKm) : null),
    [distanceKm]
  );

  const deliveryFee = useMemo(() => {
    if (orderType !== "Delivery" || ownRider || !deliveryZone) return 0;
    return deliveryZone.fee ?? 0;
  }, [orderType, ownRider, deliveryZone]);

  const feeUnknown = orderType === "Delivery" && !ownRider && deliveryZone?.fee == null;
  const estimatedTotal = subtotal + deliveryFee;

  const visibleProducts =
    category === "All" ? products : products.filter((p) => p.category === category);
  const popularProducts = products.filter((p) => p.popular).slice(0, 3);
  const isReturning = profile.ordersPlaced > 0 && profile.name.trim() !== "";
  const selectedAddress = profile.addresses.find((a) => a.id === selectedAddressId) ?? null;

  useEffect(() => writeStorage(KEYS.cart, cart), [cart]);
  useEffect(() => writeStorage(KEYS.profile, profile), [profile]);
  useEffect(() => writeStorage(KEYS.history, history), [history]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 800);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navigate = (next: typeof view) => {
    setView(next);
    setCartOpen(false);
    setProfileOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const addToCart = (product: Product) => {
    setCart((current) => {
      const found = current.find((line) => line.product.id === product.id);
      return found
        ? current.map((line) =>
            line.product.id === product.id
              ? { ...line, quantity: line.quantity + 1 }
              : line
          )
        : [...current, { product, quantity: 1 }];
    });
    setToast(`${product.name} added`);
  };

  const updateQuantity = (id: number, quantity: number) => {
    setCart((current) =>
      current
        .map((line) => (line.product.id === id ? { ...line, quantity } : line))
        .filter((line) => line.quantity > 0)
    );
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Location is not supported by this browser.");
      return;
    }
    setLocating(true);
    setLocationError("");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setPoint({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
        setLocating(false);
      },
      () => {
        setLocationError(
          "We could not read your location. You can still enter your street and landmark."
        );
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 }
    );
  };

  const quickWhatsApp = useMemo(
    () =>
      `${CONFIG.whatsappBase}?text=${encodeURIComponent(
        "Hello Pork Halisi. I would like to place an order. Please share today's availability."
      )}`,
    []
  );

  const reorder = (order: PastOrder) => {
    setCart(order.items);
    setOrderType(order.orderType);
    navigate("menu");
    setToast("Previous order loaded");
  };

  const buildMessage = (data: FormData, orderNumber: string) => {
    const addressLine = selectedAddress
      ? `${selectedAddress.label} - ${selectedAddress.street}`
      : String(data.get("address") || "Not provided");

    const landmarkLine = selectedAddress?.landmark
      ? selectedAddress.landmark
      : String(data.get("landmark") || "");

    const pinPoint = point ?? selectedAddress?.point ?? null;
    const pin = pinPoint ? `https://maps.google.com/?q=${pinPoint.lat},${pinPoint.lng}` : "";

    const deliveryBlock = [
      "DELIVERY ADDRESS",
      addressLine,
      landmarkLine ? `Landmark: ${landmarkLine}` : "",
      pin ? `GPS pin: ${pin}` : "",
      distanceKm != null ? `Estimated distance: ${distanceKm.toFixed(1)} km` : "",
      ownRider
        ? "Customer will send own rider"
        : deliveryFee > 0
        ? `Delivery fee: ${money(deliveryFee)}`
        : feeUnknown
        ? "Delivery fee: Please confirm on WhatsApp"
        : "",
    ]
      .filter(Boolean)
      .join("\n");

    const pickupBlock = ["PICKUP", `Time: ${data.get("pickup")}`].join("\n");

    const dineInBlock = [
      "DINE-IN",
      `Table: ${profile.lastTable || data.get("table") || "Confirm"}`,
    ].join("\n");

    const fulfilmentBlock =
      orderType === "Delivery" ? deliveryBlock : orderType === "Pickup" ? pickupBlock : dineInBlock;

    const itemLines = cart
      .map(
        (line) =>
          `- ${line.quantity} x ${line.product.name} - ${money(
            line.product.price * line.quantity
          )}`
      )
      .join("\n");

    const totalLines = [
      "TOTAL",
      `Subtotal: ${money(subtotal)}`,
      orderType === "Delivery"
        ? ownRider
          ? "Delivery: Customer's own rider"
          : deliveryFee > 0
          ? `Delivery: ${money(deliveryFee)}`
          : "Delivery: To be confirmed"
        : "Delivery: Not applicable",
      `Estimated total: ${money(estimatedTotal)}`,
    ].join("\n");

    const paymentLines = [
      "PAYMENT",
      `Method: ${data.get("payment")}`,
      `M-Pesa Till: ${CONFIG.mpesaTill}`,
      mpesaCode ? `M-Pesa confirmation code: ${mpesaCode}` : "M-Pesa code: Not provided",
    ].join("\n");

    return [
      `NEW PORK HALISI ORDER - ${orderNumber}`,
      "",
      "CUSTOMER",
      `Name: ${data.get("name")}`,
      `Phone: ${data.get("phone")}`,
      isReturning
        ? `Returning customer - order number ${profile.ordersPlaced + 1}`
        : "First-time customer",
      "",
      `ORDER TYPE`,
      orderType,
      "",
      fulfilmentBlock,
      "",
      "ITEMS",
      itemLines,
      "",
      totalLines,
      "",
      paymentLines,
      "",
      "NOTES",
      `${data.get("notes") || "None"}`,
      "",
      "Please confirm availability, final total and timing.",
    ].join("\n");
  };

  const postToSheet = async (payload: Record<string, unknown>) => {
    if (!CONFIG.googleSheetUrl || CONFIG.googleSheetUrl.startsWith("PASTE_")) return;
    try {
      await fetch(CONFIG.googleSheetUrl, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch {
      /* non-blocking */
    }
  };

  const submitOrder = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const orderNumber = generateOrderNumber();

    const name = String(data.get("name") || "").trim();
    const phone = String(data.get("phone") || "").trim();

    if (saveProfile) {
      let nextAddresses = profile.addresses;

      if (orderType === "Delivery" && saveAddress && !selectedAddress) {
        const newAddress: SavedAddress = {
          id: `addr_${Date.now()}`,
          label: profile.addresses.length === 0 ? "Home" : "New",
          street: String(data.get("address") || "").trim(),
          landmark: String(data.get("landmark") || "").trim(),
          point: point ?? undefined,
        };
        nextAddresses = [...profile.addresses, newAddress];
        setSelectedAddressId(newAddress.id);
      } else if (selectedAddress && point && !selectedAddress.point) {
        nextAddresses = profile.addresses.map((a) =>
          a.id === selectedAddress.id ? { ...a, point } : a        );
      }

      setProfile((p) => ({
        ...p,
        name: name || p.name,
        phone: phone || p.phone,
        addresses: nextAddresses,
        defaultOrderType: orderType,
        defaultPayment: String(data.get("payment") || p.defaultPayment),
        lastTable: profile.lastTable,
        ordersPlaced: p.ordersPlaced + 1,
      }));
    } else {
      setProfile((p) => ({ ...p, ordersPlaced: p.ordersPlaced + 1 }));
    }

    const message = buildMessage(data, orderNumber);
    setLastOrderText(message);
    setLastOrderNumber(orderNumber);

    const newOrder: PastOrder = {
      number: orderNumber,
      date: Date.now(),
      items: cart,
      orderType,
      total: estimatedTotal,
    };
    setHistory((h) => [newOrder, ...h].slice(0, 10));

    postToSheet({
      orderNumber,
      timestamp: new Date().toISOString(),
      name,
      phone,
      orderType,
      address:
        orderType === "Delivery"
          ? selectedAddress
            ? `${selectedAddress.label} - ${selectedAddress.street}`
            : String(data.get("address") || "")
          : orderType === "Pickup"
          ? "Pickup"
          : `Dine-in table ${profile.lastTable || data.get("table") || ""}`,
      landmark: String(data.get("landmark") || ""),
      gps: point ? `${point.lat},${point.lng}` : "",
      items: cart.map((l) => `${l.quantity} x ${l.product.name}`).join(" | "),
      subtotal,
      deliveryFee,
      total: estimatedTotal,
      payment: String(data.get("payment") || ""),
      mpesaCode,
      ownRider: ownRider ? "Yes" : "No",
      notes: String(data.get("notes") || ""),
      returning: isReturning ? "Yes" : "No",
    });

    window.open(
      `${CONFIG.whatsappBase}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );

    navigate("sent");
  };

  const clearCart = () => {
    setCart([]);
    writeStorage(KEYS.cart, []);
  };

  return (
    <div className="app-shell">
      {/* ANNOUNCEMENT */}
      <div className="announcement">
        <span>
          Fresh butchery cuts and grills in Kiambu Town. {CONFIG.openingHours}.
        </span>
        <div>
          <a href={`tel:+${CONFIG.phoneIntl}`}>
            <Icon name="call" size={14} /> Call {CONFIG.phoneDisplay}
          </a>
          <a href={quickWhatsApp} target="_blank" rel="noreferrer">
            <Icon name="whatsapp" size={15} /> WhatsApp
          </a>
        </div>
      </div>

      {/* HEADER */}
      <header className="site-header">
        <button
          type="button"
          className="brand"
          onClick={() => navigate("home")}
          aria-label="Pork Halisi home"
        >
          <img src="public/assets/menu/porkHalisiLogo.jpeg" alt="Pork Halisi" />
          <span>RESTAURANT AND BUTCHERY</span>
        </button>

        <nav aria-label="Main navigation">
          <button
            type="button"
            className={view === "home" ? "active" : ""}
            onClick={() => navigate("home")}
          >
            Home
          </button>
          <button
            type="button"
            className={view === "menu" ? "active" : ""}
            onClick={() => navigate("menu")}
          >
            Menu
          </button>
          <button
            type="button"
            onClick={() => {
              navigate("home");
              window.setTimeout(
                () =>
                  document
                    .getElementById("visit")
                    ?.scrollIntoView({ behavior: "smooth" }),
                120
              );
            }}
          >
            Find us
          </button>
          <a
            href="https://www.instagram.com/pork_halisi_kiambu/"
            target="_blank"
            rel="noreferrer"
          >
            Instagram
          </a>
        </nav>

        <div className="header-actions">
          {isReturning && (
            <button
              type="button"
              className="profile-chip"
              onClick={() => setProfileOpen(true)}
            >
              <Icon name="user" size={16} />
              <span>Hi, {profile.name.split(" ")[0]}</span>
            </button>
          )}
          <button
            type="button"
            className="cart-button"
            onClick={() => setCartOpen(true)}
          >
            <Icon name="bag" />
            <span>My order</span>
            <strong>{count}</strong>
          </button>
        </div>
      </header>

      <main>
        {/* ================= HOME ================= */}
        {view === "home" && (
          <>
            <section className="hero">
              <div className="hero-image">
                <SafeImage
                  src="public/assets/menu/chomapork.jpeg"
                  alt="Pork Halisi grilled pork"
                />
              </div>
              <div className="hero-copy">
                <p className="kicker">
                  <Icon name="star" size={14} /> KIAMBU TOWN SINCE DAY ONE
                </p>
                <h1>
                  Proper pork.
                  <br />
                  <em>Made the Halisi way.</em>
                </h1>
                <p className="hero-intro">
                  Fresh butchery cuts, grills, and comforting Kenyan
                  favourites. 
                </p>
                <div className="hero-price-anchor">
                  <Icon name="plate" size={16} />
                  <span>
                    Choma from <strong>KSh 400</strong>. Family platters from{" "}
                    <strong>KSh 2,400</strong>.
                  </span>
                </div>
                <div className="hero-actions">
                  <Button onClick={() => navigate("menu")}>
                    Order now <Icon name="arrow" size={18} />
                  </Button>
                  <a className="call-link" href={`tel:+${CONFIG.phoneIntl}`}>
                    <Icon name="call" /> {CONFIG.phoneDisplay}
                  </a>
                </div>
                <div className="hero-proof">
                  <span>
                    <Icon name="pin" size={15} /> Kiambu Town
                  </span>
                  <span>
                    <Icon name="clock" size={15} /> {CONFIG.openingHours}
                  </span>
                  <span>
                    <Icon name="moto" size={15} /> Delivery within Kiambu
                  </span>
                </div>
              </div>
            </section>

            <section className="ordering-panel">
              <div className="section-title">
                <p className="kicker">ORDER YOUR WAY</p>
                <h2>How are we serving you today?</h2>
                <p>Choose an option now. You can change it again at checkout.</p>
              </div>
              <OrderTypePicker value={orderType} onChange={setOrderType} />
              <Button onClick={() => navigate("menu")}>
                Start your order <Icon name="arrow" size={18} />
              </Button>
            </section>

            <section className="picks-section">
              <div className="section-heading">
                <div>
                  <p className="kicker">TODAY AT HALISI</p>
                  <h2>What people are ordering</h2>
                </div>
                <button type="button" onClick={() => navigate("menu")}>
                  Full menu <Icon name="arrow" size={17} />
                </button>
              </div>
              <div className="picks-grid">
                {popularProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAdd={() => addToCart(product)}
                  />
                ))}
              </div>
            </section>

            <section className="how-it-works">
              <div className="section-title-center">
                <p className="kicker">HOW IT WORKS</p>
                <h2>Order in three simple steps.</h2>
              </div>
              <ol className="steps">
                <li>
                  <span>1</span>
                  <div>
                    <strong>Pick your dishes</strong>
                    <p>Add anything you want from the menu.</p>
                  </div>
                </li>
                <li>
                  <span>2</span>
                  <div>
                    <strong>Send on WhatsApp</strong>
                    <p>We prepare the whole order as a message. You tap Send.</p>
                  </div>
                </li>
                <li>
                  <span>3</span>
                  <div>
                    <strong>We confirm and deliver</strong>
                    <p>
                      The team replies with the final total and timing, then brings
                      your food.
                    </p>
                  </div>
                </li>
              </ol>
            </section>

            <section className="location-section" id="visit">
              <div className="location-copy">
                <p className="kicker">COME THROUGH</p>
                <h2>
                  Find the red sign
                  <br />
                  in Kiambu Town.
                </h2>
                <p>
                  Next to Sakina, about 200 metres from Kiambu Mall. Dine in,
                  pick up, or let us deliver within Kiambu.
                </p>
                <div className="contact-list">
                  <a href={`tel:+${CONFIG.phoneIntl}`}>
                    <span>
                      <Icon name="call" />
                    </span>
                    <div>
                      <small>CALL TO ORDER</small>
                      <strong>{CONFIG.phoneDisplay}</strong>
                    </div>
                    <Icon name="chevron" size={17} />
                  </a>
                  <a href={quickWhatsApp} target="_blank" rel="noreferrer">
                    <span>
                      <Icon name="whatsapp" />
                    </span>
                    <div>
                      <small>MESSAGE US</small>
                      <strong>Order on WhatsApp</strong>
                    </div>
                    <Icon name="chevron" size={17} />
                  </a>
                  <a href={directionsUrl()} target="_blank" rel="noreferrer">
                    <span>
                      <Icon name="route" />
                    </span>
                    <div>
                      <small>GET DIRECTIONS</small>
                      <strong>Open in Google Maps</strong>
                    </div>
                    <Icon name="chevron" size={17} />
                  </a>
                </div>
              </div>
              <div className="map-card">
                <div className="storefront">
                  <SafeImage
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHDfjXviehy0Vt1XUSv2dBgqG6ybA1CvR8QiX4EGOP-A&s=10"
                    alt="Pork Halisi storefront in Kiambu Town"
                  />
                  <div className="storefront-caption">
                    <p>
                      <strong>Look for the black building with the red Pork Halisi sign.</strong>
                      <span>{CONFIG.restaurantAddress}</span>
                    </p>
                  </div>
                </div>
                <iframe
                  title="Pork Halisi location on Google Maps"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(
                    CONFIG.restaurantQuery
                  )}&output=embed`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <div className="map-footer">
                  <p>
                    <strong>On Google Maps</strong>
                    <span>{CONFIG.restaurantAddress}</span>
                  </p>
                  <a href={directionsUrl()} target="_blank" rel="noreferrer">
                    Directions <Icon name="route" size={18} />
                  </a>
                </div>
              </div>
            </section>

            <section className="reviews-section">
  <div className="google-reviews-card">

    {/* GOOGLE REVIEWS HEADER */}
    <div className="google-reviews-header">

      <div className="google-brand">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9xomnvaNviCPEjYZm3gJcXESFWUtPP_bEj45bpmYufw&s=10"
          alt="Google"
          className="google-logo"
        />

        <div className="google-brand-text">
          <h2>Google Reviews</h2>
          <p>What our customers say</p>
        </div>
      </div>

      <a
        className="google-write-review"
        href={googleReviewUrl()}
        target="_blank"
        rel="noreferrer"
      >
        Write a review
      </a>

    </div>

    {/* GOOGLE RATING */}
    <div className="google-rating">

      <div className="google-rating-number">
        5.0
      </div>

      <div className="google-stars">
        <span>★</span>
        <span>★</span>
        <span>★</span>
        <span>★</span>
        <span>★</span>
      </div>

      <p>Based on 5,391 reviews</p>

    </div>

    {/* CUSTOMER REVIEWS */}
    <div className="google-review-list">

      {/* REVIEW 1 */}
      <article className="google-review-item">

        <div className="google-review-user">
          <div className="google-avatar">W</div>

          <div>
            <strong>Wanjiku M.</strong>
            <span>
              2 days ago on <b>Google</b>
            </span>
          </div>
        </div>

        <div className="google-review-stars">
          ★★★★★
        </div>

        <p>
          The choma here is unmatched. Fresh cuts, proper seasoning,
          and they always deliver hot. My weekend spot.
        </p>

      </article>

      {/* REVIEW 2 */}
      <article className="google-review-item">

        <div className="google-review-user">
          <div className="google-avatar">B</div>

          <div>
            <strong>Brian K.</strong>
            <span>
              2 days ago on <b>Google</b>
            </span>
          </div>
        </div>

        <div className="google-review-stars">
          ★★★★★
        </div>

        <p>
          Ordered on WhatsApp, arrived in twenty five minutes.
          The family platter fed all four of us with leftovers.
        </p>

      </article>

      {/* REVIEW 3 */}
      <article className="google-review-item">

        <div className="google-review-user">
          <div className="google-avatar">G</div>

          <div>
            <strong>Grace N.</strong>
            <span>
              2 days ago on <b>Google</b>
            </span>
          </div>
        </div>

        <div className="google-review-stars">
          ★★★★★
        </div>

        <p>
          Their butchery is the real deal. I buy fresh pork here
          every week. Always clean, always fresh, fair prices.
        </p>

      </article>

    </div>

    {/* GOOGLE REVIEW FOOTER */}
    <div className="google-review-bottom">

      <span>
        Have you visited Pork Halisi?
      </span>

      <a
        href={googleReviewUrl()}
        target="_blank"
        rel="noreferrer"
      >
        Leave us a Google review →
      </a>

    </div>

  </div>
</section>
          </>
        )}

        {/* ================= MENU ================= */}
        {view === "menu" && (
          <section className="menu-page">
            <div className="menu-hero">
              <p className="kicker">
                {tableFromUrl ? `TABLE ${tableFromUrl} DINE-IN ORDER` : "THE HALISI MENU"}
              </p>
              <h1>What are you craving?</h1>
              <p>
                Freshly prepared in Kiambu. Availability and the final delivery fee
                are confirmed on WhatsApp.
              </p>
            </div>

            <OrderTypePicker value={orderType} onChange={setOrderType} />

            <div className="category-tabs">
              {categories.map((c) => (
                <button
                  type="button"
                  key={c}
                  className={category === c ? "active" : ""}
                  onClick={() => setCategory(c)}
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="menu-grid">
              {visibleProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAdd={() => addToCart(product)}
                />
              ))}
            </div>

            <div className="menu-help">
              <span>
                <Icon name="whatsapp" />
              </span>
              <div>
                <strong>Cannot find what you want?</strong>
                <p>Ask our team about today's cuts, portions and availability.</p>
              </div>
              <a href={quickWhatsApp} target="_blank" rel="noreferrer">
                Ask on WhatsApp <Icon name="arrow" size={17} />
              </a>
            </div>
          </section>
        )}

        {/* ================= CHECKOUT ================= */}
        {view === "checkout" && (
          <section className="checkout-page">
            <button type="button" className="back-link" onClick={() => navigate("menu")}>
              Back to menu
            </button>

            <div className="checkout-heading">
              <p className="kicker">CHECKOUT</p>
              <h1>Almost time to eat.</h1>
              <p>
                We prepare your full order as a WhatsApp message to Pork Halisi.
                Review it there, tap Send, and the team confirms your total and
                timing.
              </p>
            </div>

            <form onSubmit={submitOrder}>
              <div className="checkout-main">
                <section className="form-section">
                  <span className="step">1</span>
                  <div>
                    <h2>Your details</h2>
                    {isReturning && (
                      <p className="form-note">
                        Welcome back, {profile.name.split(" ")[0]}. Your details are
                        saved.
                      </p>
                    )}
                    <div className="form-grid">
                      <label>
                        Full name
                        <input
                          name="name"
                          required
                          autoComplete="name"
                          placeholder="Your name"
                          defaultValue={profile.name}
                        />
                      </label>
                      <label>
                        Phone number
                        <input
                          name="phone"
                          required
                          type="tel"
                          autoComplete="tel"
                          placeholder="07XX XXX XXX"
                          defaultValue={profile.phone}
                        />
                      </label>
                    </div>
                    <label className="checkbox-row">
                      <input
                        type="checkbox"
                        checked={saveProfile}
                        onChange={(e) => setSaveProfile(e.target.checked)}
                      />
                      <span>Save my details for faster checkout next time</span>
                    </label>
                  </div>
                </section>

                <section className="form-section">
                  <span className="step">2</span>
                  <div>
                    <h2>Order type</h2>
                    <OrderTypePicker value={orderType} onChange={setOrderType} />
                  </div>
                </section>

                <section className="form-section">
                  <span className="step">3</span>
                  <div>
                    <h2>
                      {orderType === "Delivery"
                        ? "Where should we find you?"
                        : orderType === "Pickup"
                        ? "When will you collect?"
                        : "Where are you seated?"}
                    </h2>

                    {orderType === "Delivery" && (
                      <>
                        {profile.addresses.length > 0 && (
                          <div className="address-book">
                            <p className="address-book-label">Saved addresses</p>
                            <div className="address-chips">
                              {profile.addresses.map((address) => (
                                <button
                                  type="button"
                                  key={address.id}
                                  className={
                                    selectedAddressId === address.id ? "active" : ""
                                  }
                                  onClick={() => {
                                    setSelectedAddressId(address.id);
                                    if (address.point) setPoint(address.point);
                                  }}
                                >
                                  <Icon name="home" size={14} />
                                  <span>
                                    <strong>{address.label}</strong>
                                    <small>{address.street}</small>
                                  </span>
                                </button>
                              ))}
                              <button
                                type="button"
                                className={selectedAddressId === null ? "active" : ""}
                                onClick={() => {
                                  setSelectedAddressId(null);
                                  setPoint(null);
                                }}
                              >
                                <Icon name="plus" size={14} />
                                <span>
                                  <strong>New address</strong>
                                  <small>Add a different one</small>
                                </span>
                              </button>
                            </div>
                          </div>
                        )}

                        {selectedAddressId === null && (
                          <>
                            <div className="form-grid">
                              <label>
                                Street or estate
                                <input
                                  name="address"
                                  required
                                  placeholder="Example: Biashara Street, Kiambu"
                                />
                              </label>
                              <label>
                                Nearby landmark
                                <input
                                  name="landmark"
                                  placeholder="Gate, building or known place"
                                />
                              </label>
                            </div>
                            <label className="checkbox-row">
                              <input
                                type="checkbox"
                                checked={saveAddress}
                                onChange={(e) => setSaveAddress(e.target.checked)}
                              />
                              <span>Save this address for next time</span>
                            </label>
                          </>
                        )}

                        <button
                          type="button"
                          className={`location-button ${point ? "success" : ""}`}
                          onClick={useCurrentLocation}
                          disabled={locating}
                        >
                          <span>
                            <Icon name={point ? "check" : "pin"} />
                          </span>
                          <div>
                            <strong>
                              {point
                                ? "Location pinned"
                                : locating
                                ? "Getting your location"
                                : "Use my current location"}
                            </strong>
                            <small>
                              {point
                                ? `Accurate to about ${Math.round(
                                    point.accuracy
                                  )} metres. Attached to your WhatsApp order.`
                                : "Allow location so the rider finds you quickly."}
                            </small>
                          </div>
                          {!point && <Icon name="chevron" size={18} />}
                        </button>

                        {locationError && <p className="field-error">{locationError}</p>}

                        {point && distanceKm != null && (
                          <div className="delivery-estimate">
                            <div>
                              <strong>
                                {distanceKm.toFixed(1)} km from the restaurant
                              </strong>
                              <small>
                                {ownRider
                                  ? "You will send your own rider."
                                  : deliveryFee > 0
                                  ? `Suggested delivery fee: ${money(deliveryFee)}`
                                  : "Delivery fee confirmed on WhatsApp."}
                              </small>
                            </div>
                            <a
                              href={directionsUrl(point.lat, point.lng)}
                              target="_blank"
                              rel="noreferrer"
                            >
                              Preview <Icon name="route" size={16} />
                            </a>
                          </div>
                        )}

                        <label className="checkbox-row">
                          <input
                            type="checkbox"
                            checked={ownRider}
                            onChange={(e) => setOwnRider(e.target.checked)}
                          />
                          <span>
                            I will send my own rider (no delivery fee)
                          </span>
                        </label>
                      </>
                    )}

                    {orderType === "Pickup" && (
                      <>
                        <label>
                          Pickup time
                          <select name="pickup">
                            <option>As soon as possible</option>
                            <option>In 30 minutes</option>
                            <option>In 1 hour</option>
                          </select>
                        </label>
                        <a
                          className="map-preview"
                          href={directionsUrl()}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Open the route to Pork Halisi{" "}
                          <Icon name="route" size={17} />
                        </a>
                      </>
                    )}

                    {orderType === "Dine-in" && (
                      <label>
                        Table number
                        <input
                          name="table"
                          defaultValue={profile.lastTable || tableFromUrl || ""}
                          placeholder="Example: T05"
                        />
                      </label>
                    )}
                  </div>
                </section>

                <section className="form-section">
                  <span className="step">4</span>
                  <div>
                    <h2>Payment</h2>
                    <div className="payment-info">
                      <p>
                        Pay to M-Pesa Till <strong>{CONFIG.mpesaTill}</strong>. After
                        payment, enter the M-Pesa confirmation code below so we can
                        match your payment instantly.
                      </p>
                    </div>

                    <div className="form-grid">
                      <label>
                        Payment method
                        <select name="payment" defaultValue={profile.defaultPayment}>
                          <option>M-Pesa</option>
                          <option>Cash on delivery</option>
                          <option>Pay on pickup</option>
                          <option>Pay at table</option>
                        </select>
                      </label>
                      <label>
                        M-Pesa confirmation code
                        <input
                          name="mpesaCode"
                          placeholder="Example: SK7YZ1ABC2"
                          value={mpesaCode}
                          onChange={(e) =>
                            setMpesaCode(e.target.value.toUpperCase().trim())
                          }
                        />
                      </label>
                    </div>

                    <label>
                      Order notes
                      <textarea
                        name="notes"
                        placeholder="Allergies, cut preference or special request"
                      />
                    </label>
                  </div>
                </section>

                {history.length > 0 && (
                  <section className="form-section past-orders-section">
                    <span className="step">
                      <Icon name="clock" size={16} />
                    </span>
                    <div>
                      <h2>Order again</h2>
                      <p className="form-note">Your last few orders, one tap away.</p>
                      <div className="past-orders">
                        {history.slice(0, 3).map((order) => (
                          <button
                            type="button"
                            key={order.number}
                            className="past-order"
                            onClick={() => reorder(order)}
                          >
                            <div>
                              <strong>
                                {order.items.length} item
                                {order.items.length > 1 ? "s" : ""} - {order.orderType}
                              </strong>
                              <small>
                                {new Date(order.date).toLocaleDateString("en-KE", {
                                  day: "numeric",
                                  month: "short",
                                })}{" "}
                                - {money(order.total)}
                              </small>
                            </div>
                            <Icon name="arrow" size={16} />
                          </button>
                        ))}
                      </div>
                    </div>
                  </section>
                )}
              </div>

              <aside className="order-summary">
                <p className="kicker">YOUR ORDER</p>
                {cart.map((line) => (
                  <div className="summary-line" key={line.product.id}>
                    <span>
                      {line.quantity} x {line.product.name}
                    </span>
                    <strong>{money(line.product.price * line.quantity)}</strong>
                  </div>
                ))}

                {orderType === "Delivery" && (
                  <div className="summary-line">
                    <span>Delivery</span>
                    <strong>
                      {ownRider
                        ? "Own rider"
                        : deliveryFee > 0
                        ? money(deliveryFee)
                        : "Confirm"}
                    </strong>
                  </div>
                )}

                <div className="summary-total">
                  <span>Estimated total</span>
                  <strong>{money(estimatedTotal)}</strong>
                </div>

                <p>
                  The final total and availability are confirmed by Pork Halisi on
                  WhatsApp before preparation.
                </p>

                <Button kind="whatsapp" type="submit" full>
                  <Icon name="whatsapp" /> Send order on WhatsApp
                </Button>
                <small>
                  WhatsApp opens with your complete order. Tap Send there to place
                  it.
                </small>
              </aside>
            </form>
          </section>
        )}

        {/* ================= SENT ================= */}
        {view === "sent" && (
          <section className="sent-page">
            <span className="sent-icon">
              <Icon name="whatsapp" size={34} />
            </span>
            <p className="kicker">FINAL STEP</p>
            <h1>
              Tap Send in WhatsApp
              <br />
              to place your order.
            </h1>
            <p>
              Order <strong>{lastOrderNumber}</strong> is ready. WhatsApp should be
              open with your full order, address, GPS pin and payment. Just tap Send.
            </p>

            <div className="sent-actions">
              <a
                className="button whatsapp"
                href={`${CONFIG.whatsappBase}?text=${encodeURIComponent(lastOrderText)}`}
                target="_blank"
                rel="noreferrer"
              >
                <Icon name="whatsapp" /> Open WhatsApp again
              </a>
              <a className="call-link" href={`tel:+${CONFIG.phoneIntl}`}>
                <Icon name="call" /> In a hurry? Call {CONFIG.phoneDisplay}
              </a>
            </div>

            <div className="sent-secondary">
              <button type="button" className="back-link" onClick={() => navigate("menu")}>
                Start another order
              </button>
              <button type="button" className="back-link" onClick={clearCart}>
                Clear my cart
              </button>
            </div>

            <div className="sent-review">
              <p>
                Enjoyed your meal? Leave a review on Google so other customers can
                find us.
              </p>
              <a
                className="button primary"
                href={googleReviewUrl()}
                target="_blank"
                rel="noreferrer"
              >
                <Icon name="star" size={16} /> Rate us on Google
              </a>
            </div>

            {cart.length > 0 && (
              <div className="sent-note">
                We kept your cart intact in case the WhatsApp message did not send.
              </div>
            )}
          </section>
        )}
      </main>

      {/* FOOTER */}
      <footer>
        <div className="footer-brand">
          <img src="public/assets/menu/porkHalisiLogo.jpeg" alt="Pork Halisi" />
          <p>
            Fresh pork, proper flavour,
            <br />
            right here in Kiambu.
          </p>
        </div>
        <div>
          <small>VISIT US</small>
          <p>
            Next to Sakina
            <br />
            200 metres from Kiambu Mall
            <br />
            Kiambu Town, Kenya
          </p>
          <p className="footer-hours">{CONFIG.openingHours}</p>
        </div>
        <div>
          <small>CONTACT</small>
          <a href={`tel:+${CONFIG.phoneIntl}`}>{CONFIG.phoneDisplay}</a>
          <a href={quickWhatsApp} target="_blank" rel="noreferrer">
            WhatsApp orders
          </a>
          <a
            href="https://www.instagram.com/pork_halisi_kiambu/"
            target="_blank"
            rel="noreferrer"
          >
            @pork_halisi_kiambu
          </a>
        </div>
        <div className="footer-cta">
          <p>Hungry already?</p>
          <Button onClick={() => navigate("menu")}>
            Order now <Icon name="arrow" size={17} />
          </Button>
        </div>
      </footer>

      {/* MOBILE NAV */}
      <nav className="mobile-nav" aria-label="Mobile navigation">
        <button
          type="button"
          className={view === "home" ? "active" : ""}
          onClick={() => navigate("home")}
        >
          <Icon name="store" />
          <span>Home</span>
        </button>
        <button
          type="button"
          className={view === "menu" ? "active" : ""}
          onClick={() => navigate("menu")}
        >
          <Icon name="plate" />
          <span>Menu</span>
        </button>
        <button type="button" onClick={() => setCartOpen(true)}>
          <span className="mobile-cart-icon">
            <Icon name="bag" />
            {count > 0 && <strong>{count}</strong>}
          </span>
          <span>My order</span>
        </button>
        <a href={`tel:+${CONFIG.phoneIntl}`}>
          <Icon name="call" />
          <span>Call</span>
        </a>
      </nav>

      {/* FLOATING WHATSAPP */}
      <a
        className="floating-whatsapp"
        href={quickWhatsApp}
        target="_blank"
        rel="noreferrer"
        aria-label="Order on WhatsApp"
      >
        <Icon name="whatsapp" size={26} />
        <span>Order on WhatsApp</span>
      </a>

      {/* SCROLL TO TOP */}
      {showTop && (
        <button
          type="button"
          className="scroll-top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
        >
          <Icon name="arrow" size={18} />
        </button>
      )}

      {/* MOBILE CART BAR */}
      {count > 0 && view !== "checkout" && view !== "sent" && (
        <button
          type="button"
          className="mobile-cart-bar"
          onClick={() => setCartOpen(true)}
        >
          <span>{count}</span>
          <strong>View my order</strong>
          <b>{money(subtotal)}</b>
        </button>
      )}

      {/* CART DRAWER */}
      {cartOpen && (
        <div className="drawer-backdrop" onClick={() => setCartOpen(false)}>
          <aside className="cart-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-heading">
              <div>
                <p className="kicker">YOUR ORDER</p>
                <h2>Ready when you are.</h2>
              </div>
              <button
                type="button"
                onClick={() => setCartOpen(false)}
                aria-label="Close cart"
              >
                <Icon name="close" />
              </button>
            </div>

            {cart.length ? (
              <>
                <div className="cart-lines">
                  {cart.map((line) => (
                    <div className="cart-line" key={line.product.id}>
                      <SafeImage
                        src={line.product.image}
                        alt={line.product.name}
                      />
                      <div>
                        <h3>{line.product.name}</h3>
                        <small>{line.product.portion}</small>
                        <strong>
                          {money(line.product.price * line.quantity)}
                        </strong>
                      </div>
                      <div className="quantity">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(line.product.id, line.quantity - 1)
                          }
                          aria-label={`Remove one ${line.product.name}`}
                        >
                          <Icon name="minus" size={15} />
                        </button>
                        <span>{line.quantity}</span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(line.product.id, line.quantity + 1)
                          }
                          aria-label={`Add one ${line.product.name}`}
                        >
                          <Icon name="plus" size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <OrderTypePicker value={orderType} onChange={setOrderType} />

                <div className="cart-total">
                  <span>Estimated subtotal</span>
                  <strong>{money(subtotal)}</strong>
                </div>
                <p className="cart-note">
                  Final total, availability and delivery fee are confirmed by the
                  restaurant on WhatsApp.
                </p>

                <Button kind="whatsapp" full onClick={() => navigate("checkout")}>
                  Continue to checkout <Icon name="arrow" size={18} />
                </Button>
              </>
            ) : (
              <div className="empty-cart">
                <span>
                  <Icon name="bag" size={32} />
                </span>
                <h3>Your order is empty.</h3>
                <p>Let us find something proper to eat.</p>
                <Button onClick={() => navigate("menu")}>Browse menu</Button>
              </div>
            )}
          </aside>
        </div>
      )}

      {/* PROFILE DRAWER */}
      {profileOpen && (
        <div className="drawer-backdrop" onClick={() => setProfileOpen(false)}>
          <aside className="cart-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-heading">
              <div>
                <p className="kicker">YOUR PROFILE</p>
                <h2>
                  {profile.name ? `Hi, ${profile.name.split(" ")[0]}` : "Save your details"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setProfileOpen(false)}
                aria-label="Close profile"
              >
                <Icon name="close" />
              </button>
            </div>

            <div className="profile-fields">
              <label>
                Name
                <input
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                />
              </label>
              <label>
                Phone
                <input
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                />
              </label>

              {profile.addresses.length > 0 && (
                <div className="profile-addresses">
                  <p className="address-book-label">Saved addresses</p>
                  {profile.addresses.map((address) => (
                    <div key={address.id} className="profile-address">
                      <div>
                        <strong>{address.label}</strong>
                        <small>{address.street}</small>
                        {address.landmark && <small> - {address.landmark}</small>}
                        {address.point && (
                          <small className="has-pin">
                            <Icon name="pin" size={11} /> GPS pin saved
                          </small>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setProfile({
                            ...profile,
                            addresses: profile.addresses.filter(
                              (a) => a.id !== address.id
                            ),
                          })
                        }
                        aria-label={`Remove ${address.label}`}
                      >
                        <Icon name="trash" size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="profile-orders-count">
                You have placed <strong>{profile.ordersPlaced}</strong>{" "}
                {profile.ordersPlaced === 1 ? "order" : "orders"} with us.
              </div>
            </div>

            <Button onClick={() => setProfileOpen(false)} full>
              Save and close
            </Button>
          </aside>
        </div>
      )}

      {toast && (
        <div className="toast" role="status">
          <Icon name="check" size={17} />
          {toast}
        </div>
      )}
    </div>
  );
}