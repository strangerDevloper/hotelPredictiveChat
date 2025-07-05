
import { VoiceIntent } from '../../types/voice';

export class VoiceIntentMatcher {
  private serviceKeywords = {
    'food-service': ['food', 'eat', 'hungry', 'meal', 'order', 'restaurant', 'dining', 'breakfast', 'lunch', 'dinner', 'snacks'],
    'laundry-service': ['laundry', 'wash', 'clean', 'dry clean', 'pressing', 'clothes', 'shirts', 'pants', 'suits', 'dresses'],
    'room-cleaning': ['clean room', 'housekeeping', 'room service', 'tidy', 'vacuum', 'dust', 'bathroom']
  };

  private foodTypeKeywords = {
    'veg': ['veg', 'vegetarian', 'veggie', 'plant based'],
    'non-veg': ['non-veg', 'non vegetarian', 'non-vegetarian', 'meat', 'chicken', 'beef', 'fish']
  };

  private mealKeywords = {
    'breakfast': ['breakfast', 'morning meal', 'morning food'],
    'lunch': ['lunch', 'midday meal', 'afternoon meal'],
    'dinner': ['dinner', 'evening meal', 'night food'],
    'snacks': ['snacks', 'snack', 'light bite', 'appetizer']
  };

  private timingKeywords = {
    'asap': ['asap', 'as soon as possible', 'immediately', 'right now', 'urgent'],
    'same-day': ['today', 'same day', 'this day'],
    'next-day': ['tomorrow', 'next day', 'by tomorrow'],
    'specific-time': ['at', 'by', 'in', 'hour', 'hours', 'minutes']
  };

  matchIntent(transcript: string): VoiceIntent | null {
    const lowerTranscript = transcript.toLowerCase();
    
    // Find service type
    let service = '';
    let confidence = 0;

    for (const [serviceType, keywords] of Object.entries(this.serviceKeywords)) {
      const matches = keywords.filter(keyword => lowerTranscript.includes(keyword));
      if (matches.length > 0) {
        const currentConfidence = matches.length / keywords.length;
        if (currentConfidence > confidence) {
          service = serviceType;
          confidence = currentConfidence;
        }
      }
    }

    if (!service) return null;

    const intent: VoiceIntent = {
      service,
      confidence,
    };

    // Extract additional details based on service type
    if (service === 'food-service') {
      // Extract food type
      for (const [foodType, keywords] of Object.entries(this.foodTypeKeywords)) {
        if (keywords.some(keyword => lowerTranscript.includes(keyword))) {
          intent.preferences = intent.preferences || [];
          intent.preferences.push(foodType);
          break;
        }
      }

      // Extract meal type
      for (const [mealType, keywords] of Object.entries(this.mealKeywords)) {
        if (keywords.some(keyword => lowerTranscript.includes(keyword))) {
          intent.preferences = intent.preferences || [];
          intent.preferences.push(mealType);
          break;
        }
      }
    }

    // Extract items and quantities
    const itemMatches = this.extractItems(lowerTranscript, service);
    if (itemMatches.length > 0) {
      intent.items = itemMatches;
    }

    // Extract quantity
    const quantity = this.extractQuantity(lowerTranscript);
    if (quantity > 0) {
      intent.quantity = quantity;
    }

    // Extract timing
    const timing = this.extractTiming(lowerTranscript);
    if (timing) {
      intent.timing = timing;
    }

    return intent;
  }

  private extractItems(transcript: string, service: string): string[] {
    const items: string[] = [];
    
    if (service === 'laundry-service') {
      const clothingItems = ['shirts', 'pants', 'suits', 'dresses', 'clothes'];
      clothingItems.forEach(item => {
        if (transcript.includes(item)) {
          items.push(item);
        }
      });
    }

    return items;
  }

  private extractQuantity(transcript: string): number {
    const numberWords = {
      'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
      'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10
    };

    // Check for written numbers
    for (const [word, num] of Object.entries(numberWords)) {
      if (transcript.includes(word)) {
        return num;
      }
    }

    // Check for digit numbers
    const digitMatch = transcript.match(/\b(\d+)\b/);
    if (digitMatch) {
      return parseInt(digitMatch[1]);
    }

    return 0;
  }

  private extractTiming(transcript: string): string | undefined {
    for (const [timing, keywords] of Object.entries(this.timingKeywords)) {
      if (keywords.some(keyword => transcript.includes(keyword))) {
        return timing;
      }
    }

    return undefined;
  }

  formatVoiceInput(transcript: string, intent: VoiceIntent): string {
    const service = intent.service.replace('-', ' ');
    let formatted = `${service}`;

    if (intent.preferences && intent.preferences.length > 0) {
      formatted += ` for ${intent.preferences.join(' ')}`;
    }

    if (intent.items && intent.items.length > 0) {
      const itemsText = intent.quantity && intent.quantity > 1 
        ? `${intent.quantity} ${intent.items.join(', ')}`
        : intent.items.join(', ');
      formatted += ` - ${itemsText}`;
    }

    if (intent.timing) {
      const timingText = intent.timing === 'asap' ? 'ASAP' : 
                        intent.timing === 'same-day' ? 'today' :
                        intent.timing === 'next-day' ? 'tomorrow' : 
                        intent.timing;
      formatted += ` - ${timingText}`;
    }

    return formatted;
  }
}
