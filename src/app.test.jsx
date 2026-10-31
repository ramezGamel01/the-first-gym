import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import App from "./App.jsx";

const renderAt = (path = "/") =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>
  );

describe("home page", () => {
  it("leads with the gym's own tagline and the START offer on WhatsApp", () => {
    renderAt("/");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/Train hard\.\s*Get results\.\s*No excuses\./);
    const offer = screen.getAllByRole("link", { name: /Message “START” on WhatsApp/ })[0];
    expect(offer).toHaveAttribute("href", "https://wa.me/201155017245?text=START");
    expect(offer).toHaveAttribute("target", "_blank");
    expect(document.title).toBe("The First Gym | Train hard. Get results. No excuses.");
  });

  it("opens on the photo with the gym's name cut out below it, and skips the gallery until there are photos", () => {
    const { container } = renderAt("/");
    expect(screen.getByRole("img", { name: /athletes in a gym/ })).toBeInTheDocument();
    expect(container.querySelector(".hero .stencil__text")).toHaveTextContent("THE FIRST");
    expect(screen.queryByRole("heading", { name: "Inside the gym" })).not.toBeInTheDocument();
  });
});

describe("class picker", () => {
  it("shows the chosen class with its coach and a WhatsApp question about it", async () => {
    const user = userEvent.setup();
    renderAt("/");
    const tablist = screen.getByRole("tablist", { name: "Classes" });
    expect(within(tablist).getAllByRole("tab")).toHaveLength(7);
    await user.click(within(tablist).getByRole("tab", { name: /Kickboxing/ }));
    const panel = screen.getByRole("tabpanel");
    expect(within(panel).getByRole("heading", { name: "Kickboxing" })).toBeInTheDocument();
    expect(panel).toHaveTextContent("Capt. Mohamed Tamer");
    expect(within(panel).getByRole("link", { name: /Ask about this class/ }).getAttribute("href")).toContain(
      encodeURIComponent("the Kickboxing class")
    );
  });

  it("moves between classes with the arrow keys", async () => {
    const user = userEvent.setup();
    renderAt("/");
    const tabs = within(screen.getByRole("tablist", { name: "Classes" })).getAllByRole("tab");
    tabs[0].focus();
    await user.keyboard("{ArrowDown}");
    expect(tabs[1]).toHaveFocus();
    expect(tabs[1]).toHaveAttribute("aria-selected", "true");
    await user.keyboard("{End}");
    expect(tabs[6]).toHaveAttribute("aria-selected", "true");
  });
});

describe("settings", () => {
  it("switches to Arabic, right to left, and remembers it", async () => {
    const user = userEvent.setup();
    renderAt("/");
    await user.click(screen.getByRole("button", { name: "عربي" }));
    expect(document.documentElement).toHaveAttribute("dir", "rtl");
    expect(document.documentElement).toHaveAttribute("lang", "ar");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("تمرين جاد.");
    expect(localStorage.getItem("firstgym:lang")).toBe("ar");
  });

  it("switches between the dark and light themes", async () => {
    const user = userEvent.setup();
    renderAt("/");
    await user.click(screen.getByRole("button", { name: "Switch to the light theme" }));
    expect(document.documentElement.dataset.theme).toBe("light");
    expect(localStorage.getItem("firstgym:theme")).toBe("light");
    await user.click(screen.getByRole("button", { name: "Switch to the dark theme" }));
    expect(document.documentElement.dataset.theme).toBe("dark");
  });

  it("turns animations off from the footer", async () => {
    const user = userEvent.setup();
    renderAt("/");
    const toggle = screen.getByRole("button", { name: "Animations" });
    expect(toggle).toHaveAttribute("aria-pressed", "true");
    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-pressed", "false");
    expect(document.documentElement).toHaveClass("no-motion");
    expect(localStorage.getItem("firstgym:motion")).toBe("off");
  });
});

describe("classes", () => {
  it("filters classes by who they're for", async () => {
    const user = userEvent.setup();
    const { container } = renderAt("/classes");
    const names = () => [...container.querySelectorAll(".program__name")].map((el) => el.textContent);
    expect(names()).toHaveLength(7);
    await user.click(screen.getByRole("button", { name: "Kids" }));
    expect(names()).toEqual(["Fitness", "Kickboxing", "MMA"]);
    await user.click(screen.getByRole("button", { name: "Women" }));
    expect(names()).toContain("Zumba");
  });

  it("shows published times and marks the ones still missing", () => {
    const { container } = renderAt("/classes");
    const week = container.querySelector(".week");
    const saturday = within(week).getByRole("heading", { name: /Saturday/ }).closest("li");
    expect(within(saturday).getByText("10 pm")).toBeInTheDocument();
    expect(within(saturday).getByText("Time to be added")).toBeInTheDocument();
    const sunday = within(week).getByRole("heading", { name: /Sunday/ }).closest("li");
    expect(within(sunday).getByText("No published classes")).toBeInTheDocument();
  });
});

