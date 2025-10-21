<template>
  <div class="analytics-summary-page">
    <div class="top-filter">
      <div class="filter-row">
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="—"
          start-placeholder="Дата от"
          end-placeholder="Дата до"
          value-format="yyyy-MM-dd"
          class="filter-item"
        />
        <el-select v-model="status" placeholder="Статус" class="filter-item" clearable>
          <el-option label="Все" value="all" />
          <el-option label="Выполнено" value="done" />
          <el-option label="В работе" value="in_progress" />
          <el-option label="Просрочено" value="overdue" />
        </el-select>
        <el-input
          v-model="search"
          placeholder="Поиск по заявке / клиенту"
          clearable
          class="filter-item filter-search"
        >
          <template #prefix>
            <i class="el-icon-search"></i>
          </template>
        </el-input>
        <el-button type="primary" @click="resetFilters" class="filter-item">Сброс</el-button>
      </div>

      <div class="top-summary">
        <div class="summary-item">
          <div class="summary-label">Всего заявок</div>
          <div class="summary-value">{{ totalCount }}</div>
        </div>
        <div class="summary-item">
          <div class="summary-label">Выполнено</div>
          <div class="summary-value color-success">{{ doneCount }}</div>
        </div>
        <div class="summary-item">
          <div class="summary-label">В работе</div>
          <div class="summary-value color-warning">{{ inProgressCount }}</div>
        </div>
        <div class="summary-item">
          <div class="summary-label">Просрочено</div>
          <div class="summary-value color-danger">{{ overdueCount }}</div>
        </div>
      </div>
    </div>

    <el-card class="table-card">
      <el-table
        :data="pagedData"
        stripe
        size="small"
        class="analytics-table"
        :default-sort="{ prop: sortBy, order: sortOrder }"
      >
        <el-table-column
          prop="date"
          label="Дата"
          width="120"
          :sortable="true"
          @header-click="handleSort('date')"
        >
        </el-table-column>

        <el-table-column
          prop="plan"
          label="План"
          width="90"
          :sortable="true"
          @header-click="handleSort('plan')"
        />

        <el-table-column
          prop="fact"
          label="Факт"
          width="90"
          :sortable="true"
          @header-click="handleSort('fact')"
        />

        <el-table-column
          prop="execution"
          label="Выполнение %"
          width="140"
          :sortable="true"
          @header-click="handleSort('execution')"
        >
          <template #default="{ row }">
            <div :class="['cell-execution', executionClass(row.execution)]">
              <span class="execution-value">{{ row.execution }}%</span>
              <span class="execution-delta" v-if="row.delta !== 0">
                <i :class="['delta-arrow', row.delta > 0 ? 'up' : 'down']"></i>
                {{ Math.abs(row.delta) }}%
              </span>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="channel" label="Канал" width="140" />
        <el-table-column prop="manager" label="Менеджер" width="160" />
        <el-table-column prop="notes" label="Примечание" />

      </el-table>

      <div class="table-footer">
        <el-pagination
          background
          layout="prev, pager, next, ->, total"
          :total="filteredData.length"
          :page-size="pageSize"
          :current-page.sync="page"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Ref } from 'vue'

interface Row {
  id: number
  date: string
  plan: number
  fact: number
  execution: number
  delta: number
  channel: string
  manager: string
  notes?: string
  status: 'done' | 'in_progress' | 'overdue' | 'other'
}

const dateRange = ref<[string, string] | null>(null)
const status = ref<string>('all')
const search = ref<string>('')

const sortBy = ref<string>('date')
const sortOrder = ref<'ascending' | 'descending'>('descending')

const page = ref(1)
const pageSize = ref(10)

// Mock data set — realistic example rows
const rows = ref<Row[]>(generateMockRows())

function generateMockRows(): Row[] {
  const base: Row[] = []
  const channels = ['Онлайн', 'Call-центр', 'F2F', 'СТП']
  const managers = ['Иванов', 'Петров', 'Сидоров', 'Кузнецов']
  for (let i = 1; i <= 28; i++) {
    const plan = Math.floor(Math.random() * 60) + 20
    const fact = Math.max(0, plan + Math.floor((Math.random() - 0.4) * 30))
    const exec = Math.round((fact / plan) * 100)
    const delta = Math.round((Math.random() - 0.5) * 40)
    const date = new Date()
    date.setDate(date.getDate() - (28 - i))
    base.push({
      id: i,
      date: date.toISOString().slice(0, 10),
      plan,
      fact,
      execution: exec,
      delta,
      channel: channels[i % channels.length],
      manager: managers[i % managers.length],
      notes: i % 5 === 0 ? 'Пик нагрузки' : '',
      status: exec >= 100 ? 'done' : exec >= 60 ? 'in_progress' : 'overdue'
    })
  }
  return base
}

