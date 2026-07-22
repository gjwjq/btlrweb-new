"use strict";

(function initializeSupabase() {
  const config = window.BTLR_CONFIG?.supabase;

  if (!config?.url || !config?.publishableKey) {
    console.error("Supabase 연결 설정을 찾을 수 없습니다.");
    return;
  }

  if (!window.supabase?.createClient) {
    console.error("Supabase JavaScript 라이브러리를 불러오지 못했습니다.");
    return;
  }

  window.btlrSupabase = window.supabase.createClient(
    config.url,
    config.publishableKey,
  );

  window.testSupabaseConnection = async function testSupabaseConnection() {
    const { error } = await window.btlrSupabase
      .from("books")
      .select("id", { count: "exact", head: true });

    if (error) {
      console.error("Supabase 연결 실패:", error.message);
      return false;
    }

    console.info("Supabase 연결 성공");
    return true;
  };
})();
