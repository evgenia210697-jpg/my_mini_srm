import { useEffect, useState } from 'react';
import Modal from '../common/Modal';
import ChecklistEditor from './ChecklistEditor';
import { STATUSES, PRIORITIES, TASK_TYPES } from '../../lib/constants';
import { computeChecklistProgress } from '../../lib/taskUtils';

const emptyDraft = {
  title: '',
  project: '',
  type: 'Дизайн',
  status: 'not_started',
  priority: 'medium',
  deadline: '',
  startDate: '',
  progress: 0,
  progressMode: 'auto',
  checklist: [],
  effortEstimate: '',
  assignee: '',
  links: [],
  notes: '',
  tags: [],
};

export default function TaskModal({ open, onClose, onSave, onDelete, task, projects, onAddProject }) {
  const [draft, setDraft] = useState(emptyDraft);
  const [linkDraft, setLinkDraft] = useState('');
  const [tagDraft, setTagDraft] = useState('');
  const [newProject, setNewProject] = useState('');
  const [addingProject, setAddingProject] = useState(false);

  useEffect(() => {
    if (open) {
      setDraft(
        task
          ? {
              ...emptyDraft,
              ...task,
              deadline: task.deadline ?? '',
              startDate: task.startDate ?? '',
              effortEstimate: task.effortEstimate ?? '',
            }
          : { ...emptyDraft, project: projects[0] ?? '' }
      );
      setAddingProject(false);
      setNewProject('');
    }
  }, [open, task, projects]);

  const set = (patch) => setDraft((prev) => ({ ...prev, ...patch }));

  const autoProgress = computeChecklistProgress(draft.checklist);
  const effectiveProgress = draft.status === 'done' ? 100 : draft.progressMode === 'auto' ? (autoProgress ?? draft.progress) : draft.progress;

  const handleSave = () => {
    if (!draft.title.trim()) return;
    const payload = {
      ...draft,
      title: draft.title.trim(),
      deadline: draft.deadline || null,
      startDate: draft.startDate || null,
      effortEstimate: draft.effortEstimate === '' ? null : Number(draft.effortEstimate),
      progress: effectiveProgress,
    };
    onSave(payload);
    onClose();
  };

  const addLink = () => {
    const url = linkDraft.trim();
    if (!url) return;
    set({ links: [...draft.links, url] });
    setLinkDraft('');
  };

  const addTag = () => {
    const t = tagDraft.trim();
    if (!t || draft.tags.includes(t)) return;
    set({ tags: [...draft.tags, t] });
    setTagDraft('');
  };

  const commitNewProject = () => {
    const name = newProject.trim();
    if (!name) return;
    onAddProject(name);
    set({ project: name });
    setNewProject('');
    setAddingProject(false);
  };

  return (
    <Modal open={open} onClose={onClose} title={task ? 'Редактировать задачу' : 'Новая задача'}>
      <div className="space-y-4">
        <div>
          <label className="text-xs font-medium text-[#6B7280]">Название</label>
          <input
            autoFocus
            value={draft.title}
            onChange={(e) => set({ title: e.target.value })}
            placeholder="Что нужно сделать?"
            className="mt-1 w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2D6BFF]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-[#6B7280]">Проект / категория</label>
            {addingProject ? (
              <div className="mt-1 flex gap-1">
                <input
                  autoFocus
                  value={newProject}
                  onChange={(e) => setNewProject(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && commitNewProject()}
                  placeholder="Название проекта"
                  className="flex-1 border border-[#E5E7EB] rounded-lg px-2 py-2 text-sm focus:outline-none focus:border-[#2D6BFF]"
                />
                <button onClick={commitNewProject} className="px-2 rounded-lg bg-[#EEF2FF] text-[#2D6BFF] text-sm">✓</button>
              </div>
            ) : (
              <select
                value={draft.project}
                onChange={(e) => {
                  if (e.target.value === '__new__') setAddingProject(true);
                  else set({ project: e.target.value });
                }}
                className="mt-1 w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2D6BFF] bg-white"
              >
                {projects.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
                <option value="__new__">+ Новый проект…</option>
              </select>
            )}
          </div>
          <div>
            <label className="text-xs font-medium text-[#6B7280]">Тип задачи</label>
            <select
              value={draft.type}
              onChange={(e) => set({ type: e.target.value })}
              className="mt-1 w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2D6BFF] bg-white"
            >
              {TASK_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-medium text-[#6B7280]">Статус</label>
            <select
              value={draft.status}
              onChange={(e) => set({ status: e.target.value })}
              className="mt-1 w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2D6BFF] bg-white"
            >
              {STATUSES.map((s) => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-[#6B7280]">Важность</label>
            <select
              value={draft.priority}
              onChange={(e) => set({ priority: e.target.value })}
              className="mt-1 w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2D6BFF] bg-white"
            >
              {PRIORITIES.map((p) => (
                <option key={p.id} value={p.id}>{p.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-[#6B7280]">Трудозатраты (ч)</label>
            <input
              type="number"
              min="0"
              value={draft.effortEstimate}
              onChange={(e) => set({ effortEstimate: e.target.value })}
              className="mt-1 w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2D6BFF]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-[#6B7280]">Дата старта</label>
            <input
              type="date"
              value={draft.startDate}
              onChange={(e) => set({ startDate: e.target.value })}
              className="mt-1 w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2D6BFF]"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-[#6B7280]">Срок (дедлайн)</label>
            <input
              type="date"
              value={draft.deadline}
              onChange={(e) => set({ deadline: e.target.value })}
              className="mt-1 w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2D6BFF]"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-[#6B7280]">Чеклист / подзадачи</label>
          </div>
          <div className="mt-1.5">
            <ChecklistEditor checklist={draft.checklist} onChange={(checklist) => set({ checklist })} />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-medium text-[#6B7280]">Прогресс — {effectiveProgress}%</label>
            <div className="flex text-xs gap-1">
              <button
                onClick={() => set({ progressMode: 'auto' })}
                className={`px-2 py-0.5 rounded-full ${draft.progressMode === 'auto' ? 'bg-[#2D6BFF] text-white' : 'bg-[#F1F2F4] text-[#6B7280]'}`}
              >
                Авто (чеклист)
              </button>
              <button
                onClick={() => set({ progressMode: 'manual' })}
                className={`px-2 py-0.5 rounded-full ${draft.progressMode === 'manual' ? 'bg-[#2D6BFF] text-white' : 'bg-[#F1F2F4] text-[#6B7280]'}`}
              >
                Вручную
              </button>
            </div>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={effectiveProgress}
            disabled={draft.progressMode === 'auto' && autoProgress !== null}
            onChange={(e) => set({ progress: Number(e.target.value) })}
            className="w-full accent-[#2D6BFF] disabled:opacity-50"
          />
          {draft.progressMode === 'auto' && autoProgress === null && (
            <p className="text-xs text-[#9AA1AE] mt-1">В чеклисте нет пунктов — задайте прогресс вручную.</p>
          )}
        </div>

        <div>
          <label className="text-xs font-medium text-[#6B7280]">Ответственный / согласование</label>
          <input
            value={draft.assignee}
            onChange={(e) => set({ assignee: e.target.value })}
            placeholder="напр. согласовать с Мирандой"
            className="mt-1 w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2D6BFF]"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-[#6B7280]">Ссылки</label>
          <div className="mt-1 space-y-1">
            {draft.links.map((link, i) => (
              <div key={i} className="flex items-center gap-2">
                <a href={link} target="_blank" rel="noreferrer" className="flex-1 text-sm text-[#2D6BFF] truncate hover:underline">{link}</a>
                <button onClick={() => set({ links: draft.links.filter((_, idx) => idx !== i) })} className="text-[#9AA1AE] hover:text-[#DC2626] w-6 h-6">×</button>
              </div>
            ))}
            <div className="flex gap-2">
              <input
                value={linkDraft}
                onChange={(e) => setLinkDraft(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addLink())}
                placeholder="https://…"
                className="flex-1 border border-[#E5E7EB] rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-[#2D6BFF]"
              />
              <button onClick={addLink} className="px-3 py-1.5 text-sm rounded-lg bg-[#EEF2FF] text-[#2D6BFF] font-medium">Добавить</button>
            </div>
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-[#6B7280]">Теги</label>
          <div className="mt-1 flex flex-wrap gap-1.5 items-center">
            {draft.tags.map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-[#F1F2F4] text-[#4B5563]">
                {tag}
                <button onClick={() => set({ tags: draft.tags.filter((t) => t !== tag) })} className="text-[#9AA1AE] hover:text-[#DC2626]">×</button>
              </span>
            ))}
            <input
              value={tagDraft}
              onChange={(e) => setTagDraft(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              placeholder="+ тег"
              className="w-24 text-xs border border-[#E5E7EB] rounded-full px-2 py-1 focus:outline-none focus:border-[#2D6BFF]"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-[#6B7280]">Заметки</label>
          <textarea
            value={draft.notes}
            onChange={(e) => set({ notes: e.target.value })}
            rows={3}
            className="mt-1 w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2D6BFF] resize-none"
          />
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[#EEF0F3]">
          {task ? (
            <button
              onClick={() => onDelete(task.id)}
              className="text-sm font-medium text-[#DC2626] hover:underline"
            >
              Удалить задачу
            </button>
          ) : <span />}
          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium text-[#4B5563] hover:bg-[#F1F2F4]">Отмена</button>
            <button
              onClick={handleSave}
              disabled={!draft.title.trim()}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-[#2D6BFF] hover:bg-[#1E54DB] disabled:opacity-40"
            >
              Сохранить
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
