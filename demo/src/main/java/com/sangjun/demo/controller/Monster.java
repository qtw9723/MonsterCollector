package com.sangjun.demo.controller;

public class Monster {
    private String name;
    private MonsterGrade grade;
    private int power;

    public Monster() {}

    public Monster(String name, MonsterGrade grade, int power) {
        this.name = name;
        this.grade = grade;
        this.power = power;
    }

    public String getName() { return name; }
    public MonsterGrade getGrade() { return grade; }
    public int getPower() { return power; }

    public void setName(String name) { this.name = name; }
    public void setGrade(MonsterGrade grade) { this.grade = grade; }
    public void setPower(int power) { this.power = power; }
}
