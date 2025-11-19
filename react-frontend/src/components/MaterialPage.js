import React, { useState, useEffect } from "react";
import axios from "axios";
import { MATERIAL_IMAGES, MATERIAL_GRADES } from "../constants/material";

function MaterialsPage() {
    const [materials, setMaterials] = useState({});
    const [loading, setLoading] = useState(false);

  
    // 항상 등급별 재료를 보여줌
    useEffect(() => {
      const saved = JSON.parse(localStorage.getItem("materials") || "{}");
  
      const fullList = {};
      MATERIAL_GRADES.forEach((grade) => {
        fullList[grade] = saved[grade] || 0;
      });
  
      setMaterials(fullList);
    }, []);
  
    const handleUseMaterial = async (grade) => {
      if (loading) return;
  
      if (!materials[grade] || materials[grade] < 10) {
        alert("재료가 10개 이상 필요합니다!");
        return;
      }
  
      setLoading(true);
  
      try {
        const res = await axios.get(
          `https://monstercollector-production.up.railway.app/material/spawn?materialGrade=${grade}`
        );
  
        const newMonster = res.data;
  
        // 몬스터 저장
        const savedMonsters = JSON.parse(localStorage.getItem("myMonsters") || "[]");
        savedMonsters.push({ ...newMonster, id: Date.now() });
        localStorage.setItem("myMonsters", JSON.stringify(savedMonsters));
  
        // 재료 차감
        const updated = {
          ...materials,
          [grade]: materials[grade] - 10,
        };
  
        setMaterials(updated);
        localStorage.setItem("materials", JSON.stringify(updated));
  
        alert(`${newMonster.grade} 등급 몬스터 ${newMonster.name} 획득!`);
      } catch (err) {
        console.error(err);
        alert("몬스터 소환 실패");
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <div style={{ padding: "20px" }}>
        <h1>재료 사용</h1>
  
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "15px",
            marginTop: "20px",
          }}
        >
          {Object.entries(materials).map(([grade, qty]) => {
            const img = MATERIAL_IMAGES[grade];
  
            return (
              <div
                key={grade}
                style={{
                  background: "#2b2b2b",
                  color: "white",
                  padding: "15px",
                  borderRadius: "12px",
                  textAlign: "center",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.25)",
                }}
              >
                {/* 이미지 */}
                <img
                  src={img}
                  alt={grade}
                  style={{
                    width: "70px",
                    height: "70px",
                    objectFit: "contain",
                    marginBottom: "10px",
                  }}
                />
  
                {/* 이름 */}
                <div style={{ fontSize: "16px", fontWeight: "bold" }}>
                  {grade} 재료
                </div>
  
                {/* 개수 */}
                <div style={{ margin: "8px 0 12px 0" }}>{qty}개</div>
  
                {/* 버튼 */}
                <button
                  disabled={loading || qty < 10}
                  onClick={() => handleUseMaterial(grade)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: "8px",
                    border: "none",
                    cursor: qty < 10 ? "not-allowed" : "pointer",
                    background: qty < 10 ? "#555" : "#4caf50",
                    color: "white",
                    fontSize: "14px",
                  }}
                >
                  재료 10개로 소환
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  
  export default MaterialsPage;