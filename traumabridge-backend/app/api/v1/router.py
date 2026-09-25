"""TraumaBridge AI — v1 API Router"""
from fastapi import APIRouter
from app.api.v1 import triage, anti_fraud, health

api_router = APIRouter()
api_router.include_router(triage.router,     prefix="/triage",    tags=["Triage"])
api_router.include_router(anti_fraud.router, prefix="/anti-fraud", tags=["Anti-Fraud"])
api_router.include_router(health.router,     prefix="/health",    tags=["Health"])
