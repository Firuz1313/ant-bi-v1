<template>
  <div class="center-analytics-page">
    <div class="page-header">
      <div class="title-block">
        <h2>АНАЛИТИКА ПРИНЯТЫХ ЗАЯВОК — ЦЕНТР ОБСЛУЖИВАНИЕ</h2>
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
        <el-date-picker
          v-model="period"
          type="daterange"
          start-placeholder="Дата с"
          end-placeholder="по"
          value-format="yyyy-MM-dd"
          class="period-picker"
        />
        <a class="set-period" href="#" @click.prevent="openPeriod">Задать период</a>
      </div>
    </div>

    <div class="content">
      <div class="left">
        <el-card class="table-card">
          <el-table :data="rows" stripe border style="width: 100%">
            <el-table-column prop="fio" label="ФИО" width="220" />
            <el-table-column prop="dept" label="Подразделение" width="180" />
            <el-table-column prop="total" label="Заявки" width="90" />
            <el-table-column prop="cancelled" label="Отменено" width="90" />
            <el-table-column prop="in_progress" label="В процессе" width="100" />
            <el-table-column prop="done" label="Выполнено" width="100" />
          </el-table>
        </el-card>
      </div>

      <div class="right">
        <el-card class="chart-card">
          <div ref="chartRef" class="pie-chart" />
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch, nextTick } from 'vue'
import * as echarts from 'echarts'

interface Row {
  fio: string
  dept: string
  total: number
  cancelled: number
  in_progress: number
  done: number
}

const period = ref<[string, string] | null>(['2025-08-01', '2025-08-31'])

const rows = ref<Row[]>([
  { fio: 'Абдуллаев Умид', dept: 'ЦО 1', total: 58, cancelled: 5, in_progress: 2, done: 51 },
  { fio: 'Курбанова Суруйа', dept: 'ЦО 2', total: 42, cancelled: 8, in_progress: 1, done: 33 },
  { fio: 'Раджабов Рахбар', dept: 'ЦО 3', total: 36, cancelled: 3, in_progress: 0, done: 33 },
  { fio: 'Вахидов Махкам', dept: 'ЦО 4', total: 28, cancelled: 2, in_progress: 1, done: 25 },
  { fio: 'Султонов Саид', dept: 'ЦО 5', total: 24, cancelled: 4, in_progress: 0, done: 20 },
  { fio: 'Умаров Шохрух', dept: 'ЦО 6', total: 20, cancelled: 2, in_progress: 0, done: 18 },
  { fio: 'Ганиев Хусниддин', dept: 'ЦО 7', total: 16, cancelled: 1, in_progress: 0, done: 15 }
])

const totals = computed(() => {
  const total = rows.value.reduce((s, r) => s + r.total, 0)
  const cancelled = rows.value.reduce((s, r) => s + r.cancelled, 0)
  const done = rows.value.reduce((s, r) => s + r.done, 0)
  const in_progress = rows.value.reduce((s, r) => s + r.in_progress, 0)
  return { total, cancelled, done, in_progress }
})

const chartRef = ref<HTMLDivElement | null>(null)
let chart: echarts.ECharts | null = null

function renderChart() {
  if (!chartRef.value) return
  chart = echarts.init(chartRef.value as HTMLDivElement)
  const option = {
    tooltip: { trigger: 'item', formatter: '{b} {c} ({d}%)' },
    legend: { orient: 'vertical', left: 'left' },
    series: [
      {
        name: 'Статус',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        label: { show: false, position: 'center' },
        emphasis: { label: { show: true, fontSize: '14', fontWeight: 'bold' } },
        labelLine: { show: false },
        data: [
          { value: totals.value.done, name: `Выполнено ${totals.value.done}` , itemStyle: { color: '#16a34a' } },
          { value: totals.value.cancelled, name: `Отменено ${totals.value.cancelled}` , itemStyle: { color: '#dc2626' } },
          { value: totals.value.in_progress, name: `В процессе ${totals.value.in_progress}` , itemStyle: { color: '#f97316' } }
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

function openPeriod() {
  // placeholder for opening a modal or advanced period picker
  // for mock: toggle period to sample
  period.value = ['2025-08-01', '2025-08-31']
}
</script>

<style scoped lang="scss">
.center-analytics-page {
  font-family: 'Segoe UI', Tahoma, Arial, sans-serif;
  color: var(--text-color, #0f172a);

  .page-header {
    display:flex; justify-content:space-between; align-items:center; gap:12px; margin-bottom:12px;
    .title-block { flex:1; }
    h2 { font-size:18px; font-weight:700; margin:0 0 8px 0 }
    .kpis { display:flex; gap:12px; align-items:center }
    .kpi { padding:8px 14px; border-radius:8px; text-align:center; min-width:110px }
    .kpi .kpi-value { font-size:20px; font-weight:800 }
    .kpi .kpi-label { font-size:12px; color:var(--muted,#64748b) }
    .kpi-blue { background: linear-gradient(180deg,#eef6ff,#ffffff); color:#1e3a8a }
    .kpi-red { background: linear-gradient(180deg,#fff5f5,#ffffff); color:#b91c1c }
    .kpi-green { background: linear-gradient(180deg,#f0fdf4,#ffffff); color:#065f46 }
    .kpi-orange { background: linear-gradient(180deg,#fffbeb,#ffffff); color:#92400e }
    .controls { display:flex; gap:8px; align-items:center }
    .period-picker { min-width:220px }
    .set-period { color: #2563eb; margin-left:8px }
  }

  .content { display:flex; gap:12px; }
  .left { flex:1 }
  .right { width:360px }
  .pie-chart { height:320px; }

  /* responsive */
  @media (max-width: 768px) {
    .page-header { flex-direction:column; align-items:stretch }
    .content { flex-direction:column }
    .right { width:100% }
    .pie-chart { height:240px }
    .kpis { overflow-x:auto }
  }

  .table-card, .chart-card { padding:12px }

  /* table styling tweaks */
  .el-table th, .el-table td { text-align:center; font-size:13px }
  .el-table th { background: #0b5ed7; color: #fff; font-weight:700 }
  .el-table td { font-weight:600 }
}
</style>
