import React, { useState } from "react";
import Login from "./Login";

function App() {
  const [user, setUser] = useState(null);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    console.log("Login successful:", userData);
  };

  const handleLoginError = (error) => {
    console.error("Login failed:", error);
  };

  return (
    <div>
      {user ? (
        <div style={styles.userInfo}>
          <h2>Welcome, {user.name}!</h2>
          <pre>{JSON.stringify(user, null, 2)}</pre>
          <button onClick={() => setUser(null)} style={styles.logoutButton}>
            Logout
          </button>
        </div>
      ) : (
        <Login onLoginSuccess={handleLoginSuccess} onError={handleLoginError} />
      )}
    </div>
  );
}

const styles = {
  userInfo: {
    maxWidth: "600px",
    margin: "40px auto",
    padding: "20px",
    textAlign: "center",
  },
  logoutButton: {
    backgroundColor: "#f44336",
    color: "white",
    padding: "8px 16px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginTop: "10px",
  },
};

export default App;
