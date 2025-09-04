package com.bookinghomestay.app;

import com.bookinghomestay.app.application.homestay.indexing.HomestayIndexingService;
import com.bookinghomestay.app.application.location.indexing.LocationIndexingService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.elasticsearch.repository.config.EnableElasticsearchRepositories;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;

import lombok.RequiredArgsConstructor;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.bookinghomestay.app.infrastructure.persistence.repository", excludeFilters = @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, value = org.springframework.data.elasticsearch.repository.ElasticsearchRepository.class))
@EnableElasticsearchRepositories(basePackages = "com.bookinghomestay.app.infrastructure.elasticsearch.repository")
@EntityScan(basePackages = "com.bookinghomestay.app.domain.model")
@RequiredArgsConstructor
public class AppApplication implements CommandLineRunner {

	private final HomestayIndexingService homestayIndexingService;
	private final LocationIndexingService locationIndexingService;

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
