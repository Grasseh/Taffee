<?php
class Printer {
    
    public function basicMessage($message){
        echo $message . "\r\n";
    }
    
    public function basicDump($message){
        var_dump($message);
        echo "\r\n";
    }
    
    public function paragrapheStartMessage($message){
        echo "\r\n\r\n" . $message . "\r\n";
    }
    
    public function warningMessage($message){
        echo "\r\n\r\n" . strtoupper($message) . "\r\n\r\n";
    }
    
} 

?>
