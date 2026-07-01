import { v4 as uuid } from 'uuid';

function makeChecklist(items) {
  return items.map((text) => ({ id: uuid(), text, done: false }));
}

function task(overrides) {
  const now = new Date().toISOString();
  return {
    id: uuid(),
    title: '',
    project: '',
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
    ...overrides,
  };
}

export function getSeedTasks() {
  return [
    task({
      title: 'Макет: адаптивность, переименование слоёв, группировка Header/Footer',
      project: 'Сайт Oniks',
      type: 'Дизайн',
      priority: 'high',
      status: 'in_progress',
      deadline: '2026-07-03',
      checklist: makeChecklist(['Адаптив', 'Переименование слоёв', 'Группировка Header', 'Группировка Footer']),
    }),
    task({
      title: 'Заявки на сертификацию (5 бланков)',
      project: 'Сертификация',
      type: 'Документы',
      priority: 'medium',
      status: 'not_started',
      deadline: '2026-07-15',
      checklist: makeChecklist(['Бланк 1', 'Бланк 2', 'Бланк 3', 'Бланк 4', 'Бланк 5']),
    }),
    task({
      title: 'Бриф корп. лендинга + ссылки, согласование',
      project: 'Сайт Oniks',
      type: 'Дизайн',
      priority: 'high',
      status: 'in_progress',
      deadline: '2026-07-03',
      assignee: 'Миранда',
      tags: ['контент', 'согласование'],
      checklist: makeChecklist(['Бриф лендинга', 'Ссылки на сайт и обучающую программу', 'Согласовать с Мирандой']),
    }),
    task({
      title: 'Макет отзывов (страница + блок на карточках)',
      project: 'Сайт Oniks',
      type: 'Дизайн',
      priority: 'medium',
      status: 'not_started',
      deadline: '2026-07-13',
      checklist: makeChecklist(['Страница отзывов', 'Блок отзывов на карточках товара']),
    }),
    task({
      title: 'Наполнение карточек (мультикарточка по разделам)',
      project: 'Сайт Oniks',
      type: 'Контент',
      priority: 'medium',
      status: 'not_started',
      deadline: '2026-07-20',
      checklist: makeChecklist(['Болты', 'Винты', 'Гайки', 'Прочий крепёж']),
    }),
  ];
}
