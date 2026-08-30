# This file contains all the decisions made while doing the Project
1. Turborepo or Monorepo?
=> I have made a project named Mindpalace-AI with turborepo architecture and did wanted to try the monorepo so going with JAVA+react monorepo architectire
2. Why JAVA? Becuase it is used in office and would like to get more information anbout thAT 
3. whY REACT? bECAUSE i ONLY KNOW REACT

## Architecture & Structural Decisions

### 4. Monorepo Organization (`apps/` layout)
- **Decision:** Split runnable applications into `apps/` (`backend`, `websocket`, `frontend`).
- **Why:** Keeps deployable microservices cleanly separated and allows adding shared libraries in `packages/` only when needed.

### 5. Build System (Maven Multi-Module + Root NPM)
- **Decision:** Use standard root Maven `pom.xml` (`trello-parent`) with `<modules>` for Java compilation, and root `package.json` with `concurrently` for running dev servers.
- **Why:** Avoids wrapping Maven inside JS tools like Turborepo, leveraging Java's native multi-module capabilities directly.

### 6. Microservice Separation (REST vs. WebSocket)
- **Decision:** Separate Java REST API (`backend` on port `8080`) from Java WebSocket service (`websocket` on port `8081`).
- **Why:** Isolates persistent, long-lived WebSocket connections from transactional HTTP database requests for independent scaling and stability.

### 7. WebSocket Protocol (STOMP over SockJS)
- **Decision:** Use Spring Boot's built-in STOMP message broker (`/ws` endpoint, `/topic` broker).
- **Why:** Provides standard pub/sub routing, rooms, and messaging channels without reinventing custom framing over raw WebSockets.

### 8. Infrastructure Strategy (Minimal First)
- **Decision:** Keep development lightweight with zero external container dependencies (no Redis or shared DTO libraries upfront).
- **Why:** Build the foundational application logic first; add external message brokers or shared modules only when necessary.

### 9. Unified Single `.env` Architecture
- **Decision:** Maintain a single `.env` (and `.env.example`) at the monorepo root.
- **Why:** Avoids scattered duplicate `.env` files across subfolders.
  - **Frontend:** Reads root `.env` via Vite's `envDir: '../../'`.
  - **Java Backend & WebSocket:** Loaded via `dotenv-cli` into OS environment variables and injected via Spring's `${VAR_NAME}` in `application.properties`.
  - **Database:** Directly connects to Cloud PostgreSQL (Aiven) over SSL using `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`.

