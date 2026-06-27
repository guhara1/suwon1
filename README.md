# 홈타이허브

수원, 용인, 성남 지역 전문 출장마사지 및 홈타이 안내 정적 사이트입니다.

- 도메인: https://homethaihub1.netlify.app
- Netlify publish 디렉터리: `out`

## Build

```bash
npm run build
```

빌드 시 다음이 자동 생성됩니다.

- `out/sitemap.xml` — 전체 지역 페이지 사이트맵 (검색엔진 색인용)
- `out/rss.xml` — RSS 피드
- `out/robots.txt` — Googlebot · NaverBot · Yeti 허용 + 사이트맵 위치
- `out/{IndexNow키}.txt` — IndexNow 인증 키 파일
- 모든 페이지 `<head>`에 Google / Naver 사이트 소유확인 메타 태그

## 검색엔진 색인 (가장 빠른 통보)

### 1. IndexNow — Bing · Naver 즉시 통보 (참여 검색엔진 자동 공유)

키 파일은 빌드 시 `out/81e1629645e4ec6815d888e8983046fb.txt`로 발행 도메인 루트에
노출됩니다. 배포 후 글을 올리거나 페이지가 바뀔 때마다 통보하세요.

```bash
# 첫 일괄 통보: 사이트맵의 모든 URL을 Bing·Naver에 즉시 통보
python tools/indexnow.py

# 글 하나만 올렸을 때: 해당 URL만 통보
python tools/indexnow.py "https://homethaihub1.netlify.app/area/수원/"
```

> IndexNow는 한 엔드포인트에 보내면 Bing, Naver, Yandex, Seznam이 서로 공유합니다.
> 응답 `200`/`202`이면 정상 접수입니다.

### 2. Naver — 서치어드바이저 등록

1. https://searchadvisor.naver.com 에서 `homethaihub1.netlify.app` 사이트 등록
2. 소유확인: HTML 메타 태그 방식 (이미 전 페이지에 삽입됨)
3. 요청 → 사이트맵 제출 → `https://homethaihub1.netlify.app/sitemap.xml`
4. RSS 제출 → `https://homethaihub1.netlify.app/rss.xml`

### 3. Google — 서치 콘솔 등록

1. https://search.google.com/search-console 에서 URL 접두어로 도메인 등록
2. 소유확인: HTML 태그 방식 (이미 전 페이지에 삽입됨)
3. Sitemaps → `sitemap.xml` 제출

> 참고: 구글은 IndexNow에 참여하지 않습니다. 구글 Indexing API는 공식적으로
> 채용공고(JobPosting)·실시간방송(BroadcastEvent)만 지원하므로 일반 페이지에는
> 사용할 수 없습니다. 또한 구글·빙의 sitemap ping 엔드포인트는 2023년 폐지되었습니다.
> 따라서 구글은 서치 콘솔 사이트맵 제출이 사실상 가장 빠르고 안정적인 방법입니다.

## 키/도메인 변경 시

- 도메인: 각 `scripts/*.mjs`의 `siteUrl` (또는 빌드 시 `SITE_URL` 환경변수)
- IndexNow 키: `scripts/patch-indexnow-key.mjs`의 `INDEXNOW_KEY`와
  `tools/indexnow.py`의 `KEY`를 **동일하게** 유지
- 소유확인 코드: `scripts/patch-search-verification.mjs`
