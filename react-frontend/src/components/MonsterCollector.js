// MonsterCollector.js

import React, { useState, useEffect } from "react";
import axios from "axios";

const GRADE_COLORS = {
  NORMAL: "#ffffff",
  RARE: "#6fa8dc",
  EPIC: "#b565f2",
  LEGENDARY: "#f2c744",
};

function MonsterCollector({ onCollect }) {
  const [probabilities, setProbabilities] = useState(null);
  const [answer, setAnswer] = useState("");
  const [input, setInput] = useState("");

  useEffect(() => {
    loadProbabilities();
  }, []);

  const loadProbabilities = async () => {
    const res = await axios.get("https://monstercollector-production.up.railway.app/api/monster/probabilities");
    setProbabilities(res.data);
  };

  const handleSubmit = async () => {
    const res = await axios.post("https://monstercollector-production.up.railway.app/api/monster/guess", {
      answer: input,
    });

    if (res.data.monster) {
      onCollect(res.data.monster);
    }

    await loadProbabilities();
  };

  return (
    <div className="p-4 text-white">

      {/* 🔥 현재 확률 표시 */}
      {probabilities && (
        <div className="mb-4 bg-gray-900 p-3 rounded-lg shadow">
          <h3 className="text-lg mb-2 font-bold">🎲 현재 몬스터 등급 확률</h3>
          {Object.entries(probabilities).map(([grade, value]) => (
            <div key={grade} className="flex justify-between mb-1">
              <span style={{ color: GRADE_COLORS[grade] }}>
                {grade}
              </span>
              <span>{value}%</span>
            </div>
          ))}
        </div>
      )}

      {/* 숫자 맞추기 UI */}
      <input
        type="number"
        className="p-2 bg-gray-800 rounded w-full mb-2"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 p-2 rounded hover:bg-blue-700 transition"
      >
        제출
      </button>
    </div>
  );
}

export default MonsterCollector;
