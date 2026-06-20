// ====================
// LANDING PAGE BUTTONS
// ====================

const getStartedBtn =
    document.querySelector(".primary-btn");

const signInBtn =
    document.querySelector(".secondary-btn");

if (getStartedBtn && signInBtn) {

    getStartedBtn.addEventListener(
        "click",
        () => {
            window.location.href =
                "signup.html";
        }
    );

    signInBtn.addEventListener(
        "click",
        () => {
            window.location.href =
                "login.html";
        }
    );
}

// ====================
// SIGNUP PAGE
// ====================

const signupForm =
    document.querySelector("#signup-form");

if (signupForm) {

    signupForm.addEventListener(
        "submit",
        (e) => {

            e.preventDefault();

            const name =
                document.querySelector(
                    "#name"
                ).value;

            const email =
                document.querySelector(
                    "#email"
                ).value;

            const password =
                document.querySelector(
                    "#password"
                ).value;

            const user = {
                name,
                email,
                password
            };

            localStorage.setItem(
                "rivioUser",
                JSON.stringify(user)
            );

            alert(
                "Account created successfully!"
            );

            window.location.href =
                "login.html";
        }
    );
}

// ====================
// LOGIN PAGE
// ====================

const loginForm =
    document.querySelector("#login-form");

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        (e) => {

            e.preventDefault();

            const email =
                document.querySelector(
                    "#login-email"
                ).value;

            const password =
                document.querySelector(
                    "#login-password"
                ).value;

            const savedUser =
                JSON.parse(
                    localStorage.getItem(
                        "rivioUser"
                    )
                );

            if (
                savedUser &&
                savedUser.email === email &&
                savedUser.password === password
            ) {
                window.location.href =
                    "dashboard.html";
            }
            else {
                alert(
                    "Invalid email or password!"
                );
            }
        }
    );
}

// ====================
// DASHBOARD GREETING
// ====================

const welcome =
    document.querySelector("#welcome");

if (welcome) {

    const user =
        JSON.parse(
            localStorage.getItem(
                "rivioUser"
            )
        );

    if (user) {
        welcome.textContent =
            `Hey, ${user.name} 👋`;
    }
}
// ====================
// TASK SYSTEM
// ====================

const addTaskBtn =
    document.getElementById(
        "addTaskBtn"
    );

const taskContainer =
    document.getElementById(
        "taskContainer"
    );

const emptyText =
    document.getElementById(
        "emptyText"
    );

const taskCount =
    document.getElementById(
        "task-count"
    );
    const dueTodayBanner =
    document.getElementById(
        "dueTodayBanner"
    );


