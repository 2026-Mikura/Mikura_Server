"use client";
// =============================================================
// 파일 위치: mikura-server/app/download/[uuid]/DownloadClient.tsx
// 역할: 관람객 스마트폰에서 보이는 다운로드 UI
//       - 완성된 사진 표시
//       - "사진 저장하기" 버튼: 이미지를 Blob으로 받아 기기에 저장
// =============================================================

import { useState } from "react";

interface Props {
  imageUrl: string;
  photoId: string;
}

export default function DownloadClient({ imageUrl, photoId }: Props) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      // Supabase Storage의 이미지를 Blob으로 가져온 뒤
      // <a download> 트릭으로 기기 갤러리에 저장
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      const ext = blob.type.includes("png") ? "png" : "jpg";
      const fileName = `mikura_${photoId.slice(0, 8)}.${ext}`;

      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = fileName;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(objectUrl);
    } catch (err) {
      console.error("다운로드 실패:", err);
      alert("다운로드에 실패했습니다. 이미지를 길게 눌러 저장해 주세요.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <main style={styles.container}>
      {/* 로고 영역: public/logo-ja.png, public/logo-ko.png */}
      <div style={styles.logoWrapper}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-ja.png" alt="ミクラ" style={styles.logoJa} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-ko.png" alt="미쿠라" style={styles.logoKo} />
      </div>
      <p style={styles.subtitle}>나만의 프리쿠라 사진이 완성됐어요!</p>

      {/* 완성된 사진 */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageUrl}
        alt="완성된 미쿠라 사진"
        style={styles.photo}
      />

      {/* 다운로드 버튼 — 로고와 동일한 글로시 핑크 스타일 */}
      <button
        onClick={handleDownload}
        disabled={downloading}
        style={{
          ...styles.button,
          opacity: downloading ? 0.55 : 1,
          cursor: downloading ? "not-allowed" : "pointer",
        }}
      >
        {/* 상단 흰 광택 레이어 */}
        <span style={styles.buttonGloss} />
        <span style={styles.buttonLabel}>
          {downloading ? "저장 중…" : "사진 저장하기"}
        </span>
      </button>

      {/* iOS Safari 안내 (anchor download가 작동 안 할 경우) */}
      <p style={styles.hint}>
        iPhone이라면 사진을 <strong>길게 눌러</strong> 저장해 주세요.
      </p>
    </main>
  );
}

// 인라인 스타일 (외부 CSS 의존성 없음)
const styles = {
  container: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    minHeight: "100dvh",
    padding: "24px 16px 40px",
    background: "linear-gradient(160deg, #fff0f8 0%, #ffe4f4 100%)",
    boxSizing: "border-box" as const,
  },
  logoWrapper: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    gap: 0,
    marginBottom: 8,
  },
  logoJa: {
    width: "clamp(160px, 44vw, 260px)",
    height: "auto",
    display: "block" as const,
  },
  logoKo: {
    width: "clamp(80px, 22vw, 130px)",
    height: "auto",
    display: "block" as const,
    marginTop: -4,
  },
  subtitle: {
    margin: "0 0 24px",
    fontSize: "clamp(13px, 4vw, 15px)",
    color: "#a06080",
  },
  photo: {
    width: "100%",
    maxWidth: 420,
    borderRadius: 16,
    boxShadow: "0 8px 32px rgba(220, 90, 140, 0.18)",
    objectFit: "contain" as const,
  },
  button: {
    position: "relative" as const,
    marginTop: 32,
    padding: "0 44px",
    height: "clamp(52px, 13vw, 64px)",
    fontSize: "clamp(16px, 4.5vw, 20px)",
    fontWeight: 900,
    border: "4px solid #fff",
    borderRadius: 100,
    // 로고와 동일한 핫핑크 글로시 그라디언트
    background: [
      "linear-gradient(180deg,",
      "  rgba(255,255,255,0.32) 0%,",   // 상단 하이라이트
      "  rgba(255,255,255,0.08) 48%,",  // 하이라이트 페이드
      "  rgba(200,30,100,0.08) 52%,",   // 하단 깊이 시작
      "  rgba(200,30,100,0.0) 100%",
      "),",
      "linear-gradient(160deg, #ff7ec8 0%, #f0359a 55%, #c8207a 100%)",
    ].join(""),
    color: "#fff",
    // 로고의 흰 테두리 발광 + 핑크 그림자
    boxShadow: [
      "0 0 0 2px rgba(255,255,255,0.6),",   // 내부 흰 링
      "0 6px 0 rgba(160,20,80,0.55),",       // 하단 입체감 (로고의 두꺼운 윤곽선 느낌)
      "0 10px 28px rgba(220,50,140,0.45)",   // 외부 핑크 글로우
    ].join(""),
    // 텍스트에 흰 외곽선 (로고 글자 스타일)
    textShadow: [
      "0 0 8px rgba(255,255,255,0.6),",
      "-1px -1px 0 rgba(255,180,220,0.8),",
      " 1px -1px 0 rgba(255,180,220,0.8),",
      "-1px  1px 0 rgba(255,180,220,0.8),",
      " 1px  1px 0 rgba(255,180,220,0.8)",
    ].join(""),
    letterSpacing: "0.04em",
    transition: "transform 120ms ease, box-shadow 120ms ease",
    WebkitTapHighlightColor: "transparent",
    overflow: "hidden" as const,
    display: "flex" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    gap: 0,
  },
  // 버튼 상단 흰 광택 오버레이 (로고의 반짝이 효과)
  buttonGloss: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    height: "52%",
    borderRadius: "100px 100px 60% 60%",
    background: "linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 100%)",
    pointerEvents: "none" as const,
  },
  buttonLabel: {
    position: "relative" as const,
    zIndex: 1,
  },
  hint: {
    marginTop: 16,
    fontSize: "clamp(11px, 3.5vw, 13px)",
    color: "#b08090",
    textAlign: "center" as const,
    lineHeight: 1.5,
  },
} as const;
