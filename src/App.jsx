import { useState } from 'react';
import { useTasks } from './hooks/useTasks';
import TopBar from './components/Layout/TopBar';
import SummaryView from './components/Summary/SummaryView';
import TaskListView from './components/TaskList/TaskListView';
import KanbanView from './components/Kanban/KanbanView';
import CalendarView from './components/Calendar/CalendarView';
import TaskModal from './components/TaskModal/TaskModal';
import LoginScreen from './components/Auth/LoginScreen';
import { isAuthenticated, logout } from './lib/auth';

export default function App() {
  const [authed, setAuthed] = useState(isAuthenticated());

  const {
    tasks, projects, addTask, updateTask, deleteTask, setStatus,
    addProject, importTasks, resetAll,
  } = useTasks();

  const [view, setView] = useState('summary');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const openNewTask = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const openTask = (task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleSave = (payload) => {
    if (editingTask) updateTask(editingTask.id, payload);
    else addTask(payload);
  };

  const handleDelete = (id) => {
    deleteTask(id);
    setModalOpen(false);
  };

  if (!authed) {
    return <LoginScreen onSuccess={() => setAuthed(true)} />;
  }

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <TopBar
        view={view}
        onViewChange={setView}
        onNewTask={openNewTask}
        tasks={tasks}
        onImport={importTasks}
        onReset={resetAll}
        onLogout={() => { logout(); setAuthed(false); }}
      />

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6">
        {view === 'summary' && <SummaryView tasks={tasks} onOpenTask={openTask} />}
        {view === 'list' && (
          <TaskListView tasks={tasks} projects={projects} onOpenTask={openTask} onStatusChange={setStatus} />
        )}
        {view === 'kanban' && (
          <KanbanView tasks={tasks} onOpenTask={openTask} onStatusChange={setStatus} />
        )}
        {view === 'calendar' && <CalendarView tasks={tasks} onOpenTask={openTask} />}
      </main>

      <TaskModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        onDelete={handleDelete}
        task={editingTask}
        projects={projects}
        onAddProject={addProject}
      />
    </div>
  );
}
