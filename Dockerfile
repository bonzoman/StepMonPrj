# 1단계: 빌드 스테이지
FROM maven:3.9.6-eclipse-temurin-21-jammy AS build
WORKDIR /home/app
COPY src /home/app/src
COPY pom.xml /home/app
COPY keys /home/app/keys
RUN mvn -f /home/app/pom.xml clean package -DskipTests

# 2단계: 실행 스테이지 (경량화 JRE)
FROM eclipse-temurin:21-jre-jammy
COPY --from=build /home/app/target/*.jar app.jar
COPY --from=build /home/app/keys /keys

# JVM 옵션 및 운영 프로필 설정
ENTRYPOINT ["java", "-XX:+UseZGC", "-Xmx512m", "-Dspring.profiles.active=prod", "-jar", "/app.jar"]
