import os
from fastapi import FastAPI,Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
import joblib
import pandas as pd



app = FastAPI(
    title="GridGuard AI Twin API",
    version="1.0"
)


# =========================================================
# PATHS
# =========================================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
app.mount("/static",StaticFiles(directory=os.path.join(Base_DIR,"static")),name="static")

          


MODEL_PATH = os.path.join(
    BASE_DIR,
    "transformer_ai_model.pkl"
)


INDEX_PATH = os.path.join(
    BASE_DIR,
    "templates",
    "index.html"
)


# =========================================================
# LOAD AI MODEL
# =========================================================

model = joblib.load(MODEL_PATH)


# =========================================================
# INPUT DATA
# =========================================================

class TransformerData(BaseModel):

    temperature: float
    voltage: float
    current: float
    load: float
    vibration: float
    humidity: float
    oil_temperature: float


# =========================================================
# HEALTH SCORE
# =========================================================

def calculate_health_score(
    temperature,
    load,
    vibration,
    oil_temperature
):

    # Temperature score

    if temperature <= 55:
        temperature_score = 100

    elif temperature <= 70:
        temperature_score = 75

    elif temperature <= 80:
        temperature_score = 50

    else:
        temperature_score = 20


    # Load score

    if load <= 60:
        load_score = 100

    elif load <= 75:
        load_score = 75

    elif load <= 90:
        load_score = 50

    else:
        load_score = 20


    # Vibration score

    if vibration <= 2.5:
        vibration_score = 100

    elif vibration <= 4:
        vibration_score = 75

    elif vibration <= 6:
        vibration_score = 50

    else:
        vibration_score = 20


    # Oil temperature score

    if oil_temperature <= 60:
        oil_score = 100

    elif oil_temperature <= 70:
        oil_score = 75

    elif oil_temperature <= 85:
        oil_score = 50

    else:
        oil_score = 20


    # Weighted score

    health_score = (

        temperature_score * 0.30 +

        load_score * 0.25 +

        vibration_score * 0.20 +

        oil_score * 0.25

    )


    return health_score


# =========================================================
# AI ANALYSIS
# =========================================================

def get_complete_ai_result(

    temperature,
    voltage,
    current,
    load,
    vibration,
    humidity,
    oil_temperature

):

    transformer = pd.DataFrame({

        "temperature": [temperature],

        "voltage": [voltage],

        "current": [current],

        "load": [load],

        "vibration": [vibration],

        "humidity": [humidity],

        "oil_temperature": [oil_temperature]

    })


    # AI prediction

    prediction = model.predict(
        transformer
    )[0]


    # AI confidence

    probabilities = model.predict_proba(
        transformer
    )[0]


    classes = model.classes_


    predicted_index = list(
        classes
    ).index(prediction)


    confidence = (
        probabilities[predicted_index]
        * 100
    )


    # Health score

    health_score = calculate_health_score(

        temperature,

        load,

        vibration,

        oil_temperature

    )


    # Risk level

    if health_score >= 70:

        risk_level = "LOW"

    elif health_score >= 40:

        risk_level = "MEDIUM"

    else:

        risk_level = "HIGH"


    # Reasons

    reasons = []


    if temperature >= 80:

        reasons.append(
            "Temperature is significantly elevated."
        )

    elif temperature >= 65:

        reasons.append(
            "Temperature is moderately elevated."
        )


    if load >= 90:

        reasons.append(
            "Transformer load is very high."
        )

    elif load >= 75:

        reasons.append(
            "Transformer load is above normal."
        )


    if vibration >= 6:

        reasons.append(
            "Vibration level is significantly elevated."
        )

    elif vibration >= 4:

        reasons.append(
            "Vibration level is moderately elevated."
        )


    if oil_temperature >= 85:

        reasons.append(
            "Oil temperature is significantly elevated."
        )

    elif oil_temperature >= 70:

        reasons.append(
            "Oil temperature is moderately elevated."
        )


    # Recommendation

    if prediction == "Critical":

        recommendation = (

            "Inspect the transformer promptly and "
            "investigate the high temperature, "
            "loading, vibration, and cooling conditions."

        )


    elif prediction == "Warning":

        recommendation = (

            "Continue monitoring the transformer and "
            "check whether temperature, load, or "
            "vibration continues to increase."

        )


    else:

        recommendation = (

            "Transformer is operating within the "
            "expected range. Continue normal monitoring."

        )


    return {

        "status": str(prediction),

        "confidence": round(
            float(confidence),
            2
        ),

        "health_score": round(
            float(health_score),
            2
        ),

        "risk_level": risk_level,

        "reasons": reasons,

        "recommendation": recommendation

    }


# =========================================================
# API ROUTES
# =========================================================

@app.get("/")
def home():

    return {

        FileResponse(INDEX_PATH)

    }


# =========================================================
# DASHBOARD
# =========================================================

@app.get("/dashboard")
def dashboard():

    return FileResponse(
        INDEX_PATH
    )


# =========================================================
# AI PREDICTION
# =========================================================

@app.post("/predict")
def predict(
    data: TransformerData
):

    return get_complete_ai_result(

        temperature=data.temperature,

        voltage=data.voltage,

        current=data.current,

        load=data.load,

        vibration=data.vibration,

        humidity=data.humidity,

        oil_temperature=data.oil_temperature

    )


# =========================================================
# STATIC FILES
# =========================================================
#
# These serve:
#
# /static/script.js
# /static/style.css
#
# We will also keep the direct routes below.
# =========================================================

@app.get("/script.js")
def javascript():

    return FileResponse(
        os.path.join(BASE_DIR,"static","script.js"),
        media_type="application/javascript"
    )


@app.get("/style.css")
def stylesheet():

    return FileResponse(
        os.path.join(BASE_DIR,"static","style.css"),
        media_type="text/css"
    )
