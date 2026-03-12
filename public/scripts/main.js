const revealElements = document.querySelectorAll('[data-reveal]');
const navLinks = document.querySelectorAll('.site-nav a');
const sections = document.querySelectorAll('main section[id]');
const profileImage = document.getElementById('profileImage');
const portraitFrame = document.getElementById('portraitFrame');

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
window.addEventListener('scroll', setActiveLink, { passive: true });
window.addEventListener('resize', setActiveLink);

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

// On mobile (touch) devices, "Let's talk" dials the phone directly
const navCta = document.querySelector('.nav-cta');
if (navCta && window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
    navCta.href = 'tel:+15148874747';
}

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