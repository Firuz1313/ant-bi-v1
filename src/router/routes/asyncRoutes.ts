import { AppRouteRecord } from '@/types/router'
import { RoutesAlias } from '../routesAlias'

/**
 * Асинхронные маршруты: только новые разделы из ТЗ
 */
export const asyncRoutes: AppRouteRecord[] = [
  {
    name: 'ApplicationsAnalytics',
    path: '/applications-analytics',
    component: RoutesAlias.Layout,
    meta: {
      title: 'Аналитика по заявкам на подключение план/факт',
      icon: '&#xe73a;',
      roles: ['R_SUPER', 'R_ADMIN', 'R_USER']
    },
    children: [
      {
        path: 'index',
        name: 'ApplicationsAnalyticsIndex',
        component: () => import('@views/business/applications-analytics/index.vue'),
        meta: { title: 'Общая сводка', keepAlive: true, icon: '&#xe721;' }
      },
      {
        path: 'service-center',
        name: 'ApplicationsAnalyticsServiceCenter',
        component: () => import('@views/business/applications-analytics/service-center/index.vue'),
        meta: { title: 'Центр обслуживания', keepAlive: true, icon: '&#xe6af;' }
      },
      {
        path: 'stp',
        name: 'ApplicationsAnalyticsSTP',
        component: () => import('@views/business/applications-analytics/stp/index.vue'),
        meta: { title: 'СТП', keepAlive: true, icon: '&#xe722;' }
      },
      {
        path: 'contact-center',
        name: 'ApplicationsAnalyticsContactCenter',
        component: () => import('@views/business/applications-analytics/contact-center/index.vue'),
        meta: { title: 'Контакт центр', keepAlive: true, icon: '&#xe734;' }
      },
      {
        path: 'f2f',
        name: 'ApplicationsAnalyticsF2F',
        component: () => import('@views/business/applications-analytics/f2f/index.vue'),
        meta: { title: 'F2F', keepAlive: true, icon: '&#xe75f;' }
      }
    ]
  },
  {
    name: 'MastersDept',
    path: '/masters-dept',
    component: RoutesAlias.Layout,
    meta: {
      title: 'Отдел-мастеров: план/факт выполнения заявок',
      icon: '&#xe722;',
      roles: ['R_SUPER', 'R_ADMIN', 'R_USER']
    },
    children: [
      {
        path: 'index',
        name: 'MastersDeptIndex',
        component: '/business/masters-dept/index',
        meta: { title: 'Общая сводка', keepAlive: true, icon: '&#xe721;' }
      },
      {
        path: 'cancelled',
        name: 'MastersDeptCancelled',
        component: '/business/masters-dept/cancelled/index',
        meta: { title: 'Отмененные заявки', keepAlive: true, icon: '&#xe6af;' }
      },
      {
        path: 'repair-days',
        name: 'MastersDeptRepairDays',
        component: '/business/masters-dept/repair-days/index',
        meta: { title: 'Дни обработки на ремонт', keepAlive: true, icon: '&#xe734;' }
      },
      {
        path: 'connection-days',
        name: 'MastersDeptConnectionDays',
        component: '/business/masters-dept/connection-days/index',
        meta: { title: 'Дни обработки подключений', keepAlive: true, icon: '&#xe75f;' }
      },
      {
        path: 'percent-completed',
        name: 'MastersDeptPercentCompleted',
        component: '/business/masters-dept/percent-completed/index',
        meta: { title: '% Выполнено', keepAlive: true, icon: '&#xe73a;' }
      },
      {
        path: 'avg-days',
        name: 'MastersDeptAvgDays',
        component: '/business/masters-dept/avg-days/index',
        meta: { title: 'Среднее количество дней', keepAlive: true, icon: '&#xe722;' }
      },
      {
        path: 'forecasts',
        name: 'MastersDeptForecasts',
        component: '/business/masters-dept/forecasts/index',
        meta: { title: 'Прогнозы', keepAlive: true, icon: '&#xe6af;' }
      },
      {
        path: 'source',
        name: 'MastersDeptSource',
        component: '/business/masters-dept/source/index',
        meta: { title: 'Источник заявок', keepAlive: true, icon: '&#xe734;' }
      }
    ]
  },
  {
    name: 'CallCenterStats',
    path: '/call-center',
    component: RoutesAlias.Layout,
    meta: {
      title: 'Контакт-центр: статистика звонков',
      icon: '&#xe6af;',
      roles: ['R_SUPER', 'R_ADMIN', 'R_USER']
    },
    children: [
      {
        path: 'index',
        name: 'CallCenterIndex',
        component: '/business/call-center/index',
        meta: { title: 'Общая сводка', keepAlive: true, icon: '&#xe721;' }
      },
      {
        path: 'call-purpose-repeat',
        name: 'CallCenterPurposeRepeat',
        component: '/business/call-center/call-purpose-repeat/index',
        meta: { title: 'Цель звонка и повторные', keepAlive: true, icon: '&#xe73a;' }
      },
      {
        path: 'by-periods',
        name: 'CallCenterByPeriods',
        component: '/business/call-center/by-periods/index',
        meta: { title: 'По дням, месяцам, года��', keepAlive: true, icon: '&#xe734;' }
      },
      {
        path: 'by-daytime',
        name: 'CallCenterByDaytime',
        component: '/business/call-center/by-daytime/index',
        meta: { title: 'По времени суток', keepAlive: true, icon: '&#xe75f;' }
      },
      {
        path: 'resolved-remotely',
        name: 'CallCenterResolvedRemotely',
        component: '/business/call-center/resolved-remotely/index',
        meta: { title: 'Решенные удаленно', keepAlive: true, icon: '&#xe722;' }
      }
    ]
  },
  {
    name: 'DiscountProgram',
    path: '/discount-program',
    component: RoutesAlias.Layout,
    meta: {
      title: 'Участники дисконтной программы',
      icon: '&#xe75f;',
      roles: ['R_SUPER', 'R_ADMIN', 'R_USER']
    },
    children: [
      {
        path: 'index',
        name: 'DiscountProgramIndex',
        component: '/business/discount-program/index',
        meta: { title: 'Общая сводка', keepAlive: true, icon: '&#xe721;' }
      },
      {
        path: 'by-connection',
        name: 'DiscountProgramByConnection',
        component: '/business/discount-program/by-connection/index',
        meta: { title: 'По подключению', keepAlive: true, icon: '&#xe6af;' }
      },
      {
        path: 'by-years',
        name: 'DiscountProgramByYears',
        component: '/business/discount-program/by-years/index',
        meta: { title: 'По годам', keepAlive: true, icon: '&#xe734;' }
      },
      {
        path: 'package-share',
        name: 'DiscountProgramPackageShare',
        component: '/business/discount-program/package-share/index',
        meta: { title: 'Удельный вес по пакетам', keepAlive: true, icon: '&#xe73a;' }
      }
    ]
  },
  {
    name: 'BackofficeDelay',
    path: '/backoffice-delay',
    component: RoutesAlias.Layout,
    meta: {
      title: 'Опоздание Backoffice',
      icon: '&#xe734;',
      roles: ['R_SUPER', 'R_ADMIN', 'R_USER']
    },
    children: [
      {
        path: 'index',
        name: 'BackofficeDelayIndex',
        component: '/business/backoffice-delay/index',
        meta: { title: 'Общая сводка', keepAlive: true, icon: '&#xe721;' }
      },
      {
        path: 'salary-penalty',
        name: 'BackofficeSalaryPenalty',
        component: '/business/backoffice-delay/salary-penalty/index',
        meta: { title: 'Штраф от ЗП', keepAlive: true, icon: '&#xe6af;' }
      }
    ]
  },
  {
    name: 'Clients',
    path: '/clients',
    component: RoutesAlias.Layout,
    meta: {
      title: 'Клиенты',
      icon: '&#xe6af;',
      roles: ['R_SUPER', 'R_ADMIN', 'R_USER']
    },
    children: [
      {
        path: 'index',
        name: 'ClientsIndex',
        component: '/business/clients/index',
        meta: { title: 'Общая сводка', keepAlive: true, icon: '&#xe721;' }
      },
      {
        path: 'inactive',
        name: 'ClientsInactive',
        component: '/business/clients/inactive/index',
        meta: { title: 'Неактивные', keepAlive: true, icon: '&#xe73a;' }
      },
      {
        path: 'by-region',
        name: 'ClientsByRegion',
        component: '/business/clients/by-region/index',
        meta: { title: 'По регионам', keepAlive: true, icon: '&#xe734;' }
      },
      {
        path: 'empty-names',
        name: 'ClientsEmptyNames',
        component: '/business/clients/empty-names/index',
        meta: { title: 'С пустыми ФИО', keepAlive: true, icon: '&#xe75f;' }
      }
    ]
  }
]
