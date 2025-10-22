<template>
  <div class="analytics-summary-page">
    <div class="page-title-section">
      <h1 class="page-title">ПЛАН/ФАКТ ПО ПРИЁМУ ЗАЯВОК НА ПОДКЛЮЧЕНИЕ</h1>
    </div>

    <div class="kpi-section">
      <div class="kpi-block kpi-blue">
        <div class="kpi-value">{{ filteredTotalCount }}</div>
        <div class="kpi-label">Всего заявок</div>
      </div>
      <div class="kpi-block kpi-green">
        <div class="kpi-value">{{ filteredDoneCount }}</div>
        <div class="kpi-label">Выполнено</div>
      </div>
      <div class="kpi-block kpi-orange">
        <div class="kpi-value">{{ filteredInProgressCount }}</div>
        <div class="kpi-label">В работе</div>
      </div>
      <div class="kpi-block kpi-red">
        <div class="kpi-value">{{ filteredOverdueCount }}</div>
        <div class="kpi-label">Просрочено</div>
      </div>
    </div>

    <transition name="fade">
      <div v-show="showFilter" class="top-filter">
        <div class="filter-row">
          <!-- Year + Months smart selector -->
          <el-select
            v-model="selectedYear"
            placeholder="Год"
            class="filter-item"
            clearable
            @change="onYearChange"
          >
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
            <el-option label="�� работе" value="in_progress" />
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
      <div class="card-actions">
        <el-button
          type="primary"
          @click="showFilter = !showFilter"
          size="small"
          class="filter-toggle"
        >
          <i class="el-icon-setting"></i>
          Фильтр
        </el-button>
      </div>
      <div class="table-header">
        <h3 class="table-title">План/Факт по приёму заявок</h3>
      </div>
      <div class="table-container">
        <el-table
          :data="sortedData"
          stripe
          border
          class="summary-table"
          style="width: 100%"
        >
          <el-table-column
            prop="date"
            label="Дата"
            width="100"
            align="center"
            :sortable="false"
          />
          <el-table-column
            prop="days_nd"
            label="Дни нд"
            width="85"
            align="center"
            :sortable="false"
          />

          <el-table-column
            prop="kc_plan"
            label="Кц План"
            width="85"
            align="center"
            :sortable="false"
          />
          <el-table-column
            prop="kc_done"
            label="Кц Выполнено"
            width="110"
            align="center"
            :sortable="false"
          >
            <template #default="{ row }">
              <div class="cell-combo">
                <div class="value">{{ row.kc_done }}</div>
                <div :class="['delta', deltaClass(row.kc_plan, row.kc_done)]">
                  <i
                    :class="['arrow', arrowIcon(row.kc_plan, row.kc_done)]"
                    :title="arrowTitle(row.kc_plan, row.kc_done)"
                  ></i>
                  <span class="pct">{{ percent(row.kc_plan, row.kc_done) }}%</span>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            prop="co_plan"
            label="ЦО План"
            width="85"
            align="center"
            :sortable="false"
          />
          <el-table-column
            prop="co_fact"
            label="ЦО Факт"
            width="85"
            align="center"
            :sortable="false"
          />
          <el-table-column
            prop="co_done"
            label="ЦО Выполнено"
            width="110"
            align="center"
            :sortable="false"
          >
            <template #default="{ row }">
              <div class="cell-combo">
                <div class="value">{{ row.co_done }}</div>
                <div :class="['delta', deltaClass(row.co_plan, row.co_done)]">
                  <i
                    :class="['arrow', arrowIcon(row.co_plan, row.co_done)]"
                    :title="arrowTitle(row.co_plan, row.co_done)"
                  ></i>
                  <span class="pct">{{ percent(row.co_plan, row.co_done) }}%</span>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            prop="stp_plan"
            label="СТП План"
            width="85"
            align="center"
            :sortable="false"
          />
          <el-table-column
            prop="stp_fact"
            label="СТП Факт"
            width="85"
            align="center"
            :sortable="false"
          />
          <el-table-column
            prop="stp_done"
            label="СТП Выполнено"
            width="110"
            align="center"
            :sortable="false"
          >
            <template #default="{ row }">
              <div class="cell-combo">
                <div class="value">{{ row.stp_done }}</div>
                <div :class="['delta', deltaClass(row.stp_plan, row.stp_done)]">
                  <i
                    :class="['arrow', arrowIcon(row.stp_plan, row.stp_done)]"
                    :title="arrowTitle(row.stp_plan, row.stp_done)"
                  ></i>
                  <span class="pct">{{ percent(row.stp_plan, row.stp_done) }}%</span>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            prop="f2f_plan"
            label="F2F План"
            width="85"
            align="center"
            :sortable="false"
          />
          <el-table-column
            prop="f2f_fact"
            label="F2F Факт"
            width="85"
            align="center"
            :sortable="false"
          />
          <el-table-column
            prop="f2f_done"
            label="F2F Выполнено"
            width="110"
            align="center"
            :sortable="false"
          >
            <template #default="{ row }">
              <div class="cell-combo">
                <div class="value">{{ row.f2f_done }}</div>
                <div :class="['delta', deltaClass(row.f2f_plan, row.f2f_done)]">
                  <i
                    :class="['arrow', arrowIcon(row.f2f_plan, row.f2f_done)]"
                    :title="arrowTitle(row.f2f_plan, row.f2f_done)"
                  ></i>
                  <span class="pct">{{ percent(row.f2f_plan, row.f2f_done) }}%</span>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            prop="total_plan"
            label="ИТОГ План"
            width="100"
            align="center"
            :sortable="false"
          />
          <el-table-column
            prop="total_fact"
            label="ИТОГ Факт"
            width="100"
            align="center"
            :sortable="false"
          />
          <el-table-column
            prop="total_done"
            label="ИТОГ Выполнено"
            width="120"
            align="center"
            :sortable="false"
          >
            <template #default="{ row }">
              <div class="cell-combo">
                <div class="value">{{ row.total_done }}</div>
                <div :class="['delta', deltaClass(row.total_plan, row.total_done)]">
                  <i
                    :class="['arrow', arrowIcon(row.total_plan, row.total_done)]"
                    :title="arrowTitle(row.total_plan, row.total_done)"
                  ></i>
                  <span class="pct">{{ percent(row.total_plan, row.total_done) }}%</span>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="table-summary">
        <div class="summary-item">
          <span class="summary-label">Итого:</span>
          <span class="summary-value">{{ summaryData[0] }}</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">Дни нд:</span>
          <span class="summary-value">{{ summaryData[1] }}</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">Кц План:</span>
          <span class="summary-value">{{ summaryData[2] }}</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">Кц Выполнено:</span>
          <span class="summary-value">{{ summaryData[3] }}</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">ЦО План:</span>
          <span class="summary-value">{{ summaryData[4] }}</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">ЦО Факт:</span>
          <span class="summary-value">{{ summaryData[5] }}</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">ЦО Выполнено:</span>
          <span class="summary-value">{{ summaryData[6] }}</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">СТП План:</span>
          <span class="summary-value">{{ summaryData[7] }}</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">СТП Факт:</span>
          <span class="summary-value">{{ summaryData[8] }}</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">СТП Выполнено:</span>
          <span class="summary-value">{{ summaryData[9] }}</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">F2F План:</span>
          <span class="summary-value">{{ summaryData[10] }}</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">F2F Факт:</span>
          <span class="summary-value">{{ summaryData[11] }}</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">F2F Выполнено:</span>
          <span class="summary-value">{{ summaryData[12] }}</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">ИТОГ План:</span>
          <span class="summary-value">{{ summaryData[13] }}</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">ИТОГ Факт:</span>
          <span class="summary-value">{{ summaryData[14] }}</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">ИТОГ Выполнено:</span>
          <span class="summary-value">{{ summaryData[15] }}</span>
        </div>
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

  function applyFilters() {
    page.value = 1
  }
  function resetFilters() {
    dateRange.value = null
    status.value = 'all'
    search.value = ''
    selectedYear.value = null
    selectedMonths.value = []
  }

  function percent(plan: number, done: number) {
    if (!plan || plan === 0) return 0
    return Math.round((done / plan) * 100)
  }

  function deltaClass(plan: number, done: number) {
    const p = percent(plan, done)
    // Color thresholds: red <50, yellow 50-79, green >=80
    if (p >= 80) return 'good'
    if (p >= 50) return 'warning'
    return 'poor'
  }

  function arrowIcon(plan: number, done: number) {
    // Arrow based on percent thresholds: <50 down, 50-79 right, >=80 up
    const p = percent(plan, done)
    if (!plan) return 'right'
    if (p >= 80) return 'up'
    if (p >= 50) return 'right'
    return 'down'
  }

  function arrowTitle(plan: number, done: number) {
    if (!plan) return 'План отсутствует'
    const p = percent(plan, done)
    if (p >= 80) return `Показатель отличный (${p}%)`
    if (p >= 50) return `Показатель в норме (${p}%)`
    return `Низкий показатель (${p}%)`
  }

  const summaryData = computed(() => {
    const data = filteredData.value
    const sum = (key: string) =>
      data.reduce((acc, cur) => acc + (Number((cur as any)[key]) || 0), 0)
    return [
      'Итого',
      sum('days_nd'),
      sum('kc_plan'),
      sum('kc_done'),
      sum('co_plan'),
      sum('co_fact'),
      sum('co_done'),
      sum('stp_plan'),
      sum('stp_fact'),
      sum('stp_done'),
      sum('f2f_plan'),
      sum('f2f_fact'),
      sum('f2f_done'),
      sum('total_plan'),
      sum('total_fact'),
      sum('total_done')
    ]
  })

  const filteredTotalCount = computed(() => filteredData.value.length)
  const filteredDoneCount = computed(
    () => filteredData.value.filter((r) => r.status === 'done').length
  )
  const filteredInProgressCount = computed(
    () => filteredData.value.filter((r) => r.status === 'in_progress').length
  )
  const filteredOverdueCount = computed(
    () => filteredData.value.filter((r) => r.status === 'overdue').length
  )

  watch([filteredData, sortBy, sortOrder], () => {
    page.value = 1
  })

  // Keep selectedYear/months in sync: when selectedMonths changed programmatically, update range
  watch(selectedMonths, (v) => {
    onMonthsChange(v)
  })

  // When user edits dateRange manually, update year/month selectors when possible
  watch(dateRange, (rng) => {
    if (!rng || rng.length !== 2) {
      selectedYear.value = null
      return
    }
    const [from, to] = rng
    try {
      const dFrom = new Date(from)
      const dTo = new Date(to)
      if (dFrom.getFullYear() === dTo.getFullYear()) {
        selectedYear.value = dFrom.getFullYear()
        const months: number[] = []
        for (let m = dFrom.getMonth(); m <= dTo.getMonth(); m++) months.push(m + 1)
        selectedMonths.value = months
      } else {
        // different years - clear month selection
        selectedMonths.value = []
        selectedYear.value = null
      }
    } catch (e) {
      selectedYear.value = null
      selectedMonths.value = []
    }
  })
