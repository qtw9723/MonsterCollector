package com.sangjun.demo.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sangjun.demo.model.Member;
import com.sangjun.demo.model.MemberRepository;

@RestController
@CrossOrigin(origins = "http://192.168.2.50:8081")
@RequestMapping("/api/members")
public class MemberController {
	private final MemberRepository memberRepository;

	public MemberController(MemberRepository memberRepository) {
		this.memberRepository = memberRepository;
	}// constructor

	@GetMapping
	public List<Member> getAllMembers() {
		return memberRepository.findAll();
	}// getAllMembers

}// class
