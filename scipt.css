/* =========================================================
   GRIDGUARD AI - FRONTEND
   ========================================================= */


/*
   IMPORTANT:

   When we connect this dashboard to your Render FastAPI backend,
   put your backend URL here.

   Example:

   const API_BASE_URL =
      "https://grid-guard-ai.onrender.com"

   DO NOT put a slash at the end.
*/

const API_BASE_URL = "";


/*
   API endpoint used for prediction.

   If your FastAPI endpoint is /predict,
   this will automatically become:

   https://your-gridguard-api.onrender.com/predict
*/

const PREDICT_ENDPOINT = "/predict";


/* =========================================================
   DEMO DATA
   ========================================================= */

const demoData = {

    transformer_id: "TR-001",

    temperature: 78.64,

    voltage: 11.0,

    current: 42.5,

    load: 87.74,

    vibration: 4.85,

    humidity: 65,

    oil_temperature: 69.9,

    health_score: 74.5,

    risk_level: "WARNING",

    ai_confidence: 96,

    recommendation:
        "Monitor transformer temperature and load. Schedule preventive inspection if the values continue increasing."

};


/* =========================================================
   DOM ELEMENTS
   ========================================================= */

const elements = {

    transformerName:
        document.getElementById("transformerName"),

    healthScore:
        document.getElementById("healthScore"),

    riskBadge:
        document.getElementById("riskBadge"),

    riskLevel:
        document.getElementById("riskLevel"),

    aiConfidence:
        document.getElementById("aiConfidence"),

    healthMessage:
        document.getElementById("healthMessage"),

    temperature:
        document.getElementById("temperature"),

    voltage:
        document.getElementById("voltage"),

    current:
        document.getElementById("current"),

    load:
        document.getElementById("load"),

    vibration:
        document.getElementById("vibration"),

    humidity:
        document.getElementById("humidity"),

    oilTemperature:
        document.getElementById("oilTemperature"),

    temperatureBar:
        document.getElementById("temperatureBar"),

    loadBar:
        document.getElementById("loadBar"),

    vibrationBar:
        document.getElementById("vibrationBar"),

    oilBar:
        document.getElementById("oilBar"),

    connectionDot:
        document.getElementById("connectionDot"),

    connectionText:
        document.getElementById("connectionText"),

    lastUpdated:
        document.getElementById("lastUpdated"),

    alertsContainer:
        document.getElementById("alertsContainer"),

    alertCount:
        document.getElementById("alertCount"),

    recommendationTitle:
        document.getElementById("recommendationTitle"),

    recommendationText:
        document.getElementById("recommendationText"),

    refreshBtn:
        document.getElementById("refreshBtn"),

    transformerSelect:
        document.getElementById("transformerSelect")

};


/* =========================================================
   HELPER FUNCTIONS
   ========================================================= */


/*
   Convert different possible backend property names
   into one consistent value.
*/

function getValue(data, possibleNames, defaultValue = 0) {

    for (const name of possibleNames) {

        if (
            data[name] !== undefined &&
            data[name] !== null &&
            data[name] !== ""
        ) {

            return Number(data[name]);

        }

    }

    return defaultValue;
}


/*
   Get text values from backend.
*/

function getText(data, possibleNames, defaultValue = "") {

    for (const name of possibleNames) {

        if (
            data[name] !== undefined &&
            data[name] !== null &&
            data[name] !== ""
        ) {

            return String(data[name]);

        }

    }

    return defaultValue;
}


/*
   Safely limit a number between two values.
*/

function clamp(value, min, max) {

    return Math.min(
        Math.max(value, min),
        max
    );

}


/*
   Format numbers.
*/

function formatNumber(value, decimals = 1) {

    if (value === null || value === undefined) {
        return "--";
    }

    const number = Number(value);

    if (Number.isNaN(number)) {
        return "--";
    }

    return number.toFixed(decimals);

}


/* =========================================================
   CONNECTION STATUS
   ========================================================= */

function setConnectionStatus(online) {

    if (online) {

        elements.connectionDot.classList.remove("offline");

        elements.connectionDot.classList.add("online");

        elements.connectionText.textContent =
            "AI API Connected";

    } else {

        elements.connectionDot.classList.remove("online");

        elements.connectionDot.classList.add("offline");

        elements.connectionText.textContent =
            "Demo Mode";

    }

}


