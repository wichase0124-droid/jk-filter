// 삼성 인터넷용 북마크릿 원본 (이 파일을 인코딩한 한 줄 버전이 bookmarklet.txt)
// 동작: 현재 검색 URL에 pageSize=1000을 붙여 fetch -> 리스트만 통째로 교체 -> 차단 업체 숨김
// 차단 목록은 localStorage(jkBlockedCorps)에 저장되어 다음 실행 때도 유지됨
// 공고마다 붙는 '차단' 칩을 탭하면 그 업체가 목록에 추가됨
(async () => {
  const K = 'jkBlockedCorps';
  const DEFAULT = ['디지토피아', '한컴즈', '오륜디지탈', '가치정보기술', '아이티사람들', '쿡섬', '이수정보', '퍼브', '첫눈소프트'];
  const norm = (s) => (s || '').replace(/\s+/g, '').replace(/㈜|\(주\)|주식회사/g, '').toLowerCase();
  let blocked;
  try { blocked = JSON.parse(localStorage.getItem(K) || 'null'); } catch (e) {}
  if (!Array.isArray(blocked)) blocked = DEFAULT.slice();
  const save = () => { try { localStorage.setItem(K, JSON.stringify(blocked)); } catch (e) {} };
  const isBlocked = (name) => { const n = norm(name); return !!n && blocked.map(norm).some((b) => b && n.includes(b)); };

  const apply = () => {
    const items = document.querySelectorAll('.recruit-item');
    let h = 0;
    items.forEach((el) => {
      const n = el.querySelector('.item-corp_name');
      if (n && !el.dataset.jkChip) {
        el.dataset.jkChip = '1';
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.textContent = '차단';
        chip.style.cssText = 'position:relative;z-index:10;margin-left:6px;padding:1px 7px;border:1px solid #e33;border-radius:999px;background:#fff;color:#e33;font-size:10px;line-height:1.5;vertical-align:middle';
        chip.onclick = (e) => {
          e.preventDefault(); e.stopPropagation();
          const raw = n.textContent.trim();
          if (confirm("'" + raw + "' 업체 공고를 모두 숨길까요?")) { blocked.push(raw); save(); apply(); }
        };
        n.parentNode.appendChild(chip);
      }
      const hit = isBlocked(n ? n.textContent : '');
      el.style.display = hit ? 'none' : '';
      if (hit) h++;
    });
    document.querySelectorAll('.tplPagination-wrap').forEach((p) => (p.style.display = 'none'));
    let bd = document.getElementById('jkBadge');
    if (!bd) {
      bd = document.createElement('button');
      bd.id = 'jkBadge';
      bd.style.cssText = 'position:fixed;right:12px;bottom:76px;z-index:99999;padding:8px 12px;border:none;border-radius:999px;background:#222;color:#fff;font-size:12px';
      bd.onclick = () => {
        const v = prompt('차단 업체명(쉼표 구분, 부분일치)', blocked.join(', '));
        if (v === null) return;
        blocked = v.split(',').map((s) => s.trim()).filter(Boolean);
        save();
        apply();
      };
      document.body.appendChild(bd);
    }
    // 사이트가 표시하는 총건수와 실제 로드된 건수를 대조해 표기 (불일치 시 경고)
    const totalEl = document.querySelector('.filter-total_result');
    let siteTotal = 0;
    if (totalEl) {
      siteTotal = parseInt(totalEl.getAttribute('data-filteragicnt') || '0', 10) || 0;
      if (!siteTotal) {
        const st = totalEl.querySelector('strong');
        if (st) siteTotal = parseInt(st.textContent.replace(/[^\d]/g, ''), 10) || 0;
      }
    }
    const loaded = items.length;
    let label = '전체 ' + (siteTotal || loaded) + ' · 로드 ' + loaded + ' · 차단 ' + h + ' · 표시 ' + (loaded - h);
    if (siteTotal && loaded < siteTotal) label += ' · ⚠ 일부만 로드됨';
    bd.textContent = label + ' · 목록편집';
  };

  const u = new URL(location.href);
  const sz = parseInt(u.searchParams.get('pageSize') || '0', 10);
  if (sz < 1000 && !window.__jkAllLoaded) {
    u.searchParams.set('pageSize', '1000');
    u.searchParams.set('pageNo', '1');
    try {
      const html = await (await fetch(u.toString(), { credentials: 'include' })).text();
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const src = doc.querySelector('.section-content_wide[role="list"]');
      const dst = document.querySelector('.section-content_wide[role="list"]');
      if (src && dst) { dst.innerHTML = src.innerHTML; window.__jkAllLoaded = true; }
    } catch (e) {}
  }
  apply();
})();
