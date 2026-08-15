/* =========================================================
   GRIDGUARD AI TWIN — DASHBOARD LOGIC
   ========================================================= */

/* ---------------------------------------------------------
   1. CONFIG
--------------------------------------------------------- */

// Your Render backend base URL.
// Update the endpoint paths below (search "ADJUST ENDPOINT")
// once you confirm your API's real routes.
const API_BASE_URL = "https://grid-guard-ai.onrender.com";

const API_TIMEOUT_MS = 6000;

const API_ENDPOINTS = {
    transformers: "/api/transformers",              // GET all transformers
    transformer: (id) => `/api/transformers/${id}`,  // GET one transformer
    alerts: "/api/alerts",                           // GET all alerts
    sensors: (id) => `/api/transformers/${id}/sensors`,       // GET live sensor data
    aiInsights: (id) => `/api/transformers/${id}/ai-insights`,// GET AI Twin output
    maintenance: "/api/maintenance",                 // GET maintenance schedule
    health: "/health"                                // GET backend health check
};

/* ---------------------------------------------------------
   2. DEMO DATA (fallback when the API is unreachable)
--------------------------------------------------------- */

const demoTransformers = [
    {
        id: "TR001",
        location: "Sector 7 Substation",
        status: "Normal",
        healthScore: 94,
        temperature: 62,
        voltage: 11.0,
        current: 28,
        load: 61,
        vibration: 2.1,
        humidity: 52,
        oilTemperature: 58,
        lastUpdated: "2 min ago"
    },
    {
        id: "TR002",
        location: "Downtown Grid Hub",
        status: "Critical",
        healthScore: 48,
        temperature: 82,
        voltage: 10.9,
        current: 45,
        load: 92,
        vibration: 6.5,
        humidity: 75,
        oilTemperature: 88,
        lastUpdated: "1 min ago"
    },
    {
        id: "TR003",
        location: "Riverside Station",
        status: "Normal",
        healthScore: 91,
        temperature: 60,
        voltage: 11.1,
        current: 26,
        load: 58,
        vibration: 1.9,
        humidity: 50,
        oilTemperature: 55,
        lastUpdated: "3 min ago"
    },
    {
        id: "TR004",
        location: "Industrial Park East",
        status: "Warning",
        healthScore: 72,
        temperature: 76,
        voltage: 10.8,
        current: 38,
        load: 81,
        vibration: 4.8,
        humidity: 66,
        oilTemperature: 79,
        lastUpdated: "4 min ago"
    },
    {
        id: "TR005",
        location: "North Ridge Feeder",
        status: "Warning",
        healthScore: 68,
        temperature: 78,
        voltage: 10.7,
        current: 40,
        load: 85,
        vibration: 5.2,
        humidity: 70,
        oilTemperature: 82,
        lastUpdated: "5 min ago"
    }
];

const demoMaintenance = [
    { transformerId: "TR001", type: "Oil Inspection", last: "12 May 2026", next: "18 Aug 2026", priority: "Low", status: "Scheduled" },
    { transformerId: "TR002", type: "Cooling System Check", last: "02 Jun 2026", next: "20 Aug 2026", priority: "High", status: "Due Soon" },
    { transformerId: "TR004", type: "Thermal Inspection", last: "28 Jun 2026", next: "27 Aug 2026", priority: "Medium", status: "Scheduled" },
    { transformerId: "TR005", type: "Preventive Maintenance", last: "10 Jul 2026", next: "02 Sep 2026", priority: "Medium", status: "Scheduled" },
    { transformerId: "TR003", type: "Routine Inspection", last: "15 Jul 2026", next: "15 Sep 2026", priority: "Low", status: "Scheduled" }
];

/* ---------------------------------------------------------
   3. APP STATE
--------------------------------------------------------- */

const state = {
    transformers: [],          // populated on init (API or demo)
    currentTransformerId: null,
    alertFilter: "all",
    apiOnline: false,
    chartTimer: null
};

