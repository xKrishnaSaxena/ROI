import os
import uvicorn
from datetime import datetime, timedelta
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel,EmailStr,Field
from typing import List, Optional
from pymongo import MongoClient
from google import genai
from google.genai import types
from dotenv import load_dotenv
from passlib.context import CryptContext
from jose import JWTError, jwt
load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017") 
SECRET_KEY = os.getenv("SECRET_KEY", "supersecretkey") 
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7 
client = genai.Client(api_key=API_KEY)
mongo_client = MongoClient(MONGO_URI)
db = mongo_client["genfox_db"]
users_collection = db["users"]
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
app = FastAPI(title="GenFox AI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://roi-tua8.onrender.com", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GENFOX_CONTEXT = """
## **1. Overall GenFox AI Context:**
GenFox AI is an workforce platform that create “AI Employees” (like AI Data Analyst, AI HR) for enterprises that work inside existing enterprise tools and take over real operational responsibilities that today require full‑time humans. Unlike human employees who are limited by working hours, availability, and ramp‑up time, these AI Employees are always‑on, scale instantly, and don’t need re‑training when people leave.

These AI Employees are built on LLM-based agents with long‑term memory and self‑learning, so they understand context, make decisions, and get better at their job over time instead of forgetting past work at the end of each day. 

Each AI Employee is role‑based and tool‑native: it logs into tools through secure APIs and executes the same workflows a human would (e.g., Salesforce, Jira, Workday).

## Key Metrics of GenFox AI:
- **Always-on coverage**: 24/7-365 days coverage.
- **Consistency**: Eliminates human fatigue/error.
- **Memory & self-learning**: Retains institutional knowledge.
- **Scalable orchestration**: Handles cross-tool workflows.
- **Self-Hosted LLM**: GenFox supports self-hosted deployment to drastically reduce token costs compared to public APIs.
"""

# --- AUTH MODELS ---
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None
    company_name: Optional[str] = None

class UserResponse(BaseModel):
    id: str = Field(alias="_id")
    email: EmailStr
    full_name: Optional[str] = None
    company_name: Optional[str] = None

class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict

# --- NEW MODELS FOR DEPARTMENT GENERATION ---
class DepartmentRequest(BaseModel):
    industry: str

class DepartmentList(BaseModel):
    departments: List[str]

# --- EXISTING MODELS ---
class UserInput(BaseModel):
    organization_industry: str
    company_size: str
    department: str
    current_tools: Optional[List[str]] = []
    human_count: int
    description: Optional[str] = ""
    seniority_level: Optional[str] = "Mid-Level Specialist"
    turnover_rate: Optional[str] = "Moderate"
    training_time: Optional[str] = "1 - 4 weeks"
    monthly_task_volume: Optional[int] = 2000
    avg_task_duration_minutes: Optional[int] = 20
    coverage_hours: Optional[str] = "Standard Business Hours"
    context_switching: Optional[str] = "Occasionally"
    error_rate: Optional[str] = "Low (1-3%)"
    decision_complexity: Optional[str] = "Balanced"
    growth_projection: Optional[str] = "Steady (10-20%)"
    primary_bottleneck: Optional[str] = "Hiring Speed"

class HumanCostBreakdown(BaseModel):
    salary_overhead: float
    benefits_insurance: float
    recruiting_training_waste: float
    error_rework_cost: float
    tool_licensing_cost: float

class AICostBreakdown(BaseModel):
    llm_token_costs: float
    server_hosting_costs: float
    implementation_fee: float
    maintenance_cost: float  

class ROIMetrics(BaseModel):
    total_human_annual_cost: float
    total_ai_annual_cost: float
    net_annual_savings: float
    break_even_months: float
    productivity_multiplier: float
    department_equivalent: float

class StrategicAnalysis(BaseModel):
    executive_summary: str
    bottleneck_solution: str
    scalability_argument: str

class DetailedReport(BaseModel):
    metrics: ROIMetrics
    human_cost_breakdown: HumanCostBreakdown
    ai_cost_breakdown: AICostBreakdown
    strategic_analysis: StrategicAnalysis
    confidence_score: str
    market_data_found: dict


def clean_json_text(text: str) -> str:
    text = text.strip()
    if text.startswith("```json"):
        text = text[7:]
    elif text.startswith("```"):
        text = text[3:]
    if text.endswith("```"):
        text = text[:-3]
    return text.strip()

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@app.post("/auth/signup", response_model=Token)
async def signup(user: UserCreate):
    # Check if user exists
    if users_collection.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    new_user = {
        "email": user.email,
        "hashed_password": hashed_password,
        "full_name": user.full_name,
        "company_name": user.company_name,
        "created_at": datetime.utcnow()
    }
    
    result = users_collection.insert_one(new_user)
    
    # Create Token immediately after signup
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    
    user_info = {
        "id": str(result.inserted_id),
        "email": user.email,
        "full_name": user.full_name,
        "company_name": user.company_name
    }

    return {"access_token": access_token, "token_type": "bearer", "user": user_info}

@app.post("/auth/login", response_model=Token)
async def login(user_data: UserCreate): # Using UserCreate schema for simplicity, but strictly should separate
    user = users_collection.find_one({"email": user_data.email})
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    if not verify_password(user_data.password, user["hashed_password"]):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["email"]}, expires_delta=access_token_expires
    )
    
    user_info = {
        "id": str(user["_id"]),
        "email": user["email"],
        "full_name": user.get("full_name"),
        "company_name": user.get("company_name")
    }

    return {"access_token": access_token, "token_type": "bearer", "user": user_info}

