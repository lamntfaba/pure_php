/**
 * priorities list
 * @type {[{label: string, value: number}, {label: string, value: number}, {label: string, value: number}, {label: string, value: number}]}
 */
const PRIORITIES = [{
    value: 1,
    label: 'Critical',
}, {
    value: 2,
    label: 'High',
}, {
    value: 3,
    label: 'Medium',
}, {
    value: 4,
    label: 'Low',
}];

/**
 * statuses list
 * @type {{NEW: string, COMPLETED: string}}
 */
const STATUS = {
    COMPLETED: 'Completed',
    NEW: 'New',
};

const SORT_TYPE = {
    ASC: {
        value: 'ASC',
        icon: 'fa fa-sort-amount-asc',
    },
    DESC: {
        value: 'DESC',
        icon: 'fa fa-sort-amount-desc',
    },
};

/**
 * Get priority label by value
 * @param priority
 * @returns {string}
 */
const getPriorityLabel = (priority) => {
    // When priority is undefined, set Low
    const id = !priority ? 4 : +priority;
    const priorityIndex = PRIORITIES.findIndex(p => p.value === id);
    return PRIORITIES[priorityIndex].label
}

/**
 * Get status label by value
 * @param is_completed
 * @returns {string}
 */
const getStatusLabel = (is_completed) => {
    return is_completed ? STATUS.COMPLETED : STATUS.NEW;
}

/**
 * Current sort field
 * @type is string
 */
let currentField = '';

/**
 * Current sort type, ASC or DESC
 * @type is string
 */
let currentSort = '';

/**
 * When a page loaded,, get all tasks
 */
window.onload = () => {
    getAllTasks();
}

/**
 * Get all task
 * @param field, if field is not empty, the tasks will be sort by field
 */
function getAllTasks(field) {
    fetch('/tasks.php', { method: 'GET' }).then(response => {
        response.json().then(records => {
            let results = records;
            if (field) {
                if (currentField !== field) {
                    currentSort = SORT_TYPE.ASC.value;
                } else {
                    currentSort = currentSort === SORT_TYPE.ASC.value ? SORT_TYPE.DESC.value : SORT_TYPE.ASC.value;
                }
                currentField = field;
            }
            const columns = document.getElementsByTagName('th');
            for (const column of columns) {
                column.innerHTML = column.innerText;
            }
            const currentColumn = document.getElementById(`th-${currentField}`);
            if (currentSort === SORT_TYPE.ASC.value) {
                currentColumn.innerHTML = `${currentColumn.innerText} <i class="${SORT_TYPE.ASC.icon}" aria-hidden="true"></i>`;
                results = records.sort((a, b) => (a[field] > b[field]) ? 1 : -1);
            } else if (currentSort === SORT_TYPE.DESC.value) {
                currentColumn.innerHTML = `${currentColumn.innerText} <i class="${SORT_TYPE.DESC.icon}" aria-hidden="true"></i>`;
                results = records.sort((a, b) => (a[field] > b[field]) ? -1 : 1);
            }

            const htmlStr = results.map(result => {
                return `
                    <tr>
                        <td>#${result.id}</td>
                        <td><b>${result.name}</b></td>
                        <td>${getStatusLabel(+result.is_completed)}</td>
                        <td><label class="status status-${result.priority}">${getPriorityLabel(result.priority)}</label></td>
                        <td>
                            <button class="delete" onclick="deleteTask(${result.id})"><i class="fa fa-times" aria-hidden="true"></i> Delete</button>
                            <button class="update-status" onclick="changeStatusTask(${result.id}, ${+result.is_completed})">
                                <i class="fa fa-pencil" aria-hidden="true"></i> ${(+result.is_completed ? 'Change to New' : 'Change to Completed')}
                            </button>
                            <div class="dropdown">
                                <button class="dropbtn"><i class="fa fa-pencil-square" aria-hidden="true"></i> Change priority</button>
                                <div class="dropdown-content">
                                    ${PRIORITIES.map(priority => {
                                        return `<a href="javascript:void(0)" onclick="changePriority(${result.id}, ${priority.value})">${getPriorityLabel(priority.value)}</a>`;
                                    }).join('')}
                                </div>
                            </div>
                        </td>
                    </tr>
                `;
            }).join('');

            const tasksList = document.getElementById('tasksList');
            tasksList.innerHTML = htmlStr;
        });
    });
}

/**
 * Update status of task
 * @param id
 * @param status
 */
function changeStatusTask(id, status) {
    const newStatus = status ? 0 : 1;
    fetch(`/tasks.php?action=updateStatus&taskId=${id}&status=${newStatus}`, { method: 'PUT' }).then(response => {
        if (response.status === 200) {
            location.reload();
        }
    });
}

/**
 * Update priority of task
 * @param id
 * @param priority
 */
function changePriority(id, priority) {
    fetch(`/tasks.php?action=updatePriority&taskId=${id}&priority=${priority}`, { method: 'PUT' }).then(response => {
        if (response.status === 200) {
            location.reload();
        }
    });
}

/**
 * Remove task
 * @param id
 */
function deleteTask(id) {
    fetch(`/tasks.php?action=delete&taskId=${id}`, { method: 'DELETE' }).then(response => {
        if (response.status === 200) {
            location.reload();
        }
    });
}

/**
 * This event is called when users type text on task name field.
 * If text isn't empty, add button will be enabled. Another case, that button will be disabled
 */
function changeName() {
    const name = document.getElementById('name');
    const button = document.getElementById('btnAddTask');
    if (name.value) {
        button.disabled = false;
    } else {
        button.disabled = true;
    }
}