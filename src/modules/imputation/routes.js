const AppLayout = () => import(/* webpackChunkName: 'app-layout' */ "@/layouts/app/Default");
const villeListe = () => import( /* webpackChunkName: 'ville_liste' */ './views/Liste.vue');
//const villeDetails = () => import( /* webpackChunkName: 'ville_details' */ './views/Details.vue');

const imputationRoutes = [{
    path: '/app/dashboard/imputations',
    component: AppLayout,
    children: [
      {
            path: '',
            name: 'imputation-liste',
            component: () => import( /* webpackChunkName: 'imputation_liste' */ './views/Liste.vue')
      },
      {
        path: '/app/dashboard/imputations/:id',
        name: 'imputation-details',
        component: () => import( /* webpackChunkName: 'imputation_details' */ './views/Details.vue'),
      },
      {
        path: '/app/dashboard/imputations/add',
        name: 'imputation-add',
        component: () => import( /* webpackChunkName: 'imputation_add' */ './views/Add.vue')
      },
      {
        path: '/app/dashboard/imputations/edit/:id',
        name: 'imputation-edit',
        component: () => import( /* webpackChunkName: 'imputation_edit */ './views/Edit.vue')
      }
    ]
}];
export default imputationRoutes;
