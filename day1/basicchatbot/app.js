const API_URL = "http://127.0.0.1:8000";

async function greet() {
  const name = document.getElementById("name").value;
  const result = document.getElementById("result");

  if (!name.trim()) {
    result.textContent = "Please enter your name.";
    result.className = "error";
    return;
  }

  result.textContent = "Loading...";
  result.className = "loading";

  try {
    const response = await fetch(`${API_URL}/greet/${encodeURIComponent(name)}`);

    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}`);
    }

    const data = await response.json();
    result.textContent = data.message;
    result.className = "success";
  } catch (err) {
    result.textContent = "Error: could not reach the Python server. Is FastAPI running on port 8000?";
    result.className = "error";
  }
}
