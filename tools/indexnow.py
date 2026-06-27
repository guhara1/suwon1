#!/usr/bin/env python3
"""IndexNow 즉시 색인 통보 도구.

IndexNow 참여 검색엔진(Bing, Naver, Yandex, Seznam)에 URL 변경을 즉시 통보합니다.
하나의 엔드포인트에 제출하면 참여 검색엔진끼리 자동으로 공유합니다.

사용법:
  # 사이트맵의 모든 URL을 일괄 통보 (첫 등록 시)
  python tools/indexnow.py

  # 특정 URL만 통보 (글 하나 올렸을 때)
  python tools/indexnow.py https://homethaihub1.netlify.app/area/수원/

환경변수로 도메인/키를 덮어쓸 수 있습니다:
  SITE_URL, INDEXNOW_KEY
"""
import os
import sys
import json
import urllib.request
import urllib.error
import xml.etree.ElementTree as ET

SITE_URL = os.environ.get("SITE_URL", "https://homethaihub1.netlify.app").rstrip("/")
HOST = SITE_URL.split("://", 1)[-1]
KEY = os.environ.get("INDEXNOW_KEY", "81e1629645e4ec6815d888e8983046fb")
KEY_LOCATION = f"{SITE_URL}/{KEY}.txt"

# IndexNow 엔드포인트. 한 곳에만 보내면 참여 검색엔진끼리 공유합니다.
ENDPOINT = "https://api.indexnow.org/indexnow"

NS = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}


def urls_from_sitemap():
    """배포된 sitemap.xml에서 모든 URL을 읽어옵니다."""
    sitemap_url = f"{SITE_URL}/sitemap.xml"
    try:
        with urllib.request.urlopen(sitemap_url, timeout=30) as resp:
            data = resp.read()
    except urllib.error.URLError as exc:
        print(f"사이트맵을 불러오지 못했습니다 ({sitemap_url}): {exc}", file=sys.stderr)
        sys.exit(1)
    root = ET.fromstring(data)
    return [loc.text.strip() for loc in root.findall(".//sm:loc", NS) if loc.text]


def submit(urls):
    """URL 목록을 IndexNow에 일괄 제출합니다."""
    if not urls:
        print("통보할 URL이 없습니다.")
        return
    payload = json.dumps({
        "host": HOST,
        "key": KEY,
        "keyLocation": KEY_LOCATION,
        "urlList": urls,
    }).encode("utf-8")
    req = urllib.request.Request(
        ENDPOINT,
        data=payload,
        headers={"Content-Type": "application/json; charset=utf-8"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            status = resp.status
            body = resp.read().decode("utf-8", "replace")
    except urllib.error.HTTPError as exc:
        status = exc.code
        body = exc.read().decode("utf-8", "replace")
    except urllib.error.URLError as exc:
        print(f"IndexNow 통보 실패: {exc}", file=sys.stderr)
        sys.exit(1)

    # 200 = 성공, 202 = 접수됨(키 검증 대기). 둘 다 정상.
    print(f"IndexNow 응답 {status} — {len(urls)}개 URL 통보")
    if body.strip():
        print(body.strip())
    if status not in (200, 202):
        print("키 파일이 배포되었는지, 키 값이 일치하는지 확인하세요.", file=sys.stderr)
        sys.exit(1)


def main():
    args = [a for a in sys.argv[1:] if a.strip()]
    urls = args if args else urls_from_sitemap()
    print(f"호스트: {HOST}")
    print(f"키 위치: {KEY_LOCATION}")
    submit(urls)


if __name__ == "__main__":
    main()