/* ---------------------------------------------------------
   4. INIT
--------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", function () {
    console.log("GridGuard AI Twin starting...");
    initializeDashboard();
});

async function initializeDashboard() {
    initializeNavigation();
    initializeRefreshButton();
    initializeAlertFilters();

    await checkApiStatus();
    await loadTransformers();

    initializeMap();
    renderTransformerList();

    const firstId = state.transformers.length ? state.transformers[0].id : null;
    if (firstId) {
        selectTransformer(firstId);
    }

    updateOverviewStats();
    loadAlerts();
    loadMaintenance();

    startLiveSimulation();
}

/* ---------------------------------------------------------
   5. NAVIGATION (sidebar)
--------------------------------------------------------- */

function initializeNavigation() {
    const navItems = document.querySelectorAll(".nav-item");

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

    navItems.forEach(function (item) {
        item.addEventListener("click", function (event) {
            event.preventDefault();
            const pageName = item.getAttribute("data-target");
            if (pageName) {
                showSection(pageName, pageInformation[pageName]);
            }
        });
    });
}

function showSection(pageName, info) {
    console.log("Opening section:", pageName);

    const pages = document.querySelectorAll(".page");
    const navItems = document.querySelectorAll(".nav-item");
    const pageTitle = document.getElementById("pageTitle");
    const pageSubtitle = document.getElementById("pageSubtitle");

    pages.forEach(function (page) {
        page.classList.remove("active-page");
    });

    const selectedPage = document.getElementById(pageName);
    if (selectedPage) {
        selectedPage.classList.add("active-page");
    }

    navItems.forEach(function (item) {
        item.classList.toggle("active", item.getAttribute("data-target") === pageName);
    });

    if (info) {
        if (pageTitle) pageTitle.textContent = info.title;
        if (pageSubtitle) pageSubtitle.textContent = info.subtitle;
        document.title = "GridGuard AI | " + info.title;
    }

    // Charts only need (re)drawing once their canvas is visible
    if (pageName === "monitoring") {
        updateCharts();
    }
}

/* ---------------------------------------------------------
   6. API HELPERS
--------------------------------------------------------- */

async function apiFetch(path) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

    try {
        const response = await fetch(API_BASE_URL + path, { signal: controller.signal });
        clearTimeout(timeout);

        if (!response.ok) {
            throw new Error("API error " + response.status + " on " + path);
        }
        return await response.json();
    } catch (error) {
        clearTimeout(timeout);
        console.warn("API request failed for", path, "-", error.message);
        return null;
    }
}

async function checkApiStatus() {
    const result = await apiFetch(API_ENDPOINTS.health);
    state.apiOnline = result !== null;
    updateConnectionIndicator();
    return state.apiOnline;
}

function updateConnectionIndicator() {
    const label = document.getElementById("connectionLabel");
    const sub = document.getElementById("connectionSub");
    const dot = document.getElementById("connectionDot");
    const topStatus = document.getElementById("topStatusLabel");

    if (state.apiOnline) {
        if (label) label.textContent = "System Online";
        if (sub) sub.textContent = "Connected to GridGuard API";
        if (dot) dot.style.background = "#22c55e";
        if (topStatus) topStatus.textContent = "Live System";
    } else {
        if (label) label.textContent = "Demo Mode";
        if (sub) sub.textContent = "Backend unreachable — showing demo data";
        if (dot) dot.style.background = "#f59e0b";
        if (topStatus) topStatus.textContent = "Demo Data";
    }
}

/* ---------------------------------------------------------
   7. LOAD TRANSFORMERS
--------------------------------------------------------- */

async function loadTransformers() {
    let data = null;

    if (state.apiOnline) {
        data = await apiFetch(API_ENDPOINTS.transformers);
    }

    if (data && Array.isArray(data) && data.length > 0) {
        state.transformers = data;
    } else {
        console.log("Using demo transformer data.");
        state.transformers = demoTransformers;
    }
}

function getTransformerById(id) {
    return state.transformers.find(function (t) { return t.id === id; }) || null;
}

/* ---------------------------------------------------------
   8. TRANSFORMER LIST (Transformers page)
--------------------------------------------------------- */

