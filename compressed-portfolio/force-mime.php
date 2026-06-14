<?php
// Force correct MIME types for all file types
$file = $_SERVER['REQUEST_URI'];
$ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));

// Set correct MIME types
switch($ext) {
    case 'js':
    case 'mjs':
    case 'ts':
        header('Content-Type: application/javascript');
        header('X-Content-Type-Options: nosniff');
        break;
    case 'css':
    case 'scss':
    case 'sass':
        header('Content-Type: text/css');
        header('X-Content-Type-Options: nosniff');
        break;
    case 'svg':
        header('Content-Type: image/svg+xml');
        header('X-Content-Type-Options: nosniff');
        break;
    case 'woff':
    case 'woff2':
    case 'ttf':
    case 'eot':
        header('Content-Type: application/font-woff');
        header('X-Content-Type-Options: nosniff');
        break;
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'webp':
    case 'ico':
        header('X-Content-Type-Options: nosniff');
        break;
}

// Serve the actual file
$filepath = $_SERVER['DOCUMENT_ROOT'] . $file;
if (file_exists($filepath) && is_file($filepath)) {
    readfile($filepath);
} else {
    http_response_code(404);
    echo 'File not found';
}
?> 