@app.post("/generate-departments", response_model=DepartmentList)
async def generate_departments(req: DepartmentRequest):
    print(f"Generating departments for: {req.industry}")
    prompt = f"""
    List 5 to 8 distinct, high-value operational departments or roles specifically for the '{req.industry}' industry. 
    Focus on roles that deal with data, software, or repetitive workflows (suitable for AI automation).
    
    Return ONLY a JSON object with a single key "departments" containing a list of strings.
    Example: {{ "departments": ["Customer Support", "Data Entry", "Supply Chain Logistics"] }}
    """
    
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json"
            )
        )
        return DepartmentList(**json.loads(clean_json_text(response.text)))
    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# --- EXISTING ENDPOINT: CALCULATE ROI ---
@app.post("/calculate-roi", response_model=DetailedReport)
async def calculate_roi(data: UserInput):
    print(f"Processing GenFox report for: {data.department}")
    
    prompt = f"""
    You are a highly analytical AI CFO for 'GenFox AI'. Your job is to generate a realistic ROI audit comparing a human team to GenFox AI Employees.
    - If you calculate or output any ROI percentage values, they MUST be between 0% and 100% (inclusive). Never output ROI values above 100%; adjust your calculations so the final ROI is capped at 100%.

    --- GENFOX AI CONTEXT ---
    {GENFOX_CONTEXT}

    --- INPUT DATA ---
    Industry: {data.organization_industry}
    Department: {data.department}
    Company Size: {data.company_size}
    Human Count: {data.human_count} Employees
    User Description/Tools: "{data.description}"

    --- SURVEY ANSWERS (USER PROVIDED) ---
    1. Seniority Level: {data.seniority_level}
    2. Turnover Rate: {data.turnover_rate}
    3. Training Ramp-up Time: {data.training_time}
    4. Task Volume: {data.monthly_task_volume} / month
    5. Avg Task Duration: {data.avg_task_duration_minutes} mins
    6. Current Coverage: {data.coverage_hours}
    7. Context Switching Freq: {data.context_switching}
    8. Error Rate: {data.error_rate}
    9. Decision Complexity: {data.decision_complexity}
    10. Growth Projection: {data.growth_projection}
    11. Primary Bottleneck: {data.primary_bottleneck}

    --- CALCULATION LOGIC ---
    
    1. HUMAN COSTS:
       - Research 2025 avg base salary for {data.seniority_level} {data.department} in {data.organization_industry}.
       - Add 25% burden for Benefits/Insurance.
       - Calculate "Recruiting & Training Waste": Use '{data.training_time}' to estimate lost productivity cost per new hire * '{data.turnover_rate}'.
       - Calculate "Error Rework Cost": Use '{data.error_rate}' to estimate wasted salary hours.

    2. GENFOX AI COSTS (Specific Logic):
       - Token Costs: Self-hosted optimization ($1-$2/1M tokens).
       - Server/Hosting: $1000 - $3000 / month.
       - Maintenance: Human-in-the-loop (10% of 1 salary).
       - Implementation: $15k - $40k one-time.

    3. STRATEGIC ANALYSIS (Crucial):
       - In 'executive_summary':
         1. Address the user's specific bottleneck: "{data.primary_bottleneck}".
         2. Explain how GenFox handles the coverage need: "{data.coverage_hours}".
         3. Mention how AI eliminates context switching costs: "{data.context_switching}".
       - In 'scalability_argument': 
         1. Address the projected growth: "{data.growth_projection}".
         2. Contrast human hiring lag with instant AI scaling.

    4. OUTPUT FORMAT (Strict JSON):
    {{
      "metrics": {{
        "total_human_annual_cost": float,
        "total_ai_annual_cost": float,
        "net_annual_savings": float,
        "break_even_months": float,
        "productivity_multiplier": float,
        "department_equivalent": float
      }},
      "human_cost_breakdown": {{
        "salary_overhead": float,
        "benefits_insurance": float,
        "recruiting_training_waste": float,
        "error_rework_cost": float,
        "tool_licensing_cost": float
      }},
      "ai_cost_breakdown": {{
        "llm_token_costs": float,
        "server_hosting_costs": float,
        "implementation_fee": float,
        "maintenance_cost": float
      }},
      "strategic_analysis": {{
        "executive_summary": "string",
        "bottleneck_solution": "string",
        "scalability_argument": "string"
      }},
      "confidence_score": "High",
      "market_data_found": {{
        "avg_salary": "string",
        "tool_pricing": "string"
      }}
    }}
    """

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json"
            )
        )

        raw_text = response.text
        cleaned_text = clean_json_text(raw_text)
        result_json = json.loads(cleaned_text)
        
        return DetailedReport(**result_json)

    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
