export const CONFIG = {
  WARD_INFO_URL: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSv7a_sC6S7ytGdHJSEZMHqCPsKhOY-C7hp6K1d-rpUsAUj8LV3Ss3lE89p-IAfEdtFcpOhrOng3LWw/pub?gid=981144620&single=true&output=csv',
  PROGRAM_URL: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSv7a_sC6S7ytGdHJSEZMHqCPsKhOY-C7hp6K1d-rpUsAUj8LV3Ss3lE89p-IAfEdtFcpOhrOng3LWw/pub?gid=349175455&single=true&output=csv',
  EVENTS_URL: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSv7a_sC6S7ytGdHJSEZMHqCPsKhOY-C7hp6K1d-rpUsAUj8LV3Ss3lE89p-IAfEdtFcpOhrOng3LWw/pub?gid=321660920&single=true&output=csv',
  CORS_PROXY: 'https://api.allorigins.win/raw?url='
};

export const STORAGE_KEYS = {
  THEME: 'theme',
  BANNER_SEEN: 'aspen-ward-banner-seen'
};

export const SELECTORS = {
  brandTitle: () => document.getElementById('brand-title'),
  brandSubtitle: () => document.getElementById('brand-subtitle'),
  heroTitle: () => document.getElementById('hero-heading'),
  heroSubtitle: () => document.getElementById('hero-subtitle'),
  heroMeta: () => document.getElementById('hero-meta'),
  programIntro: () => document.getElementById('program-intro'),
  programGrid: () => document.getElementById('program-grid'),
  announcementsSection: () => document.getElementById('announcements'),
  announcementsList: () => document.getElementById('announcements-list'),
  eventsTimeline: () => document.getElementById('events-timeline'),
  eventsSection: () => document.getElementById('events'),
  footerCopy: () => document.getElementById('footer-copy'),
  navLinks: () => Array.from(document.querySelectorAll('.nav-link[data-scroll]')),
  modal: () => document.getElementById('banner-modal'),
  modalTitle: () => document.getElementById('banner-title'),
  modalBody: () => document.getElementById('banner-body'),
  modalDismiss: () => document.getElementById('modal-dismiss'),
  modalClose: () => document.getElementById('modal-close'),
  themeToggle: () => document.getElementById('theme-toggle'),
  menuToggle: () => document.getElementById('menu-toggle'),
  nav: () => document.getElementById('primary-nav'),
  eventsNavLink: () => document.querySelector('[data-scroll="events"]'),
  announcementsNavLink: () => document.querySelector('[data-scroll="announcements"]'),
  newsFlash: () => document.getElementById('news-flash'),
  newsFlashContent: () => document.getElementById('news-flash-content'),
  newsFlashClose: () => document.getElementById('news-flash-close'),
  loadingScreen: () => document.getElementById('loading-screen'),
  errorNotification: () => document.getElementById('error-notification'),
  errorMessage: () => document.getElementById('error-message'),
  errorClose: () => document.getElementById('error-close')
};
