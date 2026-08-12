document.addEventListener("DOMContentLoaded", function () {

    console.log("GridGuard AI started");

    const pages = document.querySelectorAll(".page");
    const navItems = document.querySelectorAll(".nav-item");

    const pageTitle = document.getElementById("pageTitle");
    const pageSubtitle = document.getElementById("pageSubtitle");


    const pageInformation = {

        transformers: {
            title: "Transformer Overview",
            subtitle: "Real-time health status of your power network"
        },

        alerts: {
            title: "Alerts",
            subtitle: "Monitor abnormal transformer conditions"
        },

        monitoring: {
            title: "Live Monitoring",
            subtitle: "Real-time transformer sensor telemetry"
        },

        maintenance: {
            title: "Maintenance",
            subtitle: "Track inspections and maintenance activities"
        },

        insights: {
            title: "AI Insights",
            subtitle: "AI-powered transformer health predictions"
        }

    };


    // ==========================================
    // CHANGE PAGE
    // ==========================================

    function openPage(pageId) {

        console.log("Opening:", pageId);

        const selectedPage =
            document.getElementById(pageId);

        if (!selectedPage) {
            console.error("Page does not exist:", pageId);
            return;
        }


        // Hide EVERY page
        pages.forEach(function (page) {

            page.classList.remove("active-page");

            page.style.display = "none";

        });


        // Remove active from EVERY button
        navItems.forEach(function (button) {

            button.classList.remove("active");

        });


        // SHOW selected page
        selectedPage.classList.add("active-page");

        selectedPage.style.display = "block";


        // Activate selected sidebar button
        navItems.forEach(function (button) {

            if (
                button.getAttribute("data-target")
                === pageId
            ) {

                button.classList.add("active");

            }

        });


        // Change heading
        if (pageInformation[pageId]) {

            if (pageTitle) {

                pageTitle.textContent =
                    pageInformation[pageId].title;

            }

            if (pageSubtitle) {

                pageSubtitle.textContent =
                    pageInformation[pageId].subtitle;

            }

        }


        window.scrollTo(0, 0);

    }


    // ==========================================
    // SIDEBAR CLICK
    // ==========================================

    navItems.forEach(function (button) {

        button.addEventListener(
            "click",
            function (event) {

                event.preventDefault();
                event.stopPropagation();

                const target =
                    this.getAttribute("data-target");

                console.log(
                    "SIDEBAR CLICK:",
                    target
                );

                openPage(target);

            }
        );

    });


    // ==========================================
    // REFRESH BUTTON
    // ==========================================

    const refreshButton =
        document.getElementById("refreshButton");


    if (refreshButton) {

        refreshButton.addEventListener(
            "click",
            function () {

                console.log("Dashboard refreshed");

                updateSensors();

                const original =
                    refreshButton.textContent;

                refreshButton.textContent =
                    "✓ Updated";

                setTimeout(function () {

                    refreshButton.textContent =
                        original;

                }, 1500);

            }
        );

    }


    // ==========================================
    // SENSOR VALUES
    // ==========================================

    function updateSensors() {
