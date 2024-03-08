import React from 'react';

const BookPages = React.lazy(() => import('../pages/master/companies/Companies'));


const routes = [
  { path: '/book', name: 'Book', component: BookPages },
];

export default routes;
