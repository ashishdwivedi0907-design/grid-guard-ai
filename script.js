// =========================================================
// GRIDGUARD AI - DASHBOARD JAVASCRIPT
// =========================================================

document.addEventListener("DOMContentLoaded", function () {

    // -----------------------------------------------------
    // PAGE NAVIGATION
    // -----------------------------------------------------

    const navItems = document.querySelectorAll(".nav-item");
    const pages = document.querySelectorAll(".page");

    const pageTitle = document.getElementById("pageTitle");
    const pageSubtitle = document.getElementById("pageSubtitle");

    const pageInfo = {

        transformers: {
            title: "Transformer Overview",
            subtitle: "Real-time health status of your power network"
        },

        alerts: {
            title: "Active Alerts",
            subtitle: "Abnormal conditions detected by GridGuard AI"
        },

        monitoring: {
            title: "Live Monitoring",
            subtitle: "Real-time transformer telemetry"
        },

        maintenance: {
            title: "Maintenance",
            subtitle: "Transformer maintenance and asset management"
        },

        insights: {
            title: "AI Insights",
            subtitle: "Intelligent transformer health prediction"
        }

    };


    navItems.forEach(function (button) {

        button.addEventListener("click", function () {

            const target = button.getAttribute("data-target");

            if (!target) {
                return;
            }


            // Remove active class from all buttons

            navItems.forEach(function (item) {
                item.classList.remove("active");
            });


            // Add active class to clicked button

            button.classList.add("active");


            // Hide all pages

            pages.forEach(function (page) {
                page.classList.remove("active-page");
            });


            // Show selected page

            const selectedPage = document.getElementById(target);

            if (selectedPage) {
                selectedPage.classList.add("active-page");
            }


            // Update title

            if (pageInfo[target]) {

                if (pageTitle) {
                    pageTitle.textContent = pageInfo[target].title;
                }

                if (pageSubtitle) {
                    pageSubtitle.textContent = pageInfo[target].subtitle;
                }

            }

        });

    });


    // -----------------------------------------------------
    // REFRESH BUTTON
    // -----------------------------------------------------

    const refreshButton = document.getElementById("refreshButton");

    if (refreshButton) {

        refreshButton.addEventListener("click", function () {

            refreshButton.textContent = "↻ Refreshing...";

            setTimeout(function () {

                refreshButton.textContent = "↻ Refresh";

                updateMonitoringValues();

            }, 1000);

        });

    }


    // -----------------------------------------------------
    // TRANSFORMER MARKERS
    // -----------------------------------------------------

    const transformerMarkers =
        document.querySelectorAll(".transformer-marker");


    transformerMarkers.forEach(function (marker) {

        marker.addEventListener("click", function () {

            const transformer =
                marker.getAttribute("data-transformer");

            if (transformer) {

                alert(
                    "GridGuard AI\n\n" +
                    transformer +
                    "\n\nTransformer selected.\n" +
                    "Live health monitoring is active."
                );

            }

        });

    });


    // -----------------------------------------------------
    // LIVE MONITORING VALUES
    // -----------------------------------------------------

    function updateMonitoringValues() {

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

            const temp =
                Math.floor(68 + Math.random() * 8);

            temperature.textContent =
                temp + "°C";

        }


        if (voltage) {

            const volt =
                (11.0 + Math.random() * 0.5)
                .toFixed(1);

            voltage.textContent =
                volt + " kV";

        }


        if (current) {

            const amp =
                Math.floor(30 + Math.random() * 10);

            current.textContent =
                amp + " A";

        }


        if (load) {

            const loadValue =
                Math.floor(58 + Math.random() * 10);

            load.textContent =
                loadValue + "%";

        }


        if (vibration) {

            const vibrationValue =
                (2.0 + Math.random() * 0.8)
                .toFixed(1);

            vibration.textContent =
                vibrationValue;

        }


        if (oilTemperature) {

            const oil =
                Math.floor(64 + Math.random() * 7);

            oilTemperature.textContent =
                oil + "°C";

        }

    }


    // -----------------------------------------------------
    // AUTO UPDATE LIVE MONITORING
    // -----------------------------------------------------

    setInterval(function () {

        updateMonitoringValues();

    }, 5000);


    // -----------------------------------------------------
    // INITIAL UPDATE
    // -----------------------------------------------------

    updateMonitoringValues();


    console.log(
        "GridGuard AI Dashboard loaded successfully."
    );

});
