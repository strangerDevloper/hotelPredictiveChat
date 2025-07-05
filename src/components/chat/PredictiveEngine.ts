interface PredictionResult {
  flowId: string;
  followUpQuestion: string;
  predictiveText: string;
  uiComponents: any[];
}

interface FlowStep {
  followUpQuestion: string;
  predictiveText: string;
  uiComponents: any[];
}

export class PredictiveEngine {
  private serviceFlows = {
    // Food Service Flow
    'food-service': {
      triggers: ['food', 'eat', 'hungry', 'order food', 'meal', 'restaurant', 'dining'],
      steps: [
        {
          followUpQuestion: 'I need food service...what type of cuisine do you prefer?',
          predictiveText: 'e.g., vegetarian, non-vegetarian, specific dietary needs',
          uiComponents: [{
            type: 'service-cards',
            data: {
              title: 'Food Type',
              cards: [
                { id: 'veg', title: 'Vegetarian', image: '🥗', description: 'Plant-based dishes and meals' },
                { id: 'non-veg', title: 'Non-Vegetarian', image: '🍖', description: 'Meat, fish, and poultry dishes' }
              ]
            }
          }]
        },
        {
          followUpQuestion: 'I need food service for [food-type]...what meal are you looking for?',
          predictiveText: 'e.g., breakfast, lunch, dinner, snacks',
          uiComponents: [{
            type: 'service-cards',
            data: {
              title: 'Meal Type',
              cards: [
                { id: 'breakfast', title: 'Breakfast', image: '🍳', description: 'Morning meals and beverages' },
                { id: 'lunch', title: 'Lunch', image: '🍽️', description: 'Midday meals and dishes' },
                { id: 'dinner', title: 'Dinner', image: '🍷', description: 'Evening meals and fine dining' },
                { id: 'snacks', title: 'Snacks', image: '🍿', description: 'Light bites and refreshments' }
              ]
            }
          }]
        },
        {
          followUpQuestion: 'I need [food-type] [meal-type]...what would you like to order?',
          predictiveText: 'e.g., pasta, sandwiches, salads, main course',
          uiComponents: [{
            type: 'food-menu-cards',
            data: {
              title: 'Menu Items',
              cards: [] // Will be populated dynamically based on food type and meal
            }
          }]
        },
        {
          followUpQuestion: 'I need [full-food-description]...how many portions and any add-ons?',
          predictiveText: 'e.g., drinks, desserts, extra portions',
          uiComponents: [{
            type: 'quantity-selector',
            data: {
              title: 'Quantity',
              items: [
                { id: 'portions', label: 'Portions', price: 0 }
              ]
            }
          }]
        },
        {
          followUpQuestion: 'I need [complete-order]...when would you like it delivered?',
          predictiveText: 'e.g., ASAP (30-45 min), specific time',
          uiComponents: [{
            type: 'radio-group',
            data: {
              title: 'Delivery Time',
              options: [
                { value: 'asap', label: 'ASAP (30-45 minutes)' },
                { value: '1-hour', label: 'In 1 hour' },
                { value: '2-hours', label: 'In 2 hours' },
                { value: 'specific-time', label: 'Specific time' }
              ]
            }
          }]
        }
      ]
    },

    // Laundry Service Flow
    'laundry-service': {
      triggers: ['laundry', 'pressing', 'dry clean', 'wash clothes', 'clothes'],
      steps: [
        {
          followUpQuestion: 'When do you need it back?',
          predictiveText: 'e.g., same day, next day, standard delivery',
          uiComponents: [{
            type: 'radio-group',
            data: {
              title: 'Turnaround Time',
              options: [
                { value: 'same-day', label: 'Same Day (+$10)' },
                { value: 'next-day', label: 'Next Day' },
                { value: '2-3-days', label: '2-3 Days (Standard)' }
              ]
            }
          }]
        },
        {
          followUpQuestion: 'How many items do you have?',
          predictiveText: 'Select quantities for each item type',
          uiComponents: [{
            type: 'quantity-selector',
            data: {
              title: 'Number of Items',
              items: [
                { id: 'shirts', label: 'Shirts', price: 5 },
                { id: 'pants', label: 'Pants', price: 7 },
                { id: 'dresses', label: 'Dresses', price: 12 },
                { id: 'suits', label: 'Suits', price: 20 }
              ]
            }
          }]
        }
      ]
    },

    // Breakfast Menu Flow
    'breakfast-menu': {
      triggers: ['breakfast', 'morning food', 'what\'s for breakfast'],
      steps: [
        {
          followUpQuestion: 'Breakfast—what type would you prefer?',
          predictiveText: 'e.g., continental, american, healthy options',
          uiComponents: [{
            type: 'service-cards',
            data: {
              title: 'Breakfast Options',
              cards: [
                { id: 'continental', title: 'Continental Breakfast', image: '🥐', description: 'Pastries, fruits, coffee' },
                { id: 'american', title: 'American Breakfast', image: '🍳', description: 'Eggs, bacon, toast' },
                { id: 'healthy', title: 'Healthy Options', image: '🥗', description: 'Yogurt, granola, fresh fruits' }
              ]
            }
          }]
        },
        {
          followUpQuestion: 'How many people?',
          predictiveText: 'Select number of guests',
          uiComponents: [{
            type: 'slider',
            data: {
              title: 'Number of People',
              min: 1,
              max: 6,
              default: 2
            }
          }]
        },
        {
          followUpQuestion: 'What time would you like it delivered?',
          predictiveText: 'e.g., 8:00 AM, 9:30 AM',
          uiComponents: [{
            type: 'time-picker',
            data: {
              title: 'Delivery Time',
              defaultTime: '08:00'
            }
          }]
        }
      ]
    },

    // Room Cleaning Flow
    'room-cleaning': {
      triggers: ['clean', 'housekeeping', 'room service', 'tidy'],
      steps: [
        {
          followUpQuestion: 'Room cleaning—what services do you need?',
          predictiveText: 'e.g., make beds, clean bathroom, vacuum',
          uiComponents: [{
            type: 'checkbox-group',
            data: {
              title: 'Cleaning Services',
              options: [
                { value: 'beds', label: 'Make beds and change linens' },
                { value: 'bathroom', label: 'Clean bathroom' },
                { value: 'vacuum', label: 'Vacuum carpets' },
                { value: 'dust', label: 'Dust furniture' },
                { value: 'trash', label: 'Empty trash bins' }
              ]
            }
          }]
        },
        {
          followUpQuestion: 'When would you like your room cleaned?',
          predictiveText: 'e.g., now, this afternoon, tomorrow morning',
          uiComponents: [{
            type: 'time-picker',
            data: {
              title: 'Preferred Cleaning Time',
              defaultTime: '14:00'
            }
          }]
        }
      ]
    }
  };

