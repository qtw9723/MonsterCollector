package com.sangjun.demo.model;

import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;


@Repository
public class MemberRepository {
	
	private final JdbcTemplate jdbcTemplate;
	
	public MemberRepository(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}//constructor
	
	public List<Member> findAll(){
        return jdbcTemplate.query(
                "SELECT * FROM ERP2K_PWDS",
                (rs, rowNum) -> {
                    Member m = new Member();
                    m.setId(rs.getLong("C0010"));
                    m.setName(rs.getString("C0030"));
                    return m;
                }//query
            );//return
	}//findAll
	
	
}//class
