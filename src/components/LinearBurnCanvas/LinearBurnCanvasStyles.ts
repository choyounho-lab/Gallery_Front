// LinearBurnCanvasStyles.ts
export const styles = `
  :root {
    /* 배경 그라디언트 색상 팔레트 관련 변수 제거 (선택 사항) */
    /*
    --gradient-color-1: #0A0A2A;
    --gradient-color-2: #2A0A2A;
    --gradient-color-3: #0A2A2A;
    --gradient-color-4: #050505;

    --gradient-alt-1-color-1: #1a0a2a;
    --gradient-alt-1-color-2: #3a0a3a;
    --gradient-alt-1-color-3: #1a3a3a;
    --gradient-alt-1-color-4: #0a0a0a;

    --gradient-alt-2-color-1: #0e1a0e;
    --gradient-alt-2-color-2: #1a2a1a;
    --gradient-alt-2-color-3: #0a0a2a;
    --gradient-alt-2-color-4: #050505;
    */

    /* 텍스트 빛 효과 색상 (기존 푸른빛) */
    --glow-color-blue: rgba(173, 216, 230, 1); /* Light Blue */

    /* 추가 텍스트 빛 효과 색상 (예시) */
    --glow-color-purple: rgba(220, 150, 255, 1); /* 연한 보라색 */
    --glow-color-green: rgba(144, 238, 144, 1); /* 연한 녹색 */
    --glow-color-gold: rgba(255, 215, 0, 1); /* 금색 */
  }

  /* 그라디언트 애니메이션 정의 및 .waving-gradient-bg 클래스 제거 (선택 사항) */
  /*
  @keyframes wave {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  .waving-gradient-bg {
    background-size: 400% 400%;
    animation: wave 20s ease infinite;
    background-image: linear-gradient(to bottom right,
                                      var(--gradient-color-1),
                                      var(--gradient-color-2) 30%,
                                      var(--gradient-color-3) 60%,
                                      var(--gradient-color-4) 90%);

    mask-image: linear-gradient(to bottom, black 10%, transparent 0%);
    -webkit-mask-image: linear-gradient(to bottom, black 25%, transparent 100%);
  }
  */

  /* 텍스트 빛 효과 애니메이션 정의 */
  @keyframes pulse-glow {
    0% {
      text-shadow: 0 0 5px var(--glow-color-blue, rgba(173, 216, 230, 0.4)),
                   0 0 10px var(--glow-color-blue, rgba(173, 216, 230, 0.3));
    }
    50% {
      text-shadow: 0 0 8px var(--glow-color-blue, rgba(173, 216, 230, 0.7)),
                   0 0 15px var(--glow-color-blue, rgba(173, 216, 230, 0.5)),
                   0 0 20px var(--glow-color-blue, rgba(173, 216, 230, 0.4));
    }
    100% {
      text-shadow: 0 0 5px var(--glow-color-blue, rgba(173, 216, 230, 0.4)),
                   0 0 10px var(--glow-color-blue, rgba(173, 216, 230, 0.3));
    }
  }

  /* 추가적인 빛 효과 애니메이션 (예시: 다른 색상) */
  @keyframes pulse-glow-purple {
    0% {
      text-shadow: 0 0 5px var(--glow-color-purple, rgba(220, 150, 255, 0.4)),
                   0 0 10px var(--glow-color-purple, rgba(220, 150, 255, 0.3));
    }
    50% {
      text-shadow: 0 0 8px var(--glow-color-purple, rgba(220, 150, 255, 0.7)),
                   0 0 15px var(--glow-color-purple, rgba(220, 150, 255, 0.5)),
                   0 0 20px var(--glow-color-purple, rgba(220, 150, 255, 0.4));
    }
    100% {
      text-shadow: 0 0 5px var(--glow-color-purple, rgba(220, 150, 255, 0.4)),
                   0 0 10px var(--glow-color-purple, rgba(220, 150, 255, 0.3));
    }
  }

  @keyframes pulse-glow-green {
    0% {
      text-shadow: 0 0 5px var(--glow-color-green, rgba(144, 238, 144, 0.4)),
                   0 0 10px var(--glow-color-green, rgba(144, 238, 144, 0.3));
    }
    50% {
      text-shadow: 0 0 8px var(--glow-color-green, rgba(144, 238, 144, 0.7)),
                   0 0 15px var(--glow-color-green, rgba(144, 238, 144, 0.5)),
                   0 0 20px var(--glow-color-green, rgba(144, 238, 144, 0.4));
    }
    100% {
      text-shadow: 0 0 5px var(--glow-color-green, rgba(144, 238, 144, 0.4)),
                   0 0 10px var(--glow-color-green, rgba(144, 238, 144, 0.3));
    }
  }

  .fade-out-logo {
    mask-image: radial-gradient(circle, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 40%);
    -webkit-mask-image: radial-gradient(circle, rgba(0,0,0,1) 35%, rgba(0,0,0,0) 70%);
  }
`;
