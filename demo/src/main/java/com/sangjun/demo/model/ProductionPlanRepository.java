package com.sangjun.demo.model;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;

@Repository
public class ProductionPlanRepository {

	private final JdbcTemplate jdbcTemplate;

	public ProductionPlanRepository(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}// constructor

	public List<ProductionPlan> FindProductionPlan(int year,int month) {
		YearMonth ym = YearMonth.of(year, month);
		int daysInMonth = ym.lengthOfMonth(); // 10월이면 31, 2월이면 28 또는 29
		 String monthStr = String.format("%04d%02d", year, month);
		StringBuilder sql = new StringBuilder();
		sql.append("SELECT C.C0020, B.C0050, D.C0510,");
		// 기준 월 (예: 2025년 10월)
		String baseMonth = monthStr;

		for (int day = 1; day <= daysInMonth; day++) {
			String dayStr = String.format("%s%02d", baseMonth, day);
			String alias = String.format("D%02d", day);
			sql.append(String.format(" SUM(DECODE(B.C0010, '%s', NVL(B.C0070, 0), 0)) AS %s,", dayStr, alias));
		}//FOR

		// 마지막 쉼표 제거
		sql.setLength(sql.length() - 1);

		sql.append(" FROM SLDM_T1110 A, SLDM_T1310 B, ");
		sql.append(" (SELECT C0030, C0020, C0040 FROM CMCD_T5141 WHERE C0010='0G') C, CMCD_T5110 D ");
		sql.append(" WHERE A.C0010=B.C0010 AND A.C0020=B.C0020 ");
		sql.append(" AND B.C0050=D.C0010 AND D.C0350=C.C0030(+) ");
		sql.append(" AND B.C0010 BETWEEN '").append(baseMonth).append("01' AND '").append(baseMonth).append(daysInMonth)
				.append("' ");
		sql.append(" AND A.C0060='02' ");
		sql.append(" GROUP BY C.C0020, B.C0050, D.C0510, C.C0040 ");
		sql.append(" ORDER BY C.C0040, C.C0020, D.C0510, B.C0050");

		return jdbcTemplate.query(sql.toString(), (rs, rownum) -> {
			ProductionPlan p = new ProductionPlan();
			p.setItemType(rs.getString("C0020"));
			p.setItemCode(rs.getString("C0050"));
			List<String> temp = new ArrayList<>();
			for(int i = 1;i<=daysInMonth;i++) {
				temp.add(rs.getString(String.format("D%02d", i)));
			}//for
			p.setQty(temp);
			return p;
		});// return


	}// FindProductionPlan
}// class
