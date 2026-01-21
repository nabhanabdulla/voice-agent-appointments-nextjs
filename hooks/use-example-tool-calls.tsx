// 'use client';

// import { useCallback } from 'react';
// import { useToolCallTracker } from './use-tool-call-tracker';

// /**
//  * Example hook demonstrating how to use the tool call tracker.
//  * Replace this with your actual tool calling logic.
//  */
// export function useExampleToolCalls() {
//   const { addToolCall, completeToolCall, errorToolCall, updateToolCall } =
//     useToolCallTracker();

//   // Example: Fetch user data
//   const fetchUserData = useCallback(async (userId: string) => {
//     const id = addToolCall('Fetch User Data', 'Retrieving user information...');

//     try {
//       // Simulate API call
//       await new Promise((resolve) => setTimeout(resolve, 1500));

//       updateToolCall(id, {
//         statusText: `Retrieved data for user ${userId}`,
//       });

//       completeToolCall(id, 'User data loaded successfully');
//     } catch (error) {
//       errorToolCall(id, error instanceof Error ? error.message : 'Unknown error');
//     }
//   }, [addToolCall, completeToolCall, errorToolCall, updateToolCall]);

//   // Example: Process payment
//   const processPayment = useCallback(async (amount: number) => {
//     const id = addToolCall('Process Payment', `Charging $${amount.toFixed(2)}...`);

//     try {
//       // Simulate payment processing
//       await new Promise((resolve) => setTimeout(resolve, 2000));

//       completeToolCall(id, `Payment of $${amount.toFixed(2)} processed`);
//     } catch (error) {
//       errorToolCall(id, error instanceof Error ? error.message : 'Payment failed');
//     }
//   }, [addToolCall, completeToolCall, errorToolCall]);

//   // Example: Send email
//   const sendEmail = useCallback(async (recipient: string, subject: string) => {
//     const id = addToolCall('Send Email', `Sending to ${recipient}...`);

//     try {
//       // Simulate email sending
//       await new Promise((resolve) => setTimeout(resolve, 1000));

//       completeToolCall(id, `Email sent: "${subject}"`);
//     } catch (error) {
//       errorToolCall(id, error instanceof Error ? error.message : 'Email failed');
//     }
//   }, [addToolCall, completeToolCall, errorToolCall]);

//   // Example: Database query
//   const queryDatabase = useCallback(async (query: string) => {
//     const id = addToolCall('Database Query', 'Executing query...');

//     try {
//       // Simulate database query
//       await new Promise((resolve) => setTimeout(resolve, 800));

//       completeToolCall(id, 'Query completed successfully');
//     } catch (error) {
//       errorToolCall(id, error instanceof Error ? error.message : 'Query failed');
//     }
//   }, [addToolCall, completeToolCall, errorToolCall]);

//   return {
//     fetchUserData,
//     processPayment,
//     sendEmail,
//     queryDatabase,
//   };
// }
