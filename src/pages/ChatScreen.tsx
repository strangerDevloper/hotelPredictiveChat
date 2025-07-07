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
import { useBookings } from '../lib/BookingContext';

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
  const { addBooking } = useBookings();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pendingBooking, setPendingBooking] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'reception' | null>(null);

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

  // Scroll to bottom when messages or UI components change, or when input is focused
  useEffect(() => {
    const scrollToBottom = () => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    };
    scrollToBottom();
  }, [messages, uiComponents]);

  useEffect(() => {
    const handleFocus = () => {
      setTimeout(() => {
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 200); // allow keyboard animation
    };
    if (inputRef.current) {
      inputRef.current.addEventListener('focus', handleFocus);
      return () => inputRef.current?.removeEventListener('focus', handleFocus);
    }
  }, []);

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
          // If meal type is also present, skip to menu selection
          const foodType = value.toLowerCase().includes('non') ? 'non-veg' : 'veg';
          let mealType = null;
          if (value.toLowerCase().includes('breakfast')) mealType = 'breakfast';
          else if (value.toLowerCase().includes('lunch')) mealType = 'lunch';
          else if (value.toLowerCase().includes('dinner')) mealType = 'dinner';
          else if (value.toLowerCase().includes('snacks')) mealType = 'snacks';

          if (mealType) {
            setCurrentStep(2);
            setFlowState({
              'service-cards': { id: foodType, title: foodType === 'veg' ? 'Vegetarian' : 'Non-Vegetarian' },
              'meal-type': { id: mealType, title: mealType.charAt(0).toUpperCase() + mealType.slice(1) }
            });
            // @ts-ignore: Accessing getFoodMenuItems for UI rendering
            const menuItems = predictiveEngine.getFoodMenuItems(foodType, mealType);
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
          } else {
            setCurrentStep(1);
            setFlowState({ 'service-cards': { id: foodType, title: foodType === 'veg' ? 'Vegetarian' : 'Non-Vegetarian' } });
          }
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
      // Support multiple food items
      const selectedFoods = Array.isArray(flowState['food-menu-cards']) ? flowState['food-menu-cards'] : [flowState['food-menu-cards']];
      items = selectedFoods.filter(f => f && f.quantity > 0).map(f => `${f.quantity}x ${f.title}`);
      // Calculate total cost
      const totalCost = selectedFoods.reduce((sum, f) => sum + (f.price * (f.quantity || 0)), 0);
      cost = `$${totalCost}`;
      service = `${foodType} ${mealType}`;
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
      // Show payment method selection instead of immediate booking
      const bookingDetails = generateBookingConfirmation(newFlowState, inputValue);
      setPendingBooking(bookingDetails);
      setShowPaymentModal(true);
      return;
    }

    // For food-menu-cards, store the array of selected items in flowState
    if (componentType === 'food-menu-cards') {
      setFlowState((prev: any) => ({ ...prev, 'food-menu-cards': value }));
      // Progress to next step
      if (currentFlow) {
        const nextStep = predictiveEngine.getNextStep(currentFlow, currentStep + 1, { ...newFlowState, 'food-menu-cards': value });
        if (nextStep) {
          setCurrentStep(currentStep + 1);
          setFollowUpQuestion(nextStep.followUpQuestion);
          setPredictiveText(nextStep.predictiveText);
          setUIComponents(nextStep.uiComponents);
        } else {
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

  // Payment handling
  const handlePayment = (method: 'card' | 'reception') => {
    setPaymentMethod(method);
    if (method === 'card') {
      // Simulate payment process
      setTimeout(() => {
        addBooking({ ...pendingBooking, timestamp: new Date().toISOString(), paymentMethod: 'card', paymentStatus: 'paid' });
        setShowPaymentModal(false);
        setPendingBooking(null);
        setPaymentMethod(null);
        // Show payment received message in chat
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          type: 'bot',
          content: 'Payment received. Your request has been confirmed!',
          timestamp: new Date(),
          isBookingCard: true,
          bookingDetails: { ...pendingBooking, paymentMethod: 'card', paymentStatus: 'paid' }
        }]);
        resetFlow();
      }, 1800);
    } else {
      // Pay at reception
      addBooking({ ...pendingBooking, timestamp: new Date().toISOString(), paymentMethod: 'reception', paymentStatus: 'pending' });
      setShowPaymentModal(false);
      setPendingBooking(null);
      setPaymentMethod(null);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'bot',
        content: 'Your request has been confirmed! Please pay at reception.',
        timestamp: new Date(),
        isBookingCard: true,
        bookingDetails: { ...pendingBooking, paymentMethod: 'reception', paymentStatus: 'pending' }
      }]);
      resetFlow();
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
    <>
      <div className="flex flex-col bg-gray-50 safe-area-top safe-area-bottom" style={{ height: '100dvh' }}>
        {/* Status bar */}
        <div className="bg-black text-white text-sm py-2 px-4 flex justify-between items-center flex-none">
          <span className="font-medium">9:41</span>
          <div className="flex items-center space-x-1">
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-white rounded-full"></div>
              <div className="w-1 h-1 bg-white rounded-full"></div>
              <div className="w-1 h-1 bg-white rounded-full"></div>
              <div className="w-1 h-1 bg-white rounded-full"></div>
            </div>
            <span className="text-xs">📶</span>
            <span className="text-xs">📶</span>
            <span className="text-xs">🔋</span>
          </div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-white flex-none">
          <Button variant="ghost" size="icon" onClick={onBack} className="min-w-[44px] min-h-[44px]">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold">Concierge Assistant</h1>
          <Button variant="ghost" size="icon" onClick={resetFlow} className="min-w-[44px] min-h-[44px]">
            <Home className="w-5 h-5" />
          </Button>
        </div>

        {/* Main Chat Area: Dynamic UI + Messages */}
        <div className="flex-1 flex flex-col overflow-y-auto scroll-container">
          {/* Dynamic UI Components (cards, selectors, etc.) */}
          {uiComponents.length > 0 && (
            <div className="p-3 border-b bg-gray-50 flex-shrink-0">
              <DynamicUIRenderer 
                components={uiComponents} 
                onSelect={handleComponentSelect}
              />
            </div>
          )}
          {/* Messages */}
          <div className="flex-1 flex flex-col justify-end p-3 pb-4 overflow-y-auto">
            {messages.map(message => (
              message.isBookingCard ? (
                <div key={message.id} className="flex justify-start mb-3">
                  <div className="max-w-[85%] bg-white border border-green-200 rounded-lg p-4 shadow-sm">
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
        </div>

        {/* Input with Voice Integration - Fixed at Bottom */}
        <div className="p-3 border-t bg-white flex-none safe-area-bottom">
          <div className="flex space-x-2">
            <div className="flex-1 relative">
              <div className="flex">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder={getPlaceholderText()}
                  className={`pr-20 min-h-[44px] ${voiceState.isListening ? 'bg-blue-50 border-blue-300' : ''}`}
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
            <Button onClick={handleSendMessage} size="icon" className="min-w-[44px] min-h-[44px]">
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-6 w-80 max-w-full flex flex-col items-center">
            {!paymentMethod && (
              <>
                <h3 className="font-bold text-lg mb-4">Select Payment Method</h3>
                <Button className="w-full mb-3 bg-blue-700 text-white" onClick={() => handlePayment('card')}>Pay by Card</Button>
                <Button className="w-full bg-gray-200 text-gray-800" onClick={() => handlePayment('reception')}>Pay at Reception</Button>
              </>
            )}
            {paymentMethod === 'card' && (
              <>
                <div className="flex flex-col items-center w-full">
                  <div className="animate-pulse text-blue-700 text-3xl mb-2">💳</div>
                  <div className="font-semibold mb-2">Processing payment...</div>
                  <div className="text-xs text-gray-500 mb-2">Do not close this window</div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ChatScreen;
