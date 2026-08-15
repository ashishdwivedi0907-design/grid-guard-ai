/* =========================================================
   GRIDGUARD AI TWIN — DASHBOARD LOGIC
   ========================================================= */

/* ---------------------------------------------------------
   1. CONFIGURATION
   --------------------------------------------------------- */

// Change this to your deployed Render backend URL, e.g.
// "https://gridguard-api.onrender.com"
const API_BASE_URL = "";

// Toggle this to false once your backend is live and reachable.
// While true, the dashboard always uses the local demo dataset
// (useful for building the UI before the API is ready).
const USE_DEMO_DATA = true;


/* ---------------------------------------------------------
   2. DEMO DATA
   Centralized so it's easy to delete once the real API is wired up.
   --------------------------------------------------------- */

const demoTransformers = [
    {
        id: "T-101",
        location: "Sector 12 Substation",
        status: "Normal",
        healthScore: 94,
        temperature: 62,
        voltage: 11.0,
        current: 28,
        load: 61,
        vibration: 2.1,
        humidity: 52,
        oilTemperature: 58,
        lastUpdated: "2 min ago",
        markerClass: "marker-1"
    },
    {
        id: "T-102",
        location: "Industrial Zone Feeder",
        status: "Critical",
        healthScore: 48,
        temperature: 92,
        voltage: 10.4,
        current: 58,
        load: 97,
        vibration: 7.8,
        humidity: 70,
        oilTemperature: 89,
        lastUpdated: "1 min ago",
        markerClass: "marker-2"
    },
    {
        id: "T-103",
        location: "Residential Grid A",
        status: "Normal",
        healthScore: 91,
        temperature: 64,
        voltage: 11.1,
        current: 30,
        load: 58,
        vibration: 1.9,
        humidity: 48,
        oilTemperature: 60,
        lastUpdated: "3 min ago",
        markerClass: "marker-3"
    },
    {
        id: "T-104",
        location: "Commercial District Hub",
        status: "Warning",
        healthScore: 72,
        temperature: 81,
        voltage: 10.7,
        current: 46,
        load: 88,
        vibration: 5.4,
        humidity: 63,
        oilTemperature: 79,
        lastUpdated: "5 min ago",
        markerClass: "marker-4"
    },
    {
        id: "T-105",
        location: "North Substation",
        status: "Normal",
        healthScore: 89,
        temperature: 66,
        voltage: 11.0,
        current: 31,
        load: 60,
        vibration: 2.3,
        humidity: 50,
        oilTemperature: 61,
        lastUpdated: "4 min ago",
        markerClass: "marker-5"
    },
    {
        id: "T-106",
        location: "East Feeder Station",
        status: "Warning",
        healthScore: 75,
        temperature: 78,
        voltage: 10.8,
        current: 42,
        load: 83,
        vibration: 4.9,
        humidity: 59,
        oilTemperature: 76,
        lastUpdated: "6 min ago",
        markerClass: "marker-6"
    }
];

const demoAlerts = [
    { id: "A-01", transformerId: "T-102", type: "High Temperature", severity: "Critical", detail: "Critical temperature and load detected.", time: "2 min ago", status: "active" },
    { id: "A-02", transformerId: "T-104", type: "Excessive Vibration", severity: "Warning", detail: "Abnormal vibration detected.", time: "8 min ago", status: "active" },
    { id: "A-03", transformerId: "T-106", type: "High Load", severity: "Warning", detail: "Load approaching safety threshold.", time: "14 min ago", status: "active" },
    { id: "A-04", transformerId: "T-101", type: "Routine Check", severity: "Normal", detail: "Operating within normal parameters.", time: "12 min ago", status: "resolved" },
    { id: "A-05", transformerId: "T-103", type: "Routine Check", severity: "Normal", detail: "Operating within normal parameters.", time: "20 min ago", status: "resolved" }
];

