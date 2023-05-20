import $ from "jquery";

import Micromodal from "micromodal";

import * as helpers from "./helpers";

export function create_update_license_request() {
    helpers.create_ajax_request(
        "/json/billing/plan",
        "licensechange",
        ["licenses_at_next_renewal"],
        "PATCH",
        () => window.location.replace("/billing/"),
    );
}

export function initialize() {
    helpers.set_tab("billing");
    helpers.set_sponsorship_form();

    $("#update-card-button").on("click", (e) => {
        const success_callback = (response) => {
            window.location.replace(response.stripe_session_url);
        };
        helpers.create_ajax_request(
            "/json/billing/session/start_card_update_session",
            "cardchange",
            [],
            "POST",
            success_callback,
        );
        e.preventDefault();
    });

    $("#update-licenses-button").on("click", (e) => {
        if (helpers.is_valid_input($("#new_licenses_input")) === false) {
            return;
        }
        e.preventDefault();
        const current_licenses = $("#licensechange-input-section").data("licenses");
        const new_licenses = $("#new_licenses_input").val();
        if (new_licenses > current_licenses) {
            $("#new_license_count_holder").text(new_licenses);
            $("#current_license_count_holder").text(current_licenses);
            const additional_licenses = new_licenses - current_licenses;
            $("#additional_license_count_holder").text(additional_licenses);
            Micromodal.show("confirm-licenses-modal", {
                disableFocus: true,
                openClass: "modal--opening",
            });
        } else {
            create_update_license_request();
        }
    });

    $(".dialog_submit_button").on("click", () => {
        create_update_license_request();
    });

    $("#update-licenses-at-next-renewal-button").on("click", (e) => {
        e.preventDefault();
        helpers.create_ajax_request(
            "/json/billing/plan",
            "licensechange",
            ["licenses"],
            "PATCH",
            () => window.location.replace("/billing/"),
        );
    });

    $("#change-plan-status").on("click", (e) => {
        helpers.create_ajax_request("/json/billing/plan", "planchange", [], "PATCH", () =>
            window.location.replace("/billing/"),
        );
        e.preventDefault();
    });
}

$(() => {
    initialize();
});
