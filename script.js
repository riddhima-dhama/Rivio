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

    let tasks =
        JSON.parse(
            localStorage.getItem(
                "tasks"
            )
        ) || [];

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
    function updateDueTodayBanner() {

    const today =
        new Date()
            .toISOString()
            .split("T")[0];

    const dueTodayTasks =
        tasks.filter(
            task =>
                task.dueDate === today &&
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
            task.name
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
                            ${task.name}

                        </span>

                        <p>
                            📅 Due:
                            ${
                                task.dueDate ||
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
        () => {

            if (
                taskName.value.trim() ===
                ""
            ) {
                return;
            }

           tasks.push({
    name:
        taskName.value,

    dueDate:
        taskDate.value,

    category:
        taskCategory.value,

    completed:
        false
});

            localStorage.setItem(
                "tasks",
                JSON.stringify(
                    tasks
                )
            );

            displayTasks();

            taskName.value = "";
            taskDate.value = "";

            taskModal.style.display =
                "none";
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
        function (index) {

            tasks[index].completed =
                !tasks[index]
                    .completed;

            if (
                tasks[index]
                    .completed
            ) {

                const today =
                    new Date()
                        .toDateString();

                if (
                    lastCompletedDate
                    !== today
                ) {

                    streak++;

                    lastCompletedDate =
                        today;

                    localStorage.setItem(
                        "streak",
                        streak
                    );

                    localStorage.setItem(
                        "lastCompletedDate",
                        today
                    );
                }
            }

            localStorage.setItem(
                "tasks",
                JSON.stringify(
                    tasks
                )
            );

            displayTasks(
                searchInput
                    ? searchInput.value
                    : ""
            );
        };

    window.deleteTask =
        function (index) {

            tasks.splice(
                index,
                1
            );

            localStorage.setItem(
                "tasks",
                JSON.stringify(
                    tasks
                )
            );

            displayTasks(
                searchInput
                    ? searchInput.value
                    : ""
            );
        };
    window.editTask =
    function (index) {

        const updatedTask =
            prompt(
                "Edit task:",
                tasks[index].name
            );

        if (
            updatedTask &&
            updatedTask.trim() !== ""
        ) {

            tasks[index].name =
                updatedTask;

            localStorage.setItem(
                "tasks",
                JSON.stringify(
                    tasks
                )
            );

            displayTasks(
                searchInput
                    ? searchInput.value
                    : ""
            );
        }
    };   

    displayTasks();
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

    const tasks =
        JSON.parse(
            localStorage.getItem(
                "tasks"
            )
        ) || [];

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
                        ${task.dueDate || "No Date"}
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

    const tasks =
        JSON.parse(
            localStorage.getItem(
                "tasks"
            )
        ) || [];

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
