// JK 필터 v2.4 - 잡코리아 모바일 검색: 업체 차단 + 반경 아코디언 그룹핑 + 클린 카드
// 동작: pageSize=1000 전체 로드 -> 차단 업체 숨김 -> 기준점 반경(5/10/20/40km) 아코디언 그룹 + 등록일 정렬
(() => {
  if (window.__jkFilter) return;
  window.__jkFilter = true;

  const KEY = 'jkBlockedCorps';
  const DEFAULT = ['디지토피아','한컴즈','오륜디지탈','가치정보기술','아이티사람들','쿡섬','이수정보','퍼브','첫눈소프트','제이투이','위즈아이앤씨'];
  const DEFAULT_VER = 3; // 기본 목록이 늘면 버전을 올려 기존 저장 목록에도 병합
  const DIST = {"서울종로구":[37.5949,126.9773],"서울중구":[37.5601,126.9959],"서울용산구":[37.5313,126.9799],"서울성동구":[37.551,127.041],"서울광진구":[37.5467,127.0857],"서울동대문구":[37.5821,127.0549],"서울중랑구":[37.5978,127.0929],"서울성북구":[37.6057,127.0174],"서울강북구":[37.6434,127.0112],"서울도봉구":[37.6691,127.0324],"서울노원구":[37.6524,127.075],"서울은평구":[37.6192,126.927],"서울서대문구":[37.5778,126.9391],"서울마포구":[37.5593,126.9083],"서울양천구":[37.5248,126.8555],"서울강서구":[37.5613,126.8227],"서울구로구":[37.4945,126.8565],"서울금천구":[37.4606,126.9008],"서울영등포구":[37.5223,126.9101],"서울동작구":[37.4989,126.9518],"서울관악구":[37.4673,126.9454],"서울서초구":[37.4733,127.0313],"서울강남구":[37.4967,127.0629],"서울송파구":[37.5056,127.1153],"서울강동구":[37.5504,127.147],"부산중구":[35.1054,129.0321],"부산서구":[35.1029,129.015],"부산동구":[35.1283,129.0448],"부산영도구":[35.0787,129.0648],"부산부산진구":[35.1653,129.0431],"부산동래구":[35.2062,129.0791],"부산남구":[35.1253,129.0944],"부산북구":[35.2293,129.0234],"부산해운대구":[35.1937,129.1536],"부산사하구":[35.0894,128.9732],"부산금정구":[35.2589,129.0915],"부산강서구":[35.1547,128.9028],"부산연제구":[35.1824,129.083],"부산수영구":[35.1612,129.1114],"부산사상구":[35.158,128.9866],"부산기장군":[35.2979,129.201],"대구중구":[35.8665,128.5935],"대구동구":[35.9345,128.6857],"대구서구":[35.8751,128.5497],"대구남구":[35.8351,128.5853],"대구북구":[35.9289,128.5774],"대구수성구":[35.8338,128.6612],"대구달서구":[35.8277,128.5289],"대구달성군":[35.7324,128.5094],"인천중구":[37.476,126.4681],"인천동구":[37.4833,126.6391],"인천남구":[37.4525,126.6646],"인천연수구":[37.394,126.6482],"인천남동구":[37.4309,126.7265],"인천부평구":[37.4966,126.7211],"인천계양구":[37.5573,126.7346],"인천서구":[37.5595,126.6521],"인천강화군":[37.7054,126.444],"인천옹진군":[37.9538,124.675],"광주동구":[35.1174,126.9495],"광주서구":[35.1356,126.8505],"광주남구":[35.0941,126.8569],"광주북구":[35.1933,126.9254],"광주광산구":[35.1651,126.7529],"대전동구":[36.324,127.4751],"대전중구":[36.2808,127.4111],"대전서구":[36.2804,127.3452],"대전유성구":[36.3767,127.3333],"대전대덕구":[36.4123,127.4401],"울산중구":[35.5711,129.3082],"울산남구":[35.5155,129.3293],"울산동구":[35.5255,129.4262],"울산북구":[35.6101,129.3799],"울산울주군":[35.5462,129.1875],"세종세종시":[36.5606,127.2588],"경기수원시장안구":[37.314,127.0034],"경기수원시권선구":[37.2605,126.9797],"경기수원시팔달구":[37.2775,127.0164],"경기수원시영통구":[37.2749,127.0567],"경기성남시수정구":[37.4353,127.1042],"경기성남시중원구":[37.4335,127.164],"경기성남시분당구":[37.3794,127.106],"경기의정부시":[37.7362,127.0684],"경기안양시만안구":[37.4041,126.9113],"경기안양시동안구":[37.4003,126.9554],"경기부천시":[37.5042,126.7887],"경기광명시":[37.4452,126.8647],"경기평택시":[37.0155,126.9937],"경기동두천시":[37.9165,127.0779],"경기안산시상록구":[37.3157,126.8706],"경기안산시단원구":[37.2438,126.5962],"경기고양시덕양구":[37.6557,126.8786],"경기고양시일산동구":[37.6798,126.7973],"경기고양시일산서구":[37.6803,126.7278],"경기과천시":[37.4339,127.0027],"경기구리시":[37.5992,127.1312],"경기남양주시":[37.6625,127.2436],"경기오산시":[37.1633,127.0512],"경기시흥시":[37.3861,126.7836],"경기군포시":[37.3435,126.9212],"경기의왕시":[37.3623,126.9895],"경기하남시":[37.5228,127.2059],"경기용인시처인구":[37.2033,127.2529],"경기용인시기흥구":[37.2675,127.1213],"경기용인시수지구":[37.3335,127.0715],"경기파주시":[37.8555,126.8096],"경기이천시":[37.2099,127.4809],"경기안성시":[37.035,127.3028],"경기김포시":[37.6817,126.6263],"경기화성시":[37.1639,126.8605],"경기광주시":[37.4031,127.3012],"경기양주시":[37.8086,127.0012],"경기포천시":[37.9699,127.2504],"경기여주시":[37.3025,127.6157],"경기연천군":[38.0971,127.0239],"경기가평군":[37.8186,127.4502],"경기양평군":[37.518,127.5792],"강원춘천시":[37.8899,127.74],"강원원주시":[37.3083,127.9295],"강원강릉시":[37.7092,128.8324],"강원동해시":[37.5069,129.0558],"강원태백시":[37.1724,128.9801],"강원속초시":[38.176,128.5195],"강원삼척시":[37.2775,129.122],"강원홍천군":[37.7449,128.0745],"강원횡성군":[37.509,128.0771],"강원영월군":[37.204,128.5001],"강원평창군":[37.557,128.4828],"강원정선군":[37.3788,128.739],"강원철원군":[38.2438,127.4135],"강원화천군":[38.1384,127.6852],"강원양구군":[38.1781,128.0012],"강원인제군":[38.069,128.2633],"강원고성군":[38.3774,128.3998],"강원양양군":[38.0046,128.5953],"충북충주시":[37.0152,127.8956],"충북제천시":[37.06,128.1409],"충북청주시상당구":[36.5922,127.585],"충북청주시서원구":[36.5476,127.4386],"충북청주시흥덕구":[36.647,127.3692],"충북청주시청원구":[36.7206,127.4913],"충북보은군":[36.49,127.7294],"충북옥천군":[36.3204,127.6566],"충북영동군":[36.1597,127.8143],"충북진천군":[36.871,127.4404],"충북괴산군":[36.7697,127.8296],"충북음성군":[36.9762,127.6142],"충북단양군":[36.9945,128.3879],"충북증평군":[36.7866,127.6046],"충남천안시동남구":[36.7641,127.221],"충남천안시서북구":[36.8927,127.1617],"충남공주시":[36.4799,127.075],"충남보령시":[36.3405,126.6041],"충남아산시":[36.8074,126.9801],"충남서산시":[36.7841,126.4637],"충남논산시":[36.1909,127.1578],"충남계룡시":[36.2917,127.2345],"충남당진시":[36.9031,126.6538],"충남금산군":[36.119,127.4784],"충남부여군":[36.2464,126.857],"충남서천군":[36.1071,126.7041],"충남청양군":[36.4306,126.853],"충남홍성군":[36.5701,126.6258],"충남예산군":[36.6706,126.7842],"충남태안군":[36.7728,126.2574],"전북전주시완산구":[35.7921,127.1196],"전북전주시덕진구":[35.8588,127.1126],"전북군산시":[35.9521,126.7371],"전북익산시":[36.0232,126.9895],"전북정읍시":[35.6027,126.9059],"전북남원시":[35.4225,127.442],"전북김제시":[35.8069,126.8961],"전북완주군":[35.9227,127.2231],"전북진안군":[35.8289,127.4301],"전북무주군":[35.9394,127.713],"전북장수군":[35.6576,127.5444],"전북임실군":[35.5982,127.2366],"전북순창군":[35.4336,127.0901],"전북고창군":[35.449,126.616],"전북부안군":[35.6801,126.6551],"전남목포시":[34.8102,126.4071],"전남여수시":[34.7799,127.6431],"전남순천시":[34.9945,127.3894],"전남나주시":[34.9886,126.7204],"전남광양시":[35.0269,127.6509],"전남담양군":[35.2915,126.9953],"전남곡성군":[35.2166,127.2635],"전남구례군":[35.2368,127.5031],"전남고흥군":[34.6226,127.3174],"전남보성군":[34.8144,127.161],"전남화순군":[35.0082,127.0335],"전남장흥군":[34.6757,126.9218],"전남강진군":[34.6204,126.7722],"전남해남군":[34.5589,126.5117],"전남영암군":[34.797,126.6262],"전남무안군":[34.9537,126.4254],"전남함평군":[35.1127,126.5355],"전남영광군":[35.2784,126.4615],"전남장성군":[35.3296,126.7686],"전남완도군":[34.3445,126.6989],"전남진도군":[34.4581,126.2431],"전남신안군":[34.8661,126.3121],"경북포항시남구":[35.9585,129.4378],"경북포항시북구":[36.1651,129.2343],"경북경주시":[35.8266,129.236],"경북김천시":[36.0605,128.0778],"경북안동시":[36.5803,128.78],"경북구미시":[36.2073,128.3555],"경북영주시":[36.8705,128.5976],"경북영천시":[36.0158,128.9426],"경북상주시":[36.4296,128.067],"경북문경시":[36.6908,128.1487],"경북경산시":[35.8341,128.8091],"경북군위군":[36.1701,128.6481],"경북의성군":[36.362,128.615],"경북청송군":[36.357,129.0574],"경북영양군":[36.6964,129.145],"경북영덕군":[36.4825,129.3176],"경북청도군":[35.6729,128.7865],"경북고령군":[35.7372,128.3068],"경북성주군":[35.9072,128.2333],"경북칠곡군":[36.0155,128.4626],"경북예천군":[36.6539,128.4224],"경북봉화군":[36.9342,128.913],"경북울진군":[36.9041,129.3124],"경북울릉군":[37.5024,130.861],"경남진주시":[35.2052,128.1298],"경남통영시":[34.9005,128.3952],"경남사천시":[35.0508,128.0378],"경남김해시":[35.2722,128.8452],"경남밀양시":[35.4985,128.7897],"경남거제시":[34.8664,128.6254],"경남양산시":[35.4019,129.041],"경남창원시의창구":[35.3091,128.6495],"경남창원시성산구":[35.1961,128.6719],"경남창원시마산합포구":[35.1365,128.4848],"경남창원시마산회원구":[35.2323,128.5366],"경남창원시진해구":[35.1296,128.7375],"경남의령군":[35.3924,128.2771],"경남함안군":[35.291,128.4309],"경남창녕군":[35.5083,128.4929],"경남고성군":[35.0163,128.2908],"경남남해군":[34.8095,127.9272],"경남하동군":[35.1376,127.7791],"경남산청군":[35.3686,127.8844],"경남함양군":[35.5517,127.7221],"경남거창군":[35.7326,127.9041],"경남합천군":[35.5767,128.1416],"제주제주시":[33.438,126.5284],"제주서귀포시":[33.3248,126.5818],"서울":[37.5539,126.9895],"부산":[35.1648,129.0562],"대구":[35.8542,128.5864],"인천":[37.5509,126.4373],"광주":[35.1411,126.8671],"대전":[36.3349,127.401],"울산":[35.5537,129.3262],"세종":[36.5606,127.2588],"경기":[37.4646,127.0485],"강원":[37.747,128.3562],"충북":[36.7108,127.7141],"충남":[36.5232,126.882],"전북":[35.7312,127.1141],"전남":[34.8993,126.8801],"경북":[36.3348,128.8236],"경남":[35.2538,128.3543],"제주":[33.3814,126.5551]};
  const BASE = { name: '기흥구 고매동', coord: [37.2309, 127.1142] }; // 고매동 관할 기흥동 행정동 중심
  DIST['경기화성시'] = [37.1985, 127.0923]; // 화성시는 동탄(동탄1~6동 평균) 방면 기준으로 계산
  const BANDS = [
    { id: 'b5', label: '5km 이내' },
    { id: 'b10', label: '5~10km' },
    { id: 'b20', label: '10~20km' },
    { id: 'b40', label: '20~40km' },
    { id: 'over', label: '40km 초과' },
    { id: 'unknown', label: '지역 미상' }
  ];

  const save = l => localStorage.setItem(KEY, JSON.stringify(l));
  function loadBlocked() {
    let saved = null;
    try { const v = JSON.parse(localStorage.getItem(KEY) || 'null'); if (Array.isArray(v)) saved = v; } catch (e) {}
    const list = saved ? saved.slice() : DEFAULT.slice();
    const ver = parseInt(localStorage.getItem('jkDefaultVer') || '0', 10) || 0;
    if (ver < DEFAULT_VER) {
      DEFAULT.forEach(c => { if (!list.includes(c)) list.push(c); });
      save(list);
      localStorage.setItem('jkDefaultVer', String(DEFAULT_VER));
    }
    return list;
  }
  let blocked = loadBlocked();
  // LIKE/contains 매칭: 법인 표기(㈜·(주)·주식회사 등)와 공백·기호를 전부 제거하고 양방향 포함 검사
  const norm = s => (s || '')
    .replace(/주식회사|유한회사|합자회사|㈜|㈒|\(주\)|\(유\)/g, '')
    .replace(/[^0-9A-Za-z가-힣]/g, '')
    .toLowerCase();
  const isBlocked = corp => {
    const nc = norm(corp);
    if (!nc) return false;
    return blocked.some(b => {
      const nb = norm(b);
      if (!nb) return false;
      if (nc.includes(nb)) return true; // 공고 업체명이 차단어 포함 (기본 contains)
      return nc.length >= 4 && nb.includes(nc); // 공고명이 짧게 잘린 경우만 역방향 허용 (짧은 이름 오탐 방지)
    });
  };
  const corpOf = item => { const el = item.querySelector('.item-corp_name'); return el ? el.textContent.trim() : ''; };
  const getLS = (k, d) => { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } };
  const setLS = (k, v) => localStorage.setItem(k, JSON.stringify(v));

  function siteTotalCount() {
    const el = document.querySelector('.filter-total_result');
    if (!el) return 0;
    let n = parseInt(el.getAttribute('data-filteragicnt') || '0', 10) || 0;
    if (!n) { const st = el.querySelector('strong'); if (st) n = parseInt(st.textContent.replace(/[^\d]/g, ''), 10) || 0; }
    return n;
  }
  function havKm(a, b) {
    const R = 6371, rad = Math.PI / 180;
    const dLa = (b[0] - a[0]) * rad, dLo = (b[1] - a[1]) * rad;
    const h = Math.sin(dLa / 2) ** 2 + Math.cos(a[0] * rad) * Math.cos(b[0] * rad) * Math.sin(dLo / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
  }
  function regMinOf(item, now) {
    const el = item.querySelector('.item-dday');
    const t = el ? el.textContent.trim() : '';
    let m = t.match(/(\d+)\s*분\s*전/); if (m) return +m[1];
    m = t.match(/(\d+)\s*시간\s*전/); if (m) return +m[1] * 60;
    m = t.match(/(\d+)\s*일\s*전/); if (m) return +m[1] * 1440;
    m = t.match(/(\d{1,2})\/(\d{1,2})/);
    if (m) { let dt = new Date(now.getFullYear(), +m[1] - 1, +m[2]); if (dt > now) dt = new Date(now.getFullYear() - 1, +m[1] - 1, +m[2]); return Math.round((now - dt) / 60000); }
    if (/오늘/.test(t)) return 0;
    return null;
  }
  function locOf(item) {
    const el = item.querySelector('.item-condition_location');
    const raw = el ? el.textContent.trim() : '';
    let s = raw.replace(/\s+/g, '').replace(/외$/, '');
    let wide = false;
    if (/전지역$/.test(s)) { wide = true; s = s.replace(/전지역$/, ''); }
    let coord = DIST[s] || null;
    if (!coord && s === '인천서해구') coord = DIST['인천서구'] || null;
    if (!coord && s.indexOf('전남광주') === 0) coord = DIST['전남' + s.slice(4)] || DIST['광주' + s.slice(4)] || null;
    return { raw, coord, wide, dongtan: s === '경기화성시' };
  }
  function bandOf(km) {
    if (km === null) return 'unknown';
    if (km <= 5) return 'b5';
    if (km <= 10) return 'b10';
    if (km <= 20) return 'b20';
    if (km <= 40) return 'b40';
    return 'over';
  }

  let allItems = []; // 서버 순서(등록일 내림차순) 그대로 보존
  let badge = null, groupsEl = null, barEl = null;

  function applyFilter() {
    let hidden = 0;
    allItems.forEach(it => {
      const b = isBlocked(corpOf(it));
      it.style.display = b ? 'none' : '';
      if (b) hidden++;
    });
    const pag = document.querySelector('.tplPagination-wrap');
    if (pag) pag.style.display = 'none';
    if (badge) {
      const site = siteTotalCount();
      const loaded = allItems.length;
      let label = '전체 ' + (site || loaded) + ' · 로드 ' + loaded + ' · 차단 ' + hidden + ' · 표시 ' + (loaded - hidden);
      if (site && loaded < site) label += ' · ⚠ 일부만 로드됨';
      badge.textContent = label + ' · 목록편집';
    }
    return hidden;
  }

  function ensureStyle() {
    if (document.getElementById('jkStyle')) return;
    const st = document.createElement('style');
    st.id = 'jkStyle';
    st.textContent = [
      '.jk-bar{position:sticky;top:0;z-index:70;background:#fff;border-bottom:1px solid #d9dee7;padding:8px 6px;font-size:13px;line-height:1.9}',
      '.jk-chip{border:1px solid #b8c0cd;background:#fff;border-radius:999px;padding:3px 10px;margin:1px;font-size:12px;color:#333}',
      '.jk-chip.on{background:#2563eb;border-color:#2563eb;color:#fff;font-weight:700}',
      '.jk-band{border-bottom:6px solid #eef1f5}',
      '.jk-band-head{width:100%;text-align:left;background:#f2f5fa;border:0;border-bottom:1px solid #dde3ec;padding:13px 14px;font-size:15px;font-weight:700;color:#1c2733}',
      '.jk-band-head .cnt{color:#2563eb}',
      '.jk-meta{font-size:11px;color:#2563eb;padding:0 12px 8px}',
      '.jk-new{box-shadow:inset 4px 0 0 #f59e0b}',
      // 클린 모드: 광고·연관검색어·파워링크·합격축하금 섹션 제거
      '.section-keyword,.section-item_swiper,.box-power-link,.divAdBanner{display:none!important}',
      // 카드: 배지(합격축하금·이직하기 딱 등)·업체 로고/이름·조건·등록뱃지·스크랩 숨기고 제목만
      '.recruit-item .bedges,.recruit-item .item-corp,.recruit-item .item-condition,.recruit-item .item-reward,.recruit-item .button-scrap,.recruit-item input.input-checkbox{display:none!important}',
      '.recruit-item{padding:12px 12px 10px!important;min-height:0!important}',
      '.recruit-item .item-title{display:-webkit-box!important;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden!important;font-size:15px!important;font-weight:600!important;line-height:1.4!important;color:#111!important;white-space:normal!important}',
      // 그룹으로 옮기면 사이트 CSS(.section-content_wide 자손 선택자)가 끊겨 전체-카드 링크 오버레이가 사라지므로 여기서 복원
      '#jkGroups .recruit-item{position:relative}',
      '#jkGroups .section-item{background-color:#fff}',
      '#jkGroups .section-item_link{position:absolute!important;top:0;bottom:0;left:0;right:0;font-size:0;z-index:1;display:block}'
    ].join('\n');
    document.head.appendChild(st);
  }

  function organize() {
    if (!groupsEl) return;
    const base = BASE;
    const dir = getLS('jkSortDir', 'asc'); // asc=오래된순(등록일 오름차순), desc=최신순
    const openState = Object.assign({ b5: true, b10: true, b20: true, b40: false, over: false, unknown: false }, getLS('jkBandOpen', {}));
    const now = new Date();

    // 모든 아이템을 원본 리스트로 되돌린 뒤 다시 배치 (재실행 안전)
    const listWrap = document.querySelector('.section-content_wide[role="list"]');
    allItems.forEach(it => { if (listWrap) listWrap.appendChild(it); });

    const groups = {}; BANDS.forEach(b => groups[b.id] = []);
    allItems.forEach((it, idx) => {
      if (isBlocked(corpOf(it))) return;
      const loc = locOf(it);
      const km = loc.coord ? havKm(base.coord, loc.coord) : null;
      const reg = regMinOf(it, now);
      groups[bandOf(km)].push({ it, idx, km, reg, loc });
    });
    const cmp = dir === 'asc'
      ? (a, b) => ((b.reg ?? -1) - (a.reg ?? -1)) || (b.idx - a.idx)
      : (a, b) => ((a.reg ?? 1e12) - (b.reg ?? 1e12)) || (a.idx - b.idx);

    groupsEl.innerHTML = '';
    const quick = [];
    BANDS.forEach(band => {
      const arr = groups[band.id].sort(cmp);
      if (!arr.length) return;
      quick.push({ band, n: arr.length });
      const sec = document.createElement('div');
      sec.className = 'jk-band'; sec.id = 'jkBand-' + band.id;
      const head = document.createElement('button');
      head.type = 'button'; head.className = 'jk-band-head';
      const open = !!openState[band.id];
      head.textContent = (open ? '▾ ' : '▸ ') + band.label + ' · ';
      const cnt = document.createElement('span'); cnt.className = 'cnt'; cnt.textContent = arr.length + '건';
      head.appendChild(cnt);
      const body = document.createElement('div');
      body.style.display = open ? '' : 'none';
      head.addEventListener('click', () => {
        const cur = body.style.display !== 'none';
        body.style.display = cur ? 'none' : '';
        head.firstChild.textContent = (cur ? '▸ ' : '▾ ') + band.label + ' · ';
        const st = getLS('jkBandOpen', {}); st[band.id] = !cur; setLS('jkBandOpen', st);
      });
      arr.forEach(({ it, km, reg, loc }) => {
        let meta = it.querySelector('.jk-meta');
        if (!meta) { meta = document.createElement('div'); meta.className = 'jk-meta'; it.appendChild(meta); }
        meta.textContent = km === null
          ? '📍 거리 미상 · ' + (loc.raw || '지역 표기 없음') + ' · ' + corpOf(it)
          : '📍 약 ' + km.toFixed(1) + 'km · ' + loc.raw + (loc.wide ? ' (광역·시도 중심 기준)' : '') + (loc.dongtan ? ' (동탄 방면 기준)' : '') + ' · ' + corpOf(it);
        it.classList.toggle('jk-new', reg !== null && reg <= 60);
        body.appendChild(it);
      });
      sec.appendChild(head); sec.appendChild(body);
      groupsEl.appendChild(sec);
    });
    renderBar(dir, quick);
  }

  function renderBar(dir, quick) {
    if (!barEl) return;
    barEl.innerHTML = '';
    const mkChip = (label, on, fn) => {
      const c = document.createElement('button');
      c.type = 'button'; c.className = 'jk-chip' + (on ? ' on' : ''); c.textContent = label;
      c.addEventListener('click', fn); barEl.appendChild(c); return c;
    };
    const t1 = document.createElement('span'); t1.textContent = '기준 ' + BASE.name + ' · 정렬 '; barEl.appendChild(t1);
    mkChip('오래된순', dir === 'asc', () => { setLS('jkSortDir', 'asc'); organize(); });
    mkChip('최신순', dir === 'desc', () => { setLS('jkSortDir', 'desc'); organize(); });
    mkChip('모두 펼치기', false, () => setAllBands(true));
    mkChip('모두 접기', false, () => setAllBands(false));
    barEl.appendChild(document.createElement('br'));
    quick.forEach(({ band, n }) => mkChip(band.label + ' ' + n, false, () => {
      const st = getLS('jkBandOpen', {}); st[band.id] = true; setLS('jkBandOpen', st); organize();
      const sec = document.getElementById('jkBand-' + band.id);
      if (sec) sec.scrollIntoView({ block: 'start' });
    }));
  }
  function setAllBands(open) {
    const st = {}; BANDS.forEach(b => st[b.id] = open); setLS('jkBandOpen', st); organize();
  }

  // 공고 탭은 브라우저 기본 동작에 맡기지 않고 무조건 새 탭으로 연다 (일부 브라우저가 target=_blank를 같은 탭으로 처리하는 문제 회피)
  function forceNewTab() {
    if (window.__jkNewTab) return;
    window.__jkNewTab = true;
    document.addEventListener('click', (e) => {
      if (e.target.closest('.jk-block-chip')) return; // 차단 칩은 원래 동작 유지
      const item = e.target.closest('.recruit-item');
      if (!item) return;
      const a = item.querySelector('.section-item_link');
      if (!a || !a.href) return;
      e.preventDefault();
      e.stopPropagation();
      window.open(a.href, '_blank');
    }, true);
  }

  function renderAll() { applyFilter(); organize(); }

  function addBlocked(corp, anchor) {
    if (!confirm('[' + corp + '] 공고를 앞으로 숨길까요?')) return;
    blocked.push(corp); save(blocked);
    renderAll();
  }

  function attachChips() {
    allItems.forEach(it => {
      if (it.querySelector('.jk-block-chip')) return;
      const chip = document.createElement('button');
      chip.type = 'button'; chip.className = 'jk-block-chip'; chip.textContent = '차단';
      chip.setAttribute('style', 'position:absolute;top:8px;right:10px;z-index:5;background:#ef4444;color:#fff;border:0;border-radius:999px;font-size:11px;padding:3px 9px;');
      chip.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); addBlocked(corpOf(it), chip); });
      it.appendChild(chip);
    });
  }

  function makeBadge() {
    badge = document.createElement('button');
    badge.type = 'button';
    badge.setAttribute('style', 'position:fixed;right:12px;bottom:76px;z-index:9999;background:rgba(17,24,39,.92);color:#fff;border:0;border-radius:999px;padding:9px 14px;font-size:12px;box-shadow:0 2px 8px rgba(0,0,0,.35);');
    badge.addEventListener('click', () => {
      const v = prompt('차단할 업체명 (쉼표로 구분)', blocked.join(', '));
      if (v === null) return;
      blocked = v.split(',').map(s => s.trim()).filter(Boolean);
      save(blocked); renderAll();
    });
    document.body.appendChild(badge);
  }

  async function swapList() {
    const u = new URL(location.href);
    u.searchParams.set('pageSize', '1000');
    u.searchParams.set('pageNo', '1');
    const res = await fetch(u.toString(), { credentials: 'include' });
    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const newList = doc.querySelector('.section-content_wide[role="list"]');
    const curList = document.querySelector('.section-content_wide[role="list"]');
    if (newList && curList) curList.replaceWith(newList);
  }

  (async () => {
    try { await swapList(); } catch (e) { /* 실패 시 현재 페이지 목록으로 진행 */ }
    const listWrap = document.querySelector('.section-content_wide[role="list"]');
    if (!listWrap) return;
    allItems = [...listWrap.querySelectorAll('.recruit-item')];
    if (!allItems.length) return;
    ensureStyle();
    barEl = document.createElement('div'); barEl.className = 'jk-bar';
    groupsEl = document.createElement('div'); groupsEl.id = 'jkGroups';
    listWrap.parentNode.insertBefore(barEl, listWrap);
    listWrap.parentNode.insertBefore(groupsEl, listWrap);
    attachChips();
    forceNewTab();
    makeBadge();
    renderAll();
  })();
})();
