/* pages.js - per-page behaviour (runs only the block for the current page) */
const AT = [["Mon", 94], ["Tue", 91], ["Wed", 96], ["Thu", 88], ["Fri", 92], ["Sat", 72]];
const EX = { T1: [["Maths", 74], ["Sci", 81], ["Eng", 77], ["Hindi", 88], ["SST", 69]], T2: [["Maths", 82], ["Sci", 86], ["Eng", 79], ["Hindi", 91], ["SST", 45]] };
const NOTICES = [["Parent-teacher meeting", "Oct 14, 10:00 am"], ["Annual sports day", "Oct 28"], ["Diwali holidays begin", "Nov 6"]];
const bars = (d, h) => { const m = Math.max(...d.map(x => x[1])); return `<div class="bars" style="height:${h}px">${d.map(([l, v], i) => `<div><i>${v}</i><span class="${v < 50 ? "h" : v == m ? "mx" : ""}" style="height:${v * (h - 52) / 100}px;animation-delay:${i * 90}ms"></span><em>${l}</em></div>`).join("")}</div>` };
const rows = a => a.map(([n, s], i) => `<div class="row" style="animation-delay:${i * 80 + 300}ms"><span class="dot">${esc(n)[0]}</span><div><b>${esc(n)}</b><small>${s}</small></div></div>`).join("");
function count() { document.querySelectorAll("[data-n]").forEach(el => { const n = +el.dataset.n, s = el.dataset.s || "", t0 = performance.now(); const f = t => { const p = Math.min((t - t0) / 1200, 1); el.textContent = Math.round(n * (1 - Math.pow(1 - p, 3))).toLocaleString("en-IN") + s; p < 1 && requestAnimationFrame(f) }; reduce ? el.textContent = n.toLocaleString("en-IN") + s : requestAnimationFrame(f) }) }
let clk;
const LS = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) || d } catch (e) { return d } }, sv = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch (e) { } }, D = d => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
const pages = {
    dashboard() {
        $("#tot").dataset.n = 1240 + S.length; count(); $("#wk").innerHTML = bars(AT, 170); $("#recent").innerHTML = rows(S.slice(-5).reverse().map(s => [s.n, "Class " + s.c])); $("#notices").innerHTML = rows(NOTICES);
        clearInterval(clk); const t = () => { $("#clock").textContent = new Date().toLocaleTimeString("en-IN", { hour12: false }) }; t(); clk = setInterval(t, 1000)
    },
    students() {
        const tb = $("#tb"), cf = $("#cf");
        window.redraw = () => {
            const q = Q.toLowerCase(), L = S.map((s, i) => [s, i]).filter(([s]) => s.n.toLowerCase().includes(q) && (!cf.value || s.c == cf.value));
            tb.innerHTML = L.map(([s, i], k) => `<tr style="animation-delay:${k * 45}ms"><td><span class="av sm">${esc(s.n)[0]}</span>${esc(s.n)}</td><td>${s.c}</td><td>${s.r}</td><td><span class="meter"><span style="width:${s.a}%"></span></span>${s.a}%</td><td><button class="tag b" data-del="${i}">Remove</button></td></tr>`).join("") || `<tr><td colspan="5" class="empty">No students match. Try another name or class.</td></tr>`;
            $("#sc").textContent = L.length + " of " + S.length + " students"
        };
        cf.onchange = redraw; tb.onclick = e => { const i = e.target.dataset.del; if (i != null) { S.splice(i, 1); save(); redraw(); toast("Student removed") } }; redraw()
    },
    attendance() {
        const L = $("#alist"), sum = () => { const p = S.filter(s => s.x).length; $("#asum").textContent = p + " present, " + (S.length - p) + " absent" };
        L.innerHTML = S.map((s, i) => `<div class="row" style="animation-delay:${i * 60}ms"><span class="dot">${esc(s.n)[0]}</span><div><b>${esc(s.n)}</b><small>Class ${s.c} · Roll ${s.r}</small></div><button class="pill ${s.x ? "on" : "off"}" data-i="${i}">${s.x ? "Present" : "Absent"}</button></div>`).join("");
        L.onclick = e => { const b = e.target.closest("[data-i]"); if (!b) return; const s = S[b.dataset.i]; s.x = s.x ? 0 : 1; b.className = "pill pop " + (s.x ? "on" : "off"); b.textContent = s.x ? "Present" : "Absent"; sum() };
        $("#asave").onclick = () => { save(); toast("Attendance saved") }; sum()
    },
    "tests-exams"() { $("#chart").innerHTML = bars(EX.T1, 260); const T = $("#tabs"); T.onclick = e => { const k = e.target.dataset.k; if (!k) return;[...T.children].forEach(b => b.classList.toggle("on", b == e.target)); $("#chart").innerHTML = bars(EX[k], 260) } },
    fees() {
        const tb = $("#ft"), draw = () => { tb.innerHTML = S.map((s, i) => `<tr style="animation-delay:${i * 45}ms"><td><span class="av sm">${esc(s.n)[0]}</span>${esc(s.n)}</td><td>${s.c}</td><td>₹12,500</td><td><span class="tag ${s.p ? "" : "b"}">${s.p ? "Paid" : "Due"}</span></td><td>${s.p ? "" : `<button class="tag" data-p="${i}">Mark paid</button>`}</td></tr>`).join(""); $("#fs").textContent = S.filter(s => s.p).length + " of " + S.length + " fees collected" };
        tb.onclick = e => { const i = e.target.dataset.p; if (i != null) { S[i].p = 1; save(); draw(); toast("Payment recorded") } }; draw()
    },
    classes() { document.querySelectorAll("[data-c]").forEach(e => { const n = +e.dataset.b + S.filter(s => s.c == e.dataset.c).length; e.querySelector("b").textContent = n; e.querySelector(".fb span").style.width = Math.min(n / 40 * 100, 100) + "%" }) },
    homework() {
        let H = LS("edu_hw", [{ t: "Quadratic equations worksheet", s: "Maths", c: "10-A", d: "2026-10-12", ok: 0 }, { t: "Photosynthesis diagram", s: "Science", c: "9-A", d: "2026-10-06", ok: 0 }, { t: "Essay: My school", s: "English", c: "9-B", d: "2026-10-14", ok: 0 }, { t: "Hindi vyakaran exercises", s: "Hindi", c: "10-B", d: "2026-10-05", ok: 1 }], f = "all");
        const today = new Date().toISOString().slice(0, 10), draw = () => { $("#hl").innerHTML = H.map((h, i) => [h, i]).filter(([h]) => f == "all" || (f == "d") == !!h.ok).map(([h, i], k) => `<div class="row" style="animation-delay:${k * 60}ms"><span class="dot">${h.s[0]}</span><div><b class="${h.ok ? "dn" : ""}">${esc(h.t)}</b><small>${h.s} · Class ${h.c} · Due ${D(h.d)}</small></div>${!h.ok && h.d < today ? '<span class="tag b">Overdue</span>' : ""}<button class="tag" data-ok="${i}">${h.ok ? "Undo" : "Mark done"}</button><button class="tag b" data-rm="${i}" aria-label="Delete">×</button></div>`).join("") || '<p class="empty">Nothing here yet.</p>' };
        $("#hd").valueAsDate = new Date(Date.now() + 3 * 864e5);
        $("#hf").onsubmit = e => { e.preventDefault(); H.unshift({ t: $("#ht").value.trim(), s: $("#hs").value, c: $("#hc").value, d: $("#hd").value, ok: 0 }); sv("edu_hw", H); $("#ht").value = ""; draw(); toast("Homework assigned") };
        $("#hb").onclick = e => { if (!e.target.dataset.f) return; f = e.target.dataset.f;[...$("#hb").children].forEach(b => b.classList.toggle("on", b == e.target)); draw() };
        $("#hl").onclick = e => { const k = e.target.dataset.ok, r = e.target.dataset.rm; if (k != null) H[k].ok ^= 1; else if (r != null) H.splice(r, 1); else return; sv("edu_hw", H); draw() }; draw()
    },
    timetable() {
        const TN0 = ["Mrs. Kavita Rao", "Mr. Anil Mishra", "Ms. Pooja Iyer", "Mr. Sunil Yadav", "Mrs. Neha Kapoor", "Mr. Vikram Sethi"], DEF = ["Mathematics", "Science", "English", "Hindi", "Social Science", "Computer"], days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const SBJ = LS("edu_subjects", DEF.map((n, i) => ({ n, t: TN0[i] }))), subs = SBJ.map(s => s.n), TN = [...new Set([...TN0, ...SBJ.map(s => s.t)])], tOf = n => (SBJ.find(s => s.n == n) || {}).t || TN[0], col = n => "c" + (Math.max(subs.indexOf(n), 0) % 8);
        let T = LS("edu_tt", null);
        if (!T) {
            T = { per: [["p1", "Period 1", "08:00 – 08:45"], ["p2", "Period 2", "08:45 – 09:30"], ["p3", "Period 3", "09:30 – 10:15"], ["b1", "Short Break", "10:15 – 10:30", 1], ["p4", "Period 4", "10:30 – 11:15"], ["p5", "Period 5", "11:15 – 12:00"], ["b2", "Lunch Break", "12:00 – 12:30", 1], ["p6", "Period 6", "12:30 – 13:15"]].map(([id, n, t, b]) => ({ id, n, t, b: b ? 1 : 0 })), g: {} };
            CL.forEach((c, ci) => { T.g[c] = {}; T.per.filter(p => !p.b).forEach((p, k) => days.forEach((d, di) => { const s = subs[(di + k + ci * 2) % subs.length]; T.g[c][p.id + "-" + di] = { s, t: tOf(s) } })) }); sv("edu_tt", T)
        }
        const sel = $("#tc"), td = (new Date().getDay() + 6) % 7, ro = SES.role == "student" || SES.role == "parent"; let hl = "";
        if (ro) { $("#mp").remove(); $("#tt").classList.add("ro") }
        const draw = () => {
            const g = T.g[sel.value] = T.g[sel.value] || {};
            $("#leg").innerHTML = subs.map(n => `<button class="lg ${col(n)} ${n == hl ? "on" : ""}" data-s="${esc(n)}">${esc(n)}</button>`).join("");
            $("#tt").innerHTML = `<thead><tr><th>◷ TIME</th>${days.map((d, i) => `<th class="${i == td ? "today" : ""}">${d.toUpperCase()}</th>`).join("")}</tr></thead><tbody>` + T.per.map((p, r) => `<tr class="${p.b ? "brk" : ""}" style="animation-delay:${r * 50}ms"><td class="pt"><b>${esc(p.n)}</b><small>${esc(p.t)}</small></td>` + days.map((d, i) => { const tc = i == td ? "today" : ""; if (p.b) return `<td class="${tc}"><em>${esc(p.n)}</em></td>`; const x = g[p.id + "-" + i]; return `<td class="${tc}">` + (x ? `<button class="cell ${col(x.s)} ${x.s == hl ? "hl" : ""}" data-p="${p.id}" data-d="${i}"><b>${esc(x.s)}</b><small>${esc(x.t)}</small></button>` : `<button class="cell none" data-p="${p.id}" data-d="${i}">+ Add</button>`) + "</td>" }).join("") + "</tr>").join("") + "</tbody>"
        };
        sel.onchange = draw;
        $("#leg").onclick = e => { const s = e.target.dataset.s; if (s == null) return; hl = hl == s ? "" : s; draw() };
        /* edit one cell */
        const M = $("#tm"), ms = $("#tsub"), mt = $("#ttch"); let cur = null;
        ms.innerHTML = '<option value="">Free period</option>' + subs.map(n => `<option>${esc(n)}</option>`).join(""); mt.innerHTML = TN.map(t => `<option>${esc(t)}</option>`).join("");
        $("#tt").onclick = e => { const b = e.target.closest(".cell"); if (!b) return; cur = [b.dataset.p, b.dataset.d]; const p = T.per.find(x => x.id == cur[0]), x = (T.g[sel.value] || {})[cur.join("-")]; $("#tmh").textContent = "Edit " + p.n + " · " + days[cur[1]]; ms.value = x ? x.s : ""; mt.value = x ? x.t : TN[0]; M.classList.add("open") };
        ms.onchange = () => { if (ms.value) mt.value = tOf(ms.value) };
        $("#tmx").onclick = () => M.classList.remove("open"); M.onclick = e => e.target == M && M.classList.remove("open");
        $("#tmf").onsubmit = e => { e.preventDefault(); const g = T.g[sel.value] = T.g[sel.value] || {}, k = cur.join("-"); if (ms.value) g[k] = { s: ms.value, t: mt.value }; else delete g[k]; sv("edu_tt", T); M.classList.remove("open"); draw(); toast("Timetable updated") };
        /* manage periods */
        const pm = $("#pm"); let PD; const pdraw = () => { $("#pl").innerHTML = PD.map((p, i) => `<div class="pr"><input class="inp" data-i="${i}" data-f="n" value="${esc(p.n)}" aria-label="Name"><input class="inp" data-i="${i}" data-f="t" value="${esc(p.t)}" placeholder="08:00 – 08:45" aria-label="Time"><select data-i="${i}" data-f="b" aria-label="Type"><option value="0" ${p.b ? "" : "selected"}>Class</option><option value="1" ${p.b ? "selected" : ""}>Break</option></select><button type="button" class="tag b" data-rm="${i}" aria-label="Remove">×</button></div>`).join("") };
        if (!ro) {
            $("#mp").onclick = () => { PD = T.per.map(p => ({ ...p })); pdraw(); pm.classList.add("open") };
            $("#pl").oninput = e => { const d = e.target.dataset; if (d.f) PD[d.i][d.f] = d.f == "b" ? +e.target.value : e.target.value };
            $("#pl").onclick = e => { const r = e.target.dataset.rm; if (r != null) { PD.splice(r, 1); pdraw() } };
            $("#pa").onclick = () => { PD.push({ id: "n" + Date.now(), n: "Period " + (PD.filter(p => !p.b).length + 1), t: "", b: 0 }); pdraw() };
            $("#px").onclick = () => pm.classList.remove("open"); pm.onclick = e => e.target == pm && pm.classList.remove("open");
            $("#pf").onsubmit = e => { e.preventDefault(); T.per = PD; sv("edu_tt", T); pm.classList.remove("open"); draw(); toast("Periods saved") }
        }
        draw()
    },
    "notice-board"() {
        let N = LS("edu_notes", [{ t: "Parent-teacher meeting", b: "Meet your class teachers on Oct 14, 10:00 am to 1:00 pm.", c: "Event", d: "2026-10-05", pin: 1 }, { t: "Unit test schedule", b: "Unit tests for Class 10 begin on Oct 24.", c: "Exam", d: "2026-10-03", pin: 0 }, { t: "Diwali holidays", b: "School remains closed from Nov 6 to Nov 12.", c: "Holiday", d: "2026-10-01", pin: 0 }]); const L = $("#nl");
        const draw = () => { N.sort((a, b) => b.pin - a.pin || b.d.localeCompare(a.d)); L.innerHTML = N.map((n, i) => `<div class="card note ${n.pin ? "pin" : ""}" style="animation-delay:${i * 70}ms"><h3>${esc(n.t)} <span class="tag">${n.c}</span></h3><p>${esc(n.b)}</p><div class="nf"><small>${D(n.d)}</small><span><button class="tag" data-pin="${i}">${n.pin ? "Unpin" : "Pin"}</button> <button class="tag b" data-rm="${i}">Delete</button></span></div></div>`).join("") || '<div class="card empty">No notices yet. Post the first one above.</div>' };
        $("#nf").onsubmit = e => { e.preventDefault(); N.unshift({ t: $("#nt").value.trim(), b: $("#nb").value.trim(), c: $("#nc").value, d: new Date().toISOString().slice(0, 10), pin: 0 }); sv("edu_notes", N); e.target.reset(); draw(); toast("Notice posted") };
        L.onclick = e => { const p = e.target.dataset.pin, r = e.target.dataset.rm; if (p != null) N[p].pin ^= 1; else if (r != null) N.splice(r, 1); else return; sv("edu_notes", N); draw() }; draw()
    },
    communication() {
        const C = [["Mrs. Sharma", "Parent of Aarav", "S"], ["Mr. Anil Mishra", "Science teacher", "A"], ["Ms. Pooja Iyer", "English teacher", "P"], ["Mr. Verma", "Parent of Priya", "V"]], RP = ["Thank you, noted.", "Sure, I will get back to you today.", "Understood. Please share the details.", "Okay, see you then."], hi = { m: "Hello! How can I help?", me: 0 };
        let M = LS("edu_chat", {}), a = 0; const L = $("#cl"), B = $("#cb"), draw = () => { L.innerHTML = C.map((c, i) => `<button class="${i == a ? "on" : ""}" data-i="${i}"><span class="av sm">${c[2]}</span><span><b>${c[0]}</b><small>${c[1]}</small></span></button>`).join(""); $("#cn").textContent = C[a][0]; B.innerHTML = (M[a] || [hi]).map(x => `<div class="msg ${x.me ? "me" : ""}">${esc(x.m)}</div>`).join(""); B.scrollTop = B.scrollHeight };
        $("#cf").onsubmit = e => { e.preventDefault(); const t = $("#ci").value.trim(); if (!t) return; const k = a; (M[k] = M[k] || [hi]).push({ m: t, me: 1 }); sv("edu_chat", M); $("#ci").value = ""; draw(); B.insertAdjacentHTML("beforeend", '<div class="msg typing"><i></i><i></i><i></i></div>'); B.scrollTop = B.scrollHeight; setTimeout(() => { M[k].push({ m: RP[Math.floor(Math.random() * RP.length)], me: 0 }); sv("edu_chat", M); k == a && draw() }, 1100) };
        L.onclick = e => { const b = e.target.closest("[data-i]"); if (b) { a = +b.dataset.i; draw() } }; draw()
    },
    reports() {
        const n = S.length || 1, cl = CL.map(c => { const L = S.filter(s => s.c == c); return [c, L.length ? Math.round(L.reduce((t, s) => t + s.a, 0) / L.length) : 0] });
        $("#r1").dataset.n = Math.round(S.reduce((t, s) => t + s.a, 0) / n); $("#r2").dataset.n = Math.round(S.filter(s => s.p).length / n * 100); $("#r3").dataset.n = S.length; count(); $("#rc").innerHTML = bars(cl, 220);
        const out = { students: [["Name", "Class", "Roll", "Attendance %"], s => [s.n, s.c, s.r, s.a]], fees: [["Name", "Class", "Amount", "Status"], s => [s.n, s.c, 12500, s.p ? "Paid" : "Due"]], attendance: [["Name", "Class", "Today"], s => [s.n, s.c, s.x ? "Present" : "Absent"]] };
        $("#rl").onclick = e => { const k = e.target.dataset.dl; if (!k) return; const [h, f] = out[k], t = [h, ...S.map(f)].map(r => r.map(v => '"' + String(v).replace(/"/g, '""') + '"').join(",")).join("\n"), a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([t], { type: "text/csv" })); a.download = k + "-report.csv"; a.click(); toast("Report downloaded") }
    },
    "ai-assistant"() {
        const B = $("#ab"), add = (m, me) => { const d = document.createElement("div"); d.className = "msg" + (me ? " me" : ""); B.appendChild(d); if (me || reduce) d.textContent = m; else { let i = 0; const t = setInterval(() => { d.textContent = m.slice(0, ++i); B.scrollTop = B.scrollHeight; i >= m.length && clearInterval(t) }, 14) } B.scrollTop = B.scrollHeight };
        const AN = {
            attendance: () => { const a = S.filter(s => !s.x).map(s => s.n + " (" + s.c + ")"); return a.length ? "Absent today: " + a.join(", ") + ". Present: " + (S.length - a.length) + " of " + S.length + "." : "Everyone is present today." },
            fees: () => { const d = S.filter(s => !s.p); return d.length ? d.length + " fees are due: " + d.map(s => s.n).join(", ") + ". Draft reminder: Dear Parent, the term fee of ₹12,500 is pending. Please pay by the 15th." : "All fees are collected." },
            lesson: () => "Lesson plan, Quadratic equations (45 min): 1) Recap factorisation, 10 min. 2) Introduce ax²+bx+c=0, 10 min. 3) Solve 3 examples together, 15 min. 4) Pair practice and an exit question, 10 min.",
            notice: () => "Draft notice: The Parent-teacher meeting will be held on Oct 14 from 10:00 am to 1:00 pm. Parents are requested to meet the class teacher. Principal."
        };
        add("Hi! Pick a suggestion above or ask me something.", 0);
        $("#ch").onclick = e => { const p = e.target.dataset.p; if (!p) return; add(e.target.textContent, 1); setTimeout(() => add(AN[p](), 0), 400) };
        $("#af").onsubmit = e => { e.preventDefault(); const t = $("#ai").value.trim(); if (!t) return; $("#ai").value = ""; add(t, 1); setTimeout(() => add("In this demo I can help with attendance, fees, lesson plans and notices. Use the suggestions above.", 0), 400) }
    },
    "roles-permissions"() {
        const R = ["Admin", "Teacher", "Accountant", "Parent", "Student"], Pm = ["View students", "Edit students", "Manage fees", "Mark attendance", "Post notices", "View reports"];
        let G = LS("edu_roles", [[1, 1, 1, 1, 1, 1], [1, 0, 0, 1, 1, 1], [1, 0, 1, 0, 0, 1], [1, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]]); const T = $("#rt");
        T.innerHTML = "<thead><tr><th>Permission</th>" + R.map(r => `<th>${r}</th>`).join("") + "</tr></thead><tbody>" + Pm.map((p, j) => `<tr style="animation-delay:${j * 50}ms"><td>${p}</td>` + R.map((r, i) => `<td><button class="tg ${G[i][j] ? "on" : ""}" data-i="${i}" data-j="${j}" ${i ? "" : "disabled"} role="switch" aria-label="${r}: ${p}"></button></td>`).join("") + "</tr>").join("") + "</tbody>";
        T.onclick = e => { const b = e.target.closest(".tg"); if (!b || b.disabled) return; G[b.dataset.i][b.dataset.j] ^= 1; sv("edu_roles", G); b.classList.toggle("on"); toast("Permission updated") }
    },
    "subjects-classes"() {
        const TN = ["Mrs. Kavita Rao", "Mr. Anil Mishra", "Ms. Pooja Iyer", "Mr. Sunil Yadav", "Mrs. Neha Kapoor", "Mr. Vikram Sethi"];
        let SB = LS("edu_subjects", [{ n: "Mathematics", t: TN[0], c: ["9-A", "9-B", "10-A", "10-B"] }, { n: "Science", t: TN[1], c: ["9-A", "9-B"] }, { n: "English", t: TN[2], c: ["9-A", "10-A"] }, { n: "Hindi", t: TN[3], c: ["9-B", "10-B"] }, { n: "Social Science", t: TN[4], c: ["10-A", "10-B"] }, { n: "Computer", t: TN[5], c: ["9-A", "9-B"] }]);
        const T = $("#st"), sb = () => sv("edu_subjects", SB), draw = () => { T.innerHTML = "<thead><tr><th>Subject</th><th>Teacher</th><th>Classes</th><th></th></tr></thead><tbody>" + SB.map((s, i) => `<tr style="animation-delay:${i * 50}ms"><td><b>${esc(s.n)}</b></td><td><select data-t="${i}" aria-label="Teacher">${TN.map(t => `<option ${t == s.t ? "selected" : ""}>${t}</option>`).join("")}</select></td><td>${CL.map(c => `<button class="chip ${s.c.includes(c) ? "on" : ""}" data-i="${i}" data-c="${c}">${c}</button>`).join("")}</td><td><button class="tag b" data-rm="${i}">Remove</button></td></tr>`).join("") + "</tbody>" };
        T.onchange = e => { if (e.target.dataset.t != null) { SB[e.target.dataset.t].t = e.target.value; sb(); toast("Teacher assigned") } };
        T.onclick = e => { const b = e.target; if (b.dataset.c) { const s = SB[b.dataset.i], k = s.c.indexOf(b.dataset.c); k < 0 ? s.c.push(b.dataset.c) : s.c.splice(k, 1); b.classList.toggle("on"); sb() } else if (b.dataset.rm != null) { SB.splice(b.dataset.rm, 1); sb(); draw() } };
        $("#sf").onsubmit = e => { e.preventDefault(); SB.push({ n: $("#sn").value.trim(), t: TN[0], c: [] }); sb(); e.target.reset(); draw(); toast("Subject added") }; draw()
    },
    "study-materials"() {
        let MT = LS("edu_mat", [{ t: "Quadratic Equations Notes", s: "Maths", c: "10-A", k: "PDF", z: "1.2 MB" }, { t: "Photosynthesis Explained", s: "Science", c: "9-A", k: "Video", z: "18 min" }, { t: "Grammar Cheat Sheet", s: "English", c: "9-B", k: "Notes", z: "340 KB" }, { t: "Hindi Vyakaran Practice", s: "Hindi", c: "10-B", k: "PDF", z: "860 KB" }, { t: "Python Basics Slides", s: "Computer", c: "9-A", k: "Slides", z: "2.4 MB" }, { t: "Freedom Struggle Notes", s: "SST", c: "10-A", k: "Notes", z: "520 KB" }]);
        const L = $("#ml"), f = $("#ms"), draw = () => { L.innerHTML = MT.map((m, i) => [m, i]).filter(([m]) => !f.value || m.s == f.value).map(([m, i], k) => `<div class="card mc" style="animation-delay:${k * 60}ms"><div class="mk ${m.k}">${m.k}</div><b>${esc(m.t)}</b><small>${m.s} · Class ${m.c} · ${m.z}</small><div class="mb"><button class="tag" data-o="1">Open</button><button class="tag b" data-rm="${i}">Remove</button></div></div>`).join("") || '<p class="empty">No materials for this subject.</p>' };
        f.onchange = draw; L.onclick = e => { if (e.target.dataset.o) toast("File storage will connect with your backend"); else if (e.target.dataset.rm != null) { MT.splice(e.target.dataset.rm, 1); sv("edu_mat", MT); draw() } };
        $("#mf2").onsubmit = e => { e.preventDefault(); MT.unshift({ t: $("#mt").value.trim(), s: $("#msb").value, c: $("#mc2").value, k: $("#mk").value, z: "New" }); sv("edu_mat", MT); $("#mt").value = ""; draw(); toast("Material added") }; draw()
    }
};
window.render = () => { pages[P] && pages[P](); stagger() };
render();
