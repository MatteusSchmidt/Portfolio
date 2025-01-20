document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('nav a')
function highlightClosestSection() {
    let highlightedSection = null;
    let closestTop = Number.NEGATIVE_INFINITY;
    let cutoff = (window.innerHeight / 10) * 3;
    sections.forEach(section => {
        section.classList.remove('active')
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
window.addEventListener('scroll', highlightClosestSection);
document.addEventListener('DOMContentLoaded', highlightClosestSection);

document.addEventListener("DOMContentLoaded", () => {
    const projects = document.querySelectorAll(".project");
    const placeholders = document.querySelectorAll(".placeholder");
    const titles = document.querySelectorAll(".project-title");
    const overlays = document.querySelectorAll('.overlay');
    const dropdowns = document.querySelectorAll('.dropdown');
    let stacked = true; // Initial state is stacked

    // IntersectionObserver logic
    const projectsObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            const scale = 0.7 + (0.3 * entry.intersectionRatio);
            entry.target.style.transform = `scale(${scale})`; // Adjust scale based on visibility
            entry.target.style.opacity = `${scale}`; // Adjust opacity
        });
    }, {
        threshold: Array.from({ length: 101 }, (_, i) => i / 100),
        rootMargin: "-20px",
    });

    // Observe each project for scaling on intersection
    projects.forEach(project => {
        projectsObserver.observe(project);
    });

    // Function to stack the cards
    function stackCards() {
        // Temporarily disable the observer
        toggleObserver(false);

        dropdowns.forEach(dropdown => {
            dropdown.style.display = 'none';
        });

        overlays.forEach(overlay => {
            overlay.style.opacity = '1';
            overlay.style.transition = "opacity 1s ease-out";
        });

        placeholders.forEach(placeholder => {
            if (window.innerWidth <= 1024) {
                placeholder.style.height = "360px";
            }
            else {
                placeholder.style.height = "400px";
            }
        });

        titles.forEach(title => {
            title.style.opacity = "1";
            // title.style.transition = "opacity 1s ease-out";
        });

        projects.forEach((project, index) => {
            const maxWidth = 830; // Maximum width for the cards in pixels
            const baseScale = 1 - index * 0.03; // Decrease scale with index
            const width = Math.min(maxWidth, window.innerWidth - 100);

            if (window.innerWidth <= 1024) {
                project.style.marginTop = `${index === 0 ? -443 : -393}px`;
            }
            else {
                project.style.marginTop = `${index === 0 ? -453 : -403}px`;
            }
            project.style.position = "absolute"; // Stack on top of each other
            project.style.opacity = "1";
            project.style.width = `${width}px`; // Apply dynamic width based on scale
            project.style.transform = `scale(${baseScale}) translateY(${index * 5}px) rotate(${index !== 0 ? ((index % 2 === 0 ? -1 : 1) * 2) : 0}deg)`; // Combine scale and stacking
            project.style.zIndex = `${-1-index}`; // Higher index for the top card
            project.style.transition = "transform 1s ease-out";
        });
    }

    // Function to unstack the cards
    function unstackCards() {
        dropdowns.forEach(dropdown => {
            dropdown.style.display = 'inline-block';
        });

        overlays.forEach(overlay => {
            overlay.style.opacity = '0';
            overlay.style.transition = "opacity 1s ease-out";
        });

        placeholders.forEach(placeholder => {
            placeholder.style.height = "0";
        });

        titles.forEach(title => {
            title.style.opacity = "0";
            // title.style.transition = "opacity 1s ease-out";
        });

        projects.forEach((project, index) => {
            project.style.width = "100%";
            project.style.marginTop = `${index === 0 ? 0 : 50}px`;
            project.style.position = "relative"; // Reset to normal flow
            project.style.transform = `translateY(${index * 50}px) rotate(0deg) scale(1)`; // Spread cards and reset scale
            project.style.zIndex = "0"; // Reset z-index
            project.style.transition = "transform 1s ease-out";
        });
        // Re-enable the observer after unstacking
        setTimeout(() => toggleObserver(true), 500); // Wait for animations to finish
    }

    // Function to enable/disable the IntersectionObserver
    function toggleObserver(enable) {
        if (enable) {
            projects.forEach(project => projectsObserver.observe(project));
        } else {
            projects.forEach(project => projectsObserver.unobserve(project));
        }
    }

    // Add click event listener to toggle stacking
    titles.forEach(title => {
        title.addEventListener("click", () => {
            if (stacked) {
                unstackCards();
            } else {
                stackCards();
            }
            stacked = !stacked; // Toggle state
        });
    });

    dropdowns.forEach(dropdown => {
        dropdown.addEventListener("click", () => {
            if (stacked) {
                unstackCards();
            } else {
                stackCards();
            }
            stacked = !stacked; // Toggle state
        });
    });

    // Initially stack the cards on page load
    stackCards();

    window.addEventListener("resize", () => {
        if (stacked) {
            stackCards(); // Recalculate and reapply stacked widths on resize
        }
    });
});

//

const skills = document.querySelectorAll(".skill-object")
const skillsObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        const leftValue = entry.boundingClientRect.left;
        if (entry.isIntersecting) {
            const waitTime = leftValue;
            setTimeout(() => {
                entry.target.classList.add("fade-in-up");
            }, waitTime);
            skillsObserver.unobserve(entry.target)
        }
    })
}, {
    rootMargin: "-50px"
});
skills.forEach(skill => {
    skillsObserver.observe(skill);
});

const experience1 = document.querySelectorAll(".experience-container-1 .experience-text-container, .arrow")
const experience1Observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("bounce-left")
            experience1Observer.unobserve(entry.target);
        }
    })
}, {
    // rootMargin: "-400px"
});
experience1.forEach(experience => {
    experience1Observer.observe(experience);
})

const experience2 = document.querySelectorAll(".experience-container-2 .experience-text-container, .arrow-2")
const experience2Observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("bounce-right")
            experience2Observer.unobserve(entry.target);
        }
    })
}, {
    // rootMargin: "-200px"
});
experience2.forEach(experience => {
    experience2Observer.observe(experience);
})

function setSpacerHeight() {
    var height = document.getElementById("experience-spacer").offsetHeight;
    var firstOuterCircle = document.getElementById("first-outer-circle");
    firstOuterCircle.style.setProperty('--before-height', height - 30 + 'px');
}
window.onload = setSpacerHeight;
window.onresize = setSpacerHeight;