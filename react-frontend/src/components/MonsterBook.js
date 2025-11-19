import React, { useState, useEffect } from "react";
import { MONSTER_IMAGES, DEFAULT_MONSTER_IMAGE } from "../constants/monsterImages";
/* ---------------------------------------------------------------- */
/* 몬스터 도감 (localStorage 기반) */
/* ---------------------------------------------------------------- */
function MonsterBook() {
    const [monsters, setMonsters] = useState([]);
    const [sortType, setSortType] = useState("recent");
  
    useEffect(() => {
      const saved = localStorage.getItem("myMonsters");
      const list = saved ? JSON.parse(saved) : [];
      setMonsters(list);
    }, []);
  
  
    // 등급 정렬 우선순위
    const gradeOrder = { LEGENDARY: 4, EPIC: 3, RARE: 2, NORMAL: 1 };
  
    const sortMonsters = (list) => {
      switch (sortType) {
        case "grade":
          return [...list].sort(
            (a, b) => gradeOrder[b.grade] - gradeOrder[a.grade]
          );
        case "power":
          return [...list].sort((a, b) => b.power - a.power);
    
        case "recent":
        default:
          // 최신순 → id(시간) 내림차순
          return [...list].sort((a, b) => b.id - a.id);
      }
    };
    
  
    const sortedList = sortMonsters(monsters);
  
    const disassembleMonster = (monsterId) => {
      let monsters = JSON.parse(localStorage.getItem("myMonsters") || "[]");
      const monster = monsters.find((m) => m.id === monsterId);
      if (!monster) return;
    
      const grade = monster.grade;   // ★ 몬스터 등급 (COMMON, RARE 등)
    
      // 등급별 재료 관리
      let materials = JSON.parse(localStorage.getItem("materials") || "{}");
    
      // 없으면 초기화
      if (!materials[grade]) materials[grade] = 0;
    
      materials[grade] += 1; // ★ 등급 재료 1개 획득
    
      // 저장
      localStorage.setItem("materials", JSON.stringify(materials));
    
      // 몬스터 제거
      monsters = monsters.filter((m) => m.id !== monsterId);
      localStorage.setItem("myMonsters", JSON.stringify(monsters));
    
      setMonsters(monsters);
    
      alert(`${monster.name} 분해 → ${grade} 재료 1개 획득!`);
    };
    
  
    return (
      <div>
        <h1>📖 내 몬스터 도감</h1>
  
        {/* 정렬 선택 */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ marginRight: "10px" }}>정렬 :</label>
          <select value={sortType} onChange={(e) => setSortType(e.target.value)}>
            <option value="grade">⭐ 등급순</option>
            <option value="recent">📅 최신순</option>
            <option value="power">💥 공격력 높은순</option>
          </select>
        </div>
  
        {sortedList.length === 0 ? (
          <p>아직 몬스터가 없습니다.</p>
        ) : (
          <div className="monster-grid">
            {sortedList.map((m, idx) => (
              <div
                key={idx}
                className={`monster-card fade-in grade-${m.grade} ${
                  m.grade === "LEGENDARY" ? "legendary-glow" : ""
                }`}
              >
                <img
                  src={MONSTER_IMAGES[m.name] || DEFAULT_MONSTER_IMAGE}
                  alt={m.name}
                  style={{
                    width: "100px",
                    height: "100px",
                    marginBottom: "10px",
                  }}
                />
  
                <h3 className={`grade-${m.grade}`}>{m.name}</h3>
                <p>
                  등급: <span className={`grade-${m.grade}`}>{m.grade}</span>
                </p>
                <p>공격력: {m.power}</p>
                <button onClick={() => disassembleMonster(m.id)}>분해</button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  } //MonsterBook
  
  export default MonsterBook;