const demoMaintenance = [
    { transformerId: "T-101", type: "Routine Inspection", date: "18 Aug 2026", priority: "Scheduled" },
    { transformerId: "T-106", type: "Oil Quality Inspection", date: "22 Aug 2026", priority: "Scheduled" },
    { transformerId: "T-102", type: "Cooling System Check", date: "16 Aug 2026", priority: "Due Soon" },
    { transformerId: "T-104", type: "Thermal Inspection", date: "27 Aug 2026", priority: "Scheduled" }
];


/* ---------------------------------------------------------
   3. STATE
   --------------------------------------------------------- */

const state = {
    transformers: [],
    alerts: [],
    maintenance: [],
    selectedTransformerId: null,
    alertFilter: "all",
    tempHistory: {} // rolling temperature history per transformer, for the sparkline
};


/* ---------------------------------------------------------
   4. API HELPERS (with graceful demo-data fallback)
   --------------------------------------------------------- */

async function apiGet(path) {
    if (USE_DEMO_DATA || !API_BASE_URL) {
        throw new Error("Demo mode active, skipping network call for " + path);
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    try {
        const response = await fetch(API_BASE_URL + path, { signal: controller.signal });
        clearTimeout(timeout);

        if (!response.ok) {
            throw new Error("API error " + response.status + " on " + path);
        }

        return await response.json();
    } catch (error) {
        clearTimeout(timeout);
        throw error;
    }
}

async function fetchTransformers() {
    try {
        const data = await apiGet("/transformers");
        setConnectionStatus(true);
        return data;
    } catch (error) {
        setConnectionStatus(false);
        return demoTransformers;
    }
}

async function fetchAlerts() {
    try {
        return await apiGet("/alerts");
    } catch (error) {
        return demoAlerts;
    }
}

async function fetchMaintenance() {
    try {
        return await apiGet("/maintenance");
    } catch (error) {
        return demoMaintenance;
    }
}

async function fetchAIInsights(transformerId) {
    try {
        return await apiGet("/ai-insights/" + transformerId);
    } catch (error) {
        return generateAIInsight(getTransformerById(transformerId));
    }
}

function setConnectionStatus(isOnline) {
    const dot = document.getElementById("connectionDot");
    const text = document.getElementById("connectionStatus");
    const subtext = document.getElementById("connectionSubtext");

    if (!dot || !text || !subtext) return;

    if (isOnline) {
        dot.classList.remove("offline");
        text.textContent = "System Online";
        subtext.textContent = "AI Twin Connected";
    } else {
        dot.classList.add("offline");
        text.textContent = "Demo Mode";
        subtext.textContent = "Backend unreachable — showing demo data";
    }
}


/* ---------------------------------------------------------
   5. NAVIGATION
   --------------------------------------------------------- */

function initializeNavigation() {
    const navItems = document.querySelectorAll(".nav-item");

    const pageInfo = {
        transformers: { title: "Transformer Overview", subtitle: "Real-time health status of your power network" },
        alerts: { title: "Alerts", subtitle: "Monitor critical transformer conditions and warnings" },
        monitoring: { title: "Live Monitoring", subtitle: "Real-time transformer sensor monitoring" },
        maintenance: { title: "Maintenance", subtitle: "Manage transformer maintenance activities" },
        insights: { title: "AI Insights", subtitle: "AI-powered predictions and transformer health insights" }
    };

    navItems.forEach(function (item) {
        item.addEventListener("click", function (event) {
            event.preventDefault();
            const target = item.getAttribute("data-target");
            if (target) {
                showSection(target, pageInfo[target]);
            }
        });
    });
}

function showSection(sectionId, info) {
    const pages = document.querySelectorAll(".page");
    const navItems = document.querySelectorAll(".nav-item");

    pages.forEach(function (page) {
        page.classList.remove("active-page");
    });

    navItems.forEach(function (item) {
        item.classList.toggle("active", item.getAttribute("data-target") === sectionId);
    });

    const selectedPage = document.getElementById(sectionId);
    if (selectedPage) {
        selectedPage.classList.add("active-page");
    }

    if (info) {
        const pageTitle = document.getElementById("pageTitle");
        const pageSubtitle = document.getElementById("pageSubtitle");
        if (pageTitle) pageTitle.textContent = info.title;
        if (pageSubtitle) pageSubtitle.textContent = info.subtitle;
        document.title = "GridGuard AI | " + info.title;
    }
}


/* ---------------------------------------------------------
   6. TRANSFORMER HELPERS
   --------------------------------------------------------- */

function getTransformerById(id) {
    return state.transformers.find(function (t) { return t.id === id; }) || null;
}

function statusClass(status) {
    const normalized = (status || "").toLowerCase();
    if (normalized === "critical") return "critical";
    if (normalized === "warning") return "warning";
    return "normal";
}


/* ---------------------------------------------------------
   7. DASHBOARD KPI CARDS
   --------------------------------------------------------- */

function updateKpiCards() {
    const total = state.transformers.length;
    const healthy = state.transformers.filter(function (t) { return statusClass(t.status) === "normal"; }).length;
    const warning = state.transformers.filter(function (t) { return statusClass(t.status) === "warning"; }).length;
    const critical = state.transformers.filter(function (t) { return statusClass(t.status) === "critical"; }).length;

    setText("totalTransformers", total);
    setText("healthyTransformers", healthy);
    setText("warningTransformers", warning);
    setText("criticalTransformers", critical);
    setText("healthyPercent", total ? Math.round((healthy / total) * 100) + "% of network" : "-- of network");
}

function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}


