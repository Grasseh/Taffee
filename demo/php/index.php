<?php
require_once('application.php');
require_once('test.php');

error_reporting(E_ERROR | E_WARNING | E_PARSE);
$runTest = false;
if (count($argv) == 2){
    $runTest = $argv[1];
}

if ($runTest == "true" || $runTest == 1){
    $test = new Test();
    $test->start();
}

$application = new Application();
$application->start();

?>
