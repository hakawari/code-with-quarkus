// ── 챔피언 데이터 ──────────────────────────────────────────
const CHAMPIONS = [
    { name: '아트록스', engName: 'Aatrox', role: '전사', lane: '탑', img: 'image/Aatrox.webp', difficulty: '상' },
    { name: '애니비아', engName: 'Anivia', role: '마법사', lane: '미드', img: 'image/Anivia.webp', difficulty: '중' },
    { name: '브라이어', engName: 'Briar', role: '전사', lane: '정글', img: 'image/Briar.webp', difficulty: '상' },
    { name: '잭스', engName: 'Jax', role: '전사', lane: '탑/정글', img: 'image/Jax.webp', difficulty: '중' },
    { name: '징크스', engName: 'Jinx', role: '원거리', lane: '봇', img: 'image/Jinx.webp', difficulty: '하' },
    { name: '멜', engName: 'Mel', role: '마법사', lane: '미드', img: 'image/Mel.webp', difficulty: '중' },
    { name: '리븐', engName: 'Riven', role: '전사', lane: '탑', img: 'image/Riven.webp', difficulty: '상' },
    { name: '사일러스', engName: 'Sylas', role: '마법사', lane: '미드', img: 'image/Sylas.webp', difficulty: '상' },
    { name: '유나라', engName: 'Yunara', role: '원거리', lane: '봇', img: 'image/Yunara.webp', difficulty: '상' },
    { name: '자헨', engName: 'Zaahen', role: '전사', lane: '탑', img: 'image/Zaahen.webp', difficulty: '상' },
];

// ── 뉴스 데이터 ──────────────────────────────────────────────
const NEWS = [
    { title: '새로운 챔피언 출시', desc: '2026 루나 레벨 이벤트! 신규 챔피언과 함께하는 특별한 시즌.', category: '게임업데이트' },
    { title: '패치노트 16.4', desc: '챔피언 밸런스 및 아이템 업데이트 내용을 확인하세요.', category: '패치노트' },
];

// ── 검색 실행 ────────────────────────────────────────────────
function performSearch(query) {
    const q = query.trim().toLowerCase(); // 앞뒤 공백 제거, 소문자 변환
    if (!q) {
        showMainScreen();
        return;
    }

    // 검색어 표시
    document.getElementById('searchKeywordDisplay').textContent = `"${query}"`;

    // 챔피언 데이터에서 이름, 영문명, 역할군, 라인 중 하나라도 검색어에 포함되면
    const champResults = CHAMPIONS.filter(c =>
        c.name.includes(q) || c.engName.toLowerCase().includes(q) ||
        c.role.includes(q) || c.lane.includes(q)
    );

    // 뉴스 데이터에서 제목, 설명, 카테고리 중 하나라도 검색어에 포함되면
    const newsResults = NEWS.filter(n =>
        n.title.toLowerCase().includes(q) || n.desc.toLowerCase().includes(q) || n.category.toLowerCase().includes(q)
    );

    // 검색 결과 개수 표시
    document.getElementById('champCount').textContent = `(${champResults.length})`;
    document.getElementById('newsCount').textContent = `(${newsResults.length})`;

    // 챔피언 검색 결과 출력
    const champList = document.getElementById('championResultList');
    if (champResults.length === 0) {
        champList.innerHTML = `<div class="no-result"><h4>검색 결과 없음</h4><p>"${query}"에 해당하는 챔피언이 없습니다.</p></div>`;
    } else {
        champList.innerHTML = champResults.map(c => `
            <div class="search-result-card d-flex align-items-center p-0 overflow-hidden">
                <img src="${c.img}" alt="${c.name}">
                <div class="p-3">
                    <div style="font-weight:700; font-size:1rem; color:#111;">${c.name} <span style="color:#888; font-size:0.85rem;">(${c.engName})</span></div>
                    <div style="color:#555; font-size:0.9rem; margin-top:4px;">역할: ${c.role} &nbsp;|&nbsp; 라인: ${c.lane} &nbsp;|&nbsp; 난이도: ${c.difficulty}</div>
                </div>
            </div>
        `).join('');
    }

    // 뉴스 검색 결과 출력
    const newsList = document.getElementById('newsResultList');
    if (newsResults.length === 0) {
        newsList.innerHTML = `<div class="no-result"><h4>검색 결과 없음</h4><p>"${query}"에 해당하는 뉴스가 없습니다.</p></div>`;
    } else {
        newsList.innerHTML = newsResults.map(n => `
            <div class="search-result-card p-3">
                <span style="font-size:0.75rem; background:#c8253a; color:#fff; padding:2px 8px; border-radius:3px;">${n.category}</span>
                <div style="font-weight:700; font-size:1rem; color:#111; margin-top:8px;">${n.title}</div>
                <div style="color:#555; font-size:0.9rem; margin-top:4px;">${n.desc}</div>
            </div>
        `).join('');
    }

    // 챔피언 탭이 먼저 보임
    switchCategory('champion', document.querySelector('.search-category-item'));

    // 히어로 섹션 및 나머지 섹션 숨기고 결과 섹션 출력
    document.querySelector('.hero').classList.add('d-none');
    document.querySelectorAll('section:not(#searchResults)').forEach(s => s.classList.add('d-none'));
    document.getElementById('searchResults').classList.remove('d-none');
    document.getElementById('searchResults').style.display = 'block';
}

// ── 카테고리 전환 ────────────────────────────────────────────
function switchCategory(type, el) {
    document.querySelectorAll('.search-category-item').forEach(i => i.classList.remove('active'));
    el.classList.add('active');
    document.getElementById('resultChampion').style.display = type === 'champion' ? 'block' : 'none';
    document.getElementById('resultNews').style.display = type === 'news' ? 'block' : 'none';
}

// ── 메인 화면 복구 함수 ──────────────────────────────────────
function showMainScreen() {
    // 검색 결과 섹션 숨기기
    document.getElementById('searchResults').classList.add('d-none');
    document.getElementById('searchResults').style.display = 'none';

    // 히어로 섹션 및 나머지 섹션 다시 보이기
    document.querySelector('.hero').classList.remove('d-none');
    document.querySelectorAll('section:not(#searchResults)').forEach(s => {
        s.classList.remove('d-none');
    });

    // 입력창 초기화
    document.getElementById('searchInput').value = '';
}

// ── 폼 이벤트 ────────────────────────────────────────────────
document.getElementById('searchForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const query = document.getElementById('searchInput').value;
    performSearch(query);
});