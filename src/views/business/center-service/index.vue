<template>
  <div class="center-analytics-page">
    <div class="page-title-section">
      <h1 class="page-title">АНАЛИТИКА ПРИНЯТЫХ ЗАЯВОК ЦЕНТР ОБСЛУЖИВАНИЕ</h1>
    </div>

    <div class="kpi-section">
      <div class="kpi-block kpi-blue">
        <div class="kpi-value">{{ totals.total }}</div>
        <div class="kpi-label">Заявки на подключение</div>
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
        <div class="kpi-label">В процессе</div>
      </div>
    </div>

    <div class="filters-section">
      <div class="period-display-card">
        <div class="period-header">
          <i class="el-icon-date"></i>
          <span class="period-label">Период анализа</span>
        </div>
        <div class="period-range">
          <span class="period-date">{{ formatDate(dateRange[0]) }}</span>
          <span class="period-separator">—</span>
          <span class="period-date">{{ formatDate(dateRange[1]) }}</span>
        </div>
        <div class="period-controls">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="—"
            start-placeholder="Начало"
            end-placeholder="Конец"
            size="small"
            format="YYYY-MM-DD"
            class="period-picker"
          />
        </div>
      </div>

      <div class="days-filter-card">
        <div class="days-header">
          <i class="el-icon-s-unfold"></i>
          <span class="days-label">Выбор дней месяца</span>
        </div>
        <div class="days-content">
          <div class="days-slider-wrapper">
            <div class="slider-input-group">
              <div class="slider-input-item">
                <label>От:</label>
                <el-input-number
                  v-model="daysRange[0]"
                  :min="1"
                  :max="31"
                  size="small"
                  @change="validateDaysRange"
                />
              </div>
              <div class="slider-input-item">
                <label>До:</label>
                <el-input-number
                  v-model="daysRange[1]"
                  :min="1"
                  :max="31"
                  size="small"
                  @change="validateDaysRange"
                />
              </div>
            </div>
            <el-slider
              v-model="daysRange"
              range
              :min="1"
              :max="31"
              :step="1"
              :show-tooltip="true"
              class="day-slider"
            />
          </div>
          <div class="days-display">
            <span class="days-info">{{ daysRange[0] }}-{{ daysRange[1] }} дни ({{ daysRange[1] - daysRange[0] + 1 }} дней)</span>
          </div>
        </div>
      </div>
    </div>

    <div class="content-section">
      <div class="table-wrapper">
        <div class="table-header">
          <h3 class="table-title">Данные по сотрудникам</h3>
          <div class="table-actions">
            <el-button size="small" @click="exportTableData">Экспорт</el-button>
          </div>
        </div>
        <div class="table-container">
          <el-table
            :data="filteredRows"
            stripe
            border
            class="center-table"
            :default-sort="{ prop: 'fio', order: 'ascending' }"
            style="width: 100%"
          >
            <el-table-column prop="fio" label="ФИО" min-width="140" align="left" />
            <el-table-column prop="dept" label="Подразделение" min-width="120" align="center" />
            <el-table-column prop="total" label="Заявки на подключение" min-width="120" align="center" />
            <el-table-column prop="cancelled" label="Отменено" min-width="100" align="center">
              <template #default="{ row }">
                <div class="cell-value">{{ row.cancelled }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="in_progress" label="В процессе" min-width="110" align="center">
              <template #default="{ row }">
                <div class="cell-value">{{ row.in_progress }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="done" label="Выполнено" min-width="100" align="center">
              <template #default="{ row }">
                <div class="cell-value">{{ row.done }}</div>
              </template>
            </el-table-column>
            <el-table-column label="% выполнения" min-width="100" align="center">
              <template #default="{ row }">
                <div class="percentage-badge" :class="getPercentageClass(row)">
                  {{ percentRow(row) }}%
                </div>
              </template>
            </el-table-column>
            <el-table-column label="Статус" min-width="110" align="center">
              <template #default="{ row }">
                <el-tag :type="getStatusType(row)">{{ getStatusText(row) }}</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="table-summary">
          <div class="summary-item">
            <span class="summary-label">Итого:</span>
            <span class="summary-value">{{ totals.total }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Отменено:</span>
            <span class="summary-value">{{ totals.cancelled }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">В процессе:</span>
            <span class="summary-value">{{ totals.in_progress }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Выполнено:</span>
            <span class="summary-value">{{ totals.done }}</span>
          </div>
        </div>
      </div>

      <div class="chart-wrapper">
        <div class="chart-header">
          <h3 class="chart-title">Удельный вес в %</h3>
        </div>
        <div class="chart-container">
          <div class="chart-legend">
            <div class="legend-item">
              <span class="dot done"></span>
              <span class="legend-text">Выполнено {{ totals.done }} ({{ percentTotalDone }}%)</span>
            </div>
            <div class="legend-item">
              <span class="dot cancelled"></span>
              <span class="legend-text">Отменено {{ totals.cancelled }} ({{ percentTotalCancelled }}%)</span>
            </div>
            <div class="legend-item">
              <span class="dot inprog"></span>
              <span class="legend-text">В процессе {{ totals.in_progress }} ({{ percentTotalInProgress }}%)</span>
            </div>
          </div>
          <div ref="chartRef" class="pie-chart" />
        </div>
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

  const rows = ref<Row[]>(mockCenterRows)
  const dateRange = ref<[Date, Date]>([new Date(2025, 7, 1), new Date(2025, 7, 31)])
  const daysRange = ref<[number, number]>([1, 31])

  const filteredRows = computed(() => {
    return rows.value.filter((row) => {
      if (daysRange.value) {
        return true
      }
      return true
    })
  })

  const totals = computed(() => {
    const filtered = filteredRows.value
    const total = filtered.reduce((s, r) => s + r.total, 0)
    const cancelled = filtered.reduce((s, r) => s + r.cancelled, 0)
    const done = filtered.reduce((s, r) => s + r.done, 0)
    const in_progress = filtered.reduce((s, r) => s + r.in_progress, 0)
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
          radius: ['35%', '65%'],
          avoidLabelOverlap: false,
          label: { show: true, formatter: '{b}\n{d}%', position: 'outside' },
          emphasis: { label: { show: true, fontSize: '14', fontWeight: 'bold' } },
          labelLine: { length: 15, length2: 8 },
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

  function percentRow(row: Row) {
    const total = row.total || 1
    return Math.round((row.done / total) * 100)
  }

  function getPercentageClass(row: Row) {
    const p = percentRow(row)
    if (p >= 80) return 'high'
    if (p >= 50) return 'medium'
    return 'low'
  }

  function getStatusType(row: Row) {
    const p = percentRow(row)
    if (p >= 80) return 'success'
    if (p >= 50) return 'warning'
    return 'danger'
  }

  function getStatusText(row: Row) {
    const p = percentRow(row)
    if (p >= 80) return 'Хорошо'
    if (p >= 50) return 'Нормально'
    return 'Низко'
  }

  function formatDate(date: Date | null | undefined): string {
    if (!date) return ''
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  function validateDaysRange() {
    if (daysRange.value[0] > daysRange.value[1]) {
      const temp = daysRange.value[0]
      daysRange.value[0] = daysRange.value[1]
      daysRange.value[1] = temp
    }
  }

  function exportTableData() {
    console.log('Export table data')
  }

  onMounted(() => {
    nextTick(() => renderChart())
    window.addEventListener('resize', () => {
      if (chart) chart.resize()
    })
  })

  watch(totals, () => {
    renderChart()
  })
</script>

<style scoped lang="scss">
  .center-analytics-page {
    font-family: 'Segoe UI', Tahoma, Arial, sans-serif;
    color: var(--text-color, #0f172a);
    padding: 20px;

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
      flex-wrap: wrap;
    }

    .kpi-block {
      padding: 20px;
      border-radius: 8px;
      text-align: center;
      min-width: 160px;
      flex: 0 1 auto;
    }

    .kpi-value {
      font-size: 36px;
      font-weight: 700;
      line-height: 1;
      margin-bottom: 8px;
    }

    .kpi-label {
      font-size: 13px;
      font-weight: 600;
      line-height: 1.3;
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

    .filters-section {
      display: grid;
      grid-template-columns: 1fr 1.2fr;
      gap: 20px;
      margin-bottom: 24px;
    }

    .period-display-card {
      background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%);
      color: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 4px 12px rgba(30, 64, 175, 0.15);
    }

    .period-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
      font-size: 13px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      opacity: 0.9;
    }

    .period-label {
      display: block;
    }

    .period-range {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      margin-bottom: 16px;
      font-size: 18px;
      font-weight: 700;
      letter-spacing: 0.5px;
    }

    .period-date {
      background: rgba(255, 255, 255, 0.15);
      padding: 8px 12px;
      border-radius: 6px;
      font-family: 'Courier New', monospace;
      font-weight: 700;
      font-size: 15px;
    }

    .period-separator {
      font-size: 20px;
      font-weight: 300;
    }

    .period-controls {
      :deep(.el-date-editor) {
        width: 100%;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);

        input {
          background: transparent;
          color: white;
          font-size: 13px;

          &::placeholder {
            color: rgba(255, 255, 255, 0.5);
          }
        }
      }

      :deep(.el-input__icon) {
        color: rgba(255, 255, 255, 0.8);
      }

      :deep(.el-input__suffix) {
        color: rgba(255, 255, 255, 0.8);
      }
    }

    .days-filter-card {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      border: 1px solid #e5e7eb;
    }

    .days-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 16px;
      font-size: 13px;
      font-weight: 600;
      text-transform: uppercase;
      color: #1e40af;
      letter-spacing: 0.5px;
    }

    .days-label {
      display: block;
    }

    .days-content {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .days-slider-wrapper {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .slider-input-group {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .slider-input-item {
      display: flex;
      flex-direction: column;
      gap: 6px;

      label {
        font-size: 12px;
        font-weight: 600;
        color: #374151;
      }

      :deep(.el-input-number) {
        width: 100%;

        .el-input__inner {
          text-align: center;
          font-weight: 600;
        }
      }
    }

    .day-slider {
      :deep(.el-slider__track) {
        background: linear-gradient(90deg, #1e40af 0%, #2563eb 100%);
        height: 6px;
      }

      :deep(.el-slider__button) {
        border-color: #1e40af;
        background-color: white;
        width: 20px;
        height: 20px;
        box-shadow: 0 2px 8px rgba(30, 64, 175, 0.3);
        border: 3px solid #1e40af;

        &:hover {
          box-shadow: 0 4px 12px rgba(30, 64, 175, 0.4);
        }
      }

      :deep(.el-slider__stop) {
        background-color: #dbeafe;
      }

      :deep(.el-tooltip__popper[x-placement^='top']) {
        background: #1e40af;

        &[x-placement^='top']::after {
          border-top-color: #1e40af;
        }
      }
    }

    .days-display {
      text-align: center;
      padding: 12px;
      background: #f0f9ff;
      border-radius: 8px;
      border: 1px solid #bfdbfe;
    }

    .days-info {
      font-size: 13px;
      font-weight: 600;
      color: #1e40af;
      letter-spacing: 0.3px;
    }

    .content-section {
      display: grid;
      grid-template-columns: 1fr 1.3fr;
      gap: 20px;
      min-height: 650px;
    }

    .table-wrapper {
      display: flex;
      flex-direction: column;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      border-bottom: 1px solid #e5e7eb;
    }

    .table-title {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: #1f2937;
    }

    .table-actions {
      display: flex;
      gap: 8px;
    }

    .table-container {
      flex: 1;
      overflow: auto;
      min-height: 400px;
    }

    .center-table {
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

    .cell-value {
      font-weight: 600;
      color: #1f2937;
    }

    .percentage-badge {
      padding: 4px 12px;
      border-radius: 6px;
      font-weight: 600;
      font-size: 11px;

      &.high {
        background-color: rgba(22, 163, 74, 0.1);
        color: #16a34a;
      }

      &.medium {
        background-color: rgba(249, 115, 22, 0.1);
        color: #f97316;
      }

      &.low {
        background-color: rgba(220, 38, 38, 0.1);
        color: #dc2626;
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

    .chart-wrapper {
      display: flex;
      flex-direction: column;
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      border: 1px solid #e5e7eb;
    }

    .chart-header {
      padding: 20px;
      border-bottom: 2px solid #f0f4f8;
      background: linear-gradient(to right, #f8f9fb, #ffffff);
    }

    .chart-title {
      margin: 0;
      font-size: 17px;
      font-weight: 700;
      color: #1e40af;
      letter-spacing: 0.3px;
    }

    .chart-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 24px 20px;
      min-height: 480px;
    }

    .chart-legend {
      display: flex;
      flex-direction: column;
      gap: 14px;
      margin-bottom: 24px;
      padding: 16px;
      background: #f0f9ff;
      border-radius: 8px;
      border-left: 4px solid #1e40af;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 13px;
      font-weight: 600;
      line-height: 1.4;
    }

    .dot {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      flex-shrink: 0;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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

    .legend-text {
      color: #1f2937;
      font-weight: 600;
    }

    .pie-chart {
      flex: 1;
      min-height: 380px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    @media (max-width: 1400px) {
      .content-section {
        grid-template-columns: 1fr;
        min-height: auto;
      }
    }

    @media (max-width: 768px) {
      padding: 12px;

      .page-title {
        font-size: 20px;
        margin-bottom: 16px;
      }

      .kpi-section {
        gap: 12px;
        margin-bottom: 16px;
      }

      .kpi-block {
        padding: 14px 16px;
        min-width: 140px;
      }

      .kpi-value {
        font-size: 28px;
      }

      .kpi-label {
        font-size: 11px;
      }

      .filters-section {
        grid-template-columns: 1fr;
        gap: 16px;
        padding: 12px;
        margin-bottom: 16px;
      }

      .content-section {
        gap: 16px;
        min-height: auto;
      }

      .table-wrapper,
      .chart-wrapper {
        min-height: 400px;
      }

      .table-header,
      .chart-header {
        padding: 12px;
      }

      .table-title,
      .chart-title {
        font-size: 14px;
      }

      .table-summary {
        gap: 12px;
        padding: 10px 12px;
        font-size: 11px;
      }

      .summary-item {
        gap: 4px;
      }

      .chart-legend {
        gap: 10px;
        margin-bottom: 12px;
      }

      .legend-item {
        font-size: 12px;
      }

      .center-table {
        :deep(.el-table__header th) {
          font-size: 11px;
          padding: 8px 0;
        }

        :deep(.el-table__body td) {
          padding: 8px 0;
          font-size: 11px;
        }
      }
    }

    @media (max-width: 480px) {
      padding: 8px;

      .page-title {
        font-size: 16px;
      }

      .kpi-section {
        gap: 8px;
        margin-bottom: 12px;
      }

      .kpi-block {
        padding: 12px;
        min-width: 100px;
        flex: 1;
      }

      .kpi-value {
        font-size: 24px;
        margin-bottom: 4px;
      }

      .kpi-label {
        font-size: 10px;
      }

      .filters-section {
        grid-template-columns: 1fr;
        gap: 12px;
        padding: 10px;
        margin-bottom: 12px;
      }

      .filter-label {
        font-size: 12px;
      }

      .table-container {
        min-height: 300px;
      }

      .chart-container {
        min-height: 300px;
      }

      .pie-chart {
        min-height: 250px;
      }

      .table-summary {
        flex-direction: column;
        gap: 8px;
        padding: 8px 10px;
      }

      .chart-legend {
        gap: 8px;
      }

      .legend-item {
        font-size: 11px;
      }
    }
  }
</style>