/* ---------------------------------------------------------
   8. MAP
   --------------------------------------------------------- */

function initializeMap() {
    const container = document.getElementById("markerContainer");
    if (!container) return;

    container.innerHTML = "";

    state.transformers.forEach(function (transformer) {
        const marker = document.createElement("button");
        marker.type = "button";
        marker.className = "transformer-marker " + statusClass(transformer.status) + "-marker " + (transformer.markerClass || "");
        marker.setAttribute("data-transformer", transformer.id);
        marker.innerHTML = '<span class="marker-dot"></span>' + transformer.id;

        marker.addEventListener("click", function () {
            selectTransformer(transformer.id);
        });

        container.appendChild(marker);
    });

    highlightSelectedMarker();
}

function highlightSelectedMarker() {
    document.querySelectorAll(".transformer-marker").forEach(function (marker) {
        marker.classList.toggle(
            "selected-marker",
            marker.getAttribute("data-transformer") === state.selectedTransformerId
        );
    });
}


/* ---------------------------------------------------------
   9. TRANSFORMER LIST + DETAIL PANEL
   --------------------------------------------------------- */

function renderTransformerList() {
    const list = document.getElementById("transformerList");
    if (!list) return;

    list.innerHTML = "";

    state.transformers.forEach(function (transformer) {
        const row = document.createElement("div");
        row.className = "transformer-row" + (transformer.id === state.selectedTransformerId ? " selected-row" : "");
        row.setAttribute("data-transformer", transformer.id);

        row.innerHTML =
            '<span class="row-dot ' + statusClass(transformer.status) + '"></span>' +
            '<span class="row-id">' + transformer.id + '</span>' +
            '<span class="row-location">' + transformer.location + '</span>' +
            '<span class="row-health">Health ' + transformer.healthScore + '</span>';

        row.addEventListener("click", function () {
            selectTransformer(transformer.id);
        });

        list.appendChild(row);
    });
}

function renderDetailPanel(transformer) {
    if (!transformer) return;

    setText("detailTitle", "Transformer " + transformer.id);
    setText("detailLocation", transformer.location);

    const badge = document.getElementById("detailStatusBadge");
    if (badge) {
        badge.textContent = transformer.status;
        badge.className = "badge" + (statusClass(transformer.status) === "critical" ? " danger-badge" : "");
    }

    const stats = document.getElementById("detailStats");
    if (stats) {
        stats.innerHTML =
            statCard("Health Score", transformer.healthScore, "blue") +
            statCard("Temperature", transformer.temperature + " °C", "orange") +
            statCard("Load", transformer.load + " %", "purple") +
            statCard("Voltage", transformer.voltage + " kV", "green");
    }
}

