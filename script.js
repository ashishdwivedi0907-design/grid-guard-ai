document.addEventListener("DOMContentLoaded", function () {

    console.log("GridGuard AI JavaScript loaded");

    // Get sidebar buttons
    const navItems = document.querySelectorAll(".nav-item");

    // Get all dashboard pages
    const pages = document.querySelectorAll(".page");

    // Get topbar elements
    const pageTitle = document.getElementById("pageTitle");
    const pageSubtitle = document.getElementById("pageSubtitle");

    // Page titles and subtitles
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


    // ===============================
    // OPEN DASHBOARD PAGE
    // ===============================

    function openPage(pageId) {

        console.log("Opening page:", pageId);

        const selectedPage = document.getElementById(pageId);

        if (!selectedPage) {
            console.error("Page not found:", pageId);
            return;
        }


        // Hide every page
        pages.forEach(function (page) {
            page.classList.remove("active-page");
        });


        // Remove active state from every sidebar button
        navItems.forEach(function (button) {
            button.classList.remove("active");
        });


        // Show selected page
        selectedPage.classList.add("active-page");


        // Activate selected sidebar button
        navItems.forEach(function (button) {

            if (button.dataset.target === pageId) {
                button.classList.add("active");
            }

        });


        // Change title
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

        // Scroll to top
        window.scrollTo(0, 0);
    }


    // ===============================
    // SIDEBAR BUTTONS
    // ===============================

    navItems.forEach(function (button) {

        button.addEventListener("click", function (event) {

            event.preventDefault();

            const target = button.getAttribute("data-target");

            console.log("Sidebar clicked:", target);

            openPage(target);

        });

    });


    // ===============================
    // REFRESH BUTTON
    // ===============================

    const refreshButton =
        document.getElementById("refreshButton");


    if (refreshButton) {

        refreshButton.addEventListener("click", function () {

            console.log("Dashboard refreshed");

            updateDemoSensors();

            const oldText = refreshButton.textContent;

            refreshButton.textContent = "✓ Updated";

            setTimeout(function () {
                refreshButton.textContent = oldText;
            }, 1500);

        });

    }


    // ===============================
    // DEMO SENSOR VALUES
    // ===============================

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
