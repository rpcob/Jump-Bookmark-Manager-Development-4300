import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { useTheme } from '../../contexts/ThemeContext';
import SearchBar from './SearchBar';
import UserMenu from './UserMenu';
import SpaceSelector from './SpaceSelector';
import ThemeToggle from './ThemeToggle';
import Button from '../ui/Button';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiArrowUp, FiPlus, FiFilter } = FiIcons;

const Header = ({ onCreateCollection }) => {
  const { user } = useAuth();
  const { getCurrentSpace } = useData();
  const [showFilters, setShowFilters] = useState(false);

  const currentSpace = getCurrentSpace();

  return (
    <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center"
            >
              <SafeIcon icon={FiArrowUp} className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Jump
              </h1>
              {currentSpace && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {currentSpace.name}
                </p>
              )}
            </div>
          </div>

          {/* Center - Search and Controls */}
          <div className="flex-1 max-w-2xl mx-8">
            <div className="flex items-center space-x-3">
              <SearchBar />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className={showFilters ? 'bg-primary-100 text-primary-600' : ''}
              >
                <SafeIcon icon={FiFilter} className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Right - Actions and User */}
          <div className="flex items-center space-x-3">
            <SpaceSelector />
            
            <Button
              variant="primary"
              size="sm"
              onClick={onCreateCollection}
              className="hidden md:flex"
            >
              <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
              Collection
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={onCreateCollection}
              className="md:hidden"
            >
              <SafeIcon icon={FiPlus} className="w-4 h-4" />
            </Button>

            <ThemeToggle />
            <UserMenu user={user} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;