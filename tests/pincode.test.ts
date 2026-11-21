import { describe, expect, it } from "vitest";
import { deliveryEstimate, stateForPincode } from "@/lib/pincode";
import { business } from "@/config/business";

describe("pincode → state suggestion", () => {
  it.each([
    ["600099", "Tamil Nadu"], ["560038", "Karnataka"], ["110001", "Delhi"], ["400001", "Maharashtra"], ["700001", "West Bengal"],
    ["500001", "Telangana"], ["520001", "Andhra Pradesh"], ["682001", "Kerala"], ["605001", "Puducherry"], ["403001", "Goa"],
    ["248001", "Uttarakhand"], ["226001", "Uttar Pradesh"], ["160017", "Chandigarh"], ["834001", "Jharkhand"], ["800001", "Bihar"], ["737101", "Sikkim"],
  ])("%s → %s", (pin, state) => expect(stateForPincode(pin)).toBe(state));
  it("rejects invalid pincodes", () => {
    for (const bad of ["012345", "9", "abcdef", "6000990", "", "900001"]) expect(stateForPincode(bad)).toBeNull();
  });
});

describe("delivery estimate", () => {
  it("serves any valid pincode, free above the threshold", () => {
    const paid = deliveryEstimate("600099", 100)!;
    expect(paid).toMatchObject({ free: false, charge: business.deliveryCharge, state: "Tamil Nadu" });
    expect(deliveryEstimate("560038", business.freeDeliveryThreshold)).toMatchObject({ free: true, charge: 0 });
    expect(deliveryEstimate("12", 500)).toBeNull();
  });
});
