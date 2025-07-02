document.addEventListener('DOMContentLoaded', function() {
    var logoutLinks = document.querySelectorAll('.wpfll-logout-link');
    if (!logoutLinks.length) {
        return;
    }

    logoutLinks.forEach(function(logoutLink) {
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
        confirmButton.textContent = 'Confirm Logout';

        var cancelButton = document.createElement('button');
        cancelButton.className = 'wpfll-cancel-logout-button';
        cancelButton.textContent = 'Nevermind';

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
                success: function(response) {
                    if (response.success) {
                        logoutPopup.textContent = 'You have been successfully logged out.';
                        setTimeout(function() {
                            window.location.href = wpfllData.home_url;
                        }, 2000);
                    } else {
                        console.error('Logout failed.');
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
});