// Filtering
const filteredData = computed(() => {
  let data = rows.value.slice()
  if (dateRange.value && dateRange.value.length === 2) {
    const [from, to] = dateRange.value
    data = data.filter((r) => r.date >= from && r.date <= to)
  }
  if (status.value && status.value !== 'all') {
    data = data.filter((r) => r.status === status.value)
  }
  if (search.value && search.value.trim().length > 0) {
    const q = search.value.trim().toLowerCase()
    data = data.filter(
      (r) =>
        String(r.id).includes(q) ||
        r.channel.toLowerCase().includes(q) ||
        r.manager.toLowerCase().includes(q) ||
        (r.notes || '').toLowerCase().includes(q)
    )
  }
  return data
})

// Sorting
const sortedData = computed(() => {
  const data = filteredData.value.slice()
  const sBy = sortBy.value
  const order = sortOrder.value === 'ascending' ? 1 : -1
  data.sort((a: any, b: any) => {
    const va = a[sBy]
    const vb = b[sBy]
    if (typeof va === 'number' && typeof vb === 'number') return (va - vb) * order
    return String(va).localeCompare(String(vb)) * order
  })
  return data
})

// Pagination
const pagedData = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return sortedData.value.slice(start, start + pageSize.value)
})

function handleSort(prop: string) {
  if (sortBy.value === prop) {
    sortOrder.value = sortOrder.value === 'ascending' ? 'descending' : 'ascending'
  } else {
    sortBy.value = prop
    sortOrder.value = 'ascending'
  }
}

function resetFilters() {
  dateRange.value = null
  status.value = 'all'
  search.value = ''
}

function executionClass(value: number) {
  if (value >= 100) return 'excellent'
  if (value >= 80) return 'good'
  if (value >= 60) return 'warning'
  return 'poor'
}

const totalCount = computed(() => rows.value.length)
const doneCount = computed(() => rows.value.filter((r) => r.status === 'done').length)
const inProgressCount = computed(() => rows.value.filter((r) => r.status === 'in_progress').length)
const overdueCount = computed(() => rows.value.filter((r) => r.status === 'overdue').length)

// Reset to first page when filters or sort change
watch([filteredData, sortBy, sortOrder], () => {
  page.value = 1
})
</script>

<style scoped lang="scss">
.analytics-summary-page {
  .top-filter {
    margin-bottom: 16px;
    .filter-row {
      display: flex;
      gap: 12px;
      align-items: center;
      flex-wrap: wrap;
      margin-bottom: 14px;
      .filter-item {
        min-width: 160px;
      }
      .filter-search {
        min-width: 300px;
      }
    }

    .top-summary {
      display: flex;
      gap: 18px;
      margin-top: 6px;
      .summary-item {
        padding: 10px 16px;
        background: var(--el-card-bg-color, #fff);
        border-radius: 8px;
        box-shadow: 0 1px 0 rgba(0,0,0,0.02);
        .summary-label {
          font-size: 12px;
          color: #6b6f76;
        }
        .summary-value {
          font-size: 20px;
          font-weight: 600;
          margin-top: 4px;
        }
      }
      .color-success { color: #16a34a; }
      .color-warning { color: #d97706; }
      .color-danger { color: #dc2626; }
    }
  }

  .table-card {
    padding: 12px;
  }

  .analytics-table {
    width: 100%;

    .cell-execution {
      display: flex;
      align-items: center;
      gap: 8px;
      .execution-value {
        font-weight: 600;
      }
      .execution-delta {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-size: 12px;
        color: #374151;
        .delta-arrow {
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          &.up {
            border-bottom: 10px solid #10b981;
          }
          &.down {
            border-top: 10px solid #ef4444;
          }
        }
      }

      &.excellent { background: rgba(16,185,129,0.06); color: #065f46; padding: 6px 8px; border-radius: 6px; }
      &.good { background: rgba(34,197,94,0.04); color: #166534; padding: 6px 8px; border-radius: 6px; }
      &.warning { background: rgba(245,158,11,0.06); color: #92400e; padding: 6px 8px; border-radius: 6px; }
      &.poor { background: rgba(239,68,68,0.06); color: #7f1d1d; padding: 6px 8px; border-radius: 6px; }
    }
  }

  .table-footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 12px;
  }
}

@media (max-width: 900px) {
  .analytics-summary-page {
    .top-filter {
      .top-summary { flex-direction: column; gap: 8px; }
      .filter-row { .filter-item { min-width: 48%; } }
    }
  }
}
</style>
