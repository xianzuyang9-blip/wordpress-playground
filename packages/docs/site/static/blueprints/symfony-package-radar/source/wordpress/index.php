<?php
if (isset($_GET['playground-redirection-handler'], $_GET['next'])) {
    header('Location: ' . $_GET['next'], true, 302);
    exit;
}

header('Location: /symfony-package-radar/public/index.php', true, 302);
