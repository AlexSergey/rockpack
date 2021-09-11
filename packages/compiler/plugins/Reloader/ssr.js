if (typeof window !== 'undefined' && !document.getElementById('rockpack-livereload')) {
  const script = document.createElement('script');
  script.id = 'rockpack-livereload';
  script.type = 'text/javascript';
  script.src = `http://localhost:${process.env.LIVE_RELOAD_PORT}/livereload.js`;

  document.getElementsByTagName('head')[0].appendChild(script);
}
