# Practice · Anonymous Message Board
Node.js 24 LTS 환경에서 압축을 풀고 package.json이 있는 폴더에서 `npm ci`, `npm run dev`를 실행하세요. http://localhost:3000/api/posts 에서 빈 목록이 보이면 준비되었습니다. SQLite 파일은 첫 요청 때 data/에 생성되며 재시작 후에도 유지됩니다.

게시판은 실행 중인 Next.js 서버의 포트로 API를 조회합니다. 실행 포트가 환경에 제공되지 않을 때는 `API_BASE_URL`을 사용하며, 둘 다 없으면 `http://localhost:3000`을 사용합니다.

## API 명세
요청 본문은 application/json입니다. 게시글 요약은 id(number), title(string), author("익명"), createdAt(UTC ISO 문자열), views(number)로 구성됩니다. 상세 게시글에는 content(string)가 추가됩니다.

|요청|입력|성공 응답|
|---|---|---|
|GET /api/posts|q(제목 부분 검색), page(기본 1), size(기본 10, 최대 50)|200 {posts: 요약 배열, total, page, size}, 최신순|
|POST /api/posts|{"title":"첫 글","content":"반갑습니다"}|201 {post: 상세 게시글, editToken: 문자열}|
|GET /api/posts/:id|상세 조회 시 조회수 1 증가. 수정 폼에서는 ?view=0 사용|200 상세 게시글|
|PATCH /api/posts/:id|관리 토큰 및 title, content 모두 전달|200 수정된 상세 게시글|
|DELETE /api/posts/:id|관리 토큰|204 빈 본문|

작성 응답의 editToken을 브라우저에 글 ID별로 보관하고 PATCH와 DELETE 요청에 `Authorization: Bearer <editToken>` 헤더를 전달하세요. 토큰은 작성 응답에서 한 번만 발급합니다. 서버는 해시값을 저장합니다.

입력 양끝 공백을 제거한 뒤 제목 1~100자, 본문 1~5000자(JS 문자열 길이)를 허용합니다. 오류 응답은 {message: 문자열}입니다. 입력 오류는 400, 토큰 누락·형식 오류는 401, 다른 글의 토큰은 403, 없는 글은 404입니다. DELETE 성공 시 JSON 파싱을 생략하세요.

## 학생 실습 (60~90분)
1. Mock 데이터로 src/app/posts 아래에 목록, [id] 상세, new 페이지를 만들고 Link와 공통 레이아웃을 연결하세요.
2. src/types/post.ts에서 계약을 정의하고 src/services/postApi.ts에서 API 호출을 구현하세요. Server Component는 실행 중인 서버 주소 또는 API_BASE_URL로 절대 URL을 구성하고 Client Component의 폼은 같은 출처의 /api/posts로 제출하세요. 빌드 시 서버가 실행되지 않아도 되도록 조회 페이지는 동적 렌더링하고 fetch에는 cache: 'no-store'를 지정하세요.
3. [id]/edit, 삭제, 검색과 페이지 이동을 구현하세요. 제출 중 버튼을 비활성화하고 성공 후 이동 및 화면 갱신을 처리하세요. loading.tsx, error.tsx, not-found.tsx와 빈 목록 안내를 작성하세요. 조회수 증가를 사용하므로 상세 Link에는 prefetch={false}를 지정하세요.

완료 후 다른 글의 토큰으로 수정을 시도해 403을 확인하고, 올바른 토큰으로 삭제한 뒤 목록과 상세 화면을 확인하세요.

## Step 1 Mock 모드

`.env.local`에 `BOARD_MOCK=1`을 설정하고 서버를 다시 시작하면 `/posts`에서 예시 게시글 목록, 상세 화면, 작성 폼을 확인할 수 있습니다. 작성 폼은 미리보기로 제공됩니다. Step 2~3의 API 연동 및 CRUD 실습은 `BOARD_MOCK=0`으로 설정한 뒤 서버를 다시 시작하세요.
