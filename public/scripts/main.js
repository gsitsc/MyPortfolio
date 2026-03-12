const revealElements = document.querySelectorAll('[data-reveal]');
const navLinks = document.querySelectorAll('.site-nav a');
const sections = document.querySelectorAll('main section[id]');
const profileImage = document.getElementById('profileImage');
const portraitFrame = document.getElementById('portraitFrame');
const interactionStatus = document.getElementById('interactionStatus');
const heroCopy = document.querySelector('.hero-copy');
const heroVisual = document.querySelector('.hero-visual');
const workTabs = document.querySelectorAll('.work-tab');
const timelineTabs = document.querySelectorAll('.timeline-tab');
const contactActions = document.querySelectorAll('[data-contact-action]');
const scrollProgressBar = document.getElementById('scrollProgressBar');
const scrollSectionLabel = document.getElementById('scrollSectionLabel');
const heroDynamicNote = document.getElementById('heroDynamicNote');
const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

let statusTimer;
let rafId;

const sectionLabelMap = {
    top: 'Intro',
    about: 'About',
    experience: 'Experience',
    work: 'Work',
    skills: 'Skills',
    contact: 'Contact',
};

const sectionHeroMessageMap = {
    top: '',
    about: 'Now viewing: About and engineering philosophy',
    experience: 'Now viewing: Enterprise delivery experience',
    work: 'Now viewing: Selected work highlights',
    skills: 'Now viewing: Core technical strengths',
    contact: 'Now viewing: Contact and collaboration options',
};

const syncPortraitBackground = () => {
    if (!profileImage || !portraitFrame) {
        return;
    }

    const imageSource = profileImage.currentSrc || profileImage.src;
    if (!imageSource) {
        return;
    }

    portraitFrame.style.setProperty('--portrait-image', `url("${imageSource}")`);
};

const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
        });
    },
    {
        threshold: 0.16,
        rootMargin: '0px 0px -8% 0px',
    },
);

revealElements.forEach((element) => {
    revealObserver.observe(element);
});

const addGroupedRevealDelays = () => {
    const groupedSelectors = ['.timeline-card', '.work-card', '.skill-columns > div', '.contact-grid > a, .contact-grid > div'];
    groupedSelectors.forEach((selector) => {
        document.querySelectorAll(selector).forEach((item, index) => {
            const delay = Math.min(index * 80, 320);
            item.style.setProperty('--reveal-delay', `${delay}ms`);
        });
    });
};

addGroupedRevealDelays();

const showStatus = (message) => {
    if (!interactionStatus) {
        return;
    }

    interactionStatus.textContent = message;
    interactionStatus.classList.add('is-visible');

    clearTimeout(statusTimer);
    statusTimer = setTimeout(() => {
        interactionStatus.classList.remove('is-visible');
    }, 2200);
};

const emphasizeSection = (targetId) => {
    if (!targetId) {
        return;
    }

    const section = document.querySelector(targetId);
    if (!section) {
        return;
    }

    section.classList.remove('section-emphasis');
    requestAnimationFrame(() => {
        section.classList.add('section-emphasis');
    });

    window.setTimeout(() => {
        section.classList.remove('section-emphasis');
    }, 980);
};

const setActiveLink = () => {
    let activeId = '';

    sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 160 && rect.bottom >= 160) {
            activeId = section.id;
        }
    });

    navLinks.forEach((link) => {
        const isActive = link.getAttribute('href') === `#${activeId}`;
        link.classList.toggle('active', isActive);
    });

    if (scrollSectionLabel) {
        const nextLabel = sectionLabelMap[activeId] || 'Intro';
        scrollSectionLabel.textContent = nextLabel;
    }

    if (heroDynamicNote) {
        heroDynamicNote.textContent = sectionHeroMessageMap[activeId] || '';
    }
};

const updateHeroDepth = () => {
    if (!heroCopy || !heroVisual) {
        return;
    }

    if (reducedMotionQuery.matches || window.innerWidth <= 1100) {
        heroCopy.style.transform = '';
        heroVisual.style.transform = '';
        return;
    }

    const y = Math.min(window.scrollY, 360);
    heroCopy.style.transform = `translate3d(0, ${y * 0.035}px, 0)`;
    heroVisual.style.transform = `translate3d(0, ${-y * 0.06}px, 0)`;
};

