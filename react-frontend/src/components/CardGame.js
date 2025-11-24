import React, { useEffect, useState } from "react";
import axios from "axios";
import "../style/CardPopup.css"; // 팝업/카드 애니메이션 CSS

export default function CardGamePage() {
  const [cards, setCards] = useState([]);
  const [score, setScore] = useState(0);
  const [openedCount, setOpenedCount] = useState(0);
  const maxOpen = 3;
  const [rewardMonster, setRewardMonster] = useState(null);

  const startGame = async () => {
    try {
      const res = await axios.get(
        "https://monstercollector-production.up.railway.app/card/start"
      );
      setCards(res.data.cards);
      setScore(0);
      setOpenedCount(0);
      setRewardMonster(null);
    } catch (err) {
      console.error(err);
    }
  };

  const saveMonsterLocal = (monster) => {
    const monsters = JSON.parse(localStorage.getItem("myMonsters") || "[]");
    monsters.push({ ...monster, id: Date.now() + Math.random() });
    localStorage.setItem("myMonsters", JSON.stringify(monsters));
  };

  const flipCard = async (index) => {
    if (openedCount >= maxOpen || cards[index] !== "?") return;

    try {
      const res = await axios.get(
        `https://monstercollector-production.up.railway.app/card/flip?index=${index}`
      );

      const newCards = [...cards];
      newCards[index] = res.data.cards[index];
      setCards(newCards);

      const newScore = score + res.data.cards[index];
      setScore(newScore);

      const newOpened = openedCount + 1;
      setOpenedCount(newOpened);

      if (newOpened === maxOpen) {
        const rewardRes = await axios.get(
          `https://monstercollector-production.up.railway.app/card/draw?score=${newScore}`
        );

        if (rewardRes.data) {
          const monster = rewardRes.data;

          saveMonsterLocal(monster);

          setRewardMonster(monster);
          setTimeout(() => setRewardMonster(null), 2000);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    startGame();
  }, []);

  return (
    <div style={{ textAlign: "center", background: "#111", minHeight: "100vh", color: "#fff", padding: "20px 0" }}>
      <h1>카드 점수 게임</h1>
      <p>최대 {maxOpen}장 선택 가능</p>
      <p>현재 점수: {score}</p>
      <p>
        도전 횟수: {openedCount}/{maxOpen}
      </p>

      {/* 6x6 카드 그리드 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 80px)",
          gap: "12px",
          justifyContent: "center",
          marginTop: "20px",
          perspective: "1000px", // 3D 효과
        }}
      >
        {cards.map((card, idx) => (
          <div key={idx} className="card-container" onClick={() => flipCard(idx)}>
            <div className={`card-inner ${card !== "?" ? "flipped" : ""}`}>
              <div className="card-front">?</div>
              <div className="card-back">{card}</div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={startGame}
        style={{ marginTop: "30px", padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}
      >
        다시 시작
      </button>

      {/* 몬스터 보상 팝업 */}
      {rewardMonster && (
        <div className="reward-popup">
          <h2>🎉 몬스터 획득!</h2>
          <p>
            {rewardMonster.name} ({rewardMonster.grade})
          </p>
        </div>
      )}
    </div>
  );
}
