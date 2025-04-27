import React from "react";

const BottomNavBar: React.FC = () => {
  const navItems = [
    { label: "홈", icon: "🏠" },
    { label: "지도", icon: "🗺️" },
    { label: "", icon: "+" },
    { label: "일정", icon: "📅" },
    { label: "내 정보", icon: "👤" },
  ];

  return (
    <div style={styles.container}>
      {navItems.map((item, index) => (
        <button key={index} style={styles.button}>
          <div style={styles.icon}>{item.icon}</div>
          <div style={styles.label}>{item.label}</div>
        </button>
      ))}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    height: "60px",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderTop: "1px solid #ddd",
    zIndex: 10,
  },
  button: {
    background: "none",
    border: "none",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontSize: "12px",
    cursor: "pointer",
  },
  icon: {
    fontSize: "24px",
  },
  label: {
    marginTop: "2px",
  },
};

export default BottomNavBar;