  private getFoodMenuItems(foodType: string, mealType: string) {
    const vegItems = {
      breakfast: [
        { id: 'pancakes', title: 'Pancakes', image: '🥞', description: 'Fluffy pancakes with syrup', price: 12 },
        { id: 'fruit-bowl', title: 'Fresh Fruit Bowl', image: '🍓', description: 'Seasonal fresh fruits', price: 8 },
        { id: 'veggie-omelet', title: 'Veggie Omelet', image: '🍳', description: 'Cheese and vegetable omelet', price: 10 }
      ],
      lunch: [
        { id: 'veggie-pasta', title: 'Veggie Pasta', image: '🍝', description: 'Pasta with fresh vegetables', price: 15 },
        { id: 'garden-salad', title: 'Garden Salad', image: '🥗', description: 'Mixed greens with dressing', price: 12 },
        { id: 'veggie-sandwich', title: 'Veggie Sandwich', image: '🥪', description: 'Grilled vegetable sandwich', price: 10 }
      ],
      dinner: [
        { id: 'veggie-pizza', title: 'Veggie Pizza', image: '🍕', description: 'Pizza with fresh vegetables', price: 18 },
        { id: 'pasta-primavera', title: 'Pasta Primavera', image: '🍝', description: 'Pasta with seasonal vegetables', price: 16 },
        { id: 'veggie-burger', title: 'Veggie Burger', image: '🍔', description: 'Plant-based burger with fries', price: 14 }
      ],
      snacks: [
        { id: 'fruit-smoothie', title: 'Fruit Smoothie', image: '🥤', description: 'Blended fresh fruit smoothie', price: 6 },
        { id: 'veggie-wrap', title: 'Veggie Wrap', image: '🌯', description: 'Fresh vegetable wrap', price: 8 },
        { id: 'nachos', title: 'Nachos', image: '🧇', description: 'Tortilla chips with cheese', price: 7 }
      ]
    };

    const nonVegItems = {
      breakfast: [
        { id: 'bacon-eggs', title: 'Bacon & Eggs', image: '🥓', description: 'Crispy bacon with eggs', price: 14 },
        { id: 'chicken-sandwich', title: 'Chicken Sandwich', image: '🥪', description: 'Grilled chicken sandwich', price: 12 },
        { id: 'meat-omelet', title: 'Meat Omelet', image: '🍳', description: 'Omelet with ham and cheese', price: 13 }
      ],
      lunch: [
        { id: 'chicken-pasta', title: 'Chicken Pasta', image: '🍝', description: 'Pasta with grilled chicken', price: 18 },
        { id: 'caesar-salad', title: 'Caesar Salad', image: '🥗', description: 'Caesar salad with chicken', price: 15 },
        { id: 'club-sandwich', title: 'Club Sandwich', image: '🥪', description: 'Triple-layer club sandwich', price: 16 }
      ],
      dinner: [
        { id: 'grilled-chicken', title: 'Grilled Chicken', image: '🍗', description: 'Herb-crusted grilled chicken', price: 22 },
        { id: 'fish-chips', title: 'Fish & Chips', image: '🍟', description: 'Beer-battered fish with chips', price: 20 },
        { id: 'beef-burger', title: 'Beef Burger', image: '🍔', description: 'Angus beef burger with fries', price: 18 }
      ],
      snacks: [
        { id: 'chicken-wings', title: 'Chicken Wings', image: '🍗', description: 'Spicy buffalo wings', price: 12 },
        { id: 'mini-burgers', title: 'Mini Burgers', image: '🍔', description: 'Slider burgers (3 pieces)', price: 10 },
        { id: 'meat-wrap', title: 'Meat Wrap', image: '🌯', description: 'Chicken or beef wrap', price: 11 }
      ]
    };

    if (foodType === 'veg') {
      return vegItems[mealType as keyof typeof vegItems] || [];
    } else {
      return nonVegItems[mealType as keyof typeof nonVegItems] || [];
    }
  }

