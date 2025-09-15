CREATE TABLE ideas (
    id SERIAL PRIMARY KEY,
    author VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE votes (
    id SERIAL PRIMARY KEY,
    idea_id INT REFERENCES ideas(id) ON DELETE CASCADE,
    username VARCHAR(100) NOT NULL,
    vote_type VARCHAR(10) CHECK (vote_type IN ('up', 'down')),
    UNIQUE (idea_id, username) -- un usuario un voto por idea
);

CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    idea_id INT REFERENCES ideas(id) ON DELETE CASCADE,
    author VARCHAR(100) NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
