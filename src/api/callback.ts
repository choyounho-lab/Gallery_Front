import { useEffect } from "react";
import axios from "axios";

const CLIENT_ID = "b1107307c96d435f81afc5cf343035ba";
const REDIRECT_URI = "http://127.0.0.1:8000/callback";
const CLIENT_SECRET = "52585eb1c18f481fa2b252c0ff7500a7";

const getAccessToken = async (code: any) => {
  const response = await axios.post(
    "https://accounts.spotify.com/api/token",
    new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: REDIRECT_URI,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    }),
    {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }
  );

  return response.data.access_token;
};

const Callback = () => {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      getAccessToken(code).then((token) => {
        localStorage.setItem("spotify_access_token", token);
      });
    }
  }, []);

  return;
};

export default Callback;
