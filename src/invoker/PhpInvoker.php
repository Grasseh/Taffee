<?php
require($argv[3]);
$myObject = new $argv[2]();
$paramFile = $argv[4];
$json = file_get_contents($paramFile);
$params = json_decode($json, true);
$myFunction = $argv[1];
print($myObject->$myFunction($params));
?>