function renderTransformerList() {
    const container = document.getElementById("transformerList");
    if (!container) return;

    container.innerHTML = "";

    state.transformers.forEach(function (t) {
        const item = document.createElement("button");
        item.type = "button";
        item.className = "transformer-list-item " + statusClass(t.status);
        item.setAttribute("data-transformer-id", t.id);

        item.innerHTML =
            '<div class="tl-main">' +
                '<strong>' + t.id + '</strong>' +
                '<span class="tl-location">' + t.location + '</span>' +
            '</div>' +
            '<div class="tl-meta">' +
                '<span class="tl-badge ' + statusClass(t.status) + '">' + t.status + '</span>' +
                '<span class="tl-health">' + t.healthScore + '</span>' +
            '</div>';

        item.addEventListener("click", function () {
            selectTransformer(t.id);
        });

        container.appendChild(item);
    });
}

function statusClass(status) {
    const s = (status || "").toLowerCase();
    if (s === "critical") return "status-critical";
    if (s === "warning") return "status-warning";
    return "status-normal";
}

/* ---------------------------------------------------------
   9. TRANSFORMER SELECTION (drives the whole dashboard)
--------------------------------------------------------- */

async function selectTransformer(id) {
    const transformer = getTransformerById(id);
    if (!transformer) {
        console.error("Unknown transformer id:", id);
        return;
    }

    state.currentTransformerId = id;

    // If API is online, try to fetch fresher single-transformer data
    if (state.apiOnline) {
        const fresh = await apiFetch(API_ENDPOINTS.transformer(id));
        if (fresh) {
            Object.assign(transformer, fresh);
        }
    }

    updateTransformerUI(transformer);
    highlightSelectedListItem(id);
    highlightSelectedMarker(id);
    loadAIInsights(id);
    renderAlerts(); // re-filter/re-render so selected transformer's alerts surface first
    updateCharts();
}

function updateTransformerUI(t) {
    setText("selectedTransformerId", t.id);
    setText("selectedTransformerLocation", t.location);
    setText("selectedTransformerStatus", t.status);
    setText("selectedTransformerHealth", t.healthScore);
    setText("selectedTransformerUpdated", "Updated " + (t.lastUpdated || "just now"));

    // Live monitoring sensor cards
    setText("temperature", t.temperature + " °C");
    setText("voltage", t.voltage + " kV");
    setText("current", t.current + " A");
    setText("load", t.load + " %");
    setText("vibration", t.vibration + " mm/s");
    setText("oilTemperature", t.oilTemperature + " °C");

    setSensorStatus("temperatureStatus", t.temperature, 70, 80);
    setSensorStatus("voltageStatus", null, null, null, "Stable");
    setSensorStatus("currentStatus", null, null, null, "Normal load");
    setSensorStatus("loadStatus", t.load, 75, 90);
    setSensorStatus("vibrationStatus", t.vibration, 4, 6);
    setSensorStatus("oilTemperatureStatus", t.oilTemperature, 75, 85);
}

function setSensorStatus(elId, value, warnAt, critAt, forcedLabel) {
    const el = document.getElementById(elId);
    if (!el) return;

    if (forcedLabel) {
        el.textContent = "● " + forcedLabel;
        el.className = "normal-text";
        return;
    }

    let label = "Normal";
    let cls = "normal-text";

    if (value >= critAt) {
        label = "Critical";
        cls = "critical-text";
    } else if (value >= warnAt) {
        label = "Warning";
        cls = "warning-text";
    }

    el.textContent = "● " + label;
    el.className = cls;
}

function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}

function highlightSelectedListItem(id) {
    document.querySelectorAll(".transformer-list-item").forEach(function (item) {
        item.classList.toggle("selected", item.getAttribute("data-transformer-id") === id);
    });
}

/* ---------------------------------------------------------
   10. MAP (network topology view)
--------------------------------------------------------- */

function initializeMap() {
    const markers = document.querySelectorAll(".transformer-marker");

    markers.forEach(function (marker) {
        marker.addEventListener("click", function () {
            const id = marker.getAttribute("data-transformer");
            if (id) selectTransformer(id);
        });
    });

    renderMapMarkerStatuses();
}

