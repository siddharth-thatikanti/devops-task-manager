import { useCallback, useEffect, useMemo, useState } from "react";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const loadTasks = useCallback(async () => {
    setError("");
    try {
      const response = await fetch("/api/tasks");
      if (!response.ok) throw new Error("Could not load tasks.");
      setTasks(await response.json());
    } catch {
      setError("Cannot reach the API. Check that the backend and database are running.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  async function addTask(event) {
    event.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle || saving) return;

    setSaving(true);
    setError("");
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: cleanTitle })
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Could not create task.");
      setTasks((current) => [body, ...current]);
      setTitle("");
    } catch (err) {
      setError(err.message || "Could not create task.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleTask(task) {
    setError("");
    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !task.completed })
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Could not update task.");
      setTasks((current) => current.map((item) => item.id === task.id ? body : item));
    } catch (err) {
      setError(err.message || "Could not update task.");
    }
  }

  async function deleteTask(id) {
    setError("");
    try {
      const response = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      if (!response.ok) {
        const body = await response.json();
        throw new Error(body.error || "Could not delete task.");
      }
      setTasks((current) => current.filter((task) => task.id !== id));
    } catch (err) {
      setError(err.message || "Could not delete task.");
    }
  }

  const filteredTasks = useMemo(() => tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  }), [tasks, filter]);

  const completedCount = tasks.filter((task) => task.completed).length;

  return (
    <main className="page">
      <header className="hero">
        <div className="eyebrow"><span className="status-dot" /> PERSONAL WORKSPACE</div>
        <h1>DevOps <span>Task Manager</span></h1>
        <p className="subtitle">Turn small steps into shipped work.</p>
        <div className="stats">
          <div className="stat"><strong>{tasks.length}</strong><span>Total tasks</span></div>
          <div className="stat"><strong>{tasks.length - completedCount}</strong><span>In progress</span></div>
          <div className="stat"><strong>{completedCount}</strong><span>Completed</span></div>
        </div>
      </header>

      <section className="panel">
        <div className="section-heading">
          <div><p className="eyebrow">YOUR WORKFLOW</p><h2>Tasks</h2></div>
          <button className="refresh-button" onClick={loadTasks} title="Refresh tasks">↻ Refresh</button>
        </div>

        <form className="add-form" onSubmit={addTask}>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="What do you need to get done?"
            maxLength={200}
            aria-label="New task title"
          />
          <button type="submit" disabled={!title.trim() || saving}>{saving ? "Adding…" : "+ Add task"}</button>
        </form>

        <div className="filters" aria-label="Filter tasks">
          {["all", "active", "completed"].map((value) => (
            <button
              key={value}
              className={filter === value ? "filter active-filter" : "filter"}
              onClick={() => setFilter(value)}
            >
              {value[0].toUpperCase() + value.slice(1)}
            </button>
          ))}
          <span className="task-count">{filteredTasks.length} shown</span>
        </div>

        {error && <div className="error" role="alert">{error}</div>}
        {loading ? <div className="empty">Loading tasks…</div> :
          filteredTasks.length === 0 ? (
            <div className="empty">
              <span className="empty-icon">✓</span>
              <strong>{tasks.length === 0 ? "A clean slate." : "Nothing in this filter."}</strong>
              <span>{tasks.length === 0 ? "Add a task above to get started." : "Try another filter or add a new task."}</span>
            </div>
          ) : (
            <ul className="task-list">
              {filteredTasks.map((task) => (
                <li className={task.completed ? "task completed-task" : "task"} key={task.id}>
                  <button
                    className={task.completed ? "check checked" : "check"}
                    onClick={() => toggleTask(task)}
                    aria-label={task.completed ? "Mark task active" : "Mark task completed"}
                  >{task.completed ? "✓" : ""}</button>
                  <div className="task-content">
                    <span className="task-title">{task.title}</span>
                    <span className="task-date">
                      {new Date(task.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                    </span>
                  </div>
                  <span className={task.completed ? "tag done-tag" : "tag"}>
                    {task.completed ? "DONE" : "ACTIVE"}
                  </span>
                  <button className="delete-button" onClick={() => deleteTask(task.id)} aria-label={`Delete ${task.title}`}>×</button>
                </li>
              ))}
            </ul>
          )}
        <footer className="panel-footer"><span>● API-connected workspace</span><span>Data stored in PostgreSQL</span></footer>
      </section>
      <p className="page-footer">Build consistently. Ship confidently.</p>
    </main>
  );
}
