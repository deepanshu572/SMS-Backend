/* app.js - shared shell: sidebar, topbar, theme, modal, toast */
const $ = s => document.querySelector(s), esc = s => s.replace(/[&<>"]/g, c => "&#" + c.charCodeAt(0) + ";");
const reduce = matchMedia("(prefers-reduced-motion:reduce)").matches;
const P = document.body.dataset.page;
let SES = null; for (const st of [sessionStorage, localStorage]) { try { SES = SES || JSON.parse(st.getItem("edu_session")) } catch (e) { } }
if (!SES) location.replace("login.html");
SES = SES || { role: "admin", name: "Guest" };
const ALLOW = { admin: null, teacher: ["index", "students", "classes", "attendance", "homework", "timetable", "notice-board", "communication", "reports", "tests-exams", "study-materials"], student: ["index", "homework", "timetable", "notice-board", "tests-exams", "study-materials"], parent: ["index", "attendance", "fees", "homework", "timetable", "notice-board", "communication", "tests-exams"] };
const ok = f => { const l = ALLOW[SES.role]; return !l || l.includes(f.replace(".html", "")) };
const IC = {
    grid: '<path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z"/>',
    users: '<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.9M16 3.1a4 4 0 010 7.8"/>',
    user: '<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    book: '<path d="M4 19.5A2.5 2.5 0 016.5 17H20V3H6.5A2.5 2.5 0 004 5.5z"/>',
    check: '<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>',
    wallet: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>',
    pencil: '<path d="M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    bell: '<path d="M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0"/>',
    chat: '<path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>',
    chart: '<path d="M18 20V10M12 20V4M6 20v-6"/>',
    spark: '<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z"/>',
    lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/>',
    layers: '<path d="M12 2l10 5-10 5L2 7zM2 17l10 5 10-5M2 12l10 5 10-5"/>',
    file: '<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M8 13h8M8 17h8"/>',
    folder: '<path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>'
};
const MENU = [["index.html", "Dashboard", "grid"], ["students.html", "Students", "users"], ["teachers.html", "Teachers", "user"], ["classes.html", "Classes", "book"], ["attendance.html", "Attendance", "check"], ["fees.html", "Fees", "wallet"], ["homework.html", "Homework", "pencil"], ["timetable.html", "Timetable", "clock"], ["notice-board.html", "Notice Board", "bell"], ["communication.html", "Communication", "chat"], ["reports.html", "Reports", "chart"], ["ai-assistant.html", "AI Assistants", "spark"], ["roles-permissions.html", "Role And Permissions", "lock"], ["subjects-classes.html", "Subject And Class", "layers"], ["tests-exams.html", "Tests And Exams", "file"], ["study-materials.html", "Study Materials", "folder"]];
const here = location.pathname.split("/").pop() || "index.html";
if (!ok(here)) location.replace("index.html");
$("#side").innerHTML = '<div class="logo"><i>E</i> EduNexa</div>' + MENU.filter(m => ok(m[0])).map(([f, t, i], n) => `<a class="nav${f == here ? " active" : ""}" href="${f}" style="animation-delay:${n * 35}ms"><svg viewBox="0 0 24 24">${IC[i]}</svg>${t}</a>`).join("");
let Q = new URLSearchParams(location.search).get("q") || "";
$("#top").innerHTML = `<button class="burger" id="burger" aria-label="Open menu"><svg viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h18"/></svg></button><label class="search"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3"/></svg><input id="gs" placeholder="Search students" aria-label="Search students" value="${esc(Q)}"></label><div class="user"><button class="theme" id="thm" aria-label="Toggle dark mode">◐</button><span class="av">${esc(SES.name)[0]}</span><div><b>${esc(SES.name)}</b><small>${SES.role[0].toUpperCase() + SES.role.slice(1)}</small></div><button class="theme" id="lo" aria-label="Log out" title="Log out"><svg viewBox="0 0 24 24" style="width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg></button></div>`;
document.body.insertAdjacentHTML("beforeend", `<div class="modal" id="modal"><form class="mbox" id="mf"><h3>Add student</h3><input id="mn" placeholder="Full name" required><select id="mc">${CL.map(c => `<option>${c}</option>`).join("")}</select><div class="btns"><button type="button" class="btn" id="mx">Cancel</button><button class="btn fill">Save student</button></div></form></div><div class="toast" id="toast"></div>`);
/* theme */
try { document.documentElement.dataset.theme = localStorage.getItem("edu_theme") || "" } catch (e) { }
$("#thm").onclick = () => { const d = document.documentElement.dataset.theme != "dark" ? "dark" : ""; document.documentElement.dataset.theme = d; try { localStorage.setItem("edu_theme", d) } catch (e) { } };
/* logout + role limits */
$("#lo").onclick = () => { [sessionStorage, localStorage].forEach(st => { try { st.removeItem("edu_session") } catch (e) { } }); location.href = "login.html" };
if (SES.role == "student" || SES.role == "parent") document.querySelectorAll("[data-add]").forEach(b => b.remove());
/* mobile drawer */
const side = $("#side"), scrim = $("#scrim"), closeNav = () => { side.classList.remove("open"); scrim.classList.remove("open") };
$("#burger").onclick = () => { side.classList.add("open"); scrim.classList.add("open") }; scrim.onclick = closeNav;
/* search: live on students page, Enter elsewhere */
$("#gs").oninput = e => { Q = e.target.value; window.redraw && redraw() };
$("#gs").onkeydown = e => { if (e.key == "Enter" && P != "students") location.href = "students.html?q=" + encodeURIComponent(e.target.value) };
/* toast + modal */
function toast(t) { const e = $("#toast"); e.textContent = t; e.classList.add("show"); clearTimeout(e.t); e.t = setTimeout(() => e.classList.remove("show"), 2200) }
const M = $("#modal"), openM = () => { M.classList.add("open"); $("#mn").focus() }, closeM = () => M.classList.remove("open");
$("#mx").onclick = closeM; M.onclick = e => e.target == M && closeM();
document.addEventListener("click", e => { if (e.target.closest("[data-add]")) openM() });
$("#mf").onsubmit = e => { e.preventDefault(); const c = $("#mc").value; S.push({ n: $("#mn").value.trim(), c, r: S.filter(s => s.c == c).length + 1, a: 100, p: 0, x: 1 }); save(); e.target.reset(); closeM(); window.render && render(); toast("Student added") };
function stagger() { document.querySelectorAll(".main .card").forEach((c, i) => c.style.animationDelay = i * 70 + "ms") }