function renderMapMarkerStatuses() {
    state.transformers.forEach(function (t) {
        const marker = document.querySelector('.transformer-marker[data-transformer="' + t.id + '"]');
        if (!marker) return;

        marker.classList.remove("healthy-marker", "warning-marker", "critical-marker");

        if (t.status === "Critical") marker.classList.add("critical-marker");
        else if (t.status === "Warning") marker.classList.add("warning-marker");
        else marker.classList.add("healthy-marker");
    });
}

function highlightSelectedMarker(id) {
    document.querySelectorAll(".transformer-marker").forEach(function (marker) {
        marker.classList.toggle("selected-marker", marker.getAttribute("data-transformer") === id);
    });
}

/* ---------------------------------------------------------
   11. OVERVIEW STATS (KPI cards)
--------------------------------------------------------- */

function updateOverviewStats() {
    const total = state.transformers.length;
    const healthy = state.transformers.filter(t => t.status === "Normal").length;
    const warning = state.transformers.filter(t => t.status === "Warning").length;
    const critical = state.transformers.filter(t => t.status === "Critical").length;

    setText("totalTransformers", total);
    setText("healthyTransformers", healthy);
    setText("warningTransformers", warning);
    setText("criticalTransformers", critical);

    const avgHealth = total
        ? (state.transformers.reduce((sum, t) => sum + t.healthScore, 0) / total).toFixed(1)
        : "0.0";
    setText("networkHealthScore", avgHealth);

    const bar = document.getElementById("networkHealthBar");
    if (bar) bar.style.width = avgHealth + "%";
}

/* ---------------------------------------------------------
   12. ALERTS
--------------------------------------------------------- */

function buildAlertsFromTransformers() {
    const alerts = [];
    let counter = 1;

    state.transformers.forEach(function (t) {
        if (t.status === "Critical") {
            alerts.push({
                id: "AL" + String(counter++).padStart(3, "0"),
                transformerId: t.id,
                type: "High Temperature",
                severity: "Critical",
                value: t.temperature + " °C",
                timestamp: t.lastUpdated || "just now",
                status: "Active"
            });
        } else if (t.status === "Warning") {
            alerts.push({
                id: "AL" + String(counter++).padStart(3, "0"),
                transformerId: t.id,
                type: t.load > 80 ? "High Load" : "Elevated Vibration",
                severity: "Warning",
                value: t.load > 80 ? t.load + " %" : t.vibration + " mm/s",
                timestamp: t.lastUpdated || "just now",
                status: "Active"
            });
        } else {
            alerts.push({
                id: "AL" + String(counter++).padStart(3, "0"),
                transformerId: t.id,
                type: "Routine Check",
                severity: "Normal",
                value: "Within range",
                timestamp: t.lastUpdated || "just now",
                status: "Resolved"
            });
        }
    });

    return alerts;
}

async function loadAlerts() {
    let data = null;
    if (state.apiOnline) {
        data = await apiFetch(API_ENDPOINTS.alerts);
    }

    state.alerts = (data && Array.isArray(data) && data.length > 0)
        ? data
        : buildAlertsFromTransformers();

    renderAlerts();
}

function initializeAlertFilters() {
    const buttons = document.querySelectorAll(".alert-filter-btn");
    buttons.forEach(function (btn) {
        btn.addEventListener("click", function () {
            buttons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            state.alertFilter = btn.getAttribute("data-filter");
            renderAlerts();
        });
    });
}

function renderAlerts() {
    const container = document.getElementById("alertListContainer");
    if (!container || !state.alerts) return;

    let filtered = state.alerts;

    if (state.alertFilter === "critical") {
        filtered = state.alerts.filter(a => a.severity === "Critical");
    } else if (state.alertFilter === "warning") {
        filtered = state.alerts.filter(a => a.severity === "Warning");
    } else if (state.alertFilter === "resolved") {
        filtered = state.alerts.filter(a => a.status === "Resolved");
    }

    if (filtered.length === 0) {
        container.innerHTML = '<div class="empty-state">No alerts match this filter.</div>';
    } else {
        container.innerHTML = filtered.map(renderAlertItem).join("");
    }

    const critCount = state.alerts.filter(a => a.severity === "Critical").length;
    const warnCount = state.alerts.filter(a => a.severity === "Warning").length;
    const resolvedCount = state.alerts.filter(a => a.status === "Resolved").length;

    setText("alertSummaryCritical", critCount);
    setText("alertSummaryWarning", warnCount);
    setText("alertSummaryResolved", resolvedCount);

    const badge = document.getElementById("activeAlertsBadge");
    if (badge) badge.textContent = (critCount + warnCount) + " Active";
}

