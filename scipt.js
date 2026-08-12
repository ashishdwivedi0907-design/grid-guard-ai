/* =========================================================
   GRIDGUARD AI
   STEP 3 — TRANSFORMER MANAGEMENT
========================================================= */


/* =========================================================
   TRANSFORMER DATA
========================================================= */

const transformers = [

    {
        id: "TR-001",
        name: "Main Distribution",
        location: "Central Grid",
        health: 91,
        status: "normal",
        load: 64,
        confidence: 96,

        temperature: 68,
        oilLevel: 87,
        voltage: 11.1,
        current: 38,
        vibration: 2.1,
        humidity: 54,
        oilTemp: 71,

        recommendation:
            "Transformer is operating normally. Continue standard monitoring."
    },

    {
        id: "TR-002",
        name: "Industrial Zone",
        location: "Industrial Sector",
        health: 76,
        status: "warning",
        load: 81,
        confidence: 91,

        temperature: 76,
        oilLevel: 73,
        voltage: 10.8,
        current: 44,
        vibration: 3.7,
        humidity: 62,
        oilTemp: 79,

        recommendation:
            "Load and temperature are elevated. Schedule a routine inspection and monitor oil temperature closely."
    },

    {
        id: "TR-003",
        name: "Residential Sector",
        location: "North Grid",
        health: 42,
        status: "critical",
        load: 92,
        confidence: 94,

        temperature: 82,
        oilLevel: 61,
        voltage: 10.9,
        current: 45,
        vibration: 6.5,
        humidity: 75,
        oilTemp: 88,

        recommendation:
            "Critical operating conditions detected. Immediate inspection is recommended."
    },

    {
        id: "TR-004",
        name: "Commercial Hub",
        location: "Business District",
        health: 88,
        status: "normal",
        load: 59,
        confidence: 95,

        temperature: 64,
        oilLevel: 91,
        voltage: 11.2,
        current: 35,
        vibration: 1.8,
        humidity: 48,
        oilTemp: 68,

        recommendation:
            "Transformer health is stable. Continue normal monitoring."
    },

    {
        id: "TR-005",
        name: "East Distribution",
        location: "East Grid",
        health: 72,
        status: "warning",
        load: 78,
        confidence: 89,

        temperature: 74,
        oilLevel: 76,
        voltage: 11.0,
        current: 41,
        vibration: 3.2,
        humidity: 59,
        oilTemp: 77,

        recommendation:
            "Moderate risk detected. Monitor temperature and load during peak demand."
    }

];


/* =========================================================
   DOM ELEMENTS
========================================================= */

const pages = document.querySelectorAll(".page");

const navItems = document.querySelectorAll(".nav-item");

const transformerTableBody =
    document.getElementById("transformerTableBody");

const transformerSearch =
    document.getElementById("transformerSearch");

const statusFilter =
    document.getElementById("statusFilter");

const transformerSelect =
    document.getElementById("transformerSelect");


/* =========================================================
   PAGE NAVIGATION
========================================================= */

function showPage(pageName) {

    pages.forEach(page => {
        page.classList.remove("active-page");
    });


    const targetPage =
        document.getElementById(pageName + "Page");


    if (targetPage) {

        targetPage.classList.add("active-page");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }


    navItems.forEach(item => {

        item.classList.remove("active");

        if (item.dataset.page === pageName) {
            item.classList.add("active");
        }

    });

}


/* =========================================================
   SIDEBAR BUTTONS
========================================================= */

navItems.forEach(item => {

    item.addEventListener("click", () => {

        const page =
            item.dataset.page;

        if (page === "transformers") {

            showPage("transformers");

            renderTransformers();

        } else {

            showPage(page);

        }

    });

});


/* =========================================================
   FIND TRANSFORMER
========================================================= */

function getTransformer(id) {

    return transformers.find(
        transformer =>
            transformer.id === id
    );

}


/* =========================================================
   STATUS TEXT
========================================================= */

function getStatusText(status) {

    if (status === "normal") {
        return "HEALTHY";
    }

    if (status === "warning") {
        return "WARNING";
    }

    if (status === "critical") {
        return "CRITICAL";
    }

    return "UNKNOWN";

}


/* =========================================================
   RENDER TRANSFORMER TABLE
========================================================= */