const updateScrollProgress = () => {
    if (!scrollProgressBar) {
        return;
    }

    const doc = document.documentElement;
    const scrollable = doc.scrollHeight - window.innerHeight;
    if (scrollable <= 0) {
        scrollProgressBar.style.transform = 'scaleX(0)';
        return;
    }

    const progress = Math.min(Math.max(window.scrollY / scrollable, 0), 1);
    scrollProgressBar.style.transform = `scaleX(${progress})`;
};

const onScrollEffects = () => {
    if (rafId) {
        return;
    }

    rafId = window.requestAnimationFrame(() => {
        setActiveLink();
        updateHeroDepth();
        updateScrollProgress();
        rafId = null;
    });
};

if (profileImage && portraitFrame) {
    profileImage.addEventListener('load', () => {
        syncPortraitBackground();
        portraitFrame.classList.remove('is-fallback');
    });

    profileImage.addEventListener('error', () => {
        portraitFrame.classList.add('is-fallback');
    });

    if (profileImage.complete && profileImage.naturalWidth > 0) {
        syncPortraitBackground();
        portraitFrame.classList.remove('is-fallback');
    }
}

setActiveLink();
updateHeroDepth();
updateScrollProgress();
window.addEventListener('scroll', onScrollEffects, { passive: true });
window.addEventListener('resize', () => {
    setActiveLink();
    updateHeroDepth();
    updateScrollProgress();
});

navLinks.forEach((link) => {
    link.addEventListener('click', () => {
        const targetId = link.getAttribute('href');
        emphasizeSection(targetId);
    });
});

const contactJumpButton = document.querySelector('[data-contact-jump]');
if (contactJumpButton) {
    contactJumpButton.addEventListener('click', () => {
        emphasizeSection('#contact');
        showStatus('Contact section ready. Choose your preferred contact method.');
    });
}

// Mobile hero avatar — syncs with the same profile image used in the portrait card
const heroAvatarWrap = document.getElementById('heroAvatarWrap');
const heroAvatar = document.getElementById('heroAvatar');

if (heroAvatarWrap && heroAvatar && profileImage) {
    const syncAvatar = () => {
        const src = profileImage.currentSrc || profileImage.src;
        if (src) {
            heroAvatar.src = src;
            heroAvatarWrap.classList.remove('show-fallback');
        }
    };

    if (profileImage.complete && profileImage.naturalWidth > 0) {
        syncAvatar();
    }

    profileImage.addEventListener('load', syncAvatar);
    profileImage.addEventListener('error', () => {
        heroAvatarWrap.classList.add('show-fallback');
    });
}

// On mobile (touch) devices, "Get in touch" dials the phone directly
const navCta = document.querySelector('.nav-cta');
if (navCta && window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
    navCta.href = 'tel:+15148874747';
}

workTabs.forEach((tab) => {
    const detailsId = tab.getAttribute('aria-controls');
    const details = detailsId ? document.getElementById(detailsId) : null;
    const card = tab.closest('.work-card');
    const hint = tab.querySelector('.work-tab-hint');

    if (hint) {
        hint.textContent = 'Show details';
    }

    if (details) {
        details.setAttribute('data-expanded', 'false');
    }
    if (card) {
        card.classList.remove('is-expanded');
    }

    tab.addEventListener('click', () => {
        if (!detailsId) {
            return;
        }

        if (!details) {
            return;
        }

        const isExpanded = tab.getAttribute('aria-expanded') === 'true';
        tab.setAttribute('aria-expanded', String(!isExpanded));
        details.hidden = isExpanded;
        details.setAttribute('data-expanded', String(!isExpanded));
        if (hint) {
            hint.textContent = isExpanded ? 'Show details' : 'Hide details';
        }
        if (card) {
            card.classList.toggle('is-expanded', !isExpanded);
        }
    });

    tab.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') {
            return;
        }

        event.preventDefault();
        tab.click();
    });
});

