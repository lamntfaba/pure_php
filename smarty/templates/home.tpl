{block name=head}
    <link href="public/css/style.css" rel="stylesheet" type="text/css"/>
    <link rel="stylesheet" href="public/css/all.min.css" />
{/block}

<h1>Todo List</h1>

<form method="post" action="tasks.php">
    <div>
        <input type="text" name="name" autofocus id="name" onkeypress="changeName()" autocomplete="off" placeholder="Type a task name" />
        <input type="submit" id="btnAddTask" name="submit" value="Add Task" disabled />
    </div>
</form>

<table>
    <thead>
        <th onclick="getAllTasks('id')" id="th-id" class="sort">ID</th>
        <th onclick="getAllTasks('name')" id="th-name" class="sort">Name</th>
        <th onclick="getAllTasks('is_completed')" id="th-is_completed" class="sort">Status</th>
        <th onclick="getAllTasks('priority')" id="th-priority" class="sort">Priority</th>
        <th>Action</th>
    </thead>
    <tbody id="tasksList">
    </tbody>
</table>

<h4>Completed tasks: {$completedTasks}</h4>
<h4>Total tasks: {sizeof($notes)}</h4>

<script>
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
                        currentSort = 'ASC';
                    } else {
                        currentSort = currentSort === 'ASC' ? 'DESC' : 'ASC';
                    }
                    currentField = field;
                }
                const columns = document.getElementsByTagName('th');
                for (const column of columns) {
                    column.innerHTML = column.innerText;
                }
                const currentColumn = document.getElementById('th-' + currentField);
                if (currentSort === 'ASC') {
                    currentColumn.innerHTML = currentColumn.innerText + ' <i class="fa fa-sort-amount-asc" aria-hidden="true"></i>';
                    results = records.sort((a, b) => (a[field] > b[field]) ? 1 : -1);
                } else if (currentSort === 'DESC') {
                    currentColumn.innerHTML = currentColumn.innerText + ' <i class="fa fa-sort-amount-desc" aria-hidden="true"></i>';
                    results = records.sort((a, b) => (a[field] > b[field]) ? -1 : 1);
                }

                const htmlStr = results.map(result => {
                    let priority = '';
                    switch (+result.priority) {
                        case 1:
                            priority = 'Critical';
                            break;
                        case 2:
                            priority = 'High';
                            break;
                        case 3:
                            priority = 'Medium';
                            break;
                        default:
                            priority = 'Low';
                            break;
                    }

                    let row = '<tr>';
                    row += '<td>#' + result.id + '</td>'
                    row += '<td><b>' + result.name + '</b></td>'
                    row += '<td>' + (+result.is_completed ? 'Completed' : 'New') + '</td>'
                    row += '<td><label class="status status-' + result.priority + '">' + priority + '</label></td>'
                    row += '<td>' +
                        '<button class="delete" onclick="deleteTask(' + result.id + ')"><i class="fa fa-times" aria-hidden="true"></i> Delete</button>' +
                        '<button class="update-status" onclick="changeStatusTask(' + result.id + ', ' + +result.is_completed + ')"><i class="fa fa-pencil" aria-hidden="true"></i> ' + (+result.is_completed ? 'Change to New' : 'Change to Completed') + '</button>' +
                        '<div class="dropdown">' +
                            '<button class="dropbtn"><i class="fa fa-pencil-square" aria-hidden="true"></i> Change priority</button>' +
                            '<div class="dropdown-content">' +
                                '<a href="javascript:void(0)" onclick="changePriority(' + result.id + ', 1)">Critical</a>' +
                                '<a href="javascript:void(0)" onclick="changePriority(' + result.id + ', 2)">High</a>' +
                                '<a href="javascript:void(0)" onclick="changePriority(' + result.id + ', 3)">Medium</a>' +
                                '<a href="javascript:void(0)" onclick="changePriority(' + result.id + ', 4)">Low</a>' +
                            '</div>' +
                        '</div>' +
                    '</td>';
                    row += '</tr>';
                    return row;
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
        fetch('/tasks.php?action=updateStatus&taskId=' + id + '&status=' + newStatus, { method: 'PUT' }).then(response => {
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
        fetch('/tasks.php?action=updatePriority&taskId=' + id + '&priority=' + priority, { method: 'PUT' }).then(response => {
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
        fetch('/tasks.php?action=delete&taskId=' + id, { method: 'DELETE' }).then(response => {
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
</script>