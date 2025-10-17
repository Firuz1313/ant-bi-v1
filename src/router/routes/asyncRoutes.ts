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
      roles: ['R_SUPER', 'R_ADMIN']
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
