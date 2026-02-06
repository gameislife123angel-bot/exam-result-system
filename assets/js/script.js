const subjects = ["Hindi", "SS", "English", "Science", "Gujarati", "Maths", "Sanskrit"];
let lastResult = "";

function toggleTheme() {
  document.body.classList.toggle("light");
}

function loadExam() {
  form.innerHTML = "";
  result.innerHTML = "";
  lastResult = "";

  if (!exam.value) return;

  if (exam.value === "weekly") {
    form.innerHTML = `
      <input id="weeklyMark" type="number" min="0" max="25"
        placeholder="Marks / 25"
        oninput="limit(this,25)">
      <button onclick="weekly()">Check</button>
    `;
    return;
  }

  let max = exam.value === "annual" ? 80 : 50;

  subjects.forEach(s => {
    form.innerHTML += `
      <input type="number" id="${s}"
        min="0" max="${max}"
        placeholder="${s} / ${max}"
        oninput="limit(this,${max})">
    `;
  });

  form.innerHTML += `<button onclick="term('${exam.value}')">Check</button>`;
}

function limit(el, max) {
  el.value = el.value.replace(/\D/g, "");
  if (el.value > max) el.value = max;
}

function grade(p) {
  if (p >= 90) return "A+";
  if (p >= 80) return "A";
  if (p >= 70) return "B";
  if (p >= 60) return "C";
  if (p >= 50) return "D";
  return "F";
}

/* WEEKLY */
function weekly() {
  let m = +weeklyMark.value || 0;
  let p = ((m / 25) * 100).toFixed(2);

  lastResult =
`WEEKLY TEST (Out of 25)

Marks : ${m}/25
Percentage : ${p}%
Grade : ${grade(p)}
Result : ${m >= 8 ? "PASS" : "FAIL"}`;

  result.innerHTML = lastResult.replaceAll("\n", "<br>");
}

/* TERM / ANNUAL */
function term(type) {
  let max = type === "annual" ? 80 : 50;
  let pass = type === "annual" ? 35 : 18;

  let total = 0;
  let fail = false;
  let details = "";

  subjects.forEach(s => {
    let m = +document.getElementById(s).value || 0;
    total += m;
    if (m < pass) fail = true;
    details += `${s} : ${m}/${max}\n`;
  });

  let grand = max * subjects.length;
  let p = ((total / grand) * 100).toFixed(2);

  lastResult =
`${type.toUpperCase()} EXAM (Out of ${max})

${details}
Total : ${total}/${grand}
Percentage : ${p}%
Grade : ${grade(p)}
Result : ${fail ? "FAIL" : "PASS"}`;

  result.innerHTML = lastResult.replaceAll("\n", "<br>");
}

/* PDF */
function downloadPDF() {
  if (!lastResult) return alert("Calculate result first");

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();

  pdf.setFontSize(14);
  pdf.text("EXAM RESULT MARKSHEET", 20, 20);

  pdf.setFontSize(11);
  pdf.text(lastResult, 20, 35);

  pdf.save("Exam_Result.pdf");
}

/* PRINT */
function printResult() {
  if (!lastResult) return alert("Calculate result first");

  let w = window.open("");
  w.document.write(`<pre style="font-size:14px">${lastResult}</pre>`);
  w.print();
  w.close();
}

/* SHARE */
async function shareResult() {
  if (!lastResult) return alert("Calculate result first");

  if (navigator.share) {
    await navigator.share({
      title: "Exam Result",
      text: lastResult
    });
  } else {
    window.open(
      "https://wa.me/?text=" + encodeURIComponent(lastResult),
      "_blank"
    );
  }
}
