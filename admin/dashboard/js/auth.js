/* auth.js - login + register. Front-end demo only: accounts live in this browser's localStorage. */
const $ = s => document.querySelector(s), P = document.body.dataset.page;
try { document.documentElement.dataset.theme = localStorage.getItem("edu_theme") || "" } catch (e) { }
const jget = (st, k, d) => { try { return JSON.parse(st.getItem(k)) || d } catch (e) { return d } };
const users = () => {
  let u = jget(localStorage, "edu_users", null); if (!u) {
    u = [
      { role: "admin", name: "Demo Admin", email: "admin@EduNexa.demo", pw: "admin123", school: "EduNexa Demo School" },
      { role: "teacher", name: "Mrs. Kavita Rao", email: "teacher@EduNexa.demo", pw: "teacher123", school: "EduNexa Demo School" },
      { role: "student", name: "Aarav Sharma", email: "student@EduNexa.demo", pw: "student123", school: "EduNexa Demo School" },
      { role: "parent", name: "Mrs. Sharma", email: "parent@EduNexa.demo", pw: "parent123", school: "EduNexa Demo School" }];
    try { localStorage.setItem("edu_users", JSON.stringify(u)) } catch (e) { }
  } return u
};
const signIn = (u, remember) => { try { (remember ? localStorage : sessionStorage).setItem("edu_session", JSON.stringify({ role: u.role, name: u.name, email: u.email, school: u.school })) } catch (e) { } location.href = "index.html" };
const shake = f => { f.classList.remove("shake"); void f.offsetWidth; f.classList.add("shake") };
if (jget(sessionStorage, "edu_session", null) || jget(localStorage, "edu_session", null)) location.replace("index.html");

if (P == "login") {
  let role = "admin"; const R = $("#roles"), btns = [...R.querySelectorAll("button")], f = $("#lf");
  const cap = r => r[0].toUpperCase() + r.slice(1);
  btns.forEach((b, i) => b.onclick = () => { role = b.dataset.r; btns.forEach(x => x.classList.toggle("on", x == b)); R.style.setProperty("--i", i); $("#go").textContent = "Log in as " + cap(role); $("#err").textContent = "" });
  $("#eye").onclick = e => { const p = $("#pw"), s = p.type == "password"; p.type = s ? "text" : "password"; e.target.textContent = s ? "Hide" : "Show" };
  $("#demo").onclick = () => { const u = users().find(x => x.role == role && x.email.endsWith("@EduNexa.demo")); $("#em").value = u.email; $("#pw").value = u.pw; $("#err").textContent = "" };
  f.onsubmit = e => {
    e.preventDefault(); const em = $("#em").value.trim().toLowerCase(), u = users().find(x => x.role == role && x.email.toLowerCase() == em && x.pw == $("#pw").value);
    if (!u) { $("#err").innerHTML = "No <b>" + role + "</b> account matches these details. New school? <a href=\"register.html\">Register your school</a>."; return shake(f) }
    signIn(u, $("#rm").checked)
  }
}
if (P == "register") {
  const f = $("#rf"), v = id => $("#" + id).value.trim(), err = m => { $("#err").textContent = m; shake(f) };
  $("#rpw").oninput = e => { $("#sm").style.width = Math.min(e.target.value.length / 10, 1) * 100 + "%" };
  f.onsubmit = e => {
    e.preventDefault();
    if (v("rpw").length < 6) return err("Password must be at least 6 characters.");
    if ($("#rpw").value != $("#rpw2").value) return err("Passwords do not match.");
    const em = v("rem").toLowerCase(), U = users();
    if (U.some(x => x.email.toLowerCase() == em)) return err("This email is already registered. Log in instead.");
    const u = { role: "admin", name: v("rn"), email: em, pw: $("#rpw").value, school: v("rs") }; U.push(u);
    try { localStorage.setItem("edu_users", JSON.stringify(U)); localStorage.setItem("edu_school", JSON.stringify({ name: v("rs"), board: $("#rt").value, city: v("rc"), phone: v("rph"), admin: em })) } catch (x) { }
    f.style.display = "none"; $("#done").classList.add("show"); setTimeout(() => signIn(u, true), 1500)
  }
}
