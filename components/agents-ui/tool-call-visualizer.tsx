'use client';

import React, { useCallback, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle, XCircle, Clock } from '@phosphor-icons/react/dist/ssr';
import { cn } from '@/lib/shadcn/utils';

export interface ToolCall {
  id: string;
  name: string;
  status: 'pending' | 'in-progress' | 'completed' | 'error';
  statusText?: string;
  timestamp: number;
  error?: string;
}

interface ToolCallVisualizerProps {
  toolCalls: ToolCall[];
  className?: string;
  maxVisible?: number;
}

const MotionContainer = motion.create('div');
const MotionCard = motion.create('div');

export function ToolCallVisualizer({
  toolCalls,
  className,
  maxVisible = 5,
}: ToolCallVisualizerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const visibleToolCalls = toolCalls.slice(-maxVisible);

  useEffect(() => {
    // Auto-scroll to show latest tool calls
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [toolCalls]);

  const getStatusIcon = useCallback((status: ToolCall['status']) => {
    switch (status) {
      case 'completed':
        return (
          <CheckCircle
            weight="fill"
            className="size-5 text-emerald-500 dark:text-emerald-400"
            aria-label="Completed"
          />
        );
      case 'error':
        return (
          <XCircle
            weight="fill"
            className="size-5 text-red-500 dark:text-red-400"
            aria-label="Error"
          />
        );
      case 'in-progress':
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="flex items-center justify-center"
          >
            <Clock weight="fill" className="size-5 text-blue-500 dark:text-blue-400" />
          </motion.div>
        );
      case 'pending':
      default:
        return (
          <div className="size-5 rounded-full border-2 border-muted-foreground/30" />
        );
    }
  }, []);

  const getStatusColor = useCallback((status: ToolCall['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800';
      case 'error':
        return 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800';
      case 'in-progress':
        return 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800';
      case 'pending':
      default:
        return 'bg-muted/50 border-border';
    }
  }, []);

  return (
    <MotionContainer
      className={cn(
        'flex flex-col gap-3 rounded-lg border border-border bg-card/50 p-4 backdrop-blur-sm',
        className
      )}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-semibold text-foreground">Agent Actions</h3>
        <div className="ml-auto text-xs text-muted-foreground">
          {toolCalls.length} {toolCalls.length === 1 ? 'action' : 'actions'}
        </div>
      </div>

      <div
        ref={containerRef}
        className="flex max-h-96 flex-col gap-2 overflow-y-auto"
      >
        <AnimatePresence mode="popLayout">
          {visibleToolCalls.map((toolCall, index) => (
            <MotionCard
              key={toolCall.id}
              layout
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={cn(
                'flex items-start gap-3 rounded-md border px-3 py-2 transition-all duration-200',
                getStatusColor(toolCall.status)
              )}
            >
              <div className="mt-0.5 flex-shrink-0">
                {getStatusIcon(toolCall.status)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-foreground truncate">
                      {toolCall.name}
                    </p>
                    {toolCall.statusText && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {toolCall.statusText}
                      </p>
                    )}
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <p className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(toolCall.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </p>
                  </div>
                </div>

                {toolCall.error && (
                  <div className="mt-2 rounded bg-background/50 p-2">
                    <p className="text-xs text-destructive font-mono">
                      {toolCall.error}
                    </p>
                  </div>
                )}
              </div>
            </MotionCard>
          ))}
        </AnimatePresence>

        {toolCalls.length === 0 && (
          <div className="flex items-center justify-center py-8 text-center">
            <p className="text-sm text-muted-foreground">
              Tool calls will appear here as the agent performs actions
            </p>
          </div>
        )}
      </div>
    </MotionContainer>
  );
}
