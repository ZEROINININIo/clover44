<?php
// sync.php

// CORS headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Handle OPTIONS request for CORS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Configuration
$SECRET_KEY = getenv('SYNC_SECRET') ?: '5531517'; // Replace or set via environment

// Helper function to send JSON response
function sendResponse($status, $data = null, $message = null) {
    $response = ['status' => $status];
    if ($data !== null) $response['data'] = $data;
    if ($message !== null) $response['message'] = $message;
    echo json_encode($response);
    exit();
}

// Validate secret
$secret = $_GET['secret'] ?? $_POST['secret'] ?? '';
if ($secret !== $SECRET_KEY) {
    http_response_code(403);
    sendResponse('error', null, 'Invalid secret');
}

// Validate project parameter
$project = $_GET['project'] ?? $_POST['project'] ?? '';
if (empty($project) || !preg_match('/^[a-zA-Z0-9_]+$/', $project)) {
    http_response_code(400);
    sendResponse('error', null, 'Invalid or missing project parameter');
}

// Ensure project directory exists
$baseDir = __DIR__ . '/data';
$projectDir = $baseDir . '/' . $project;

if (!is_dir($baseDir)) {
    mkdir($baseDir, 0777, true);
}
if (!is_dir($projectDir)) {
    mkdir($projectDir, 0777, true);
}

// Determine action
$action = $_GET['action'] ?? $_POST['action'] ?? '';

switch ($action) {
    case 'list':
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            http_response_code(405);
            sendResponse('error', null, 'Method not allowed');
        }
        $files = [];
        $dir = new DirectoryIterator($projectDir);
        foreach ($dir as $fileinfo) {
            if (!$fileinfo->isDot() && $fileinfo->getExtension() === 'json') {
                $files[] = $fileinfo->getFilename();
            }
        }
        echo json_encode(['files' => $files]);
        exit();

    case 'download':
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            http_response_code(405);
            sendResponse('error', null, 'Method not allowed');
        }
        $filename = $_GET['file'] ?? '';
        if (empty($filename) || !preg_match('/^[a-zA-Z0-9_]+\.json$/', $filename)) {
            http_response_code(400);
            sendResponse('error', null, 'Invalid filename');
        }
        $filepath = $projectDir . '/' . $filename;
        if (!file_exists($filepath)) {
            http_response_code(404);
            sendResponse('error', null, 'File not found');
        }
        $content = file_get_contents($filepath);
        $data = json_decode($content, true);
        if ($data === null) {
            http_response_code(500);
            sendResponse('error', null, 'Failed to parse JSON file');
        }
        // Send the raw JSON data directly, since the frontend expects the JSON object directly
        header('Content-Type: application/json');
        echo $content;
        exit();

    case 'upload':
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            http_response_code(405);
            sendResponse('error', null, 'Method not allowed');
        }
        
        $inputJSON = file_get_contents('php://input');
        $input = json_decode($inputJSON, true);
        
        if ($input === null) {
            http_response_code(400);
            sendResponse('error', null, 'Invalid JSON body');
        }
        
        $filename = $input['filename'] ?? '';
        if (empty($filename) || !preg_match('/^[a-zA-Z0-9_]+\.json$/', $filename)) {
            http_response_code(400);
            sendResponse('error', null, 'Invalid filename');
        }
        
        $data = $input['data'] ?? null;
        if ($data === null) {
            http_response_code(400);
            sendResponse('error', null, 'Empty data');
        }
        
        $filepath = $projectDir . '/' . $filename;
        if (file_put_contents($filepath, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)) === false) {
            http_response_code(500);
            sendResponse('error', null, 'Failed to write file');
        }
        sendResponse('success', null, 'File uploaded successfully');
        break;

    default:
        http_response_code(400);
        sendResponse('error', null, 'Invalid action');
}
