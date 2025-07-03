document.addEventListener('DOMContentLoaded', () => {
    'use strict';
    const { __ } = wp.i18n || { __: ( s ) => s };
    const logoutLinks = document.querySelectorAll('.wpfll-logout-link');
    if (!logoutLinks.length) {
        return;
    }

    logoutLinks.forEach((logoutLink) => {
        logoutLink.addEventListener('click', (e) => {
        e.preventDefault();

        const offScreenMenu = document.querySelector('.off-screen-menu');
        const menuToggle = document.querySelector('.menu-toggle');
        const mobileMenu = document.querySelector('.nav-primary');
        if (offScreenMenu && offScreenMenu.classList.contains('activated')) {
            offScreenMenu.classList.remove('activated');
            offScreenMenu.style.display = 'none';
            if (menuToggle) {
                menuToggle.classList.remove('activated');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
            if (mobileMenu) {
                mobileMenu.style.display = 'none';
            }
        }

        const confirmBox = document.createElement('div');
        confirmBox.className = 'wpfll-confirm-logout-box';

        const confirmButton = document.createElement('button');
        confirmButton.className = 'wpfll-confirm-logout-button';
        confirmButton.textContent = __( 'Confirm Logout', 'wp-fancy-login-logout' );

        const cancelButton = document.createElement('button');
        cancelButton.className = 'wpfll-cancel-logout-button';
        cancelButton.textContent = __( 'Nevermind', 'wp-fancy-login-logout' );

        confirmBox.appendChild(confirmButton);
        confirmBox.appendChild(cancelButton);
        document.body.appendChild(confirmBox);

        confirmBox.style.top = '50%';
        confirmBox.style.left = '50%';
        confirmBox.style.transform = 'translate(-50%, -50%)';
        confirmBox.style.zIndex = '99999';

        confirmButton.addEventListener('click', () => {
            confirmBox.remove();

            const logoutPopup = document.createElement('div');
            logoutPopup.className = 'wpfll-logout-popup';
            logoutPopup.textContent = __( 'Logging you out, please wait...', 'wp-fancy-login-logout' );
            document.body.appendChild(logoutPopup);
            document.body.style.opacity = '0.5';

            logoutPopup.style.top = '50%';
            logoutPopup.style.left = '50%';
            logoutPopup.style.transform = 'translate(-50%, -50%)';
            logoutPopup.style.zIndex = '99999';
            logoutPopup.style.backgroundColor = '#fff';
            logoutPopup.style.color = '#000';

            jQuery.ajax({
                type: 'POST',
                url: wpfllData.ajax_url,
                data: {
                    action: 'wpfll_ajax_logout',
                    security: wpfllData.nonce
                },
                success: (response) => {
                    if (response.success) {
                        logoutPopup.textContent = __( 'You have been successfully logged out.', 'wp-fancy-login-logout' );
                        setTimeout(() => {
                            logoutPopup.remove();
                            document.body.style.opacity = '1';
                            window.location.href = wpfllData.home_url;
                        }, 2000);
                    } else {
                        logoutPopup.remove();
                        document.body.style.opacity = '1';
                        console.error( __( 'Logout failed.', 'wp-fancy-login-logout' ) );
                    }
                },
                error: (xhr, status, error) => {
                    logoutPopup.remove();
                    document.body.style.opacity = '1';
                    console.error(wpfllData.i18n.ajaxError, status, error);
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'wpfll-error-message';
                    errorDiv.textContent = wpfllData.i18n.ajaxError;
                    document.body.appendChild(errorDiv);
                    setTimeout(() => {
                        errorDiv.remove();
                    }, 3000);
                }
            });
        });

        cancelButton.addEventListener('click', () => {
            confirmBox.remove();
        });

        setTimeout(() => {
            const dismissConfirmBox = (e) => {
                if (!confirmBox.contains(e.target)) {
                    confirmBox.remove();
                    document.removeEventListener('click', dismissConfirmBox);
                }
            };
            document.addEventListener('click', dismissConfirmBox);
        }, 500);
    });
    });
});
