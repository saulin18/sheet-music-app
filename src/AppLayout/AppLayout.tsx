import { Outlet, Link } from '@tanstack/react-router';

function AppLayout() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Sheet Music Composer</h1>
        <p className="subtitle">
          Create and play back sheet music in American notation
        </p>
        <nav className="app-nav">
          <Link to="/" className="nav-link">
            Composer
          </Link>
          <Link to="/songs" className="nav-link">
            Saved Songs
          </Link>
        </nav>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
