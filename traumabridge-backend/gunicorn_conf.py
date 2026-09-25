"""
TraumaBridge AI — Gunicorn / UvicornWorker Configuration
Run: gunicorn app.main:app -c gunicorn_conf.py
"""
import multiprocessing

bind = "0.0.0.0:8000"
workers = multiprocessing.cpu_count() * 2 + 1
worker_class = "uvicorn.workers.UvicornWorker"
timeout = 120
keepalive = 5
max_requests = 10_000
max_requests_jitter = 1_000
preload_app = True
accesslog = "-"
errorlog = "-"
loglevel = "info"
forwarded_allow_ips = "*"
