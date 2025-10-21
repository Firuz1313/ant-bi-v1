<template>
  <div class="center-analytics-page">
    <div class="page-header">
      <div class="title-block">
        <h2>ПЛАН/ФАКТ ПО ПРИЁМУ ЗАЯВОК — ЦЕНТР ОБСЛУЖИВАНИЕ</h2>
        <div class="kpis">
          <div class="kpi kpi-blue">
            <div class="kpi-value">{{ totals.total }}</div>
            <div class="kpi-label">Заявки</div>
          </div>
          <div class="kpi kpi-red">
            <div class="kpi-value">{{ totals.cancelled }}</div>
            <div class="kpi-label">Отменено</div>
          </div>
          <div class="kpi kpi-green">
            <div class="kpi-value">{{ totals.done }}</div>
            <div class="kpi-label">Выполнено</div>
          </div>
          <div class="kpi kpi-orange">
            <div class="kpi-value">{{ totals.in_progress }}</div>
            <div class="kpi-label">В процессе</div>
          </div>
        </div>
      </div>

      <div class="controls">
        <div class="period-inline">
          <div class="period-label">Период:</div>
          <div class="period-dates">{{ periodStart }} — {{ periodEnd }}</div>
        </div>

        <div class="period-slider">
          <el-select v-model="selectedMonth" placeholder="Август 2025" class="month-select" size="small">
            <el-option :label="'Август 2025'" :value="8" />
          </el-select>

          <el-slider v-model="daysRange" range :min="1" :max="31" show-tooltip class="days-slider" />
          <div class="slider-labels">{{ sliderLabel }}</div>
        </div>
      </div>
    </div>

    <div class="content">
      <div class="left">
        <el-card class="table-card art-table-card">
          <div class="card-actions">
            <el-button type="primary" size="small" @click="toggleFilter">Фильтр</el-button>
          </div>
          <el-table :data="filteredRows" stripe border class="center-table" style="width:100%">
            <el-table-column prop="fio" label="ФИО" width="220" align="center" />
            <el-table-column prop="dept" label="Под��азделение" width="180" align="center" />
            <el-table-column prop="total" label="Заявки" width="90" align="center" />
            <el-table-column prop="cancelled" label="Отменено" width="90" align="center">
              <template #default="{ row }">
                <div class="cell-combo">
                  <div class="value">{{ row.cancelled }}</div>
                  <div class="delta poor">
                    <i class="arrow down"></i>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="in_progress" label="В процессе" width="100" align="center">
              <template #default="{ row }">
                <div class="value">{{ row.in_progress }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="done" label="Выполнено" width="100" align="center">
              <template #default="{ row }">
                <div class="cell-combo">
                  <div class="value">{{ row.done }}</div>
                  <div :class="['delta', deltaClassFromRow(row)]">
                    <i :class="['arrow', arrowClassFromRow(row)]"></i>
                    <span class="pct">{{ percentRow(row) }}%</span>
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table>

          <!-- Итого row is handled by a footer area for style continuity -->
          <div class="summary-footer">
            <div class="summary-label">Итого</div>
            <div class="summary-values">
              <div>{{ totals.total }}</div>
              <div>{{ totals.cancelled }}</div>
              <div>{{ totals.in_progress }}</div>
              <div>{{ totals.done }}</div>
            </div>
          </div>
        </el-card>
      </div>

      <div class="right">
        <el-card class="chart-card">
          <div class="chart-legend">
            <div class="legend-item"><span class="dot done"></span> Выполнено {{ totals.done }} ({{ percentTotalDone }}%)</div>
            <div class="legend-item"><span class="dot cancelled"></span> Отменено {{ totals.cancelled }} ({{ percentTotalCancelled }}%)</div>
            <div class="legend-item"><span class="dot inprog"></span> В процессе {{ totals.in_progress }} ({{ percentTotalInProgress }}%)</div>
          </div>
          <div ref="chartRef" class="pie-chart" />
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import * as echarts from 'echarts'
import { mockCenterRows } from '@/mock/center-service'

interface Row { fio: string; dept: string; total: number; cancelled: number; in_progress: number; done: number }

// Mock rows (from centralized mock file)
const rows = ref<Row[]>(mockCenterRows)

// Period slider: days range within August 2025
const selectedMonth = ref<number>(8)
const daysRange = ref<[number, number]>([1, 31])

const filteredRows = computed(() => {
  // For mock, we ignore dates; in real app we'd filter by date fields
  return rows.value
})

const totals = computed(() => {
  const total = rows.value.reduce((s, r) => s + r.total, 0)
  const cancelled = rows.value.reduce((s, r) => s + r.cancelled, 0)
  const done = rows.value.reduce((s, r) => s + r.done, 0)
  const in_progress = rows.value.reduce((s, r) => s + r.in_progress, 0)
  return { total, cancelled, done, in_progress }
})

const percentTotalDone = computed(() => Math.round((totals.value.done / Math.max(1, totals.value.total)) * 100))
const percentTotalCancelled = computed(() => Math.round((totals.value.cancelled / Math.max(1, totals.value.total)) * 100))
const percentTotalInProgress = computed(() => Math.round((totals.value.in_progress / Math.max(1, totals.value.total)) * 100))

// Chart
const chartRef = ref<HTMLDivElement | null>(null)
let chart: echarts.ECharts | null = null

function renderChart() {
  if (!chartRef.value) return
  chart = echarts.init(chartRef.value as HTMLDivElement)
  const option = {
    tooltip: { trigger: 'item', formatter: '{b} {c} ({d}%)' },
    series: [
      {
        name: 'Статус',
        type: 'pie',
        radius: ['45%', '75%'],
        avoidLabelOverlap: false,
        label: { show: true, formatter: '{b}\n{d}%', position: 'outside' },
        emphasis: { label: { show: true, fontSize: '14', fontWeight: 'bold' } },
        labelLine: { length: 16, length2: 8 },
        data: [
          { value: totals.value.done, name: `Выполнено ${totals.value.done}`, itemStyle: { color: '#16a34a' } },
          { value: totals.value.cancelled, name: `Отменено ${totals.value.cancelled}`, itemStyle: { color: '#dc2626' } },
          { value: totals.value.in_progress, name: `В процессе ${totals.value.in_progress}`, itemStyle: { color: '#f97316' } }
        ]
      }
    ]
  }
  chart.setOption(option)
}

onMounted(() => {
  nextTick(() => renderChart())
  window.addEventListener('resize', () => chart?.resize())
})

watch(totals, () => { renderChart() })

// UI helpers
const periodStart = computed(() => `2025-08-${String(daysRange.value[0]).padStart(2, '0')}`)
const periodEnd = computed(() => `2025-08-${String(daysRange.value[1]).padStart(2, '0')}`)
const sliderLabel = computed(() => `${periodStart.value} — ${periodEnd.value}`)

function toggleFilter() {
  // placeholder: in a polished UI this would open filters; left as stub
  // keep minimal: scroll to table
  const el = document.querySelector('.center-table')
  if (el) (el as HTMLElement).scrollIntoView({ behavior: 'smooth' })
}

function percentRow(row: Row) {
  const total = row.total || 1
  return Math.round((row.done / total) * 100)
}

function deltaClassFromRow(row: Row) {
  const p = percentRow(row)
  if (p >= 80) return 'good'
  if (p >= 50) return 'warning'
  return 'poor'
}

function arrowClassFromRow(row: Row) {
  const p = percentRow(row)
  if (p >= 80) return 'up'
  if (p >= 50) return 'right'
  return 'down'
}
</script>

<style scoped lang="scss">
@import '@/components/core/tables/art-table/style.scss';

.center-analytics-page {
  font-family: 'Segoe UI', Tahoma, Arial, sans-serif;
  color: var(--text-color, #0f172a);

  .page-header { display:flex; justify-content:space-between; align-items:flex-start; gap:12px; margin-bottom:12px;
    .title-block { flex:1 }
    h2 { font-size:16px; font-weight:700; margin:0 0 8px 0 }
    .kpis { display:flex; gap:12px; align-items:center }
    .kpi { padding:10px 16px; border-radius:8px; text-align:center; min-width:120px }
    .kpi .kpi-value { font-size:22px; font-weight:800 }
    .kpi .kpi-label { font-size:12px; color:var(--muted,#64748b) }
    .kpi-blue { background: linear-gradient(180deg,#eef6ff,#ffffff); color:#1e3a8a }
    .kpi-red { background: linear-gradient(180deg,#fff5f5,#ffffff); color:#b91c1c }
    .kpi-green { background: linear-gradient(180deg,#f0fdf4,#ffffff); color:#065f46 }
    .kpi-orange { background: linear-gradient(180deg,#fffbeb,#ffffff); color:#92400e }
    .controls { display:flex; gap:12px; align-items:center }
    .period-inline { display:flex; gap:8px; align-items:center }
    .period-dates { font-weight:700 }
    .period-slider { display:flex; flex-direction:column; gap:6px; align-items:flex-end }
    .days-slider { width:260px }
  }

  .content { display:flex; gap:12px }
  .left { flex:1 }
  .right { width:380px }
  .pie-chart { height:360px }

  .table-card { padding:12px; position:relative }
  .card-actions { position:absolute; top:12px; right:12px }

  .center-table .el-table th { background: #0b5ed7; color: #fff; font-weight:700; text-align:center }
  .center-table .el-table td { text-align:center; font-weight:600 }

  .cell-combo { display:flex; align-items:center; justify-content:center; gap:8px }
  .delta { display:inline-flex; align-items:center; gap:6px; padding:4px 8px; border-radius:6px; font-size:12px }
  .delta.good { background: rgba(16,185,129,0.12); color:#065f46 }
  .delta.warning { background: rgba(250,204,21,0.12); color:#7c5d00 }
  .delta.poor { background: rgba(239,68,68,0.12); color:#7f1d1d }

  .arrow::after { font-weight:700 }
  .arrow.up::after { content: '▲'; color:#059669 }
  .arrow.down::after { content: '▼'; color:#dc2626 }
  .arrow.right::after { content: '▶'; color:#f59e0b }

  .summary-footer { margin-top:12px; background:#eef4ff; padding:8px 12px; border-radius:8px; display:flex; align-items:center; justify-content:space-between }
  .summary-label { font-weight:700 }
  .summary-values { display:flex; gap:22px; font-weight:800 }

  .chart-card { padding:12px }
  .chart-legend { display:flex; flex-direction:column; gap:8px; margin-bottom:8px }
  .legend-item { display:flex; gap:8px; align-items:center; font-weight:600 }
  .dot { width:12px; height:12px; border-radius:50%; display:inline-block }
  .dot.done { background:#16a34a }
  .dot.cancelled { background:#dc2626 }
  .dot.inprog { background:#f97316 }

  @media (max-width: 768px) {
    .page-header { flex-direction:column; align-items:stretch }
    .content { flex-direction:column }
    .right { width:100% }
    .pie-chart { height:220px }
    .days-slider { width:100% }
  }
}
</style>
