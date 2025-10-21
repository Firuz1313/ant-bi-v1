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
            <div class="summary-value">{{ filteredTotalCount }}</div>
          </div>
          <div class="summary-item">
            <div class="summary-label">Выполнено</div>
            <div class="summary-value color-success">{{ filteredDoneCount }}</div>
          </div>
          <div class="summary-item">
            <div class="summary-label">В работе</div>
            <div class="summary-value color-warning">{{ filteredInProgressCount }}</div>
          </div>
          <div class="summary-item">
            <div class="summary-label">Просрочено</div>
            <div class="summary-value color-danger">{{ filteredOverdueCount }}</div>
          </div>
        </div>
      </div>
    </div>

    <transition name="fade">
      <div v-show="showFilter" class="top-filter">
        <div class="filter-row">
          <!-- Year + Months smart selector -->
          <el-select v-model="selectedYear" placeholder="Год" class="filter-item" clearable @change="onYearChange">
            <el-option v-for="y in yearOptions" :key="y" :label="String(y)" :value="y" />
          </el-select>

          <el-select
            v-model="selectedMonths"
            multiple
            collapse-tags
            placeholder="Месяцы"
            class="filter-item months-select"
            clearable
            :disabled="!selectedYear"
            @change="onMonthsChange"
          >
            <el-option v-for="m in monthOptions" :key="m.value" :label="m.label" :value="m.value" />
          </el-select>

          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="—"
            start-placeholder="Дата от"
            end-placeholder="Дата до"
            value-format="yyyy-MM-dd"
            class="filter-item compact-date"
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

    <el-card class="table-card art-table-card">
      <ArtTable :data="pagedData" :pagination="{ current: page, size: pageSize, total: filteredData.length }" showTableHeader :show-summary="true" :summary-method="getSummary">
        <template #default>
          <el-table-column prop="date" label="Дата" width="120" :sortable="true" @header-click="handleSort('date')" />
          <el-table-column prop="days_nd" label="Дни нд" width="90" :sortable="true" @header-click="handleSort('days_nd')" />

          <el-table-column prop="kc_plan" label="Кц План" width="90" :sortable="true" @header-click="handleSort('kc_plan')" />
          <el-table-column prop="kc_done" label="Кц Выполнено" width="120" :sortable="true" @header-click="handleSort('kc_done')">
            <template #default="{ row }">
              <div class="cell-combo">
                <div class="value">{{ row.kc_done }}</div>
                <div :class="['delta', deltaClass(row.kc_plan, row.kc_done)]">
                  <i :class="['arrow', arrowIcon(row.kc_plan, row.kc_done)]" :title="arrowTitle(row.kc_plan, row.kc_done)"></i>
                  <span class="pct">{{ percent(row.kc_plan, row.kc_done) }}%</span>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="co_plan" label="ЦО План" width="90" :sortable="true" @header-click="handleSort('co_plan')" />
          <el-table-column prop="co_fact" label="ЦО Факт" width="90" :sortable="true" @header-click="handleSort('co_fact')" />
          <el-table-column prop="co_done" label="ЦО Выполнено" width="120" :sortable="true" @header-click="handleSort('co_done')">
            <template #default="{ row }">
              <div class="cell-combo">
                <div class="value">{{ row.co_done }}</div>
                <div :class="['delta', deltaClass(row.co_plan, row.co_done)]">
                  <i :class="['arrow', arrowIcon(row.co_plan, row.co_done)]" :title="arrowTitle(row.co_plan, row.co_done)"></i>
                  <span class="pct">{{ percent(row.co_plan, row.co_done) }}%</span>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="stp_plan" label="СТП План" width="90" :sortable="true" @header-click="handleSort('stp_plan')" />
          <el-table-column prop="stp_fact" label="СТП Факт" width="90" :sortable="true" @header-click="handleSort('stp_fact')" />
          <el-table-column prop="stp_done" label="СТП Выполнено" width="120" :sortable="true" @header-click="handleSort('stp_done')">
            <template #default="{ row }">
              <div class="cell-combo">
                <div class="value">{{ row.stp_done }}</div>
                <div :class="['delta', deltaClass(row.stp_plan, row.stp_done)]">
                  <i :class="['arrow', arrowIcon(row.stp_plan, row.stp_done)]" :title="arrowTitle(row.stp_plan, row.stp_done)"></i>
                  <span class="pct">{{ percent(row.stp_plan, row.stp_done) }}%</span>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="f2f_plan" label="F2F План" width="90" :sortable="true" @header-click="handleSort('f2f_plan')" />
          <el-table-column prop="f2f_fact" label="F2F Факт" width="90" :sortable="true" @header-click="handleSort('f2f_fact')" />
          <el-table-column prop="f2f_done" label="F2F Выполнено" width="120" :sortable="true" @header-click="handleSort('f2f_done')">
            <template #default="{ row }">
              <div class="cell-combo">
                <div class="value">{{ row.f2f_done }}</div>
                <div :class="['delta', deltaClass(row.f2f_plan, row.f2f_done)]">
                  <i :class="['arrow', arrowIcon(row.f2f_plan, row.f2f_done)]" :title="arrowTitle(row.f2f_plan, row.f2f_done)"></i>
                  <span class="pct">{{ percent(row.f2f_plan, row.f2f_done) }}%</span>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="total_plan" label="ИТОГ План" width="110" :sortable="true" @header-click="handleSort('total_plan')" />
          <el-table-column prop="total_fact" label="ИТОГ Факт" width="110" :sortable="true" @header-click="handleSort('total_fact')" />
          <el-table-column prop="total_done" label="ИТОГ Выполнено" width="130" :sortable="true" @header-click="handleSort('total_done')">
            <template #default="{ row }">
              <div class="cell-combo">
                <div class="value">{{ row.total_done }}</div>
                <div :class="['delta', deltaClass(row.total_plan, row.total_done)]">
                  <i :class="['arrow', arrowIcon(row.total_plan, row.total_done)]" :title="arrowTitle(row.total_plan, row.total_done)"></i>
                  <span class="pct">{{ percent(row.total_plan, row.total_done) }}%</span>
                </div>
              </div>
            </template>
          </el-table-column>
        </template>
      </ArtTable>

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
import ArtTable from '@/components/core/tables/art-table/index.vue'

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

