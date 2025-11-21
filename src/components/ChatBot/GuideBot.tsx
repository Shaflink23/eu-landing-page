import { useState, useRef, useEffect } from 'react';

interface Message {
  id: number;
  content: string;
  isBot: boolean;
  isTyping: boolean;
  time: string;
}

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const GuideBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentStep, setCurrentStep] = useState<'welcome' | 'faq-selection' | 'answer' | 'follow-up' | 'resolution' | 'completed'>('welcome');
  const [selectedFAQ, setSelectedFAQ] = useState<FAQItem | null>(null);
  const [conversationHistory, setConversationHistory] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const phoneNumber = '256755225525';

  // FAQ Data
  const faqData: FAQItem[] = [
    {
      id: 1,
      question: "Do I need a visa to visit Uganda?",
      answer: "Most travellers do. Uganda's e-visa is quick to apply for online, and some East African citizens are exempt. Always check your nationality on the official immigration portal before you travel."
    },
    {
      id: 2,
      question: "What's the best time of year to visit?",
      answer: "Uganda shines all year, but the dry seasons — Dec–Feb and Jun–Aug — give you the smoothest roads and the most wildlife sightings."
    },
    {
      id: 3,
      question: "Is Uganda safe for travellers?",
      answer: "Yes, overall. Tourist zones are secure, and operators handle most logistics. Just apply common sense: avoid late-night wandering and keep valuables tucked away."
    },
    {
      id: 4,
      question: "What are the most common payment methods in Uganda?",
      answer: "Cash (Ugandan Shillings) rules the streets, cards work in good hotels/restaurants, and mobile money (MTN + Airtel) is the local superstar used for everything from taxis to snacks. Always keep some cash for rural areas."
    },
    {
      id: 5,
      question: "How do I say basic greetings in the local languages?",
      answer: "Uganda has many languages, but here are two widely understood:\n\nLuganda: \"Hi\" = Gyebale ko, \"Thank you\" = Webale\nPeople love when visitors try—even if you butcher it beautifully."
    },
    {
      id: 6,
      question: "Where can I go to experience Uganda at its core?",
      answer: "Head to places that show everyday Ugandan life and culture at full flavour:\n\n• Local markets (Owino, Nakasero, Entebbe market)\n• Village experiences around Mpigi, Jinja, or Fort Portal\n• Community tourism hubs (Buganda cultural trails, coffee tours, craft workshops)\n• Food experiences — rolex stands, street grills, lake fish spots\n\nThat's where Uganda stops posing for pictures and shows you its real heartbeat."
    }
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const addMessage = (content: string, isBot = false, isTyping = false) => {
    const newMessage = {
      id: Date.now(),
      content,
      isBot,
      isTyping,
      time: getCurrentTime()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const simulateTyping = (callback: () => void, delay = 2000) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      callback();
    }, delay);
  };

  const restartChat = () => {
    setMessages([]);
    setCurrentStep('welcome');
    setSelectedFAQ(null);
    setConversationHistory([]);
    
    setTimeout(() => {
      simulateTyping(() => {
        addMessage("Hello, Welcome to Everything Uganda.\n\nI'm Nambi, your FAQ assistant. I can help you with common travel questions about Uganda.\n\nSelect a question to get started:", true);
        setCurrentStep('faq-selection');
      }, 1000);
    }, 500);
  };

  const handleFAQSelect = (faq: FAQItem) => {
    setSelectedFAQ(faq);
    setCurrentStep('answer');
    const questionLog = `Q: ${faq.question}`;
    setConversationHistory(prev => [...prev, questionLog]);
    
    addMessage(faq.question, false);
    
    simulateTyping(() => {
      addMessage(faq.answer, true);
      setCurrentStep('follow-up');
    }, 1500);
  };

  const handleFollowUp = (answer: 'yes' | 'no') => {
    if (answer === 'yes') {
      // User wants another question
      setCurrentStep('faq-selection');
      setSelectedFAQ(null);
      simulateTyping(() => {
        addMessage("Great! Feel free to ask another question.", true);
        setTimeout(() => {
          addMessage("Select another question:", true);
        }, 500);
      }, 1000);
    } else {
      // User doesn't want another question, check if issue is resolved
      setCurrentStep('resolution');
      simulateTyping(() => {
        addMessage("Has this information resolved your issue?", true);
      }, 1000);
    }
  };

  const handleResolution = (resolved: 'yes' | 'no') => {
    if (resolved === 'yes') {
      // Issue resolved - show completion with restart option
      simulateTyping(() => {
        addMessage("Excellent! I'm glad I could help.\n\nFor bookings or more detailed assistance, feel free to continue on WhatsApp with our booking team.", true);
        setTimeout(() => {
          addMessage("Need help with something else? Start a new conversation!", true);
        }, 1000);
      }, 1500);
      
      // Add restart button after a delay
      setTimeout(() => {
        setCurrentStep('completed');
      }, 3000);
    } else {
      // Issue not resolved - redirect to WhatsApp
      handleWhatsAppRedirect();
    }
  };

  const handleWhatsAppRedirect = () => {
    const conversationText = conversationHistory.join('\n') + `\n\nAdditional Context: User's questions were not fully resolved through the FAQ system.`;
    const encodedMessage = encodeURIComponent(`Hello! I need assistance with Uganda travel information.\n\nHere's my conversation history:\n${conversationText}\n\nI would like to speak with a travel consultant for personalized help.`);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen && messages.length === 0) {
      setTimeout(() => {
        simulateTyping(() => {
          addMessage("Hello, Welcome to Everything Uganda.\n\nI'm Nambi, your FAQ assistant. I can help you with common travel questions about Uganda.\n\nSelect a question to get started:", true);
          setCurrentStep('faq-selection');
        }, 1000);
      }, 500);
    }
  };

  const renderFAQButtons = () => (
    <div className="mt-3 animate-in slide-in-from-bottom-2 duration-300">
      <div className="grid grid-cols-1 gap-1.5">
        {faqData.map((faq) => (
          <button
            key={faq.id}
            className="bg-white border border-gray-200 px-3 py-2.5 rounded-lg text-xs text-left transition-all hover:bg-gray-50 hover:border-green-500 hover:shadow-sm"
            onClick={() => handleFAQSelect(faq)}
          >
            {faq.question}
          </button>
        ))}
      </div>
    </div>
  );

  const renderFollowUpButtons = () => (
    <div className="mt-3 animate-in slide-in-from-bottom-2 duration-300">
      <div className="grid grid-cols-2 gap-2">
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-3 py-2.5 rounded-lg text-xs font-medium transition-all"
          onClick={() => handleFollowUp('yes')}
        >
          Yes
        </button>
        <button
          className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2.5 rounded-lg text-xs font-medium transition-all"
          onClick={() => handleFollowUp('no')}
        >
          No
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-2 px-1">Would you like to ask another question?</p>
    </div>
  );

  const renderResolutionButtons = () => (
    <div className="mt-3 animate-in slide-in-from-bottom-2 duration-300">
      <div className="grid grid-cols-2 gap-2">
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-3 py-2.5 rounded-lg text-xs font-medium transition-all"
          onClick={() => handleResolution('yes')}
        >
          Yes, Resolved
        </button>
        <button
          className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-2.5 rounded-lg text-xs font-medium transition-all"
          onClick={() => handleResolution('no')}
        >
          No, Need Help
        </button>
      </div>
    </div>
  );

  const renderCompletionButtons = () => (
    <div className="mt-3 animate-in slide-in-from-bottom-2 duration-300">
      <div className="grid grid-cols-1 gap-2">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2.5 rounded-lg text-xs font-medium transition-all"
          onClick={restartChat}
        >
          Start New Conversation
        </button>
      </div>
    </div>
  );

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[998] transition-all duration-300 lg:hidden"
          onClick={toggleChat}
        />
      )}
      
      <div className="fixed bottom-4 right-4 z-[1000] font-sans">
        
        <div className={`
          transition-all duration-300 ease-out bg-white shadow-2xl overflow-hidden
          ${isOpen ? 'scale-100 translate-y-0 opacity-100 visible' : 'scale-95 translate-y-2 opacity-0 invisible'}
          
          /* Desktop: popup positioned above button */
          lg:absolute lg:bottom-16 lg:right-0 lg:w-96 lg:h-auto lg:max-h-[80vh] lg:min-h-[520px] lg:rounded-xl lg:origin-bottom-right lg:flex lg:flex-col
          
          /* Mobile and Tablet: full screen overlay */
          max-lg:fixed max-lg:inset-0 max-lg:w-full max-lg:h-full max-lg:rounded-none max-lg:flex max-lg:flex-col max-lg:z-[999]
        `}>
          
          <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-3 flex items-center gap-3 flex-shrink-0">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 24 24" width="20" height="20" className="text-green-100">
                <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12c0 1.75.46 3.39 1.25 4.81L2 22l5.19-1.25C8.61 21.54 10.25 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z"/>
                <path fill="currentColor" d="M8.5 7.5c0-.28.22-.5.5-.5h6c.28 0 .5.22.5.5s-.22.5-.5.5H9c-.28 0-.5-.22-.5-.5zm0 3c0-.28.22-.5.5-.5h6c.28 0 .5.22.5.5s-.22.5-.5.5H9c-.28 0-.5-.22-.5-.5zm0 3c0-.28.22-.5.5-.5h4c.28 0 .5.22.5.5s-.22.5-.5.5H9c-.28 0-.5-.22-.5-.5z"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold m-0">Everything Uganda</h4>
              <div className="text-xs opacity-90 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse flex-shrink-0"></span>
                <span>Nambi - FAQ Assistant</span>
              </div>
            </div>
            <button 
              className="p-1.5 rounded-full hover:bg-white/10 transition-colors flex-shrink-0"
              onClick={toggleChat}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-2 bg-gray-50 scroll-smooth min-h-0">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex mb-3 ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                <div className="max-w-[85%]">
                  <div className={`px-3 py-2 rounded-xl text-xs leading-relaxed shadow-sm whitespace-pre-line ${
                    msg.isBot 
                      ? 'bg-white text-gray-800 rounded-bl-sm' 
                      : 'bg-green-600 text-white rounded-br-sm'
                  } animate-in slide-in-from-bottom-1 duration-200`}>
                    {msg.content}
                  </div>
                  <div className={`text-xs text-gray-500 mt-0.5 px-1 ${msg.isBot ? 'text-left' : 'text-right'}`}>
                    {msg.time}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start mb-3">
                <div className="bg-white px-4 py-3 rounded-xl rounded-bl-sm shadow-sm animate-in slide-in-from-bottom-1 duration-200 max-w-[85%]">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                    </div>
                    <span className="text-xs text-gray-500">Assistant is typing...</span>
                  </div>
                </div>
              </div>
            )}

            {/* Dynamic Button Rendering */}
            {currentStep === 'faq-selection' && renderFAQButtons()}
            {currentStep === 'follow-up' && renderFollowUpButtons()}
            {currentStep === 'resolution' && renderResolutionButtons()}
            {currentStep === 'completed' && renderCompletionButtons()}

            <div ref={messagesEndRef} />
          </div>

          <div className="bg-white border-t border-gray-100 p-3 flex-shrink-0">
            <button
              onClick={handleWhatsAppRedirect}
              className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.473 3.516"/>
              </svg>
              Continue on WhatsApp for Booking
            </button>
          </div>
        </div>

        <button 
          className={`relative bg-green-500 hover:bg-green-600 rounded-full px-4 py-3 flex items-center gap-3 shadow-lg transition-all duration-300 ease-out ${
            isOpen 
              ? 'w-12 h-12 px-0 py-0 justify-center' 
              : 'hover:shadow-green-500/30 hover:scale-105'
          }`}
          onClick={toggleChat}
          style={{
            boxShadow: isOpen 
              ? '0 8px 32px rgba(34, 197, 94, 0.3)' 
              : '0 4px 20px rgba(34, 197, 94, 0.4)'
          }}
        >
          {isOpen ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          ) : (
            <>
              <svg viewBox="0 0 24 24" width="20" height="20" className="text-white flex-shrink-0">
                <path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.473 3.516"/>
              </svg>
              <span className="text-white font-medium text-sm whitespace-nowrap">FAQ Assistant</span>
            </>
          )}
        </button>
      </div>
    </>
  );
};

export default GuideBot;
