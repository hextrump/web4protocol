// Build widget implementation
const buildContent = {
    html: `
        <div class="build-widget">
            <button class="build-button" id="buildButton">
                <span class="build-icon">🔄</span>
                <span class="build-tooltip">Fork This Site</span>
            </button>
            <div class="build-modal" id="buildModal">
                <div class="build-modal-content">
                    <h3>Fork This Site</h3>
                    
                    <!-- Step 1: User Info Form -->
                    <div class="build-form" id="buildForm">
                        <div class="form-group">
                            <label>Your Name</label>
                            <input type="text" id="userName" placeholder="Enter your name">
                        </div>
                        <div class="form-group">
                            <label>Your Introduction</label>
                            <textarea id="userIntro" placeholder="Write a brief introduction about yourself"></textarea>
                        </div>
                        <div class="form-group">
                            <label>Your Avatar</label>
                            <div class="avatar-upload">
                                <div class="avatar-preview" id="avatarPreview" onclick="document.getElementById('userAvatar').click()"></div>
                                <input type="file" id="userAvatar" accept="image/*">
                                <span class="avatar-hint">Click to upload</span>
                            </div>
                        </div>
                        <button class="submit-button" id="submitUserInfo">Create Your Site</button>
                    </div>

                    <!-- Build Progress -->
                    <div class="build-status" id="buildStatus" style="display: none;">
                        <div class="build-progress">
                            <div class="build-step">Uploading avatar...</div>
                            <div class="build-step">Creating your profile...</div>
                            <div class="build-step">Copying layout...</div>
                            <div class="build-step">Creating your site...</div>
                        </div>
                    </div>

                    <!-- Result -->
                    <div class="build-result" id="buildResult" style="display: none;">
                        <p>🎉 Your site is ready!</p>
                        <a href="#" target="_blank" id="siteLink">Visit Your Site</a>
                        <button class="copy-button" id="copyLink">Copy Link</button>
                    </div>
                </div>
            </div>
        </div>
    `,
    css: `
        .build-widget {
            position: fixed;
            bottom: var(--spacing-xl);
            right: var(--spacing-xl);
            z-index: 1000;
        }

        .build-button {
            width: 180px;
            height: 56px;
            border-radius: 28px;
            background: var(--primary);
            border: none;
            color: var(--primary-text);
            font-size: 18px;
            cursor: pointer;
            position: relative;
            transition: all var(--transition-fast);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: var(--spacing-sm);
            padding: 0 var(--spacing-md);
        }

        .build-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
            background: var(--primary-dark, #0056b3);
        }

        .build-icon {
            font-size: 24px;
            display: inline-block;
        }

        .build-tooltip {
            position: static;
            transform: none;
            margin: 0;
            background: transparent;
            padding: 0;
            box-shadow: none;
            opacity: 1;
            pointer-events: auto;
            font-weight: 600;
            font-size: 16px;
            white-space: nowrap;
            color: inherit;
        }

        .build-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 1001;
        }

        .build-modal.active {
            display: flex;
        }

        .build-modal-content {
            background: var(--background);
            padding: var(--spacing-xl);
            border-radius: var(--border-radius);
            max-width: 480px;
            width: 90%;
        }

        .build-modal-content h3 {
            margin: 0 0 var(--spacing-lg);
            color: var(--text);
            font-size: var(--font-size-xl);
            font-weight: 600;
            text-align: center;
            margin-bottom: var(--spacing-xl);
        }

        .build-progress {
            display: flex;
            flex-direction: column;
            gap: var(--spacing-md);
        }

        .build-step {
            padding: var(--spacing-sm);
            border-radius: var(--border-radius);
            background: var(--background-secondary);
            color: var(--text-secondary);
        }

        .build-step.active {
            background: var(--primary);
            color: var(--primary-text);
        }

        .build-step.done {
            background: var(--success);
            color: var(--success-text);
        }

        .build-result {
            text-align: center;
            margin-top: var(--spacing-xl);
        }

        .build-result p {
            margin-bottom: var(--spacing-md);
            color: var(--success);
            font-size: var(--font-size-lg);
        }

        .build-result a {
            display: block;
            margin-bottom: var(--spacing-sm);
            color: var(--primary);
            text-decoration: none;
        }

        .copy-button {
            padding: var(--spacing-xs) var(--spacing-md);
            border-radius: var(--border-radius);
            border: 1px solid var(--border);
            background: var(--background);
            color: var(--text);
            cursor: pointer;
            transition: all var(--transition-fast);
        }

        .copy-button:hover {
            background: var(--background-secondary);
        }

        @media (max-width: 640px) {
            .build-widget {
                bottom: var(--spacing-md);
                right: var(--spacing-md);
            }

            .build-button {
                width: 160px;
                height: 48px;
                font-size: 16px;
            }

            .build-icon {
                font-size: 20px;
            }
        }

        /* Form Styles */
        .build-form {
            display: flex;
            flex-direction: column;
            gap: var(--spacing-lg);
        }

        .form-group {
            display: flex;
            flex-direction: column;
            gap: var(--spacing-sm);
        }

        .form-group label {
            color: var(--text);
            font-size: var(--font-size-sm);
            font-weight: 500;
        }

        .form-group input[type="text"],
        .form-group textarea {
            padding: var(--spacing-sm) var(--spacing-md);
            border: 1px solid var(--border);
            border-radius: var(--border-radius);
            background: var(--background);
            color: var(--text);
            font-size: var(--font-size-base);
            transition: all var(--transition-fast);
        }

        .form-group input[type="text"]:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: var(--primary);
            box-shadow: 0 0 0 2px var(--primary-transparent);
        }

        .form-group textarea {
            min-height: 100px;
            resize: vertical;
        }

        .form-group input[type="file"] {
            display: none;
        }

        /* Avatar upload area */
        .avatar-upload {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: var(--spacing-md);
        }

        .avatar-preview {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            background: var(--background-secondary);
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            border: 2px dashed var(--border);
            cursor: pointer;
            transition: all var(--transition-fast);
        }

        .avatar-preview:hover {
            border-color: var(--primary);
            background: var(--background);
        }

        .avatar-preview img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .avatar-preview:empty::before {
            content: "📷";
            font-size: 32px;
            color: var(--text-secondary);
        }

        /* Submit button */
        .submit-button {
            background: var(--primary);
            color: var(--primary-text);
            border: none;
            border-radius: var(--border-radius);
            padding: var(--spacing-md) var(--spacing-xl);
            font-size: var(--font-size-base);
            font-weight: 600;
            cursor: pointer;
            transition: all var(--transition-fast);
            margin-top: var(--spacing-md);
        }

        .submit-button:hover {
            background: var(--primary-dark, #0056b3);
            transform: translateY(-1px);
        }

        .submit-button:active {
            transform: translateY(0);
        }
    `,
    js: `
        const buildWidget = {
            elements: null,
            state: {
                isBuilding: false,
                avatarFile: null,
                avatarPreview: null
            },

            init() {
                this.elements = {
                    button: document.getElementById('buildButton'),
                    modal: document.getElementById('buildModal'),
                    form: document.getElementById('buildForm'),
                    status: document.getElementById('buildStatus'),
                    result: document.getElementById('buildResult'),
                    userName: document.getElementById('userName'),
                    userIntro: document.getElementById('userIntro'),
                    userAvatar: document.getElementById('userAvatar'),
                    avatarPreview: document.getElementById('avatarPreview'),
                    submitButton: document.getElementById('submitUserInfo'),
                    siteLink: document.getElementById('siteLink'),
                    copyLink: document.getElementById('copyLink')
                };

                if (!this.elements.button) return;
                this.initEventListeners();
            },

            initEventListeners() {
                this.elements.button.addEventListener('click', () => this.showModal());
                this.elements.copyLink.addEventListener('click', () => this.copyToClipboard());
                this.elements.modal.addEventListener('click', (e) => {
                    if (e.target === this.elements.modal) {
                        this.hideModal();
                    }
                });
                
                // Avatar preview
                this.elements.userAvatar.addEventListener('change', (e) => {
                    const file = e.target.files[0];
                    if (file) {
                        this.state.avatarFile = file;
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            this.state.avatarPreview = e.target.result;
                            this.elements.avatarPreview.innerHTML = \`<img src="\${e.target.result}" alt="Preview">\`;
                        };
                        reader.readAsDataURL(file);
                    }
                });

                // Form submission
                this.elements.submitButton.addEventListener('click', () => this.startBuild());
            },

            async startBuild() {
                if (this.state.isBuilding) return;
                if (!window.irysUploader) {
                    this.showError('Please connect your wallet first');
                    return;
                }

                const name = this.elements.userName.value.trim();
                const intro = this.elements.userIntro.value.trim();
                
                if (!name || !intro || !this.state.avatarFile) {
                    this.showError('Please fill in all fields and upload an avatar');
                    return;
                }

                this.state.isBuilding = true;
                this.elements.form.style.display = 'none';
                this.elements.status.style.display = 'block';

                try {
                    // Step 1: Upload avatar
                    await this.updateStep(0);
                    
                    // 直接使用 uploadFile 方法上传图片文件
                    const avatarReceipt = await window.irysUploader.uploadFile(this.state.avatarFile, {
                        tags: [
                            { name: 'Content-Type', value: this.state.avatarFile.type },
                            { name: 'App-Name', value: 'web4' },
                            { name: 'Type', value: 'avatar' }
                        ]
                    });
                    
                    const avatarUrl = 'https://uploader.irys.xyz/' + avatarReceipt.id;
                    console.log('Avatar uploaded:', avatarUrl);

                    // Step 2: Create title widget
                    await this.updateStep(1);
                    const titleTemplate = await this.getTitleTemplate();
                    console.log('Got title template');

                    // 创建新的 title widget
                    const newTitleWidget = this.createTitleWidget(titleTemplate, {
                        avatarUrl,
                        name,
                        intro
                    });
                    console.log('Created new title widget');
                    
                    // 上传新的 title widget
                    const titleReceipt = await window.irysUploader.upload(JSON.stringify(newTitleWidget), {
                        tags: [
                            { name: 'Content-Type', value: 'application/json' },
                            { name: 'App-Name', value: 'web4' },
                            { name: 'Type', value: 'title_widget' },
                            { name: 'Version', value: '1.0.0' },
                            { name: 'Owner', value: window.solana.publicKey.toString() }
                        ]
                    });
                    console.log('Uploaded new title widget:', titleReceipt.id);

                    // Step 3: Copy and modify layout
                    await this.updateStep(2);
                    const layoutResponse = await fetch('https://gateway.irys.xyz/De6yYePMPZjK9mnb4zUU464jeYJQGVVpLgk1Si1McnnZ');
                    const originalLayout = await layoutResponse.json();
                    
                    // 修改 layout 中的 TITLE_WIDGET_ID
                    const modifiedLayout = {
                        ...originalLayout,
                        js: originalLayout.js.replace(
                            /const TITLE_WIDGET_ID = "[^"]+"/,
                            \`const TITLE_WIDGET_ID = "\${titleReceipt.id}"\`
                        )
                    };
                    
                    const layoutReceipt = await window.irysUploader.upload(JSON.stringify(modifiedLayout), {
                        tags: [
                            { name: 'Content-Type', value: 'application/json' },
                            { name: 'App-Name', value: 'web4' },
                            { name: 'Type', value: 'layout' },
                            { name: 'Version', value: '1.0.0' },
                            { name: 'Owner', value: window.solana.publicKey.toString() }
                        ]
                    });

                    // Step 4: Create site
                    await this.updateStep(3);
                    const templateResponse = await fetch('https://gateway.irys.xyz/CJn6d9J6B4PXQctXJXAYusSSqUKh7LEhbukYAwwxTWt4');
                    const templateData = await templateResponse.json();
                    
                    if (!templateData.template) {
                        throw new Error('Template content is missing');
                    }

                    const newHtml = templateData.template.replace('LAYOUT_ID_PLACEHOLDER', layoutReceipt.id);
                    
                    const indexReceipt = await window.irysUploader.upload(newHtml, {
                        tags: [
                            { name: 'Content-Type', value: 'text/html' },
                            { name: 'App-Name', value: 'web4' },
                            { name: 'Type', value: 'index' },
                            { name: 'Version', value: '1.0.0' },
                            { name: 'Layout-Id', value: layoutReceipt.id }
                        ]
                    });

                    const siteUrl = 'https://gateway.irys.xyz/' + indexReceipt.id;
                    this.showResult(siteUrl);

                } catch (error) {
                    console.error('Build failed:', error);
                    this.showError(error.message);
                } finally {
                    this.state.isBuilding = false;
                }
            },

            async getTitleTemplate() {
                const response = await fetch('https://uploader.irys.xyz/GN4BsRnFy14SsGTWSjmLx56o7qubgw9zAAYTF1mnC5h8');
                if (!response.ok) {
                    throw new Error('Failed to fetch title template');
                }
                return await response.json();
            },

            createTitleWidget(template, userData) {
                console.log('Creating title widget with:', userData);
                const newHtml = template.html
                    .replace(
                        'https://uploader.irys.xyz/DaZ5aaRJURtmSL2Bzo9Gi3FeyFpYtNMWiLNwfYQsDdnb', 
                        userData.avatarUrl
                    )
                    .replace('Heinz', userData.name)
                    .replace('Hello', userData.intro);

                return {
                    html: newHtml,
                    css: template.css
                };
            },

            async updateStep(stepIndex) {
                const steps = this.elements.status.querySelectorAll('.build-step');
                steps.forEach((step, index) => {
                    if (index < stepIndex) {
                        step.classList.remove('active');
                        step.classList.add('done');
                    } else if (index === stepIndex) {
                        step.classList.add('active');
                        step.classList.remove('done');
                    } else {
                        step.classList.remove('active', 'done');
                    }
                });

                await new Promise(resolve => setTimeout(resolve, 1000));
            },

            showResult(siteUrl) {
                this.elements.status.style.display = 'none';
                this.elements.result.style.display = 'block';
                this.elements.siteLink.href = siteUrl;
            },

            showModal() {
                this.elements.modal.classList.add('active');
                this.elements.form.style.display = 'block';
                this.elements.status.style.display = 'none';
                this.elements.result.style.display = 'none';
            },

            hideModal() {
                this.elements.modal.classList.remove('active');
            },

            showError(message) {
                alert(message);
            },

            async copyToClipboard() {
                try {
                    await navigator.clipboard.writeText(this.elements.siteLink.href);
                    this.elements.copyLink.textContent = 'Copied!';
                    setTimeout(() => {
                        this.elements.copyLink.textContent = 'Copy Link';
                    }, 2000);
                } catch (error) {
                    console.error('Failed to copy:', error);
                }
            }
        };

        // Initialize
        buildWidget.init();
    `
};

// Export the widget for both CommonJS and browser environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { buildContent };
} else if (typeof window !== 'undefined') {
    window.buildWidgetExports = { buildContent };
}