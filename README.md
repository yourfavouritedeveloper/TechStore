# TechStore

![TechStore](./Frontend/public/brand.png)

TechStore is a full-stack e-commerce web application focused on selling technology products such as mobile phones, laptops, and accessories.  
It features a modern React frontend with dynamic filtering and sorting, and a robust Spring Boot backend exposing REST APIs connected to a PostgreSQL database and Redis cache.  
The project is containerized with Docker for easy deployment and designed with JWT-based authentication for secure access.


## 🌐Live Deployment

[Visit TechStore Webpage](https://yourfavouritedeveloper.github.io/TechStore/)


## Table of Contents

- [Purpose](#purpose)
- [Features](#key-features)  
- [Tech Stack](#architecture-overview)  
- [Getting Started](#getting-started)  
  - [Prerequisites](#prerequisites)  
  - [Backend Setup](#backend-setup)  
  - [Frontend Setup](#frontend-setup)  
- [Running with Docker](#running-with-docker)  
- [Authentication and Security](#authentication-and-security)  
- [CORS Configuration](#cors-configuration)  
- [Project Structure](#project-structure)  
- [API Endpoints Reference](#api-endpoints-reference)




## Purpose

The primary goal of TechStore is to demonstrate how to build a full-featured e-commerce platform using contemporary technologies. It showcases:

- Efficient frontend state management and UI filtering techniques  
- Secure backend development with JWT authentication and role-based access control  
- Integration with PostgreSQL for persistent data storage and Redis for caching  
- Deployment best practices using Docker and cloud hosting services  

This project also serves as a portfolio piece for fullstack Java developers who want to demonstrate real-world skills.

## Key Features

- **User Authentication:** Register, login, and role-based access control using JWT tokens  
- **Product Catalog:** Browse products by categories such as mobile phones, laptops, and accessories  
- **Filtering & Sorting:** Dynamic client-side filters for price, date, popularity, and more  
- **Popular & Best-selling Products:** Separate sections highlighting trending and frequently purchased items  
- **Responsive Design:** Works seamlessly on desktops, tablets, and mobile devices  
- **RESTful API:** Backend exposing secure endpoints for product data, user management, and purchases  
- **Caching Layer:** Redis cache to improve response times for popular data  
- **Dockerized Setup:** Containerized backend and frontend for consistency across development and production  
- **Cloud Deployment:** Backend hosted on Render, frontend on GitHub Pages  


## Architecture Overview

- **Frontend:** React (with Vite), Axios for API calls, React Router for navigation, CSS modules for styling  
- **Backend:** Spring Boot (Java 21), Spring Security with JWT, PostgreSQL as the main database, Redis for caching  
- **Storage:** Product images and static resources served securely with proper access control  
- **Deployment:** Docker for containerization, automated CI/CD pipelines for builds and deployments  



## Tech Stack

| Layer        | Technology             |
|--------------|------------------------|
| Frontend     | React, Vite, Axios     |
| Backend      | Java 21, Spring Boot   |
| Database     | PostgreSQL             |
| Cache        | Redis                  |
| Authentication | JWT                   |
| Containerization | Docker               |
| Deployment   | Render (backend), GitHub Pages (frontend) |



## Getting Started

### Prerequisites

Before you start, make sure you have installed:

- [Java 21 JDK](https://adoptium.net/)
- [Gradle 8.5+](https://gradle.org/install/)
- [Node.js & npm](https://nodejs.org/) (or yarn)
- [Docker](https://www.docker.com/get-started) (optional but recommended)
- PostgreSQL database
- Redis server



## Backend Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourfavouritedeveloper/TechStore.git
   cd TechStore/backend
   ```

2. **Configure database and cache:**

    - Edit src/main/resources/application.yml (or application.properties) and update the PostgreSQL and Redis connection properties:

   ```yaml
   spring:
     datasource:
       url: jdbc:postgresql://localhost:5432/your_db_name
       username: your_username
       password: your_password
     redis:
       host: localhost
       port: 6379
   ```

3. **Build the backend:**

   ```bash
   ./gradlew build -x test
   ```

4. **Run the backend server:**

    -  Using Gradle:

   ```bash
   ./gradlew bootRun
   ```

    - Or run the JAR directly:
    ```bash
    java -jar build/libs/techstore.jar
    ```

    - The backend will start on http://localhost:8080/api/v1.



## Frontend Setup


1. **Navigate to the frontend folder:**
    ```bash
    cd ../frontend
    ```

2. **Install dependencies:**
    ```bash
    npm install
    ```

3. **Run the development server:**
    ```bash
    npm run dev
    ```   
    - The app will be available at http://localhost:5173.

4. **Build the production version:**
    ```bash
    npm run build
    ```

5. **Preview the production build locally:**
    ```bash
    npm run preview
    ```



## Running with Docker

### Backend

1. **Build the Docker image:**
    ```bash
    docker build -t techstore-backend .
    ```

2. **Run the container::**
    ```bash
    docker run -p 8080:8080 techstore-backend
    ```
   - Make sure your PostgreSQL and Redis instances are accessible or containerized as well.

### Frontend

   - You can serve the production build with any static file server. For example:


     ```bash
     npm run build
     npx serve dist
     ```

   - Or deploy the build folder to GitHub Pages or any static hosting.


## Troubleshooting

- **CORS Issues:** Make sure backend allows requests from your frontend origin

- **Authentication:** Some endpoints require JWT tokens; ensure login is performed

- **Image Loading:** Verify authentication settings allow public access to /images/** if used publicly

- **404 Errors:** Confirm static assets are correctly served and URLs are properly formed

## Authentication and Security
- JWT-based authentication secures backend endpoints.

- Public endpoints such as product listings and image resources have been configured to allow unauthenticated access.

- Make sure to add /images/** and /api/v1/products/** to your Spring Security permitAll() configuration to prevent unauthorized errors on static assets and product API calls.



## CORS Configuration

To enable your frontend app to consume backend APIs without CORS errors:

- Configure CORS in your Spring Boot backend to allow requests from your frontend domain(s), e.g.:

```java
@Bean
public WebMvcConfigurer corsConfigurer() {
    return new WebMvcConfigurer() {
        @Override
        public void addCorsMappings(CorsRegistry registry) {
            registry.addMapping("/api/**")
                    .allowedOrigins("http://localhost:5173", "https://yourfavouritedeveloper.github.io")
                    .allowedMethods("GET", "POST", "PUT", "DELETE");
        }
    };
}
```



## Project Structure

```bash
TechStore/
├── Backend/
│   ├── .gradle/
│   ├── .idea/
│   ├── build/
│   ├── gradle/
│   ├── uploads/
│   ├── .env
│   ├── .gitattributes
│   ├── .gitignore
│   ├── build.gradle
│   ├── docker-compose.yml
│   ├── Dockerfile
│   ├── gradlew
│   └── gradlew.bat
│
│   └── src/com/tech/store/
│       ├── config/
│       ├── controller/
│       ├── dao/
│       ├── exception/
│       ├── mapper/
│       ├── model/
│       ├── service/
│       └── util/
│
├── Frontend/
│   ├── dist/
│   ├── node_modules/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── Components/
│   │   │   ├── Background/
│   │   │   ├── Body/
│   │   │   ├── Footer/
│   │   │   ├── Items/
│   │   │   ├── Model/
│   │   │   ├── Nav/
│   │   │   └── Utils/
│   │   ├── Pages/
│   │   ├── App.*
│   │   ├── index.*
│   │   └── main.*
│   ├── .gitignore
│   ├── eslint.config
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   └── README.md

```


# API Endpoints Reference



## Account API

| Method | Endpoint                                 | Description                                              |
|--------|------------------------------------------|----------------------------------------------------------|
| GET    | `/api/v1/accounts/{id}`                   | Get account by ID                                        |
| GET    | `/api/v1/accounts/username/{username}`   | Get account by username                                  |
| GET    | `/api/v1/accounts/all`                    | Get all accounts                                        |
| POST   | `/api/v1/accounts/register`               | Register a new account                                  |
| POST   | `/api/v1/accounts/login`                  | Log in an account                                      |
| PUT    | `/api/v1/accounts/update/{id}`            | Update account details (partial updates via query params) |
| PUT    | `/api/v1/accounts/delete/{id}`            | Soft delete (close) an account                          |
| DELETE | `/api/v1/accounts/remove/{id}`            | Hard delete an account                                 |

---

## Product API

| Method | Endpoint                                  | Description                                              |
|--------|-------------------------------------------|----------------------------------------------------------|
| GET    | `/api/v1/products/{id}`                    | Get product by ID                                      |
| GET    | `/api/v1/products/all`                     | Get all products                                      |
| GET    | `/api/v1/products/popular`                 | Get top 5 most popular products                         |
| GET    | `/api/v1/products/bought`                  | Get top 5 most bought products                          |
| POST   | `/api/v1/products/create`                   | Create a new product                                  |
| PUT    | `/api/v1/products/update/{id}`              | Update product details (partial updates via query params) |
| PUT    | `/api/v1/products/delete/{id}`              | Soft delete (close) a product                          |
| DELETE | `/api/v1/products/remove/{id}`              | Hard delete a product                                 |

---

## Purchase API

| Method | Endpoint                                    | Description                                              |
|--------|---------------------------------------------|----------------------------------------------------------|
| GET    | `/api/v1/purchases/{id}`                     | Get purchase by ID                                     |
| GET    | `/api/v1/purchases/account/{id}`             | Get all purchases for a specific account                |
| GET    | `/api/v1/purchases/all`                      | Get all purchases                                      |
| POST   | `/api/v1/purchases/purchase/{accountId}`     | Make a purchase (with product IDs and amount as query params) |
| PUT    | `/api/v1/purchases/delete/{id}`              | Soft delete (close) a purchase                          |
| DELETE | `/api/v1/purchases/remove/{id}`              | Hard delete a purchase                                 |

---

### Notes

- **Soft delete** endpoints mark the resource as inactive or closed but keep it in the database.
- **Hard delete** endpoints permanently remove the resource.
- Update endpoints expect partial updates via **query parameters**.
- Purchase creation requires `productId` (list of IDs) and `amount` as **request parameters**.



## Conclusion

This API provides a robust foundation for managing users, products, and purchases within the TechStore application.  
With clear RESTful conventions and support for both soft and hard deletes, it ensures flexibility and data integrity.  

For any questions, feature requests, or contributions, please feel free to open an issue or submit a pull request.  
Happy coding! 
