<?php

/**
 * This file include function which return list, create, update or delete task
 */
$db = require('db/db.php');

/**
 * Get params from URL
 */
$params = parse_url($_SERVER['REQUEST_URI'], PHP_URL_QUERY);
parse_str($params, $output);
$requestMethod = $_SERVER["REQUEST_METHOD"];

/**
 * Check params is exist
 */
if ($output) {
    $action = $output['action'];
    $taskId = $output['taskId'];
}

if ($requestMethod == 'GET') {
    /**
     * Get tasks list
     */
    $notes = $db->fetchArray('select * from notes');
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($notes);
} else if ($requestMethod == 'POST') {
    /**
     * Create a task
     */
    $query = "SELECT MAX(id) as maxId from notes";
    $result =  $db->query($query);
    while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
        $data[] = $row;
    }
    $newTaskId = $data[0]['maxId'] + 1;
    $query = "INSERT INTO notes(id, name, is_completed, priority) VALUES (".$newTaskId.", ' ".$_POST['name']."', 0, 4)";
    $result =  $db->query($query);
    if($result)
    {
        echo "<script>window.location='index.php';</script>";
    }
} else if ($requestMethod == 'PUT') {
    /**
     * Update a task, include update status or priority
     */
    if ($action == 'updateStatus') {
        $status = $output['status'];
        $query = "UPDATE notes SET is_completed = ".$status." where id = ".$taskId;
        $result =  $db->query($query);
        if($result)
        {
            echo "Success";
        }
        else
        {
            echo "Fail";
        }
    } else if ($action == 'updatePriority') {
        $priority = $output['priority'];
        $query = "UPDATE notes SET priority = ".$priority." where id = ".$taskId;
        $result =  $db->query($query);
        if($result)
        {
            echo "Success";
        }
        else
        {
            echo "Fail";
        }
    }
} else if ($requestMethod == 'DELETE') {
    /**
     * Delete a task
     */
    $query = "DELETE FROM notes WHERE id = ".$taskId;
    $result =  $db->query($query);
    if($result)
    {
        echo "Success";
    }
    else
    {
        echo "Fail";
    }
}
