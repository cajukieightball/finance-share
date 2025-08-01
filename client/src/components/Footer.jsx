import React from "react";

export default function Footer() {
  return (
    <footer style={{ padding: "1rem", textAlign: "center", fontSize: "0.9rem", color: "#aaa" }}>
      &copy; {new Date().getFullYear()} InvestHub. All rights reserved.
    </footer>
  );
}
