import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  googleLogin,
  microsoftLogin,
  linkedinLogin,
  githubLogin,
  facebookLogin,
  handleGoogleCallback,
  handleMicrosoftCallback,
  handleLinkedInCallback,
  handleGitHubCallback,
  handleFacebookCallback,
  setConfig,
} from "socialauthify";

// Configure OAuth providers using environment variables
setConfig({
  google: {
    clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
    clientSecret: process.env.REACT_APP_GOOGLE_CLIENT_SECRET,
    redirectUri: process.env.REACT_APP_REDIRECT_URI,
    scope: "email profile openid",
  },
  microsoft: {
    clientId: process.env.REACT_APP_MICROSOFT_CLIENT_ID,
    clientSecret: process.env.REACT_APP_MICROSOFT_CLIENT_SECRET,
    redirectUri: process.env.REACT_APP_REDIRECT_URI,
    scope: "user.read openid profile email",
  },
  facebook: {
    clientId: process.env.REACT_APP_FACEBOOK_CLIENT_ID,
    clientSecret: process.env.REACT_APP_FACEBOOK_CLIENT_SECRET,
    redirectUri: process.env.REACT_APP_REDIRECT_URI,
    scope: "email public_profile",
  },
  linkedin: {
    clientId: process.env.REACT_APP_LINKEDIN_CLIENT_ID,
    clientSecret: process.env.REACT_APP_LINKEDIN_CLIENT_SECRET,
    redirectUri: process.env.REACT_APP_REDIRECT_URI,
    scope: "openid profile email",
  },
  github: {
    clientId: process.env.REACT_APP_GITHUB_CLIENT_ID,
    clientSecret: process.env.REACT_APP_GITHUB_CLIENT_SECRET,
    redirectUri: process.env.REACT_APP_REDIRECT_URI,
    scope: "read:user user:email",
  },
});

const LoginButton = ({ onClick, disabled, style, children }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{ ...styles.button, ...style }}
  >
    {children}
  </button>
);

LoginButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  style: PropTypes.object,
  children: PropTypes.node.isRequired,
};

function Login({ onLoginSuccess, onError }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");
      const provider = sessionStorage.getItem("oauth_provider");

      if (code && provider) {
        setLoading(true);
        try {
          let user;
          switch (provider) {
            case "google":
              user = await handleGoogleCallback(code);
              break;
            case "microsoft":
              user = await handleMicrosoftCallback(code);
              break;
            case "facebook":
              user = await handleFacebookCallback(code);
              break;
            case "linkedin":
              user = await handleLinkedInCallback(code);
              break;
            case "github":
              user = await handleGitHubCallback(code);
              break;
            default:
              throw new Error("Unknown provider");
          }

          sessionStorage.removeItem("oauth_provider");
          onLoginSuccess?.(user);
        } catch (error) {
          const errorMessage = `Authentication failed: ${error.message}`;
          setError(errorMessage);
          onError?.(errorMessage);
        } finally {
          setLoading(false);
        }
      }
    };

    handleCallback();
  }, [onLoginSuccess, onError]);

  const handleLogin = async (provider, loginFunction) => {
    setLoading(true);
    setError(null);
    try {
      sessionStorage.setItem("oauth_provider", provider.toLowerCase());
      await loginFunction();
    } catch (error) {
      const errorMessage = `${provider} login failed: ${error.message}`;
      setError(errorMessage);
      onError?.(errorMessage);
      sessionStorage.removeItem("oauth_provider");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {error && <div style={styles.error}>{error}</div>}
      {loading && <div style={styles.loading}>Loading...</div>}

      <div style={styles.buttonContainer}>
        <LoginButton
          onClick={() => handleLogin("Google", googleLogin)}
          disabled={loading}
          style={styles.googleButton}
        >
          Login with Google
        </LoginButton>

        <LoginButton
          onClick={() => handleLogin("Microsoft", microsoftLogin)}
          disabled={loading}
          style={styles.microsoftButton}
        >
          Login with Microsoft
        </LoginButton>

        <LoginButton
          onClick={() => handleLogin("Facebook", facebookLogin)}
          disabled={loading}
          style={styles.facebookButton}
        >
          Login with Facebook
        </LoginButton>

        <LoginButton
          onClick={() => handleLogin("LinkedIn", linkedinLogin)}
          disabled={loading}
          style={styles.linkedinButton}
        >
          Login with LinkedIn
        </LoginButton>

        <LoginButton
          onClick={() => handleLogin("GitHub", githubLogin)}
          disabled={loading}
          style={styles.githubButton}
        >
          Login with GitHub
        </LoginButton>
      </div>
    </div>
  );
}

Login.propTypes = {
  onLoginSuccess: PropTypes.func,
  onError: PropTypes.func,
};

const styles = {
  container: {
    maxWidth: "400px",
    margin: "40px auto",
    padding: "20px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    borderRadius: "8px",
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  button: {
    padding: "12px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "500",
    transition: "background-color 0.3s",
    color: "white",
  },
  googleButton: {
    backgroundColor: "#4285f4",
  },
  microsoftButton: {
    backgroundColor: "#00a4ef",
  },
  facebookButton: {
    backgroundColor: "#3b5998",
  },
  linkedinButton: {
    backgroundColor: "#0077b5",
  },
  githubButton: {
    backgroundColor: "#333",
  },
  error: {
    color: "red",
    textAlign: "center",
    marginBottom: "10px",
    padding: "10px",
    backgroundColor: "#ffebee",
    borderRadius: "4px",
  },
  loading: {
    textAlign: "center",
    color: "#666",
    marginBottom: "10px",
  },
};

export default Login;
