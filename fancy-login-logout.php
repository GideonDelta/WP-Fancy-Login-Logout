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

define( 'WPFLL_VERSION', '1.0.0' );

class WPFancyLoginLogout {

    public function __construct() {
        add_filter( 'nav_menu_link_attributes', array( $this, 'mark_logout_link' ), 10, 3 );
        add_action( 'wp_ajax_nopriv_wpfll_ajax_logout', array( $this, 'ajax_logout' ) );
        add_action( 'wp_ajax_wpfll_ajax_logout', array( $this, 'ajax_logout' ) );
        add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_scripts' ) );
    }

    /**
     * Add a class to any #logout menu links for JavaScript handling.
     *
     * @param array    $atts Anchor tag attributes.
     * @param WP_Post  $item Menu item object.
     * @param stdClass $args Menu arguments.
     * @return array Modified attributes.
     */
    public function mark_logout_link( $atts, $item, $args ) {
        if ( is_admin() ) {
            return $atts;
        }

        if ( isset( $args->theme_location ) && in_array( $args->theme_location, array( 'primary', 'secondary' ), true ) && '#logout' === $item->url ) {
            $atts['href'] = '#';

            $classes   = array();
            if ( isset( $atts['class'] ) ) {
                $classes = array_filter( explode( ' ', $atts['class'] ) );
            }
            $classes[] = 'wpfll-logout-link';
            $atts['class'] = implode( ' ', array_unique( $classes ) );
        }

        return $atts;
    }

    /**
     * AJAX handler for user logout.
     */
    public function ajax_logout() {
        check_ajax_referer( 'wpfll_logout_nonce', 'security' );
        if ( ! is_user_logged_in() ) {
            wp_send_json_error();
        }

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

        $plugin_url = plugin_dir_url( __FILE__ );

        wp_enqueue_style( 'wpfll-styles', $plugin_url . 'css/logout.css', array(), WPFLL_VERSION );
        wp_enqueue_script( 'wpfll-script', $plugin_url . 'js/logout.js', array( 'jquery', 'wp-i18n' ), WPFLL_VERSION, true );

        if ( function_exists( 'wp_set_script_translations' ) ) {
            wp_set_script_translations( 'wpfll-script', 'wp-fancy-login-logout', plugin_dir_path( __FILE__ ) . 'languages' );
        }

        wp_localize_script(
            'wpfll-script',
            'wpfllData',
            array(
                'ajax_url' => admin_url( 'admin-ajax.php' ),
                'nonce'    => wp_create_nonce( 'wpfll_logout_nonce' ),
                'home_url' => home_url(),
                'i18n'     => array(
                    'ajaxError' => esc_html__( 'AJAX request failed.', 'wp-fancy-login-logout' ),
                ),
            )
        );
    }
}

new WPFancyLoginLogout();

