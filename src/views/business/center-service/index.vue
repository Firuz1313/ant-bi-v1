<template>
  <div class="center-analytics-page">
    <div class="page-title-section">
      <h1 class="page-title">ПЛАН/ФАКТ ПО ПРИЁМУ ЗАЯВОК — ЦЕНТР ОБСЛУЖИВАНИЕ</h1>
    </div>

    <div class="kpi-section">
      <div class="kpi-block kpi-blue">
        <div class="kpi-value">{{ totals.total }}</div>
        <div class="kpi-label">Заявки</div>
      </div>
      <div class="kpi-block kpi-red">
        <div class="kpi-value">{{ totals.cancelled }}</div>
        <div class="kpi-label">Отменено</div>
      </div>
      <div class="kpi-block kpi-green">
        <div class="kpi-value">{{ totals.done }}</div>
        <div class="kpi-label">Выполнено</div>
      </div>
      <div class="kpi-block kpi-orange">
        <div class="kpi-value">{{ totals.in_progress }}</div>
        <div class="kpi-label">В проц��ссе</div>
      </div>
    </div>

    <div class="period-section">
      <div class="period-inline">
        <div class="period-label">Период:</div>
        <div class="period-dates">{{ periodStart }} — {{ periodEnd }}</div>
      </div>

      <div class="period-slider">
        <el-select
          v-model="selectedMonth"
          placeholder="Август 2025"
          class="month-select"
          size="small"
        >
          <el-option :label="'Август 2025'" :value="8" />
        </el-select>

        <el-slider v-model="daysRange" range :min="1" :max="31" show-tooltip class="days-slider" />
        <div class="slider-labels">{{ sliderLabel }}</div>
      </div>
    </div>

    <div class="content-section">
      <div class="table-container">
        <el-card class="table-card art-table-card">
          <div class="card-actions">
            <el-button type="primary" size="small" @click="toggleFilter">Фильтр</el-button>
          </div>
          <el-table :data="filteredRows" stripe border class="center-table" style="width: 100%">
            <el-table-column prop="fio" label="ФИО" width="160" align="center" />
            <el-table-column prop="dept" label="Подразделение" width="130" align="center" />
            <el-table-column prop="total" label="Заявки" width="75" align="center" />
            <el-table-column prop="cancelled" label="Отменено" width="75" align="center">
              <template #default="{ row }">
                <div class="cell-combo">
                  <div class="value">{{ row.cancelled }}</div>
                  <div class="delta poor">
                    <i class="arrow down"></i>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="in_progress" label="В процессе" width="85" align="center">
              <template #default="{ row }">
                <div class="value">{{ row.in_progress }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="done" label="Выполнено" width="85" align="center">
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

      <div class="chart-container">
        <el-card class="chart-card">
          <div class="chart-legend">
            <div class="legend-item"
              ><span class="dot done"></span> Выполнено {{ totals.done }} ({{
                percentTotalDone
              }}%)</div
            >
            <div class="legend-item"
              ><span class="dot cancelled"></span> Отменено {{ totals.cancelled }} ({{
                percentTotalCancelled
              }}%)</div
            >
            <div class="legend-item"
              ><span class="dot inprog"></span> В процессе {{ totals.in_progress }} ({{
                percentTotalInProgress
              }}%)</div
            >
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

  interface Row {
    fio: string
    dept: string
    total: number
    cancelled: number
    in_progress: number
    done: number
  }

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

  const percentTotalDone = computed(() =>
    Math.round((totals.value.done / Math.max(1, totals.value.total)) * 100)
  )
  const percentTotalCancelled = computed(() =>
    Math.round((totals.value.cancelled / Math.max(1, totals.value.total)) * 100)
  )
  const percentTotalInProgress = computed(() =>
    Math.round((totals.value.in_progress / Math.max(1, totals.value.total)) * 100)
  )

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
            {
              value: totals.value.done,
              name: `Выполнено ${totals.value.done}`,
              itemStyle: { color: '#16a34a' }
            },
            {
              value: totals.value.cancelled,
              name: `Отменено ${totals.value.cancelled}`,
              itemStyle: { color: '#dc2626' }
            },
            {
              value: totals.value.in_progress,
              name: `В процессе ${totals.value.in_progress}`,
              itemStyle: { color: '#f97316' }
            }
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

  watch(totals, () => {
    renderChart()
  })

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

    .period-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
      padding: 12px;
      background: #f9fafb;
      border-radius: 8px;
    }

    .period-inline {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .period-label {
      font-weight: 600;
      color: #374151;
    }

    .period-dates {
      font-weight: 700;
      color: #1f2937;
    }

    .period-slider {
      display: flex;
      flex-direction: column;
      gap: 8px;
      align-items: flex-end;
    }

    .days-slider {
      width: 260px;
    }

    .content-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      grid-auto-rows: 1fr;
      width: 100%;
      overflow: hidden;
    }

    .table-container {
      display: flex;
      height: 550px;
      overflow: hidden;
    }

    .chart-container {
      display: flex;
      height: 550px;
      overflow: hidden;
    }

    .table-card,
    .chart-card {
      padding: 12px;
      position: relative;
      display: flex;
      flex-direction: column;
      flex: 1;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }

    .card-actions {
      position: absolute;
      top: 12px;
      right: 12px;
      z-index: 10;
    }

    .center-table {
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
      width: 100%;
    }

    .center-table .el-table th {
      background: #1e40af;
      color: #fff;
      font-weight: 700;
      text-align: center;
      font-size: 11px;
    }

    .center-table .el-table td {
      text-align: center;
      font-weight: 600;
      font-size: 11px;
    }

    .cell-combo {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }

    .delta {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 11px;
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

    .arrow::after {
      font-weight: 700;
    }

    .arrow.up::after {
      content: '▲';
      color: #16a34a;
    }

    .arrow.down::after {
      content: '▼';
      color: #dc2626;
    }

    .arrow.right::after {
      content: '▶';
      color: #f59e0b;
    }

    .summary-footer {
      margin-top: 8px;
      background: #dbeafe;
      padding: 8px 12px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-weight: 700;
      color: #1e40af;
      font-size: 11px;
    }

    .summary-label {
      font-weight: 700;
    }

    .summary-values {
      display: flex;
      gap: 32px;
      font-weight: 700;
    }

    .chart-card {
      flex-direction: column;
      justify-content: center;
    }

    .chart-legend {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-bottom: 16px;
      padding: 12px 0;
    }

    .legend-item {
      display: flex;
      gap: 10px;
      align-items: center;
      font-weight: 600;
      font-size: 13px;
    }

    .dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      display: inline-block;
      flex-shrink: 0;
    }

    .dot.done {
      background: #16a34a;
    }

    .dot.cancelled {
      background: #dc2626;
    }

    .dot.inprog {
      background: #f97316;
    }

    .pie-chart {
      height: 480px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 1;
    }

    @media (max-width: 1400px) {
      .table-container {
        height: 480px;
      }

      .chart-container {
        height: 480px;
      }

      .pie-chart {
        height: 100%;
      }
    }

    @media (max-width: 1024px) {
      .content-section {
        grid-template-columns: 1fr;
        grid-auto-rows: auto;
      }

      .table-container {
        height: 450px;
      }

      .chart-container {
        height: 450px;
      }

      .pie-chart {
        height: 100%;
      }
    }

    @media (max-width: 768px) {
      .page-title {
        font-size: 22px;
        margin-bottom: 12px;
      }

      .page-title-section {
        margin-bottom: 16px;
      }

      .kpi-section {
        flex-direction: row;
        gap: 10px;
        margin-bottom: 16px;
      }

      .kpi-block {
        padding: 12px 14px;
        min-width: 0;
        flex: 1;
        max-width: none;
      }

      .kpi-value {
        font-size: 24px;
        margin-bottom: 6px;
      }

      .kpi-label {
        font-size: 11px;
      }

      .period-section {
        flex-direction: column;
        align-items: stretch;
        gap: 12px;
        padding: 10px;
        margin-bottom: 16px;
      }

      .period-inline {
        gap: 8px;
      }

      .period-slider {
        align-items: stretch;
        gap: 6px;
      }

      .days-slider {
        width: 100%;
      }

      .content-section {
        grid-template-columns: 1fr;
        gap: 12px;
      }

      .table-container {
        height: 400px;
      }

      .chart-container {
        height: 400px;
      }

      .table-card,
      .chart-card {
        padding: 12px;
      }

      .pie-chart {
        height: 100%;
      }

      .summary-values {
        gap: 20px;
      }

      .summary-footer {
        padding: 10px 12px;
        flex-wrap: wrap;
      }

      .summary-label {
        width: 100%;
        margin-bottom: 8px;
      }

      .chart-legend {
        gap: 8px;
        margin-bottom: 12px;
        padding: 8px 0;
      }

      .legend-item {
        font-size: 12px;
        gap: 8px;
      }
    }

    @media (max-width: 480px) {
      .page-title {
        font-size: 18px;
      }

      .kpi-section {
        gap: 8px;
      }

      .kpi-block {
        padding: 10px 12px;
      }

      .kpi-value {
        font-size: 20px;
      }

      .kpi-label {
        font-size: 10px;
      }

      .period-inline {
        flex-direction: column;
        align-items: flex-start;
        gap: 6px;
      }

      .period-dates {
        font-size: 12px;
      }

      .table-container,
      .chart-container {
        height: 300px;
      }

      .pie-chart {
        height: 100%;
      }

      .summary-values {
        flex-direction: column;
        gap: 8px;
      }

      .center-table .el-table th {
        font-size: 11px;
      }

      .center-table .el-table td {
        font-size: 10px;
      }
    }
  }
</style>
