<?php
require 'vendor/autoload.php';

$smarty = new Smarty();

$smarty->setTemplateDir('smarty/templates');
$smarty->setConfigDir('smarty/configs');
$smarty->setCompileDir('smarty/templates_c');
$smarty->setCacheDir('smarty/cache');

return $smarty;