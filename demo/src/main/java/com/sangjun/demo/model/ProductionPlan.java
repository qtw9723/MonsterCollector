package com.sangjun.demo.model;

import java.util.List;

public class ProductionPlan {
	private String itemType,itemCode;
	private List<String> qty;
	
	
	//getter/setter
	public String getItemType() {
		return itemType;
	}
	public void setItemType(String itemType) {
		this.itemType = itemType;
	}
	public String getItemCode() {
		return itemCode;
	}
	public void setItemCode(String itemCode) {
		this.itemCode = itemCode;
	}
	public List<String> getQty() {
		return qty;
	}
	public void setQty(List<String> qty) {
		this.qty = qty;
	}
	
	
}//class
