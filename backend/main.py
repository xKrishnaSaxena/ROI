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

app = FastAPI(title="GenFox AI ROI Calculator API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://roi-tua8.onrender.com", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- GENFOX CONTEXT ---
GENFOX_CONTEXT = """
## **1. Overall GenFox AI Context:**

GenFox  AI is an workforce platform that create “AI Employees” (like AI Data Analyst, AI HR) for enterprises that work inside existing enterprise tools and take over real operational responsibilities that today require full‑time humans. Unlike human employees who are limited by working hours, availability, and ramp‑up time, these AI Employees are always‑on, scale instantly, and don’t need re‑training when people leave.

These AI Employees are built on LLM-based agents with long‑term memory and self‑learning, so they understand context, make decisions, and get better at their job over time instead of forgetting past work at the end of each day. Where a human might forget past tickets or reports or repeat the same mistakes, an AI Employee turns every interaction into reusable knowledge that continuously improves quality and speed.

Each AI Employee is role‑based and tool‑native: it logs into tools through secure APIs and executes the same workflows a human would. For example, it integrates with business intelligence tools such as Tableau and Power BI; HR platforms like Workday, greytHR, or SAP SuccessFactors; customer relationship management (CRM) systems such as Salesforce or Microsoft Dynamics 365; core banking platforms like Temenos or Finastra; insurance claims and policy administration systems such as Guidewire or Duck Creek; email platforms including Microsoft Outlook and Gmail; and collaboration tools like Microsoft Teams and Slack.”.

Genfox AI also acts as an orchestration layer: it manages access control, memory, workflows, monitoring, and analytics for all AI Employees in one place, something that is hard to do consistently with a distributed human team. Organizations can start with a single role (for example, AI Data Analyst for reporting and ad‑hoc queries) and gradually add more AI Employees across departments, effectively adding new “digital hires” without increasing headcount, training time, or people‑management overhead.

Memory and self‑learning are core: every interaction, correction, and decision can be turned into reusable knowledge, so AI Employees stop repeating mistakes, adapt to each company’s policies, and maintain continuity even if human staff changes. Compared to humans—who can forget, move roles, or leave the company—GenFox AI Employees preserve and compound organizational knowledge, and for heavy usage GenFox supports self‑hosted LLMs to dramatically reduce token costs and keep sensitive data inside the customer’s infrastructure, improving both ROI and governance.

## 2.**Context specifically for ROI calculation:**

GenFox  AI workforce platform that creates "AI Employees" (AI Data Analyst, AI HR) designed to replace human roles by working inside the same enterprise tools via secure APIs. AI Employees run 24/7- 365days!, execute workflows at machine speed with lower error rates, and get smarter over time through long-term memory and self-learning.

## Key Metrics of GenFox AI

Use these metrics as core knowledge for understanding GenFox AI capabilities and use cases:

- **Always-on coverage vs human limitations**: Unlike humans restricted to 8 hours/day, 5 days/week with weekends, holidays, and leave (∼1,800 productive hours/year), one AI Employee provides seamless 24/7-365 days coverage across multiple shifts and time zones.
- **Consistency and speed vs human variability**: Unlike humans affected by fatigue, context switching, and performance fluctuations, AI Employees execute routine tasks (reports, tickets, approvals) instantly with perfect rule adherence and zero downtime.
- **Human buddy system for complex cases**: Each AI Employee is paired with a designated senior human "buddy" who provides assistance, reviews escalations, and handles judgment-intensive scenarios, ensuring seamless human-AI collaboration
- **Memory & self-learning**: Remembers all past work, company policies, and corrections; continuously improves efficiency by enabling faster queries and reducing repeated errors. This ongoing improvement through accumulated knowledge and adaptation leads to increased ROI over time, as the AI Employee becomes more productive and cost-effective while maintaining high quality and consistency.
- “Scalable orchestration: Handles cross-tool workflows end-to-end without handoffs. For example, it coordinates data and actions seamlessly across business intelligence tools like Tableau and Power BI; collaboration platforms like Microsoft Teams and Slack; HR management systems such as Workday or greytHR; CRM platforms like Salesforce or Microsoft Dynamics 365; and industry-specific core systems like Temenos for banking or Guidewire for insurance claims processing. This unified orchestration reduces manual handoffs, shortens process cycle times, and ensures consistent execution across diverse systems”.
- **Retained knowledge**: Organizational expertise compounds and stays with the platform.
- Additionally, GenFox recommends a self-hosted deployment option for Genfox AI to enable seamless integration with enterprise IT environments, enhance data security, and achieve effective cost control, particularly by lowering LLM token and infrastructure costs compared to cloud API usage. This self-hosted solution supports scalable, maintainable, and compliant operations to maximize ROI and organizational control.
"""

class UserInput(BaseModel):
    organization_industry: str
    company_size: str
    department: str
    current_tools: List[str]
    human_count: int
    seniority_level: Optional[str] = "Mid-Level"
    description: Optional[str] = ""
    turnover_rate: Optional[str] = "Moderate"
    monthly_task_volume: Optional[int] = 1000
    avg_task_duration_minutes: Optional[int] = 15
    decision_complexity: Optional[str] = "Balanced"

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
    print(f"Processing GenFox report for: {data.department}")

    prompt = f"""
   You are a highly analytical AI CFO for 'GenFox AI'. Your job is to generate a realistic ROI audit comparing a human team to GenFox AI Employees.

    --- GENFOX AI CONTEXT (USE THIS FOR ANALYSIS) ---
    {GENFOX_CONTEXT}

    --- INPUT DATA ---
    Industry: {data.organization_industry}
    Department: {data.department}
    Company Size: {data.company_size}
    Human Count: {data.human_count} Employees
    Tools Used: {", ".join(data.current_tools)}
    Task Volume: {data.monthly_task_volume} tasks/month
    Complexity: {data.decision_complexity}
    Turnover: {data.turnover_rate}
    
    *** USER OPERATIONAL CONTEXT / DESCRIPTION ***: 
    "{data.description}"

    --- CALCULATION LOGIC ---
    
    1. HUMAN COSTS:
       - Research 2024 avg base salary for {data.department} in {data.organization_industry}.
       - Add 25% burden for Benefits/Insurance.
       - Calculate "Recruiting & Training Waste": GenFox eliminates this, so for humans, calculate cost based on Turnover Rate (High turnover = 20% waste).

    2. GENFOX AI COSTS (Specific Logic):
       - Token Costs: Since GenFox offers SELF-HOSTED models, token costs are lower than public APIs. Estimate significantly lower than GPT-4o pricing (e.g., $1-$2/1M tokens effective cost).
       - Server/Hosting: Higher than standard agents because of self-hosting. Estimate $1000 - $3000 / month for the orchestration layer.
       - Maintenance: "Human-in-the-loop" buddy system. Add 10% of a human salary for supervision.
       - Implementation: $15k - $40k one-time setup.

    3. STRATEGIC ANALYSIS (Crucial):
       - In 'executive_summary':
         1. Specifically mention "GenFox AI Employees" and the benefit of "Memory & Self-Learning".
         2. CRITICAL: Analyze the 'USER OPERATIONAL CONTEXT' provided above. Identify specific workflow pain points, specific tool names mentioned in the text, or process bottlenecks described by the user and address how GenFox solves them directly in the summary.
       - In 'scalability_argument', mention the "Always-on 24/7 coverage" advantage.

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
        "executive_summary": "string (Focus on GenFox value + User Description context)",
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