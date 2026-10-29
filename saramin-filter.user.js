// ==UserScript==
// @name         Saramin Filter (반경 그룹 + 차단 + 읽음)
// @namespace    https://m.saramin.co.kr/
// @version      1.0.0
// @description  사람인 모바일 검색: 업체 차단 + 기준점 반경 아코디언 그룹핑 + 클린 카드 + 읽음 태그 (지원내역 동기화는 추후 추가 예정)
// @match        https://m.saramin.co.kr/search*
// @grant        none
// @updateURL    https://cdn.jsdelivr.net/gh/wichase0124-droid/jk-filter@main/saramin-filter.user.js
// @downloadURL  https://cdn.jsdelivr.net/gh/wichase0124-droid/jk-filter@main/saramin-filter.user.js
// ==/UserScript==

// SR 필터 v1.0.0 - 사람인 모바일 검색: 업체 차단 + 반경 아코디언 그룹핑 + 클린 카드 + 읽음 태그
// 잡코리아 필터와 별도 스크립트 (사이트 구조·식별자 체계가 다름). 지원내역 동기화는 지원내역 주소 확인 후 추가 예정.
(() => {
  if (window.__srFilter) return;
  window.__srFilter = true;

  const KEY = 'srBlockedCorps';
  const DEFAULT = ['디지토피아','한컴즈','오륜디지탈','가치정보기술','아이티사람들','쿡섬','이수정보','퍼브','첫눈소프트','제이투이','위즈아이앤씨'];
  const DEFAULT_VER = 1;
  const DIST = {"서울종로구":[37.5949,126.9773],"서울중구":[37.5601,126.9959],"서울용산구":[37.5313,126.9799],"서울성동구":[37.551,127.041],"서울광진구":[37.5467,127.0857],"서울동대문구":[37.5821,127.0549],"서울중랑구":[37.5978,127.0929],"서울성북구":[37.6057,127.0174],"서울강북구":[37.6434,127.0112],"서울도봉구":[37.6691,127.0324],"서울노원구":[37.6524,127.075],"서울은평구":[37.6192,126.927],"서울서대문구":[37.5778,126.9391],"서울마포구":[37.5593,126.9083],"서울양천구":[37.5248,126.8555],"서울강서구":[37.5613,126.8227],"서울구로구":[37.4945,126.8565],"서울금천구":[37.4606,126.9008],"서울영등포구":[37.5223,126.9101],"서울동작구":[37.4989,126.9518],"서울관악구":[37.4673,126.9454],"서울서초구":[37.4733,127.0313],"서울강남구":[37.4967,127.0629],"서울송파구":[37.5056,127.1153],"서울강동구":[37.5504,127.147],"부산중구":[35.1054,129.0321],"부산서구":[35.1029,129.015],"부산동구":[35.1283,129.0448],"부산영도구":[35.0787,129.0648],"부산부산진구":[35.1653,129.0431],"부산동래구":[35.2062,129.0791],"부산남구":[35.1253,129.0944],"부산북구":[35.2293,129.0234],"부산해운대구":[35.1937,129.1536],"부산사하구":[35.0894,128.9732],"부산금정구":[35.2589,129.0915],"부산강서구":[35.1547,128.9028],"부산연제구":[35.1824,129.083],"부산수영구":[35.1612,129.1114],"부산사상구":[35.158,128.9866],"부산기장군":[35.2979,129.201],"대구중구":[35.8665,128.5935],"대구동구":[35.9345,128.6857],"대구서구":[35.8751,128.5497],"대구남구":[35.8351,128.5853],"대구북구":[35.9289,128.5774],"대구수성구":[35.8338,128.6612],"대구달서구":[35.8277,128.5289],"대구달성군":[35.7324,128.5094],"인천중구":[37.476,126.4681],"인천동구":[37.4833,126.6391],"인천남구":[37.4525,126.6646],"인천연수구":[37.394,126.6482],"인천남동구":[37.4309,126.7265],"인천부평구":[37.4966,126.7211],"인천계양구":[37.5573,126.7346],"인천서구":[37.5595,126.6521],"인천강화군":[37.7054,126.444],"인천옹진군":[37.9538,124.675],"광주동구":[35.1174,126.9495],"광주서구":[35.1356,126.8505],"광주남구":[35.0941,126.8569],"광주북구":[35.1933,126.9254],"광주광산구":[35.1651,126.7529],"대전동구":[36.324,127.4751],"대전중구":[36.2808,127.4111],"대전서구":[36.2804,127.3452],"대전유성구":[36.3767,127.3333],"대전대덕구":[36.4123,127.4401],"울산중구":[35.5711,129.3082],"울산남구":[35.5155,129.3293],"울산동구":[35.5255,129.4262],"울산북구":[35.6101,129.3799],"울산울주군":[35.5462,129.1875],"세종세종시":[36.5606,127.2588],"경기수원시장안구":[37.314,127.0034],"경기수원시권선구":[37.2605,126.9797],"경기수원시팔달구":[37.2775,127.0164],"경기수원시영통구":[37.2749,127.0567],"경기성남시수정구":[37.4353,127.1042],"경기성남시중원구":[37.4335,127.164],"경기성남시분당구":[37.3794,127.106],"경기의정부시":[37.7362,127.0684],"경기안양시만안구":[37.4041,126.9113],"경기안양시동안구":[37.4003,126.9554],"경기부천시":[37.5042,126.7887],"경기광명시":[37.4452,126.8647],"경기평택시":[37.0155,126.9937],"경기동두천시":[37.9165,127.0779],"경기안산시상록구":[37.3157,126.8706],"경기안산시단원구":[37.2438,126.5962],"경기고양시덕양구":[37.6557,126.8786],"경기고양시일산동구":[37.6798,126.7973],"경기고양시일산서구":[37.6803,126.7278],"경기과천시":[37.4339,127.0027],"경기구리시":[37.5992,127.1312],"경기남양주시":[37.6625,127.2436],"경기오산시":[37.1633,127.0512],"경기시흥시":[37.3861,126.7836],"경기군포시":[37.3435,126.9212],"경기의왕시":[37.3623,126.9895],"경기하남시":[37.5228,127.2059],"경기용인시처인구":[37.2033,127.2529],"경기용인시기흥구":[37.2675,127.1213],"경기용인시수지구":[37.3335,127.0715],"경기파주시":[37.8555,126.8096],"경기이천시":[37.2099,127.4809],"경기안성시":[37.035,127.3028],"경기김포시":[37.6817,126.6263],"경기화성시":[37.1639,126.8605],"경기광주시":[37.4031,127.3012],"경기양주시":[37.8086,127.0012],"경기포천시":[37.9699,127.2504],"경기여주시":[37.3025,127.6157],"경기연천군":[38.0971,127.0239],"경기가평군":[37.8186,127.4502],"경기양평군":[37.518,127.5792],"강원춘천시":[37.8899,127.74],"강원원주시":[37.3083,127.9295],"강원강릉시":[37.7092,128.8324],"강원동해시":[37.5069,129.0558],"강원태백시":[37.1724,128.9801],"강원속초시":[38.176,128.5195],"강원삼척시":[37.2775,129.122],"강원홍천군":[37.7449,128.0745],"강원횡성군":[37.509,128.0771],"강원영월군":[37.204,128.5001],"강원평창군":[37.557,128.4828],"강원정선군":[37.3788,128.739],"강원철원군":[38.2438,127.4135],"강원화천군":[38.1384,127.6852],"강원양구군":[38.1781,128.0012],"강원인제군":[38.069,128.2633],"강원고성군":[38.3774,128.3998],"강원양양군":[38.0046,128.5953],"충북충주시":[37.0152,127.8956],"충북제천시":[37.06,128.1409],"충북청주시상당구":[36.5922,127.585],"충북청주시서원구":[36.5476,127.4386],"충북청주시흥덕구":[36.647,127.3692],"충북청주시청원구":[36.7206,127.4913],"충북보은군":[36.49,127.7294],"충북옥천군":[36.3204,127.6566],"충북영동군":[36.1597,127.8143],"충북진천군":[36.871,127.4404],"충북괴산군":[36.7697,127.8296],"충북음성군":[36.9762,127.6142],"충북단양군":[36.9945,128.3879],"충북증평군":[36.7866,127.6046],"충남천안시동남구":[36.7641,127.221],"충남천안시서북구":[36.8927,127.1617],"충남공주시":[36.4799,127.075],"충남보령시":[36.3405,126.6041],"충남아산시":[36.8074,126.9801],"충남서산시":[36.7841,126.4637],"충남논산시":[36.1909,127.1578],"충남계룡시":[36.2917,127.2345],"충남당진시":[36.9031,126.6538],"충남금산군":[36.119,127.4784],"충남부여군":[36.2464,126.857],"충남서천군":[36.1071,126.7041],"충남청양군":[36.4306,126.853],"충남홍성군":[36.5701,126.6258],"충남예산군":[36.6706,126.7842],"충남태안군":[36.7728,126.2574],"전북전주시완산구":[35.7921,127.1196],"전북전주시덕진구":[35.8588,127.1126],"전북군산시":[35.9521,126.7371],"전북익산시":[36.0232,126.9895],"전북정읍시":[35.6027,126.9059],"전북남원시":[35.4225,127.442],"전북김제시":[35.8069,126.8961],"전북완주군":[35.9227,127.2231],"전북진안군":[35.8289,127.4301],"전북무주군":[35.9394,127.713],"전북장수군":[35.6576,127.5444],"전북임실군":[35.5982,127.2366],"전북순창군":[35.4336,127.0901],"전북고창군":[35.449,126.616],"전북부안군":[35.6801,126.6551],"전남목포시":[34.8102,126.4071],"전남여수시":[34.7799,127.6431],"전남순천시":[34.9945,127.3894],"전남나주시":[34.9886,126.7204],"전남광양시":[35.0269,127.6509],"전남담양군":[35.2915,126.9953],"전남곡성군":[35.2166,127.2635],"전남구례군":[35.2368,127.5031],"전남고흥군":[34.6226,127.3174],"전남보성군":[34.8144,127.161],"전남화순군":[35.0082,127.0335],"전남장흥군":[34.6757,126.9218],"전남강진군":[34.6204,126.7722],"전남해남군":[34.5589,126.5117],"전남영암군":[34.797,126.6262],"전남무안군":[34.9537,126.4254],"전남함평군":[35.1127,126.5355],"전남영광군":[35.2784,126.4615],"전남장성군":[35.3296,126.7686],"전남완도군":[34.3445,126.6989],"전남진도군":[34.4581,126.2431],"전남신안군":[34.8661,126.3121],"경북포항시남구":[35.9585,129.4378],"경북포항시북구":[36.1651,129.2343],"경북경주시":[35.8266,129.236],"경북김천시":[36.0605,128.0778],"경북안동시":[36.5803,128.78],"경북구미시":[36.2073,128.3555],"경북영주시":[36.8705,128.5976],"경북영천시":[36.0158,128.9426],"경북상주시":[36.4296,128.067],"경북문경시":[36.6908,128.1487],"경북경산시":[35.8341,128.8091],"경북군위군":[36.1701,128.6481],"경북의성군":[36.362,128.615],"경북청송군":[36.357,129.0574],"경북영양군":[36.6964,129.145],"경북영덕군":[36.4825,129.3176],"경북청도군":[35.6729,128.7865],"경북고령군":[35.7372,128.3068],"경북성주군":[35.9072,128.2333],"경북칠곡군":[36.0155,128.4626],"경북예천군":[36.6539,128.4224],"경북봉화군":[36.9342,128.913],"경북울진군":[36.9041,129.3124],"경북울릉군":[37.5024,130.861],"경남진주시":[35.2052,128.1298],"경남통영시":[34.9005,128.3952],"경남사천시":[35.0508,128.0378],"경남김해시":[35.2722,128.8452],"경남밀양시":[35.4985,128.7897],"경남거제시":[34.8664,128.6254],"경남양산시":[35.4019,129.041],"경남창원시의창구":[35.3091,128.6495],"경남창원시성산구":[35.1961,128.6719],"경남창원시마산합포구":[35.1365,128.4848],"경남창원시마산회원구":[35.2323,128.5366],"경남창원시진해구":[35.1296,128.7375],"경남의령군":[35.3924,128.2771],"경남함안군":[35.291,128.4309],"경남창녕군":[35.5083,128.4929],"경남고성군":[35.0163,128.2908],"경남남해군":[34.8095,127.9272],"경남하동군":[35.1376,127.7791],"경남산청군":[35.3686,127.8844],"경남함양군":[35.5517,127.7221],"경남거창군":[35.7326,127.9041],"경남합천군":[35.5767,128.1416],"제주제주시":[33.438,126.5284],"제주서귀포시":[33.3248,126.5818],"서울":[37.5539,126.9895],"부산":[35.1648,129.0562],"대구":[35.8542,128.5864],"인천":[37.5509,126.4373],"광주":[35.1411,126.8671],"대전":[36.3349,127.401],"울산":[35.5537,129.3262],"세종":[36.5606,127.2588],"경기":[37.4646,127.0485],"강원":[37.747,128.3562],"충북":[36.7108,127.7141],"충남":[36.5232,126.882],"전북":[35.7312,127.1141],"전남":[34.8993,126.8801],"경북":[36.3348,128.8236],"경남":[35.2538,128.3543],"제주":[33.3814,126.5551]};
  const BASE = { name: '기흥구 고매동', coord: [37.2309, 127.1142] };
  DIST['경기화성시'] = [37.1985, 127.0923]; // 화성시는 동탄 방면 기준
  const BANDS = [
    { id: 'b5', label: '5km 이내' },
    { id: 'b10', label: '5~10km' },
    { id: 'b20', label: '10~20km' },
    { id: 'b40', label: '20~40km' },
    { id: 'over', label: '40km 초과' },
    { id: 'unknown', label: '지역 미상' }
  ];

  const getLS = (k, d) => { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } };
  const setLS = (k, v) => localStorage.setItem(k, JSON.stringify(v));
  const save = l => localStorage.setItem(KEY, JSON.stringify(l));
  function loadBlocked() {
    let saved = null;
    try { const v = JSON.parse(localStorage.getItem(KEY) || 'null'); if (Array.isArray(v)) saved = v; } catch (e) {}
    const list = saved ? saved.slice() : DEFAULT.slice();
    const ver = parseInt(localStorage.getItem('srDefaultVer') || '0', 10) || 0;
    if (ver < DEFAULT_VER) {
      DEFAULT.forEach(c => { if (!list.includes(c)) list.push(c); });
      save(list);
      localStorage.setItem('srDefaultVer', String(DEFAULT_VER));
    }
    return list;
  }
  let blocked = loadBlocked();
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
      if (nc.includes(nb)) return true;
      return nc.length >= 4 && nb.includes(nc);
    });
  };

  let readIds = new Set(getLS('srReadIds', []));
  const markRead = id => {
    if (!id || readIds.has(id)) return;
    readIds.add(id);
    if (readIds.size > 5000) readIds = new Set([...readIds].slice(readIds.size - 5000));
    setLS('srReadIds', [...readIds]);
    const card = document.querySelector('a[data-sr-id="' + id + '"]');
    if (card) addReadTag(card);
  };

  // 카드 파싱: 카드 자체가 하나의 <a> (href에 rec_idx). 텍스트 줄 순서: 배지 · 제목 · 지역/조건 · 회사명 · 마감일
  // textContent는 블록 경계에 개행을 넣지 않으므로, 잎 요소 텍스트를 문서 순서대로 모아 줄로 삼는다
  function textLines(el) {
    const out = [];
    const walk = node => {
      if (node.nodeType === 3) { const t = node.textContent.trim(); if (t) out.push(t); return; }
      if (node.nodeType !== 1) return;
      if (node.tagName === 'SCRIPT' || node.tagName === 'STYLE') return;
      if (node.classList && (node.classList.contains('sr-chip') || node.classList.contains('sr-tag'))) return;
      if (node.children.length === 0) { const t = node.textContent.trim(); if (t) out.push(t); }
      else [...node.childNodes].forEach(walk);
    };
    walk(el);
    return out.filter((v, i) => i === 0 || v !== out[i - 1]);
  }
  const BADGE = /^(오늘 뜬|HOT|NEW|추천|긴급)$/;
  const DEADLINE = /^(~|D-|D\+|내일마감|오늘마감|상시채용|진행예정|채용시|마감)/;
  const REGION = /서울|경기|인천|부산|대구|광주|대전|울산|세종|강원|충북|충남|전북|전남|경북|경남|제주|전국|재택/;
  function parseCard(card) {
    const href = card.getAttribute('href') || '';
    const m = href.match(/rec_idx=(\d+)/);
    const id = m ? m[1] : '';
    const lines = textLines(card);
    let condIdx = -1, loc = '';
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('·') && REGION.test(lines[i])) { condIdx = i; loc = lines[i].split('·')[0].trim(); break; }
    }
    let title = '', corp = '', deadline = '';
    if (condIdx >= 0) {
      for (let i = condIdx - 1; i >= 0; i--) { if (!BADGE.test(lines[i])) { title = lines[i]; break; } }
      for (let i = condIdx + 1; i < lines.length; i++) {
        if (DEADLINE.test(lines[i])) { deadline = lines[i]; break; }
        if (!corp) corp = lines[i];
      }
      if (!deadline) { const dl = lines.slice(condIdx + 1).find(l => DEADLINE.test(l)); if (dl) deadline = dl; }
    } else {
      title = lines.find(l => !BADGE.test(l)) || '';
    }
    const isNew = /오늘 뜬/.test(card.textContent || '');
    return { id, title, corp, loc, deadline, isNew };
  }

  function distKm(a, b) {
    const R = 6371, dLa = (b[0] - a[0]) * Math.PI / 180, dLo = (b[1] - a[1]) * Math.PI / 180;
    const s = Math.sin(dLa / 2) ** 2 + Math.cos(a[0] * Math.PI / 180) * Math.cos(b[0] * Math.PI / 180) * Math.sin(dLo / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
  }
  function bandOf(loc) {
    if (!loc) return { band: 'unknown', km: null, disp: loc || '' };
    let key = loc.replace(/\s+/g, '').replace(/외.*$/, '');
    // '서울 용산구' -> '서울용산구', '경기 수원시 영통구' -> 시군구 키는 '경기수원시영통구' 형태
    let coord = DIST[key];
    if (!coord) {
      const parts = loc.split(/\s+/);
      if (parts.length >= 2) coord = DIST[(parts[0] + parts[1]).replace(/시$/,'시')] || DIST[parts[0]];
      else coord = DIST[parts[0]];
    }
    if (!coord) return { band: 'unknown', km: null, disp: loc };
    const km = distKm(BASE.coord, coord);
    const band = km <= 5 ? 'b5' : km <= 10 ? 'b10' : km <= 20 ? 'b20' : km <= 40 ? 'b40' : 'over';
    let disp = loc;
    if (key === '경기화성시') disp = loc + ' (동탄 방면 기준)';
    return { band, km, disp };
  }

  const style = document.createElement('style');
  style.textContent = `
    #srGroups { margin: 12px 8px; font-family: inherit; }
    .sr-band { border: 1px solid #ddd; border-radius: 8px; margin-bottom: 10px; overflow: hidden; }
    .sr-band-head { width: 100%; text-align: left; padding: 10px 12px; background: #f5f5f5; border: 0; font-size: 14px; font-weight: 700; cursor: pointer; }
    .sr-band-body { padding: 6px; }
    .sr-band-body > a { display: block; margin-bottom: 8px; }
    .sr-card { position: relative; }
    .sr-new { border-left: 4px solid #f97316 !important; padding-left: 6px !important; }
    .sr-tag { display: inline-block; font-size: 11px; line-height: 1.4; padding: 1px 6px; border-radius: 10px; margin: 2px 4px 2px 0; }
    .sr-tag-read { background: #e5e7eb; color: #374151; }
    .sr-chip { position: absolute; top: 6px; right: 6px; z-index: 5; font-size: 11px; color: #dc2626; background: #fff; border: 1px solid #dc2626; border-radius: 10px; padding: 1px 7px; cursor: pointer; }
    .sr-badge { position: fixed; right: 12px; bottom: 12px; z-index: 9999; background: #FFD60A; color: #000; border: 2px solid #000; border-radius: 12px; padding: 8px 10px; font-size: 12px; line-height: 1.5; box-shadow: 0 2px 8px rgba(0,0,0,.25); }
    .sr-badge button { margin: 2px; font-size: 12px; }
    .sr-clean-title { font-size: 15px; font-weight: 700; line-height: 1.4; margin-bottom: 2px; }
    .sr-clean-meta { font-size: 12px; color: #555; line-height: 1.4; }
  `;
  document.head.appendChild(style);

  let sortDir = getLS('srSortDir', 'desc'); // desc=최신순(렌더링 순서), asc=오래된순(그룹 내 역순)
  let cleanMode = getLS('srClean', true);
  let bandOpen = getLS('srBandOpen', { b5: true, b10: true, b20: true, b40: false, over: false, unknown: false });
  let groupsEl = null, badgeEl = null;

  function cards() {
    return [...document.querySelectorAll('a[href^="/job-search/view?rec_idx="]')];
  }
  function totalCount() {
    const m = document.body.textContent.match(/총\s*([\d,]+)건/);
    return m ? m[1] : '?';
  }

  function applyCard(card) {
    if (card.dataset.srDone) return;
    card.dataset.srDone = '1';
    card.classList.add('sr-card');
    if (!card.dataset.srOrig) card.dataset.srOrig = card.innerHTML; // 칩/태그 추가 전 원본 보관
    const info = parseCard(card); // 원본 HTML에서 한 번만 파싱해 dataset에 저장 (클린 후 재파싱 방지)
    card.dataset.srId = info.id;
    card.dataset.srCorp = info.corp;
    card.dataset.srLoc = info.loc;
    card.dataset.srTitle = info.title;
    card.dataset.srDeadline = info.deadline;
    card.dataset.srNew = info.isNew ? '1' : '';
    if (info.isNew) card.classList.add('sr-new');
    if (info.id && readIds.has(info.id)) addReadTag(card);
    // 차단 칩
    const chip = document.createElement('button');
    chip.type = 'button'; chip.className = 'sr-chip'; chip.textContent = '차단';
    chip.addEventListener('click', ev => {
      ev.preventDefault(); ev.stopPropagation();
      if (!info.corp) return;
      if (!blocked.includes(info.corp)) { blocked.push(info.corp); save(blocked); }
      organize();
    });
    card.appendChild(chip);
    // 읽음 기록 (캡처 단계에서 먼저 기록)
    card.addEventListener('click', () => { if (info.id) markRead(info.id); }, true);
  }
  function addReadTag(card) {
    if (card.querySelector('.sr-tag-read')) return;
    const t = document.createElement('span');
    t.className = 'sr-tag sr-tag-read'; t.textContent = '읽음';
    card.appendChild(t);
  }

  function cleanCard(card) {
    if (!cleanMode) return;
    if (card.dataset.srCleaned) return;
    const loc = card.dataset.srLoc || '', corp = card.dataset.srCorp || '';
    const title = card.dataset.srTitle || '', deadline = card.dataset.srDeadline || '';
    card.dataset.srCleaned = '1';
    const b = bandOf(loc);
    const meta = '📍 ' + (b.km !== null ? '약 ' + b.km.toFixed(1) + 'km · ' : '') + b.disp + (corp ? ' · ' + corp : '') + (deadline ? ' · ' + deadline : '');
    card.innerHTML = '';
    const ti = document.createElement('div'); ti.className = 'sr-clean-title'; ti.textContent = title || '(제목 없음)';
    const me = document.createElement('div'); me.className = 'sr-clean-meta'; me.textContent = meta;
    card.appendChild(ti); card.appendChild(me);
    if (card.dataset.srId && readIds.has(card.dataset.srId)) addReadTag(card);
    const chip = document.createElement('button');
    chip.type = 'button'; chip.className = 'sr-chip'; chip.textContent = '차단';
    chip.addEventListener('click', ev => {
      ev.preventDefault(); ev.stopPropagation();
      if (!corp) return;
      if (!blocked.includes(corp)) { blocked.push(corp); save(blocked); }
      organize();
    });
    card.appendChild(chip);
  }
  function restoreCard(card) {
    if (card.dataset.srCleaned) {
      card.innerHTML = card.dataset.srOrig || card.innerHTML;
      delete card.dataset.srCleaned; delete card.dataset.srDone;
    }
  }

  function organize() {
    const all = cards();
    if (!all.length) return;
    const listParent = all[0].parentElement;
    if (!groupsEl) {
      groupsEl = document.createElement('div');
      groupsEl.id = 'srGroups';
      listParent.parentElement.insertBefore(groupsEl, listParent);
    }
    // 원본에서 한 번 파싱(applyCard)한 뒤 클린 적용/원복 — 클린된 카드를 다시 파싱하지 않음
    all.forEach(c => { if (!c.dataset.srDone) applyCard(c); });
    all.forEach(c => { if (cleanMode) cleanCard(c); else restoreCard(c); });
    const fresh = cards();
    // 차단 집계 + 밴드 분류 (dataset 기준)
    let blockedN = 0, shown = 0;
    const byBand = {}; BANDS.forEach(b => byBand[b.id] = []);
    fresh.forEach(card => {
      const corp = card.dataset.srCorp || '';
      if (isBlocked(corp)) { blockedN++; card.style.display = 'none'; return; }
      card.style.display = '';
      shown++;
      const b = bandOf(card.dataset.srLoc || '');
      byBand[b.band].push(card);
    });
    // 그룹 렌더링
    groupsEl.innerHTML = '';
    BANDS.forEach(b => {
      const list = byBand[b.id];
      if (sortDir === 'asc') list.reverse();
      const sec = document.createElement('div');
      sec.className = 'sr-band';
      const head = document.createElement('button');
      head.type = 'button'; head.className = 'sr-band-head';
      head.textContent = (bandOpen[b.id] ? '▼ ' : '▶ ') + b.label + ' (' + list.length + ')';
      head.addEventListener('click', () => {
        bandOpen[b.id] = !bandOpen[b.id]; setLS('srBandOpen', bandOpen); organize();
      });
      sec.appendChild(head);
      const body = document.createElement('div');
      body.className = 'sr-band-body';
      body.style.display = bandOpen[b.id] ? '' : 'none';
      list.forEach(c => body.appendChild(c));
      sec.appendChild(body);
      groupsEl.appendChild(sec);
    });
    // 배지
    if (!badgeEl) {
      badgeEl = document.createElement('div');
      badgeEl.className = 'sr-badge';
      document.body.appendChild(badgeEl);
    }
    badgeEl.innerHTML = '';
    const txt = document.createElement('div');
    txt.textContent = '전체 ' + totalCount() + ' · 로드 ' + fresh.length + ' · 차단 ' + blockedN + ' · 표시 ' + shown + ' · 기준 ' + BASE.name;
    badgeEl.appendChild(txt);
    const mkBtn = (label, fn) => { const b = document.createElement('button'); b.type = 'button'; b.textContent = label; b.addEventListener('click', fn); badgeEl.appendChild(b); };
    mkBtn(sortDir === 'desc' ? '오래된순' : '최신순', () => { sortDir = sortDir === 'desc' ? 'asc' : 'desc'; setLS('srSortDir', sortDir); organize(); });
    mkBtn(cleanMode ? '클린 해제' : '클린 적용', () => { cleanMode = !cleanMode; setLS('srClean', cleanMode); organize(); });
    mkBtn('목록편집', () => {
      const cur = blocked.join(', ');
      const next = prompt('차단 업체 목록 (쉼표로 구분)', cur);
      if (next === null) return;
      blocked = next.split(',').map(s => s.trim()).filter(Boolean);
      save(blocked); organize();
    });
  }

  let timer = null;
  const schedule = () => { clearTimeout(timer); timer = setTimeout(organize, 300); };
  const mo = new MutationObserver(schedule);
  mo.observe(document.body, { childList: true, subtree: true });
  ['pageshow', 'focus', 'visibilitychange', 'popstate'].forEach(ev =>
    window.addEventListener(ev, () => { readIds = new Set(getLS('srReadIds', [])); schedule(); }));
  // 목록이 비동기로 렌더링되므로 첫 카드 등장까지 폴링
  let tries = 0;
  const iv = setInterval(() => {
    if (cards().length) { clearInterval(iv); organize(); }
    else if (++tries > 40) clearInterval(iv);
  }, 500);
})();
