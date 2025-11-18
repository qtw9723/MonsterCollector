package com.sangjun.demo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
	@Override
	public void addCorsMappings(CorsRegistry registry) {
		registry.addMapping("/**")
			.allowedOrigins(
					"http://192.168.2.50:3000",
					"http://192.168.2.50:8081",
					"http://192.168.2.50:8082",
					"exp://192.168.2.50:8081",
					"http://localhost:3000",
					"http://localhost:8081",
					"https://monster-collector.vercel.app/"
					)
			.allowedMethods("GET", "POST", "PUT", "DELETE")
			.allowCredentials(true);
	}// addCorsMappings
}// class