/* =========================================================
   RISK
   ========================================================= */

function normalizeRisk(risk) {

    if (!risk) {
        return "NORMAL";
    }

    const value =
        String(risk).toUpperCase();

    if (
        value.includes("CRITICAL") ||
        value.includes("HIGH") ||
        value.includes("DANGER")
    ) {

        return "CRITICAL";

    }

    if (
        value.includes("WARNING") ||
        value.includes("MEDIUM")
    ) {

        return "WARNING";

    }

    return "NORMAL";

}


function updateRisk(risk) {

    const normalizedRisk =
        normalizeRisk(risk);

    elements.riskBadge.textContent =
        normalizedRisk;

    elements.riskLevel.textContent =
        normalizedRisk;

    elements.riskBadge.className =
        "risk-badge";

    elements.riskBadge.classList.add(
        normalizedRisk.toLowerCase()
    );

    elements.riskLevel.style.color =
        normalizedRisk === "CRITICAL"
            ? "#dc2626"
            : normalizedRisk === "WARNING"
                ? "#d97706"
                : "#16a34a";

}


/* =========================================================
   PARAMETER STATUS
   ========================================================= */

function getParameterStatus(value, warning, critical) {

    if (value >= critical) {
        return "CRITICAL";
    }

    if (value >= warning) {
        return "WARNING";
    }

    return "NORMAL";

}


function updateParameterStatus(
    elementId,
    value,
    warning,
    critical
) {

    const element =
        document.getElementById(elementId);

    if (!element) {
        return;
    }

    const status =
        getParameterStatus(
            value,
            warning,
            critical
        );

    element.textContent =
        status;

    element.className =
        "parameter-status " +
        status.toLowerCase();

}


/* =========================================================
   UPDATE PROGRESS BARS
   ========================================================= */

function updateBar(
    element,
    value,
    maximum
) {

    if (!element) {
        return;
    }

    const percentage =
        clamp(
            (value / maximum) * 100,
            0,
            100
        );

    element.style.width =
        percentage + "%";

}


/* =========================================================
   UPDATE DASHBOARD
   ========================================================= */

