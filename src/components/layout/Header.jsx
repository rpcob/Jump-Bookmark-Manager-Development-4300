import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import SearchBar from './SearchBar';
import UserMenu from './UserMenu';
import SpaceSelector from './SpaceSelector';
import Button from '../ui/Button';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiArrowUp, FiPlus, FiFilter, FiMenu } = FiIcons;

const Header = ({ onCreateCollection }) => {
  const { user } = useAuth();
  const { getCurrentSpace } = useData();
  const [showFilters, setShowFilters] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-[100px] sm:max-w-full">
                  {currentSpace.name}
                </p>
              )}
            </div>
          </div>

          {/* Center - Search and Controls (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="flex items-center space-x-3 w-full">
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
            <div className="hidden md:block">
              <SpaceSelector />
            </div>
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
            <UserMenu user={user} />
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <SafeIcon icon={FiMenu} className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Mobile Search Bar & SpaceSelector */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden mt-3 space-y-3 pb-2"
          >
            <SearchBar />
            <SpaceSelector fullWidth={true} />
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default Header;