<?php
require_once('helloWorld.php');
require_once('library.php');
require_once('book.php');
require_once('testFacade.php');
require_once('printer.php');
require_once('application.php');

$application = new Application();
$application->start();

?>