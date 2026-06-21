# BOOK TO LEARN & RUN

모바일 중심 공공 도서관 도서 검색·대출·예약 웹서비스의 1차 프론트엔드 MVP입니다. 별도 빌드 도구나 백엔드 없이 `mockBooks` 배열과 LocalStorage만으로 실행됩니다.

## 실행 방법

가장 간단한 방법은 프로젝트 폴더의 `index.html`을 브라우저에서 여는 것입니다.

로컬 서버를 사용하려면 프로젝트 루트에서 아래 명령을 실행한 뒤 표시된 주소로 접속합니다.

```bash
python3 -m http.server 8000
```

접속 주소: `http://localhost:8000`

## 페이지

- `index.html`: 메인, 통합 검색, 추천 키워드, 추천 도서, 카테고리
- `search.html`: 검색어·카테고리·대출 상태 필터 및 정렬
- `detail.html`: 도서 상세, 서가 위치, 청구기호, 찜·대출·예약 이동
- `reserve.html`: 예약 신청 및 중복 예약 방지
- `signup.html`: 시연용 회원가입
- `login.html`: 시연용 로그인
- `mypage.html`: 사용자별 찜·대여·예약 목록과 취소·삭제

모든 페이지는 공통 `style.css`와 `app.js`를 사용하며, `body[data-page]` 값에 맞는 초기화 함수만 실행합니다.

## 시연용 로그인 주의사항

이 로그인 기능은 프론트엔드 시연용이며 실제 서비스에서는 Supabase Auth로 교체해야 합니다.

현재는 요구사항에 따라 사용자 이메일과 비밀번호가 브라우저 LocalStorage에 평문으로 저장됩니다. 실제 개인정보를 입력하지 마세요. 운영 서비스에서는 비밀번호를 LocalStorage에 저장하면 안 되며, 인증 토큰과 세션도 안전한 인증 시스템으로 관리해야 합니다.

## LocalStorage

| Key | 용도 |
| --- | --- |
| `btlr_recent_searches` | 최근 검색어 최대 5개 |
| `btlr_users` | 시연용 가입 사용자 목록 |
| `btlr_current_user` | 현재 로그인한 사용자 |
| `btlr_favorites` | 사용자별 찜한 도서 |
| `btlr_loans` | 사용자별 대여한 도서와 14일 반납 예정일 |
| `btlr_reservations` | 사용자별 예약한 도서 |

찜, 대여, 예약 레코드에는 모두 `userId`가 저장되어 여러 시연용 계정의 데이터가 서로 섞이지 않습니다.

## 데이터와 코드 구조

- `mockBooks`: 18권의 시연용 도서 데이터
- 도서 함수: 조회, 검색, 필터, 정렬, 카드 렌더링
- 인증 함수: 가입, 로그인, 로그아웃, 로그인 보호
- 사용자 데이터 함수: 찜, 대여, 예약 조회·저장·취소
- 페이지 초기화 함수: 홈, 검색, 상세, 예약, 가입, 로그인, 마이페이지

도서 표지는 기존 프로젝트의 `image/images` 자산을 재사용했습니다. 기존 디자인의 베이지·브라운 색상, 영문 세리프 타이틀, 부드러운 카드 분위기를 모바일 웹앱 구조로 확장했습니다.

## Supabase 연결 계획

`config.example.js`는 향후 연결 설정의 형태만 보여주는 예시이며 현재 코드에서는 로드하지 않습니다.

교체 대상:

- 회원가입/로그인 → Supabase Auth
- `mockBooks` → Supabase `books` 테이블 또는 외부 도서 API 응답
- LocalStorage 찜 → `favorites` 테이블
- LocalStorage 대여 → `loans` 테이블
- LocalStorage 예약 → `reservations` 테이블

예정 테이블:

- `books`: `id`, `external_id`, `title`, `author`, `publisher`, `published_date`, `isbn`, `category`, `keywords`, `description`, `short_description`, `thumbnail`, `loan_status`, `location`, `call_number`, `return_date`, `created_at`
- `favorites`: `id`, `user_id`, `book_id`, `created_at`
- `loans`: `id`, `user_id`, `book_id`, `loan_status`, `borrowed_at`, `due_date`
- `reservations`: `id`, `user_id`, `book_id`, `reservation_status`, `created_at`

연결 시 `app.js`의 저장소 함수(`getUsers`, `getFavorites`, `getLoans`, `getReservations` 등)를 비동기 Supabase Repository 함수로 교체하고, 각 페이지 초기화 함수를 `async` 흐름으로 변경하면 됩니다.

## 외부 도서 API 확장

추후 연결 가능한 API:

- 카카오 책 검색 API
- 네이버 책 검색 API
- 도서관 정보나루 API
- Google Books API

외부 도서 API는 제목, 저자, 출판사, ISBN, 표지, 소개 같은 서지 정보를 제공하는 역할입니다. 실제 공공 도서관의 대출 상태와 예약 처리까지 제공하지는 않으므로 대출 상태, 대여, 예약 데이터는 Supabase 같은 별도 백엔드에서 관리해야 합니다.

## 현재 한계

- 데이터는 브라우저 한 대의 LocalStorage에만 유지됩니다.
- 실제 회원 인증, 개인정보 보호, 권한 검증이 없습니다.
- 대출·예약은 실제 도서관 시스템과 연동되지 않는 시연 동작입니다.
- 도서 재고와 대출 상태는 `mockBooks`의 고정 값이며 사용자 대출 후 전체 재고 상태를 변경하지 않습니다.
- 알림, 예약 순번, 연장, 반납 처리는 구현 범위에 포함되지 않습니다.
