// src/components/SpotifyPlayer.tsx
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
///<reference types="spotify-web-playback-sdk" />

interface SpotifyPlayerProps {
  accessToken?: string;
}

interface Window {
  onSpotifyWebPlaybackSDKReady: () => void;
  Spotify: {
    Player: typeof Spotify.Player;
  };
}
declare global {
  namespace Spotify {
    interface Player {
      connect(): Promise<boolean>;
      disconnect(): void;
      togglePlay(): Promise<void>;
      // 필요한 메서드들만 추가 가능
    }
  }
}

let player: any = null;

const Test2: React.FC<SpotifyPlayerProps> = () => {
  const CLIENT_ID = "b1107307c96d435f81afc5cf343035ba";
  const CLIENT_SECRET = "52585eb1c18f481fa2b252c0ff7500a7";
  const REDIRECT_URI = "http://127.0.0.1:8000/callback";
  const SCOPE = [
    "user-read-private",
    "user-read-email",
    "streaming",
    "playlist-read-private",
    "playlist-read-collaborative",
    "playlist-modify-public",
    "playlist-modify-private",
  ].join(" ");

  const deviceIdRef = useRef<string | null>(null);
  const tempTokenRef = useRef<string>("");
  const [tempToken, setTempToken] = useState<string>("");
  const [playerReady, setPlayerReady] = useState<boolean>(false);
  const { search } = useLocation();

  const loginWithSpotify = () => {
    const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${CLIENT_ID}&scope=${encodeURIComponent(
      SCOPE
    )}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&state=custom-state`;
    window.location.href = authUrl;
  };
  const hasInitializedPlayer = useRef(false);
  const initializePlayer = () => {
    if (hasInitializedPlayer.current) {
      console.log("🎮 이미 플레이어가 초기화됨 - 중복 호출 방지");
      return;
    }

    if (player) {
      player.disconnect();
    }
    player = new window.Spotify.Player({
      name: "My Web Player",
      getOAuthToken: (cb: (token: string) => void) => cb(tempTokenRef.current),
      volume: 0.5,
    });
    player.connect();
    player.addListener("ready", ({ device_id }: { device_id: string }) => {
      console.log("✅ Player ready:", device_id);
      deviceIdRef.current = device_id;
      setPlayerReady(true);
    });

    player.addListener("initialization_error", ({ message }: any) =>
      console.error("init error:", message)
    );
    player.addListener("authentication_error", ({ message }: any) =>
      console.error("auth error:", message)
    );
    player.addListener("account_error", ({ message }: any) =>
      console.error("account error:", message)
    );
    player.addListener("playback_error", ({ message }: any) =>
      console.error("playback error:", message)
    );
  };
  useEffect(() => {
    if (tempToken) {
      initializePlayer();
    }
  }, [tempToken]);

  useEffect(() => {
    const scriptId = "spotify-sdk";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://sdk.scdn.co/spotify-player.js";
      script.async = true;
      document.body.appendChild(script);
    }

    window.onSpotifyWebPlaybackSDKReady = () => {
      if (tempTokenRef.current) {
        initializePlayer();
      }
    };

    const code = new URLSearchParams(search).get("code");
    if (code) {
      const tokenRequestHeaders = {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic " + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`),
      };

      const data = new URLSearchParams();
      data.append("grant_type", "authorization_code");
      data.append("code", code);
      data.append("redirect_uri", REDIRECT_URI);

      axios
        .post("https://accounts.spotify.com/api/token", data, {
          headers: tokenRequestHeaders,
        })
        .then((res) => {
          const token = res.data.access_token;
          tempTokenRef.current = token;
          setTempToken(token);
          initializePlayer();
        })
        .catch((err) => {
          console.error("🧨 Token Error:", err.response?.data || err.message);
        });
    }
  }, [search]);

  const handlePlay = async () => {
    if (!deviceIdRef.current || !playerReady) {
      console.warn("⚠️ Player가 아직 준비되지 않았습니다.");
      return;
    }

    try {
      await axios.put(
        "https://api.spotify.com/v1/me/player/play",
        {
          uris: ["spotify:track:2V7Gxq4QW2Fm4zizDF0V6Z"],
          device_id: deviceIdRef.current,
        },
        {
          headers: {
            Authorization: `Bearer ${tempTokenRef.current}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("▶️ 재생 성공");
    } catch (err: any) {
      console.error("🎵 재생 실패:", err.response?.data || err.message);
    }
  };
  const buttonStyle: React.CSSProperties = {
    padding: "10px 16px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#1DB954",
    color: "#fff",
    fontWeight: "bold",
    fontSize: "14px",
    cursor: "pointer",
  };
  return (
    <div
      style={{
        padding: "24px",
        maxWidth: "420px",
        margin: "0 auto",
        backgroundColor: "#121212",
        color: "white",
        borderRadius: "12px",
        boxShadow: "0 4px 16px rgba(0,0,0,0.5)",
        textAlign: "center",
        fontFamily: "'Segoe UI', sans-serif",
      }}
    >
      <h2 style={{ fontSize: "18px", marginBottom: "12px" }}>
        🎧 Spotify Web Player
      </h2>

      <div style={{ marginBottom: "8px" }}>
        {tempToken ? (
          <span style={{ color: "#1DB954" }}>🟢 로그인 완료</span>
        ) : (
          <button onClick={loginWithSpotify} style={buttonStyle}>
            🔑 Spotify 로그인
          </button>
        )}
      </div>

      <div style={{ marginTop: "16px", marginBottom: "8px" }}>
        <p style={{ fontSize: "14px", marginBottom: "8px" }}>
          🎵 곡: <b>After Hours</b>
        </p>
        <p style={{ fontSize: "12px", opacity: 0.6 }}>
          디바이스 상태: {playerReady ? "✅ 연결됨" : "❌ 미연결"}
        </p>
      </div>

      <div>
        <button
          onClick={handlePlay}
          disabled={!playerReady}
          style={buttonStyle}
        >
          ▶️ 재생
        </button>
        <button
          onClick={async () => {
            if (player && playerReady) {
              const state = await player.getCurrentState();
              if (!state) {
                console.warn("⏳ 상태 없음 — 디바이스 활성화 시도 중...");

                await axios.put(
                  "https://api.spotify.com/v1/me/player",
                  {
                    device_ids: [deviceIdRef.current],
                    play: false,
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${tempTokenRef.current}`,
                      "Content-Type": "application/json",
                    },
                  }
                );

                await axios.put(
                  "https://api.spotify.com/v1/me/player/play",
                  {
                    uris: ["spotify:track:2V7Gxq4QW2Fm4zizDF0V6Z"],
                    device_id: deviceIdRef.current,
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${tempTokenRef.current}`,
                    },
                  }
                );
                console.log("🚀 디바이스 강제 전환 + 재생 요청 완료");
              } else {
                await player.togglePlay();
                console.log("🎚 재생 상태 토글됨");
              }
            }
          }}
          disabled={!playerReady}
          style={{ ...buttonStyle, marginLeft: "12px" }}
        >
          🔄 토글 재생
        </button>
        <button
          onClick={async () => {
            if (player && playerReady) {
              try {
                await player.pause();
                console.log("⏸ 일시정지 완료");
              } catch (err: any) {
                console.error("🚫 일시정지 실패:", err.message);
              }
            }
          }}
          disabled={!playerReady}
          style={{ ...buttonStyle, marginTop: "12px" }}
        >
          ⏸ 일시정지
        </button>
      </div>
    </div>
  );
};

export default Test2;
