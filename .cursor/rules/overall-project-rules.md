### Table of Contents
1. Key Principles
2. Code Formatting & Organization
3. General Project Organization
4. Frameworks, Language & Libraries
5. Polishing & Optimizing
6. Documentation Standards
7. TypeScript Guidelines
8. UI, React & Frontend Frameworks
9. Backend & API Development
10. Database & ORM
11. UI/UX Standards (DaisyUI)

---

## 1. Key Principles

- Always clarify goals and requirements before generating large code segments. Think first, code second. Outline plan steps before writing final code.
- Ask clarifying questions until you are 100% confident in undertaking new features or major changes, even after initially instructed.
- Clearly articulate reasoning before acting. Walk through your logic even for seemingly obvious steps when making significant changes.
- For small changes, you may proceed without extensive verification.
- Never add placeholders or TODOs for other developers.
- Maintain modularity, clarity, and consistency in all code.
- Be especially good at commenting code and updating documentation as you go.
- Favor small, scoped functions over monolithic code blocks.
- Minimize global variables and prefer scoped/local context.
- Catch and handle errors gracefully; never leave them unhandled.
- Make diffs as tiny as possible; prefer small, incremental changes.
- Consistency is vital—ensure uniformity across the codebase.
- Code must be concise, clear, readable, and technically accurate.
- Favor functional and declarative paradigms. Only use OOP or classes when they provide clear structural or reuse benefits.
- Prefer iteration and modularization over duplication.
- When generating or modifying code, ensure all related files and types are updated (e.g., imports, tests, docs).
- Tests (unit, integration, E2E) should be written when explicitly requested or planned. The default workflow does not require tests for every code change. Testing guidelines and organization will be provided as needed per project or feature.
---

## 2. Code Formatting & Organization

- Code should be easy to read and understand without requiring mental overhead.
- Follow consistent formatting using ESLint and Prettier.
- Use descriptive, semantic variable names with auxiliary verbs (e.g., `isLoading`, `hasError`).
- Use explicit naming conventions that indicate functionality.
- Use lowercase with dashes for directories and files (e.g., `components/auth-wizard`).
- Favor named exports for components.
- “Apply RORO for functions with multiple parameters or return values. For small, single-purpose utility functions, simple parameter lists are acceptable.”
- Apply DRY (Don't Repeat Yourself) principles at all times.
- API responses and internal error objects must use `{ error: true, message, code }` format.
- The code field in error objects should use HTTP status codes for API responses and custom error codes for internal logic as needed. When both are relevant, include both (e.g., code: 404, customCode: 'USER_NOT_FOUND').
- Log errors verbosely while allowing the app to continue when possible.

---

## 3. General Project Organization

- Maintain a clear directory structure that separates concerns (e.g., `components`, `services`, `tests`, `utils`).
- Regularly remove unused or deprecated files and dependencies.

---

## 4. Frameworks, Language & Libraries

- Prefer built-in features of the chosen language/framework over third-party libraries where possible.
- To request a new dependency, submit a rationale and usage plan for review before adding to the project. do
- Avoid deprecated functions or libraries.

---

## 5. Polishing & Optimizing

- When polishing or optimizing, aim for strong Web Vitals: LCP, CLS, FID.
- Web Vitals should be monitored using project-appropriate tools (e.g., Vercel Analytics, Lighthouse) and will be specified in project documentation if required.

---

## 6. Documentation Standards

- Avoid verbose or redundant comments; comments must add meaningful context.
- Clearly document setup instructions, including required environment variables and dependencies.
- Use Markdown syntax for all documentation and README files.
- Include inline documentation for complex logic.
- Document APIs, functions, and modules explicitly with type hints or parameter descriptions.
- Maintain an up-to-date `CHANGELOG.md` using conventional commit messages.
- Write descriptive commit messages that clearly explain changes.

---

## 7. TypeScript Guidelines

globs: ["**/*.ts", "**/*.tsx"]

- Avoid using the `any` type; use specific annotations.
- Prefer interfaces over type aliases for object shapes.
- Enforce strict type checking and explicit return types.
- Use generics for reusable and flexible code.

---

## 8. UI, React & Frontend Frameworks

Refer to `ui-standards.md` for UI/UX specifics.

**React Guidelines:**
- Logically componentize UI elements; maintain single responsibility per component.
- Use React hooks; avoid class components unless necessary.
- Prefer built-in state/hooks or well-supported state management libraries.
- Do NOT introduce new libraries or styling systems without permission.

---

## 9. Backend & API Development

globs: ["**/api/**/*", "**/server/**/*"]

- Structure API routes clearly and RESTfully.
- Use standard HTTP status codes accurately.
- Separate controllers, services, and models.
- Enforce consistent error handling and response formatting.

- All API responses must follow a consistent structure:
  - **On success:**
    ```json
    { "error": false, "data": ... }
    ```
    - `error`: Always `false` for successful responses.
    - `data`: The payload returned by the API (object, array, etc.).
  - **On error:**
    ```json
    { "error": true, "message": "Description of the error", "code": 400 }
    ```
    - `error`: Always `true` for error responses.
    - `message`: Human-readable error message.
    - `code`: HTTP status code and/or custom error code as appropriate.
    - Optionally, include additional fields (e.g., `customCode`) if needed for internal error handling.

  This structure ensures that clients can reliably check the `error` field to determine the outcome of any API call, simplifying error handling and response parsing.

---

## 10. Database & ORM

- Use migrations for schema changes.
- Define model relationships and enforce referential integrity.
- Prefer ORM/query builders over raw SQL. 
- Prisma is the default ORM. Database-specific conventions and migration documentation will be defined per project.
- Optimize queries and avoid N+1 issues.
