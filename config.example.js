/**
 * BOOK TO LEARN & RUN - 향후 외부 서비스 연결 예시
 *
 * 현재 MVP에서는 이 파일을 사용하지 않습니다.
 * 실제 연결 시 이 파일을 config.js로 복사한 뒤 값은 배포 환경의
 * 환경 변수 또는 안전한 서버 설정으로 관리하세요.
 */

window.BTLR_CONFIG = {
  supabase: {
    url: "https://YOUR_PROJECT.supabase.co",
    publishableKey: "YOUR_SUPABASE_PUBLISHABLE_KEY",
  },
  bookApi: {
    provider: "kakao", // kakao | naver | google | data4library
    apiKey: "YOUR_BOOK_API_KEY",
    baseUrl: "https://api.example.com/books",
  },
};
