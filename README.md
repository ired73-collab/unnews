# UNNEWS Next.js 프로젝트

## 실행 방법

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:3000` 접속.

## Vercel 배포

1. 이 폴더를 GitHub 저장소에 업로드
2. Vercel에서 New Project 선택
3. 저장소 Import
4. Deploy 클릭

## 도메인 연결

- Vercel Settings → Domains → `unnews.co.kr` 추가
- 닷네임 DNS에 아래 등록
  - A 레코드: `@` → `76.76.21.21`
  - CNAME: `www` → `cname.vercel-dns.com`