if (addTaskBtn) {

    let tasks= [];

    let streak =
        parseInt(
            localStorage.getItem(
                "streak"
            )
        ) || 0;

    let lastCompletedDate =
        localStorage.getItem(
            "lastCompletedDate"
        );

    const taskModal =
        document.getElementById(
            "taskModal"
        );

    const saveTaskBtn =
        document.getElementById(
            "saveTaskBtn"
        );

    const taskName =
        document.getElementById(
            "taskName"
        );

    const taskDate =
        document.getElementById(
            "taskDate"
        );
    const taskCategory =
    document.getElementById(
        "taskCategory"
    );   

    const searchInput =
        document.getElementById(
            "searchInput"
        );
    const sortTasks =
    document.getElementById(
        "sortTasks"
    );
     const filterButtons =
    document.querySelectorAll(
        ".filter-btn"
    );

let currentFilter =
    "all";
    async function loadTasks() {

    try {

        const response =
            await fetch(
                "http://127.0.0.1:5000/tasks"
            );

        tasks =
            await response.json();

        displayTasks();

    }
    catch (error) {

        console.log(
            "Error loading tasks:",
            error
        );
    }
}
    function updateDueTodayBanner() {

    const today =
        new Date()
            .toISOString()
            .split("T")[0];

    const dueTodayTasks =
        tasks.filter(
            task =>
                task.due_date === today &&
                !task.completed
        );

    if (
        dueTodayTasks.length > 0
    ) {
        dueTodayBanner.textContent =
            `⚠️ You have ${dueTodayTasks.length} task${dueTodayTasks.length > 1 ? "s" : ""} due today.`;

        dueTodayBanner.style.display =
            "block";
    }
    else {
        dueTodayBanner.style.display =
            "none";
    }
}

    function displayTasks(
        searchText = ""
    ) {

        taskContainer.innerHTML = "";

        taskCount.textContent =
            tasks.length;

        let completedTasks = 0;

        let filteredTasks =
    tasks.filter((task) => {

        const matchesSearch =
            task.title
                .toLowerCase()
                .includes(
                    searchText
                        .toLowerCase()
                );

        const matchesFilter =
            currentFilter === "all"
            ||
            (
                currentFilter ===
                "completed"
                &&
                task.completed
            )
            ||
            (
                currentFilter ===
                "pending"
                &&
                !task.completed
            );

        return (
            matchesSearch
            &&
            matchesFilter
        );
    });
    if (sortTasks) {

    if (
        sortTasks.value ===
        "dueSoon"
    ) {

        filteredTasks.sort(
            (a, b) =>
                new Date(a.dueDate) -
                new Date(b.dueDate)
        );
    }

    else if (
        sortTasks.value ===
        "newest"
    ) {

        filteredTasks =
            [...filteredTasks]
                .reverse();
    }
}

        if (
            filteredTasks.length === 0
        ) {
            emptyText.style.display =
                "block";

            return;
        }

        emptyText.style.display =
            "none";

        filteredTasks.forEach(
    (task) => {

        const actualIndex =
            tasks.indexOf(task);

        if (
            task.completed
        ) {
            completedTasks++;
        }

        const taskCard =
            document.createElement(
                "div"
            );

                taskCard.classList.add(
                    "task-card"
                );

                taskCard.innerHTML = `
                    <div>

                        <span class="${
                            task.completed
                                ? "completed"
                                : ""
                        }">

                            ${task.category}
                            ${task.title}

                        </span>

                        <p>
                            📅 Due:
                            ${
                                task.due_date ||
                                "No Date"
                            }
                        </p>

                    </div>

                    <div>

                        <button onclick="editTask(${actualIndex})">
    ✏️
</button>

<button onclick="completeTask(${actualIndex})">
    ✓
</button>

<button onclick="deleteTask(${actualIndex})">
    🗑
</button>

                    </div>
                `;

                taskContainer.appendChild(
                    taskCard
                );
            }
        );

        const progress =
            tasks.length === 0
                ? 0
                : Math.round(
                    (
                        tasks.filter(
                            task =>
                                task.completed
                        ).length /
                        tasks.length
                    ) * 100
                );

        document.getElementById(
            "progress-count"
        ).textContent =
            `${progress}%`;

        document.getElementById(
            "streak-count"
        ).textContent =
            streak;
            updateDueTodayBanner();
    }

    addTaskBtn.addEventListener(
        "click",
        () => {
            taskModal.style.display =
                "flex";
        }
    );

    saveTaskBtn.addEventListener(
        "click",
        async () => {

            if (
                taskName.value.trim() ===
                ""
            ) {
                return;
            }

           await fetch(
    "http://127.0.0.1:5000/tasks",
    {
        method: "POST",
        headers: {
            "Content-Type":
                "application/json"
        },
        body: JSON.stringify({
            user_id: 1,
            title: taskName.value,
            due_date: taskDate.value,
            category: taskCategory.value
        })
    }
);

taskName.value = "";
taskDate.value = "";

taskModal.style.display =
    "none";

loadTasks();
        }
    );

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            () => {
                displayTasks(
                    searchInput.value
                );
            }
        );
    }
    if (sortTasks) {

    sortTasks.addEventListener(
        "change",
        () => {

            displayTasks(
                searchInput
                    ? searchInput.value
                    : ""
            );

        }
    );
}

    window.completeTask =
    async function (index) {

        const task =
            tasks[index];

        await fetch(
            `http://127.0.0.1:5000/tasks/${task.id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type":
                        "application/json"
                },
                body: JSON.stringify({
                    completed:
                        !task.completed
                })
            }
        );

        loadTasks();
    };

   window.deleteTask =
    async function (index) {

        const task =
            tasks[index];

        await fetch(
            `http://127.0.0.1:5000/tasks/${task.id}`,
            {
                method: "DELETE"
            }
        );

        loadTasks();
    };
    
    window.editTask =
    async function (index) {

        const task =
            tasks[index];

        const updatedTask =
            prompt(
                "Edit task:",
                task.title
            );

        if (
            !updatedTask ||
            updatedTask.trim() === ""
        ) {
            return;
        }

        await fetch(
            `http://127.0.0.1:5000/tasks/${task.id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type":
                        "application/json"
                },
                body: JSON.stringify({
                    title:
                        updatedTask
                })
            }
        );

        loadTasks();
    };

    loadTasks();
    filterButtons.forEach(
    (button) => {

        button.addEventListener(
            "click",
            () => {

                currentFilter =
                    button.dataset
                        .filter;

                filterButtons
                    .forEach(
                        btn =>
                            btn
                                .classList
                                .remove(
                                    "active"
                                )
                    );

                button.classList.add(
                    "active"
                );

                displayTasks(
                    searchInput
                        ? searchInput
                            .value
                        : ""
                );
            }
        );
    }
);
}
    // ====================
// CALENDAR PAGE
// ====================

const calendarContainer =
    document.getElementById(
        "calendarContainer"
    );

if (calendarContainer) {

    async function loadCalendar() {

    const response =
        await fetch(
            "http://127.0.0.1:5000/tasks"
        );

    const tasks =
        await response.json();

    calendarContainer.innerHTML =
        "";

    if (tasks.length === 0) {

        calendarContainer.innerHTML =
            `
            <p class="empty-text">
                No upcoming tasks.
            </p>
            `;

        return;
    }

    tasks.forEach(
        (task) => {

            const day =
                document.createElement(
                    "div"
                );

            day.classList.add(
                "calendar-day"
            );

            day.innerHTML = `
                <h3>
                    📅
                    ${
                        task.due_date ||
                        "No Date"
                    }
                </h3>

                <p class="calendar-task">
                    ${task.title}
                </p>
            `;

            calendarContainer
                .appendChild(
                    day
                );
        }
    );
}

loadCalendar();

    calendarContainer.innerHTML =
        "";

    if (tasks.length === 0) {

        calendarContainer.innerHTML =
            `
            <p class="empty-text">
                No upcoming tasks.
            </p>
            `;
    }
    else {

        tasks.forEach(
            (task) => {

                const day =
                    document.createElement(
                        "div"
                    );

                day.classList.add(
                    "calendar-day"
                );

                day.innerHTML = `
                    <h3>
                        📅
                        ${task.due_date || "No Date"}
                    </h3>

                    <p class="calendar-task">
                        ${task.name}
                    </p>
                `;

                calendarContainer
                    .appendChild(
                        day
                    );
            }
        );
    }
}

// ====================
// ANALYTICS PAGE
// ====================

const totalTasks =
    document.getElementById(
        "total-tasks"
    );

if (totalTasks) {

    async function loadAnalytics() {

        const response =
            await fetch(
                "http://127.0.0.1:5000/tasks"
            );

        const tasks =
            await response.json();

        const completed =
            tasks.filter(
                task =>
                    task.completed
            ).length;

        const pending =
            tasks.length -
            completed;

        const completion =
            tasks.length === 0
                ? 0
                : Math.round(
                    (
                        completed /
                        tasks.length
                    ) * 100
                );

        document.getElementById(
            "total-tasks"
        ).textContent =
            tasks.length;

        document.getElementById(
            "completed-tasks"
        ).textContent =
            completed;

        document.getElementById(
            "pending-tasks"
        ).textContent =
            pending;

        document.getElementById(
            "completion-rate"
        ).textContent =
            `${completion}%`;

        document.getElementById(
            "analytics-streak"
        ).textContent =
            parseInt(
                localStorage.getItem(
                    "streak"
                )
            ) || 0;
    }

    loadAnalytics();
}

// ====================
// SETTINGS PAGE
// ====================

const themeBtn =
    document.getElementById(
        "themeBtn"
    );

if (themeBtn) {

    const darkMode =
        localStorage.getItem(
            "theme"
        );

    if (darkMode === "dark") {
        document.body.classList.add(
            "dark-mode"
        );

        themeBtn.textContent =
            "On";
    }

    themeBtn.addEventListener(
        "click",
        () => {

            document.body.classList.toggle(
                "dark-mode"
            );

            const isDark =
                document.body
                .classList
                .contains(
                    "dark-mode"
                );

            localStorage.setItem(
                "theme",
                isDark
                    ? "dark"
                    : "light"
            );

            themeBtn.textContent =
                isDark
                    ? "On"
                    : "Off";
        }
    );
}

const clearBtn =
    document.getElementById(
        "clearBtn"
    );

if (clearBtn) {

    clearBtn.addEventListener(
        "click",
        () => {

            localStorage.removeItem(
                "tasks"
            );

            alert(
                "All tasks cleared!"
            );
        }
    );
}

const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        () => {

            window.location.href =
                "login.html";
        }
    );
}

// ====================
// CLOSE TASK SYSTEM
// ====================
