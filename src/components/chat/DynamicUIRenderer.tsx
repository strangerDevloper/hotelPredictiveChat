import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Plus, Minus } from 'lucide-react';
import { UIComponent } from '../../pages/ChatScreen';

interface DynamicUIRendererProps {
  components: UIComponent[];
  onSelect: (componentType: string, value: any) => void;
}

const DynamicUIRenderer = ({ components, onSelect }: DynamicUIRendererProps) => {
  const [quantities, setQuantities] = useState<{[key: string]: number}>({});
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);

  const updateQuantity = (itemId: string, delta: number) => {
    const newQuantity = Math.max(0, (quantities[itemId] || 0) + delta);
    setQuantities(prev => ({ ...prev, [itemId]: newQuantity }));
  };

  const handleAddItems = () => {
    const selectedItems = Object.entries(quantities)
      .filter(([_, quantity]) => quantity > 0)
      .map(([itemId, quantity]) => ({ item: itemId, quantity }));
    
    if (selectedItems.length > 0) {
      onSelect('quantity-selector', selectedItems);
    }
  };

  const renderComponent = (component: UIComponent, index: number) => {
    switch (component.type) {
      case 'service-cards':
        return (
          <div key={index} className="mb-4">
            <h4 className="font-medium mb-3">{component.data.title}</h4>
            <div className="grid grid-cols-2 gap-2">
              {component.data.cards.map((card: any) => (
                <Button
                  key={card.id}
                  variant="outline"
                  className="h-auto p-3 flex flex-col items-start text-left hover:bg-blue-50 hover:border-blue-300"
                  onClick={() => onSelect(component.type, card)}
                >
                  <div className="text-lg mb-1">{card.image}</div>
                  <div className="font-medium text-sm mb-1">{card.title}</div>
                  <div className="text-xs text-gray-500 break-words w-full">{card.description}</div>
                </Button>
              ))}
            </div>
          </div>
        );

      case 'food-menu-cards':
        return (
          <div key={index} className="mb-4">
            <h4 className="font-medium mb-3">{component.data.title}</h4>
            <div className="grid grid-cols-1 gap-3">
              {component.data.cards.map((card: any) => (
                <div key={card.id} className="flex items-center p-4 border rounded-lg">
                  <div className="text-2xl mr-3">{card.image}</div>
                  <div className="flex-1">
                    <div className="font-medium text-sm mb-1">{card.title}</div>
                    <div className="text-xs text-gray-500 mb-1">{card.description}</div>
                    <div className="text-sm font-semibold text-green-600">${card.price}</div>
                  </div>
                  <div className="flex items-center space-x-2 ml-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(card.id, -1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center font-medium">
                      {quantities[card.id] || 0}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(card.id, 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Button
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                const selectedItems = component.data.cards
                  .filter((card: any) => quantities[card.id] > 0)
                  .map((card: any) => ({ ...card, quantity: quantities[card.id] }));
                if (selectedItems.length > 0) {
                  onSelect('food-menu-cards', selectedItems);
                }
              }}
              disabled={Object.values(quantities).every(q => q === 0)}
            >
              Add to Order
            </Button>
          </div>
        );

      case 'quantity-selector':
        return (
          <div key={index} className="mb-4">
            <h4 className="font-medium mb-3">{component.data.title}</h4>
            <div className="space-y-3">
              {component.data.items.map((item: any) => (
                <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{item.label}</div>
                    {item.price > 0 && (
                      <div className="text-xs text-gray-500">${item.price} each</div>
                    )}
                  </div>
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.id, -1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center font-medium">
                      {quantities[item.id] || 0}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.id, 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button 
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
                onClick={handleAddItems}
                disabled={Object.values(quantities).every(q => q === 0)}
              >
                Add Selected Items
              </Button>
            </div>
          </div>
        );

      case 'radio-group':
        if (component.data.title === 'Select Time Slot') {
          return (
            <div key={index} className="mb-4">
              <h4 className="font-medium mb-3">{component.data.title}</h4>
              <div className="grid grid-cols-3 gap-3">
                {component.data.options.map((option: any) => (
                  <button
                    key={option.value}
                    className={
                      'rounded-full px-4 py-2 text-sm font-medium border transition ' +
                      (selectedTimeSlot === option.value
                        ? 'bg-blue-700 text-white border-blue-700 shadow'
                        : 'bg-white text-gray-800 border-gray-300 hover:bg-blue-50')
                    }
                    onClick={() => {
                      setSelectedTimeSlot(option.value);
                      onSelect(component.type, option.value);
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          );
        }
        return (
          <div key={index} className="mb-4">
            <h4 className="font-medium mb-3">{component.data.title}</h4>
            <RadioGroup onValueChange={(value) => onSelect(component.type, value)}>
              {component.data.options.map((option: any) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <label htmlFor={option.value} className="text-sm cursor-pointer">
                    {option.label}
                  </label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      case 'checkbox-group':
        return (
          <div key={index} className="mb-4">
            <h4 className="font-medium mb-3">{component.data.title}</h4>
            <div className="space-y-2">
              {component.data.options.map((option: any) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox 
                    id={option.value}
                    onCheckedChange={(checked) => onSelect(component.type, { ...option, checked })}
                  />
                  <label htmlFor={option.value} className="text-sm cursor-pointer">
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        );

      case 'slider':
        return (
          <div key={index} className="mb-4">
            <h4 className="font-medium mb-3">{component.data.title}</h4>
            <div className="flex items-center space-x-4">
              <span className="text-sm">1</span>
              <input
                type="range"
                min={component.data.min}
                max={component.data.max}
                defaultValue={component.data.default}
                className="flex-1"
                onChange={(e) => onSelect(component.type, e.target.value)}
              />
              <span className="text-sm">{component.data.max}</span>
            </div>
          </div>
        );

      case 'time-picker':
        return (
          <div key={index} className="mb-4">
            <h4 className="font-medium mb-3">{component.data.title}</h4>
            <Input
              type="time"
              defaultValue={component.data.defaultTime}
              onChange={(e) => onSelect(component.type, e.target.value)}
            />
          </div>
        );

      case 'date-picker':
        return (
          <div key={index} className="mb-4">
            <h4 className="font-medium mb-3">{component.data.title}</h4>
            <Input
              type="date"
              defaultValue={component.data.defaultDate?.toISOString().split('T')[0]}
              onChange={(e) => onSelect(component.type, e.target.value)}
            />
          </div>
        );

      case 'confirmation-card':
        return (
          <div key={index} className="mb-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-800 mb-2">{component.data.title}</h4>
              <p className="text-sm text-green-700 mb-2">{component.data.summary}</p>
              <div className="flex justify-between text-xs text-green-600 mb-3">
                <span>Est. Time: {component.data.estimatedTime}</span>
                <span>Cost: {component.data.cost}</span>
              </div>
              <Button 
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={() => onSelect(component.type, 'confirmed')}
              >
                Confirm Request
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      {components.map((component, index) => renderComponent(component, index))}
    </div>
  );
};

export { DynamicUIRenderer };
