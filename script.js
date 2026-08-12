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
            subtitle: "Monitor critical transformer conditions and warnings"
        },

        monitoring: {
            title: "Live Monitoring",
            subtitle: "Real-time transformer sensor monitoring"
        },

        maintenance: {
            title: "Maintenance",
            subtitle: "Manage transformer maintenance activities"
        },

        insights: {
            title: "AI Insights",
            subtitle: "AI-powered predictions and transformer health insights"
        }
    };


    function showPage(pageName) {

        console.log("Opening page:", pageName);

        // Hide every page
        pages.forEach(function (page) {
            page.style.display = "none";
            page.classList.remove("active");
        });

        // Remove active state from navigation
        navItems.forEach(function (item) {
            item.classList.remove("active");
        });

        // Show requested page
        const selectedPage = document.getElementById(pageName);

        if (selectedPage) {
            selectedPage.style.display = "block";
            selectedPage.classList.add("active");
        }

        // Activate navigation button
        navItems.forEach(function (item) {

            const target = item.getAttribute("data-page");

            if (target === pageName) {
                item.classList.add("active");
            }
        });

        // Update heading
        if (pageInformation[pageName]) {

            if (pageTitle) {
                pageTitle.textContent =
                    pageInformation[pageName].title;
            }

            if (pageSubtitle) {
                pageSubtitle.textContent =
                    pageInformation[pageName].subtitle;
            }

            document.title =
                "GridGuard AI | " +
                pageInformation[pageName].title;
        }
    }


    // Navigation buttons
    navItems.forEach(function (item) {

        item.addEventListener("click", function (event) {

            event.preventDefault();

            const pageName =
                item.getAttribute("data-page");

            if (pageName) {
                showPage(pageName);
            }
        });

    });


    // Refresh buttons
    const refreshButtons =
        document.querySelectorAll(".refresh-btn");

    refreshButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            console.log("Refreshing dashboard...");

            loadDashboardData();

        });

    });


    // Dashboard API
    async function loadDashboardData() {

        try {

            const response =
                await fetch("/dashboard");

            if (!response.ok) {
                throw new Error(
                    "Dashboard API error: " + response.status
                );
            }

            const data =
                await response.json();

            console.log("Dashboard data:", data);

            updateElement(
                "totalTransformers",
                data.total_transformers
            );

            updateElement(
                "activeUnits",
                data.active_units
            );

            updateElement(
                "faultUnits",
                data.fault_units
            );

        }

        catch (error) {

            console.error(
                "Could not load dashboard data:",
                error
            );

        }

    }


    function updateElement(id, value) {

        cons
