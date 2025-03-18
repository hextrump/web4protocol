const threadWidget = {
    html: `
        <div class="thread-widget">
            <div class="posts-container" id="postsContainer">
                <div class="loading">Loading posts...</div>
            </div>
        </div>
    `,
    css: `
        .thread-widget {
            width: 100%;
            max-width: 600px;
            margin: var(--spacing-md) auto;
            font-family: var(--font-family);
        }

        .posts-container {
            display: flex;
            flex-direction: column;
            gap: var(--spacing-md);
        }

        .post-card {
            background: var(--background);
            border: 1px solid var(--border);
            border-radius: var(--border-radius-lg);
            padding: var(--spacing-md);
        }

        .post-card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: var(--spacing-sm);
        }

        .post-author {
            font-size: var(--font-size-sm);
            color: var(--text);
            font-family: var(--font-family-mono);
        }

        .post-time {
            font-size: var(--font-size-xs);
            color: var(--text-secondary);
        }

        .post-content {
            font-size: var(--font-size-base);
            line-height: 1.6;
            color: var(--text);
            white-space: pre-wrap;
            word-break: break-word;
        }

        .loading {
            text-align: center;
            color: var(--text-secondary);
            padding: var(--spacing-md);
            font-size: var(--font-size-sm);
        }
    `,
    js: `
        const threadWidget = {
            elements: null,

            init() {
                this.elements = {
                    container: document.getElementById('postsContainer')
                };

                if (!this.elements.container) return;
                this.loadPosts();
            },

            async loadPosts() {
                try {
                    this.elements.container.innerHTML = '<div class="loading">Loading posts...</div>';

                    const query = \`
                        query {
                            transactions(
                                tags: [
                                    { name: "App-Name", values: ["web4"] },
                                    { name: "Type", values: ["post"] },
                                    { name: "Content-Type", values: ["application/json"] }
                                ],
                                order: DESC
                            ) {
                                edges {
                                    node {
                                        id
                                        address
                                        timestamp
                                    }
                                }
                            }
                        }
                    \`;

                    const response = await fetch('https://uploader.irys.xyz/graphql', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ query })
                    });

                    const result = await response.json();
                    
                    if (result.errors) {
                        throw new Error(result.errors[0].message);
                    }

                    const posts = result.data.transactions.edges;
                    this.renderPosts(posts);

                } catch (error) {
                    console.error('Failed to load posts:', error);
                    this.elements.container.innerHTML = '<div class="loading">Failed to load posts. Please try again later.</div>';
                }
            },

            async renderPosts(posts) {
                if (!posts.length) {
                    this.elements.container.innerHTML = '<div class="loading">No posts found</div>';
                    return;
                }

                const postsHtml = await Promise.all(posts.map(async ({ node }) => {
                    const timeAgo = this.getTimeAgo(parseInt(node.timestamp));
                    const content = await this.loadPostContent(node.id);
                    
                    return \`
                        <div class="post-card">
                            <div class="post-card-header">
                                <span class="post-author">\${this.formatAddress(node.address)}</span>
                                <span class="post-time">\${timeAgo}</span>
                            </div>
                            <div class="post-content">\${content}</div>
                        </div>
                    \`;
                }));

                this.elements.container.innerHTML = postsHtml.join('');
            },

            async loadPostContent(id) {
                try {
                    const response = await fetch(\`https://gateway.irys.xyz/\${id}\`);
                    const post = await response.json();
                    return this.sanitizeText(post.content);
                } catch (error) {
                    console.error(\`Failed to load content for post \${id}:\`, error);
                    return 'Failed to load content';
                }
            },

            getTimeAgo(timestamp) {
                const seconds = Math.floor((Date.now() - timestamp) / 1000);
                const intervals = [
                    { seconds: 31536000, label: 'year' },
                    { seconds: 2592000, label: 'month' },
                    { seconds: 86400, label: 'day' },
                    { seconds: 3600, label: 'hour' },
                    { seconds: 60, label: 'minute' },
                    { seconds: 1, label: 'second' }
                ];

                for (const { seconds: interval, label } of intervals) {
                    const count = Math.floor(seconds / interval);
                    if (count > 0) {
                        return \`\${count} \${label}\${count === 1 ? '' : 's'} ago\`;
                    }
                }
                return 'just now';
            },

            formatAddress(address) {
                return \`\${address.slice(0, 4)}...\${address.slice(-4)}\`;
            },

            sanitizeText(text) {
                if (!text) return '';
                const div = document.createElement('div');
                div.textContent = text;
                return div.innerHTML;
            }
        };

        threadWidget.init();
    `
};

module.exports = { threadWidget }; 