function statCard(label, value, color) {
    return (
        '<div class="stat-card ' + color + '">' +
        '<span>' + label + '</span>' +
        '<strong>' + value + '</strong>' +
        '</div>'
    );
}


/* ---------------------------------------------------------
   10. TRANSFORMER SELECTION (drives the whole dashboard)
   --------------------------------------------------------- */

function selectTransformer(id) {
    const transformer = getTransformerById(id);
    if (!transformer) return;

    state.selectedTransformerId = id;

    setText("selectedTransformerLabel", "Selected: " + id);

    renderTransformerList();
    highlightSelectedMarker();
    renderDetailPanel(transformer);
    updateSensorCards(transformer);
    renderAlerts();
    renderMaintenance();
    loadAIInsightsForSelection();
    updateTemperatureChart(transformer);
}


/* ---------------------------------------------------------
   11. LIVE MONITORING
   --------------------------------------------------------- */

function updateSensorCards(transformer) {
    setText("temperature", transformer.temperature + " °C");
    setText("voltage", transformer.voltage + " kV");
    setText("current", transformer.current + " A");
    setText("load", transformer.load + " %");
    setText("vibration", transformer.vibration + " mm/s");
    setText("oilTemperature", transformer.oilTemperature + " °C");

    setSensorStatus("temperatureStatus", transformer.temperature, 75, 88);
    setSensorStatus("voltageStatus", null, null, null, "● Stable");
    setSensorStatus("currentStatus", transformer.current, 40, 55);
    setSensorStatus("loadStatus", transformer.load, 80, 95);
    setSensorStatus("vibrationStatus", transformer.vibration, 4, 7);
    setSensorStatus("oilTemperatureStatus", transformer.oilTemperature, 75, 85);

    setText("monitoringSubtitle", "Real-time telemetry for " + transformer.id);
}

function setSensorStatus(id, value, warnThreshold, criticalThreshold, fixedLabel) {
    const el = document.getElementById(id);
    if (!el) return;

    if (fixedLabel) {
        el.textContent = fixedLabel;
        el.className = "normal-text";
        return;
    }

    if (value >= criticalThreshold) {
        el.textContent = "● Critical";
        el.className = "critical-text";
    } else if (value >= warnThreshold) {
        el.textContent = "● Warning";
        el.className = "warning-text";
    } else {
        el.textContent = "● Normal";
        el.className = "normal-text";
    }
}

function updateTemperatureChart(transformer) {
    if (!state.tempHistory[transformer.id]) {
        // Seed a short synthetic history around the current reading so the
        // sparkline has something to draw on first load.
        state.tempHistory[transformer.id] = Array.from({ length: 12 }, function (_, i) {
            const drift = (Math.sin(i) * 3) + (Math.random() * 2 - 1);
            return Math.max(0, transformer.temperature - 6 + drift);
        });
    }

    const history = state.tempHistory[transformer.id];
    history.push(transformer.temperature);
    if (history.length > 20) history.shift();

    const svg = document.getElementById("temperatureChartSvg");
    if (!svg) return;

    const width = 400;
    const height = 230;
    const max = Math.max.apply(null, history) + 5;
    const min = Math.min.apply(null, history) - 5;
    const range = Math.max(max - min, 1);

    const points = history.map(function (value, index) {
        const x = (index / (history.length - 1)) * width;
        const y = height - ((value - min) / range) * height;
        return x + "," + y;
    }).join(" ");

    svg.innerHTML =
        '<polyline points="' + points + '" fill="none" stroke="#38bdf8" stroke-width="2.5" ' +
        'style="filter: drop-shadow(0 0 6px rgba(56,189,248,.6));" />';
}


