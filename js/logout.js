document.addEventListener('DOMContentLoaded', function() {
    var logoutLink = document.getElementById('wpfll-logout-link');
    if (!logoutLink) {
        return;
    }

    logoutLink.addEventListener('click', function(e) {
        e.preventDefault();

        var offScreenMenu = document.querySelector('.off-screen-menu');
        var menuToggle = document.querySelector('.menu-toggle');
        var mobileMenu = document.querySelector('.nav-primary');
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

        var confirmBox = document.createElement('div');
        confirmBox.className = 'wpfll-confirm-logout-box';

        var confirmButton = document.createElement('button');
        confirmButton.className = 'wpfll-confirm-logout-button';
        confirmButton.textContent = wpfllData.i18n.confirmLogout;

        var cancelButton = document.createElement('button');
        cancelButton.className = 'wpfll-cancel-logout-button';
        cancelButton.textContent = wpfllData.i18n.nevermind;

        confirmBox.appendChild(confirmButton);
        confirmBox.appendChild(cancelButton);
        document.body.appendChild(confirmBox);

        confirmBox.style.top = '50%';
        confirmBox.style.left = '50%';
        confirmBox.style.transform = 'translate(-50%, -50%)';
        confirmBox.style.zIndex = '99999';

        confirmButton.addEventListener('click', function() {
            confirmBox.remove();

            var logoutPopup = document.createElement('div');
            logoutPopup.className = 'wpfll-logout-popup';
            logoutPopup.textContent = wpfllData.i18n.loggingOut;
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
                success: function(response) {
                    if (response.success) {
                        logoutPopup.textContent = wpfllData.i18n.logoutSuccess;
                        setTimeout(function() {
                            window.location.href = wpfllData.home_url;
                        }, 2000);
                    } else {
                        console.error(wpfllData.i18n.logoutFailed);
                    }
                },
                error: function(xhr, status, error) {
                    console.error('AJAX request failed:', status, error);
                }
            });
        });

        cancelButton.addEventListener('click', function() {
            confirmBox.remove();
        });

        setTimeout(function() {
            document.addEventListener('click', function dismissConfirmBox(e) {
                if (!confirmBox.contains(e.target)) {
                    confirmBox.remove();
                    document.removeEventListener('click', dismissConfirmBox);
                }
            });
        }, 500);
    });
});