timelineTabs.forEach((tab) => {
    const detailsId = tab.getAttribute('aria-controls');
    const details = detailsId ? document.getElementById(detailsId) : null;
    const card = tab.closest('.timeline-card');
    const hint = tab.querySelector('.timeline-tab-hint');

    if (hint) {
        hint.textContent = 'Show details';
    }
    if (details) {
        details.setAttribute('data-expanded', 'false');
    }
    if (card) {
        card.classList.remove('is-expanded');
    }

    tab.addEventListener('click', () => {
        if (!detailsId || !details) {
            return;
        }
        const isExpanded = tab.getAttribute('aria-expanded') === 'true';
        tab.setAttribute('aria-expanded', String(!isExpanded));
        details.hidden = isExpanded;
        details.setAttribute('data-expanded', String(!isExpanded));
        if (hint) {
            hint.textContent = isExpanded ? 'Show details' : 'Hide details';
        }
        if (card) {
            card.classList.toggle('is-expanded', !isExpanded);
        }
    });

    tab.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') {
            return;
        }
        event.preventDefault();
        tab.click();
    });
});

window.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') {
        return;
    }

    workTabs.forEach((tab) => {
        const detailsId = tab.getAttribute('aria-controls');
        if (!detailsId) {
            return;
        }

        const details = document.getElementById(detailsId);
        if (!details || tab.getAttribute('aria-expanded') !== 'true') {
            return;
        }

        const card = tab.closest('.work-card');
        const hint = tab.querySelector('.work-tab-hint');
        tab.setAttribute('aria-expanded', 'false');
        if (hint) {
            hint.textContent = 'Show details';
        }
        details.hidden = true;
        details.setAttribute('data-expanded', 'false');
        if (card) {
            card.classList.remove('is-expanded');
        }
    });

    timelineTabs.forEach((tab) => {
        const detailsId = tab.getAttribute('aria-controls');
        if (!detailsId) {
            return;
        }
        const details = document.getElementById(detailsId);
        if (!details || tab.getAttribute('aria-expanded') !== 'true') {
            return;
        }
        const card = tab.closest('.timeline-card');
        const hint = tab.querySelector('.timeline-tab-hint');
        tab.setAttribute('aria-expanded', 'false');
        if (hint) {
            hint.textContent = 'Show details';
        }
        details.hidden = true;
        details.setAttribute('data-expanded', 'false');
        if (card) {
            card.classList.remove('is-expanded');
        }
    });
});

contactActions.forEach((action) => {
    const actionType = action.getAttribute('data-contact-action');
    const actionMessageMap = {
        email: 'Opening your email client so you can share project context.',
        phone: 'Starting a direct call for faster discussion.',
        linkedin: 'Opening LinkedIn for a professional connection.',
    };

    action.addEventListener('mouseenter', () => {
        contactActions.forEach((item) => item.classList.remove('is-focused-action'));
        action.classList.add('is-focused-action');
    });

    action.addEventListener('mouseleave', () => {
        action.classList.remove('is-focused-action');
    });

    action.addEventListener('focus', () => {
        contactActions.forEach((item) => item.classList.remove('is-focused-action'));
        action.classList.add('is-focused-action');
    });

    action.addEventListener('blur', () => {
        action.classList.remove('is-focused-action');
    });

    action.addEventListener('click', () => {
        const message = actionMessageMap[actionType];
        if (message) {
            showStatus(message);
        }
    });

    action.addEventListener('touchstart', () => {
        contactActions.forEach((item) => item.classList.remove('is-focused-action'));
        action.classList.add('is-focused-action');
    }, { passive: true });
});

// Mobile show-more / show-less toggles
// Buttons are CSS display:none on desktop — this logic only activates on phones
document.querySelectorAll('.mobile-show-more').forEach((btn) => {
    btn.addEventListener('click', () => {
        const targetClass = btn.dataset.target;
        const container = document.querySelector(`.${targetClass}`);
        if (!container) return;

        const isExpanded = btn.getAttribute('aria-expanded') === 'true';

        if (isExpanded) {
            container.classList.remove('mobile-expanded');
            btn.setAttribute('aria-expanded', 'false');
            btn.textContent = btn.dataset.labelMore;
        } else {
            container.classList.add('mobile-expanded');
            btn.setAttribute('aria-expanded', 'true');
            btn.textContent = btn.dataset.labelLess;
            // After display:none → display:block, wait one frame before animating
            requestAnimationFrame(() => {
                container.querySelectorAll('[data-mobile-extra][data-reveal]').forEach((el) => {
                    revealObserver.unobserve(el);
                    el.classList.add('is-visible');
                });
            });
        }
    });
});