const rows = ref<Row[]>(generateMockRows())

// Smart year / months selector
const currentYear = new Date().getFullYear()
const yearOptions = Array.from({ length: 5 }).map((_, i) => currentYear - i) // current year and 4 previous
const selectedYear = ref<number | null>(currentYear)
const monthOptions = [
  { value: 1, label: 'Январь' },
  { value: 2, label: 'Февраль' },
  { value: 3, label: 'Март' },
  { value: 4, label: 'Апрель' },
  { value: 5, label: 'Май' },
  { value: 6, label: 'Июнь' },
  { value: 7, label: 'Июль' },
  { value: 8, label: 'Август' },
  { value: 9, label: 'Сентябрь' },
  { value: 10, label: 'Октябрь' },
  { value: 11, label: 'Ноябрь' },
  { value: 12, label: 'Декабрь' }
]
const selectedMonths = ref<number[]>([])

function onYearChange(year: number | null) {
  // reset months when year changes
  selectedMonths.value = []
  dateRange.value = null
}

function onMonthsChange(months: number[]) {
  // if months selected and year set, compute dateRange spanning from first day of earliest month
  if (!selectedYear.value || !months || months.length === 0) {
    dateRange.value = null
    return
  }
  const sorted = months.slice().sort((a, b) => a - b)
  const y = selectedYear.value
  const from = new Date(y, sorted[0] - 1, 1)
  const to = new Date(y, sorted[sorted.length - 1], 0) // day 0 of next month -> last day of month
  const fmt = (d: Date) => d.toISOString().slice(0, 10)
  dateRange.value = [fmt(from), fmt(to)]
}

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function generateMockRows(): Row[] {
  const base: Row[] = []
  // Create 24 done rows and 4 in_progress rows to match requested totals
  for (let i = 1; i <= 28; i++) {
    const kc_plan = randInt(10, 60)
    const co_plan = randInt(5, 40)
    const stp_plan = randInt(3, 30)
    const f2f_plan = randInt(0, 10)
    const total_plan = kc_plan + co_plan + stp_plan + f2f_plan

    let kc_done = kc_plan
    let co_fact = co_plan
    let co_done = co_plan
    let stp_fact = stp_plan
    let stp_done = stp_plan
    let f2f_fact = f2f_plan
    let f2f_done = f2f_plan

    // For last 4 rows make them in_progress
    const isInProgress = i > 24
    if (isInProgress) {
      // lower completions
      kc_done = Math.max(0, Math.round(kc_plan * 0.6))
      co_fact = Math.max(0, Math.round(co_plan * 0.7))
      co_done = Math.max(0, Math.round(co_fact * 0.7))
      stp_fact = Math.max(0, Math.round(stp_plan * 0.6))
      stp_done = Math.max(0, Math.round(stp_fact * 0.6))
      f2f_fact = Math.max(0, Math.round(f2f_plan * 0.5))
      f2f_done = Math.max(0, Math.round(f2f_fact * 0.5))
    }

    const total_fact = Math.max(0, kc_done + co_fact + stp_fact + f2f_fact)
    const total_done = Math.max(0, kc_done + co_done + stp_done + f2f_done)

    const date = new Date()
    date.setDate(date.getDate() - (28 - i))

    const execution = Math.round((total_done / Math.max(1, total_plan)) * 100)
    const statusVal: Row['status'] = i <= 24 ? 'done' : 'in_progress'

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
      status: statusVal
    })
  }
  return base
}

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

