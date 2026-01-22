# docker-monitoring-agent

Stack de monitoreo para una app Node.js con métricas Prometheus y dashboards en Grafana.

## Requisitos
- Docker Desktop (con WSL2)
- Docker Compose v2
- Node.js (solo si ejecutas local fuera de Docker)

## Levantar stack completo
```bash
docker compose -f docker-compose.monitoring.yml up -d --build
docker compose -f docker-compose.monitoring.yml ps