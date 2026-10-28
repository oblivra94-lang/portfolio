/*
 * Persona/16 — browser demo layer.
 *
 * The pages in this folder are the real output of index.php (rendered once
 * with PHP). This file stands in for the PHP back end so the site works
 * without a server: accounts, the test, scoring and saved results live in
 * this browser's storage instead of MySQL. The logic mirrors index.php:
 * do_signup(), do_login(), do_submit_test(), score() and render_result().
 */
(() => {
  'use strict';

  const DATA = {"types": {"INTJ": {"no": 1, "name": "Architect", "group": "NT", "tag": "Strategic, independent, quietly relentless.", "desc": "Architects see systems where others see chaos. They build long-range plans, question every assumption and value competence over consensus. Beneath the reserve is a fierce drive to improve whatever they touch.", "strengths": ["Strategic vision", "Independence", "High standards"], "art": "images/architect-intj.jpg"}, "INTP": {"no": 2, "name": "Logician", "group": "NT", "tag": "Curious, analytical, endlessly questioning.", "desc": "Logicians live inside ideas. They take theories apart to see how they work, chase precise definitions and are happiest with a good unsolved problem. Their detachment hides a playful, inventive mind.", "strengths": ["Original thinking", "Objectivity", "Open-mindedness"], "art": "images/logician-intp.jpg"}, "ENTJ": {"no": 3, "name": "Commander", "group": "NT", "tag": "Decisive, ambitious, born to lead.", "desc": "Commanders turn vision into plans and plans into results. They spot inefficiency instantly, take charge without waiting to be asked and thrive on hard goals. They respect anyone who pushes back with a good argument.", "strengths": ["Leadership", "Efficiency", "Confidence"], "art": "images/commander-entj.jpg"}, "ENTP": {"no": 4, "name": "Debater", "group": "NT", "tag": "Quick-witted, bold, allergic to routine.", "desc": "Debaters love the spark of a new idea and the friction of a good argument. They play devil’s advocate for fun, improvise brilliantly and lose interest the moment something becomes predictable.", "strengths": ["Ingenuity", "Charisma", "Adaptability"], "art": "images/debater-entp.jpg"}, "INFJ": {"no": 5, "name": "Advocate", "group": "NF", "tag": "Insightful, principled, quietly intense.", "desc": "Advocates read people with uncanny accuracy and carry a private, unwavering sense of purpose. Gentle on the surface and determined underneath, they often work behind the scenes to make things right.", "strengths": ["Insight", "Conviction", "Compassion"], "art": "images/advocate-infj.jpg"}, "INFP": {"no": 6, "name": "Mediator", "group": "NF", "tag": "Idealistic, gentle, fiercely authentic.", "desc": "Mediators are guided by a deep inner compass. They look for the good in people and meaning in everything, express themselves best through creative work and will not compromise on what they believe.", "strengths": ["Empathy", "Creativity", "Integrity"], "art": "images/mediator-infp.jpg"}, "ENFJ": {"no": 7, "name": "Protagonist", "group": "NF", "tag": "Warm, persuasive, people-focused.", "desc": "Protagonists rally others around a shared vision. They notice what each person needs, speak with conviction and feel most alive when they are helping someone grow.", "strengths": ["Inspiration", "Reliability", "Altruism"], "art": "images/protagonist-enfj.jpg"}, "ENFP": {"no": 8, "name": "Campaigner", "group": "NF", "tag": "Enthusiastic, imaginative, free-spirited.", "desc": "Campaigners see life as a web of exciting possibilities. They make friends easily, chase new ideas with contagious energy and need room to explore.", "strengths": ["Curiosity", "Warmth", "Communication"], "art": "images/campaigner-enfp.jpg"}, "ISTJ": {"no": 9, "name": "Logistician", "group": "SJ", "tag": "Reliable, thorough, quietly dutiful.", "desc": "Logisticians keep their word and expect the same from others. They value facts, order and proven methods, and they finish what they start without needing an audience.", "strengths": ["Responsibility", "Honesty", "Organization"], "art": "images/logistician-istj.jpg"}, "ISFJ": {"no": 10, "name": "Defender", "group": "SJ", "tag": "Caring, loyal, meticulous.", "desc": "Defenders protect the people and traditions they love. They remember the small details that matter to others and show care through steady, practical support.", "strengths": ["Supportiveness", "Patience", "Observation"], "art": "images/defender-isfj.jpg"}, "ESTJ": {"no": 11, "name": "Executive", "group": "SJ", "tag": "Organized, direct, results-driven.", "desc": "Executives bring order to chaos. They set clear rules, lead by example and believe hard work and honesty hold a community together.", "strengths": ["Dedication", "Clarity", "Strong will"], "art": "images/executive-estj.jpg"}, "ESFJ": {"no": 12, "name": "Consul", "group": "SJ", "tag": "Sociable, attentive, community-minded.", "desc": "Consuls are the glue of their circles. They host, organize and remember birthdays, and they are happiest when everyone around them feels included and looked after.", "strengths": ["Loyalty", "Sensitivity", "Practical help"], "art": "images/consul-esfj.jpg"}, "ISTP": {"no": 13, "name": "Virtuoso", "group": "SP", "tag": "Hands-on, calm, mechanically minded.", "desc": "Virtuosos learn by doing. They stay cool under pressure, love figuring out how things work and prefer action to long discussions.", "strengths": ["Composure", "Practical skill", "Spontaneity"], "art": "images/virtuoso-istp.jpg"}, "ISFP": {"no": 14, "name": "Adventurer", "group": "SP", "tag": "Artistic, sensitive, living in the moment.", "desc": "Adventurers experience the world through the senses and express it through style, art and quiet acts of kindness. They resist being boxed in and follow what feels true.", "strengths": ["Aesthetic sense", "Charm", "Openness"], "art": "images/adventurer-isfp-2.jpg"}, "ESTP": {"no": 15, "name": "Entrepreneur", "group": "SP", "tag": "Energetic, perceptive, action-first.", "desc": "Entrepreneurs read a room instantly and act before others finish thinking. They love risk, real-world problems and being in the middle of the action.", "strengths": ["Boldness", "Directness", "Perception"], "art": "images/entrepreneur-estp.jpg"}, "ESFP": {"no": 16, "name": "Entertainer", "group": "SP", "tag": "Spontaneous, playful, magnetic.", "desc": "Entertainers turn ordinary days into events. They love people and new experiences, and they bring warmth and fun wherever they go.", "strengths": ["Showmanship", "Enthusiasm", "Generosity"], "art": "images/entertainer-esfp.jpg"}}, "groups": {"NT": ["Analysts", "Rational, strategic, independent"], "NF": ["Diplomats", "Empathic, idealistic, people-first"], "SJ": ["Sentinels", "Practical, loyal, structured"], "SP": ["Explorers", "Spontaneous, hands-on, adaptable"]}, "axes": {"EI": ["Energy", "e_pct", ["E", "Extraverted", "Recharges around people and activity. Thinks out loud, acts quickly, enjoys a crowd."], ["I", "Introverted", "Recharges in quiet and solitude. Thinks before speaking, prefers depth over breadth."]], "SN": ["Mind", "s_pct", ["S", "Sensing", "Trusts facts, details and lived experience. Focused on what is real and here now."], ["N", "Intuitive", "Trusts patterns and possibilities. Focused on meaning, ideas and what could be."]], "TF": ["Nature", "t_pct", ["T", "Thinking", "Decides with logic and consistent principles, even when the truth is uncomfortable."], ["F", "Feeling", "Decides with values and empathy, weighing how a choice affects people."]], "JP": ["Tactics", "j_pct", ["J", "Judging", "Likes plans, structure and closure. Prefers to decide and move on."], ["P", "Perceiving", "Likes flexibility and open options. Prefers to adapt as things unfold."]]}, "questions": [{"id": 1, "position": 1, "dimension": "EI", "pole": "E", "statement": "You feel energized after spending an evening with a big group of people."}, {"id": 2, "position": 2, "dimension": "SN", "pole": "S", "statement": "You pay more attention to concrete facts and details than to possibilities."}, {"id": 3, "position": 3, "dimension": "TF", "pole": "T", "statement": "When deciding, logic matters more to you than how people will feel about it."}, {"id": 4, "position": 4, "dimension": "JP", "pole": "J", "statement": "You like to have a clear plan before you start anything."}, {"id": 5, "position": 5, "dimension": "EI", "pole": "I", "statement": "You prefer to think things through quietly before you speak."}, {"id": 6, "position": 6, "dimension": "SN", "pole": "N", "statement": "You often imagine how things could be completely different."}, {"id": 7, "position": 7, "dimension": "TF", "pole": "F", "statement": "You would rather be tactful than bluntly honest."}, {"id": 8, "position": 8, "dimension": "JP", "pole": "P", "statement": "You prefer to keep your options open and decide at the last minute."}, {"id": 9, "position": 9, "dimension": "EI", "pole": "E", "statement": "You easily start conversations with strangers."}, {"id": 10, "position": 10, "dimension": "SN", "pole": "S", "statement": "You trust what has worked before more than untested new ideas."}, {"id": 11, "position": 11, "dimension": "TF", "pole": "T", "statement": "You quickly notice flaws in an argument, even a friend’s."}, {"id": 12, "position": 12, "dimension": "JP", "pole": "J", "statement": "Unfinished tasks bother you until they are done."}, {"id": 13, "position": 13, "dimension": "EI", "pole": "I", "statement": "After a busy week, your ideal reset is a quiet evening alone."}, {"id": 14, "position": 14, "dimension": "SN", "pole": "N", "statement": "You are drawn to abstract ideas, theories and hidden meanings."}, {"id": 15, "position": 15, "dimension": "TF", "pole": "F", "statement": "Other people’s feelings strongly shape the choices you make."}, {"id": 16, "position": 16, "dimension": "JP", "pole": "P", "statement": "You work best in bursts of inspiration rather than on a fixed schedule."}]};
  const PAGE = document.body.dataset.p16Page || 'home';
  const TYPES = DATA.types, GROUPS = DATA.groups, AXES = DATA.axes, QUESTIONS = DATA.questions;

  /* ---------- storage: localStorage / sessionStorage, else window.name ---------- */
  const winAll = () => {
    try {
      const o = JSON.parse(window.name || '{}');
      return o && o.__p16 ? o : { __p16: 1 };
    } catch (err) {
      return { __p16: 1 };
    }
  };
  const winSet = (k, v) => {
    const o = winAll();
    if (v === null) delete o[k]; else o[k] = v;
    try { window.name = JSON.stringify(o); } catch (err) { /* ignore */ }
  };
  const makeStore = kind => {
    let s = null;
    try {
      s = kind === 'local' ? window.localStorage : window.sessionStorage;
      s.setItem('__p16probe', '1');
      s.removeItem('__p16probe');
    } catch (err) {
      s = null;
    }
    const prefix = kind + ':';
    return {
      get(k) {
        if (s) { try { return s.getItem(k); } catch (err) { /* fall through */ } }
        const v = winAll()[prefix + k];
        return v === undefined ? null : v;
      },
      set(k, v) {
        if (s) { try { s.setItem(k, v); return; } catch (err) { /* fall through */ } }
        winSet(prefix + k, v);
      },
      del(k) {
        if (s) { try { s.removeItem(k); return; } catch (err) { /* fall through */ } }
        winSet(prefix + k, null);
      },
    };
  };
  const LS = makeStore('local');
  const SS = makeStore('session');

  const getJSON = (st, k, dflt) => {
    try {
      const v = JSON.parse(st.get(k));
      return v === null || v === undefined ? dflt : v;
    } catch (err) {
      return dflt;
    }
  };
  const setJSON = (st, k, v) => st.set(k, JSON.stringify(v));

  /* ---------- the "database" ---------- */
  const DB_KEY = 'persona16.db.v1';
  const loadDB = () => {
    const d = getJSON(LS, DB_KEY, null);
    return d && Array.isArray(d.users) && Array.isArray(d.results)
      ? d
      : { users: [], results: [], seq: { user: 0, result: 0 } };
  };
  const saveDB = d => setJSON(LS, DB_KEY, d);

  /* ---------- session helpers (PHP's $_SESSION) ---------- */
  const flash = (type, message) => {
    const list = getJSON(SS, 'persona16.flash', []);
    list.push([type, message]);
    setJSON(SS, 'persona16.flash', list);
  };
  const take = (key, dflt) => {
    const v = getJSON(SS, 'persona16.' + key, dflt);
    SS.del('persona16.' + key);
    return v;
  };
  const put = (key, v) => setJSON(SS, 'persona16.' + key, v);

  const currentUser = () => {
    const uid = Number(SS.get('persona16.uid') || 0);
    if (!uid) return null;
    const db = loadDB();
    const u = db.users.find(x => x.id === uid);
    if (!u) {
      SS.del('persona16.uid');
      return null;
    }
    const mine = db.results.filter(r => r.user_id === u.id).sort(newestFirst);
    return { ...u, last_type: mine.length ? mine[0].type_code : null };
  };
  const newestFirst = (a, b) => (a.created_at < b.created_at ? 1 : a.created_at > b.created_at ? -1 : b.id - a.id);

  /* ---------- small helpers ---------- */
  const e = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[c]));
  const n2 = n => String(n).padStart(2, '0');
  const initials = name => {
    const parts = String(name).trim().split(/\s+/).filter(Boolean).slice(0, 2);
    const out = parts.map(p => Array.from(p)[0]).join('');
    return (out || '?').toUpperCase();
  };
  const pageUrl = (page, hash) => (page === 'home' ? 'index.html' : page + '.html') + (hash ? '#' + hash : '');
  const redirect = (page, hash) => {
    const target = pageUrl(page, hash);
    const here = location.pathname.split('/').pop() || 'index.html';
    if (here === target.split('#')[0]) {
      if (hash && location.hash !== '#' + hash) location.hash = hash;
      location.reload();
    } else {
      location.href = target;
    }
  };
  const nowStamp = () => {
    const d = new Date();
    return d.getFullYear() + '-' + n2(d.getMonth() + 1) + '-' + n2(d.getDate()) + ' ' + n2(d.getHours()) + ':' + n2(d.getMinutes()) + ':' + n2(d.getSeconds());
  };
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const fmtDate = (stamp, sep) => {
    const m = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})/.exec(stamp || '');
    if (!m) return '';
    return m[3] + ' ' + MONTHS[Number(m[2]) - 1] + ' ' + m[1] + sep + m[4] + ':' + m[5];
  };
  const byteLength = s => new TextEncoder().encode(s).length;

  /* ---------- password hashing (bcrypt in PHP; PBKDF2 here) ---------- */
  const hex = buf => Array.from(new Uint8Array(buf), b => b.toString(16).padStart(2, '0')).join('');
  const subtle = window.crypto && window.crypto.subtle;
  const derive = async (pass, saltHex, iter) => {
    const salt = new Uint8Array(saltHex.match(/../g).map(h => parseInt(h, 16)));
    const key = await subtle.importKey('raw', new TextEncoder().encode(pass), 'PBKDF2', false, ['deriveBits']);
    return hex(await subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations: iter }, key, 256));
  };
  const passwordHash = async pass => {
    if (!subtle) return 'plain$' + pass;
    const salt = hex(window.crypto.getRandomValues(new Uint8Array(16)));
    return 'pbkdf2$120000$' + salt + '$' + (await derive(pass, salt, 120000));
  };
  const passwordVerify = async (pass, stored) => {
    const [kind, iter, salt, hash] = String(stored).split('$');
    if (kind === 'plain') return stored === 'plain$' + pass;
    if (kind !== 'pbkdf2' || !subtle) return false;
    return (await derive(pass, salt, Number(iter))) === hash;
  };

  /* ---------- scoring: a direct port of score() ---------- */
  const score = answers => {
    const sum = { EI: 0, SN: 0, TF: 0, JP: 0 }, count = { EI: 0, SN: 0, TF: 0, JP: 0 };
    QUESTIONS.forEach(q => {
      const dim = q.dimension;
      if (!(dim in sum)) return;
      const sign = q.pole === dim[0] ? 1 : -1;
      sum[dim] += (Number(answers[q.id]) - 4) * sign;
      count[dim]++;
    });
    let code = '';
    const pct = {};
    Object.keys(sum).forEach(dim => {
      const max = 3 * Math.max(1, count[dim]);
      pct[dim] = Math.round(50 + 50 * sum[dim] / max);
      code += sum[dim] > 0 ? dim[0] : dim[1];
    });
    return [code, pct];
  };
  const AXIS_COL = { EI: 'e_pct', SN: 's_pct', TF: 't_pct', JP: 'j_pct' };
  const axisSummary = r => Object.keys(AXES).map((dim, i) => {
    const a = AXES[dim][2];
    const p = Number(r[AXES[dim][1]]);
    const letter = r.type_code[i];
    return letter + ' ' + (letter === a[0] ? p : 100 - p) + '%';
  }).join(' · ');

  /* ---------- actions (handle_post) ---------- */
  const safeNext = v => (['home', 'test', 'result'].includes(v) ? v : '');
  const EMAIL_RE = /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/;

  const doSignup = async (f, next) => {
    const name = String(f.get('name') || '').trim();
    const email = String(f.get('email') || '').trim().toLowerCase();
    const pass = String(f.get('password') || '');
    const pass2 = String(f.get('password_confirm') || '');
    const errors = {};
    const len = Array.from(name).length;
    if (len < 2 || len > 60 || /[\r\n]/.test(name)) errors.name = 'Enter a name between 2 and 60 characters.';
    if (email.length > 190 || !EMAIL_RE.test(email)) errors.email = 'Enter a valid email address.';
    if (byteLength(pass) < 8) errors.password = 'Use at least 8 characters.';
    else if (byteLength(pass) > 72) errors.password = 'Use 72 characters or fewer.';
    if (pass !== pass2) errors.password_confirm = 'The passwords don’t match.';
    const db = loadDB();
    if (!Object.keys(errors).length && db.users.some(u => u.email === email)) {
      errors.email = 'An account with this email already exists. Try logging in.';
    }
    if (Object.keys(errors).length) {
      put('errors', errors);
      put('old', { name, email });
      if (next) put('next', next);
      return redirect('signup');
    }
    const id = (db.seq.user || 0) + 1;
    db.seq.user = id;
    db.users.push({ id, name, email, password_hash: await passwordHash(pass), role: 'user', created_at: nowStamp() });
    saveDB(db);
    SS.set('persona16.uid', String(id));
    SS.del('persona16.next');
    flash('success', 'Welcome, ' + name + '. Your account is ready.');
    redirect(next || 'test');
  };

  const doLogin = async (f, next) => {
    const email = String(f.get('email') || '').trim().toLowerCase();
    const pass = String(f.get('password') || '');
    const row = loadDB().users.find(u => u.email === email);
    if (!row || !(await passwordVerify(pass, row.password_hash))) {
      put('errors', { form: 'That email and password don’t match an account.' });
      put('old', { email });
      if (next) put('next', next);
      return redirect('login');
    }
    SS.set('persona16.uid', String(row.id));
    SS.del('persona16.next');
    flash('success', 'Welcome back, ' + row.name + '.');
    redirect(next || 'home');
  };

  const doLogout = () => {
    SS.del('persona16.uid');
    flash('info', 'You are logged out. See you soon.');
    redirect('home');
  };

  const doSubmitTest = (f, user) => {
    if (!user) {
      flash('info', 'Log in to save your result.');
      put('next', 'test');
      return redirect('login');
    }
    const answers = {};
    let missing = 0;
    QUESTIONS.forEach(q => {
      const v = Number(f.get('a[' + q.id + ']') || 0);
      if (!(v >= 1 && v <= 7)) { missing++; return; }
      answers[q.id] = v;
    });
    if (missing > 0) {
      put('draft', answers);
      flash('error', 'Please answer every question — ' + missing + ' still open.');
      return redirect('test');
    }
    const [code, pct] = score(answers);
    const db = loadDB();
    const id = (db.seq.result || 0) + 1;
    db.seq.result = id;
    db.results.push({
      id, user_id: user.id, type_code: code,
      e_pct: pct.EI, s_pct: pct.SN, t_pct: pct.TF, j_pct: pct.JP,
      answers: QUESTIONS.map(q => answers[q.id]).join(','),
      created_at: nowStamp(),
    });
    saveDB(db);
    SS.del('persona16.draft');
    redirect('result', 'r' + id);
  };

  /* ---------- router guards (index.php section 11) ---------- */
  const user = currentUser();
  let halted = false;
  const halt = (page, hash) => { halted = true; redirect(page, hash); };

  if ((PAGE === 'test' || PAGE === 'result') && !user) {
    flash('info', PAGE === 'test'
      ? 'Log in or create an account to take the test — your result will be saved to your profile.'
      : 'Log in to see your results.');
    put('next', PAGE);
    halt('login');
  } else if ((PAGE === 'login' || PAGE === 'signup') && user) {
    halt('home');
  }

  /* ---------- views ---------- */
  const toastsHtml = () => {
    const items = take('flash', []);
    if (!items.length) return '';
    return '<div class="toasts" role="status" aria-live="polite">'
      + items.map(([type, message]) => '<div class="toast toast-' + e(type) + '"><span>' + e(message) + '</span><button type="button" aria-label="Dismiss">×</button></div>').join('')
      + '</div>';
  };

  const logoutForm = cls => '<form method="post" action="index.html"><input type="hidden" name="action" value="logout"><button class="' + e(cls) + '" type="submit">Log out</button></form>';

  const poster = (code, t) => {
    if (t.art) {
      return '<span class="poster has-art g-' + t.group + '">'
        + '<img src="' + e(t.art) + '" alt="' + e(t.name + ' — ' + code) + '" draggable="false" decoding="async">'
        + '<span class="p-tag"><b>' + e(code) + '</b>' + e(t.name) + '</span></span>';
    }
    const size = Math.min(21, Math.round((144 / Math.max(1, t.name.length)) * 100) / 100);
    return '<span class="poster g-' + t.group + '">'
      + '<span class="p-name" style="font-size:' + size + 'cqw">' + e(t.name) + '</span>'
      + '<span class="p-code">' + e(code) + '</span>'
      + '<span class="p-orb" aria-hidden="true"><i></i></span>'
      + '<span class="p-no" aria-hidden="true">N°' + n2(t.no) + '</span>'
      + '</span>';
  };

  const hydrateHome = () => {
    if (!user) return;
    const auth = document.querySelector('.side-auth');
    const row = auth && auth.querySelector('.side-row');
    if (row) {
      row.outerHTML = '<div class="me">'
        + '<span class="avatar">' + e(initials(user.name)) + '</span>'
        + '<span class="me-txt"><b>' + e(user.name) + '</b><small class="mono">' + (user.last_type ? 'Last result · ' + e(user.last_type) : 'No result yet') + '</small></span>'
        + '</div>'
        + '<div class="side-row">'
        + (user.last_type ? '<a class="btn btn-ghost btn-sm" href="result.html">My results</a>' : '')
        + logoutForm('btn btn-ghost btn-sm')
        + '</div>';
    }
    if (user.last_type) {
      const sub = document.querySelector('#types .sec-sub');
      if (sub) sub.textContent = 'Your latest result is highlighted. ' + sub.textContent;
      const card = document.querySelector('.tcard[data-type="' + user.last_type + '"]');
      if (card) {
        card.classList.add('is-mine');
        const codeEl = card.querySelector('.tc-code');
        if (codeEl) codeEl.insertAdjacentHTML('beforebegin', '<span class="you mono">You</span>');
      }
    }
  };

  const hydrateAuth = () => {
    const errors = take('errors', {});
    const old = take('old', {});
    const next = safeNext(take('next', ''));
    const form = document.querySelector('.auth-form');
    if (!form) return;
    const nextInput = form.querySelector('input[name="next"]');
    if (nextInput) nextInput.value = next;
    if (next) put('next', next);
    ['name', 'email'].forEach(k => {
      const input = form.querySelector('input[name="' + k + '"]');
      if (input && old[k]) input.value = old[k];
    });
    if (errors.form) {
      form.insertAdjacentHTML('beforebegin', '<p class="form-error" role="alert">' + e(errors.form) + '</p>');
    }
    Object.keys(errors).forEach(k => {
      if (k === 'form') return;
      const input = form.querySelector('input[name="' + k + '"]');
      const field = input && input.closest('.field');
      if (!field) return;
      field.classList.add('has-err');
      input.setAttribute('aria-invalid', 'true');
      input.setAttribute('aria-describedby', 'f-' + k + '-err');
      field.insertAdjacentHTML('beforeend', '<small class="field-err" id="f-' + k + '-err">' + e(errors[k]) + '</small>');
    });
  };

  const hydrateTest = () => {
    const intro = document.querySelector('.test-intro');
    if (intro) intro.textContent = intro.textContent.replace('P16DEMONAME', user.name);
    const draft = take('draft', {});
    Object.keys(draft).forEach(qid => {
      const input = document.querySelector('input[name="a[' + qid + ']"][value="' + Number(draft[qid]) + '"]');
      if (input) input.checked = true;
    });
  };

  const renderResult = () => {
    const m = /^#r(\d+)$/.exec(location.hash);
    const id = m ? Number(m[1]) : 0;
    const db = loadDB();
    const mine = db.results.filter(r => r.user_id === user.id).sort(newestFirst);
    const r = id > 0 ? mine.find(x => x.id === id) : mine[0];
    if (!r) {
      flash('info', id > 0 ? 'That result could not be found.' : 'Take the test first — your result will appear here.');
      halt('test');
      return;
    }
    const history = mine.slice(0, 12);
    const code = r.type_code;
    const t = TYPES[code] || Object.values(TYPES)[0];
    document.title = code + ' · The ' + t.name + ' — Persona/16';

    const bars = Object.keys(AXES).map((dim, i) => {
      const [label, col, a, b] = AXES[dim];
      const p = Number(r[col]);
      const firstWins = code[i] === a[0];
      const win = firstWins ? p : 100 - p;
      return '<div class="bar">'
        + '<div class="bar-head"><span class="mono">' + e(label) + '</span><b>' + win + '% ' + e(firstWins ? a[1] : b[1]) + '</b></div>'
        + '<div class="bar-track"><span class="bar-fill ' + (firstWins ? 'from-left' : 'from-right') + '" style="--p:' + win + '"></span><span class="bar-mid"></span></div>'
        + '<div class="bar-ends mono">'
        + '<span class="' + (firstWins ? 'on' : '') + '">' + a[0] + ' · ' + e(a[1]) + ' ' + p + '%</span>'
        + '<span class="' + (firstWins ? '' : 'on') + '">' + (100 - p) + '% ' + e(b[1]) + ' · ' + b[0] + '</span>'
        + '</div></div>';
    }).join('');

    const hist = history.map(h => {
      const ht = TYPES[h.type_code];
      return '<li' + (h.id === r.id ? ' class="current"' : '') + '>'
        + '<a href="result.html#r' + h.id + '">'
        + '<span class="mono h-date">' + e(fmtDate(h.created_at, ' · ')) + '</span>'
        + '<span class="h-code">' + e(h.type_code) + '</span>'
        + '<span class="h-name">' + e(ht ? 'The ' + ht.name : '') + '</span>'
        + '<span class="h-mini">' + e(axisSummary(h)) + '</span>'
        + '<span class="h-arr" aria-hidden="true">→</span>'
        + '</a></li>';
    }).join('');

    const html = '<section class="r-hero">'
      + '<div class="r-poster-wrap"><div class="r-poster" data-tilt="10">' + poster(code, t) + '<span class="glare"></span></div></div>'
      + '<div class="r-info">'
      + '<p class="mono">Result N°' + String(r.id).padStart(3, '0') + ' · ' + e(fmtDate(r.created_at, ', ')) + '</p>'
      + '<h1 class="r-code" aria-label="' + e(code) + '">' + Array.from(code).map((ch, k) => '<span style="--k:' + k + '" aria-hidden="true">' + e(ch) + '</span>').join('') + '</h1>'
      + '<h2 class="r-name">The ' + e(t.name) + '</h2>'
      + '<p class="r-group mono">' + e(GROUPS[t.group][0]) + ' · ' + e(t.group) + '</p>'
      + '<p class="r-tag">' + e(t.tag) + '</p>'
      + '<p class="r-desc">' + e(t.desc) + '</p>'
      + '<ul class="chips">' + t.strengths.map(s => '<li>' + e(s) + '</li>').join('') + '</ul>'
      + '<div class="r-actions">'
      + '<a class="btn btn-red" href="test.html">Retake the test <i>→</i></a>'
      + '<a class="btn btn-ghost" href="index.html#types">Explore all 16 types</a>'
      + '</div></div></section>'
      + '<section><header class="r-sec-head"><h3>Your four <em>axes.</em></h3><span class="mono">How far you lean</span></header><div class="bars">' + bars + '</div></section>'
      + '<section><header class="r-sec-head"><h3>Your <em>history.</em></h3><span class="mono">' + history.length + ' saved result' + (history.length === 1 ? '' : 's') + '</span></header><ol class="hist">' + hist + '</ol></section>';
    const main = document.getElementById('p16-result');
    if (main) main.innerHTML = html;
    window.addEventListener('hashchange', () => location.reload());
  };

  /* ---------- a way back to the portfolio, on every page ---------- */
  const portfolioTab = () => {
    const style = document.createElement('style');
    style.textContent = '.p16-back{position:fixed;right:0;top:50%;transform:translateY(-50%);z-index:90;display:flex;flex-direction:column;align-items:center;gap:10px;padding:14px 9px 16px;margin-right:env(safe-area-inset-right,0px);background:var(--bg-2);border:1px solid var(--line-2);border-right:0;border-radius:12px 0 0 12px;color:var(--text);text-decoration:none;font-family:var(--mono);font-size:11px;letter-spacing:.18em;text-transform:uppercase;box-shadow:0 18px 40px -18px rgba(0,0,0,.8);transition:background .2s,border-color .2s}'
      + '.p16-back:hover{background:var(--red);border-color:var(--red)}'
      + '.p16-back:focus-visible{outline:2px solid var(--red-2);outline-offset:2px}'
      + '.p16-back svg{width:14px;height:14px;flex:none}'
      + '.p16-back span{writing-mode:vertical-rl;transform:rotate(180deg)}'
      + 'body.locked .p16-back{display:none}';
    document.head.appendChild(style);
    document.body.insertAdjacentHTML('beforeend',
      '<a class="p16-back" href="../" aria-label="Back to the portfolio">'
      + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5"/><path d="m11 18-6-6 6-6"/></svg>'
      + '<span>Portfolio</span></a>');
  };

  /* ---------- render this page ---------- */
  if (!halted) {
    portfolioTab();
    const toasts = toastsHtml();
    if (toasts) document.body.insertAdjacentHTML('afterbegin', toasts);
    if (PAGE === 'home') hydrateHome();
    if (PAGE === 'login' || PAGE === 'signup') hydrateAuth();
    if (PAGE === 'test') hydrateTest();
    if (PAGE === 'result') renderResult();
  }
  if (halted) document.documentElement.style.visibility = 'hidden';

  /* ---------- form posts ---------- */
  document.addEventListener('submit', ev => {
    if (ev.defaultPrevented) return; // e.g. the test form's own "unanswered question" check
    const form = ev.target;
    const action = form.querySelector('input[name="action"]');
    if (!action) return;
    ev.preventDefault();
    const f = new FormData(form);
    const next = safeNext(String(f.get('next') || ''));
    const btn = form.querySelector('button[type="submit"]');
    if (btn) btn.disabled = true;
    const run = {
      signup: () => doSignup(f, next),
      login: () => doLogin(f, next),
      logout: () => doLogout(),
      submit_test: () => doSubmitTest(f, currentUser()),
    }[action.value];
    Promise.resolve(run ? run() : redirect(PAGE)).catch(() => {
      if (btn) btn.disabled = false;
    });
  });
})();
