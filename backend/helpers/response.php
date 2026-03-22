<?php

class Response
{
    public static function json($data, int $status = 200): void
    {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($data);
        exit;
    }

    public static function success($data = null, string $message = 'OK', int $status = 200): void
    {
        $response = ['message' => $message];

        if ($data !== null) {
            $response['data'] = $data;
        }

        self::json($response, $status);
    }

    public static function error(string $message = 'Error', int $status = 400, $errors = null): void
    {
        $response = ['error' => $message];

        if ($errors !== null) {
            $response['details'] = $errors;
        }

        self::json($response, $status);
    }
}