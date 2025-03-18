const walletContent = {
    html: `
        <div class="wallet-widget">
            <div class="wallet-container">
                <div class="wallet-status">
                    <span class="status-dot"></span>
                    <span class="wallet-address">Not connected</span>
                </div>
                <button id="walletConnectBtn" class="wallet-connect">Connect Wallet</button>
            </div>
        </div>
    `,
    css: `
        .wallet-widget {
            width: 100%;
            background: var(--background);
            border-bottom: 1px solid var(--border);
            padding: var(--spacing-sm) 0;
        }

        .wallet-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 var(--spacing-md);
            display: flex;
            align-items: center;
            justify-content: flex-end;
            gap: var(--spacing-md);
        }

        .wallet-status {
            display: flex;
            align-items: center;
            gap: var(--spacing-sm);
            color: var(--text-secondary);
            font-family: var(--font-family-mono);
            font-size: var(--font-size-sm);
        }

        .status-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: var(--error-text);
            transition: background var(--transition-fast);
        }

        .wallet-widget.connected .status-dot {
            background: var(--success);
        }

        .wallet-connect {
            padding: var(--spacing-xs) var(--spacing-md);
            border-radius: var(--border-radius);
            border: 1px solid var(--border);
            background: var(--background);
            color: var(--text);
            cursor: pointer;
            transition: all var(--transition-fast);
            font-size: var(--font-size-sm);
            min-width: 120px;
            text-align: center;
        }

        .wallet-connect:hover:not(:disabled) {
            background: var(--background-secondary);
            transform: translateY(-1px);
        }

        .wallet-connect:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .wallet-connect.connecting {
            background: var(--primary);
            color: var(--primary-text);
            border-color: var(--primary);
        }

        @media (max-width: 640px) {
            .wallet-container {
                padding: 0 var(--spacing-sm);
                flex-wrap: wrap;
                justify-content: center;
            }

            .wallet-status {
                width: 100%;
                justify-content: center;
                margin-bottom: var(--spacing-xs);
            }
        }
    `,
    js: `
        const walletWidget = {
            elements: null,
            state: {
                wallet: null,
                irysUploader: null
            },

            async init() {
                this.elements = {
                    container: document.querySelector('.wallet-widget'),
                    status: document.querySelector('.wallet-address'),
                    connectBtn: document.getElementById('walletConnectBtn')
                };

                if (!this.elements.container) return;

                this.initEventListeners();
                await this.checkExistingConnection();
            },

            initEventListeners() {
                this.elements.connectBtn.addEventListener('click', async () => {
                    if (this.state.wallet) {
                        this.disconnect();
                    } else {
                        await this.connect();
                    }
                });
            },

            async checkExistingConnection() {
                if (window.solana?.isConnected) {
                    this.state.wallet = window.solana;
                    await this.connectAndInitialize();
                }
            },

            async connect() {
                try {
                    if (!window.solana) {
                        throw new Error('Please install Solana wallet (Phantom or OKX)');
                    }

                    this.elements.connectBtn.disabled = true;
                    this.elements.connectBtn.classList.add('connecting');
                    this.elements.connectBtn.textContent = 'Connecting...';

                    await window.solana.connect();
                    this.state.wallet = window.solana;
                    
                    await this.connectAndInitialize();

                    window.solana.on('disconnect', () => this.handleDisconnect());
                    window.solana.on('accountChanged', () => this.handleAccountChanged());

                } catch (error) {
                    console.error('Wallet connection failed:', error);
                    this.showError(error.message);
                    this.elements.connectBtn.disabled = false;
                    this.elements.connectBtn.classList.remove('connecting');
                    this.elements.connectBtn.textContent = 'Connect Wallet';
                }
            },

            async connectAndInitialize() {
                try {
                    this.elements.connectBtn.textContent = 'Initializing...';
                    await this.initializeIrys();
                    this.updateUI(true);
                } catch (error) {
                    console.error('Failed to initialize:', error);
                    this.showError('Failed to initialize Irys');
                    this.disconnect();
                }
            },

            disconnect() {
                try {
                    this.state.wallet?.disconnect();
                    this.handleDisconnect();
                } catch (error) {
                    console.error('Wallet disconnection failed:', error);
                    this.showError(error.message);
                }
            },

            async initializeIrys() {
                try {
                    if (!this.state.wallet) return;

                    const originalSignMessage = this.state.wallet.signMessage;
                    this.state.wallet.signMessage = async (msg) => {
                        const signedMessage = await originalSignMessage.call(this.state.wallet, msg);
                        return signedMessage.signature || signedMessage;
                    };

                    this.state.irysUploader = await window.WebIrys.WebUploader(window.WebIrys.WebSolana)
                        .withProvider(this.state.wallet);
                    window.irysUploader = this.state.irysUploader;

                } catch (error) {
                    console.error('Irys initialization failed:', error);
                    throw error;
                }
            },

            handleDisconnect() {
                this.state.wallet = null;
                this.state.irysUploader = null;
                window.irysUploader = null;
                this.updateUI(false);
                this.elements.connectBtn.disabled = false;
                this.elements.connectBtn.classList.remove('connecting');
            },

            async handleAccountChanged() {
                await this.connectAndInitialize();
            },

            updateUI(isConnected) {
                if (!this.elements.container) return;

                if (isConnected && this.state.wallet) {
                    const address = this.state.wallet.publicKey.toString();
                    this.elements.status.textContent = \`\${address.slice(0,4)}...\${address.slice(-4)}\`;
                    this.elements.connectBtn.textContent = 'Disconnect';
                    this.elements.connectBtn.classList.remove('connecting');
                    this.elements.connectBtn.disabled = false;
                    this.elements.container.classList.add('connected');
                } else {
                    this.elements.status.textContent = 'Not connected';
                    this.elements.connectBtn.textContent = 'Connect Wallet';
                    this.elements.container.classList.remove('connected');
                }

                window.dispatchEvent(new CustomEvent('walletStateChange', {
                    detail: {
                        isConnected,
                        wallet: this.state.wallet,
                        irysUploader: this.state.irysUploader
                    }
                }));
            },

            showError(message) {
                const error = document.createElement('div');
                error.className = 'wallet-error';
                error.textContent = message;
                error.style.cssText = \`
                    position: absolute;
                    top: 100%;
                    right: var(--spacing-md);
                    margin-top: var(--spacing-xs);
                    padding: var(--spacing-xs) var(--spacing-sm);
                    background: var(--error-bg);
                    color: var(--error-text);
                    border-radius: var(--border-radius);
                    font-size: var(--font-size-xs);
                    z-index: 1000;
                    white-space: nowrap;
                \`;
                
                this.elements.container.appendChild(error);
                setTimeout(() => error.remove(), 3000);
            }
        };

        // Load Irys bundle
        function loadIrysBundle() {
            return new Promise((resolve, reject) => {
                if (window.WebIrys) {
                    resolve();
                    return;
                }

                const script = document.createElement('script');
                script.src = 'https://uploader.irys.xyz/Cip4wmuMv1K3bmcL4vYoZuV2aQQnnzViqwHm6PCei3QX/bundle.js';
                script.onload = () => resolve();
                script.onerror = () => reject(new Error('Failed to load Irys bundle'));
                document.head.appendChild(script);
            });
        }

        // Initialize
        loadIrysBundle().then(() => {
            walletWidget.init();
        }).catch(error => {
            console.error('Failed to load Irys bundle:', error);
        });
    `
};

module.exports = { walletContent }; 