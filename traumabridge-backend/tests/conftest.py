"""TraumaBridge AI — pytest conftest"""
import os
import pytest

# Set test environment before any app imports
os.environ.setdefault("ENVIRONMENT", "test")
os.environ.setdefault("SECRET_KEY", "test-secret-key-for-traumabridge-32char!")
os.environ.setdefault("DATABASE_URL", "postgresql+asyncpg://test:test@localhost:5432/tba_test")
os.environ.setdefault("REDIS_URL", "redis://localhost:6379/1")
os.environ.setdefault("GROQ_API_KEY", "gsk_test_key")
os.environ.setdefault("ABDM_MOCK", "true")
