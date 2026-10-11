/* data.js - shared student data, saved in localStorage so it survives page changes */
const CL = ["9-A", "9-B", "10-A", "10-B"];
let S; try { S = JSON.parse(localStorage.getItem("edu_students")) } catch (e) { }
S = S || [{ n: "Aarav Sharma", c: "10-A", r: 1, a: 96, p: 1, x: 1 }, { n: "Ananya Singh", c: "10-A", r: 2, a: 92, p: 1, x: 1 }, { n: "Rohan Kumar", c: "10-B", r: 1, a: 78, p: 0, x: 0 }, { n: "Priya Verma", c: "9-A", r: 1, a: 98, p: 1, x: 1 }, { n: "Ishaan Gupta", c: "9-B", r: 1, a: 85, p: 0, x: 1 }, { n: "Sneha Das", c: "9-A", r: 2, a: 89, p: 1, x: 1 }, { n: "Kabir Mehta", c: "10-B", r: 2, a: 64, p: 0, x: 0 }, { n: "Riya Patel", c: "9-B", r: 2, a: 94, p: 1, x: 1 }];
const save = () => { try { localStorage.setItem("edu_students", JSON.stringify(S)) } catch (e) { } };
