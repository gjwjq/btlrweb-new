-- 초기 샘플 도서 상태를 실제 대출 기록이 없는 상태로 초기화합니다.

update public.books
set loan_status = '대출 가능',
    return_date = null;
