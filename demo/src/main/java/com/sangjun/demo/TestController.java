package com.sangjun.demo;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
@CrossOrigin(origins = "http://192.168.2.50:8081")
public class TestController {

	@GetMapping("/api/hello")
	public String hello() {
		return "Hello from Spring!";
	}//
}
