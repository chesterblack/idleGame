<?php
    require_once ($_SERVER['DOCUMENT_ROOT'] . '/../guyclicker.class.php');

    $guyClicker = new GuyClicker();

    $saveid = $_GET['id'] ?? null;
    $guyMuseum = $_GET['museum'] ?? [];

    $result = $guyClicker->saveGame($_GET['guys'], $saveid, $guyMuseum);
    
    if (!isset($_GET['id'])) {
        $id = $result->getInsertedId();

        foreach ($id as $oid) {
            echo $oid;
        }
    }