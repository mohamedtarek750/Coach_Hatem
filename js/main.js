/* ==========================================================================
   Coach Hatem — site interactions
   Scroll reveals · counters · slider · FAQ · lightbox · WhatsApp plan flow
   ========================================================================== */

(function () {
  "use strict";

  const COACH_WHATSAPP = "201026160872"; // +20 102 616 0872

  /* ------------------------------------------------------------------ */
  /*  Navbar: scrolled state + mobile menu                               */
  /* ------------------------------------------------------------------ */
  const navbar = document.getElementById("navbar");
  const navToggle = document.getElementById("navToggle");
  const mobileMenu = document.getElementById("mobileMenu");

  const onScroll = () => {
    navbar.classList.toggle("scrolled", window.scrollY > 24);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  navToggle.addEventListener("click", () => {
    const open = mobileMenu.classList.toggle("open");
    navToggle.classList.toggle("open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });

  // Close the mobile menu when a link inside it is clicked
  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
      navToggle.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  /* ------------------------------------------------------------------ */
  /*  Scroll reveal animations                                           */
  /* ------------------------------------------------------------------ */
  const revealables = document.querySelectorAll(".reveal, .reveal-scale");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -60px 0px", threshold: 0.1 }
    );
    revealables.forEach((el) => revealObserver.observe(el));
  } else {
    revealables.forEach((el) => el.classList.add("visible"));
  }

  /* ------------------------------------------------------------------ */
  /*  Animated counters                                                  */
  /* ------------------------------------------------------------------ */
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target, 10) || 0;
    if (prefersReducedMotion) {
      el.textContent = target;
      return;
    }
    const duration = 2000;
    const start = performance.now();
    const easeOut = (t) => 1 - Math.pow(1 - t, 4);

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      el.textContent = Math.round(easeOut(progress) * target);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const counters = document.querySelectorAll(".counter");
  if ("IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach((el) => counterObserver.observe(el));
  } else {
    counters.forEach((el) => (el.textContent = el.dataset.target));
  }

  /* ------------------------------------------------------------------ */
  /*  Hero parallax                                                      */
  /* ------------------------------------------------------------------ */
  const heroFrame = document.getElementById("heroParallax");
  if (heroFrame && !prefersReducedMotion) {
    let ticking = false;
    window.addEventListener(
      "scroll",
      () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          const y = Math.min(window.scrollY, 600);
          heroFrame.style.transform = `translateY(${y * 0.15}px)`;
          ticking = false;
        });
      },
      { passive: true }
    );
  }

  /* ------------------------------------------------------------------ */
  /*  Testimonial slider                                                 */
  /* ------------------------------------------------------------------ */
  const track = document.getElementById("sliderTrack");
  if (track) {
    const slides = track.children;
    const dotsWrap = document.getElementById("sliderDots");
    let index = 0;
    let autoTimer;

    for (let i = 0; i < slides.length; i++) {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", `Testimonial ${i + 1}`);
      dot.addEventListener("click", () => goTo(i, true));
      dotsWrap.appendChild(dot);
    }
    const dots = dotsWrap.children;

    const render = () => {
      track.style.transform = `translateX(-${index * 100}%)`;
      for (let i = 0; i < dots.length; i++) {
        dots[i].classList.toggle("active", i === index);
        dots[i].setAttribute("aria-selected", String(i === index));
      }
    };

    const goTo = (i, userInitiated) => {
      index = (i + slides.length) % slides.length;
      render();
      if (userInitiated) restartAuto();
    };

    const restartAuto = () => {
      clearInterval(autoTimer);
      if (!prefersReducedMotion) {
        autoTimer = setInterval(() => goTo(index + 1, false), 6000);
      }
    };

    document
      .getElementById("slidePrev")
      .addEventListener("click", () => goTo(index - 1, true));
    document
      .getElementById("slideNext")
      .addEventListener("click", () => goTo(index + 1, true));

    // Pause auto-play while the user hovers the slider
    const slider = document.getElementById("testimonialSlider");
    slider.addEventListener("mouseenter", () => clearInterval(autoTimer));
    slider.addEventListener("mouseleave", restartAuto);

    // Basic swipe support
    let touchStartX = 0;
    slider.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.touches[0].clientX;
      },
      { passive: true }
    );
    slider.addEventListener(
      "touchend",
      (e) => {
        const delta = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(delta) > 50) goTo(index + (delta < 0 ? 1 : -1), true);
      },
      { passive: true }
    );

    render();
    restartAuto();
  }

  /* ------------------------------------------------------------------ */
  /*  FAQ accordion                                                      */
  /* ------------------------------------------------------------------ */
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");
    question.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");
      // Close the others so only one answer is open at a time
      faqItems.forEach((other) => {
        other.classList.remove("open");
        other.querySelector(".faq-question").setAttribute("aria-expanded", "false");
      });
      if (!isOpen) {
        item.classList.add("open");
        question.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* ------------------------------------------------------------------ */
  /*  Certificate lightbox                                               */
  /* ------------------------------------------------------------------ */
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const lightboxClose = document.getElementById("lightboxClose");

  const openLightbox = (src, alt, caption) => {
    lightboxImg.src = src;
    lightboxImg.alt = alt;
    lightboxCaption.textContent = caption;
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => lightbox.classList.add("show"));
    lightboxClose.focus();
    updatePriceBar();
  };

  const closeLightbox = () => {
    lightbox.classList.remove("show");
    document.body.style.overflow = "";
    setTimeout(() => {
      lightbox.hidden = true;
      lightboxImg.src = "";
      updatePriceBar();
    }, 350);
  };

  document.querySelectorAll("[data-lightbox]").forEach((figure) => {
    figure.addEventListener("click", () => {
      const img = figure.querySelector("img");
      openLightbox(figure.dataset.lightbox, img.alt, figure.dataset.caption);
    });
  });

  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  /* ------------------------------------------------------------------ */
  /*  Coaching plan confirmation modal + WhatsApp flow                   */
  /* ------------------------------------------------------------------ */
  const planModal = document.getElementById("planModal");
  const modalPlanName = document.getElementById("modalPlanName");
  const modalPlanPrice = document.getElementById("modalPlanPrice");
  const modalConfirm = document.getElementById("modalConfirm");
  const modalCancel = document.getElementById("modalCancel");
  const modalClose = document.getElementById("modalClose");
  const modalInstapay = document.getElementById("modalInstapay");

  let selectedPlan = { name: "", price: "" };
  let lastFocused = null;

  const openPlanModal = (name, price) => {
    selectedPlan = { name, price };
    modalPlanName.textContent = name;
    modalPlanPrice.textContent = price;
    lastFocused = document.activeElement;
    planModal.hidden = false;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => planModal.classList.add("show"));
    modalConfirm.focus();
    updatePriceBar();
  };

  const closePlanModal = () => {
    planModal.classList.remove("show");
    document.body.style.overflow = "";
    setTimeout(() => {
      planModal.hidden = true;
      if (lastFocused) lastFocused.focus();
      updatePriceBar();
    }, 350);
  };

  document.querySelectorAll(".choose-plan").forEach((button) => {
    button.addEventListener("click", () => {
      openPlanModal(button.dataset.plan, button.dataset.price);
    });
  });

  modalConfirm.addEventListener("click", () => {
    const message =
      "Hello Coach,\n" +
      "I would like to subscribe to the following online coaching package.\n\n" +
      "Package:\n" +
      selectedPlan.name +
      "\n\n" +
      "Price:\n" +
      selectedPlan.price +
      "\n\n" +
      "My Name:\n________\n\n" +
      "My Goal:\n________\n\n" +
      "Please contact me to complete the registration.";

    const url =
      "https://wa.me/" + COACH_WHATSAPP + "?text=" + encodeURIComponent(message);
    window.open(url, "_blank", "noopener");
    closePlanModal();
  });

  // InstaPay opens in a new tab (it's an anchor); just close the dialog behind it
  modalInstapay.addEventListener("click", () => {
    setTimeout(closePlanModal, 150);
  });

  modalCancel.addEventListener("click", closePlanModal);
  modalClose.addEventListener("click", closePlanModal);
  planModal.addEventListener("click", (e) => {
    if (e.target === planModal) closePlanModal();
  });

  // Escape closes whichever overlay is open
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (!planModal.hidden) closePlanModal();
    if (!lightbox.hidden) closeLightbox();
  });

  /* ------------------------------------------------------------------ */
  /*  Contact form → WhatsApp (frontend only, nothing is stored)         */
  /* ------------------------------------------------------------------ */
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = contactForm.name.value.trim();
      const goal = contactForm.goal.value;
      const messageText = contactForm.message.value.trim();

      let valid = true;
      [contactForm.name, contactForm.message].forEach((field) => {
        const empty = !field.value.trim();
        field.classList.toggle("invalid", empty);
        if (empty) valid = false;
      });
      if (!goal) {
        contactForm.goal.classList.add("invalid");
        valid = false;
      } else {
        contactForm.goal.classList.remove("invalid");
      }
      if (!valid) return;

      const message =
        "Hello Coach,\n\n" +
        "My Name:\n" + name + "\n\n" +
        "My Goal:\n" + goal + "\n\n" +
        "Message:\n" + messageText;

      const url =
        "https://wa.me/" + COACH_WHATSAPP + "?text=" + encodeURIComponent(message);
      window.open(url, "_blank", "noopener");
      contactForm.reset();
    });
  }

  /* ------------------------------------------------------------------ */
  /*  Sticky price bar                                                   */
  /*  Appears once you scroll past the hero, hides while the pricing     */
  /*  section or footer is in view, or while a dialog is open.           */
  /* ------------------------------------------------------------------ */
  const priceBar = document.getElementById("priceBar");
  const pricingSection = document.getElementById("pricing");
  const footerEl = document.querySelector(".footer");
  const inView = new Set();

  function updatePriceBar() {
    if (!priceBar) return;
    const pastHero = window.scrollY > window.innerHeight * 0.55;
    const dialogOpen =
      (planModal && !planModal.hidden) || (lightbox && !lightbox.hidden);
    const show = pastHero && inView.size === 0 && !dialogOpen;
    priceBar.classList.toggle("show", show);
    priceBar.setAttribute("aria-hidden", String(!show));
  }

  if (priceBar && "IntersectionObserver" in window) {
    const barObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) inView.add(entry.target);
          else inView.delete(entry.target);
        });
        updatePriceBar();
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.01 }
    );
    if (pricingSection) barObserver.observe(pricingSection);
    if (footerEl) barObserver.observe(footerEl);
    window.addEventListener("scroll", updatePriceBar, { passive: true });
    window.addEventListener("resize", updatePriceBar, { passive: true });
    updatePriceBar();
  }

  /* ------------------------------------------------------------------ */
  /*  Footer year                                                        */
  /* ------------------------------------------------------------------ */
  document.getElementById("year").textContent = new Date().getFullYear();
})();