function updateDashboard(rawData) {

    /*
       Some FastAPI responses return the actual result
       inside "result", "prediction", or "data".

       This makes the dashboard more tolerant.
    */

    const data =
        rawData.result ||
        rawData.prediction ||
        rawData.data ||
        rawData;


    /* -------------------------
       Transformer
    ------------------------- */

    const transformerId =
        getText(
            data,
            [
                "transformer_id",
                "transformerId",
                "transformer",
                "id"
            ],
            "TR-001"
        );

    elements.transformerName.textContent =
        transformerId;


    /* -------------------------
       Sensor values
    ------------------------- */

    const temperature =
        getValue(
            data,
            [
                "temperature",
                "temperature_c",
                "temperature_C"
            ]
        );


    const voltage =
        getValue(
            data,
            [
                "voltage",
                "voltage_kv",
                "voltage_kV"
            ]
        );


    const current =
        getValue(
            data,
            [
                "current",
                "current_a",
                "current_A"
            ]
        );


    const load =
        getValue(
            data,
            [
                "load",
                "load_percent",
                "load_percentage"
            ]
        );


    const vibration =
        getValue(
            data,
            [
                "vibration",
                "vibration_mm_s",
                "vibration_mms"
            ]
        );


    const humidity =
        getValue(
            data,
            [
                "humidity",
                "humidity_percent"
            ]
        );


    const oilTemperature =
        getValue(
            data,
            [
                "oil_temperature",
                "oilTemperature",
                "oil_temp",
                "oil_temperature_c"
            ]
        );


    /* -------------------------
       Health
    ------------------------- */

    const healthScore =
        getValue(
            data,
            [
                "health_score",
                "healthScore",
                "health"
            ],
            0
        );


    const confidence =
        getValue(
            data,
            [
                "ai_confidence",
                "confidence",
                "aiConfidence",
                "prediction_confidence"
            ],
            0
        );


    const risk =
        getText(
            data,
            [
                "risk_level",
                "riskLevel",
                "risk",
                "prediction"
            ],
            "NORMAL"
        );


    /* -------------------------
       Put values into UI
    ------------------------- */

    elements.temperature.textContent =
        formatNumber(temperature, 2);

    elements.voltage.textContent =
        formatNumber(voltage, 2);

    elements.current.textContent =
        formatNumber(current, 2);

    elements.load.textContent =
        formatNumber(load, 2);

    elements.vibration.textContent =
        formatNumber(vibration, 2);

    elements.humidity.textContent =
        formatNumber(humidity, 1);

    elements.oilTemperature.textContent =
        formatNumber(oilTemperature, 1);

    elements.healthScore.textContent =
        formatNumber(healthScore, 1);

    elements.aiConfidence.textContent =
        formatNumber(confidence, 1) + "%";


    /* -------------------------
       Risk
    ------------------------- */

    updateRisk(risk);


    /* -------------------------
       Health message
    ------------------------- */

    const normalizedRisk =
        normalizeRisk(risk);

    if (normalizedRisk === "CRITICAL") {

        elements.healthMessage.textContent =
            "Critical conditions detected. Immediate inspection is recommended.";

    } else if (normalizedRisk === "WARNING") {

        elements.healthMessage.textContent =
            "Some transformer parameters require monitoring and preventive attention.";

    } else {

        elements.healthMessage.textContent =
            "Transformer parameters are within the normal operating range.";

    }


    /* -------------------------
       Progress bars
    ------------------------- */

    updateBar(
        elements.temperatureBar,
        temperature,
        100
    );

    updateBar(
        elements.loadBar,
        load,
        100
    );

    updateBar(
        elements.vibrationBar,
        vibration,
        10
    );

    updateBar(
        elements.oilBar,
        oilTemperature,
        100
    );


    /* -------------------------
       Parameter statuses
    ------------------------- */

    updateParameterStatus(
        "temperatureStatus",
        temperature,
        70,
        80
    );

    updateParameterStatus(
        "loadStatus",
        load,
        75,
        90
    );

    updateParameterStatus(
        "vibrationStatus",
        vibration,
        4,
        6
    );

    updateParameterStatus(
        "oilStatus",
        oilTemperature,
        65,
        80
    );


    /* -------------------------
       Recommendation
    ------------------------- */

    const recommendation =
        getText(
            data,
            [
                "recommendation",
                "recommendations",
                "action"
            ],
            ""
        );

    updateRecommendation(
        normalizedRisk,
        recommendation
    );


    /* -------------------------
       Alerts
    ------------------------- */

    generateAlerts(
        temperature,
        load,
        vibration,
        oilTemperature
    );


    /* -------------------------
       Timestamp
    ------------------------- */

    elements.lastUpdated.textContent =
        new Date().toLocaleTimeString();

}


/* =========================================================
   RECOMMENDATION
   ========================================================= */

function updateRecommendation(
    risk,
    backendRecommendation
) {

    if (backendRecommendation) {

        elements.recommendationText.textContent =
            backendRecommendation;

    } else if (risk === "CRITICAL") {

        elements.recommendationTitle.textContent =
            "Immediate inspection required";

        elements.recommendationText.textContent =
            "Critical transformer conditions detected. Inspect the transformer and investigate abnormal sensor readings.";

        return;

    } else if (risk === "WARNING") {

        elements.recommendationTitle.textContent =
            "Preventive monitoring recommended";

        elements.recommendationText.textContent =
            "Monitor temperature, load and vibration closely and schedule preventive maintenance if values continue increasing.";

        return;

    } else {

        elements.recommendationTitle.textContent =
            "Transformer operating normally";

        elements.recommendationText.textContent =
            "Current sensor readings indicate stable transformer operation.";

        return;

    }

    elements.recommendationTitle.textContent =
        "AI Recommendation";

}


/* =========================================================
   ALERT GENERATION
   ========================================================= */