  predict(input: string): PredictionResult | null {

    console.log('Predicting input:', input);
    const lowercaseInput = input.toLowerCase().trim();
    
    // Handle initial ambiguous queries
    if (lowercaseInput === 'i need' || lowercaseInput === 'i want' || lowercaseInput === 'need') {
      return {
        flowId: 'general-inquiry',
        followUpQuestion: 'I need... What service are you looking for?',
        predictiveText: 'e.g., laundry, food service, room cleaning',
        uiComponents: [{
          type: 'service-cards',
          data: {
            title: 'Popular Services',
            cards: [
              { id: 'laundry', title: 'Laundry Service', image: '👕', description: 'Wash, fold, and dry cleaning' },
              { id: 'food', title: 'Food Service', image: '🍽️', description: 'Order meals and beverages' },
              { id: 'room-service', title: 'Room Service', image: '🛎️', description: 'Room cleaning and maintenance' },
              { id: 'concierge', title: 'Concierge', image: '🗝️', description: 'General assistance and information' }
            ]
          }
        }]
      };
    }

    // Handle direct food type inputs (vegetarian, non-vegetarian, veg, non-veg)
    if (lowercaseInput.includes('vegetarian') || lowercaseInput.includes('veg') || 
        lowercaseInput.includes('non-vegetarian') || lowercaseInput.includes('non-veg')) {
      return {
        flowId: 'food-service',
        followUpQuestion: 'I need food service...what meal are you looking for?',
        predictiveText: 'e.g., breakfast, lunch, dinner, snacks',
        uiComponents: [{
          type: 'service-cards',
          data: {
            title: 'Meal Type',
            cards: [
              { id: 'breakfast', title: 'Breakfast', image: '🍳', description: 'Morning meals and beverages' },
              { id: 'lunch', title: 'Lunch', image: '🍽️', description: 'Midday meals and dishes' },
              { id: 'dinner', title: 'Dinner', image: '🍷', description: 'Evening meals and fine dining' },
              { id: 'snacks', title: 'Snacks', image: '🍿', description: 'Light bites and refreshments' }
            ]
          }
        }]
      };
    }

    // Handle meal type inputs directly
    if (lowercaseInput.includes('breakfast') || lowercaseInput.includes('lunch') || 
        lowercaseInput.includes('dinner') || lowercaseInput.includes('snacks')) {
      return {
        flowId: 'food-service',
        followUpQuestion: 'What type of cuisine do you prefer?',
        predictiveText: 'e.g., vegetarian, non-vegetarian',
        uiComponents: [{
          type: 'service-cards',
          data: {
            title: 'Food Type',
            cards: [
              { id: 'veg', title: 'Vegetarian', image: '🥗', description: 'Plant-based dishes and meals' },
              { id: 'non-veg', title: 'Non-Vegetarian', image: '🍖', description: 'Meat, fish, and poultry dishes' }
            ]
          }
        }]
      };
    }

    // Handle partial clothing queries
    if (lowercaseInput.includes('shirts') || lowercaseInput.includes('clothes') || lowercaseInput.includes('my clothes')) {
      return {
        flowId: 'laundry-service',
        followUpQuestion: 'You need your clothes... What service would you like?',
        predictiveText: 'e.g., wash & press, dry clean, express delivery',
        uiComponents: [{
          type: 'service-cards',
          data: {
            title: 'Clothing Services',
            cards: [
              { id: 'wash-fold', title: 'Wash & Fold', image: '👕', description: 'Regular washing and folding' },
              { id: 'dry-clean', title: 'Dry Cleaning', image: '🧥', description: 'Professional dry cleaning' },
              { id: 'pressing', title: 'Pressing Only', image: '👔', description: 'Iron and press clothes' }
            ]
          }
        }]
      };
    }
    
    // Handle food service triggers
    if (lowercaseInput.includes('food') || lowercaseInput.includes('eat') || 
        lowercaseInput.includes('hungry') || lowercaseInput.includes('meal') ||
        lowercaseInput.includes('restaurant') || lowercaseInput.includes('dining')) {
      return {
        flowId: 'food-service',
        followUpQuestion: 'I need food service...what type of cuisine do you prefer?',
        predictiveText: 'e.g., vegetarian, non-vegetarian, specific dietary needs',
        uiComponents: [{
          type: 'service-cards',
          data: {
            title: 'Food Type',
            cards: [
              { id: 'veg', title: 'Vegetarian', image: '🥗', description: 'Plant-based dishes and meals' },
              { id: 'non-veg', title: 'Non-Vegetarian', image: '🍖', description: 'Meat, fish, and poultry dishes' }
            ]
          }
        }]
      };
    }
    
    // Handle laundry service triggers
    if (lowercaseInput.includes('laundry') || lowercaseInput.includes('pressing') || 
        lowercaseInput.includes('dry clean') || lowercaseInput.includes('wash clothes')) {
      return {
        flowId: 'laundry-service',
        followUpQuestion: 'Laundry—what assistance do you need with your clothes?',
        predictiveText: 'e.g., wash & fold, stain removal, urgent delivery',
        uiComponents: [{
          type: 'service-cards',
          data: {
            title: 'Laundry Services',
            cards: [
              { id: 'wash-fold', title: 'Wash & Fold', image: '👕', description: 'Regular washing and folding' },
              { id: 'dry-clean', title: 'Dry Cleaning', image: '🧥', description: 'Professional dry cleaning' },
              { id: 'pressing', title: 'Pressing Only', image: '👔', description: 'Iron and press clothes' }
            ]
          }
        }]
      };
    }

    // Handle room cleaning triggers
    if (lowercaseInput.includes('clean') || lowercaseInput.includes('housekeeping') || 
        lowercaseInput.includes('room service') || lowercaseInput.includes('tidy')) {
      return {
        flowId: 'room-cleaning',
        followUpQuestion: 'Room cleaning—what services do you need?',
        predictiveText: 'e.g., make beds, clean bathroom, vacuum',
        uiComponents: [{
          type: 'checkbox-group',
          data: {
            title: 'Cleaning Services',
            options: [
              { value: 'beds', label: 'Make beds and change linens' },
              { value: 'bathroom', label: 'Clean bathroom' },
              { value: 'vacuum', label: 'Vacuum carpets' },
              { value: 'dust', label: 'Dust furniture' },
              { value: 'trash', label: 'Empty trash bins' }
            ]
          }
        }]
      };
    }
    
    return null;
  }