/* ---------------------------------------------------------
   12. ALERTS
   --------------------------------------------------------- */

function renderAlerts() {
    const list = document.getElementById("alertList");
    if (!list) return;

    let visible = state.alerts;

    if (state.selectedTransformerId) {
        // Show every resolved alert, but only active alerts for the selected transformer
        // plus a couple of general ones, so the section reacts to selection without
        // going empty for transformers with no active issues.
        visible = state.alerts.filter(function (alert) {
            return alert.status === "resolved" || alert.transformerId === state.selectedTransformerId;
        });
    }

    if (state.alertFilter === "critical") {
        visible = visible.filter(function (a) { return a.severity.toLowerCase() === "critical"; });
    } else if (state.alertFilter === "warning") {
        visible = visible.filter(function (a) { return a.severity.toLowerCase() === "warning"; });
    } else if (state.alertFilter === "resolved") {
        visible = visible.filter(function (a) { return a.status === "resolved"; });
    }

    list.innerHTML = "";

    if (visible.length === 0) {
        list.innerHTML = '<p style="color:#64748b; font-size:12px; padding:12px 0;">No alerts match this filter.</p>';
    }

    visible.forEach(function (alert) {
        const severityClass = alert.status === "resolved" ? "normal" : statusClass(alert.severity);
        const icon = severityClass === "normal" ? "✓" : "!";

        const row = document.createElement("div");
        row.className = "alert " + severityClass;
        row.innerHTML =
            '<div class="alert-icon">' + icon + '</div>' +
            '<div class="alert-content">' +
            '<strong>Transformer ' + alert.transformerId + '</strong>' +
            '<p>' + alert.type + ' — ' + alert.detail + '</p>' +
            '</div>' +
            '<span>' + alert.time + '</span>';

        list.appendChild(row);
    });

    const activeCount = state.alerts.filter(function (a) { return a.status === "active"; }).length;
    const criticalCount = state.alerts.filter(function (a) { return a.status === "active" && a.severity.toLowerCase() === "critical"; }).length;
    const warningCount = state.alerts.filter(function (a) { return a.status === "active" && a.severity.toLowerCase() === "warning"; }).length;
    const resolvedCount = state.alerts.filter(function (a) { return a.status === "resolved"; }).length;

    setText("activeAlertCount", activeCount + " Active");
    setText("criticalAlertCount", criticalCount);
    setText("warningAlertCount", warningCount);
    setText("resolvedAlertCount", resolvedCount);
}

function initializeAlertFilters() {
    const buttons = document.querySelectorAll(".alert-filter");
    buttons.forEach(function (button) {
        button.addEventListener("click", function () {
            buttons.forEach(function (b) { b.classList.remove("active"); });
            button.classList.add("active");
            state.alertFilter = button.getAttribute("data-filter");
            renderAlerts();
        });
    });
}


/* ---------------------------------------------------------
   13. MAINTENANCE
   --------------------------------------------------------- */

function renderMaintenance() {
    const list = document.getElementById("maintenanceList");
    if (!list) return;

    list.innerHTML = "";

    state.maintenance.forEach(function (item) {
        const row = document.createElement("div");
        row.className = "maintenance";

        const icon = item.priority === "Due Soon" ? "🛠" : "🔧";
        const highlight = item.transformerId === state.selectedTransformerId;

        row.style.opacity = highlight || !state.selectedTransformerId ? "1" : "0.55";

        row.innerHTML =
            '<div class="maintenance-icon">' + icon + '</div>' +
            '<div class="maintenance-info">' +
            '<strong>Transformer ' + item.transformerId + '</strong>' +
            '<p>' + item.type + '</p>' +
            '</div>' +
            '<span>' + item.date + '</span>';

        list.appendChild(row);
    });

    setText("maintenanceCount", state.maintenance.length + " Scheduled");
}


/* ---------------------------------------------------------
   14. AI INSIGHTS
   --------------------------------------------------------- */

