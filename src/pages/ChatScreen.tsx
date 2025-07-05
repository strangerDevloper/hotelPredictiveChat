import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, Check, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { VoiceButton } from '@/components/ui/voice-button';
import { useVoiceRecognition } from '../hooks/useVoiceRecognition';
import { VoiceIntentMatcher } from '../components/chat/VoiceIntentMatcher';
import { PredictiveEngine } from '../components/chat/PredictiveEngine';
import { DynamicUIRenderer } from '../components/chat/DynamicUIRenderer';
import { ChatMessage } from '../components/chat/ChatMessage';

interface ChatScreenProps {
  onBack: () => void;
}

export interface ChatMessageType {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  isBookingCard?: boolean;
  bookingDetails?: {
    service: string;
    items: string[];
    turnaround: string;
    cost: string;
    estimatedTime: string;
    requestId: string;
  };
}

export interface UIComponent {
  type: 'service-cards' | 'food-menu-cards' | 'radio-group' | 'checkbox-group' | 'slider' | 'time-picker' | 'date-picker' | 'quantity-selector' | 'confirmation-card';
  data: any;
  onSelect: (value: any) => void;
}

const ChatScreen = ({ onBack }: ChatScreenProps) => {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [followUpQuestion, setFollowUpQuestion] = useState('');
  const [predictiveText, setPredictiveText] = useState('');
  const [uiComponents, setUIComponents] = useState<UIComponent[]>([]);
  const [currentFlow, setCurrentFlow] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [flowState, setFlowState] = useState<any>({});
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const predictiveEngine = new PredictiveEngine();
  const voiceIntentMatcher = new VoiceIntentMatcher();
  const { voiceState, toggleListening, clearTranscript } = useVoiceRecognition();

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleInputChange = (value: string) => {
    setInputValue(value);
    
    if (value.length > 2) {
      const prediction = predictiveEngine.predict(value);
      if (prediction) {
        setFollowUpQuestion(prediction.followUpQuestion);
        setPredictiveText(prediction.predictiveText);
        setUIComponents(prediction.uiComponents);
        setCurrentFlow(prediction.flowId);
        
        // Handle special case for direct food type input
        if (prediction.flowId === 'food-service' && 
            (value.toLowerCase().includes('vegetarian') || value.toLowerCase().includes('veg') || 
             value.toLowerCase().includes('non-vegetarian') || value.toLowerCase().includes('non-veg'))) {
          setCurrentStep(1); // Skip to meal selection
          const foodType = value.toLowerCase().includes('non') ? 'non-veg' : 'veg';
          setFlowState({ 'service-cards': { id: foodType, title: foodType === 'veg' ? 'Vegetarian' : 'Non-Vegetarian' } });
        } else {
          setCurrentStep(0);
          setFlowState({});
        }
      }
    } else {
      setFollowUpQuestion('');
      setPredictiveText('');
      setUIComponents([]);
      setCurrentFlow(null);
      setCurrentStep(0);
      setFlowState({});
    }
  };

  // Show interim transcript in input while listening
  useEffect(() => {
    if (voiceState.isListening && voiceState.interimTranscript) {
      setInputValue(voiceState.interimTranscript);
    }
  }, [voiceState.interimTranscript, voiceState.isListening]);

  // On final transcript, set it in input and trigger flow
  useEffect(() => {
    if (!voiceState.isListening && voiceState.transcript) {
      setInputValue(voiceState.transcript);
      handleInputChange(voiceState.transcript);
      if (inputRef.current) inputRef.current.focus();
      clearTranscript();
    }
  }, [voiceState.transcript, voiceState.isListening, clearTranscript]);

  // Handle errors gracefully (optional: show error in input or as toast)
  useEffect(() => {
    if (voiceState.error && !voiceState.isListening) {
      setFollowUpQuestion(voiceState.error);
    }
  }, [voiceState.error, voiceState.isListening]);

  const resetFlow = () => {
    setInputValue('');
    setFollowUpQuestion('');
    setPredictiveText('');
    setUIComponents([]);
    setCurrentFlow(null);
    setCurrentStep(0);
    setFlowState({});
  };

  const generateBookingConfirmation = (flowState: any, inputText: string) => {
    const requestId = 'REQ' + Date.now().toString().slice(-6);
    let service = 'Service Request';
    let items: string[] = [];
    let turnaround = 'Standard';
    let cost = '$25';
    let estimatedTime = '2-3 hours';

    if (currentFlow === 'food-service') {
      service = 'Food Service';
      const foodType = flowState['service-cards']?.title || 'Food';
      const mealType = flowState['meal-type']?.title || 'Meal';
      const selectedFood = flowState['food-menu-cards']?.title || 'Food Item';
      const quantity = flowState['quantity-selector']?.quantity || 1;
      
      service = `${foodType} ${mealType}`;
      items = [`${quantity}x ${selectedFood}`];
      
      // Calculate food cost
      const itemPrice = flowState['food-menu-cards']?.price || 15;
      const totalCost = itemPrice * quantity;
      cost = `$${totalCost}`;
      
      // Set delivery time based on selection
      const deliveryTime = flowState['radio-group'];
      if (deliveryTime === 'asap') {
        estimatedTime = '30-45 minutes';
        turnaround = 'ASAP';
      } else if (deliveryTime === '1-hour') {
        estimatedTime = '1 hour';
        turnaround = 'In 1 hour';
      } else if (deliveryTime === '2-hours') {
        estimatedTime = '2 hours';
        turnaround = 'In 2 hours';
      } else {
        estimatedTime = '45-60 minutes';
        turnaround = 'Standard delivery';
      }
    } else if (currentFlow === 'laundry-service') {
      service = 'Laundry Service';
      if (flowState['service-cards']) {
        service = flowState['service-cards'].title;
      }
      if (flowState['quantity-selector']) {
        const quantities = Array.isArray(flowState['quantity-selector']) 
          ? flowState['quantity-selector'] 
          : [flowState['quantity-selector']];
        items = quantities.map((q: any) => `${q.quantity} ${q.item}`);
        
        // Calculate cost based on items
        const totalCost = quantities.reduce((sum: number, q: any) => {
          const itemCosts = { shirts: 5, pants: 7, dresses: 12, suits: 20 };
          return sum + (q.quantity * (itemCosts[q.item as keyof typeof itemCosts] || 5));
        }, 0);
        cost = `$${totalCost}`;
      }
      if (flowState['radio-group']) {
        turnaround = flowState['radio-group'];
        if (turnaround === 'same-day') {
          estimatedTime = '6-8 hours';
        } else if (turnaround === 'next-day') {
          estimatedTime = '24 hours';
        }
      }
    }

    return {
      service,
      items,
      turnaround,
      cost,
      estimatedTime,
      requestId
    };
  };

  const handleComponentSelect = (componentType: string, value: any) => {
    console.log('Selected:', componentType, value);
    
    // Update flow state
    let newFlowState = { ...flowState };
    
    // Handle special cases for food service flow
    if (componentType === 'service-cards' && currentFlow === 'food-service') {
      if (currentStep === 0) {
        // This is food type selection (veg/non-veg)
        newFlowState = { ...newFlowState, 'service-cards': value };
      } else if (currentStep === 1) {
        // This is meal type selection
        newFlowState = { ...newFlowState, 'meal-type': value };
        // Ensure we keep the selected food type in flowState
        if (!newFlowState['service-cards']) {
          newFlowState['service-cards'] = value;
        }
      }
    } else {
      newFlowState = { ...newFlowState, [componentType]: value };
    }
    
    setFlowState(newFlowState);

    // Handle confirmation
    if (componentType === 'confirmation-card' && value === 'confirmed') {
      // Send the current input as user message
      if (inputValue.trim()) {
        const userMessage: ChatMessageType = {
          id: Date.now().toString(),
          type: 'user',
          content: inputValue,
          timestamp: new Date()
        };

        // Create booking confirmation message
        const bookingDetails = generateBookingConfirmation(newFlowState, inputValue);
        const botMessage: ChatMessageType = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: 'Your request has been confirmed!',
          timestamp: new Date(),
          isBookingCard: true,
          bookingDetails
        };

        setMessages(prev => [...prev, userMessage, botMessage]);
        resetFlow();
      }
      return;
    }

    // Generate contextual response using the predictive engine
    const contextualResponse = predictiveEngine.generateContextualResponse(inputValue, newFlowState);
    
    // Auto-append to input text
    let appendText = '';
    if (componentType === 'service-cards') {
      appendText = value.title;
      setInputValue(contextualResponse);
    } else if (componentType === 'food-menu-cards') {
      appendText = value.title;
      setInputValue(contextualResponse);
    } else if (componentType === 'radio-group') {
      if (currentFlow === 'food-service') {
        appendText = value === 'asap' ? 'ASAP delivery' : 
                     value === '1-hour' ? 'delivery in 1 hour' :
                     value === '2-hours' ? 'delivery in 2 hours' :
                     'specific time delivery';
      } else {
        appendText = value === 'same-day' ? 'same day service' : 
                     value === 'next-day' ? 'next day delivery' : 
                     '2-3 days standard delivery';
      }
      const currentText = inputValue.trim();
      const newText = currentText ? `${currentText}, ${appendText}` : appendText;
      setInputValue(newText);
    } else if (componentType === 'checkbox-group') {
      appendText = value.label;
      const currentText = inputValue.trim();
      const newText = currentText ? `${currentText}, ${appendText}` : appendText;
      setInputValue(newText);
    } else if (componentType === 'quantity-selector') {
      if (Array.isArray(value)) {
        appendText = value.map(v => `${v.quantity} ${v.item}`).join(', ');
      } else {
        appendText = `${value.quantity} ${value.item}`;
      }
      const currentText = inputValue.trim();
      const newText = currentText ? `${currentText}, ${appendText}` : appendText;
      setInputValue(newText);
    }

    // Progress to next step in flow
    if (currentFlow) {
      const nextStep = predictiveEngine.getNextStep(currentFlow, currentStep + 1, newFlowState);
      if (nextStep) {
        setCurrentStep(currentStep + 1);
        setFollowUpQuestion(nextStep.followUpQuestion);
        setPredictiveText(nextStep.predictiveText);
        setUIComponents(nextStep.uiComponents);
      } else if (currentFlow === 'food-service' && componentType === 'service-cards' && currentStep === 1) {
        // If no next step, but we just selected meal type, force menu items step
        const foodType = newFlowState['service-cards']?.id || 'veg';
        const mealType = newFlowState['meal-type']?.id || newFlowState['service-cards']?.id;
        if (foodType && mealType) {
          // @ts-ignore: Accessing getFoodMenuItems for UI rendering
          const menuItems = predictiveEngine.getFoodMenuItems(foodType, mealType);
          setCurrentStep(currentStep + 1);
          setFollowUpQuestion('What would you like to order?');
          setPredictiveText('Select from our menu items');
          setUIComponents([{
            type: 'food-menu-cards',
            data: {
              title: 'Menu Items',
              cards: menuItems
            },
            onSelect: () => {}
          }]);
        }
      } else {
        // Flow completed
        setFollowUpQuestion('Got it! Ready to confirm your request?');
        setPredictiveText('Review details and confirm');
        setUIComponents([{
          type: 'confirmation-card',
          data: {
            title: 'Confirm Request',
            summary: inputValue,
            estimatedTime: currentFlow === 'food-service' ? '30-45 minutes' : '2-3 hours',
            cost: currentFlow === 'food-service' ? '$18' : '$25'
          },
          onSelect: () => {}
        }]);
      }
    }
  };

  const getPlaceholderText = () => {
    if (voiceState.isListening) {
      return "Listening...";
    }
    if (voiceState.isProcessing) {
      return "Processing...";
    }
    if (followUpQuestion) {
      return followUpQuestion;
    }
    return "Ask me anything or tap the mic...";
  };

  const getPredictiveHint = () => {
    if (voiceState.error) {
      return voiceState.error;
    }
    if (predictiveText && inputValue.length > 2) {
      return predictiveText;
    }
    return "";
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: ChatMessageType = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    
    // Simulate bot response
    setTimeout(() => {
      const botResponse: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: 'I understand your request. Let me help you with that.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);

    resetFlow();
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Status bar */}
      <div className="bg-black text-white text-sm py-2 px-4 flex justify-between items-center">
        <span>9:41</span>
        <div className="flex items-center space-x-1">
          <div className="flex space-x-1">
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <div className="w-1 h-1 bg-white rounded-full"></div>
          </div>
          <span>📶</span>
          <span>📶</span>
          <span>🔋</span>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-lg font-semibold">Concierge Assistant</h1>
        <Button variant="ghost" size="icon" onClick={resetFlow}>
          <Home className="w-4 h-4" />
        </Button>
      </div>

      {/* Dynamic UI Components */}
      {uiComponents.length > 0 && (
        <div className="p-4 border-b bg-gray-50">
          <DynamicUIRenderer 
            components={uiComponents} 
            onSelect={handleComponentSelect}
          />
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          message.isBookingCard ? (
            <div key={message.id} className="flex justify-start">
              <div className="max-w-[80%] bg-white border border-green-200 rounded-lg p-4 shadow-sm">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-800">Booking Confirmed</h4>
                    <p className="text-xs text-green-600">Request ID: {message.bookingDetails?.requestId}</p>
                  </div>
                </div>
                
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Service:</span>
                    <span className="text-sm">{message.bookingDetails?.service}</span>
                  </div>
                  {message.bookingDetails?.items && message.bookingDetails.items.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Items:</span>
                      <span className="text-sm">{message.bookingDetails.items.join(', ')}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Delivery:</span>
                    <span className="text-sm">{message.bookingDetails?.turnaround}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Est. Time:</span>
                    <span className="text-sm">{message.bookingDetails?.estimatedTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Total Cost:</span>
                    <span className="text-sm font-semibold">{message.bookingDetails?.cost}</span>
                  </div>
                </div>
                
                <p className="text-xs text-gray-500">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ) : (
            <ChatMessage key={message.id} message={message} />
          )
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input with Voice Integration */}
      <div className="p-4 border-t bg-white">
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <div className="flex">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder={getPlaceholderText()}
                className={`pr-20 ${voiceState.isListening ? 'bg-blue-50 border-blue-300' : ''}`}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                <VoiceButton
                  isListening={voiceState.isListening}
                  isProcessing={voiceState.isProcessing}
                  isSupported={voiceState.isSupported}
                  error={voiceState.error}
                  onClick={toggleListening}
                />
              </div>
            </div>
            {getPredictiveHint() && (
              <div className={`absolute top-full left-0 right-0 text-xs mt-1 px-3 ${
                voiceState.error ? 'text-red-500' : 'text-gray-400'
              }`}>
                {getPredictiveHint()}
              </div>
            )}
          </div>
          <Button onClick={handleSendMessage} size="icon">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatScreen;
