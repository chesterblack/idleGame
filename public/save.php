<?php
    require_once ($_SERVER['DOCUMENT_ROOT'] . '/../guyclicker.class.php');

    $guyClicker = new GuyClicker();

    $saveid = $_GET['id'] ?? null;
    
    if (!isset($_GET['id'])) {
        $id = $guyClicker->saveGame($_GET['guys'], $saveid)->getInsertedId();
        foreach ($id as $oid) {
            echo $oid;
        }
    } else {
        $guyClicker->saveGame($_GET['guys'], $saveid);
    }