function generateAIInsight(transformer) {
    if (!transformer) {
        return { healthScore: 0, riskLevel: "Normal", confidence: 0, recommendationTitle: "", recommendationText: "", factors: [] };
    }

    const factors = [];
    if (transformer.temperature >= 85) factors.push("High Temperature");
    if (transformer.load >= 90) factors.push("High Load");
    if (transformer.oilTemperature >= 85) factors.push("High Oil Temperature");
    if (transformer.vibration >= 6) factors.push("High Vibration");

    let riskLevel = "Normal";
    if (statusClass(transformer.status) === "critical") riskLevel = "Critical";
    else if (statusClass(transformer.status) === "warning") riskLevel = "Warning";

    const confidence = Math.min(99, 80 + factors.length * 4);

    let recommendationTitle = "Transformer " + transformer.id + " is operating normally";
    let recommendationText = "No unusual sensor patterns detected. Continue standard monitoring.";

    if (riskLevel === "Critical") {
        recommendationTitle = "Transformer " + transformer.id + " requires immediate inspection";
        recommendationText = "Elevated " + (factors.join(", ").toLowerCase() || "operating stress") +
            " indicate high failure risk. GridGuard recommends dispatching a technician within 24 hours.";
    } else if (riskLevel === "Warning") {
        recommendationTitle = "Transformer " + transformer.id + " shows early warning signs";
        recommendationText = "Monitor " + (factors.join(", ").toLowerCase() || "load and temperature trends") +
            " closely and schedule a routine inspection within the week.";
    }

    return {
        healthScore: transformer.healthScore,
        riskLevel: riskLevel,
        confidence: confidence,
        recommendationTitle: recommendationTitle,
        recommendationText: recommendationText,
        factors: factors.length ? factors : ["No abnormal readings"]
    };
}

async function loadAIInsightsForSelection() {
    const transformer = getTransformerById(state.selectedTransformerId);
    if (!transformer) return;

    setText("aiSubtitle", "Intelligent health prediction for " + transformer.id);

    const insight = await fetchAIInsights(transformer.id);

    setText("aiHealthScore", insight.healthScore);
    const bar = document.getElementById("aiHealthBar");
    if (bar) bar.style.width = insight.healthScore + "%";

    setText("aiConfidence", insight.confidence + "%");

    const riskEl = document.getElementById("aiRiskLevel");
    if (riskEl) {
        riskEl.textContent = insight.riskLevel.toUpperCase();
        riskEl.className = "risk-" + insight.riskLevel.toLowerCase();
    }

    setText("aiRecommendationTitle", insight.recommendationTitle);
    setText("aiRecommendationText", insight.recommendationText);
    setText("aiFactors", insight.factors.join(", "));
}


/* ---------------------------------------------------------
   15. REFRESH
   --------------------------------------------------------- */

function initializeRefreshButton() {
    const button = document.getElementById("refreshButton");
    if (!button) return;

    button.addEventListener("click", async function () {
        button.textContent = "↻ Refreshing...";
        await loadDashboardData();
        button.textContent = "↻ Refresh";
    });
}


/* ---------------------------------------------------------
   16. BOOTSTRAP
   --------------------------------------------------------- */

async function loadDashboardData() {
    const [transformers, alerts, maintenance] = await Promise.all([
        fetchTransformers(),
        fetchAlerts(),
        fetchMaintenance()
    ]);

    state.transformers = transformers;
    state.alerts = alerts;
    state.maintenance = maintenance;

    updateKpiCards();
    initializeMap();
    renderTransformerList();

    const stillExists = getTransformerById(state.selectedTransformerId);
    const defaultId = stillExists ? state.selectedTransformerId : (transformers[0] ? transformers[0].id : null);

    if (defaultId) {
        selectTransformer(defaultId);
    }
}

function initializeDashboard() {
    initializeNavigation();
    initializeAlertFilters();
    initializeRefreshButton();
    loadDashboardData();
}

document.addEventListener("DOMContentLoaded", initializeDashboard);