function applyFilters() { page.value = 1 }
function resetFilters() { dateRange.value = null; status.value = 'all'; search.value = '' }

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
  if (!plan) return 'right'
  const diff = done - plan
  if (diff > 0) return 'up'
  if (diff < 0) return 'down'
  return 'right'
}

function getSummary(columns: any[]) {
  const totals: any[] = []
  const data = filteredData.value
  const sum = (key: string) => data.reduce((acc, cur) => acc + (Number((cur as any)[key]) || 0), 0)
  totals.push('Всего')
  totals.push(sum('days_nd'))
  totals.push(sum('kc_plan'))
  totals.push(sum('kc_done'))
  totals.push(sum('co_plan'))
  totals.push(sum('co_fact'))
  totals.push(sum('co_done'))
  totals.push(sum('stp_plan'))
  totals.push(sum('stp_fact'))
  totals.push(sum('stp_done'))
  totals.push(sum('f2f_plan'))
  totals.push(sum('f2f_fact'))
  totals.push(sum('f2f_done'))
  totals.push(sum('total_plan'))
  totals.push(sum('total_fact'))
  totals.push(sum('total_done'))
  return totals
}

const filteredTotalCount = computed(() => filteredData.value.length)
const filteredDoneCount = computed(() => filteredData.value.filter((r) => r.status === 'done').length)
const filteredInProgressCount = computed(() => filteredData.value.filter((r) => r.status === 'in_progress').length)
const filteredOverdueCount = computed(() => filteredData.value.filter((r) => r.status === 'overdue').length)

watch([filteredData, sortBy, sortOrder], () => { page.value = 1 })
</script>

<style scoped lang="scss">
@import '@/components/core/tables/art-table/style.scss';

.analytics-summary-page {
  .top-controls { display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; }
  .filter-toggle { display:inline-flex; align-items:center; gap:6px }
  .top-filter { margin-bottom:16px; background:#fbfdff; padding:12px; border-radius:8px; box-shadow:0 6px 18px rgba(10,23,50,0.04); }
  .top-summary { display:flex; gap:12px; .summary-item{ padding:8px 14px; background:linear-gradient(180deg,#ffffff,#fbfbff); border-radius:8px; border:1px solid rgba(15,23,42,0.04); .summary-label{font-size:12px;color:#556} .summary-value{font-size:18px;font-weight:700}} .color-success{color:#059669} .color-warning{color:#d97706} .color-danger{color:#dc2626} }
  .table-card.art-table-card{ padding:8px }
  .cell-combo{ display:flex; align-items:center; justify-content:space-between; .value{ font-weight:700 } .delta{ display:inline-flex; align-items:center; gap:6px; padding:4px 8px; border-radius:6px; font-size:12px } .arrow.up::after{content:'▲'; color:#059669} .arrow.down::after{content:'▼'; color:#dc2626} .arrow.right::after{content:'▶'; color:#64748b} .delta.excellent{ background:rgba(16,185,129,0.06); color:#065f46 } .delta.good{ background:rgba(34,197,94,0.04); color:#166534 } .delta.warning{ background:rgba(245,158,11,0.06); color:#92400e } .delta.poor{ background:rgba(239,68,68,0.06); color:#7f1d1d } }
  .el-table__footer-wrapper{ background:linear-gradient(180deg,#f7fafc,#fff) }
  .table-footer{ display:flex; justify-content:flex-end; margin-top:12px }
}

.fade-enter-active, .fade-leave-active { transition: all 0.25s ease }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-6px) }
</style>
