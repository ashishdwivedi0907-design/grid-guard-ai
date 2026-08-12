/* =====================================================
   GRIDGUARD AI
   SIDEBAR NAVIGATION
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    console.log("GridGuard Dashboard Loaded");


    /* -----------------------------------------------
       GET ALL NAVIGATION BUTTONS
    ------------------------------------------------ */

    const navItems =
        document.querySelectorAll(".nav-item");


    /* -----------------------------------------------
       GET ALL DASHBOARD PAGES
    ------------------------------------------------ */

    const pages =
        document.querySelectorAll(".page");


    /* -----------------------------------------------
       PAGE TITLES
    ------------------------------------------------ */

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


    /* -----------------------------------------------
       NAVIGATION FUNCTION
    ------------------------------------------------ */

    function openPage(pageId) {

        console.log("Opening page:", pageId);


        /* Hide every page */

        pages.forEach(function (page) {

            page.classList.remove("active-page");

        });


        /* Remove active from every button */

        navItems.forEach(function (button) {

            button.classList.remove("active");

        });


        /* Find requested page */

        const selectedPage =
            document.getElementById(pageId);


        if (!selectedPage) {

            console.error(
                "Page not found:",
                pageId
            );

            return;

        }


        /* Show selected page */

        selectedPage.classList.add(
            "active-page"
        );


        /* Find clicked navigation button */

        const selectedButton =
            document.querySelector(
                `.nav-item[data-target="${pageId}"]`
            );


        if (selectedButton) {

            selectedButton.classList.add(
                "active"
            );

        }


        /* Update top heading */

        const title =
            document.getElementById("pageTitle");

        const subtitle =
            document.getElementById("pageSubtitle");


        if (
            pageInformation[pageId]
        ) {

            title.textContent =
                pageInformation[pageId].title;

            subtitle.textContent =
                pageInformation[pageId].subtitle;

        }

    }


    /* -----------------------------------------------
       ADD CLICK EVENT TO EVERY SIDEBAR BUTTON
    ------------------------------------------------ */

    navItems.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                const pageId =
                    this.getAttribute(
                        "data-target"
                    );


                if (!pageId) {

                    console.error(
                        "Navigation button has no data-target"
                    );

                    return;

                }


                openPage(pageId);

            }
        );

    });


    /* -----------------------------------------------
       INITIAL PAGE
    ------------------------------------------------ */

    openPage("transformers");


    /* -----------------------------------------------
       MAKE NAVIGATION AVAILABLE GLOBALLY
    ------------------------------------------------ */

    window.openGridGuardPage =
        openPage;

});



/* =====================================================
   REFRESH DASHBOARD
===================================================== */

function refreshData() {

    console.log(
        "Refreshing GridGuard data..."
    );


    const button =
        document.querySelector(
            ".action-button"
        );


    if (!button) return;


    const originalText =
        button.textContent;


    button.textContent =
        "✓ Updated";


    setTimeout(
        function () {

            button.textContent =
                originalText;

        },
        1500
    );

}



/* =====================================================
   TEST FUNCTION
   You can run this from browser console
===================================================== */

function testNavigation() {

    console.log(
        "GridGuard navigation test"
    );


    const pages = [
        "transformers",
        "alerts",
        "monitoring",
        "maintenance",
        "insights"
    ];


    pages.forEach(function (page) {

        console.log(
            page,
            document.getElementById(page)
                ? "✓ Found"
                : "✗ Missing"
        );

    });

}
