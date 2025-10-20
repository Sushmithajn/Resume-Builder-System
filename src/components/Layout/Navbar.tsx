import { useAuth } from '../../contexts/AuthContext';
import { LogOut, FileText, User, Link as LinkIcon } from 'lucide-react';

interface NavbarProps {
  currentView: 'dashboard' | 'resume' | 'profile';
  onViewChange: (view: 'dashboard' | 'resume' | 'profile') => void;
}

export function Navbar({ currentView, onViewChange }: NavbarProps) {
  const { signOut } = useAuth();

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white text-lg font-bold">R</span>
              </div>
              <span className="text-xl font-bold text-slate-900">Resume System</span>
            </div>

            <div className="hidden sm:flex gap-1">
              <button
                onClick={() => onViewChange('dashboard')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  currentView === 'dashboard'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Dashboard
                </span>
              </button>
              <button
                onClick={() => onViewChange('resume')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  currentView === 'resume'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="flex items-center gap-2">
                  <LinkIcon className="w-4 h-4" />
                  Resume Preview
                </span>
              </button>
              <button
                onClick={() => onViewChange('profile')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  currentView === 'profile'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Profile
                </span>
              </button>
            </div>
          </div>

          <button
            onClick={() => signOut()}
            className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
