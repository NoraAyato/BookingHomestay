package com.bookinghomestay.app;

import com.bookinghomestay.app.application.homestay.indexing.HomestayIndexingService;
import com.bookinghomestay.app.application.location.indexing.LocationIndexingService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.elasticsearch.repository.config.EnableElasticsearchRepositories;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

import lombok.RequiredArgsConstructor;

import jakarta.annotation.PostConstruct;
import java.util.TimeZone;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.bookinghomestay.app.infrastructure.persistence.repository.jpa")
@EnableElasticsearchRepositories(basePackages = "com.bookinghomestay.app.infrastructure.elasticsearch.repository")
@EntityScan(basePackages = "com.bookinghomestay.app.domain.model")
@RequiredArgsConstructor
public class AppApplication implements CommandLineRunner {

	private final HomestayIndexingService homestayIndexingService;
	private final LocationIndexingService locationIndexingService;

	@PostConstruct
	public void init() {
		// Set timezone to Vietnam (UTC+7)
		TimeZone.setDefault(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
	}

	public static void main(String[] args) {
		SpringApplication.run(AppApplication.class, args);
	}

	@Override
	public void run(String... args) {
		homestayIndexingService.indexAllHomestayToES();
		System.out.println("✅ Đã index toàn bộ homestay vào Elasticsearch");

		locationIndexingService.indexAllLocationsToES();
		System.out.println("✅ Đã index toàn bộ khu vực vào Elasticsearch");
	}
}
