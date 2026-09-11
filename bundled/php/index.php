<?php
$token = getenv('DISCORD_TOKEN');
if (!$token) { fwrite(STDERR, "DISCORD_TOKEN is not configured\n"); exit(1); }
require __DIR__ . '/vendor/autoload.php';
echo "[Maszynka] PHP bundled bot template. Install includes DiscordPHP; run with a configured token.\n";