function renderAlertItem(a) {
    const cls = a.severity === "Critical" ? "critical" : (a.severity === "Warning" ? "warning" : "normal");
    const icon = a.severity === "Normal" ? "✓" : "!";

    return (
        '<div class="alert ' + cls + '">' +
            '<div class="alert-icon">' + icon + '</div>' +
            '<div class="alert-content">' +
                '<strong>Transformer ' + a.transformerId + '</strong>' +
                '<p>' + a.type + ' — ' + a.value + '</p>' +
            '</div>' +
            '<span>' + a.timestamp + '</span>' +
        '</div>'
    );
}

/* ---------------------------------------------------------
   13. MAINTENANCE
--------------------------------------------------------- */

async function loadMaintenance() {
    let data = null;
    if (state.apiOnline) {
        data = await apiFetch(API_ENDPOINTS.maintenance);
    }

    const records = (data && Array.isArray(data) && data.length > 0) ? data : demoMaintenance;
    renderMaintenance(records);
}

function renderMaintenance(records) {
    const container = document.getElementById("maintenanceListContainer");
    if (!container) return;

    container.innerHTML = records.map(function (m) {
        return (
            '<div class="maintenance">' +
                '<div class="maintenance-icon">🔧</div>' +
                '<div class="maintenance-info">' +
                    '<strong>Transformer ' + m.transformerId + '</strong>' +
                    '<p>' + m.type + ' — ' + m.status + '</p>' +
                '</div>' +
                '<span>' + m.next + '</span>' +
            '</div>'
        );
    }).join("");
}

/* ---------------------------------------------------------
   14. AI INSIGHTS
--------------------------------------------------------- */

function generateAIInsight(t) {
    const factors = [];
    if (t.temperature >= 75) factors.push("High Temperature");
    if (t.load >= 80) factors.push("High Load");
    if (t.oilTemperature >= 80) factors.push("High Oil Temperature");
    if (t.vibration >= 5) factors.push("High Vibration");

    let risk = "Normal";
    if (t.status === "Critical") risk = "High";
    else if (t.status === "Warning") risk = "Warning";

    const confidence = Math.min(97, 80 + factors.length * 5);

    const prediction = factors.length > 0
        ? "Transformer " + t.id + " is showing " + factors.join(", ").toLowerCase() + " conditions."
        : "Transformer " + t.id + " is operating within expected parameters.";

    const recommendation = factors.length > 0
        ? "Inspect the affected systems (" + factors.join(", ") + ") and increase monitoring frequency."
        : "Continue routine monitoring. No immediate action required.";

    return {
        healthScore: t.healthScore,
        riskLevel: risk,
        confidence: confidence,
        prediction: prediction,
        recommendation: recommendation,
        factors: factors
    };
}

async function loadAIInsights(id) {
    const t = getTransformerById(id);
    if (!t) return;

    let insight = null;

    if (state.apiOnline) {
        insight = await apiFetch(API_ENDPOINTS.aiInsights(id));
    }

    if (!insight) {
        insight = generateAIInsight(t);
    }

    renderAIInsights(t, insight);
}

