import {
    Link
  } from "react-router-dom";
/* ---------------------------------------------------------------- */
/* 네비 */
/* ---------------------------------------------------------------- */
function NavBar({ gold }) {
    return (
      <nav style={{ display: "flex", justifyContent: "space-between", padding: "10px 20px", background: "#1c1c1c", color: "white" }}>
        <ul style={{ display: "flex", gap: "15px", listStyle: "none", margin: 0, padding: 0 }}>
          <li><Link to="/" style={{ color: "white", textDecoration: "none" }}>홈</Link></li>
          <li><Link to="/game" style={{ color: "white", textDecoration: "none" }}>숫자 맞추기</Link></li>
          <li><Link to="/cardgmae" style={{ color: "white", textDecoration: "none" }}>카드 뒤집기</Link></li>
          <li><Link to="/monsters" style={{ color: "white", textDecoration: "none" }}>내 몬스터</Link></li>
          <li><Link to="/materials" style={{ color: "white", textDecoration: "none" }}>재료사용</Link></li>
          <li><Link to="/DungeonPage" style={{ color: "white", textDecoration: "none" }}>던전</Link></li>
        </ul>
        <div>💰 골드: {gold}</div>
      </nav>
    );
  }
  export default NavBar;