CREATE TABLE IF NOT EXISTS tasks (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks (created_at DESC);

INSERT INTO tasks (title)
SELECT seed.title
FROM (VALUES
    ('Create my first task'),
    ('Connect Node.js to PostgreSQL'),
    ('Learn REST API basics')
) AS seed(title)
WHERE NOT EXISTS (SELECT 1 FROM tasks);