  getNextStep(flowId: string, stepIndex: number, flowState: any): FlowStep | null {
    // Handle food service flow progression
    if (flowId === 'food-service') {
      console.log('Food service flow - step:', stepIndex, 'flowState:', flowState);
      
      // Step 0: If we have food type, show meal types
      if (stepIndex === 0 && flowState['service-cards']) {
        return {
          followUpQuestion: 'I need food service...what meal are you looking for?',
          predictiveText: 'e.g., breakfast, lunch, dinner, snacks',
          uiComponents: [{
            type: 'service-cards',
            data: {
              title: 'Meal Type',
              cards: [
                { id: 'breakfast', title: 'Breakfast', image: '🍳', description: 'Morning meals and beverages' },
                { id: 'lunch', title: 'Lunch', image: '🍽️', description: 'Midday meals and dishes' },
                { id: 'dinner', title: 'Dinner', image: '🍷', description: 'Evening meals and fine dining' },
                { id: 'snacks', title: 'Snacks', image: '🍿', description: 'Light bites and refreshments' }
              ]
            }
          }]
        };
      }

      // Step 1: If we have meal type, show menu items
      if (stepIndex === 1 && (flowState['meal-type'] || flowState['service-cards'])) {
        const foodType = flowState['service-cards']?.id || 'veg';
        const mealType = flowState['meal-type']?.id || flowState['service-cards']?.id;
        
        if (foodType && mealType) {
          const menuItems = this.getFoodMenuItems(foodType, mealType);
          return {
            followUpQuestion: 'What would you like to order?',
            predictiveText: 'Select from our menu items',
            uiComponents: [{
              type: 'food-menu-cards',
              data: {
                title: 'Menu Items',
                cards: menuItems
              }
            }]
          };
        }
      }

      // Step 2: If we have menu selection, show quantity
      if (stepIndex === 2 && flowState['food-menu-cards']) {
        return {
          followUpQuestion: 'How many portions would you like?',
          predictiveText: 'Select quantity and any add-ons',
          uiComponents: [{
            type: 'quantity-selector',
            data: {
              title: 'Quantity & Add-ons',
              items: [
                { id: 'portions', label: 'Portions', price: 0 },
                { id: 'drinks', label: 'Beverages', price: 3 },
                { id: 'desserts', label: 'Desserts', price: 5 }
              ]
            }
          }]
        };
      }

      // Step 3: If we have quantity, show delivery options
      if (stepIndex === 3 && flowState['quantity-selector']) {
        return {
          followUpQuestion: 'When would you like it delivered?',
          predictiveText: 'Choose your preferred delivery time',
          uiComponents: [{
            type: 'radio-group',
            data: {
              title: 'Delivery Time',
              options: [
                { value: 'asap', label: 'ASAP (30-45 minutes)' },
                { value: '1-hour', label: 'In 1 hour' },
                { value: '2-hours', label: 'In 2 hours' },
                { value: 'specific-time', label: 'Specific time' }
              ]
            }
          }]
        };
      }

      return null;
    }

    // Handle laundry service flow
    if (flowId === 'laundry-service') {
      const laundrySteps = [
        {
          followUpQuestion: 'When do you need it back?',
          predictiveText: 'e.g., same day, next day, standard delivery',
          uiComponents: [{
            type: 'radio-group',
            data: {
              title: 'Turnaround Time',
              options: [
                { value: 'same-day', label: 'Same Day (+$10)' },
                { value: 'next-day', label: 'Next Day' },
                { value: '2-3-days', label: '2-3 Days (Standard)' }
              ]
            }
          }]
        },
        {
          followUpQuestion: 'How many items do you have?',
          predictiveText: 'Select quantities for each item type',
          uiComponents: [{
            type: 'quantity-selector',
            data: {
              title: 'Number of Items',
              items: [
                { id: 'shirts', label: 'Shirts', price: 5 },
                { id: 'pants', label: 'Pants', price: 7 },
                { id: 'dresses', label: 'Dresses', price: 12 },
                { id: 'suits', label: 'Suits', price: 20 }
              ]
            }
          }]
        }
      ];

      if (stepIndex >= laundrySteps.length) {
        return null;
      }

      return laundrySteps[stepIndex];
    }

    return null;
  }

