const layoutContent = {
    html: `
        <div class="layout">
            <div id="wallet-container"></div>
            <div id="theme-container"></div>
            <div class="layout-container">
                <div id="title-container"></div>
                <div id="content-container">
                    <div id="post-container"></div>
                    <div id="thread-container"></div>
                    <div id="build-container"></div>
                </div>
            </div>
        </div>
    `,
    css: `
        .layout {
            min-height: 100vh;
            background: var(--background);
        }

        .layout-container {
            width: 100%;
            max-width: 1200px;
            margin: 0 auto;
            padding: var(--spacing-xl) var(--spacing-md);
        }

        #content-container {
            width: 100%;
            display: grid;
            gap: var(--spacing-xl);
        }

        /* Basic loading and error states */
        .error-message {
            padding: var(--spacing-md);
            border-radius: var(--border-radius);
            background: var(--error-bg);
            color: var(--error-text);
            margin: var(--spacing-md) 0;
        }

        .loading-message {
            padding: var(--spacing-md);
            border-radius: var(--border-radius);
            background: var(--info-bg);
            color: var(--info-text);
            margin: var(--spacing-md) 0;
        }

        /* Responsive layout */
        @media (max-width: 640px) {
            .layout-container {
                padding: var(--spacing-md) var(--spacing-sm);
            }

            #content-container {
                gap: var(--spacing-lg);
            }
        }
    `,
    js: `
        // Global Constants
        const APP_VERSION = "1.0.0";
        const IRYS_GRAPHQL_ENDPOINT = "https://uploader.irys.xyz/graphql";
        const IRYS_GATEWAY = "https://gateway.irys.xyz";
        const TITLE_WIDGET_ID = "GN4BsRnFy14SsGTWSjmLx56o7qubgw9zAAYTF1mnC5h8";

        // Main widget loading function
        async function loadWidget(containerId, widgetType) {
            try {
                console.log('Loading widget:', widgetType);
                const container = document.getElementById(containerId);
                if (!container) {
                    throw new Error('Container not found: ' + containerId);
                }

                container.innerHTML = '<div class="loading-message">Loading...</div>';

                let widgetId;
                
                // Special handling for title_widget
                if (widgetType === 'title_widget') {
                    widgetId = TITLE_WIDGET_ID;
                } else {
                    // Query other widgets using GraphQL
                    const query = \`query {
                        transactions(
                            tags: [
                                { name: "Content-Type", values: ["application/json"] },
                                { name: "App-Name", values: ["web4"] },
                                { name: "Type", values: ["\${widgetType}"] },
                                { name: "Version", values: ["\${APP_VERSION}"] }
                            ],
                            first: 1,
                            order: DESC
                        ) {
                            edges {
                                node {
                                    id
                                }
                            }
                        }
                    }\`;

                    const response = await fetch(IRYS_GRAPHQL_ENDPOINT, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ query })
                    });

                    if (!response.ok) {
                        throw new Error(\`HTTP error! status: \${response.status}\`);
                    }

                    const result = await response.json();
                    if (!result.data?.transactions?.edges?.length) {
                        throw new Error(\`No widget found for type: \${widgetType}\`);
                    }
                    
                    widgetId = result.data.transactions.edges[0].node.id;
                }

                // Fetch and apply widget content
                const widgetResponse = await fetch(\`\${IRYS_GATEWAY}/\${widgetId}\`);
                if (!widgetResponse.ok) {
                    throw new Error(\`Failed to fetch widget content: \${widgetResponse.status}\`);
                }

                const widget = await widgetResponse.json();
                
                // Apply HTML content
                if (widget.html) {
                    container.innerHTML = widget.html;
                }

                // Apply CSS styles
                if (widget.css) {
                    const styleId = \`style-\${widgetType}\`;
                    let styleElement = document.getElementById(styleId);
                    if (!styleElement) {
                        styleElement = document.createElement('style');
                        styleElement.id = styleId;
                        document.head.appendChild(styleElement);
                    }
                    styleElement.textContent = widget.css;
                }

                // Apply JavaScript with scope isolation
                if (widget.js) {
                    const scriptId = \`script-\${widgetType}\`;
                    let scriptElement = document.getElementById(scriptId);
                    
                    // Remove existing script if present
                    if (scriptElement) {
                        scriptElement.remove();
                    }

                    // Create new script element with unique ID
                    scriptElement = document.createElement('script');
                    scriptElement.id = scriptId;
                    
                    // Generate unique variable name for widget isolation
                    const safeWidgetName = widgetType.replace(/[^a-zA-Z0-9]/g, '_');
                    const uniqueVarName = \`_\${safeWidgetName}_\${Date.now()}\`;
                    
                    // Wrap widget code in IIFE for scope isolation
                    scriptElement.textContent = \`
                        (function() {
                            if (window.\${uniqueVarName}) return;
                            window.\${uniqueVarName} = true;
                            \${widget.js}
                        })();
                    \`;
                    
                    document.body.appendChild(scriptElement);
                }

                console.log(\`Successfully loaded \${widgetType}\`);
            } catch (error) {
                console.error(\`Error loading \${widgetType}:\`, error);
                const container = document.getElementById(containerId);
                if (container) {
                    container.innerHTML = \`
                        <div class="error-message">
                            \${error.message}
                            <button onclick="loadWidget('\${containerId}', '\${widgetType}')">
                                Retry
                            </button>
                        </div>
                    \`;
                }
            }
        }

        // Layout initialization function
        async function initializeLayout() {
            // Define widget loading order
            const components = [
                { id: 'theme-container', type: 'theme_widget' },  // Theme must be loaded first
                { id: 'wallet-container', type: 'wallet_widget' },
                { id: 'title-container', type: 'title_widget' },
                { id: 'post-container', type: 'post_widget' },
                { id: 'thread-container', type: 'thread_widget' },
                { id: 'build-container', type: 'build_widget' }
            ];

            // Load widgets sequentially
            for (const component of components) {
                await loadWidget(component.id, component.type);
            }
        }

        // Initialize when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeLayout);
        } else {
            initializeLayout();
        }
    `
};

module.exports = { layoutContent }; 