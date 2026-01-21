// 'use client';

// import React, { createContext, useContext, useCallback, useState } from 'react';

// export interface ToolCall {
//   id: string;
//   name: string;
//   status: 'pending' | 'in-progress' | 'completed' | 'error';
//   statusText?: string;
//   timestamp: number;
//   error?: string;
// }

// interface ToolCallContextType {
//   toolCalls: ToolCall[];
//   addToolCall: (name: string, statusText?: string) => string;
//   updateToolCall: (
//     id: string,
//     updates: Partial<Omit<ToolCall, 'id' | 'timestamp'>>
//   ) => void;
//   completeToolCall: (id: string, statusText?: string) => void;
//   errorToolCall: (id: string, error: string) => void;
//   clearToolCalls: () => void;
// }

// const ToolCallContext = createContext<ToolCallContextType | undefined>(undefined);

// export function ToolCallProvider({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const [toolCalls, setToolCalls] = useState<ToolCall[]>([]);

//   const addToolCall = useCallback((name: string, statusText?: string): string => {
//     const id = `${name}-${Date.now()}-${Math.random()}`;
//     const newToolCall: ToolCall = {
//       id,
//       name,
//       status: 'in-progress',
//       statusText,
//       timestamp: Date.now(),
//     };

//     setToolCalls((prev) => [...prev, newToolCall]);
//     return id;
//   }, []);

//   const updateToolCall = useCallback(
//     (id: string, updates: Partial<Omit<ToolCall, 'id' | 'timestamp'>>) => {
//       setToolCalls((prev) =>
//         prev.map((call) => (call.id === id ? { ...call, ...updates } : call))
//       );
//     },
//     []
//   );

//   const completeToolCall = useCallback((id: string, statusText?: string) => {
//     setToolCalls((prev) =>
//       prev.map((call) =>
//         call.id === id
//           ? { ...call, status: 'completed', statusText: statusText || call.statusText }
//           : call
//       )
//     );
//   }, []);

//   const errorToolCall = useCallback((id: string, error: string) => {
//     setToolCalls((prev) =>
//       prev.map((call) =>
//         call.id === id
//           ? { ...call, status: 'error', error }
//           : call
//       )
//     );
//   }, []);

//   const clearToolCalls = useCallback(() => {
//     setToolCalls([]);
//   }, []);

//   return (
//     <ToolCallContext.Provider
//       value={{
//         toolCalls,
//         addToolCall,
//         updateToolCall,
//         completeToolCall,
//         errorToolCall,
//         clearToolCalls,
//       }}
//     >
//       {children}
//     </ToolCallContext.Provider>
//   );
// }

// export function useToolCallTracker() {
//   const context = useContext(ToolCallContext);
//   if (!context) {
//     throw new Error('useToolCallTracker must be used within ToolCallProvider');
//   }
//   return context;
// }
