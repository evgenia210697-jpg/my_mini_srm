const TASKS_KEY = 'dashboard.tasks.v1';
const PROJECTS_KEY = 'dashboard.projects.v1';

export function loadTasks() {
  try {
    const raw = localStorage.getItem(TASKS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveTasks(tasks) {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

export function loadProjects() {
  try {
    const raw = localStorage.getItem(PROJECTS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveProjects(projects) {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
}

export function clearAll() {
  localStorage.removeItem(TASKS_KEY);
  localStorage.removeItem(PROJECTS_KEY);
}
