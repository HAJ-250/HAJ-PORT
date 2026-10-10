import { Suspense, useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar.jsx';
import { Footer } from '@/components/layout/Footer.jsx';
import { SkipLink } from '@/components/layout/SkipLink.jsx';
import { CustomCursor } from '@/components/effects/CustomCursor.jsx';
import { Home } from '@/pages/Home.jsx';
import { ProjectPage } from '@/pages/ProjectPage.jsx';
import { BlogIndex } from '@/pages/BlogIndex.jsx';
import { BlogPost } from '@/pages/BlogPost.jsx';
import { NotFound } from '@/pages/NotFound.jsx';
import { LoadingScreen } from '@/components/ui/LoadingScreen.jsx';

function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        el.scrollIntoView({ behavior: 'auto', block: 'start' });
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname, hash]);

  return null;
}

export default function App() {
  const [loadingComplete, setLoadingComplete] = useState(false);

  if (!loadingComplete) {
    return <LoadingScreen onComplete={() => setLoadingComplete(true)} />;
  }

  return (
    <>
      <SkipLink />
      <CustomCursor />
      <ScrollManager />
      <div className="flex min-h-svh flex-col">
        <Navbar />
        <main id="main-content" className="flex-1">
          <Suspense fallback={null}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/projects/:slug" element={<ProjectPage />} />
              <Route path="/blog" element={<BlogIndex />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </>
  );
}
