package com.sangjun.demo.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sangjun.demo.model.ProductionPlan;
import com.sangjun.demo.model.ProductionPlanRepository;

@RestController
//@CrossOrigin(ordigins = "http://192.168.2.50:8081")
@RequestMapping("/api/plan")
public class ProductionPlanController {
	private final ProductionPlanRepository productionPlanRepository;
	
	public ProductionPlanController(ProductionPlanRepository productionPlanRepository) {
		this.productionPlanRepository = productionPlanRepository;
	}//constructor
	
	@GetMapping
	public List<ProductionPlan> getPlan(@RequestParam int year,@RequestParam int month){
		return productionPlanRepository.FindProductionPlan(year, month);
	}//getPlan
}//class
