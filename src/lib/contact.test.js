import { describe, expect, it } from "vitest";
import { directionsHref, mapsHref, telHref, whatsappHref } from "./contact.js";

describe("contact links", () => {
  it("dials the gym in international format", () => {
    expect(telHref()).toBe("tel:+201155017245");
  });

  it("opens WhatsApp with an encoded message, Arabic included", () => {
    expect(whatsappHref()).toBe("https://wa.me/201155017245");
    expect(whatsappHref("START")).toBe("https://wa.me/201155017245?text=START");
    const href = whatsappHref("START\nأرغب في الاشتراك");
    expect(href).toContain("?text=START%0A");
    expect(decodeURIComponent(href.split("?text=")[1])).toBe("START\nأرغب في الاشتراك");
  });

  it("points maps at the gym's listing and pin", () => {
    expect(mapsHref()).toBe("https://maps.google.com/?cid=8001756715929445261");
    expect(directionsHref()).toBe("https://www.google.com/maps/dir/?api=1&destination=30.5928708,31.4809817");
  });
});