function renderAIInsights(t, insight) {
    setText("aiTransformerId", t.id);
    setText("aiHealthScore", insight.healthScore);
    setText("aiConfidence", insight.confidence + "%");
    setText("aiRiskLevel", insight.riskLevel.toUpperCase());
    setText("aiPredictionText", insight.prediction);
    setText("aiRecommendationText", insight.recommendation);

    const bar = document.getElementById("aiHealthBar");
    if (bar) bar.style.width = insight.healthScore + "%";

    const riskEl = document.getElementById("aiRiskLevel");
    if (riskEl) {
        riskEl.className = insight.riskLevel === "High" ? "risk-high"
            : insight.riskLevel === "Warning" ? "risk-warning"
            : "risk-normal";
    }

    const factorsContainer = document.getElementById("aiFactors");
    if (factorsContainer) {
        factorsContainer.innerHTML = insight.factors.length
            ? insight.factors.map(f => '<span class="factor-tag">' + f + '</span>').join("")
            : '<span class="factor-tag ok">No contributing risk factors</span>';
    }
}

/* ---------------------------------------------------------
   15. LIVE MONITORING CHARTS (vanilla canvas sparklines)
--------------------------------------------------------- */

const chartHistory = {};

function updateCharts() {
    const t = getTransformerById(state.currentTransformerId);
    if (!t) return;

    const metrics = [
        { key: "temperature", canvasId: "chart-temperature", color: "#f59e0b" },
        { key: "voltage", canvasId: "chart-voltage", color: "#38bdf8" },
        { key: "current", canvasId: "chart-current", color: "#8b5cf6" },
        { key: "load", canvasId: "chart-load", color: "#22c55e" },
        { key: "vibration", canvasId: "chart-vibration", color: "#ef4444" },
        { key: "oilTemperature", canvasId: "chart-oilTemperature", color: "#f97316" }
    ];

    metrics.forEach(function (m) {
        if (!chartHistory[t.id]) chartHistory[t.id] = {};
        if (!chartHistory[t.id][m.key]) {
            chartHistory[t.id][m.key] = generateHistory(t[m.key]);
        }
        drawSparkline(m.canvasId, chartHistory[t.id][m.key], m.color);
    });
}

function generateHistory(baseValue) {
    const points = [];
    let value = baseValue;
    for (let i = 0; i < 20; i++) {
        value += (Math.random() - 0.5) * (baseValue * 0.04);
        points.push(value);
    }
    return points;
}

function drawSparkline(canvasId, points, color) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || !points || points.length === 0) return;

    const ctx = canvas.getContext("2d");
    const width = canvas.width = canvas.clientWidth;
    const height = canvas.height = canvas.clientHeight;

    ctx.clearRect(0, 0, width, height);

    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = (max - min) || 1;

    ctx.beginPath();
    points.forEach(function (p, i) {
        const x = (i / (points.length - 1)) * width;
        const y = height - ((p - min) / range) * (height * 0.8) - height * 0.1;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });

    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.shadowColor = color;
    ctx.shadowBlur = 8;
    ctx.stroke();
}

function startLiveSimulation() {
    if (state.chartTimer) clearInterval(state.chartTimer);

    state.chartTimer = setInterval(function () {
        const t = getTransformerById(state.currentTransformerId);
        if (!t || !chartHistory[t.id]) return;

        Object.keys(chartHistory[t.id]).forEach(function (key) {
            const history = chartHistory[t.id][key];
            const last = history[history.length - 1];
            const next = last + (Math.random() - 0.5) * (last * 0.03);
            history.push(next);
            history.shift();
        });

        const monitoringPage = document.getElementById("monitoring");
        if (monitoringPage && monitoringPage.classList.contains("active-page")) {
            updateCharts();
        }
    }, 2500);
}

/* ---------------------------------------------------------
   16. REFRESH BUTTON
--------------------------------------------------------- */

function initializeRefreshButton() {
    const button = document.getElementById("refreshButton");
    if (!button) return;

    button.addEventListener("click", async function () {
        button.disabled = true;
        button.textContent = "↻ Refreshing...";

        await checkApiStatus();
        await loadTransformers();
        renderTransformerList();
        renderMapMarkerStatuses();
        updateOverviewStats();
        await loadAlerts();
        await loadMaintenance();

        if (state.currentTransformerId) {
            await selectTransformer(state.currentTransformerId);
        }

        button.disabled = false;
        button.textContent = "↻ Refresh";
    });
}
