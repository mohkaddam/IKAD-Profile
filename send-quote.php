<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}

// Honeypot: real users never fill this hidden field, bots often do.
if (!empty($_POST['website'])) {
    echo json_encode(['success' => true]);
    exit;
}

function field($key) {
    return isset($_POST[$key]) ? trim(strip_tags($_POST[$key])) : '';
}

$name = field('name');
$email = field('email');
$phone = field('phone');
$subject = field('subject') ?: 'General Enquiry';
$message = field('message');

if ($name === '' || $email === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Please fill in your name, a valid email and your message.']);
    exit;
}

$to = 'info@ikadeng.com';
$cc = 'm.kaddam@ikadeng.com';
$emailSubject = 'Website Enquiry: ' . $subject;

$body = "New enquiry from the IKAD Engineering website contact form.\n\n";
$body .= "Name: $name\n";
$body .= "Email: $email\n";
$body .= "Phone: " . ($phone !== '' ? $phone : 'Not provided') . "\n";
$body .= "Subject: $subject\n\n";
$body .= "Message:\n$message\n";

$headers = [
    'From: IKAD Engineering Website <noreply@ikadeng.com>',
    'Reply-To: ' . $name . ' <' . $email . '>',
    'Cc: ' . $cc,
    'Content-Type: text/plain; charset=UTF-8',
    'MIME-Version: 1.0',
];

$sent = @mail($to, $emailSubject, $body, implode("\r\n", $headers));

if ($sent) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Something went wrong sending your message. Please email us directly at info@ikadeng.com.']);
}
