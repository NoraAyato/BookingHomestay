package com.bookinghomestay.app.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Configuration for AI services
 */
@Configuration
@EnableAsync
@EnableScheduling
public class AiConfig {
    // Configuration will be handled by @Value annotations in service classes
}