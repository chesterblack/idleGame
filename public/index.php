<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GuyClicker</title>
    <link href="style.css" rel="stylesheet">
</head>
<body>

    <?php
        require_once ($_SERVER['DOCUMENT_ROOT'] . '/../guyclicker.class.php');
        $guyClicker = new GuyClicker();
        $savedGame = $guyClicker->loadGame();
        $guyCount = $savedGame->guys ?? 0;
        $guyCollection = $savedGame->museum ?? [];
        $guyMuseum = [];
    ?>

    <h1>
        Let's click some guys
    </h1>
    <div class="hud">
        <div>
            Guys you got: <span class="guy-counter"><?= $guyCount; ?></span>
        </div>
        <div>
            Guy collection:
            <div class="guy-collection">
                <?php
                    foreach ($guyCollection as $guyID) {
                        $guyMuseum[] = [
                            'id' => $guyID
                        ];

                        echo "<img src=\"/guys/guy-".$guyID.".png\" data-guyid=\"".$guyID."\">";
                    }
                ?>
            </div>
        </div>
    </div>
    <div class="guy-spawner"></div>
    <button class="guy-clicker">
        let there be guys
    </button>
    <button class="autoguy-toggle">you do it for me</button>

    <script src="guyclicker.js"></script>
</body>
</html>