import axios from "axios";

export const instance = axios.create({
  baseURL: process.env.REACT_APP_MUSIC,
  timeout: 5000,
});
const tokenURL = "https://accounts.spotify.com/api/token";
const authorization =
  "Basic YjExMDczMDdjOTZkNDM1ZjgxYWZjNWNmMzQzMDM1YmE6NTI1ODVlYjFjMThmNDgxZmEyYjI1MmMwZmY3NTAwYTc=";
const access_token =
  "AQCKC8nH3r31js6AXClIj-HETKwVQ4rJk8fxVdJZZyBNi7ipaDeJPjFpXO9NZ66h2-0V4ueQn9o8a355GEoSSOI9EAUhv3JiRhkGP6n1oy47Y4CxhIw0GndfMxhBdzdFjzpnZFBRJ7NhSJ9bDMHC4ofd0xetEISUAwi7cklNzjarEUbL6-0tydnreM1G";
const encoded = btoa(
  "b1107307c96d435f81afc5cf343035ba:52585eb1c18f481fa2b252c0ff7500a7"
);
console.log(encoded);
const getAccessToken = async () => {
  const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;

  const response = await axios.post(
    "https://accounts.spotify.com/api/token",
    new URLSearchParams({
      grant_type: "client_credentials",
      client_id: "b1107307c96d435f81afc5cf343035ba",
      client_secret: "52585eb1c18f481fa2b252c0ff7500a7",
    }),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return response.data.access_token;
};

instance.interceptors.request.use(
  async (config) => {
    const accessToken = await getAccessToken();
    config.headers.set("Authorization", `Bearer ${accessToken}`);

    return config;
  },
  (error) => {
    console.log("요청 직전 오류", error);
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log(error);
    alert(error.response.data.status_message);
    return Promise.reject(error);
  }
);

/////////////////////
const CLIENT_ID = "b1107307c96d435f81afc5cf343035ba";
const REDIRECT_URI = "http://127.0.0.1:8000/callback";
const CLIENT_SECRET = "52585eb1c18f481fa2b252c0ff7500a7";

const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&scope=user-read-private streaming`;

const handleLogin = () => {
  window.location.href = AUTH_URL;
};

const fetchUserProfile = async () => {
  const token = localStorage.getItem("spotify_access_token");

  const response = await axios.get("https://api.spotify.com/v1/me", {
    headers: { Authorization: `Bearer ${token}` },
  });

  console.log(response.data);
};
