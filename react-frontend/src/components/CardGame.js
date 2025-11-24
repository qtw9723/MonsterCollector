// CardGamePage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../style/CardPopup.css"; // 팝업 애니메이션용 CSS (아래 제공)

export default function CardGamePage() {
  const [cards, setCards] = useState([]);
  const [score, setScore] = useState(0);
  const [openedCount, setOpenedCount] = useState(0);
  const maxOpen = 3;

  const [rewardMonster, setRewardMonster] = useState(null); // 팝업 표시용

  const startGame = async () => {
    try {
      const res = await axios.get(
        "https://monstercollector-production.up.railway.app/card/start"
      );
      setCards(res.data.cards);
      setScore(res.data.score);
      setOpenedCount(0);
      setRewardMonster(null);
    } catch (err) {
      console.error(err);
    }
  };

  /* ---------------------- 몬스터 저장 ---------------------- */
  const saveMonsterLocal = (monster) => {
    let monsters = JSON.parse(localStorage.getItem("myMonsters") || "[]");
    monsters.push({ ...monster, id: Date.now() + Math.random() });
    localStorage.setItem("myMonsters", JSON.stringify(monsters));
  };

  /* ---------------------- 카드 뒤집기 ---------------------- */
  const flipCard = async (index) => {
    if (openedCount >= maxOpen || cards[index] !== "?") return;

    try {
      const res = await axios.get(
        `https://monstercollector-production.up.railway.app/card/flip?index=${index}`
      );

      const newCards = res.data.cards;
      const newScore = res.data.score;

      setCards(newCards);
      setScore(newScore);

      const newOpened = openedCount + 1;
      setOpenedCount(newOpened);

      // 3장 오픈 완료 → 뽑기 실행
      if (newOpened === maxOpen) {
        const reward = await axios.get(
          `https://monstercollector-production.up.railway.app/card/reward?score=${newScore}`
        );

        if (reward.data.monster) {
          const monster = reward.data.monster;

          // 도감 저장
          saveMonsterLocal(monster);

          // 팝업 표시
          setRewardMonster(monster);

          // 자동으로 사라지기
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
    <div style={{ textAlign: "center" }}>
      <h1>카드 점수 게임</h1>
      <p>최대 {maxOpen}장 선택 가능</p>
      <p>현재 점수: {score}</p>
      <p>
        도전 횟수 : {openedCount}/{maxOpen}
      </p>

      {/* 6 × 6 그리드 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 70px)",
          gap: "10px",
          justifyContent: "center",
          marginTop: "20px",
        }}
      >
        {cards.map((card, idx) => (
          <div
            key={idx}
            onClick={() => flipCard(idx)}
            className={`card-box ${card !== "?" ? "flipped" : ""}`}
          >
            {card}
          </div>
        ))}
      </div>

      <button
        onClick={startGame}
        style={{ marginTop: "30px", padding: "10px 20px", fontSize: "16px" }}
      >
        다시 시작
      </button>

      {/* 보상 팝업 */}
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
