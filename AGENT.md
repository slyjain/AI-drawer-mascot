# Agent Guidelines & Working Rules

1. **User Control & Decisions:**
   - Do NOT assume or add tools, libraries, or configuration rules without asking first.
   - All architectural decisions must be approved by the user before documenting or creating.

2. **Workflow:**
   - Provide terminal commands one step at a time.
   - Do NOT execute or create files autonomously unless explicitly told.
   - Keep all code and configuration as minimal as possible (no boilerplate or extras upfront).

3. **Core Tech Stack:**
   - Backend: Java 17 + Spring Boot + Maven.
   - Real-time: Java 17 + Spring Boot (STOMP WebSocket).
   - Frontend: React + Vite + TypeScript.
   - No external infrastructure (Redis, Docker, databases, common libraries) until explicitly requested.

# Tesseract - agent navigation index
**IMPORTANT:** To understand the architecture, infrastructure, or any deep technical details of this codebase, you MUST read `docs/INDEX.md` first. It is the central hub where the entire codebase is documented.
##  Repo Overview
Maven based java monorepo + frontend platform for the Tesseract platform
- **Language** : JAVA 17
- **Build** :  Maven 3.x 
-  **Communication** : REST API for frontend and GRPC for microservices talking
-  **Database** : PostgresSql
- **Workflow** : 
---
## Services 
| Name            | Purpose                             |
|-----------------|-------------------------------------|
| Primary-backend | Primary backend to talk to frontend |
---


## Package Structure (per service)

```
io.hevo.<service>/
├── <Service>Application.java     # Entry point
├── service/                      # gRPC service implementations
├── repository/                   # MongoDB data access
│   └── models/                   # DB document models
├── clients/                      # External service clients
├── config/                       # Configuration classes/records
├── models/                       # Domain models
├── utils/                        # Utilities
├── exceptions/                   # Custom exception hierarchy
└── handlers/                     # Event/request handlers
```

---

## File Layout (per service directory)

```
<service>/
├── src/main/java/...
├── src/test/java/...             # Mirrors main structure
├── src/test/resources/           # Test configs and fixtures
├── non_sensitive_config.yml      # Non-secret runtime config
├── local_sensitive_config.json   # Local secrets (gitignored)
├── pom.xml
├── Dockerfile                    # Production image
├── local.Dockerfile              # Dev image
├── docker-compose.local.yml      # Local dev compose
└── README.md
```

---

## Naming Conventions

| Pattern                 | Meaning                               |
|-------------------------|---------------------------------------|
| `*Service`              | gRPC service implementation           |
| `*Manager`              | Business logic coordinator            |
| `*Repository` / `*Repo` | Data access object                    |
| `*Handler`              | Event or request handler              |
| `*Client`               | External service client               |
| `*Config`               | Configuration (often a Java `record`) |
| `*Factory`              | Factory pattern                       |
| `*Impl`                 | Implementation class                  |
| `mark*`                 | State transition methods              |
| `trigger*`              | Action initiation                     |
| `report*`               | Reporting/audit logging               |

---
