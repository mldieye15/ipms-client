const AppLayout = () => import(/* webpackChunkName: 'app-layout' */ "@/layouts/app/Default");
const academieListe = () => import( /* webpackChunkName: 'academie__liste' */ './views/Liste.vue');


const demandeRoutes = [{
    path: '/app/dashboard/demandes',
    component: AppLayout,
    children: [
      {
            path: '',
            name: 'demande-liste',
            component: () => import( /* webpackChunkName: 'demande_liste' */ './views/Liste.vue')
      },
      {
        path: '/app/dashboard/demandes/:id',
        name: 'demande-details',
        component: () => import( /* webpackChunkName: 'demande_details' */ './views/Details.vue'),
      },
      {
        path: '/app/dashboard/demandes/add',
        name: 'demande-add',
        component: () => import( /* webpackChunkName: 'demande_add' */ './views/Add.vue')
      },
      {
        path: '/app/dashboard/demandes/edit/:id',
        name: 'demande-edit',
        component: () => import( /* webpackChunkName: 'demande_edit */ './views/Edit.vue')
      }
    ]
}];
export default demandeRoutes;
