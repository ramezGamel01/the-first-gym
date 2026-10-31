import { GYM } from "../data/gym.js";

// 01155017245 → tel:+201155017245
export const telHref = (phone = GYM.phone) => `tel:+20${phone.replace(/^0/, "")}`;

export function whatsappHref(text, number = GYM.whatsapp) {
  const base = `https://wa.me/${number}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export const mapsHref = () => `https://maps.google.com/?cid=${GYM.mapsCid}`;

export const directionsHref = () =>
  `https://www.google.com/maps/dir/?api=1&destination=${GYM.geo.lat},${GYM.geo.lng}`;

export const instagramHref = () => `https://www.instagram.com/${GYM.instagram}`;

export const facebookHref = () => `https://www.facebook.com/${GYM.facebook}`;
