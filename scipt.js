/* =========================================================
   GRIDGUARD AI
   DASHBOARD CONTROLLER
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    console.log("⚡ GridGuard AI Dashboard Loaded");


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const navItems =
        document.querySelectorAll(".nav-item");

    const pages =
        document.querySelectorAll(".page");

    const pageTitle =
        document.getElementById("pageTitle");

    const pageSubtitle =
        document.getElementById("pageSubtitle");

    const refreshButton =
        document.getElementById("refreshButton");


    /* =====================================================
       PAGE INFORMATION
    ===================================================== */

    const pageInformation = {

        transformers: {
            title: "Transformer Overview",
            subtitle:
                "Real-time health status of your power network"
        },

        alerts: {
            title: "Alerts",
            subtitle:
                "Monitor abnormal transformer conditions"
        },

        monitoring: {
            title: "Live Monitoring",
            subtitle:
                "Real-time transformer sensor telemetry"
        },

        maintenance: {
            title: "Maintenance",
            subtitle:
                "Track inspections and maintenance activities"
        },

        insights: {
            title: "AI Insights",
            subtitle:
                "AI-powered transformer health predictions"
        }

    };


    /* =====================================================
       OPEN PAGE
    ===================================================== */

    function openPage(pageId) {

        console.log("📂 Opening page:", pageId);


        const selectedPage =
            document.getElementById(pageId);


        if (!selectedPage) {

            console.error(
                "❌ Page not found:",
                pageId
            );

            return;
        }


        /* Hide all pages */

        pages.forEach(page => {

            page.classList.remove(
                "active-page"
            );

        });


        /* Remove active button */

        navItems.forEach(button => {

            button.classList.remove(
                "active"
            );

        });


        /* Show selected page */

        selectedPage.classList.add(
            "active-page"
        );


        /* Activate selected button */

        const selectedButton =
            document.querySelector(
                `.nav-item[data-target="${pageId}"]`
            );


        if (selectedButton) {

            selectedButton.classList.add(
                "active"
            );

        }


        /* Update topbar */

        if (pageInformation[pageId]) {

            pageTitle.textContent =
                pageInformation[pageId].title;

            pageSubtitle.textContent =
                pageInformation[pageId].subtitle;

        }


        /* Scroll to top */

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    /* =====================================================
       SIDEBAR CLICK EVENTS
    ===================================================== */

    navItems.forEach(button => {

        button.addEventListener(
            "click",
            function () {

                const target =
                    this.dataset.target;

                console.log(
                    "🖱️ Sidebar clicked:",
                    target
                );

                openPage(target);

            }
        );

    });


    /* =====================================================
       REFRESH BUTTON
    ===================================================== */

    if (refreshButton) {

        refreshButton.addEventListener(
            "click",
            refreshDashboard
        );

    }


    function refreshDashboard() {

        console.log(
            "🔄 Refreshing GridGuard dashboard..."
        );


        const originalText =
            refreshButton.innerHTML;


        refreshButton.innerHTML =
            "✓ Updated";


        updateDemoSensors();


        setTimeout(() => {

            refreshButton.innerHTML =
                originalText;

        }, 1500);

    }


    /* =====================================================
       DEMO SENSOR UPDATE
    ===================================================== */

    function updateDemoSensors() {

        const temperature =
            document.getElementById(
                "temperature"
            );

        const voltage =
            document.getElementById(
                "voltage"
            );

        const current =
            document.getElementById(
                "current"
            );

        const load =
            document.getElementById(
                "load"
            );

        const vibration =
            document.getElementById(
                "vibration"
            );

        const oilTemperature =
            document.getElementById(
                "oilTemperature"
            );


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


    /* =====================================================
       RANDOM VALUES
    ===================================================== */

    function randomNumber(min, max) {

        return Math.floor(
            Math.random() *
            (max - min + 1)
        ) + min;

    }


    function randomDecimal(min, max) {

        return (
            Math.random() *
            (max - min) +
            min
        ).toFixed(1);

    }


    /* =====================================================
       TRANSFORMER MAP BUTTONS
    ===================================================== */

    const transformerMarkers =
        document.querySelectorAll(
            ".transformer-marker"
        );


    transformerMarkers.forEach(marker => {

        marker.addEventListener(
            "click",
            () => {

                const transformer =
                    marker.dataset.transformer;

                console.log(
                    "⚡ Transformer selected:",
                    transformer
                );


                alert(
                    transformer +
                    " selected.\n\n" +
                    "Transformer details will be connected to the GridGuard AI backend next."
                );

            }
        );

    });


    /* =====================================================
       INITIAL PAGE
    ===================================================== */

    openPage("transformers");


    /* =====================================================
       GLOBAL FUNCTION
    ===================================================== */

    window.openGridGuardPage =
        openPage;


    /* =====================================================
       DEBUG
    ===================================================== */

    console.log(
        "✅ Sidebar buttons:",
        navItems.length
    );

    console.log(
        "✅ Dashboard pages:",
        pages.length
    );

});
