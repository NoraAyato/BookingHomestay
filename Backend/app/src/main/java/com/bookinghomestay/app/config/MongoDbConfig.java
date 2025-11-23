package com.bookinghomestay.app.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

/**
 * MongoDB configuration - only enabled when MongoDB is available
 */
@Configuration
@ConditionalOnProperty(name = "ai.mongodb.enabled", havingValue = "true", matchIfMissing = true)
@EnableMongoRepositories(basePackages = "com.bookinghomestay.app.infrastructure.persistence.repository.mongodb")
public class MongoDbConfig {
    // MongoDB will be auto-configured by Spring Boot when this condition is met
}