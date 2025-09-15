<?php
header("Content-Type: application/json");
require "db.php";

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

switch ($action) {
    case 'getIdeas':
        $stmt = $pdo->query("
            SELECT i.*, 
                COALESCE(SUM(CASE WHEN v.vote_type='up' THEN 1 ELSE 0 END),0) as upvotes,
                COALESCE(SUM(CASE WHEN v.vote_type='down' THEN 1 ELSE 0 END),0) as downvotes,
                (SELECT COUNT(*) FROM comments c WHERE c.idea_id = i.id) as comments_count
            FROM ideas i
            LEFT JOIN votes v ON v.idea_id = i.id
            GROUP BY i.id
            ORDER BY i.created_at DESC
        ");
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        break;

    case 'addIdea':
        $data = json_decode(file_get_contents("php://input"), true);
        $stmt = $pdo->prepare("INSERT INTO ideas (author, title, content) VALUES (?, ?, ?)");
        $stmt->execute([$data['author'], $data['title'], $data['content']]);
        echo json_encode(["status" => "ok"]);
        break;

    case 'vote':
        $data = json_decode(file_get_contents("php://input"), true);
        $stmt = $pdo->prepare("
            INSERT INTO votes (idea_id, username, vote_type)
            VALUES (?, ?, ?)
            ON CONFLICT (idea_id, username) 
            DO UPDATE SET vote_type = EXCLUDED.vote_type
        ");
        $stmt->execute([$data['idea_id'], $data['username'], $data['vote_type']]);
        echo json_encode(["status" => "ok"]);
        break;

    case 'addComment':
        $data = json_decode(file_get_contents("php://input"), true);
        $stmt = $pdo->prepare("INSERT INTO comments (idea_id, author, text) VALUES (?, ?, ?)");
        $stmt->execute([$data['idea_id'], $data['author'], $data['text']]);
        echo json_encode(["status" => "ok"]);
        break;

    case 'getComments':
        $ideaId = (int)$_GET['idea_id'];
        $stmt = $pdo->prepare("SELECT * FROM comments WHERE idea_id = ? ORDER BY created_at ASC");
        $stmt->execute([$ideaId]);
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        break;

    default:
        echo json_encode(["error" => "Acción no válida"]);
}
?>
