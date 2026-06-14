import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { navMenu, businessMenuItems } from "./business-content.js";

const assetBase = import.meta.env.BASE_URL;

let lenis = null;
try {
  const lenisModule = await import("./lenis-scroll.js");
  lenis = lenisModule.default || lenisModule.lenis || null;
} catch (e) {}

gsap.registerPlugin(SplitText);

const defaultMenuItems = [
  { label: "Home", route: "/business-landing/business.html" },
  { label: "Studio", route: "/business-landing/studio.html" },
  { label: "Work", route: "/business-landing/work.html" },
  { label: "Project", route: "/business-landing/sample-project.html" },
  { label: "Contact", route: "/business-landing/contact.html" },
];

function getMenuItems() {
  if (document.body.classList.contains("business-theme")) {
    return businessMenuItems;
  }
  return defaultMenuItems;
}

function menuItemHref(item) {
  return item.route;
}

function menuItemTarget(item) {
  return item.parent ? "_parent" : null;
}

function scrollToMenuTarget(hash) {
  const targetEl = document.querySelector(hash);
  if (!targetEl) return;
  if (window.lenis) {
    window.lenis.scrollTo(targetEl, { offset: -80, duration: 1.1 });
  } else {
    targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function navigateFromIframe(url) {
  if (window.parent && window.parent !== window) {
    window.parent.location.href = url;
  } else {
    window.location.href = url;
  }
}

function bindMenuNavigation(overlay, closeMenuIfOpen) {
  overlay.querySelectorAll("a[href]").forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const href = anchor.getAttribute("href") || "";
      if (!href || href === "#") return;

      if (href.startsWith("#")) {
        e.preventDefault();
        closeMenuIfOpen();
        scrollToMenuTarget(href);
        return;
      }

      if (href.startsWith("mailto:")) {
        closeMenuIfOpen();
        return;
      }

      if (href.startsWith("/") || anchor.getAttribute("target") === "_parent") {
        e.preventDefault();
        closeMenuIfOpen();
        navigateFromIframe(href);
      }
    });
  });
}

function buildNav() {
  const nav = document.querySelector("nav");
  if (!nav) return;

  const menuItems = getMenuItems();
  const isBusinessMenu = document.body.classList.contains("business-theme");

  // Prevent duplicate overlays if any script re-runs.
  const existingOverlay = document.querySelector(".menu-overlay");
  if (existingOverlay) existingOverlay.remove();

  const toggler = nav.querySelector(".nav-toggler");
  if (toggler) {
    toggler.innerHTML = `
      <div class="nav-toggle-wrapper">
        <p class="open-label">Menu</p>
        <p class="close-label">Close</p>
      </div>
    `;
  }

  const overlay = document.createElement("div");
  overlay.className = "menu-overlay";
  overlay.innerHTML = `
    <div class="menu-content">
      <div class="menu-col" data-col="0">
        <div class="menu-content-group">
          <p>&copy; MyDigitalArchitect</p>
          <p>${navMenu.studio}</p>
          <p>${navMenu.location}</p>
        </div>
        <div class="menu-content-group">
          <p>Focus</p>
          <p>${navMenu.edition}</p>
        </div>
        <div class="menu-content-group">
          <p>Say Hello</p>
          <a href="mailto:info@mydigitalarchitect.com">info@mydigitalarchitect.com</a>
        </div>
        <div class="menu-content-group">
          <p>Free audit</p>
          ${isBusinessMenu
            ? `<a href="#audit">No sign-up required</a>`
            : `<p>No sign-up required</p>`}
        </div>
      </div>
      <div class="menu-col" data-col="1">
        <div class="menu-content-group">
          <p>Explore</p>
          ${isBusinessMenu
            ? `          <a href="#about">About</a>
          <a href="#faq">FAQs</a>
          <a href="/careers">Careers</a>
          <a href="/3d-models">3D Models</a>`
            : `<a href="mailto:info@mydigitalarchitect.com">Email</a>
          <a href="#audit">Free AI audit</a>`}
        </div>
        <div class="menu-content-group">
          <p>Language</p>
          <p>Human</p>
        </div>
        <div class="menu-content-group">
          <p>Credits</p>
          <p>Made by MyDigitalArchitect</p>
          <p>Web &amp; Mobile Apps</p>
        </div>
      </div>
    </div>

    <div class="menu-links-wrapper">
      ${menuItems
        .map((item) => {
          const href = menuItemHref(item);
          const target = menuItemTarget(item);
          const targetAttr = target ? ` target="${target}"` : "";
          return `
        <div class="menu-link" data-route="${href}">
          <a href="${href}"${targetAttr}>
            <span>${item.label}</span>
            <span>${item.label}</span>
          </a>
        </div>
      `;
        })
        .join("")}
      <div class="link-highlighter"></div>
    </div>
  `;

  document.body.appendChild(overlay);
}

