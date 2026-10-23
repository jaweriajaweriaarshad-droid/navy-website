
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  // 1. Mobile navigation
  const menuToggle = $("#menuToggle");
  const nav = $("#nav");

  function closeMenu() {
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
  }

  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    menuToggle.innerHTML = isOpen
      ? '<i class="fa-solid fa-xmark"></i>'
      : '<i class="fa-solid fa-bars"></i>';
  });

  $$("#nav a").forEach(link => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", event => {
    if (!nav.contains(event.target) &&
        !menuToggle.contains(event.target)) {
      closeMenu();
    }
  });

  // 2. Search panel
  const searchToggle = $("#searchToggle");
  const searchPanel = $("#searchPanel");
  const searchInput = $("#searchInput");
  const searchMessage = $("#searchMessage");

  searchToggle.addEventListener("click", () => {
    searchPanel.hidden = !searchPanel.hidden;
    if (!searchPanel.hidden) searchInput.focus();
    else {
      clearSearchHighlights();
      searchMessage.textContent = "";
    }
  });

  function clearSearchHighlights() {
    $$(".search-result").forEach(element => {
      element.classList.remove("search-result");
    });
  }

  $("#searchForm").addEventListener("submit", event => {
    event.preventDefault();
    clearSearchHighlights();

    const query = searchInput.value.trim().toLowerCase();

    if (!query) {
      searchMessage.textContent = "Please enter a word to search.";
      searchInput.focus();
      return;
    }

    const searchable = $$(
      "main section, .history-card, .feature-card, .person-card, .news-card"
    );

    const matches = searchable.filter(element =>
      element.textContent.toLowerCase().includes(query)
    );

    // Prefer the smallest matching content sections.
    const bestMatches = matches.filter(element =>
      !matches.some(other =>
        other !== element &&
        other.contains(element)
      )
    );

    if (!bestMatches.length) {
      searchMessage.textContent = "No results found. Try 'history', 'fleet' or 'careers'.";
      return;
    }

    const target = bestMatches[0];
    target.classList.add("search-result");
    target.scrollIntoView({ behavior: "smooth", block: "center" });

    searchMessage.textContent =
      `${bestMatches.length} matching section(s) found. Showing the first result.`;
  });

  // 3. History and information stories
  const stories = {
    beginning: {
      title: "The Beginning — 1947",
      text: [
        "The Royal Pakistan Navy came into existence when Pakistan became independent on 14 August 1947. Its early responsibilities included establishing naval administration, operating inherited vessels and developing personnel and shore facilities.",
        "The service began with limited resources and infrastructure. Building professional training, technical support and operational capacity became important tasks in the years that followed.",
        "Source: Pakistan Navy's official history archive."
      ]
    },
    identity: {
      title: "A New National Identity — 1956",
      text: [
        "Pakistan became a republic on 23 March 1956. The naval service subsequently came to be known as the Pakistan Navy rather than the Royal Pakistan Navy.",
        "This period formed part of the institution's continuing development of its national identity, professional traditions and organisational structure.",
        "For exact dates and detailed historical records, consult the official Pakistan Navy history archive."
      ]
    },
    war1965: {
      title: "The 1965 War",
      text: [
        "The 1965 war is an important chapter in Pakistan's military and naval history. Naval activity took place in the wider context of conflict between Pakistan and India.",
        "Operation Dwarka is among the best-known naval operations associated with this period. Historical accounts describe the operation as a Pakistan Navy attack on the Indian coastal installation at Dwarka in September 1965.",
        "The events of this period remain part of naval commemorations and historical study. For detailed operational accounts, consult official archives and recognised historical sources."
      ]
    },
    war1971: {
      title: "The 1971 War",
      text: [
        "The 1971 war was a major turning point in the history of Pakistan. The conflict involved operations across different theatres and brought significant challenges to Pakistan's armed forces, including its Navy.",
        "The experience influenced subsequent discussions about maritime defence, readiness, logistics, organisation and long-term capability development.",
        "This summary is an educational introduction, not a complete operational history."
      ]
    },
    modern: {
      title: "Modern Maritime Service",
      text: [
        "Modern naval services operate across a complex maritime environment. Their work can include maritime security, protection of sea routes, surveillance, training, disaster relief and international cooperation.",
        "Technology, professional education, maintenance, communications and teamwork are important to a modern maritime organisation.",
        "Current platforms, recruitment notices and official announcements should be checked through the Pakistan Navy's official website."
      ]
    },
    surface: {
      title: "Surface Fleet",
      text: [
        "Surface vessels are an important part of maritime forces. Depending on their type and equipment, naval ships may undertake patrol, surveillance, training, escort and other maritime duties.",
        "A vessel's specific role depends on its class, configuration and assigned mission. This page is a general educational overview rather than an official inventory."
      ]
    },
    aviation: {
      title: "Naval Aviation",
      text: [
        "Naval aviation can support maritime observation, search and rescue, transport and other operations. The capabilities of a particular aircraft depend on its design, equipment and assigned role.",
        "Aircrew, engineers, technicians and support personnel contribute to safe and effective aviation operations."
      ]
    },
    undersea: {
      title: "Undersea & Coastal Forces",
      text: [
        "Undersea capabilities, coastal forces and maritime support organisations form parts of a broad naval environment.",
        "Their work depends on specialised training, safety, maintenance, communications and coordination. Detailed platform information should be verified using authoritative public sources."
      ]
    },
    leadership: {
      title: "Naval Leadership",
      text: [
        "Naval leadership involves responsibility, professional judgement, teamwork and the ability to make decisions in demanding conditions.",
        "Officers and experienced personnel work across leadership, technical, operational, administrative and support roles."
      ]
    },
    professions: {
      title: "People & Professions",
      text: [
        "A naval organisation requires many different professions, including engineering, medicine, logistics, information technology, administration, operations and technical maintenance.",
        "Available roles, eligibility requirements and opportunities for women and men vary by branch and recruitment notice. Always check the current official recruitment information."
      ]
    },
    training: {
      title: "Training & Teamwork",
      text: [
        "Training helps personnel develop professional skills, fitness, safety awareness, discipline and teamwork.",
        "Different career paths require different educational qualifications and selection processes. Official notices provide the current criteria and application steps."
      ]
    }
  };

  const storyModal = $("#storyModal");
  const modalTitle = $("#modalTitle");
  const modalBody = $("#modalBody");
  let lastFocusedElement = null;

  function openModal(modal) {
    lastFocusedElement = document.activeElement;
    modal.hidden = false;
    document.body.classList.add("modal-open");
    const closeButton = $("[data-close]", modal);
    if (closeButton) closeButton.focus();
  }

  function closeModal(modal) {
    if (!modal || modal.hidden) return;
    modal.hidden = true;

    if ($("#storyModal").hidden && $("#imageModal").hidden) {
      document.body.classList.remove("modal-open");
    }

    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
      lastFocusedElement.focus();
    }
  }

  function showStory(key) {
    const story = stories[key];
    if (!story) return;

    modalTitle.textContent = story.title;
    modalBody.replaceChildren();

    story.text.forEach(paragraph => {
      const p = document.createElement("p");
      p.textContent = paragraph;
      modalBody.appendChild(p);
    });

    openModal(storyModal);
  }

  // Event delegation handles all story buttons.
  document.addEventListener("click", event => {
    const button = event.target.closest("[data-story]");
    if (button) showStory(button.dataset.story);
  });

  // 4. Close buttons and clicking outside a popup
  $$("[data-close]").forEach(button => {
    button.addEventListener("click", () => {
      closeModal(document.getElementById(button.dataset.close));
    });
  });

  [storyModal, $("#imageModal")].forEach(modal => {
    modal.addEventListener("click", event => {
      if (event.target === modal) closeModal(modal);
    });
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeModal(storyModal);
      closeModal($("#imageModal"));
      searchPanel.hidden = true;
      clearSearchHighlights();
      closeMenu();
    }
  });

  // 5. Gallery image preview
  const imageModal = $("#imageModal");
  const expandedImage = $("#expandedImage");
  const expandedCaption = $("#expandedCaption");

  $$(".gallery-item").forEach(item => {
    item.addEventListener("click", () => {
      expandedImage.src = item.dataset.image;
      expandedImage.alt = item.dataset.alt || "Gallery image";
      expandedCaption.textContent = item.dataset.alt || "Maritime gallery";
      openModal(imageModal);
    });
  });

  // 6. Scroll reveal animations
  const revealItems = $$(".reveal");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealItems.forEach(item => revealObserver.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add("visible"));
  }

  // 7. Back-to-top button
  const backToTop = $("#backToTop");

  window.addEventListener("scroll", () => {
    backToTop.classList.toggle("visible", window.scrollY > 450);
  }, { passive: true });

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // 8. Highlight the current navigation section
  const sections = $$("main section[id]");
  const navLinks = $$("#nav a");

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        navLinks.forEach(link => {
          const active = link.getAttribute("href") === `#${entry.target.id}`;
          link.classList.toggle("active", active);

          if (active) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-25% 0px -65% 0px" });

    sections.forEach(section => sectionObserver.observe(section));
  }

  // 9. Contact form validation
  const contactForm = $("#contactForm");
  const formMessage = $("#formMessage");

  contactForm.addEventListener("submit", event => {
    event.preventDefault();
    formMessage.textContent = "";

    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      formMessage.textContent = "Please complete all fields correctly.";
      return;
    }

    const name = $("#name").value.trim();
    const email = $("#email").value.trim();
    const subject = $("#subject").value.trim();
    const message = $("#message").value.trim();

    if (name.length < 2 || message.length < 10) {
      formMessage.textContent = "Name must have at least 2 characters and message at least 10.";
      return;
    }

    // This demo validates the form but does not send or store messages.
    formMessage.textContent =
      `Thank you, ${name}. Your form is valid, but this demo does not send messages. Connect a backend to enable delivery.`;

    console.info("Validated demo form:", {
      name,
      email,
      subject,
      messageLength: message.length
    });
  });

  // 10. Automatic footer year
  $("#currentYear").textContent = new Date().getFullYear();

});
