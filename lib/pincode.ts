/**
 * Offline pincode → state suggestion from the India Post numbering scheme (first 2–3 digits). No network calls.
 * It is a *suggestion* (the customer can always change it): postal circles do not follow state borders exactly.
 * City / district would need a full pincode dataset or an adapter – intentionally not guessed here.
 */
import { business } from "@/config/business";
import type { STATES } from "@/lib/states";

type State = (typeof STATES)[number];

/** 3-digit overrides first (checked before the 2-digit table). */
const THREE: [number, number, State][] = [
  [160, 160, "Chandigarh"], [244, 249, "Uttarakhand"], [262, 263, "Uttarakhand"], [403, 403, "Goa"], [605, 605, "Puducherry"],
  [682, 682, "Kerala"], [737, 737, "Sikkim"], [744, 744, "Andaman and Nicobar Islands"], [796, 796, "Mizoram"], [795, 795, "Manipur"],
  [793, 794, "Meghalaya"], [797, 798, "Nagaland"], [799, 799, "Tripura"], [790, 792, "Arunachal Pradesh"], [396, 396, "Dadra and Nagar Haveli and Daman and Diu"],
  [500, 509, "Telangana"], [515, 535, "Andhra Pradesh"], [814, 835, "Jharkhand"], [180, 194, "Jammu and Kashmir"], [194, 194, "Ladakh"],
  [180, 185, "Jammu and Kashmir"], [490, 497, "Chhattisgarh"],
];
const TWO: [number, number, State][] = [
  [11, 11, "Delhi"], [12, 13, "Haryana"], [14, 16, "Punjab"], [17, 17, "Himachal Pradesh"], [18, 19, "Jammu and Kashmir"],
  [20, 28, "Uttar Pradesh"], [30, 34, "Rajasthan"], [36, 39, "Gujarat"], [40, 44, "Maharashtra"], [45, 48, "Madhya Pradesh"], [49, 49, "Chhattisgarh"],
  [50, 50, "Telangana"], [51, 53, "Andhra Pradesh"], [56, 59, "Karnataka"], [60, 64, "Tamil Nadu"], [67, 69, "Kerala"],
  [70, 74, "West Bengal"], [75, 77, "Odisha"], [78, 78, "Assam"], [79, 79, "Assam"], [80, 85, "Bihar"],
];

export function stateForPincode(pin: string): State | null {
  if (!business.pincodePattern.test(pin)) return null;
  const three = Number(pin.slice(0, 3));
  const two = Number(pin.slice(0, 2));
  // most specific (narrowest) 3-digit range wins
  const t = THREE.filter(([a, b]) => three >= a && three <= b).sort((x, y) => x[1] - x[0] - (y[1] - y[0]))[0];
  if (t) return t[2];
  const w = TWO.find(([a, b]) => two >= a && two <= b);
  return w ? w[2] : null;
}

/** Delivery estimate for the product page – all India pincodes are served. */
export function deliveryEstimate(pin: string, subtotal: number) {
  const state = stateForPincode(pin);
  if (!business.pincodePattern.test(pin)) return null;
  const free = subtotal >= business.freeDeliveryThreshold;
  return {
    state,
    free,
    charge: free ? 0 : business.deliveryCharge,
    dispatch: business.dispatchDays,
    transit: business.deliveryDays,
  };
}
