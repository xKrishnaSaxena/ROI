import os
import uvicorn
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=API_KEY)

app = FastAPI(title="Advanced AI vs Human ROI Calculator API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://roi-tua8.onrender.com","http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class UserInput(BaseModel):
    organization_industry: str
    company_size: str
    department: str
    current_tools: List[str]
    human_count: int
    seniority_level: Optional[str] = "Mid-Level"
    turnover_rate: Optional[str] = "Moderate"
    training_time: Optional[str] = "1 month"
    monthly_task_volume: Optional[int] = 1000
    avg_task_duration_minutes: Optional[int] = 15
    coverage_hours: Optional[str] = "Standard Business Hours"
    context_switching: Optional[str] = "Moderate"
    error_rate: Optional[str] = "Low"
    decision_complexity: Optional[str] = "Balanced"
    growth_projection: Optional[str] = "Steady"
    primary_bottleneck: Optional[str] = "Hiring"

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

@app.post("/calculate-roi", response_model=DetailedReport)
async def calculate_roi(data: UserInput):
    print(f"Processing detailed request for: {data.department}")

    prompt = f"""
    You are a skeptical, highly analytical CFO. Your job is to audit a proposal to replace/augment a human team with AI Agents.
    
    WARNING: Do NOT blindly favor AI. You must calculate realistic, granular costs.
    Most "AI ROI" calculators are scams because they ignore token costs, server costs, and maintenance. You must include them.

    --- INPUT DATA ---
    Industry: {data.organization_industry}
    Role: {data.department}
    Company Size: {data.company_size}
    Human Count: {data.human_count} Employees
    Tools Used: {", ".join(data.current_tools)}
    
    Workload Details:
    - Task Volume: {data.monthly_task_volume} tasks/month
    - Avg Duration: {data.avg_task_duration_minutes} minutes/task
    - Complexity: {data.decision_complexity}
    - Seniority: {data.seniority_level} (Affects Salary)
    - Turnover: {data.turnover_rate} (Affects Recruiting costs)

    --- CALCULATION LOGIC (Show in JSON) ---
    
    1. HUMAN COSTS:
       - Research 2024 avg base salary for {data.department} in {data.organization_industry}.
       - Add 25% burden for Benefits/Insurance.
       - Calculate "Recruiting & Training Waste" based on Turnover Rate (e.g., High turnover = 20% of salary wasted).
       - Tool Licensing: Est $100-$300/user/month depending on tools listed.

    2. AI COSTS (Be Realistic):
       - Token Costs: {data.monthly_task_volume} tasks * tokens_per_task * 12 months. (Assume complex tasks = 4k input / 1k output tokens). Use GPT-4o pricing tier ($5/1M tokens) as a baseline for high quality.
       - Server/Vector DB: Estimate $500 - $2000 / month for hosting enterprise-grade agents.
       - Maintenance: AI is not magic. It needs human supervision. Add 10-20% of a human salary for "Human-in-the-loop" auditing.
       - Implementation Fee: One-time setup (e.g., $10k - $50k based on complexity).

    3. OUTPUT FORMAT:
    Return strictly Valid JSON matching this schema:
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
        "salary_overhead": float, (Base Salary Only)
        "benefits_insurance": float, (The 25% burden)
        "recruiting_training_waste": float,
        "error_rework_cost": float,
        "tool_licensing_cost": float
      }},
      "ai_cost_breakdown": {{
        "llm_token_costs": float, (Annual)
        "server_hosting_costs": float, (Annual)
        "implementation_fee": float, (One time)
        "maintenance_cost": float (Annual human supervision)
      }},
      "strategic_analysis": {{
        "executive_summary": "string (max 2 sentences)",
        "bottleneck_solution": "string",
        "scalability_argument": "string"
      }},
      "confidence_score": "High" or "Medium",
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