// Utility functions
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

// Navigation smooth scroll
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Section highlighting on scroll
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('nav a');

function highlightClosestSection() {
    let highlightedSection = null;
    let closestTop = Number.NEGATIVE_INFINITY;
    let cutoff = (window.innerHeight / 10) * 3;

    sections.forEach(section => {
        section.classList.remove('active');
        const rect = section.getBoundingClientRect();
        if (rect.top <= cutoff && rect.top > closestTop) {
            closestTop = rect.top;
            highlightedSection = section;
        }
    });

    if (highlightedSection) {
        highlightedSection.classList.add('active');
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href').substring(1) === highlightedSection.id);
        });
    }
}

const throttledHighlight = throttle(highlightClosestSection, 100);
window.addEventListener('scroll', throttledHighlight);

// Projects card stacking functionality
document.addEventListener('DOMContentLoaded', () => {
    highlightClosestSection(); // Initial call

    const projects = document.querySelectorAll(".project");
    const placeholders = document.querySelectorAll(".placeholder");
    const titles = document.querySelectorAll(".project-title");
    const overlays = document.querySelectorAll('.overlay');
    const dropdowns = document.querySelectorAll('.dropdown');
    let stacked = true;

    // IntersectionObserver for project scaling
    const projectsObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            const scale = 0.7 + (0.3 * entry.intersectionRatio);
            entry.target.style.transform = `scale(${scale})`;
            entry.target.style.opacity = `${scale}`;
        });
    }, {
        threshold: Array.from({ length: 101 }, (_, i) => i / 100),
        rootMargin: "-20px",
    });

    projects.forEach(project => {
        projectsObserver.observe(project);
    });

    function stackCards() {
        toggleObserver(false);

        dropdowns.forEach(dropdown => {
            dropdown.style.display = 'none';
        });

        overlays.forEach(overlay => {
            // Clean up any existing transition handler
            if (overlay._transitionHandler) {
                overlay.removeEventListener('transitionend', overlay._transitionHandler);
                delete overlay._transitionHandler;
            }

            // Mark overlay as intentionally visible
            overlay._shouldBeVisible = true;

            // Show overlay immediately without transition
            overlay.style.transition = "none";
            overlay.style.display = 'block';
            overlay.style.opacity = '1';
        });

        placeholders.forEach(placeholder => {
            if (window.innerWidth <= 400) {
                placeholder.style.height = "400px";
            } else if (window.innerWidth <= 1024) {
                placeholder.style.height = "360px";
            } else {
                placeholder.style.height = "400px";
            }
        });

        titles.forEach(title => {
            title.style.display = "block";
        });

        projects.forEach((project, index) => {
            const maxWidth = 830;
            const baseScale = 1 - index * 0.03;
            const width = Math.min(maxWidth, window.innerWidth - 100);

            if (window.innerWidth <= 1024) {
                project.style.marginTop = `${index === 0 ? -443 : -393}px`;
            } else {
                project.style.marginTop = `${index === 0 ? -453 : -403}px`;
            }

            project.style.position = "absolute";
            project.style.opacity = "1";
            project.style.width = `${width}px`;
            project.style.transform = `scale(${baseScale}) translateY(${index * 5}px) rotate(${index !== 0 ? ((index % 2 === 0 ? -1 : 1) * 2) : 0}deg)`;
            project.style.zIndex = `${-1-index}`;
        });
    }

    function unstackCards() {
        dropdowns.forEach(dropdown => {
            dropdown.style.display = 'inline-block';
        });

        overlays.forEach(overlay => {
            // Mark overlay as intentionally hidden
            overlay._shouldBeVisible = false;

            // Remove any existing listener first
            if (overlay._transitionHandler) {
                overlay.removeEventListener('transitionend', overlay._transitionHandler);
            }

            // Define and store the handler
            overlay._transitionHandler = function handleTransitionEnd(event) {
                // Only hide if it's still supposed to be hidden (not re-stacked during transition)
                if (event.propertyName === 'opacity' && !overlay._shouldBeVisible) {
                    overlay.style.display = 'none';
                }
                overlay.removeEventListener('transitionend', overlay._transitionHandler);
                delete overlay._transitionHandler;
            };

            overlay.style.transition = "opacity 1s ease-out";
            overlay.style.opacity = '0';
            overlay.addEventListener('transitionend', overlay._transitionHandler);
        });

        placeholders.forEach(placeholder => {
            placeholder.style.height = "0";
        });

        titles.forEach(title => {
            title.style.display = "none";
        });

        projects.forEach((project, index) => {
            project.style.width = "100%";
            project.style.marginTop = `${index === 0 ? 0 : 50}px`;
            project.style.position = "relative";
            project.style.transform = `translateY(${index * 50}px) rotate(0deg) scale(1)`;
            project.style.zIndex = "0";
        });

        setTimeout(() => toggleObserver(true), 500);
    }

    function toggleObserver(enable) {
        if (enable) {
            projects.forEach(project => projectsObserver.observe(project));
        } else {
            projects.forEach(project => projectsObserver.unobserve(project));
        }
    }

    // Toggle stacking on title click
    titles.forEach(title => {
        title.addEventListener("click", () => {
            if (stacked) {
                unstackCards();
            } else {
                stackCards();
            }
            stacked = !stacked;
        });
    });

    // Toggle stacking on dropdown click
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener("click", () => {
            if (stacked) {
                unstackCards();
            } else {
                stackCards();
            }
            stacked = !stacked;
        });
    });

    stackCards();

    // Debounced resize handler for card stacking
    const stackCardsResizeHandler = debounce(() => {
        if (stacked) {
            stackCards();
        }
    }, 150);

    window.addEventListener("resize", stackCardsResizeHandler);
});

// Skills animation observer
const skills = document.querySelectorAll(".skill-object");
const skillTimeouts = new WeakMap(); // Track timeouts for cleanup

const skillsObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const leftValue = entry.boundingClientRect.left;
            const waitTime = leftValue;

            const timeoutId = setTimeout(() => {
                entry.target.classList.add("fade-in-up");
                skillTimeouts.delete(entry.target); // Clean up reference
            }, waitTime);

            skillTimeouts.set(entry.target, timeoutId);
            skillsObserver.unobserve(entry.target);
        }
    });
}, {
    rootMargin: "-50px"
});

skills.forEach(skill => {
    skillsObserver.observe(skill);
});

// Experience animations
const experience1 = document.querySelectorAll(".experience-container-1 .experience-text-container, .arrow");
const experience1Observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("bounce-left");
            experience1Observer.unobserve(entry.target);
        }
    });
});

experience1.forEach(experience => {
    experience1Observer.observe(experience);
});

const experience2 = document.querySelectorAll(".experience-container-2 .experience-text-container, .arrow-2");
const experience2Observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("bounce-right");
            experience2Observer.unobserve(entry.target);
        }
    });
});

experience2.forEach(experience => {
    experience2Observer.observe(experience);
});

// Spacer height management
function setSpacerHeight() {
    const spacer = document.getElementById("experience-spacer");
    const firstOuterCircle = document.getElementById("first-outer-circle");

    if (spacer && firstOuterCircle) {
        const height = spacer.offsetHeight;
        firstOuterCircle.style.setProperty('--before-height', height - 30 + 'px');
    }
}

// Set initial spacer height and handle resize
window.addEventListener('load', setSpacerHeight);
window.addEventListener('resize', debounce(setSpacerHeight, 100));