const CSV_COLUMNS = [
  'id', 'title', 'project', 'type', 'status', 'priority', 'deadline', 'startDate',
  'progress', 'progressMode', 'effortEstimate', 'assignee', 'links', 'notes', 'tags',
  'checklist', 'createdAt', 'updatedAt',
];

function escapeCsv(value) {
  const str = value === null || value === undefined ? '' : String(value);
  if (/[",\n;]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function tasksToCsv(tasks) {
  const header = CSV_COLUMNS.join(';');
  const rows = tasks.map((t) =>
    CSV_COLUMNS.map((col) => {
      let value = t[col];
      if (col === 'links') value = (t.links ?? []).join(' | ');
      if (col === 'tags') value = (t.tags ?? []).join(', ');
      if (col === 'checklist') value = (t.checklist ?? []).map((c) => `${c.done ? '[x]' : '[ ]'} ${c.text}`).join(' | ');
      return escapeCsv(value);
    }).join(';')
  );
  return [header, ...rows].join('\n');
}

function parseCsvLine(line) {
  const result = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        cur += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ';') {
      result.push(cur);
      cur = '';
    } else {
      cur += ch;
    }
  }
  result.push(cur);
  return result;
}

export function csvToTasks(csvText) {
  const lines = csvText.split(/\r?\n/).filter((l) => l.length > 0);
  if (lines.length < 1) return [];
  const header = parseCsvLine(lines[0]);
  return lines.slice(1).map((line) => {
    const cells = parseCsvLine(line);
    const obj = {};
    header.forEach((col, idx) => {
      obj[col] = cells[idx] ?? '';
    });
    return {
      ...obj,
      progress: Number(obj.progress) || 0,
      effortEstimate: obj.effortEstimate ? Number(obj.effortEstimate) : null,
      links: obj.links ? obj.links.split('|').map((s) => s.trim()).filter(Boolean) : [],
      tags: obj.tags ? obj.tags.split(',').map((s) => s.trim()).filter(Boolean) : [],
      checklist: obj.checklist
        ? obj.checklist.split('|').map((s) => s.trim()).filter(Boolean).map((item, i) => ({
            id: `${obj.id || 'row'}-${i}`,
            text: item.replace(/^\[[ x]\]\s*/, ''),
            done: item.startsWith('[x]'),
          }))
        : [],
    };
  });
}

export function downloadFile(filename, content, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
