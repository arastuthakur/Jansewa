import React from "react";
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "../App";

describe("JanSewa Nepal - End-to-End User Perspective Tests", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  it("1. Citizen lands on portal and views authentic Government of Nepal branding", () => {
    render(<App />);

    // Check Nepal Government & Municipal hierarchy
    expect(screen.getAllByText(/नेपाल सरकार|Government of Nepal/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/काठमाडौँ महानगरपालिका|Kathmandu Metropolitan City/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/जननी जन्मभूमिश्च स्वर्गादपि गरीयसी/i).length).toBeGreaterThan(0);

    // Verify Coat of Arms (NepalEmblem) is rendered
    const emblem = document.querySelector('svg[aria-label*="नेपालको निशान छाप"]');
    expect(emblem).not.toBeNull();

    // Verify helpline 1180 is visible
    expect(screen.getAllByText(/११८०|1180/i).length).toBeGreaterThan(0);

    // Verify NO artificial "Official Production Service" or prototype badges exist
    expect(screen.queryByText(/Official Production Service/i)).toBeNull();
    expect(screen.queryByText(/Concept Prototype/i)).toBeNull();
    expect(screen.queryByText(/Synthetic Benchmark/i)).toBeNull();
  });

  it("2. User toggles Dark Mode and Light Mode smoothly", () => {
    render(<App />);

    const themeToggleBtn = document.querySelector(".theme-toggle-btn");
    expect(themeToggleBtn).not.toBeNull();

    // Initial state is light
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");

    // Click to toggle to Dark Mode
    fireEvent.click(themeToggleBtn);
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    expect(localStorage.getItem("jansewa_theme")).toBe("dark");

    // Click again to toggle back to Light Mode
    fireEvent.click(themeToggleBtn);
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
    expect(localStorage.getItem("jansewa_theme")).toBe("light");
  });

  it("3. User switches between Nepali and English languages", () => {
    render(<App />);

    const langBtn = screen.getByTitle(/Toggle Nepali \/ English/i);
    expect(langBtn).not.toBeNull();

    // Click once: switches from 'en' to 'ne'
    fireEvent.click(langBtn);
    expect(screen.getAllByText(/काठमाडौँ महानगरपालिका/i).length).toBeGreaterThan(0);

    // Click again: switches back to 'en'
    fireEvent.click(langBtn);
    expect(screen.getAllByText(/Kathmandu Metropolitan City/i).length).toBeGreaterThan(0);
  });

  it("4. User navigates between Citizen, Staff, DAO, and Analytics roles", () => {
    render(<App />);

    // Switch to Ward Staff
    const staffBtn = screen.getByRole("button", { name: /वडा सचिव|Ward Staff/i });
    fireEvent.click(staffBtn);
    expect(screen.getAllByText(/वडा नं. ०४|Ward 04/i).length).toBeGreaterThan(0);

    // Switch to DAO / CDO
    const daoBtn = screen.getByRole("button", { name: /प्रजिअ \/ DAO|CDO \/ DAO/i });
    fireEvent.click(daoBtn);
    expect(screen.getAllByText(/प्रजिअ|CDO|District/i).length).toBeGreaterThan(0);

    // Switch to Municipality
    const muniBtn = screen.getByRole("button", { name: /नगरपालिका|Municipality/i });
    fireEvent.click(muniBtn);
    expect(document.querySelector(".staff-portal")).not.toBeNull();

    // Switch back to Citizen
    const citizenBtn = screen.getByRole("button", { name: /^नागरिक$|^Citizen$/i });
    fireEvent.click(citizenBtn);
    expect(document.querySelector(".citizen-portal")).not.toBeNull();
  });

  it("5. User opens Command Palette and searches for municipal services", () => {
    render(<App />);

    const menuBtn = screen.getByTitle(/Open Command Palette/i);
    fireEvent.click(menuBtn);

    // Verify Command Palette modal opens
    const cmdkModal = document.querySelector(".command-palette-modal");
    expect(cmdkModal).not.toBeNull();

    // Search for Birth Registration
    const input = cmdkModal.querySelector("input");
    expect(input).not.toBeNull();
    fireEvent.change(input, { target: { value: "Birth" } });

    // Verify filtered search result is present
    expect(screen.getAllByText(/Birth|जन्म/i).length).toBeGreaterThan(0);

    // Dismiss modal with Escape
    fireEvent.keyDown(input, { key: "Escape", code: "Escape" });
    expect(document.querySelector(".command-palette-modal")).toBeNull();
  });

  it("6. Citizen interacts with Kathmandu Ward Explorer", () => {
    render(<App />);

    // Verify Ward Explorer container exists
    const explorer = document.querySelector(".ward-explorer-card");
    expect(explorer).not.toBeNull();

    // Select Ward 01
    const ward1Btn = screen.getByRole("button", { name: /^वडा ०१$|^Ward 01$/i });
    fireEvent.click(ward1Btn);

    // Check Ward 01 details updated
    expect(screen.getAllByText(/नक्साल|Naxal/i).length).toBeGreaterThan(0);

    // Select Ward 04
    const ward4Btn = screen.getByRole("button", { name: /^वडा ०४$|^Ward 04$/i });
    fireEvent.click(ward4Btn);
    expect(screen.getAllByText(/बालुवाटार|Baluwatar/i).length).toBeGreaterThan(0);
  });

  it("7. Citizen launches application modal for a service", () => {
    render(<App />);

    // Click Apply Now button on the first service
    const applyButtons = screen.getAllByRole("button", { name: /Apply Now|आवेदन दिनुहोस्/i });
    expect(applyButtons.length).toBeGreaterThan(0);
    fireEvent.click(applyButtons[0]);

    // Check New Application modal opens
    const modal = document.querySelector(".modal-card");
    expect(modal).not.toBeNull();
    expect(screen.getAllByText(/Submit New Online Application|नयाँ अनलाइन निवेदन दर्ता/i).length).toBeGreaterThan(0);

    // Close modal
    const closeBtn = document.querySelector(".btn-close");
    if (closeBtn) fireEvent.click(closeBtn);
  });
});
