<?php

    class GuyClicker
    {
        public $collection;

        function __construct() {
            include($_SERVER['DOCUMENT_ROOT'] . '/../vendor/autoload.php');
            $client = new MongoDB\Client(
                'mongodb+srv://chester:Rzzk4YIx5b9EGEOs@wyvernhole.2ydpn.mongodb.net/wyvernhole?retryWrites=true&w=majority'
            );

            $database = $client->guyclicker;
            $this->collection = $database->savegames;
        }

        function saveGame($guys, $id = null, $museum = []) {
            $inserts = [
                'guys' => $guys,
                'museum' => $museum
            ];

            if ($id) {
                $result = $this->collection->updateOne(
                    ['_id' => $id],
                    ['$set' => $inserts],
                    ['upsert' => true]
                );
            } else {
                $result = $this->collection->insertOne($inserts);
            }

            return $result;
        }

        function loadGame() {
            if (isset($_COOKIE['saveid'])) {
                $savedGame = $this->collection->findOne(['_id' => $_COOKIE['saveid']]);

                return $savedGame;
            }
        }
    }