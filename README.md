# WP Fancy Login Logout

This plugin provides a simple JavaScript powered logout confirmation popup. The logout request is sent via AJAX and, on success, the user is redirected to the site home page.

## Installation

1. Copy the plugin files to a folder inside your WordPress `wp-content/plugins` directory (e.g. `wp-content/plugins/wp-fancy-login-logout`).
2. Activate **WP Fancy Login Logout** from the WordPress plugins screen.
3. Add a custom menu item with the URL `#logout` to any menu assigned to the `primary` or `secondary` theme location. The plugin will replace this placeholder URL with the logout link and attach the confirmation dialog.

## Features

- Replaces `#logout` menu links with an AJAX powered logout link.
- Confirmation dialog before logging out.
- Popup message while the logout request is processed.

This plugin is released under the GPLv3 license.
