document.addEventListener('DOMContentLoaded', () => {
    'use strict';
    const logoutLink = document.getElementById('wpfll-logout-link');
    if (!logoutLink) {
        return;
    }

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
        confirmButton.textContent = 'Confirm Logout';

        const cancelButton = document.createElement('button');
        cancelButton.className = 'wpfll-cancel-logout-button';
        cancelButton.textContent = 'Nevermind';

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
            logoutPopup.textContent = 'Logging you out, please wait...';
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
                        logoutPopup.textContent = 'You have been successfully logged out.';
                        setTimeout(() => {
                            window.location.href = wpfllData.home_url;
                        }, 2000);
                    } else {
                        console.error('Logout failed.');
                    }
                },
                error: (xhr, status, error) => {
                    console.error('AJAX request failed:', status, error);
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
