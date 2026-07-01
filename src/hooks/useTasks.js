import { useCallback, useEffect, useMemo, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { loadTasks, saveTasks, loadProjects, saveProjects, clearAll } from '../lib/storage';
import { getSeedTasks } from '../lib/seedData';
import { DEFAULT_PROJECTS } from '../lib/constants';
import { computeChecklistProgress } from '../lib/taskUtils';

export function useTasks() {
  const [tasks, setTasks] = useState(() => loadTasks() ?? getSeedTasks());
  const [projects, setProjects] = useState(() => loadProjects() ?? DEFAULT_PROJECTS);

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    saveProjects(projects);
  }, [projects]);

  const addTask = useCallback((data) => {
    const now = new Date().toISOString();
    const newTask = {
      id: uuid(),
      title: '',
      project: projects[0] ?? '',
      type: 'Дизайн',
      status: 'not_started',
      priority: 'medium',
      deadline: null,
      startDate: null,
      progress: 0,
      progressMode: 'auto',
      checklist: [],
      effortEstimate: null,
      assignee: '',
      links: [],
      notes: '',
      tags: [],
      createdAt: now,
      updatedAt: now,
      ...data,
    };
    setTasks((prev) => [newTask, ...prev]);
    return newTask;
  }, [projects]);

  const updateTask = useCallback((id, patch) => {
    setTasks((prev) => prev.map((t) => {
      if (t.id !== id) return t;
      const next = { ...t, ...patch, updatedAt: new Date().toISOString() };
      if (patch.checklist && next.progressMode === 'auto') {
        const auto = computeChecklistProgress(next.checklist);
        if (auto !== null) next.progress = auto;
      }
      if (next.status === 'done') next.progress = 100;
      return next;
    }));
  }, []);

  const deleteTask = useCallback((id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const setStatus = useCallback((id, status) => {
    updateTask(id, { status, progress: status === 'done' ? 100 : undefined });
  }, [updateTask]);

  const addProject = useCallback((name) => {
    setProjects((prev) => (prev.includes(name) ? prev : [...prev, name]));
  }, []);

  const removeProject = useCallback((name) => {
    setProjects((prev) => prev.filter((p) => p !== name));
  }, []);

  const importTasks = useCallback((newTasks, mode = 'replace') => {
    setTasks((prev) => (mode === 'replace' ? newTasks : [...prev, ...newTasks]));
    const importedProjects = Array.from(new Set(newTasks.map((t) => t.project).filter(Boolean)));
    setProjects((prev) => Array.from(new Set([...prev, ...importedProjects])));
  }, []);

  const resetAll = useCallback(() => {
    clearAll();
    setTasks(getSeedTasks());
    setProjects(DEFAULT_PROJECTS);
  }, []);

  const clearEverything = useCallback(() => {
    clearAll();
    setTasks([]);
    setProjects(DEFAULT_PROJECTS);
  }, []);

  return useMemo(() => ({
    tasks,
    projects,
    addTask,
    updateTask,
    deleteTask,
    setStatus,
    addProject,
    removeProject,
    importTasks,
    resetAll,
    clearEverything,
  }), [tasks, projects, addTask, updateTask, deleteTask, setStatus, addProject, removeProject, importTasks, resetAll, clearEverything]);
}
