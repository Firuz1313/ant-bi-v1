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
        <!-- Required columns as provided -->
        <el-table-column prop="date" label="Дата" width="120" :sortable="true" @header-click="handleSort('date')" />
        <el-table-column prop="days_nd" label="Дни нд" width="100" :sortable="true" @header-click="handleSort('days_nd')" />

        <el-table-column prop="kc_plan" label="Кц План" width="100" :sortable="true" @header-click="handleSort('kc_plan')" />
        <el-table-column prop="kc_done" label="Выполнено" width="120" :sortable="true" @header-click="handleSort('kc_done')">
          <template #default="{ row }">
            <div :class="['cell-execution', executionClass(percent(row.kc_plan, row.kc_done))]">
              <span class="execution-value">{{ row.kc_done }}</span>
              <span class="execution-delta">{{ percent(row.kc_plan, row.kc_done) }}%</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="co_plan" label="ЦО План" width="100" :sortable="true" @header-click="handleSort('co_plan')" />
        <el-table-column prop="co_fact" label="ЦО Факт" width="100" :sortable="true" @header-click="handleSort('co_fact')" />
        <el-table-column prop="co_done" label="Выполнено" width="120" :sortable="true" @header-click="handleSort('co_done')">
          <template #default="{ row }">
            <div :class="['cell-execution', executionClass(percent(row.co_plan, row.co_done))]">
              <span class="execution-value">{{ row.co_done }}</span>
              <span class="execution-delta">{{ percent(row.co_plan, row.co_done) }}%</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="stp_plan" label="СТП План" width="100" :sortable="true" @header-click="handleSort('stp_plan')" />
        <el-table-column prop="stp_fact" label="СТП Факт" width="100" :sortable="true" @header-click="handleSort('stp_fact')" />
        <el-table-column prop="stp_done" label="Выполнено" width="120" :sortable="true" @header-click="handleSort('stp_done')">
          <template #default="{ row }">
            <div :class="['cell-execution', executionClass(percent(row.stp_plan, row.stp_done))]">
              <span class="execution-value">{{ row.stp_done }}</span>
              <span class="execution-delta">{{ percent(row.stp_plan, row.stp_done) }}%</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="f2f_plan" label="F2F План" width="100" :sortable="true" @header-click="handleSort('f2f_plan')" />
        <el-table-column prop="f2f_fact" label="F2F Факт" width="100" :sortable="true" @header-click="handleSort('f2f_fact')" />
        <el-table-column prop="f2f_done" label="Выполнено" width="120" :sortable="true" @header-click="handleSort('f2f_done')">
          <template #default="{ row }">
            <div :class="['cell-execution', executionClass(percent(row.f2f_plan, row.f2f_done))]">
              <span class="execution-value">{{ row.f2f_done }}</span>
              <span class="execution-delta">{{ percent(row.f2f_plan, row.f2f_done) }}%</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="total_plan" label="ИТОГ План" width="110" :sortable="true" @header-click="handleSort('total_plan')" />
        <el-table-column prop="total_fact" label="ИТОГ Факт" width="110" :sortable="true" @header-click="handleSort('total_fact')" />
        <el-table-column prop="total_done" label="Выполнено" width="130" :sortable="true" @header-click="handleSort('total_done')">
          <template #default="{ row }">
            <div :class="['cell-execution', executionClass(percent(row.total_plan, row.total_done))]">
              <span class="execution-value">{{ row.total_done }}</span>
              <span class="execution-delta">{{ percent(row.total_plan, row.total_done) }}%</span>
            </div>
          </template>
        </el-table-column>

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

interface Row {
  id: number
  date: string
  days_nd: number
  kc_plan: number
  kc_done: number
  co_plan: number
  co_fact: number
  co_done: number
  stp_plan: number
  stp_fact: number
  stp_done: number
  f2f_plan: number
  f2f_fact: number
  f2f_done: number
  total_plan: number
  total_fact: number
  total_done: number
  status: 'done' | 'in_progress' | 'overdue' | 'other'
}

const dateRange = ref<[string, string] | null>(null)
const status = ref<string>('all')
const search = ref<string>('')

const sortBy = ref<string>('date')
const sortOrder = ref<'ascending' | 'descending'>('descending')

const page = ref(1)
const pageSize = ref(10)

// Mock data set
const rows = ref<Row[]>(generateMockRows())

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function generateMockRows(): Row[] {
  const base: Row[] = []
  for (let i = 1; i <= 28; i++) {
    const kc_plan = randInt(10, 60)
    const kc_done = Math.max(0, kc_plan + randInt(-10, 20))
    const co_plan = randInt(5, 40)
    const co_fact = Math.max(0, co_plan + randInt(-8, 18))
    const co_done = Math.max(0, Math.round((co_fact + randInt(-3, 5))))
    const stp_plan = randInt(3, 30)
    const stp_fact = Math.max(0, stp_plan + randInt(-6, 12))
    const stp_done = Math.max(0, stp_fact + randInt(-2, 4))
    const f2f_plan = randInt(0, 10)
    const f2f_fact = Math.max(0, f2f_plan + randInt(-3, 6))
    const f2f_done = Math.max(0, f2f_fact + randInt(-1, 3))

    const total_plan = kc_plan + co_plan + stp_plan + f2f_plan
    const total_fact = Math.max(0, kc_done + co_fact + stp_fact + f2f_fact)
    const total_done = Math.max(0, kc_done + co_done + stp_done + f2f_done)

    const date = new Date()
    date.setDate(date.getDate() - (28 - i))

    const execution = Math.round((total_done / Math.max(1, total_plan)) * 100)
    const status: Row['status'] = execution >= 100 ? 'done' : execution >= 60 ? 'in_progress' : 'overdue'

    base.push({
      id: i,
      date: date.toISOString().slice(0, 10),
      days_nd: randInt(0, 3),
      kc_plan,
      kc_done,
      co_plan,
      co_fact,
      co_done,
      stp_plan,
      stp_fact,
      stp_done,
      f2f_plan,
      f2f_fact,
      f2f_done,
      total_plan,
      total_fact,
      total_done,
      status
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
        String(r.days_nd).includes(q) ||
        String(r.kc_plan).includes(q) ||
        String(r.kc_done).includes(q) ||
        String(r.co_plan).includes(q) ||
        String(r.co_fact).includes(q) ||
        String(r.co_done).includes(q) ||
        String(r.total_done).includes(q)
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

function percent(plan: number, done: number) {
  if (!plan || plan === 0) return 0
  return Math.round((done / plan) * 100)
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
