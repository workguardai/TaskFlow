import { useState } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Tasks } from './pages/Tasks';
import { Users } from './pages/Users';
import { Landing } from './pages/Landing';
import { Toaster } from './components/ui/Toaster';


function App() {
  const [currentPage, setCurrentPage] = useState('landing');

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <Landing onNavigate={setCurrentPage} />;
      case 'users':
        return <Users />;
      case 'tasks':
        return <Tasks />;
      default:
        return <Landing onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar currentPage={currentPage} onPageChange={setCurrentPage} />
      <main className="container mx-auto py-8 flex-grow">
        {renderPage()}
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

export default App;
