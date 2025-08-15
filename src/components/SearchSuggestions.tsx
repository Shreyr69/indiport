import { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useProducts } from '@/hooks/useProducts';

interface SearchSuggestionsProps {
  onSearch: (term: string) => void;
  onCategorySelect: (category: string) => void;
  value: string;
  onChange: (value: string) => void;
}

const SearchSuggestions = ({ onSearch, onCategorySelect, value, onChange }: SearchSuggestionsProps) => {
  const { products, categories } = useProducts();
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<{ type: 'product' | 'category'; item: any }[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (value.length < 2) {
      setSuggestions([]);
      return;
    }

    const productSuggestions = products
      .filter(product => 
        product.title.toLowerCase().includes(value.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(value.toLowerCase()))
      )
      .slice(0, 5)
      .map(product => ({ type: 'product' as const, item: product }));

    const categorySuggestions = categories
      .filter(category => 
        category.name.toLowerCase().includes(value.toLowerCase())
      )
      .slice(0, 3)
      .map(category => ({ type: 'category' as const, item: category }));

    setSuggestions([...categorySuggestions, ...productSuggestions]);
  }, [value, products, categories]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setIsOpen(newValue.length >= 2);
  };

  const handleSuggestionClick = (suggestion: { type: 'product' | 'category'; item: any }) => {
    if (suggestion.type === 'product') {
      onChange(suggestion.item.title);
      onSearch(suggestion.item.title);
    } else {
      onCategorySelect(suggestion.item.name);
      onChange('');
    }
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative flex-1 max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search products or categories..."
          value={value}
          onChange={handleInputChange}
          onFocus={() => value.length >= 2 && setIsOpen(true)}
          className="pl-10"
        />
      </div>
      
      {isOpen && suggestions.length > 0 && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 p-2 shadow-lg">
          <div className="space-y-1">
            {suggestions.map((suggestion, index) => (
              <button
                key={`${suggestion.type}-${suggestion.item.id}`}
                className="w-full text-left p-2 hover:bg-muted rounded-md transition-colors flex items-center gap-3"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion.type === 'category' ? (
                  <>
                    <Badge variant="outline" className="text-xs">Category</Badge>
                    <span className="text-sm">{suggestion.item.name}</span>
                  </>
                ) : (
                  <>
                    <img
                      src={suggestion.item.image_url || '/placeholder.svg'}
                      alt={suggestion.item.title}
                      className="w-8 h-8 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium line-clamp-1">{suggestion.item.title}</p>
                      <p className="text-xs text-muted-foreground">${suggestion.item.price}</p>
                    </div>
                  </>
                )}
              </button>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default SearchSuggestions;