function renderTransformers() {

    if (!transformerTableBody) {
        return;
    }


    const searchValue =
        transformerSearch
            ? transformerSearch.value
                .toLowerCase()
                .trim()
            : "";


    const selectedStatus =
        statusFilter
            ? statusFilter.value
            : "all";


    const filtered =
        transformers.filter(transformer => {

            const matchesSearch =

                transformer.id
                    .toLowerCase()
                    .includes(searchValue)

                ||

                transformer.name
                    .toLowerCase()
                    .includes(searchValue)

                ||

                transformer.location
                    .toLowerCase()
                    .includes(searchValue);


            const matchesStatus =

                selectedStatus === "all"

                ||

                transformer.status ===
                selectedStatus;


            return matchesSearch &&
                   matchesStatus;

        });


    transformerTableBody.innerHTML = "";


    if (filtered.length === 0) {

        transformerTableBody.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    style="
                        text-align:center;
                        padding:35px;
                        color:#94a3b8;
                    "
                >
                    No transformers found.
                </td>

            </tr>

        `;

        return;
    }


    filtered.forEach(transformer => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>

                <div class="transformer-id">
                    ${transformer.id}
                </div>

                <div class="transformer-name">
                    ${transformer.name}
                </div>

            </td>


            <td>
                ${transformer.location}
            </td>


            <td>

                <div class="health-mini">

                    <span class="health-number">
                        ${transformer.health}
                    </span>

                    <div class="mini-bar">

                        <span
                            style="
                                width:${transformer.health}%;
                                background:${getStatusColor(transformer.status)};
                            "
                        ></span>

                    </div>

                </div>

            </td>


            <td>
                ${transformer.load}%
            </td>


            <td>

                <span
                    class="status-pill ${transformer.status}"
                >
                    ${getStatusText(transformer.status)}
                </span>

            </td>


            <td>

                <button
                    class="view-button"
                    data-id="${transformer.id}"
                >
                    View Details
                </button>

            </td>

        `;


        transformerTableBody.appendChild(row);

    });


    document
        .querySelectorAll(".view-button")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    openTransformerDetail(
                        button.dataset.id
                    );

                }
            );

        });

}


/* =========================================================
   STATUS COLOR
========================================================= */

function getStatusColor(status) {

    if (status === "normal") {
        return "#16a34a";
    }

    if (status === "warning") {
        return "#d97706";
    }

    return "#dc2626";

}


/* =========================================================
   SEARCH
========================================================= */

if (transformerSearch) {

    transformerSearch.addEventListener(
        "input",
        renderTransformers
    );

}


/* =========================================================
   FILTER
========================================================= */

if (statusFilter) {

    statusFilter.addEventListener(
        "change",
        renderTransformers
    );

}


/* =========================================================
   OPEN TRANSFORMER DETAIL
========================================================= */

function openTransformerDetail(id) {

    const transformer =
        getTransformer(id);


    if (!transformer) {
        return;
    }


    document.getElementById(
        "detailTransformerName"
    ).textContent =
        transformer.id;


    document.getElementById(
        "detailTransformerLocation"
    ).textContent =
        transformer.name +
        " • " +
        transformer.location;


    const detailStatus =
        document.getElementById(
            "detailStatus"
        );


    detailStatus.textContent =
        getStatusText(
            transformer.status
        );


    detailStatus.className =
        "detail-status " +
        transformer.status;


    document.getElementById(
        "detailHealthScore"
    ).textContent =
        transformer.health;


    document.getElementById(
        "detailId"
    ).textContent =
        transformer.id;


    document.getElementById(
        "detailConfidence"
    ).textContent =
        transformer.confidence + "%";


    document.getElementById(
        "detailRecommendation"
    ).textContent =
        transformer.recommendation;


    renderDetailSensors(transformer);


    showPage("transformerDetail");

}


/* =========================================================
   DETAIL SENSOR CARDS
========================================================= */

