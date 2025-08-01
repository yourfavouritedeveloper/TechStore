FROM gradle:8.5-jdk21-alpine AS build

WORKDIR /home/app

COPY --chown=gradle:gradle . .

RUN gradle build -x test



FROM eclipse-temurin:21-jdk-alpine

WORKDIR /app

COPY --from=build /home/app/build/libs/techstore.jar app.jar

EXPOSE 8080

CMD ["java", "-jar", "app.jar"]