function generateAlerts(
    temperature,
    load,
    vibration,
    oilTemperature
) {

    const alerts = [];


    if (temperature >= 80) {

        alerts.push({
            type: "critical",
            title: "High Temperature",
            message:
                `Temperature reached ${formatNumber(temperature, 1)} °C.`
        });

    } else if (temperature >= 70) {

        alerts.push({
            type: "warning",
            title: "Temperature Warning",
            message:
                `Temperature is ${formatNumber(temperature, 1)} °C.`
        });

    }


    if (load >= 90) {

        alerts.push({
            type: "critical",
            title: "High Load",
            message:
                `Transformer load reached ${formatNumber(load, 1)}%.`
        });

    } else if (load >= 75) {

        alerts.push({
            type: "warning",
            title: "Load Warning",
            message:
                `Transformer load is ${formatNumber(load, 1)}%.`
        });

    }


    if (vibration >= 6) {

        alerts.push({
            type: "critical",
            title: "High Vibration",
            message:
                `Vibration reached ${formatNumber(vibration, 2)} mm/s.`
        });

    } else if (vibration >= 4) {

        alerts.push({
            type: "warning",
            title: "Vibration Warning",
            message:
                `Vibration is ${formatNumber(vibration, 2)} mm/s.`
        });

    }


    if (oilTemperature >= 80) {

        alerts.push({
            type: "critical",
            title: "High Oil Temperature",
            message:
                `Oil temperature reached ${formatNumber(oilTemperature, 1)} °C.`
        });

    } else if (oilTemperature >= 65) {

        alerts.push({
            type: "warning",
            title: "Oil Temperature Warning",
            message:
                `Oil temperature is ${formatNumber(oilTemperature, 1)} °C.`
        });

    }


    renderAlerts(alerts);

}


/* =========================================================
   RENDER ALERTS
   ========================================================= */

function renderAlerts(alerts) {

    elements.alertCount.textContent =
        alerts.length;


    if (alerts.length === 0) {

        elements.alertsContainer.innerHTML = `

            <div class="empty-state">

                <div>✓</div>

                <p>No alerts detected</p>

                <small>
                    System is operating normally.
                </small>

            </div>

        `;

        return;
    }


    elements.alertsContainer.innerHTML =
        alerts.map(alert => `

            <div class="alert-item ${alert.type}">

                <h4>
                    ${alert.title}
                </h4>

                <p>
                    ${alert.message}
                </p>

            </div>

        `).join("");

}


/* =========================================================
   API CALL
   ========================================================= */

async function callAPI() {

    /*
       If API_BASE_URL is empty,
       use demo mode.

       This means the dashboard will still work
       when you open index.html locally.
    */

    if (!API_BASE_URL) {

        console.log(
            "GridGuard running in demo mode."
        );

        setConnectionStatus(false);

        updateDashboard(demoData);

        return;

    }


    try {

        setConnectionStatus(false);

        elements.connectionText.textContent =
            "Connecting...";


        /*
           Data sent to your FastAPI AI model.

           These are the same type of transformer
           parameters used by the GridGuard AI model.
        */

        const payload = {

            temperature: 78.64,

            voltage: 11.0,

            current: 42.5,

            load: 87.74,

            vibration: 4.85,

            humidity: 65,

            oil_temperature: 69.9

        };


        const response =
            await fetch(
                API_BASE_URL + PREDICT_ENDPOINT,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify(payload)
                }
            );


        if (!response.ok) {

            throw new Error(
                `API returned ${response.status}`
            );

        }


        const data =
            await response.json();


        console.log(
            "GridGuard API response:",
            data
        );


        setConnectionStatus(true);

        updateDashboard(data);


    } catch (error) {

        console.error(
            "GridGuard API error:",
            error
        );


        /*
           Keep dashboard functional even
           when backend is temporarily unavailable.
        */

        setConnectionStatus(false);

        updateDashboard(demoData);

    }

}


/* =========================================================
   REFRESH
   ========================================================= */

elements.refreshBtn.addEventListener(
    "click",
    () => {

        elements.refreshBtn.textContent =
            "↻ Loading...";

        callAPI().finally(() => {

            elements.refreshBtn.textContent =
                "↻ Refresh";

        });

    }
);


/* =========================================================
   TRANSFORMER SELECTION
   ========================================================= */

elements.transformerSelect.addEventListener(
    "change",
    () => {

        const selected =
            elements.transformerSelect.value;

        console.log(
            "Selected transformer:",
            selected
        );

        /*
           At the moment the AI API uses the same
           demonstration sensor payload.

           Later we can connect this selector
           to your Supabase transformer/sensor tables.
        */

        callAPI();

    }
);


/* =========================================================
   INITIAL LOAD
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        updateDashboard(demoData);

        callAPI();

    }
);
