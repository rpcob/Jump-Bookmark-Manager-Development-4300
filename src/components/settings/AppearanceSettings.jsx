import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import Button from '../ui/Button';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiSun, FiMoon, FiImage, FiEyeOff } = FiIcons;

const AppearanceSettings = () => {
  const {
    isDark,
    toggleTheme,
    backgroundImage,
    setBackgroundImage,
    transparentCollections,
    setTransparentCollections,
    iconSize,
    setIconSize,
  } = useTheme();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBackgroundImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeBackground = () => {
    setBackgroundImage('');
  };

  const iconSizes = [
    { value: 'small', label: 'Small', description: 'Compact icons for minimal design' },
    { value: 'medium', label: 'Medium', description: 'Standard icon size' },
    { value: 'large', label: 'Large', description: 'Larger icons for better visibility' },
    { value: 'xl', label: 'Extra Large', description: 'Maximum icon size' },
  ];

  return (
    <div className="p-6 space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Appearance Settings
        </h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Customize the look and feel of your bookmark manager
        </p>
      </div>

      <div className="space-y-6">
        {/* Theme Selection */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Theme
          </h3>
          <div className="flex space-x-4">
            <Button
              onClick={() => !isDark && toggleTheme()}
              variant={!isDark ? 'primary' : 'secondary'}
              className="flex-1"
            >
              <SafeIcon icon={FiSun} className="w-5 h-5 mr-2" />
              Light Mode
            </Button>
            <Button
              onClick={() => isDark && toggleTheme()}
              variant={isDark ? 'primary' : 'secondary'}
              className="flex-1"
            >
              <SafeIcon icon={FiMoon} className="w-5 h-5 mr-2" />
              Dark Mode
            </Button>
          </div>
        </div>

        {/* Icon Size Selection */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Icon Size
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {iconSizes.map((size) => (
              <div
                key={size.value}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  iconSize === size.value
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
                onClick={() => setIconSize(size.value)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {size.label}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div
                      className={`bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center ${
                        size.value === 'small' ? 'w-6 h-6' :
                        size.value === 'medium' ? 'w-8 h-8' :
                        size.value === 'large' ? 'w-10 h-10' :
                        'w-12 h-12'
                      }`}
                    >
                      <SafeIcon 
                        icon={FiImage} 
                        className={`text-gray-500 ${
                          size.value === 'small' ? 'w-3 h-3' :
                          size.value === 'medium' ? 'w-4 h-4' :
                          size.value === 'large' ? 'w-5 h-5' :
                          'w-6 h-6'
                        }`} 
                      />
                    </div>
                    {iconSize === size.value && (
                      <div className="w-4 h-4 bg-primary-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {size.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Background Image */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Background Image
          </h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Button variant="secondary" className="flex-1">
                <label className="flex items-center justify-center cursor-pointer">
                  <SafeIcon icon={FiImage} className="w-5 h-5 mr-2" />
                  Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              </Button>
              <Button
                variant="secondary"
                onClick={removeBackground}
                disabled={!backgroundImage}
                className="flex-1"
              >
                <SafeIcon icon={FiEyeOff} className="w-5 h-5 mr-2" />
                Remove Background
              </Button>
            </div>
            {backgroundImage && (
              <div className="relative aspect-video rounded-lg overflow-hidden">
                <img
                  src={backgroundImage}
                  alt="Background Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>

        {/* Collection Appearance */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Collection Appearance
          </h3>
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">
                Transparent Collections
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Make collections semi-transparent when a background image is set
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={transparentCollections}
                onChange={(e) => setTransparentCollections(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppearanceSettings;