const AppLayout = () => import(/* webpackChunkName: 'app-layout' */ "@/layouts/app/Default");
const villeListe = () => import( /* webpackChunkName: 'ville_liste' */ './views/Liste.vue');
//const villeDetails = () => import( /* webpackChunkName: 'ville_details' */ './views/Details.vue');

const structsanteRoutes = [{
    path: '/app/dashboard/structsante',
    component: AppLayout,
    children: [
      {
            path: '',
            name: 'structsante-liste',
            component: () => import( /* webpackChunkName: 'structsante_liste' */ './views/Liste.vue')
      },
      {
        path: '/app/dashboard/structsante/:id',
        name: 'structsante-details',
        component: () => import( /* webpackChunkName: 'structsante_details' */ './views/Details.vue'),
      },
      {
        path: '/app/dashboard/structsante/add',
        name: 'structsante-add',
        component: () => import( /* webpackChunkName: 'structsante_add' */ './views/Add.vue')
      },
      {
        path: '/app/dashboard/villes/edit/:id',
        name: 'structsante-edit',
        component: () => import( /* webpackChunkName: 'structsante_edit */ './views/Edit.vue')
      }
    ]
}];
export default structsanteRoutes;
