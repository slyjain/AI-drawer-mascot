# Stage 1: Build the application using Maven
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /workspace

# Copy the parent pom.xml
COPY pom.xml .

# Copy the primary-backend module
COPY primary-backend/ primary-backend/

# Build the jar file (skipping tests for speed in local dev)
RUN mvn -f pom.xml clean package -DskipTests

# Stage 2: Run the application using a lightweight JRE
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy the built jar from the build stage
COPY --from=build /workspace/primary-backend/target/*.jar app.jar

# Expose the port the app runs on
EXPOSE 8080

# Command to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
