document.addEventListener("DOMContentLoaded", function () {

    console.log("GridGuard AI JavaScript loaded");

    const navItems = document.querySelectorAll(".nav-item");
    const pages = document.querySelectorAll(".page");

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


    // ================================
    // OPEN PAGE
    // ================================

    function openPage(pageId) {

        console.log("Opening page:", pageId);

        const selectedPage = document.getElementById(pageId);

        if (!selectedPage) {
            console.error("Page not found:", pageId);
            return;
        }

        // Hide all pages
        pages.forEach(function (page) {
            page.classList.remove("active-page");
        });

        // Remove active sidebar button
        navItems.forEach(function (button) {
            button.classList.remove("active");
        });

        // Show selected page
        selectedPage.classList.add("active-page");

        // Activate selected sidebar button
        navItems.forEach(function (button) {

            if (button.getAttribute("data-target") === pageId) {
                button.classList.add("active");
            }

        });

        // Update title and subtitle
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


    // ================================
    // SIDEBAR BUTTONS
    // ================================

    navItems.forEach(function (button) {

        button.addEventListener("click", function (event) {

            event.preventDefault();

            const target =
                button.getAttribute("data-target");

            console.log("Sidebar clicked:", target);

            openPage(target);

        });

    });


    // ================================
    // REFRESH BUTTON
    // ================================

    const refreshButton =
        document.getElementById("refreshButton");

    if (refreshButton) {

        refreshButton.addEventListener("click", function () {

            updateDemoSensors();

            const oldText =
                refreshButton.textContent;

            refreshButton.textContent =
                "✓ Updated";

            setTimeout(function () {

                refreshButton.textContent =
                    oldText;

            }, 1500);

        });

    }


    // ================================
    // SENSOR UPDATE
    // ================================

    function updateDemoSensors() {

        const temperature =
            document.getElementById("temperature");

        const voltage =
            document.getElementById("voltage");

        const current =
            document.getElementById("current");

        const load =
            document.getElementById("load");

        const vibration =
            document.getElementById("vibration");

        const oilTemperature =
            document.getElementById("oilTemperature");


        if (temperature) {
            temperature.textContent =
                randomNumber(68, 76) + "°C";
        }

        if (voltage) {
            voltage.textContent =
                randomDecimal(10.9, 11.5) + " kV";
        }

        if (current) {
            current.textContent =
                randomNumber(30, 38) + " A";
        }

        if (load) {
            load.textContent =
                randomNumber(55, 70) + "%";
        }

        if (vibration) {
            vibration.textContent =
                randomDecimal(2.0, 3.0);
        }

        if (oilTemperature) {
            oilTemperature.textContent =
                randomNumber(64, 71) + "°C";
        }
    }


    // ================================
    // RANDOM VALUES
    // ================================

    function randomNumber(min, max) {

        return Math.floor(
            Math.random() * (max - min + 1)
        ) + min;

    }


    function randomDecimal(min, max) {

        return (
            Math.random() * (max - min) + min
        ).toFixed(1);

    }


    // ================================
    // TRANSFORMER MARKERS
    // ================================

    const transformerMarkers =
        document.querySelectorAll(
            ".transformer-marker"
        );

    transformerMarkers.forEach(function (marker) {

        marker.addEventListener("click", function () {

            const transformer =
                marker.getAttribute(
                    "data-transformer"
                );

            alert(
                transformer +
                " selected.\n\n" +
                "Transformer details will be connected to the GridGuard AI backend next."
            );

        });

    });


    // ================================
    // DEFAULT PAGE
    // ================================

    openPage("transformers");


    // Global function
    window.openGridGuardPage = openPage;


    console.log(
        "Sidebar buttons:",
        navItems.length
    );

    console.log(
        "Dashboard pages:",
        pages.length
    );

});