function renderDetailSensors(transformer) {

    const container =
        document.getElementById(
            "detailSensorGrid"
        );


    container.innerHTML = "";


    const sensors = [

        {
            name: "Temperature",
            value: transformer.temperature,
            unit: "°C"
        },

        {
            name: "Oil Level",
            value: transformer.oilLevel,
            unit: "%"
        },

        {
            name: "Voltage",
            value: transformer.voltage,
            unit: "kV"
        },

        {
            name: "Current",
            value: transformer.current,
            unit: "A"
        },

        {
            name: "Load",
            value: transformer.load,
            unit: "%"
        },

        {
            name: "Vibration",
            value: transformer.vibration,
            unit: "mm/s"
        },

        {
            name: "Humidity",
            value: transformer.humidity,
            unit: "%"
        },

        {
            name: "Oil Temperature",
            value: transformer.oilTemp,
            unit: "°C"
        }

    ];


    sensors.forEach(sensor => {

        const card =
            document.createElement("div");


        card.className =
            "detail-sensor";


        card.innerHTML = `

            <span>
                ${sensor.name}
            </span>

            <strong>
                ${sensor.value}
            </strong>

            <small>
                ${sensor.unit}
            </small>

        `;


        container.appendChild(card);

    });

}


/* =========================================================
   BACK BUTTON
========================================================= */

const backButton =
    document.getElementById(
        "backToTransformers"
    );


if (backButton) {

    backButton.addEventListener(
        "click",
        () => {

            showPage("transformers");

            renderTransformers();

        }
    );

}


/* =========================================================
   TRANSFORMER SELECTOR
========================================================= */

if (transformerSelect) {

    transformerSelect.addEventListener(
        "change",
        () => {

            updateDashboard(
                transformerSelect.value
            );

        }
    );

}


/* =========================================================
   UPDATE DASHBOARD
========================================================= */

function updateDashboard(id) {

    const transformer =
        getTransformer(id);


    if (!transformer) {
        return;
    }


    document.getElementById(
        "transformerName"
    ).textContent =
        transformer.id +
        " — " +
        transformer.name;


    document.getElementById(
        "healthScore"
    ).textContent =
        transformer.health;


    document.getElementById(
        "aiConfidence"
    ).textContent =
        transformer.confidence + "%";


    document.getElementById(
        "healthMessage"
    ).textContent =
        transformer.recommendation;


    document.getElementById(
        "recommendation"
    ).textContent =
        transformer.recommendation;


    document.getElementById(
        "temperature"
    ).textContent =
        transformer.temperature;


    document.getElementById(
        "oilLevel"
    ).textContent =
        transformer.oilLevel;


    document.getElementById(
        "voltage"
    ).textContent =
        transformer.voltage;


    document.getElementById(
        "current"
    ).textContent =
        transformer.current;


    document.getElementById(
        "load"
    ).textContent =
        transformer.load;


    document.getElementById(
        "vibration"
    ).textContent =
        transformer.vibration;


    document.getElementById(
        "humidity"
    ).textContent =
        transformer.humidity;


    document.getElementById(
        "oilTemp"
    ).textContent =
        transformer.oilTemp;


    const badge =
        document.getElementById(
            "riskBadge"
        );


    badge.textContent =
        getStatusText(
            transformer.status
        );


    badge.className =
        "risk-badge " +
        transformer.status;


    updateProgressBars(transformer);


    document.getElementById(
        "lastUpdated"
    ).textContent =
        new Date().toLocaleTimeString(
            [],
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );

}


/* =========================================================
   PROGRESS BARS
========================================================= */

function updateProgressBars(transformer) {

    const progressBars =
        document.querySelectorAll(
            ".sensor-card .progress-fill"
        );


    if (progressBars.length < 8) {
        return;
    }


    const values = [

        transformer.temperature,

        transformer.oilLevel,

        (transformer.voltage / 15) * 100,

        (transformer.current / 70) * 100,

        transformer.load,

        (transformer.vibration / 8) * 100,

        transformer.humidity,

        transformer.oilTemp

    ];


    progressBars.forEach(
        (bar, index) => {

            const value =
                Math.max(
                    0,
                    Math.min(
                        100,
                        values[index]
                    )
                );


            bar.style.width =
                value + "%";

        }
    );

}


/* =========================================================
   REFRESH
========================================================= */

const refreshButton =
    document.getElementById(
        "refreshBtn"
    );


if (refreshButton) {

    refreshButton.addEventListener(
        "click",
        () => {

            const current =
                transformerSelect
                    ? transformerSelect.value
                    : "TR-001";


            updateDashboard(current);

        }
    );

}


const transformerRefresh =
    document.getElementById(
        "transformerRefresh"
    );


if (transformerRefresh) {

    transformerRefresh.addEventListener(
        "click",
        () => {

            renderTransformers();

        }
    );

}


/* =========================================================
   INITIAL LOAD
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        renderTransformers();

        updateDashboard("TR-001");

    }
);