  generateContextualResponse(input: string, flowState: any): string {
    // Generate natural responses based on current flow state
    if (flowState['service-cards']) {
      const selectedCard = flowState['service-cards'];
      if (selectedCard.id === 'veg' || selectedCard.id === 'non-veg') {
        return `I need food service for ${selectedCard.title.toLowerCase()}...what meal are you looking for?`;
      }
      return `${selectedCard.title}—what specific assistance do you need?`;
    }
    
    if (flowState['meal-type']) {
      const mealType = flowState['meal-type'];
      const foodType = flowState['service-cards']?.title?.toLowerCase() || 'food';
      return `I need ${foodType} ${mealType.title.toLowerCase()}...what would you like to order?`;
    }

    if (flowState['food-menu-cards']) {
      const selectedItem = flowState['food-menu-cards'];
      return `I need ${selectedItem.title}...how many portions and any add-ons?`;
    }
    
    if (flowState['quantity-selector']) {
      const items = Array.isArray(flowState['quantity-selector']) 
        ? flowState['quantity-selector'].map((q: any) => `${q.quantity} ${q.item}`).join(', ')
        : `${flowState['quantity-selector'].quantity} ${flowState['quantity-selector'].item}`;
      return `Got it! ${items}. When do you need this completed?`;
    }

    if (flowState['radio-group']) {
      const selection = flowState['radio-group'];
      if (selection === 'asap') {
        return `Perfect! ASAP delivery selected. Ready to confirm your order?`;
      } else if (selection.includes('hour')) {
        return `Perfect! Delivery in ${selection.replace('-', ' ')} selected. Ready to confirm your order?`;
      }
      const turnaround = selection === 'same-day' ? 'same day service' : 
                        selection === 'next-day' ? 'next day delivery' : 
                        'standard delivery';
      return `Perfect! ${turnaround} selected. Ready to confirm your request?`;
    }

    return input;
  }
}
