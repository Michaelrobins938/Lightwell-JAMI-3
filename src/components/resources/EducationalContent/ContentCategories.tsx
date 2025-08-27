import React from 'react';
import { 
  contentCategories, 
  contentTypes, 
  difficultyLevels, 
  dsm5Categories, 
  researchCategories 
} from '../../../data/comprehensiveEducationalContent';

interface ContentCategoriesProps {
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  selectedTypes: string[];
  setSelectedTypes: (types: string[]) => void;
  selectedDifficulties: string[];
  setSelectedDifficulties: (difficulties: string[]) => void;
}

const ContentCategories: React.FC<ContentCategoriesProps> = ({
  selectedCategories,
  setSelectedCategories,
  selectedTypes,
  setSelectedTypes,
  selectedDifficulties,
  setSelectedDifficulties,
}) => {
  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, category]);
    } else {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    }
  };

  const handleTypeChange = (type: string, checked: boolean) => {
    if (checked) {
      setSelectedTypes([...selectedTypes, type]);
    } else {
      setSelectedTypes(selectedTypes.filter(t => t !== type));
    }
  };

  const handleDifficultyChange = (difficulty: string, checked: boolean) => {
    if (checked) {
      setSelectedDifficulties([...selectedDifficulties, difficulty]);
    } else {
      setSelectedDifficulties(selectedDifficulties.filter(d => d !== difficulty));
    }
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedTypes([]);
    setSelectedDifficulties([]);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Categories Filter */}
        <div>
          <h3 className="font-semibold mb-3 text-luna-700 dark:text-luna-300">Categories</h3>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {contentCategories.map(category => (
              <label key={category} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={(e) => handleCategoryChange(category, e.target.checked)}
                  className="rounded border-luna-300 text-luna-500 focus:ring-luna-500"
                />
                <span className="text-sm text-luna-600 dark:text-luna-400">{category}</span>
              </label>
            ))}
          </div>
        </div>

        {/* DSM-5 Categories Filter */}
        <div>
          <h3 className="font-semibold mb-3 text-luna-700 dark:text-luna-300">DSM-5 Categories</h3>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {dsm5Categories.slice(0, 10).map(category => (
              <label key={category} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={(e) => handleCategoryChange(category, e.target.checked)}
                  className="rounded border-luna-300 text-luna-500 focus:ring-luna-500"
                />
                <span className="text-sm text-luna-600 dark:text-luna-400">{category}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Research Categories Filter */}
        <div>
          <h3 className="font-semibold mb-3 text-luna-700 dark:text-luna-300">Research Areas</h3>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {researchCategories.map(category => (
              <label key={category} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={(e) => handleCategoryChange(category, e.target.checked)}
                  className="rounded border-luna-300 text-luna-500 focus:ring-luna-500"
                />
                <span className="text-sm text-luna-600 dark:text-luna-400">{category}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Content Types Filter */}
        <div>
          <h3 className="font-semibold mb-3 text-luna-700 dark:text-luna-300">Content Types</h3>
          <div className="space-y-2">
            {contentTypes.map(type => (
              <label key={type} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedTypes.includes(type)}
                  onChange={(e) => handleTypeChange(type, e.target.checked)}
                  className="rounded border-luna-300 text-luna-500 focus:ring-luna-500"
                />
                <span className="text-sm text-luna-600 dark:text-luna-400 capitalize">{type.replace('-', ' ')}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Difficulty Filter */}
        <div>
          <h3 className="font-semibold mb-3 text-luna-700 dark:text-luna-300">Difficulty</h3>
          <div className="space-y-2">
            {difficultyLevels.map(difficulty => (
              <label key={difficulty} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedDifficulties.includes(difficulty)}
                  onChange={(e) => handleDifficultyChange(difficulty, e.target.checked)}
                  className="rounded border-luna-300 text-luna-500 focus:ring-luna-500"
                />
                <span className="text-sm text-luna-600 dark:text-luna-400 capitalize">{difficulty}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Clear Filters Button */}
      <div className="flex justify-end">
        <button
          onClick={clearAllFilters}
          className="px-4 py-2 text-sm text-luna-600 dark:text-luna-400 hover:text-luna-800 dark:hover:text-luna-200 transition duration-300"
        >
          Clear all filters
        </button>
      </div>
    </div>
  );
};

export default ContentCategories; 