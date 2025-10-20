import { AppRouteRecord } from '@/types/router'

/**
 * Меню и асинхронные роуты
 *
 * Поддерживает два режима:
 * - Статическая конфигурация на фронтенде
 * - Динамическая конфигурация с бэкенда
 */
export const asyncRoutes: AppRouteRecord[] = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    component: RoutesAlias.Layout,
    meta: {
      title: 'menus.dashboard.title',
      icon: '&#xe721;',
      roles: ['R_SUPER', 'R_ADMIN', 'R_USER']
    },
    children: [
      {
        path: 'console',
        name: 'Console',
        component: RoutesAlias.Dashboard,
        meta: {
          title: 'menus.dashboard.console',
          keepAlive: false,
          fixedTab: true
        }
      }
    ]
  },
  {
    name: 'Analytics',
    path: '/analytics',
    component: RoutesAlias.Layout,
    meta: {
      title: 'menus.analytics.title',
      icon: '&#xe73a;',
      roles: ['R_SUPER', 'R_ADMIN', 'R_USER']
    },
    children: [
      {
        path: 'overview',
        name: 'AnalyticsOverview',
        component: RoutesAlias.AnalyticsOverview,
        meta: {
          title: 'menus.analytics.overview',
          keepAlive: true
        }
      },
      {
        path: 'realtime',
        name: 'AnalyticsRealtime',
        component: RoutesAlias.AnalyticsRealtime,
        meta: {
          title: 'menus.analytics.realtime',
          keepAlive: true
        }
      },
      {
        path: 'trends',
        name: 'AnalyticsTrends',
        component: RoutesAlias.AnalyticsTrends,
        meta: {
          title: 'menus.analytics.trends',
          keepAlive: true
        }
      },
      {
        path: 'comparison',
        name: 'AnalyticsComparison',
        component: RoutesAlias.AnalyticsComparison,
        meta: {
          title: 'menus.analytics.comparison',
          keepAlive: true
        }
      }
    ]
  },
  {
    name: 'Reports',
    path: '/reports',
    component: RoutesAlias.Layout,
    meta: {
      title: 'menus.reports.title',
      icon: '&#xe75f;',
      roles: ['R_SUPER', 'R_ADMIN', 'R_USER']
    },
    children: [
      {
        path: 'sales',
        name: 'ReportsSales',
        component: RoutesAlias.ReportsSales,
        meta: {
          title: 'menus.reports.sales',
          keepAlive: true
        }
      },
      {
        path: 'financial',
        name: 'ReportsFinancial',
        component: RoutesAlias.ReportsFinancial,
        meta: {
          title: 'menus.reports.financial',
          keepAlive: true
        }
      },
      {
        path: 'marketing',
        name: 'ReportsMarketing',
        component: RoutesAlias.ReportsMarketing,
        meta: {
          title: 'menus.reports.marketing',
          keepAlive: true
        }
      },
      {
        path: 'custom',
        name: 'ReportsCustom',
        component: RoutesAlias.ReportsCustom,
        meta: {
          title: 'menus.reports.custom',
          keepAlive: true
        }
      }
    ]
  },
  {
    name: 'Data',
    path: '/data',
    component: RoutesAlias.Layout,
    meta: {
      title: 'menus.data.title',
      icon: '&#xe734;',
      roles: ['R_SUPER', 'R_ADMIN']
    },
    children: [
      {
        path: 'sources',
        name: 'DataSources',
        component: RoutesAlias.DataSources,
        meta: {
          title: 'menus.data.sources',
          keepAlive: true
        }
      },
      {
        path: 'integration',
        name: 'DataIntegration',
        component: RoutesAlias.DataIntegration,
        meta: {
          title: 'menus.data.integration',
          keepAlive: true
        }
      },
      {
        path: 'warehouse',
        name: 'DataWarehouse',
        component: RoutesAlias.DataWarehouse,
        meta: {
          title: 'menus.data.warehouse',
          keepAlive: true
        }
      },
      {
        path: 'quality',
        name: 'DataQuality',
        component: RoutesAlias.DataQuality,
        meta: {
          title: 'menus.data.quality',
          keepAlive: true
        }
      }
    ]
  },
  {
    name: 'Visualization',
    path: '/visualization',
    component: RoutesAlias.Layout,
    meta: {
      title: 'menus.visualization.title',
      icon: '&#xe722;',
      roles: ['R_SUPER', 'R_ADMIN', 'R_USER']
    },
    children: [
      {
        path: 'charts',
        name: 'VisualizationCharts',
        component: RoutesAlias.VisualizationCharts,
        meta: {
          title: 'menus.visualization.charts',
          keepAlive: true
        }
      },
      {
        path: 'tables',
        name: 'VisualizationTables',
        component: RoutesAlias.VisualizationTables,
        meta: {
          title: 'menus.visualization.tables',
          keepAlive: true
        }
      },
      {
        path: 'maps',
        name: 'VisualizationMaps',
        component: RoutesAlias.VisualizationMaps,
        meta: {
          title: 'menus.visualization.maps',
          keepAlive: true
        }
      },
      {
        path: 'widgets',
        name: 'VisualizationWidgets',
        component: RoutesAlias.VisualizationWidgets,
        meta: {
          title: 'menus.visualization.widgets',
          keepAlive: true
        }
      }
    ]
  },
  {
    path: '/system',
    name: 'System',
    component: RoutesAlias.Layout,
    meta: {
      title: 'menus.system.title',
      icon: '&#xe72d;',
      roles: ['R_SUPER', 'R_ADMIN']
    },
    children: [
      {
        path: 'user',
        name: 'User',
        component: RoutesAlias.User,
        meta: {
          title: 'menus.system.user',
          keepAlive: false,
          roles: ['R_SUPER', 'R_ADMIN']
        }
      },
      {
        path: 'role',
        name: 'Role',
        component: RoutesAlias.Role,
        meta: {
          title: 'menus.system.role',
          keepAlive: false,
          roles: ['R_SUPER']
        }
      },
      {
        path: 'menu',
        name: 'Menu',
        component: RoutesAlias.Menu,
        meta: {
          title: 'menus.system.menu',
          keepAlive: false,
          roles: ['R_SUPER']
        }
      },
      {
        path: 'user-center',
        name: 'UserCenter',
        component: RoutesAlias.UserCenter,
        meta: {
          title: 'menus.system.userCenter',
          hidden: true,
          keepAlive: false
        }
      }
    ]
  },
  {
    name: 'ApplicationsAnalytics',
    path: '/applications-analytics',
    component: RoutesAlias.Layout,
    meta: {
      title: 'Аналитика по заявкам на подключение план/факт',
      icon: '&#xe6af;',
      roles: ['R_SUPER', 'R_ADMIN', 'R_USER']
    },
    children: [
      {
        path: 'index',
        name: 'ApplicationsAnalyticsIndex',
        component: '/business/applications-analytics/index',
        meta: { title: 'Общая сводка', keepAlive: true }
      },
      { path: 'service-center', name: 'ApplicationsAnalyticsServiceCenter', component: '/business/applications-analytics/service-center/index', meta: { title: 'Центр обслуживания', keepAlive: true } },
      { path: 'stp', name: 'ApplicationsAnalyticsSTP', component: '/business/applications-analytics/stp/index', meta: { title: 'СТП', keepAlive: true } },
      { path: 'contact-center', name: 'ApplicationsAnalyticsContactCenter', component: '/business/applications-analytics/contact-center/index', meta: { title: 'Контакт центр', keepAlive: true } },
      { path: 'f2f', name: 'ApplicationsAnalyticsF2F', component: '/business/applications-analytics/f2f/index', meta: { title: 'F2F', keepAlive: true } }
    ]
  },
  {
    name: 'MastersDept',
    path: '/masters-dept',
    component: RoutesAlias.Layout,
    meta: {
      title: 'Отдел-мастеров: план/факт выполнения заявок',
      icon: '&#xe73a;',
      roles: ['R_SUPER', 'R_ADMIN', 'R_USER']
    },
    children: [
      { path: 'index', name: 'MastersDeptIndex', component: '/business/masters-dept/index', meta: { title: 'Общая сводка', keepAlive: true } },
      { path: 'cancelled', name: 'MastersDeptCancelled', component: '/business/masters-dept/cancelled/index', meta: { title: 'Отмененные заявки', keepAlive: true } },
      { path: 'repair-days', name: 'MastersDeptRepairDays', component: '/business/masters-dept/repair-days/index', meta: { title: 'Дни обработки на ремонт', keepAlive: true } },
      { path: 'connection-days', name: 'MastersDeptConnectionDays', component: '/business/masters-dept/connection-days/index', meta: { title: 'Дни обработки подключений', keepAlive: true } },
      { path: 'percent-completed', name: 'MastersDeptPercentCompleted', component: '/business/masters-dept/percent-completed/index', meta: { title: '% Выполнено', keepAlive: true } },
      { path: 'avg-days', name: 'MastersDeptAvgDays', component: '/business/masters-dept/avg-days/index', meta: { title: 'Среднее количество дней', keepAlive: true } },
      { path: 'forecasts', name: 'MastersDeptForecasts', component: '/business/masters-dept/forecasts/index', meta: { title: 'Прогнозы', keepAlive: true } },
      { path: 'source', name: 'MastersDeptSource', component: '/business/masters-dept/source/index', meta: { title: 'Источник заявок', keepAlive: true } }
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
      { path: 'index', name: 'CallCenterIndex', component: '/business/call-center/index', meta: { title: 'Общая сводка', keepAlive: true } },
      { path: 'call-purpose-repeat', name: 'CallCenterPurposeRepeat', component: '/business/call-center/call-purpose-repeat/index', meta: { title: 'Цель звонка и повторные', keepAlive: true } },
      { path: 'by-periods', name: 'CallCenterByPeriods', component: '/business/call-center/by-periods/index', meta: { title: 'По дням, месяцам, годам', keepAlive: true } },
      { path: 'by-daytime', name: 'CallCenterByDaytime', component: '/business/call-center/by-daytime/index', meta: { title: 'По времени суток', keepAlive: true } },
      { path: 'resolved-remotely', name: 'CallCenterResolvedRemotely', component: '/business/call-center/resolved-remotely/index', meta: { title: 'Решенные удаленно', keepAlive: true } }
    ]
  },
  {
    name: 'DiscountProgram',
    path: '/discount-program',
    component: RoutesAlias.Layout,
    meta: {
      title: 'Участники дисконтной программы',
      icon: '&#xe6af;',
      roles: ['R_SUPER', 'R_ADMIN', 'R_USER']
    },
    children: [
      { path: 'index', name: 'DiscountProgramIndex', component: '/business/discount-program/index', meta: { title: 'Общая сводка', keepAlive: true } },
      { path: 'by-connection', name: 'DiscountProgramByConnection', component: '/business/discount-program/by-connection/index', meta: { title: 'По подключению', keepAlive: true } },
      { path: 'by-years', name: 'DiscountProgramByYears', component: '/business/discount-program/by-years/index', meta: { title: 'По годам', keepAlive: true } },
      { path: 'package-share', name: 'DiscountProgramPackageShare', component: '/business/discount-program/package-share/index', meta: { title: 'Удельный вес по пакетам', keepAlive: true } }
    ]
  },
  {
    name: 'BackofficeDelay',
    path: '/backoffice-delay',
    component: RoutesAlias.Layout,
    meta: {
      title: 'Опоздание Backoffice',
      icon: '&#xe6af;',
      roles: ['R_SUPER', 'R_ADMIN', 'R_USER']
    },
    children: [
      { path: 'index', name: 'BackofficeDelayIndex', component: '/business/backoffice-delay/index', meta: { title: 'Общая сводка', keepAlive: true } },
      { path: 'salary-penalty', name: 'BackofficeSalaryPenalty', component: '/business/backoffice-delay/salary-penalty/index', meta: { title: 'Штраф от ЗП', keepAlive: true } }
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
      { path: 'index', name: 'ClientsIndex', component: '/business/clients/index', meta: { title: 'Общая сводка', keepAlive: true } },
      { path: 'inactive', name: 'ClientsInactive', component: '/business/clients/inactive/index', meta: { title: 'Неактивные', keepAlive: true } },
      { path: 'by-region', name: 'ClientsByRegion', component: '/business/clients/by-region/index', meta: { title: 'По регионам', keepAlive: true } },
      { path: 'empty-names', name: 'ClientsEmptyNames', component: '/business/clients/empty-names/index', meta: { title: 'С пустыми ФИО', keepAlive: true } }
    ]
  }
]
