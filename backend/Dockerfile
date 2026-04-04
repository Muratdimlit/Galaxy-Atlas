FROM eclipse-temurin:21-jdk

WORKDIR /app

COPY backend/.mvn .mvn
COPY backend/mvnw .
COPY backend/pom.xml .
RUN chmod +x mvnw

RUN ./mvnw dependency:go-offline

COPY backend/src src

RUN ./mvnw clean package -DskipTests

EXPOSE 8080

CMD ["sh", "-c", "java -jar target/*.jar"]