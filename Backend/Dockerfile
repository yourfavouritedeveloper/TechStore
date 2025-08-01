FROM eclipse-temurin:21-jdk-alpine

WORKDIR /app

COPY build/libs/techstore.jar app.jar

EXPOSE 8080

CMD ["java", "-jar", "app.jar"]
