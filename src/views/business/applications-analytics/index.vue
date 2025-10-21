<template>
  <div class="analytics-summary-page">
    <div class="top-controls">
      <div class="controls-left">
        <el-button type="primary" @click="showFilter = !showFilter" size="small" class="filter-toggle">
          <i class="el-icon-setting"></i>
          Фильтр
        </el-button>
      </div>
      <div class="controls-right">
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
    </div>

    <transition name="fade">
      <div v-show="showFilter" class="top-filter">
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

          <div class="filter-actions">
            <el-button type="primary" @click="applyFilters">Применить</el-button>
            <el-button @click="resetFilters">Сброс</el-button>
          </div>
        </div>
      </div>
    </transition>

    <el-card class="table-card">
      <el-table
        :data="pagedData"
        stripe
        size="small"
        class="analytics-table"
        :default-sort="{ prop: sortBy, order: sortOrder }"
        :show-summary="true"
        :summary-method="getSummary"
      >
        <el-table-column prop="date" label="Дата" width="120" :sortable="true" @header-click="handleSort('date')" />
        <el-table-column prop="days_nd" label="Дни нд" width="90" :sortable="true" @header-click="handleSort('days_nd')" />

        <el-table-column prop="kc_plan" label="Кц План" width="90" :sortable="true" @header-click="handleSort('kc_plan')" />
        <el-table-column prop="kc_done" label="Выполнено" width="120" :sortable="true" @header-click="handleSort('kc_done')">
          <template #default="{ row }">
            <div class="cell-combo">
              <div class="value">{{ row.kc_done }}</div>
              <div :class="['delta', deltaClass(row.kc_plan, row.kc_done)]">
                <i :class="['arrow', arrowIcon(row.kc_plan, row.kc_done)]"></i>
                <span class="pct">{{ percent(row.kc_plan, row.kc_done) }}%</span>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="co_plan" label="ЦО План" width="90" :sortable="true" @header-click="handleSort('co_plan')" />
        <el-table-column prop="co_fact" label="ЦО Факт" width="90" :sortable="true" @header-click="handleSort('co_fact')" />
        <el-table-column prop="co_done" label="Выполнено" width="120" :sortable="true" @header-click="handleSort('co_done')">
          <template #default="{ row }">
            <div class="cell-combo">
              <div class="value">{{ row.co_done }}</div>
              <div :class="['delta', deltaClass(row.co_plan, row.co_done)]">
                <i :class="['arrow', arrowIcon(row.co_plan, row.co_done)]"></i>
                <span class="pct">{{ percent(row.co_plan, row.co_done) }}%</span>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="stp_plan" label="СТП План" width="90" :sortable="true" @header-click="handleSort('stp_plan')" />
        <el-table-column prop="stp_fact" label="СТП Факт" width="90" :sortable="true" @header-click="handleSort('stp_fact')" />
        <el-table-column prop="stp_done" label="Выполнено" width="120" :sortable="true" @header-click="handleSort('stp_done')">
          <template #default="{ row }">
            <div class="cell-combo">
              <div class="value">{{ row.stp_done }}</div>
              <div :class="['delta', deltaClass(row.stp_plan, row.stp_done)]">
                <i :class="['arrow', arrowIcon(row.stp_plan, row.stp_done)]"></i>
                <span class="pct">{{ percent(row.stp_plan, row.stp_done) }}%</span>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="f2f_plan" label="F2F План" width="90" :sortable="true" @header-click="handleSort('f2f_plan')" />
        <el-table-column prop="f2f_fact" label="F2F Факт" width="90" :sortable="true" @header-click="handleSort('f2f_fact')" />
        <el-table-column prop="f2f_done" label="Выполнено" width="120" :sortable="true" @header-click="handleSort('f2f_done')">
          <template #default="{ row }">
            <div class="cell-combo">
              <div class="value">{{ row.f2f_done }}</div>
              <div :class="['delta', deltaClass(row.f2f_plan, row.f2f_done)]">
                <i :class="['arrow', arrowIcon(row.f2f_plan, row.f2f_done)]"></i>
                <span class="pct">{{ percent(row.f2f_plan, row.f2f_done) }}%</span>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="total_plan" label="ИТОГ План" width="110" :sortable="true" @header-click="handleSort('total_plan')" />
        <el-table-column prop="total_fact" label="ИТОГ Факт" width="110" :sortable="true" @header-click="handleSort('total_fact')" />
        <el-table-column prop="total_done" label="Выполнено" width="130" :sortable="true" @header-click="handleSort('total_done')">
          <template #default="{ row }">
            <div class="cell-combo">
              <div class="value">{{ row.total_done }}</div>
              <div :class="['delta', deltaClass(row.total_plan, row.total_done)]">
                <i :class="['arrow', arrowIcon(row.total_plan, row.total_done)]"></i>
                <span class="pct">{{ percent(row.total_plan, row.total_done) }}%</span>
              </div>
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

