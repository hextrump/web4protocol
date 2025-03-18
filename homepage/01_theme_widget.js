const themeContent = {
    html: `
        <button class="theme-toggle" aria-label="Toggle theme">
            <span class="theme-icon light">☀️</span>
            <span class="theme-icon dark">🌙</span>
        </button>
    `,
    css: `
        /* Theme toggle styles */
        .theme-toggle {
            position: fixed;
            top: var(--spacing-md);
            left: var(--spacing-md);
            padding: var(--spacing-sm);
            border-radius: var(--border-radius-full);
            border: 1px solid var(--border);
            background: var(--background);
            cursor: pointer;
            transition: all var(--transition-fast);
            z-index: var(--z-fixed);
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .theme-toggle:hover {
            background: var(--background-secondary);
            transform: rotate(15deg);
        }

        .theme-icon {
            font-size: var(--font-size-xl);
            line-height: 1;
        }

        [data-theme="dark"] .theme-icon.light { display: inline-block; }
        [data-theme="dark"] .theme-icon.dark { display: none; }
        [data-theme="light"] .theme-icon.light { display: none; }
        [data-theme="light"] .theme-icon.dark { display: inline-block; }

        @media (max-width: 640px) {
            .theme-toggle {
                position: relative;
                top: 0;
                left: 0;
                margin: var(--spacing-md) 0;
            }
        }

        /* Global CSS Variables */
        :root {
            /* Colors */
            --primary: #3182ce;
            --primary-dark: #2c5282;
            --primary-light: #4299e1;
            
            --background: #ffffff;
            --background-secondary: #f7fafc;
            --background-tertiary: #edf2f7;
            
            --text: #1a202c;
            --text-secondary: #4a5568;
            --text-tertiary: #718096;
            
            --success: #48bb78;
            --warning: #ecc94b;
            --error: #f56565;
            --info: #4299e1;

            --error-bg: #fff5f5;
            --error-text: #c53030;
            --info-bg: #ebf8ff;
            --info-text: #2b6cb0;
            
            --border: #e2e8f0;
            --shadow: rgba(0, 0, 0, 0.1);

            /* Typography */
            --font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            --font-family-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
            --font-size-xs: 0.75rem;
            --font-size-sm: 0.875rem;
            --font-size-base: 1rem;
            --font-size-lg: 1.125rem;
            --font-size-xl: 1.25rem;
            --font-size-2xl: 1.5rem;
            
            /* Spacing */
            --spacing-unit: 8px;
            --spacing-xs: calc(var(--spacing-unit) * 0.5);
            --spacing-sm: var(--spacing-unit);
            --spacing-md: calc(var(--spacing-unit) * 2);
            --spacing-lg: calc(var(--spacing-unit) * 3);
            --spacing-xl: calc(var(--spacing-unit) * 4);
            
            /* Border radius */
            --border-radius: 6px;
            --border-radius-sm: 4px;
            --border-radius-lg: 8px;
            --border-radius-full: 9999px;
            
            /* Transitions */
            --transition-fast: 150ms;
            --transition-normal: 250ms;
            --transition-slow: 350ms;
            
            /* Z-index */
            --z-negative: -1;
            --z-normal: 1;
            --z-tooltip: 10;
            --z-fixed: 100;
            --z-modal: 1000;
            
            /* Breakpoints */
            --mobile: 640px;
            --tablet: 768px;
            --laptop: 1024px;
            --desktop: 1280px;
        }

        /* Dark theme */
        [data-theme="dark"] {
            --primary: #63b3ed;
            --primary-dark: #4299e1;
            --primary-light: #90cdf4;
            
            --background: #1a202c;
            --background-secondary: #2d3748;
            --background-tertiary: #4a5568;
            
            --text: #f7fafc;
            --text-secondary: #e2e8f0;
            --text-tertiary: #cbd5e0;
            
            --success: #68d391;
            --warning: #f6e05e;
            --error: #fc8181;
            --info: #63b3ed;

            --error-bg: #742a2a;
            --error-text: #fc8181;
            --info-bg: #2a4365;
            --info-text: #63b3ed;
            
            --border: #4a5568;
            --shadow: rgba(0, 0, 0, 0.25);
        }

        /* Base styles */
        body {
            font-family: var(--font-family);
            font-size: var(--font-size-base);
            line-height: 1.5;
            color: var(--text);
            background: var(--background);
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            transition: color var(--transition-normal), background-color var(--transition-normal);
        }
    `,
    js: `
        const themeWidget = {
            init() {
                this.toggle = document.querySelector('.theme-toggle');
                if (!this.toggle) return;

                this.initTheme();
                this.initEventListeners();
                window.themeWidget = this;
            },

            initTheme() {
                const savedTheme = localStorage.getItem('theme');
                const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                this.setTheme(savedTheme || systemTheme);

                // System theme change listener
                window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
                    if (!localStorage.getItem('theme')) {
                        this.setTheme(e.matches ? 'dark' : 'light');
                    }
                });
            },

            initEventListeners() {
                this.toggle.addEventListener('click', () => this.toggleTheme());
            },

            setTheme(theme) {
                document.documentElement.setAttribute('data-theme', theme);
                localStorage.setItem('theme', theme);
                window.dispatchEvent(new CustomEvent('themeChange', { detail: { theme } }));
            },

            toggleTheme() {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                this.setTheme(currentTheme === 'dark' ? 'light' : 'dark');
            }
        };

        themeWidget.init();
    `
};

module.exports = { themeContent }; 