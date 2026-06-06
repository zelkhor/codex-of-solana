import { useRef, useState } from 'react';
import { NavLink } from 'react-router';

import { Moon, Sun } from 'lucide-react';

import { useClickOutside } from '@/shared/hooks/useClickOutside.ts';
import { useTheme } from '@/shared/hooks/useTheme.ts';

const USER = { name: 'John Doe', initials: 'JD' };

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `text-sm px-3 py-1.5 rounded-md transition-colors ${isActive ? 'bg-accent font-medium' : 'text-muted-foreground hover:bg-accent/50'}`;

export const AppHeader = () => {
  const { theme, toggle } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useClickOutside([menuRef], () => setMenuOpen(false));

  return (
    <header className="px-4 sm:px-6 py-2 shrink-0 bg-background/80">
      {/* Main row: always visible */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 sm:gap-6">
          <span className="font-semibold text-sm whitespace-nowrap">Codex of Solana</span>
          {/* Nav: desktop only in this row */}
          <nav className="hidden sm:flex items-center gap-1">
            <NavLink to="/" end className={navLinkClass}>
              Cards
            </NavLink>
            <NavLink to="/collection" className={navLinkClass}>
              Collection
            </NavLink>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="p-2 rounded-md hover:bg-accent transition-colors"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <div ref={menuRef} className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-accent transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold shrink-0">
                {USER.initials}
              </div>
              <span className="hidden sm:inline text-sm font-medium">{USER.name}</span>
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-1 w-40 rounded-md border bg-popover shadow-md z-50">
                <button
                  onClick={() => setMenuOpen(false)}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-accent transition-colors rounded-md"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Nav row: mobile only */}
      <nav className="flex sm:hidden items-center gap-1 mt-1">
        <NavLink to="/" end className={navLinkClass}>
          Cards
        </NavLink>
        <NavLink to="/collection" className={navLinkClass}>
          Collection
        </NavLink>
      </nav>
    </header>
  );
};
