<?php

require_once 'config/config.php';

$config = new config('database');
$driver = $config->get('driver');

$db = null;
switch ($driver) {
    case 'sqlite':
        require 'db/sqlite.php';
        $host = $config->get('host');
        $db = new sqlite($host);
    // ...
}

return $db;