function initMenu() {
  buildNav();

  const navToggler = document.querySelector(".nav-toggler");
  const menuOverlay = document.querySelector(".menu-overlay");
  const menuLinksWrapper = document.querySelector(".menu-links-wrapper");
  const linkHighlighter = document.querySelector(".link-highlighter");
  const menuLinks = Array.from(document.querySelectorAll(".menu-link a"));
  const menuLinkContainers = Array.from(
    document.querySelectorAll(".menu-link"),
  );
  const openLabel = document.querySelector(".open-label");
  const closeLabel = document.querySelector(".close-label");
  const menuCols = Array.from(document.querySelectorAll(".menu-col"));

  let isMenuOpen = false;
  let isMenuAnimating = false;

  const splitTextInstances = [];

  function setupLinkSplits() {
    splitTextInstances.forEach((s) => s.revert && s.revert());
    splitTextInstances.length = 0;

    menuLinks.forEach((link) => {
      const spans = link.querySelectorAll("span");
      spans.forEach((span, i) => {
        const split = new SplitText(span, { type: "chars" });
        splitTextInstances.push(split);
        split.chars.forEach((c) => c.classList.add("char"));
        if (i === 1) {
          gsap.set(split.chars, { y: "110%" });
        }
      });
    });
  }

  const menuColSplitInstances = [];

  function setupColSplits() {
    if (isMenuOpen) return;

    menuColSplitInstances.forEach((s) => s.revert && s.revert());
    menuColSplitInstances.length = 0;

    menuCols.forEach((col) => {
      col.querySelectorAll("p, a").forEach((el) => {
        const split = SplitText.create(el, {
          type: "lines",
          mask: "lines",
          linesClass: "split-line",
        });
        menuColSplitInstances.push(split);
        gsap.set(split.lines, { y: "100%" });
      });
    });
  }

  function setInitialStates() {
    gsap.set(menuLinks, { y: "150%" });
    gsap.set(linkHighlighter, { y: "150%" });

    const firstLinkContainer = menuLinkContainers[0];
    const firstLinkSpan = firstLinkContainer
      ? firstLinkContainer.querySelector("a span")
      : null;

    if (firstLinkSpan) {
      const linkWidth = firstLinkSpan.offsetWidth;
      linkHighlighter.style.width = linkWidth + "px";
      currentHighlighterWidth = linkWidth;
      targetHighlighterWidth = linkWidth;

      const linkRect = firstLinkContainer.getBoundingClientRect();
      const wrapperRect = menuLinksWrapper.getBoundingClientRect();
      const initialX = linkRect.left - wrapperRect.left;
      currentHighlighterX = initialX;
      targetHighlighterX = initialX;
    }
  }

  let currentX = 0;
  let targetX = 0;
  const lerpFactor = 0.05;

  let currentHighlighterX = 0;
  let targetHighlighterX = 0;
  let currentHighlighterWidth = 0;
  let targetHighlighterWidth = 0;

  let rafId = null;

  function animateLoop() {
    currentX += (targetX - currentX) * lerpFactor;
    currentHighlighterX +=
      (targetHighlighterX - currentHighlighterX) * lerpFactor;
    currentHighlighterWidth +=
      (targetHighlighterWidth - currentHighlighterWidth) * lerpFactor;

    gsap.set(menuLinksWrapper, { x: currentX });
    gsap.set(linkHighlighter, {
      x: currentHighlighterX,
      width: currentHighlighterWidth,
    });

    rafId = requestAnimationFrame(animateLoop);
  }

  function startDesktopTracking() {
    if (window.innerWidth < 1000) return;
    if (rafId) return;
    menuOverlay.addEventListener("mousemove", onMouseMove);
    menuLinksWrapper.addEventListener("mouseleave", onLinksWrapperLeave);
    rafId = requestAnimationFrame(animateLoop);
  }

  function stopDesktopTracking() {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
    menuOverlay.removeEventListener("mousemove", onMouseMove);
    menuLinksWrapper.removeEventListener("mouseleave", onLinksWrapperLeave);
  }

  function onMouseMove(e) {
    if (window.innerWidth < 1000) return;

    const mouseX = e.clientX;
    const viewportWidth = window.innerWidth;
    const wrapperWidth = menuLinksWrapper.offsetWidth;

    const maxMoveLeft = 0;
    const maxMoveRight = viewportWidth - wrapperWidth;

    const sensitivityRange = viewportWidth * 0.5;
    const startX = (viewportWidth - sensitivityRange) / 2;
    const endX = startX + sensitivityRange;

    let pct;
    if (mouseX <= startX) pct = 0;
    else if (mouseX >= endX) pct = 1;
    else pct = (mouseX - startX) / sensitivityRange;

    targetX = maxMoveLeft + pct * (maxMoveRight - maxMoveLeft);
  }

  function onLinkEnter(container) {
    if (window.innerWidth < 1000) return;

    const spans = container.querySelectorAll("a span");
    if (!spans || spans.length < 2) return;

    const visibleChars = spans[0].querySelectorAll(".char");
    const animatedChars = spans[1].querySelectorAll(".char");

    gsap.to(visibleChars, {
      y: "-110%",
      stagger: 0.05,
      duration: 0.5,
      ease: "expo.inOut",
    });
    gsap.to(animatedChars, {
      y: "0%",
      stagger: 0.05,
      duration: 0.5,
      ease: "expo.inOut",
    });

    const linkRect = container.getBoundingClientRect();
    const wrapperRect = menuLinksWrapper.getBoundingClientRect();
    targetHighlighterX = linkRect.left - wrapperRect.left;

    const firstSpan = container.querySelector("a span");
    targetHighlighterWidth = firstSpan
      ? firstSpan.offsetWidth
      : container.offsetWidth;
  }

  function onLinkLeave(container) {
    if (window.innerWidth < 1000) return;

    const spans = container.querySelectorAll("a span");
    if (!spans || spans.length < 2) return;

    const visibleChars = spans[0].querySelectorAll(".char");
    const animatedChars = spans[1].querySelectorAll(".char");

    gsap.to(animatedChars, {
      y: "110%",
      stagger: 0.05,
      duration: 0.5,
      ease: "expo.inOut",
    });
    gsap.to(visibleChars, {
      y: "0%",
      stagger: 0.05,
      duration: 0.5,
      ease: "expo.inOut",
    });
  }

  function onLinksWrapperLeave() {
    const firstContainer = menuLinkContainers[0];
    if (!firstContainer) return;
    const firstSpan = firstContainer.querySelector("a span");
    if (!firstSpan) return;

    const linkRect = firstContainer.getBoundingClientRect();
    const wrapperRect = menuLinksWrapper.getBoundingClientRect();
    targetHighlighterX = linkRect.left - wrapperRect.left;
    targetHighlighterWidth = firstSpan.offsetWidth;
  }

  menuLinkContainers.forEach((container) => {
    container.addEventListener("mouseenter", () => onLinkEnter(container));
    container.addEventListener("mouseleave", () => onLinkLeave(container));
  });

  const closeMenuIfOpen = () => {
    if (isMenuOpen && !isMenuAnimating) toggleMenu();
  };

  bindMenuNavigation(menuOverlay, closeMenuIfOpen);

  function toggleMenu() {
    if (isMenuAnimating) return;
    isMenuAnimating = true;

    if (!isMenuOpen) {
      if (lenis) lenis.stop();
      startDesktopTracking();

      gsap.to(openLabel, { y: "-100%", duration: 1, ease: "power3.out" });
      gsap.to(closeLabel, { y: "-100%", duration: 1, ease: "power3.out" });

      gsap.to(menuOverlay, {
        clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
        duration: 1.25,
        ease: "expo.out",
        onComplete: () => {
          menuLinkContainers.forEach((c) => (c.style.overflow = "visible"));
          isMenuOpen = true;
          isMenuAnimating = false;
        },
      });

      gsap.to(menuLinks, {
        y: "0%",
        duration: 1.25,
        stagger: 0.1,
        delay: 0.25,
        ease: "expo.out",
      });

      gsap.to(linkHighlighter, {
        y: "0%",
        duration: 1,
        delay: 1,
        ease: "expo.out",
      });

      menuCols.forEach((col) => {
        const splitLines = col.querySelectorAll(".split-line");
        gsap.to(splitLines, {
          y: "0%",
          duration: 1,
          stagger: 0.05,
          delay: 0.5,
          ease: "expo.out",
        });
      });
    } else {
      gsap.to(openLabel, { y: "0%", duration: 1, ease: "power3.out" });
      gsap.to(closeLabel, { y: "0%", duration: 1, ease: "power3.out" });

      menuCols.forEach((col) => {
        const splitLines = col.querySelectorAll(".split-line");
        gsap.to(splitLines, {
          y: "-100%",
          duration: 1,
          stagger: 0,
          ease: "expo.out",
        });
      });

      gsap.to(menuOverlay, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
        duration: 1.25,
        ease: "expo.out",
        onComplete: () => {
          stopDesktopTracking();
          gsap.set(menuOverlay, {
            clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
          });
          gsap.set(menuLinks, { y: "150%" });
          gsap.set(linkHighlighter, { y: "150%" });
          menuLinkContainers.forEach((c) => (c.style.overflow = "hidden"));

          menuCols.forEach((col) => {
            const splitLines = col.querySelectorAll(".split-line");
            gsap.set(splitLines, { y: "100%" });
          });

          gsap.set(menuLinksWrapper, { x: 0 });
          currentX = 0;
          targetX = 0;

          setupColSplits();

          isMenuOpen = false;
          isMenuAnimating = false;

          if (lenis) lenis.start();
        },
      });
    }
  }

  navToggler.addEventListener("click", toggleMenu);

  setupLinkSplits();
  setupColSplits();
  setInitialStates();
  // Desktop tracking loop starts only when menu is open.
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initMenu);
} else {
  initMenu();
}
