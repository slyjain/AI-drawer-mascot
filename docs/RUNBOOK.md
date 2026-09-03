# Tesseract Runbook

This guide contains the practical commands for running and testing the Tesseract application locally.

## 1. Start the Application Locally

We have automated the local setup to build, start, and time both the frontend and backend simultaneously. 

To start the whole application, run the following command from the root directory of the project:

```bash
./start-local.sh
```

**What it does:**
1. Checks for and installs Node.js dependencies (`npm install`) if missing.
2. Starts the Vite React frontend in the background and saves its Process ID.
3. Builds and starts the Spring Boot backend via Docker Compose in the background.
4. Records and prints the time each step took.
5. Streams the backend Docker logs to your terminal by default.

**Optional Flags:**
If you want the services to start in the background without streaming the logs to your terminal, you can use the `--no-logs` flag:
```bash
./start-local.sh --no-logs
```

## 2. Stop the Application Locally

To cleanly shut down both the React frontend and the Docker backend, run:

```bash
./stop-local.sh
```

**What it does:**
1. Finds the frontend process using the saved Process ID and safely kills it.
2. Runs `docker compose down` to stop and remove the backend containers.
3. Prints a timing summary of the teardown.
