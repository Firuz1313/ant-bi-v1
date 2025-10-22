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
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
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

  const totals = computed(() => {
    const total = rows.value.reduce((s, r) => s + r.total, 0)
    const cancelled = rows.value.reduce((s, r) => s + r.cancelled, 0)
    const done = rows.value.reduce((s, r) => s + r.done, 0)
    const in_progress = rows.value.reduce((s, r) => s + r.in_progress, 0)
    return { total, cancelled, done, in_progress }
  })
</script>

<style scoped lang="scss">
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
    }
  }
</style>
