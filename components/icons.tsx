import React from 'react';

export const LogoutIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

export const CheckCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const XCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const ClockIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const PlusCircleIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const ChartBarIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);

export const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${className}`} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1.158a3.985 3.985 0 01-1.707.426A4.006 4.006 0 013.5 4.502.5.5 0 003 5v1.118a4.002 4.002 0 01.166.277.5.5 0 00.825.298A3.002 3.002 0 005 6.499V7a1 1 0 11-2 0V5.5a.5.5 0 00-.5-.5.5.5 0 00-.5.5v1.415a4.01 4.01 0 01-1.11 2.365.5.5 0 00.333.882H4a1 1 0 110 2H2.5a.5.5 0 00-.333.882 4.01 4.01 0 011.11 2.365v1.415a.5.5 0 00.5.5.5.5 0 00.5-.5V14.5a.5.5 0 00-.166-.353.5.5 0 00-.825-.298A3.002 3.002 0 003 13.5v-.5a1 1 0 112 0v.501a3.002 3.002 0 001.489.848.5.5 0 00.825-.298.5.5 0 00-.166-.353A4.002 4.002 0 015 12.882V12a1 1 0 112 0v.842a3.985 3.985 0 011.707.426A4.006 4.006 0 0110.5 15.498a.5.5 0 00.5.5h.218a4.002 4.002 0 01-.166-.277.5.5 0 00-.825-.298A3.002 3.002 0 0010 13.5v-1a1 1 0 112 0v1.5a.5.5 0 00.5.5.5.5 0 00.5-.5v-1.415a4.01 4.01 0 011.11-2.365.5.5 0 00-.333-.882H14a1 1 0 110-2h1.5a.5.5 0 00.333-.882A4.01 4.01 0 0113.723 6.25a.5.5 0 00-.333.882H13a.5.5 0 00-.5.5v1a1 1 0 11-2 0v-.5a3.002 3.002 0 00-1.489-.848.5.5 0 00-.825.298.5.5 0 00.166.353A4.002 4.002 0 0110 7.118V8a1 1 0 11-2 0V7.158a3.985 3.985 0 01-1.707-.426A4.006 4.006 0 015.5 4.502.5.5 0 005 4V3a1 1 0 011-1zM10 18a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
    <path d="M15 8a1 1 0 100-2 1 1 0 000 2zM3 8a1 1 0 100-2 1 1 0 000 2z" />
  </svg>
);

export const PencilIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L15.232 5.232z" />
    </svg>
);

export const SendIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${className}`} viewBox="0 0 20 20" fill="currentColor">
        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
    </svg>
);

export const ChatBubbleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
);

export const ChevronDownIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${className}`} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);