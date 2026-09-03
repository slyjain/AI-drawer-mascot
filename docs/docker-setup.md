# Docker Multi-Module Setup Guide

This is a multi-stage Dockerfile. Its purpose is to:

1. Build your Spring Boot application using Maven
2. Take only the final .jar file
3. Run it inside a smaller, lightweight Java container

Let's break it down visually.

## The Big Picture

Your project probably looks something like:

```text
project/
│
├── pom.xml                  ← Parent Maven configuration
│
├── primary-backend/
│   ├── pom.xml
│   └── src/
│       └── main/
│           └── java/
│
└── Dockerfile
```

The Dockerfile does this:

```text
Your Source Code
       │
       ▼
┌─────────────────────┐
│ Stage 1             │
│ Maven + JDK         │
│                     │
│ Compile Java Code   │
│ Run Maven Build     │
│ Create .jar         │
└──────────┬──────────┘
           │
           │ Copy only JAR
           ▼
┌─────────────────────┐
│ Stage 2             │
│ Lightweight JRE     │
│                     │
│ Run app.jar         │
└─────────────────────┘
```

### Stage 1: Build the Application
`FROM maven:3.9.6-eclipse-temurin-17 AS build`

This creates the first container environment. The image already contains:
- Linux
- Java 17 JDK
- Maven 3.9.6

Think of it as: "Give me a machine where I can compile my Java project."

`AS build`
We give this stage a name because later we want to copy files from this stage (`COPY --from=build ...`). So `build` is basically a temporary machine used for compilation.

### Working Directory
`WORKDIR /workspace`

Inside the Docker container, we create/use `/workspace`. Now all following commands execute relative to this directory.

Equivalent idea:
```bash
mkdir /workspace
cd /workspace
```

### Copy Parent pom.xml
`COPY pom.xml .`

This means: `COPY <source from your computer> <destination inside container>`
The `.` means current working directory. Since `WORKDIR /workspace`, the destination becomes `/workspace/pom.xml`.

### Copy the Backend Module
`COPY primary-backend/ primary-backend/`

This copies your entire backend folder. So now Docker has your complete Maven project.

### Build the Project
`RUN mvn -f pom.xml clean package -DskipTests`

This command executes inside the container. 

### Why is the `-f` flag used?

The `-f` (`--file`) flag tells Maven explicitly which `pom.xml` file to use for the build.

```bash
mvn -f pom.xml clean package -DskipTests
```

In this case, it ensures Maven uses the parent `pom.xml` to build the multi-module project.

**Mental model:**

```text
mvn clean package
→ "I'll look for pom.xml in my current directory."

mvn -f path/to/pom.xml clean package
→ "Use this specific pom.xml."
```

Other flags used:
- `clean`: Deletes old build files.
- `package`: Compile Java -> Run build lifecycle -> Create JAR.
- `-DskipTests`: Don't run tests for faster Docker builds.

After the build, we have `primary-backend/target/primary-backend-0.0.1-SNAPSHOT.jar` (your deployable application). 

The problem is this container has lots of unnecessary stuff (Maven, compiler, source code). We don't need those to run the application. We only need `app.jar`. That's why we create Stage 2.

---

### Stage 2: Run the Application
`FROM eclipse-temurin:17-jre-alpine`

This starts a new fresh container. Stage 2 does NOT automatically contain files from Stage 1.

**Why JRE instead of JDK?**
After compilation, to run a JAR, we only need JRE. This reduces image size.

**Why Alpine?**
Alpine is a very lightweight Linux distribution.

### Set Working Directory Again
`WORKDIR /app`

We are now inside a new container. `/app` becomes our current directory.

### The Most Important Line
`COPY --from=build /workspace/primary-backend/target/*.jar app.jar`

This is the magic of multi-stage builds.
- `--from=build`: Copy a file from the build stage (Stage 1).
- Source: `/workspace/primary-backend/target/*.jar`
- Destination: `app.jar`

Notice something important: We don't copy Source code, Maven, pom.xml, or intermediate files. We only copy the Final JAR.

### Expose Port
`EXPOSE 8080`

This tells Docker: This application intends to listen on port 8080. Important distinction: EXPOSE does not actually publish the port.

### Finally: Start the Application
`ENTRYPOINT ["java", "-jar", "app.jar"]`

This tells Docker: Whenever the container starts, execute this command.

---

# Docker Compose Setup

This is a Docker Compose file. Your previous Dockerfile explained how to build one container; this file explains how to configure and run that container.

### 1. Compose version
`version: '3.8'`
Specifies the Docker Compose file format version.

### 2. Services
`services:`
A service is basically a container/application that Docker Compose manages.

### 3. Service name
`primary-backend:`
The name you give to your backend service.

### 4. Build Configuration
`build:`
Tells Docker Compose to build an image first.

**Context**
`context: ./app-backend`
This is very important. The Docker build context determines which files Docker is allowed to see. You are telling Docker: "Treat app-backend as the root directory for this Docker build." 

### 5. Dockerfile Path
`dockerfile: primary-backend/local.Dockerfile`
Tells Docker: "Inside the build context, use this Dockerfile."
Context answers: Which files can Docker access?
Dockerfile answers: Which instructions should Docker use to build the image?

### 6. Ports
`ports:`
  `- "${BACKEND_PORT:-8080}:8080"`
Connects your computer's port with the container's port (`HOST_PORT : CONTAINER_PORT`). 
`${BACKEND_PORT:-8080}` means use `BACKEND_PORT` from environment variables; otherwise use 8080.

### 7. env_file
`env_file:`
  `- .env`
Tells Docker Compose: Load environment variables from the .env file and pass them into the running container.

## In one sentence
Your `docker-compose.yml` says: Build the Spring Boot backend using the Dockerfile inside primary-backend, give Docker access to the entire app-backend Maven project, expose the application on a configurable host port, load environment variables from .env, and run the resulting backend container.
