import React, { useState, useEffect } from "react";

import { MONSTER_IMAGES, DEFAULT_MONSTER_IMAGE } from "../constants/monsterImages";
/* ---------------------------------------------------------------- */
/* 던전 화면 */
/* ---------------------------------------------------------------- */
function DungeonPage({ gold, setGold }) {
    const [myMonsters, setMyMonsters] = useState([]);
    const [dungeonMonsters, setDungeonMonsters] = useState([]); // 최대 5
    const MAX_DUNGEON = 5;
  
    // 내 몬스터 불러오기
    useEffect(() => {
      const saved = JSON.parse(localStorage.getItem("myMonsters") || "[]");
      setMyMonsters(saved);
    }, []);
  
    // 일정 시간마다 골드 수집
    useEffect(() => {
      const interval = setInterval(() => {
        if (dungeonMonsters.length === 0) return;
  
        // 총 공격력 합
        const totalPower = dungeonMonsters.reduce((sum, m) => sum + m.power, 0);
  
        // 수집 골드 = 공격력 * 랜덤 계수 (0.8~1.2)
        const collected = Math.floor(totalPower * (0.8 + Math.random() * 0.4));
  
        setGold(prev => prev + collected);
      }, 5000); // 5초마다 수집
  
      return () => clearInterval(interval);
    }, [dungeonMonsters, setGold]);
  
    const toggleDungeonMonster = (monster) => {
      const exists = dungeonMonsters.find(m => m.id === monster.id);
  
      if (exists) {
        // 제거
        setDungeonMonsters(dungeonMonsters.filter(m => m.id !== monster.id));
      } else {
        if (dungeonMonsters.length >= MAX_DUNGEON) {
          alert("던전에 배치할 수 있는 몬스터는 최대 5마리입니다!");
          return;
        }
        setDungeonMonsters([...dungeonMonsters, monster]);
      }
    };
  
    return (
  <div style={{ padding: "20px" }}>
    <h1>던전</h1>
  
    <h3>던전 배치 (최대 5마리)</h3>
    {dungeonMonsters.length === 0 ? (
      <p>배치된 몬스터가 없습니다.</p>
    ) : (
      <div className="monster-grid">
        {dungeonMonsters.map((m) => (
          <div
            key={m.id}
            className={`monster-card fade-in grade-${m.grade} ${
              m.grade === "LEGENDARY" ? "legendary-glow" : ""
            }`}
            style={{ cursor: "default", opacity: 0.9 }}
          >
            <img
              src={MONSTER_IMAGES[m.name] || DEFAULT_MONSTER_IMAGE}
              alt={m.name}
              style={{ width: "100px", height: "100px", marginBottom: "10px" }}
            />
            <h3 className={`grade-${m.grade}`}>{m.name}</h3>
            <p>
              등급: <span className={`grade-${m.grade}`}>{m.grade}</span>
            </p>
            <p>💥 {m.power}</p>
          </div>
        ))}
      </div>
    )}
  
    <h3>내 몬스터 선택</h3>
    {myMonsters.length === 0 ? (
      <p>몬스터가 없습니다.</p>
    ) : (
      <div className="monster-grid">
        {myMonsters.map((m) => {
          const selected = dungeonMonsters.find((dm) => dm.id === m.id);
          return (
            <div
              key={m.id}
              className={`monster-card fade-in grade-${m.grade} ${
                m.grade === "LEGENDARY" ? "legendary-glow" : ""
              }`}
              style={{
                background: selected ? "#4caf50" : "#2b2b2b",
                cursor: "pointer",
              }}
              onClick={() => toggleDungeonMonster(m)}
            >
              <img
                src={MONSTER_IMAGES[m.name] || DEFAULT_MONSTER_IMAGE}
                alt={m.name}
                style={{ width: "100px", height: "100px", marginBottom: "10px" }}
              />
              <h3 className={`grade-${m.grade}`}>{m.name}</h3>
              <p>
                등급: <span className={`grade-${m.grade}`}>{m.grade}</span>
              </p>
              <p>💥 {m.power}</p>
            </div>
          );
        })}
      </div>
    )}
  </div>
  
    );
  }
  
  export default DungeonPage;