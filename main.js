const API = "https://68a5b0d72a3deed2960e7566.mockapi.io/todo/tasks";
let tasks = [];

function getTime() {
  const now = new Date();
    let h = now.getHours();
    let m = now.getMinutes();
    if (m < 10) m = "0" + m;
    return h + ":" + m;
}

function fetchTasks() {
  fetch(API)
    .then(res => res.json())
    .then(data => {
      tasks = data;
      addUi();
    })
    .catch(err => alert("Oooooo nimadur xato ketdi bro:" + err));
}

function addTask(text) {
  const newTask = {
    text: text,
    done: false,
    added: getTime(),
    edited: null
  };
  fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newTask)
  })
    .then(() => fetchTasks())
    .catch(err => alert("Oooooo nimadur xato ketdi bro" + err));
}

function deleteTask(id) {
  fetch(`${API}/${id}`, { method: "DELETE" })
    .then(() => fetchTasks())
    .catch(err => alert("Oooooo nimadur xato ketdi bro" + err));
}

function editTask(id, newText) {
  fetch(`${API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: newText,
      edited: getTime()
    })
  })
    .then(() => fetchTasks())
    .catch(err => alert("Oooooo nimadur xato ketdi bro" + err));
}

function toggleDone(id, done) {
  fetch(`${API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ done })
  })
    .then(() => fetchTasks())
    .catch(err => alert("Oooooo nimadur xato ketdi bro" + err));
}

function addUi() {
  const taskList = document.querySelector(".task-item");
  taskList.innerHTML = "";

  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <input type="checkbox" ${task.done ? "checked" : ""}>
      <p class="task-text">${task.text}</p>
      <div><p class="date">Added: ${task.added}${task.edited ? ` | Edited: ${task.edited}` : ""}</p></div>
      <button class="edit-btn"><i class="fa-solid fa-pen"></i></button>
      <button class="delete-btn">x</button>
    `;

    li.querySelector('input[type="checkbox"]').onchange = function () {
      toggleDone(task.id, this.checked);
    };

    li.querySelector('.edit-btn').onclick = function () {
      const ninput = document.createElement("input");
      ninput.type = "text";
      ninput.value = task.text;
      ninput.onblur = function () {
        const newText = ninput.value.trim();
        if (newText) {
          editTask(task.id, newText);
        }
      };
      ninput.onkeypress = function (e) {
        if (e.key === "Enter") ninput.blur();
      };
      li.querySelector('.task-text').replaceWith(ninput);
      ninput.focus();
    };

    li.querySelector('.delete-btn').onclick = function () {
      deleteTask(task.id);
    };

    taskList.append(li);
  });

  updateProgress();
}

document.querySelector(".add-btn").onclick = function () {
  const input = document.querySelector(".add-task-input");
  const text = input.value.trim();
  if (text) {
    addTask(text);
    input.value = "";
  }
};

function updateProgress() {
  const doneCount = tasks.filter(t => t.done).length;
  const totalCount = tasks.length;
  const percent = totalCount ? Math.round((doneCount / totalCount) * 100) : 0;
  document.querySelector(".progress-label span:last-child").textContent = percent + "%";
  document.querySelector(".progress-fill").style.width = percent + "%";
}

fetchTasks();