const showFilter = ref(false)
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

function applyFilters() {
  // currently filtering reactive variables are enough; this function kept for expansion
  page.value = 1
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

function deltaClass(plan: number, done: number) {
  const p = percent(plan, done)
  if (p >= 100) return 'excellent'
  if (p >= 80) return 'good'
  if (p >= 60) return 'warning'
  return 'poor'
}

function arrowIcon(plan: number, done: number) {
  // returns classes: 'up','down','right'
  if (!plan) return 'right'
  const diff = done - plan
  if (diff > 0) return 'up'
  if (diff < 0) return 'down'
  return 'right'
}

function getSummary(columns: any[]) {
  // columns are provided in order; build totals corresponding to visible columns
  const totals: any[] = []
  // We'll map by order of table columns in template
  const data = filteredData.value
  const sum = (key: string) => data.reduce((acc, cur) => acc + (Number((cur as any)[key]) || 0), 0)

  // Date column -> label
  totals.push('Всего')
  // days_nd
  totals.push(sum('days_nd'))
  // kc_plan
  totals.push(sum('kc_plan'))
  // kc_done
  totals.push(sum('kc_done'))
  // co_plan
  totals.push(sum('co_plan'))
  // co_fact
  totals.push(sum('co_fact'))
  // co_done
  totals.push(sum('co_done'))
  // stp_plan
  totals.push(sum('stp_plan'))
  // stp_fact
  totals.push(sum('stp_fact'))
  // stp_done
  totals.push(sum('stp_done'))
  // f2f_plan
  totals.push(sum('f2f_plan'))
  // f2f_fact
  totals.push(sum('f2f_fact'))
  // f2f_done
  totals.push(sum('f2f_done'))
  // total_plan
  totals.push(sum('total_plan'))
  // total_fact
  totals.push(sum('total_fact'))
  // total_done
  totals.push(sum('total_done'))

  return totals
}

function arrowCharacter(type: string) {
  if (type === 'up') return '▲'
  if (type === 'down') return '▼'
  return '▶'
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
  .top-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    .controls-left { display: flex; gap: 8px; }
    .controls-right { display: flex; align-items: center; }
  }

  .filter-toggle { display: inline-flex; align-items: center; gap: 6px; }

  .top-filter {
    margin-bottom: 16px;
    background: #fbfdff;
    padding: 12px;
    border-radius: 8px;
    box-shadow: 0 6px 18px rgba(10,23,50,0.04);
    .filter-row {
      display: flex;
      gap: 12px;
      align-items: center;
      flex-wrap: wrap;
      .filter-item { min-width: 160px; }
      .filter-search { min-width: 300px; }
      .filter-actions { display: flex; gap: 8px; align-items: center; }
    }
  }

  .top-summary {
    display: flex;
    gap: 12px;
    .summary-item {
      padding: 8px 14px;
      background: linear-gradient(180deg, #ffffff, #fbfbff);
      border-radius: 8px;
      border: 1px solid rgba(15,23,42,0.04);
      .summary-label { font-size: 12px; color: #556; }
      .summary-value { font-size: 18px; font-weight: 700; }
    }
    .color-success { color: #059669; }
    .color-warning { color: #d97706; }
    .color-danger { color: #dc2626; }
  }

  .table-card { padding: 8px; }

  .analytics-table {
    width: 100%;
    border-radius: 8px;
    overflow: hidden;

    .cell-combo {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .value { font-weight: 700; }
      .delta {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 4px 8px;
        border-radius: 6px;
        font-size: 12px;
      }
      .arrow { width: 0; height: 0; }
      .arrow.up::after { content: '▲'; color: #059669; }
      .arrow.down::after { content: '▼'; color: #dc2626; }
      .arrow.right::after { content: '▶'; color: #64748b; }
      .delta.excellent { background: rgba(16,185,129,0.06); color: #065f46; }
      .delta.good { background: rgba(34,197,94,0.04); color: #166534; }
      .delta.warning { background: rgba(245,158,11,0.06); color: #92400e; }
      .delta.poor { background: rgba(239,68,68,0.06); color: #7f1d1d; }
    }

    /* summary row styles */
    .el-table__footer-wrapper { background: linear-gradient(180deg,#f7fafc,#fff); }
    .el-table__summary { font-weight: 700; }
  }

  .table-footer { display: flex; justify-content: flex-end; margin-top: 12px; }
}

.fade-enter-active, .fade-leave-active { transition: all 0.25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-6px); }
</style>
