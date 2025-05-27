const chatBox = document.getElementById("chatBox");
const input = document.getElementById("userInput");

function addMessage(text, sender) {
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("message", sender);
  msgDiv.textContent = text;
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;

  saveToHistory(text, sender);
}

function sendMessage() {
  const prompt = input.value.trim();
  if (!prompt) return;

  addMessage(prompt, "user");
  input.value = "";

  fetch("/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  })
    .then((res) => res.json())
    .then((data) => {
      addMessage(data.text, "ai");
    })
    .catch((err) => {
      console.error(err);
      addMessage("Error fetching response", "ai");
    });
}

// Menambahkan event listener untuk 'Enter'
input.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault(); // Menghindari form submission default
    sendMessage();
  }
});

function saveToHistory(text, sender) {
  const history = JSON.parse(localStorage.getItem("chatHistory")) || [];
  history.push({ text, sender });
  localStorage.setItem("chatHistory", JSON.stringify(history));
}

function loadHistory() {
  const history = JSON.parse(localStorage.getItem("chatHistory")) || [];
  history.forEach(({ text, sender }) => {
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("message", sender);
    msgDiv.textContent = text;
    chatBox.appendChild(msgDiv);
  });
  chatBox.scrollTop = chatBox.scrollHeight;
}

function clearChat() {
  localStorage.removeItem("chatHistory");
  chatBox.innerHTML = "";
}

window.onload = loadHistory;
