// FARM Module 2 - JavaScript Application Logic

// 1. Greet Functionality
async function greet() {
  const nameInput = document.getElementById("name");
  const liveInput = document.getElementById("live");
  const resultDiv = document.getElementById("greetResult");

  const name = nameInput.value.trim();
  const live = liveInput.value.trim();

  if (!name) {
    showResult(resultDiv, "Please enter your name.", true);
    return;
  }

  // Try API first
  try {
    const response = await fetch("/api/greet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name, live: live })
    });

    if (response.ok) {
      const data = await response.json();
      showResult(resultDiv, data.message, false);
      return;
    }
  } catch (err) {
    console.log("FastAPI backend not reachable, using local JS fallback.");
  }

  // Client-side Fallback (matches Python logic in app.py)
  let msg = `Welcome back, ${name}!`;
  if (live) {
    msg = `Hello ${name}, welcome back! That's great! ${live} is a wonderful place. Hope you are enjoying your time in ${live}!`;
  }
  showResult(resultDiv, msg, false);
}

// 2. Arithmetic Calculator Functionality
async function calculate(operation) {
  const num1Input = document.getElementById("num1");
  const num2Input = document.getElementById("num2");
  const resultDiv = document.getElementById("calcResult");

  const val1 = num1Input.value.trim();
  const val2 = num2Input.value.trim();

  if (val1 === "" || val2 === "") {
    showResult(resultDiv, "Please enter both numbers.", true);
    return;
  }

  const num1 = parseFloat(val1);
  const num2 = parseFloat(val2);

  if (isNaN(num1) || isNaN(num2)) {
    showResult(resultDiv, "Please enter valid numeric values.", true);
    return;
  }

  // Try FastAPI API first
  try {
    const response = await fetch("/api/calculate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ num1: num1, num2: num2, operation: operation })
    });

    if (response.ok) {
      const data = await response.json();
      showResult(resultDiv, `<strong>Result:</strong> ${data.expression}`, false);
      return;
    } else {
      const errData = await response.json();
      showResult(resultDiv, errData.detail || "Calculation error", true);
      return;
    }
  } catch (err) {
    console.log("FastAPI backend not reachable, calculating locally.");
  }

  // Local calculation fallback
  let res, symbol;
  if (operation === "add") {
    res = num1 + num2;
    symbol = "+";
  } else if (operation === "subtract") {
    res = num1 - num2;
    symbol = "-";
  } else if (operation === "multiply") {
    res = num1 * num2;
    symbol = "*";
  } else if (operation === "divide") {
    if (num2 === 0) {
      showResult(resultDiv, "Error: Cannot divide by zero!", true);
      return;
    }
    res = num1 / num2;
    symbol = "/";
  } else if (operation === "power") {
    res = Math.pow(num1, num2);
    symbol = "**";
  }

  const rounded = Math.round(res * 100) / 100;
  showResult(resultDiv, `<strong>Result:</strong> ${num1} ${symbol} ${num2} = ${rounded}`, false);
}

function showResult(element, htmlContent, isError) {
  element.innerHTML = htmlContent;
  element.classList.remove("hidden");
  if (isError) {
    element.classList.add("error");
  } else {
    element.classList.remove("error");
  }
}

// 3. Check Backend Connection on Load
async function checkApiHealth() {
  const statusPill = document.getElementById("apiStatus");
  try {
    const res = await fetch("/docs", { method: "HEAD" });
    if (res.ok || res.status < 500) {
      statusPill.textContent = "● FastAPI Backend Connected";
      statusPill.className = "status-pill online";
      return;
    }
  } catch (e) {
    if (window.location.protocol === "file:") {
      statusPill.textContent = "● Running Locally in Browser (Static Mode)";
      statusPill.className = "status-pill online";
      return;
    }
  }
  statusPill.textContent = "○ FastAPI Backend Offline (Using Client Engine)";
  statusPill.className = "status-pill offline";
}

document.addEventListener("DOMContentLoaded", checkApiHealth);
