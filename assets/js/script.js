const subjects = ["Hindi", "SS", "English", "Science", "Gujarati", "Maths", "Sanskrit"];
let lastResult = "";

function toggleTheme() {
  document.body.classList.toggle("light");
}

function loadExam() {
  form.innerHTML = "";
  result.innerHTML = "";

  if (!exam.value) return;

  if (exam.value === "weekly") {
    form.innerHTML = `
      <input id="weeklyMark" type="number" placeholder="Marks / 25">
      <button onclick="weekly()">Check</button>
    `;
    return;
  }

  subjects.forEach(subject => {
    form.innerHTML += `
      <input id="${subject}" type="number" placeholder="${subject}">
    `;
  });

  form.innerHTML += `<button onclick="term('${exam.value}')">Check</button>`;
}

function grade(p) {
  if (p >= 90) return "A+";
  if (p >= 80) return "A";
  if (p >= 70) return "B";
  if (p >= 60) return "C";
  if (p >= 50) return "D";
  return "F";
}

function weekly() {
  let m = +weeklyMark.value || 0;
  let p = (m / 25 * 100).toFixed(2);

  lastResult =
`Weekly Exam
Marks: ${m}/25
Percentage: ${p}%
Grade: ${grade(p)}
Result: ${m >= 8 ? "Pass" : "Fail"}`;

  result.innerHTML = lastResult.replaceAll("\n", "<br>");
}

function term(type) {
  let max = type === "annual" ? 80 : 50;
  let pass = type === "annual" ? 35 : 18;
  let total = 0;
  let fail = false;

  subjects.forEach(s => {
    let m = +document.getElementById(s).value || 0;
    total += m;
    if (m < pass) fail = true;
  });

  let grandTotal = max * subjects.length;
  let p = (total / grandTotal * 100).toFixed(2);

  lastResult =
`${type.toUpperCase()} Exam
Total: ${total}/${grandTotal}
Percentage: ${p}%
Grade: ${grade(p)}
Result: ${fail ? "Fail" : "Pass"}`;

  result.innerHTML = lastResult.replaceAll("\n", "<br>");
}

function downloadPDF() {
  if (!lastResult) {
    alert("Please calculate result first");
    return;
  }

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();
  pdf.text("Exam Result Marksheet", 20, 20);
  pdf.text(lastResult, 20, 40);
  pdf.save("marksheet.pdf");
}

function printResult() {
  if (!lastResult) {
    alert("Please calculate result first");
    return;
  }

  let win = window.open("");
  win.document.write("<pre>" + lastResult + "</pre>");
  win.print();
  win.close();
}

async function shareResult() {
  if (!lastResult) {
    alert("Please calculate result first");
    return;
  }

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
