// F1: read input -> apply logic -> update UI
function greet() {
  const name = document.getElementById("name").value;     // 1. Read input
  const result = document.getElementById("result");

  if (!name.trim()) {                                       // 2. Apply logic (validate)
    result.textContent = "Please enter your name.";
    return;
  }

  result.textContent = "Hello, " + name + "!";              // 3. Update UI
}

// Slide 14 stretch: an object carries structured data (same shape as JSON)
const course = {
  title: "FARM Full Stack",
  trainer: "Muhammad Faiz",
  duration: "2 days",
  topics: ["FastAPI", "React", "MongoDB", "RAG"]
};

function showCourse() {
  console.log(course.title);       // "FARM Full Stack"
  console.log(course.topics[3]);   // "RAG"  (arrays start at index 0)

  document.getElementById("result").textContent =
    course.title + " includes " + course.topics.join(", ");
}
