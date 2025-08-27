# Deployment and Environment Planning

## 1. Overview

This document outlines the deployment strategy and environment planning for the Luna Web application. It defines the different environments, the CI/CD pipeline, and the approach to secrets management.

## 2. Environments

### 2.1. Development Environment

*   **Purpose:** Local development and testing by individual developers.
*   **Infrastructure:** Developer's local machine.
*   **Database:** SQLite (`dev.db` file) for simplicity and ease of setup.
*   **Configuration:** `.env.local` or `.env.development` files.
*   **Deployment:** Run locally using `npm run dev` or via Docker using `docker-compose.yml` with the `dev` profile (`docker-compose --profile dev up`).
*   **Access:** `http://localhost:3000`

### 2.2. Staging Environment

*   **Purpose:** Integration testing, QA validation, and pre-production testing. Mirrors production as closely as possible.
*   **Infrastructure:** Could be a dedicated server, cloud VM, or containerized environment (e.g., Docker Compose, Kubernetes).
*   **Database:** PostgreSQL, separate from production.
*   **Configuration:** `.env.staging` with staging-specific secrets and settings.
*   **Deployment:** Automated via CI/CD pipeline when changes are merged to the `develop` branch. Uses `docker-compose.staging.yml` or equivalent Kubernetes manifests.
*   **Access:** `https://staging.luna-app.com` (example URL)

### 2.3. Production Environment

*   **Purpose:** Live application serving end-users.
*   **Infrastructure:** A robust, scalable, and monitored setup. Based on `docker-compose.prod.yml`, this includes:
    *   Luna App (Next.js)
    *   PostgreSQL Database
    *   Redis Cache
    *   Nginx Reverse Proxy (for SSL termination and load balancing)
    *   Monitoring (Prometheus, Grafana)
    *   Logging (ELK Stack: Elasticsearch, Logstash, Kibana)
*   **Database:** PostgreSQL, the primary data store.
*   **Configuration:** `.env.production` with production secrets.
*   **Deployment:** Automated via CI/CD pipeline when changes are merged to the `main` branch or when a release is published. Uses `docker-compose.prod.yml` or equivalent Kubernetes manifests.
*   **Access:** `https://luna-app.com` (example URL)

## 3. CI/CD Pipeline

The CI/CD pipeline is implemented using GitHub Actions, as defined in `.github/workflows/ci-cd.yml`.

### 3.1. Pipeline Stages

1.  **Security Scanning:**
    *   Runs on `push` to `main`/`develop` and `pull_request` to `main`.
    *   Performs Snyk scans, OWASP ZAP scans, and `npm audit` for vulnerabilities.
2.  **Quality & Testing:**
    *   Runs after security scanning.
    *   Checks out code, sets up Node.js, installs dependencies.
    *   Runs ESLint for code style, TypeScript type checking.
    *   Executes unit tests (`npm run test:unit`), integration tests (`npm run test:integration`), E2E tests (`npm run test:e2e`), accessibility tests, and performance tests.
    *   Uploads test results and coverage reports.
3.  **Build & Package:**
    *   Runs after quality & testing.
    *   Checks out code, sets up Node.js, installs dependencies.
    *   Sets up environment variables.
    *   Runs database migrations and generates Prisma client.
    *   Builds the Next.js application.
    *   Runs Lighthouse CI for performance benchmarking.
    *   Uploads build artifacts.
4.  **Docker Image Build:**
    *   Runs after the build stage.
    *   Uses Docker Buildx to build the application image.
    *   Pushes the image to GitHub Container Registry (GHCR).
5.  **Staging Deployment:**
    *   Triggers only for the `develop` branch.
    *   Deploys the built Docker image to the staging environment.
    *   Runs health checks and smoke tests.
    *   Sends notification upon completion.
6.  **Production Deployment:**
    *   Triggers only for the `main` branch, after staging deployment.
    *   Deploys the built Docker image to the production environment.
    *   Runs production health checks and smoke tests.
    *   Sets up monitoring.
    *   Sends notification upon completion.
7.  **Documentation Update:**
    *   Triggers only for the `main` branch, after production deployment.
    *   Updates and commits documentation changes.
8.  **Performance Monitoring:**
    *   Triggers only for the `main` branch, after production deployment.
    *   Runs performance tests and uploads results.
9.  **Security Compliance:**
    *   Triggers only for the `main` branch, after production deployment.
    *   Runs checks for HIPAA, GDPR, and accessibility compliance.
10. **Crisis Intervention Validation:**
    *   Triggers only for the `main` branch, after production deployment.
    *   Validates crisis intervention functionality and response times.
11. **Final Validation:**
    *   Runs after Performance Monitoring, Security Compliance, and Crisis Validation.
    *   Performs a final comprehensive validation and generates a deployment report.

### 3.2. Pipeline Triggers

*   **Continuous Integration (CI):** Triggered on every `push` to `main` or `develop` branches, and on `pull_request` to `main`.
*   **Continuous Deployment (CD):** Triggered on `push` to `main` (deploys to production) and `develop` (deploys to staging).

## 4. Secrets Management

Managing secrets securely is crucial for the application's security.

### 4.1. Local Development

*   **Method:** Use `.env` files (`.env.local`, `.env.development`).
*   **Storage:** These files are listed in `.gitignore` and are never committed to the repository.
*   **Example:**
    ```
    JWT_SECRET=my_secret_key
    OPENAI_API_KEY=sk-...
    DATABASE_URL=file:./dev.db
    ```

### 4.2. CI/CD Pipeline

*   **Method:** Use GitHub Secrets.
*   **Storage:** Secrets are stored encrypted in GitHub's infrastructure.
*   **Usage:** Secrets are referenced in the workflow file using `${{ secrets.SECRET_NAME }}`.
*   **Examples:**
    *   `SNYK_TOKEN`
    *   `NEXT_PUBLIC_APP_URL`
    *   `DB_PASSWORD` (for staging/production database)
    *   `REDIS_PASSWORD`
    *   `GRAFANA_PASSWORD`

### 4.3. Production/Staging Environments (Docker Compose)

*   **Method:** Use `.env` files (`.env.staging`, `.env.production`) that are not committed to the repository.
*   **Storage:** These files are stored securely on the production/staging servers or in a secure vault that is accessed during deployment.
*   **Docker Compose Integration:** Docker Compose automatically reads from the `.env` file in the same directory.
*   **Example (`.env.production`):**
    ```
    DB_PASSWORD=secure_db_password
    JWT_SECRET=super_secret_jwt_key
    OPENAI_API_KEY=sk-...
    REDIS_PASSWORD=secure_redis_password
    GRAFANA_PASSWORD=admin_password
    ```

### 4.4. Advanced Secrets Management (Future Consideration)

For more complex deployments or higher security requirements, consider:
*   **HashiCorp Vault:** A tool for secrets management and data protection.
*   **AWS Secrets Manager / Azure Key Vault / GCP Secret Manager:** Cloud provider specific solutions.
*   **Kubernetes Secrets:** If deploying to a Kubernetes cluster.

The current setup with `.env` files and GitHub Secrets is appropriate for the Docker Compose-based deployment strategy.

This plan provides a clear structure for managing different environments, automating deployments, and handling secrets securely.