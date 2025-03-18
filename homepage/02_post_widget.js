const postWidget = {
    html: `
        <div class="post-widget">
            <div class="post-input-area">
                <div class="input-wrapper">
                    <textarea id="postInput" placeholder="What's on your mind? Share your thoughts..." disabled></textarea>
                    <div class="post-actions">
                        <span class="char-count" id="charCount">0/280</span>
                        <button id="postSubmitBtn" class="post-button" disabled>
                            <span class="button-text">Post</span>
                            <span class="button-icon">↗</span>
                        </button>
                    </div>
                </div>
            </div>
            <div id="postStatus" class="post-status"></div>
        </div>
    `,
    css: `
        .post-widget {
            width: 100%;
            max-width: 600px;
            margin: var(--spacing-md) auto;
            font-family: var(--font-family);
        }

        .post-input-area {
            margin-bottom: var(--spacing-xl);
        }

        .input-wrapper {
            background: var(--background);
            border: 1px solid var(--border);
            border-radius: var(--border-radius-lg);
            overflow: hidden;
            box-shadow: 0 2px 4px var(--shadow);
            transition: all var(--transition-fast);
        }

        .input-wrapper:focus-within {
            border-color: var(--primary);
            box-shadow: 0 4px 12px var(--shadow);
        }

        #postInput {
            width: 100%;
            min-height: 120px;
            padding: var(--spacing-md);
            border: none;
            background: transparent;
            font-size: var(--font-size-base);
            line-height: 1.5;
            color: var(--text);
            resize: none;
        }

        #postInput:focus {
            outline: none;
        }

        #postInput::placeholder {
            color: var(--text-secondary);
        }

        .post-actions {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: var(--spacing-sm) var(--spacing-md);
            border-top: 1px solid var(--border);
        }

        .char-count {
            font-size: var(--font-size-sm);
            color: var(--text-secondary);
        }

        .post-button {
            display: flex;
            align-items: center;
            gap: var(--spacing-sm);
            padding: var(--spacing-xs) var(--spacing-md);
            background: var(--primary);
            color: var(--background);
            border: none;
            border-radius: var(--border-radius-full);
            font-size: var(--font-size-sm);
            font-weight: 500;
            cursor: pointer;
            transition: all var(--transition-fast);
        }

        .post-button:hover {
            background: var(--primary-dark);
            transform: translateY(-1px);
        }

        .post-button:disabled {
            background: var(--text-tertiary);
            cursor: not-allowed;
            transform: none;
            opacity: 0.7;
        }

        .button-icon {
            font-size: var(--font-size-base);
        }

        .post-status {
            text-align: center;
            padding: var(--spacing-sm);
            margin: var(--spacing-md) 0;
            border-radius: var(--border-radius);
            font-size: var(--font-size-sm);
            transition: all var(--transition-normal);
            display: none;
        }

        .post-status.show {
            display: block;
            animation: fadeIn var(--transition-normal);
        }

        .post-status.success {
            background: var(--success);
            color: var(--background);
        }

        .post-status.error {
            background: var(--error);
            color: var(--background);
        }

        @media (max-width: 640px) {
            .post-widget {
                margin: var(--spacing-sm) auto;
            }

            #postInput {
                min-height: 100px;
                font-size: var(--font-size-sm);
            }

            .post-actions {
                padding: var(--spacing-xs) var(--spacing-sm);
            }
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `,
    js: `
        const postWidget = {
            elements: null,
            state: {
                isWalletConnected: false,
                irysUploader: null
            },

            init() {
                this.elements = {
                    input: document.getElementById('postInput'),
                    submitBtn: document.getElementById('postSubmitBtn'),
                    charCount: document.getElementById('charCount'),
                    status: document.getElementById('postStatus')
                };

                if (!this.elements.input) return;

                this.initEventListeners();
                window.addEventListener('walletStateChange', this.handleWalletStateChange.bind(this));
            },

            initEventListeners() {
                this.elements.input.addEventListener('input', () => this.handleInput());
                this.elements.submitBtn.addEventListener('click', () => this.handleSubmit());
            },

            handleWalletStateChange(event) {
                const { isConnected, irysUploader } = event.detail;
                this.state.isWalletConnected = isConnected;
                this.state.irysUploader = irysUploader;
                
                this.elements.input.disabled = !isConnected;
                this.elements.submitBtn.disabled = !isConnected || !this.elements.input.value.trim();
            },

            handleInput() {
                const count = this.elements.input.value.length;
                this.elements.charCount.textContent = \`\${count}/280\`;
                this.elements.submitBtn.disabled = count === 0 || count > 280 || !this.state.isWalletConnected;
            },

            async handleSubmit() {
                const content = this.elements.input.value.trim();
                
                if (!content) {
                    this.showStatus('Please enter some content', 'error');
                    return;
                }

                if (content.length > 280) {
                    this.showStatus('Content exceeds 280 characters', 'error');
                    return;
                }

                if (!this.state.isWalletConnected || !this.state.irysUploader) {
                    this.showStatus('Please connect your wallet first', 'error');
                    return;
                }

                try {
                    this.elements.submitBtn.disabled = true;
                    this.showStatus('Posting...', '');

                    const post = {
                        content,
                        timestamp: Date.now()
                    };

                    const postTags = [
                        { name: "App-Name", value: "web4" },
                        { name: "Type", value: "post" },
                        { name: "Content-Type", value: "application/json" },
                        { name: "Unix-Time", value: post.timestamp.toString() }
                    ];

                    await this.state.irysUploader.upload(JSON.stringify(post), { tags: postTags });
                    
                    this.elements.input.value = '';
                    this.elements.charCount.textContent = '0/280';
                    this.showStatus('Posted successfully!', 'success');
                    
                    setTimeout(() => this.hideStatus(), 3000);

                } catch (error) {
                    console.error('Post failed:', error);
                    this.showStatus(error.message || 'Failed to create post', 'error');
                } finally {
                    this.elements.submitBtn.disabled = !this.state.isWalletConnected;
                }
            },

            showStatus(message, type = '') {
                this.elements.status.textContent = message;
                this.elements.status.className = 'post-status show ' + type;
            },

            hideStatus() {
                this.elements.status.className = 'post-status';
            }
        };

        postWidget.init();
    `
};

module.exports = { postWidget }; 