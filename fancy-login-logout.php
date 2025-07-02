<?php
/**
 * Plugin Name: WP Fancy Login Logout
 * Description: Adds a logout confirmation popup and handles the logout process via AJAX.
 * Version: 1.0.0
 * Author: WP Fancy Plugin Contributors
 * License: GPLv3
 * License URI: https://www.gnu.org/licenses/gpl-3.0.html
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class WPFancyLoginLogout {

    public function __construct() {
        add_filter( 'wp_nav_menu_items', array( $this, 'replace_logout_link' ), 10, 2 );
        add_action( 'wp_ajax_nopriv_wpfll_ajax_logout', array( $this, 'ajax_logout' ) );
        add_action( 'wp_ajax_wpfll_ajax_logout', array( $this, 'ajax_logout' ) );
        add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_scripts' ) );
    }

    /**
     * Replace #logout placeholder links in menus with a clickable link.
     */
    public function replace_logout_link( $items, $args ) {
        if ( ! is_admin() && isset( $args->theme_location ) && in_array( $args->theme_location, array( 'primary', 'secondary' ), true ) ) {
            $items = str_replace( 'href="#logout"', 'href="#" id="wpfll-logout-link"', $items );
        }
        return $items;
    }

    /**
     * AJAX handler for user logout.
     */
    public function ajax_logout() {
        check_ajax_referer( 'wpfll_logout_nonce', 'security' );
        wp_logout();
        wp_send_json_success();
    }

    /**
     * Enqueue scripts and styles.
     */
    public function enqueue_scripts() {
        if ( is_admin() ) {
            return;
        }

        $version    = '1.0.0';
        $plugin_url = plugin_dir_url( __FILE__ );

        wp_enqueue_style( 'wpfll-styles', $plugin_url . 'css/logout.css', array(), $version );
        wp_enqueue_script( 'wpfll-script', $plugin_url . 'js/logout.js', array( 'jquery' ), $version, true );

        wp_localize_script(
            'wpfll-script',
            'wpfllData',
            array(
                'ajax_url' => admin_url( 'admin-ajax.php' ),
                'nonce'    => wp_create_nonce( 'wpfll_logout_nonce' ),
                'home_url' => home_url(),
            )
        );
    }
}

new WPFancyLoginLogout();

