// Composables
import { createRouter, createWebHistory } from 'vue-router'
import Middleware from '@/middlewares'
import demandeRoutes from '@/modules/demande/routes';
import structsanteRoutes from '@/modules/structsante/routes';
import imputationRoutes from '@/modules/imputation/routes';

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import(/* webpackChunkName: "home" */ '@/views/Home.vue'),
      },
      {
        path: 'about',
        name: 'about',
        component: () => import(/* webpackChunkName: "about" */ '@/views/public/About.vue'),
        meta: {
          middleware: [ Middleware.guest]
        }
      },
      {
          path: 'aide',
          name: 'aide',
          component: () => import ( /* webpackChunkName: "aide" */ '@/views/public/Aide.vue'),
          meta: {
              middleware: [Middleware.guest]
          }
      }
    ],
  },
  {
    path: '/auth',
    component: () => import('@/layouts/auth/Default.vue'),
    children: [{
          path: 'login',
          name: 'login',
          component: () => import ( /* webpackChunkName: "login" */ '@/views/auth/Login.vue'),
          meta: {
              middleware: [Middleware.guest]
          }
      },
      {
        path: 'register',
        name: 'register',
        component: () =>
            import ( /* webpackChunkName: "register" */ '@/views/auth/Register.vue'),
        meta: {
            middleware: [Middleware.guest]
        }
      },
      {
        path: 'forgot-password',
        name: 'forgotPassword',
        component: () => import(/* webpackChunkName: "forgotPassword" */ '@/views/auth/ForgotPassword.vue'),
        meta: {
          middleware: [ Middleware.guest]
        }
      },
      {
        path: 'reset-password',
        name: 'resetPassword',
        component: () => import(/* webpackChunkName: "resetPassword" */ '@/views/auth/ResetPassword.vue'),
        meta: {
          middleware: [ Middleware.guest]
        }
      },
      {
        path: 'active-compte',
        name: 'activeCompte',
        component: () => import(/* webpackChunkName: "activeCompte" */ '@/views/auth/ActiveCompte.vue'),
        meta: {
          middleware: [ Middleware.guest]
        }
      }
    ],
  },
  {
      path: '/app',
      name: 'app',
      component:  () => import('@/layouts/app/Default.vue'),
      children: [{
              path: 'dashboard',
              name: 'dashboard',
              component: () =>
                  import ( /* webpackChunkName: "dashboard" */ '@/views/app/Dashboard.vue'),
              meta: {
                  middleware: [Middleware.auth]
              }
          },
          {
            path: 'profile',
            name: 'profile',
            component: () =>
                import ( /* webpackChunkName: "profile" */ '@/views/auth/Profile.vue'),
            meta: {
                middleware: [Middleware.auth]
            }
          },
      ]
  },
  ...demandeRoutes,
  ...structsanteRoutes,
  ...imputationRoutes
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  linkActiveClass: 'active-link',
  linkExactActiveClass: 'exact-active-link',
  routes,
})

function nextCheck(context, middleware, index) {
  const nextMiddleware = middleware[index];

  if (!nextMiddleware) return context.next;

  return (...parameters) => {
      context.next(...parameters);
      const nextMiddle = nextCheck(context, middleware, index + 1);

      nextMiddleware({
          ...
          context,
          next: nextMiddle
      })
  }
}

router.beforeEach((to, from, next) => {
  if (to.meta.middleware) {
      const middleware = Array.isArray(to.meta.middleware) ? to.meta.middleware : [to.meta.middleware];

      const ctx = {
          from,
          next,
          router,
          to
      }

      const nextMiddleware = nextCheck(ctx, middleware, 1);

      return middleware[0]({
          ...ctx,
          next: nextMiddleware
      })
  }

  return next();
});

export default router
