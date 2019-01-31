<?php
require($argv[3]);
$myObject = new $argv[2]();
$myFunction = $argv[1];
print($myObject->$myFunction());
?>
