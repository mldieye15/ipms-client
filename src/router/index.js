// Composables
import { createRouter, createWebHistory } from 'vue-router'
import Middleware from '@/middlewares'
import demandeRoutes from '@/modules/demande/routes';
import structsanteRoutes from '@/modules/structsante/routes';
import imputationRoutes from '@/modules/imputation/routes';

const routes = [
  {
    //path: '/ipms/',
    path: '/',
    component: () => import('@/layouts/auth/Default.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import(/* webpackChunkName: "home" */ '@/views/auth/Login.vue'),
      }
    ],
  },
  {
    //path: '/ipms/',
    path: '/mdp-oublie',
    component: () => import('@/layouts/auth/Default.vue'),
    children: [
      {
        path: '',
        name: 'forgotpwd',
        component: () => import(/* webpackChunkName: "home" */ '@/views/auth/ForgotPassword.vue'),
      }
    ],
  },
  {
    //path: '/ipms/',
    path: '/activation-compte',
    component: () => import('@/layouts/auth/Default.vue'),
    children: [
      {
        path: '',
        name: 'compteactive',
        component: () => import(/* webpackChunkName: "home" */ '@/views/auth/ActiveCompte.vue'),
      }
    ],
  },
  {
    //path: '/ipms/',
    path: '/mdp-reset',
    component: () => import('@/layouts/auth/Default.vue'),
    children: [
      {
        path: '',
        name: 'resetpwd',
        component: () => import(/* webpackChunkName: "home" */ '@/views/auth/ResetPassword.vue'),
      }
    ],
  },

  {
    //path: '/ipms/app',
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
  //mode: 'history',
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
