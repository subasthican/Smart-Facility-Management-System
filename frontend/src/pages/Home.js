import React from "react";

const Home = () => {
  return (
    <div style={styles.container}>
      <h1>Welcome to Smart Facility Management System</h1>
      <p>Manage bookings, resources, and facility operations seamlessly.</p>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "80vh",
    fontFamily: "Arial, sans-serif",
    color: "#1d1d1f",
    textAlign: "center"
  }
};

export default Home;