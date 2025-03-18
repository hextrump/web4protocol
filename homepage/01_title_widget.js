const titleWidget = {
    html: `
        <div class="title-widget">
            <div class="title-background">
                <img src="https://uploader.irys.xyz/6jZ6U1BANTUG8crQjRoXBi8F6o3rFoEoBaXXrg8SbTeW" alt="Background" class="background-image">
            </div>
            <div class="title-content">
                <div class="profile-avatar">
                    <img src="https://uploader.irys.xyz/DaZ5aaRJURtmSL2Bzo9Gi3FeyFpYtNMWiLNwfYQsDdnb" alt="Avatar" class="avatar-image">
                </div>
                <div class="profile-info">
                    <h1 class="profile-name">Heinz</h1>
                    <p class="profile-address" id="profileAddress">Hello</p>
                </div>
            </div>
        </div>
    `,
    css: `
        .title-widget {
            position: relative;
            width: 100%;
            border-radius: 16px;
            overflow: hidden;
            background: var(--bg-secondary-light);
            box-shadow: 0 4px 12px var(--shadow-light);
        }

        .dark-theme .title-widget {
            background: var(--bg-secondary-dark);
            box-shadow: 0 4px 12px var(--shadow-dark);
        }

        .title-background {
            position: relative;
            width: 100%;
            height: 200px;
            overflow: hidden;
        }

        .background-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .title-content {
            position: relative;
            padding: 20px;
            margin-top: -60px;
        }

        .profile-avatar {
            width: 120px;
            height: 120px;
            border-radius: 60px;
            overflow: hidden;
            border: 4px solid var(--bg-light);
            margin: 0 auto;
            background: var(--bg-secondary-light);
        }

        .dark-theme .profile-avatar {
            border-color: var(--bg-dark);
            background: var(--bg-secondary-dark);
        }

        .avatar-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .profile-info {
            text-align: center;
            margin-top: 16px;
        }

        .profile-name {
            font-size: 24px;
            font-weight: 600;
            color: var(--text-primary-light);
            margin: 0;
        }

        .dark-theme .profile-name {
            color: var(--text-primary-dark);
        }

        .profile-address {
            font-size: 14px;
            color: var(--text-secondary-light);
            margin: 8px 0 0 0;
            font-family: monospace;
        }

        .dark-theme .profile-address {
            color: var(--text-secondary-dark);
        }

        @media (max-width: 768px) {
            .title-background {
                height: 160px;
            }

            .profile-avatar {
                width: 100px;
                height: 100px;
                margin-top: -50px;
            }

            .profile-name {
                font-size: 20px;
            }
        }
    `
};

module.exports = { titleWidget }; 