</script>

<style scoped lang="scss">

  .analytics-summary-page {
    font-family: 'Segoe UI', Tahoma, Arial, sans-serif;
    color: var(--text-color, #0f172a);

    .page-title-section {
      margin-bottom: 24px;
    }

    .page-title {
      font-size: 28px;
      font-weight: 700;
      color: #1e40af;
      margin: 0;
      padding: 0;
      text-align: center;
    }

    .kpi-section {
      display: flex;
      gap: 16px;
      margin-bottom: 24px;
      justify-content: center;
      align-items: center;
    }

    .kpi-block {
      padding: 16px 20px;
      border-radius: 8px;
      text-align: center;
      min-width: 140px;
      flex: 1;
      max-width: 280px;
    }

    .kpi-value {
      font-size: 32px;
      font-weight: 700;
      line-height: 1;
      margin-bottom: 8px;
    }

    .kpi-label {
      font-size: 14px;
      font-weight: 600;
    }

    .kpi-blue {
      background: linear-gradient(135deg, #dbeafe, #f0f9ff);
      color: #1e40af;
    }

    .kpi-red {
      background: linear-gradient(135deg, #fee2e2, #fef2f2);
      color: #991b1b;
    }

    .kpi-green {
      background: linear-gradient(135deg, #dcfce7, #f0fdf4);
      color: #15803d;
    }

    .kpi-orange {
      background: linear-gradient(135deg, #fed7aa, #fffbeb);
      color: #b45309;
    }

    .filter-toggle {
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .top-filter {
      margin-bottom: 16px;
      background: #f9fafb;
      padding: 14px;
      border-radius: 8px;
      border: 1px solid #e5e7eb;

      .filter-row {
        display: flex;
        gap: 12px;
        align-items: center;
        flex-wrap: wrap;

        .filter-item {
          min-width: 140px;
        }

        .months-select {
          min-width: 220px;
        }

        .compact-date {
          min-width: 220px;
        }

        .filter-search {
          min-width: 280px;
        }

        .filter-actions {
          display: flex;
          gap: 8px;
          align-items: center;
        }
      }
    }

    .table-card {
      padding: 0;
      position: relative;
      display: flex;
      flex-direction: column;
    }

    .card-actions {
      position: absolute;
      top: 12px;
      right: 12px;
      z-index: 10;
    }

    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      border-bottom: 1px solid #e5e7eb;
      background: white;
    }

    .table-title {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: #1f2937;
    }

    .table-container {
      flex: 1;
      overflow: auto;
      min-height: 400px;
    }

    .summary-table {
      :deep(.el-table__header th) {
        background: #1e40af;
        color: white;
        font-weight: 700;
        font-size: 12px;
        padding: 12px 0;
      }

      :deep(.el-table__body td) {
        padding: 12px 0;
        font-size: 12px;
      }

      :deep(.el-table__row:hover > td) {
        background-color: #f3f4f6;
      }
    }

    .table-summary {
      display: flex;
      gap: 24px;
      padding: 12px 16px;
      background: #dbeafe;
      border-top: 1px solid #e5e7eb;
      font-weight: 600;
      color: #1e40af;
      font-size: 12px;
      flex-wrap: wrap;
    }

    .summary-item {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .summary-label {
      color: #1e40af;
    }

    .summary-value {
      font-weight: 700;
      color: #1e40af;
    }

    .cell-combo {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;

      .value {
        font-weight: 700;
      }

      .delta {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 4px 8px;
        border-radius: 6px;
        font-size: 11px;
      }

      .arrow.up::after {
        content: '▲';
        color: #16a34a;
        font-weight: 700;
        margin-right: 2px;
      }

      .arrow.down::after {
        content: '▼';
        color: #dc2626;
        font-weight: 700;
        margin-right: 2px;
      }

      .arrow.right::after {
        content: '▶';
        color: #f59e0b;
        font-weight: 700;
        margin-right: 2px;
      }

      .delta.good {
        background: rgba(22, 163, 74, 0.12);
        color: #15803d;
      }

      .delta.warning {
        background: rgba(249, 115, 22, 0.12);
        color: #92400e;
      }

      .delta.poor {
        background: rgba(220, 38, 38, 0.12);
        color: #991b1b;
      }
    }

    .summary-table {
      width: 100%;
    }

    .summary-table th,
    .summary-table td {
      text-align: center;
      font-family: 'Segoe UI', Tahoma, Arial, sans-serif;
    }

    .summary-table th {
      background: #1e40af;
      color: #fff;
      font-size: 12px;
      font-weight: 700;
    }

    .summary-table td {
      font-size: 12px;
    }

    .summary-table th .cell,
    .summary-table td .cell {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: all 0.25s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
    transform: translateY(-6px);
  }

  :root {
    --table-bg: #ffffff;
    --text-color: #0f172a;
    --muted: #64748b;
    --summary-bg: #f9fafb;
    --summary-quiet: #dbeafe;
    --border-weak: rgba(0, 0, 0, 0.06);
  }

  body.dark,
  .theme-dark,
  [data-theme='dark'] {
    --table-bg: #071022;
    --text-color: #e6eef8;
    --muted: #9aa8c2;
    --summary-bg: #1a202c;
    --summary-quiet: #1e3a5f;
    --border-weak: rgba(255, 255, 255, 0.06);
  }

  .analytics-summary-page {
    color: var(--text-color);
  }

  .analytics-summary-page .top-filter {
    background: var(--summary-bg);
    border-color: var(--border-weak);
  }

  :deep(.el-table__footer-wrapper .el-table__row) {
    background: var(--summary-quiet);
  }

  @media (max-width: 768px) {
    .analytics-summary-page {
      .page-title {
        font-size: 22px;
      }

      .kpi-section {
        flex-direction: row;
        gap: 12px;
      }

      .kpi-block {
        padding: 12px 16px;
        min-width: 0;
        flex: 1;
        max-width: none;
      }

      .kpi-value {
        font-size: 24px;
      }

      .kpi-label {
        font-size: 12px;
      }

      .top-filter .filter-row {
        flex-direction: column;
        align-items: stretch;
      }

      .card-actions {
        position: relative;
        top: auto;
        right: auto;
        margin: 8px 0 0 0;
      }

      .el-table th {
        font-size: 12px;
      }

      .el-table td {
        font-size: 11px;
      }

      :deep(.el-table__header-wrapper th:nth-child(n + 8)),
      :deep(.el-table__body-wrapper td:nth-child(n + 8)) {
        display: none;
      }

      .el-table {
        width: 100%;
        overflow-x: auto;
      }
    }
  }

  @media (min-width: 769px) {
    :deep(.el-table__header-wrapper th),
    :deep(.el-table__body-wrapper td) {
      border-right: 1px solid var(--border-weak);
    }

    :deep(.el-table__header-wrapper th:last-child),
    :deep(.el-table__body-wrapper td:last-child) {
      border-right: none;
    }
  }

  .el-table .cell {
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
