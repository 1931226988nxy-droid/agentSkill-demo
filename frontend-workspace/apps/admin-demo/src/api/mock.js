// 仅属于演示项目：业务模型与本地数据不进入公共组件库。
import { ref } from 'vue';
export const plans = ref(
  Array.from({ length: 27 }, (_, i) => ({
    id: `plan-${i + 1}`,
    name: `${i < 4 ? 2025 : 2026}年度检查方案 · ${['综合检查', '业务规范', '资料归集', '专项检查'][i % 4]}${String(i + 1).padStart(2, '0')}`,
    year: i < 4 ? '2025' : '2026',
    department: ['综合管理中心', '项目管理中心', '华东业务中心'][i % 3],
    status: ['pending', 'submitted', 'returned'][i % 3],
    description: '核对资料完整性、业务规范与问题整改情况，形成检查记录并跟进办理。',
    date: `2026-10-${String(22 - (i % 16)).padStart(2, '0')}`,
  })),
);
function assertActive(signal) {
  if (signal?.aborted) throw new DOMException('操作已取消', 'AbortError');
}
export async function listPlans({ page, pageSize, filters, signal }) {
  await Promise.resolve();
  assertActive(signal);
  const result = plans.value.filter(
    (row) =>
      (filters.year === 'all' || row.year === filters.year) &&
      row.name.toLowerCase().includes(filters.keyword.trim().toLowerCase()) &&
      (filters.status === 'all' || row.status === filters.status) &&
      (filters.tab === 'all' || row.status === filters.tab),
  );
  return {
    items: result.slice((page - 1) * pageSize, page * pageSize).map((row) => ({ ...row })),
    total: result.length,
  };
}
export async function savePlan(values, { signal } = {}) {
  assertActive(signal);
  if (values.id) {
    const index = plans.value.findIndex((row) => row.id === values.id);
    if (index < 0) throw new Error('方案已不存在');
    plans.value[index] = { ...plans.value[index], ...values, name: values.name.trim() };
    return plans.value[index];
  }
  const row = {
    ...values,
    id: crypto.randomUUID(),
    name: values.name.trim(),
    status: 'pending',
    date: new Date().toLocaleDateString('sv-SE'),
  };
  plans.value.unshift(row);
  return row;
}
export async function deletePlans(ids) {
  const keys = new Set(ids);
  plans.value = plans.value.filter((row) => !keys.has(row.id));
}
export const documents = ref([]);
const contents = new Map();
export async function uploadDocument(file, { signal, onProgress, category = 'general' } = {}) {
  assertActive(signal);
  const bytes = await file.arrayBuffer();
  assertActive(signal);
  const metadata = {
    id: crypto.randomUUID(),
    name: file.name,
    size: file.size,
    type: file.type,
    category,
    date: new Date().toLocaleDateString('sv-SE'),
  };
  contents.set(metadata.id, new Blob([bytes], { type: file.type }));
  documents.value.unshift(metadata);
  onProgress?.(100);
  return metadata;
}
export async function downloadDocument(file, { signal } = {}) {
  assertActive(signal);
  const blob = contents.get(file.id);
  if (!blob) throw new Error('文件已不存在或页面已刷新');
  return { blob, filename: file.name };
}
export function deleteDocument(id) {
  contents.delete(id);
  documents.value = documents.value.filter((file) => file.id !== id);
}
