import { RoutesAlias } from '../routesAlias'
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
      icon: '&#xe73a;', // иконка аналитики
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
      icon: '&#xe75f;', // иконка отчётов
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
      icon: '&#xe734;', // иконка данных
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
      icon: '&#xe722;', // иконка визуализации
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
  }
]
