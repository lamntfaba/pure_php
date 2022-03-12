<?php

$db = require('db/db.php');

/**
 * Get list tasks
 */
$notes = $db->fetchArray('select * from notes');

/**
 * Get Completed Tasks total
 */
$completedTasks = 0;
foreach ($notes as $note) {
    if ($note['is_completed']) {
        $completedTasks++;
    }
}

$view = require('lib/smarty.php');
$view->assign('notes', $notes);
$view->assign('completedTasks', $completedTasks);

$view->display('home.tpl');