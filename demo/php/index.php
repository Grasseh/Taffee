<?php
require_once('application.php');
require_once('test.php');


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
