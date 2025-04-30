routes = [
  {
    path: '/',
    url: './index.html',
  },
  // Страница about
  {
    path: '/about/',
    url: './pages/about.html',
  },
  // Страница help
  {
    path: '/help/',
    url: './pages/help.html',
  },
  // Default route (404 page). MUST BE THE LAST
  {
    path: '(.*)',
    url: './pages/404.html',
  },
];
