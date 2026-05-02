const taskInput = document.getElementById("taskInput");

const msgArea = document.getElementById("msgArea");
const taskListArea = document.getElementById("taskListArea");
const countTaskArea = document.getElementById("countTaskArea");

const addBtn = document.getElementById("addBtn");
const allTaskBtn = document.getElementById("allTaskBtn");
const completedTaskBtn = document.getElementById("completedTaskBtn");
const pendingTaskBtn = document.getElementById("pendingTaskBtn");

let editingId = null;

let currentFilter = JSON.parse(localStorage.getItem("currentFilter")) || 'all';
let allTask = JSON.parse(localStorage.getItem("myTasks")) || [];

const setActive = (btn) => {
    [allTaskBtn, completedTaskBtn, pendingTaskBtn].forEach(b => b.classList.remove("active-filter"));
    btn.classList.add("active-filter");
}



// All filter
allTaskBtn.onclick = () => {
    currentFilter = "all";
    setActive(allTaskBtn);
    applyFilter();
    localStorage.setItem("currentFilter", JSON.stringify(currentFilter));
};

// Completed
completedTaskBtn.onclick = () => {
    currentFilter = "completed";
    setActive(completedTaskBtn);
    applyFilter();
    localStorage.setItem("currentFilter", JSON.stringify(currentFilter));
};

// Pending
pendingTaskBtn.onclick = () => {
    currentFilter = "pending";
    setActive(pendingTaskBtn);
    applyFilter();
    localStorage.setItem("currentFilter", JSON.stringify(currentFilter));
}

// Apply filter
const applyFilter = () => {
    if (currentFilter === "completed") {
        setActive(completedTaskBtn);
        const completed = allTask.filter(t => t.done === true);
        if (completed.length === 0) {
            taskListArea.innerHTML = "<p>No completed tasks</p>";
            return;
        };
        countTaskArea.innerText = `Total completed tasks: ${completed.length}`;
        renderTasks(completed);
    } else if (currentFilter === "pending") {
        setActive(pendingTaskBtn);
        const pending = allTask.filter(t => t.done === false);
        if (pending.length === 0) {
            taskListArea.innerHTML = "<p>No pending tasks</p>";
            return;
        };
        countTaskArea.innerText = `Total pending tasks: ${pending.length}`;
        renderTasks(pending);
    } else {
        setActive(allTaskBtn);
        countTaskArea.innerText = `Total tasks: ${allTask.length}`;
        allTask.length === 0 ? taskListArea.innerHTML = "<p>No tasks added</p>" :
            renderTasks(allTask);
    }
}


// Render tasks on startup

const renderTasks = (arr) => {
    taskListArea.innerHTML = "";
    if (arr.length === 0) {
        taskListArea.innerHTML = "<p>✨ No tasks yet. Start adding!</p>";
    } else {
        arr.forEach((task) => {
            const taskBox = document.createElement("div");
            const taskName = document.createElement("span");
            const delBtn = document.createElement("button");
            const checkBox = document.createElement("input");
            const editBtn = document.createElement("button");

            checkBox.type = "checkbox";
            checkBox.checked = task.done;

            checkBox.addEventListener('change', function () {
                task.done = this.checked;
                localStorage.setItem("myTasks", JSON.stringify(allTask));
                applyFilter();
                showMsg(task.done ? "Marked done" : "Marked undone", "green");
            });

            if (task.done) {
                taskName.style.textDecoration = "line-through";
                taskName.style.opacity = "0.6";
            } else {
                taskName.style.textDecoration = "none";
                taskName.style.opacity = "1";
            };

            // editButton
            editBtn.innerText = "Edit";
            editBtn.onclick = () => {
                addBtn.innerText = "Save";
                taskInput.value = task.text
                editingId = task.id;
            };

            taskName.innerText = task.text + " ";
            delBtn.innerText = "❌";

            delBtn.onclick = () => deleteTask(task.id);
            taskBox.append(checkBox, taskName, delBtn, editBtn);
            taskListArea.appendChild(taskBox);
        });
    }
};

const saveAndRender = () => {
    localStorage.setItem("myTasks", JSON.stringify(allTask));
    applyFilter();
};

// Enter key support
taskInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        addTaskAction();
    }
})

// Disable add button
taskInput.addEventListener("input", () => {
    addBtn.disabled = taskInput.value.trim() === "";
})

const addTaskAction = () => {
    const taskText = taskInput.value.trim();

    if (taskText === "") return showMsg("Please enter a task", "red");

    if (editingId) {
        allTask = allTask.map(t => t.id === editingId ? { ...t, text: taskText } : t);
        editingId = null;
        addBtn.innerText = "Add task";
        saveAndRender();
        taskInput.value = "";
        showMsg("Task Updated", "green");
    } else {
        if (allTask.some(t => t.text === taskText)) return showMsg("Task already added", "red");

        allTask.push({
            id: Date.now(),
            text: taskText,
            done: false
        });
        saveAndRender();
        taskInput.value = "";
        showMsg("Task added successfully", "green");
    }
};

const deleteTask = (taskId) => {
    allTask = allTask.filter(t => t.id !== taskId);
    saveAndRender();
};

const clearAllAction = () => {
    if (allTask.length === 0) return showMsg("Nothing to clear", "red");
    allTask = [];
    saveAndRender();
    showMsg("Cleared all", "green");
};

const showMsg = (text, color) => {
    msgArea.innerText = text;
    msgArea.style.color = color;
    msgArea.style.display = "block";
    setTimeout(() => msgArea.style.display = "none", 1000);
};
// renderTasks(allTask);
applyFilter();