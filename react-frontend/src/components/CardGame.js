// CardGamePage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../style/CardPopup.css"; // 팝업 애니메이션용 CSS

export default function CardGamePage() {
  const [cards, setCards] = useState([]);
  const [score, setScore] = useState(0);
  const [openedCount, setOpenedCount] = useState(0);
  const maxOpen = 3;
  const [rewardMonster, setRewardMonster] = useState(null);

  // 게임 시작
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

  // 로컬 도감 저장
  const saveMonsterLocal = (monster) => {
    const monsters = JSON.parse(localStorage.getItem("myMonsters") || "[]");
    monsters.push({ ...monster, id: Date.now() + Math.random() });
    localStorage.setItem("myMonsters", JSON.stringify(monsters));
  };

  // 카드 뒤집기
  const flipCard = async (index) => {
    if (openedCount >= maxOpen || cards[index] !== "?") return;

    try {
      const res = await axios.get(
        `https://monstercollector-production.up.railway.app/card/flip?index=${index}`
      );

      const newCards = [...cards];
      newCards[index] = res.data.cards[index]; // 해당 카드만 오픈
      setCards(newCards);

      const newScore = score + res.data.cards[index];
      setScore(newScore);

      const newOpened = openedCount + 1;
      setOpenedCount(newOpened);

      // 최대 오픈 완료 → 몬스터 뽑기
      if (newOpened === maxOpen) {
        const rewardRes = await axios.get(
          `https://monstercollector-production.up.railway.app/card/draw?score=${newScore}`
        );

        if (rewardRes.data) {
          const monster = rewardRes.data;

          // 로컬 저장
          saveMonsterLocal(monster);

          // 팝업 표시
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
    <div style={{ textAlign: "center" }}>
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
