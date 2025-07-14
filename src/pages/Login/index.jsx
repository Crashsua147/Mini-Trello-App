import React, { useState, useEffect  } from "react";
import { Container, Box } from "@mui/material";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { muiS } from "~/muiShortcut";
import TrelloLogo from "~/assets/trello.svg";
import GmailImage from "~/assets/gmail.png"
import GitHubImage from "~/assets/github.png"
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [step, setStep] = useState("choice"); // 'choice' | 'email' | 'code'
  const [code, setCode] = useState("");
  const sendEmailCode = async () => {
    await axios.post("http://localhost:4000/auth/send-verification", {
      email,
    });
  };

  const loginWithCode = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:4000/auth/signup", {
        email,
        code,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.id);
      navigate("/boards");
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  useEffect(() => {
  document.title = "Login | Trello App";
}, []);

  return (
    <Box
      sx={{
        height: "100vh",
        ...muiS.dFlex,
        ...muiS.flexDirectionColumn,
        ...muiS.jcCenter,
      }}
    >
      {step === "choice" && (
        <Box
          sx={{
            ...muiS.dFlex,
            ...muiS.flexDirectionColumn,
            ...muiS.jcCenter,
            ...muiS.aiCenter,
          }}
        >
          <Box sx={{ width: 120, height: 120 }}>
            <img
              src={TrelloLogo}
              alt="Trello Logo"
              style={{ width: "100%", height: "100%" }}
            />
          </Box>
          <Box sx={{ p: 1, width: 300 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => setStep("email")}
              sx={{ gap: 1 }}
            >
              <Avatar src={GmailImage}></Avatar>
              Login with Email
            </Button>
          </Box>
          <Box sx={{ p: 1, width: 300 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() =>
                (window.location.href = "http://localhost:4000/auth/github")
              }
              sx={{ gap: 1 }}
            >
              <Avatar src={GitHubImage}></Avatar>
              Login with GitHub
            </Button>
          </Box>
        </Box>
      )}

      {step === "email" && (
        <Box
          sx={{
            ...muiS.dFlex,
            ...muiS.flexDirectionColumn,
            ...muiS.jcCenter,
            ...muiS.aiCenter,
          }}
        >
          <Box sx={{ width: 120, height: 120 }}>
            <img
              src={TrelloLogo}
              alt="Trello Logo"
              style={{ width: "100%", height: "100%" }}
            />
          </Box>
          <Box sx={{ p: 1, width: 300 }}>
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              size="small"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Box>
          <Box sx={{ p: 1, width: 300 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={async () => {
                await sendEmailCode();
                setStep("code");
              }}
            >
              Send email code
            </Button>
          </Box>
        </Box>
      )}

      {step === "code" && (
        <Box
          sx={{
            ...muiS.dFlex,
            ...muiS.flexDirectionColumn,
            ...muiS.jcCenter,
            ...muiS.aiCenter,
          }}
        >
          <Box sx={{ width: 120, height: 120 }}>
            <img
              src={TrelloLogo}
              alt="Trello Logo"
              style={{ width: "100%", height: "100%" }}
            />
          </Box>
          <Typography variant="h6">
            Check your email for the code and enter it to log in
          </Typography>
          <Box sx={{ p: 1, width: 300 }}>
            <TextField
              fullWidth
              label="Verification Code"
              variant="outlined"
              size="small"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </Box>
          <Box sx={{ p: 1, width: 300 }}>
            <Button fullWidth variant="outlined" onClick={loginWithCode}>
              Login
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default Login;