describe("membership", () => {
  it("shows the four plan lengths with their months lit and prices marked as not yet added", () => {
    const { container } = renderAt("/membership");
    const cards = container.querySelectorAll(".plan");
    expect(cards).toHaveLength(4);
    expect(cards[0].querySelectorAll(".plan__cells .is-on")).toHaveLength(1);
    const year = cards[3];
    expect(year).toHaveTextContent("12 months");
    expect(year.querySelectorAll(".plan__cells .is-on")).toHaveLength(12);
    expect(within(year).getByText("To be added")).toBeInTheDocument();
    expect(within(year).getByRole("link", { name: /Ask about this plan/ }).getAttribute("href")).toContain(
      encodeURIComponent("the 12 months plan")
    );
  });

  it("walks through the plan finder to a ready WhatsApp message", async () => {
    const user = userEvent.setup();
    const { container } = renderAt("/membership");
    const finder = () => container.querySelector(".finder");

    expect(within(finder()).getByRole("button", { name: "Next" })).toBeDisabled();
    await user.click(within(finder()).getByRole("radio", { name: "Learn to fight" }));
    await user.click(within(finder()).getByRole("button", { name: "Next" }));
    await user.click(within(finder()).getByRole("radio", { name: "Women" }));
    await user.click(within(finder()).getByRole("button", { name: "Next" }));
    await user.click(within(finder()).getByRole("radio", { name: "3 days" }));
    await user.click(within(finder()).getByRole("button", { name: "Next" }));
    await user.click(within(finder()).getByRole("radio", { name: "6 months" }));
    await user.click(within(finder()).getByRole("button", { name: "See my plan" }));

    expect(screen.getByRole("heading", { name: "Your starting plan" })).toHaveFocus();
    expect(finder()).toHaveTextContent("Kickboxing");
    expect(finder()).toHaveTextContent("MMA");
    const send = within(finder()).getByRole("link", { name: /Send this on WhatsApp/ });
    expect(decodeURIComponent(send.getAttribute("href").split("?text=")[1])).toContain("Interests: Kickboxing and MMA");

    await user.click(within(finder()).getByRole("button", { name: "Start over" }));
    expect(within(finder()).getByText("Question 1 of 4")).toBeInTheDocument();
  });
});

describe("body lab", () => {
  it("works out BMI, calories and protein as the details are typed", async () => {
    const user = userEvent.setup();
    renderAt("/body-lab");
    expect(screen.getByText("Enter your age, height and weight to see your numbers.")).toBeInTheDocument();
    await user.type(screen.getByLabelText("Age"), "30");
    await user.type(screen.getByLabelText("Height"), "180");
    await user.type(screen.getByLabelText("Weight"), "80");
    expect(screen.getByText("24.7")).toBeInTheDocument();
    expect(screen.getByText("Healthy range")).toBeInTheDocument();
    expect(screen.getAllByText("2,760 kcal")).toHaveLength(2);
    expect(screen.getByText("128–176 g a day")).toBeInTheDocument();
  });

  it("explains out-of-range numbers and sends under-18s to a coach", async () => {
    const user = userEvent.setup();
    renderAt("/body-lab");
    await user.type(screen.getByLabelText("Height"), "400");
    expect(screen.getByLabelText("Height")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText("Use a number between 120 and 230.")).toBeInTheDocument();
    await user.type(screen.getByLabelText("Age"), "15");
    expect(screen.getByText(/a coach at the gym can help instead/)).toBeInTheDocument();
  });
});

describe("visit page", () => {
  it("lists hours for every day, marked until the gym confirms them", () => {
    renderAt("/visit");
    expect(screen.getAllByRole("row")).toHaveLength(7);
    expect(screen.getByText("To be confirmed")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Get directions/ })).toHaveAttribute(
      "href",
      "https://www.google.com/maps/dir/?api=1&destination=30.5928708,31.4809817"
    );
  });
});

it("shows a not-found page for unknown links", () => {
  renderAt("/no-such-page");
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("This page doesn't exist");
});
