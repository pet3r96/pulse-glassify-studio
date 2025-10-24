interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  sidebar: string;
  text: string;
}

interface ThemeFonts {
  heading: string;
  body: string;
}

interface Theme {
  colors: ThemeColors;
  fonts: ThemeFonts;
  customCSS?: string;
  customJS?: string;
}

export function generateThemeCSS(theme: Theme): string {
  return `/* GoHighLevel Theme - Auto-generated */
:root {
  --ghl-primary-color: ${theme.colors.primary};
  --ghl-secondary-color: ${theme.colors.secondary};
  --ghl-accent-color: ${theme.colors.accent};
  --ghl-background-color: ${theme.colors.background};
  --ghl-sidebar-color: ${theme.colors.sidebar};
  --ghl-text-color: ${theme.colors.text};
  --ghl-heading-font: ${theme.fonts.heading};
  --ghl-body-font: ${theme.fonts.body};
}

/* Login Page Styling */
.hl_login,
.login-page,
[class*="login-container"] {
  background: var(--ghl-background-color) !important;
  color: var(--ghl-text-color) !important;
}

.hl_login--body,
.login-form,
[class*="login-card"] {
  background: var(--ghl-sidebar-color) !important;
  color: var(--ghl-text-color) !important;
}

/* Dashboard & Sidebar */
.sidebar,
.hl_nav-sidebar,
[class*="sidebar"],
.main-sidebar {
  background: var(--ghl-sidebar-color) !important;
  color: var(--ghl-text-color) !important;
}

.main-content,
.dashboard-content,
[class*="main-content"] {
  background: var(--ghl-background-color) !important;
}

/* Buttons - Primary */
.btn-primary,
button.primary,
[class*="btn-primary"],
.primary-button,
.hl_button--primary {
  background: var(--ghl-primary-color) !important;
  color: var(--ghl-text-color) !important;
  border-color: var(--ghl-primary-color) !important;
}

.btn-primary:hover,
button.primary:hover {
  opacity: 0.9 !important;
}

/* Buttons - Secondary */
.btn-secondary,
button.secondary,
[class*="btn-secondary"] {
  background: var(--ghl-secondary-color) !important;
  color: var(--ghl-text-color) !important;
  border-color: var(--ghl-secondary-color) !important;
}

/* Cards & Panels */
.card,
.panel,
[class*="card"],
[class*="panel"] {
  background: var(--ghl-sidebar-color) !important;
  color: var(--ghl-text-color) !important;
  border-color: var(--ghl-accent-color) !important;
}

/* Navigation & Menus */
.nav-item,
.menu-item,
[class*="nav-item"],
[class*="menu-item"] {
  color: var(--ghl-text-color) !important;
}

.nav-item.active,
.menu-item.active,
.nav-item:hover,
.menu-item:hover {
  background: var(--ghl-accent-color) !important;
  color: var(--ghl-text-color) !important;
}

/* Tables */
.table,
table,
[class*="table"] {
  background: var(--ghl-sidebar-color) !important;
  color: var(--ghl-text-color) !important;
}

.table thead,
table thead {
  background: var(--ghl-background-color) !important;
  color: var(--ghl-text-color) !important;
}

.table tbody tr:hover,
table tbody tr:hover {
  background: var(--ghl-background-color) !important;
}

/* Forms & Inputs */
input,
textarea,
select,
.form-control,
[class*="input"],
[class*="form-control"] {
  background: var(--ghl-background-color) !important;
  color: var(--ghl-text-color) !important;
  border-color: var(--ghl-accent-color) !important;
}

input:focus,
textarea:focus,
select:focus {
  border-color: var(--ghl-primary-color) !important;
  box-shadow: 0 0 0 2px rgba(var(--ghl-primary-color), 0.2) !important;
}

/* Typography */
h1, h2, h3, h4, h5, h6,
.heading,
[class*="heading"] {
  font-family: var(--ghl-heading-font) !important;
  color: var(--ghl-text-color) !important;
}

body,
p,
span,
div,
.body-text {
  font-family: var(--ghl-body-font) !important;
  color: var(--ghl-text-color) !important;
}

/* Tags & Badges */
.badge,
.tag,
[class*="badge"],
[class*="tag"] {
  background: var(--ghl-accent-color) !important;
  color: var(--ghl-text-color) !important;
}

/* Modals & Dialogs */
.modal,
.dialog,
[class*="modal"],
[class*="dialog"] {
  background: var(--ghl-sidebar-color) !important;
  color: var(--ghl-text-color) !important;
}

.modal-header,
.dialog-header {
  background: var(--ghl-background-color) !important;
  border-bottom-color: var(--ghl-accent-color) !important;
}

/* Dropdowns */
.dropdown-menu,
[class*="dropdown"] {
  background: var(--ghl-sidebar-color) !important;
  color: var(--ghl-text-color) !important;
  border-color: var(--ghl-accent-color) !important;
}

.dropdown-item:hover {
  background: var(--ghl-accent-color) !important;
}

/* Custom CSS from user */
${theme.customCSS || ''}
`;
}

export function generateThemeJS(theme: Theme): string {
  return `/* GoHighLevel Theme JavaScript - Auto-generated */
(function() {
  'use strict';
  
  console.log('🎨 PulseGen Theme Loading...');
  
  // Apply theme variables
  const applyTheme = () => {
    const root = document.documentElement;
    root.style.setProperty('--ghl-primary-color', '${theme.colors.primary}');
    root.style.setProperty('--ghl-secondary-color', '${theme.colors.secondary}');
    root.style.setProperty('--ghl-accent-color', '${theme.colors.accent}');
    root.style.setProperty('--ghl-background-color', '${theme.colors.background}');
    root.style.setProperty('--ghl-sidebar-color', '${theme.colors.sidebar}');
    root.style.setProperty('--ghl-text-color', '${theme.colors.text}');
    root.style.setProperty('--ghl-heading-font', '${theme.fonts.heading}');
    root.style.setProperty('--ghl-body-font', '${theme.fonts.body}');
  };
  
  // Apply theme immediately
  applyTheme();
  
  // Monitor for dynamically loaded content
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length) {
        applyTheme();
      }
    });
  });
  
  // Start observing
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  console.log('✅ PulseGen Theme Applied Successfully');
  
  // Custom JavaScript from user
  ${theme.customJS || ''}
})();
`;
}

export function generateDeploymentCode(theme: Theme): string {
  const css = generateThemeCSS(theme);
  const js = generateThemeJS(theme);
  
  return `<!-- PulseGen Theme - Paste this in GHL Settings → Business Profile → Custom Code → Footer Tracking Code -->
<style>
${css}
</style>

<script>
${js}
</script>`;
}
