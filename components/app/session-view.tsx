'use client';

import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useSessionContext, useSessionMessages } from '@livekit/components-react';
import type { AppConfig } from '@/app-config';
import {
  AgentControlBar,
  type AgentControlBarControls,
} from '@/components/agents-ui/agent-control-bar';
import { ToolCallVisualizer } from '@/components/agents-ui/tool-call-visualizer';
import { ChatTranscript } from '@/components/app/chat-transcript';
import { TileLayout } from '@/components/app/tile-layout';
import { cn } from '@/lib/shadcn/utils';
// import { useToolCallTracker } from '@/hooks/use-tool-call-tracker';
import { Shimmer } from '../ai-elements/shimmer';
import { useDataChannel } from "@livekit/components-react";

type ToolEvent = {
  type: "tool_event";
  tool: string;
  phase: "start" | "success" | "error";
  payload?: any;
  timestamp: number;
};

function ToolActivity({ events }: { events: ToolEvent[] }) {
  return (
    <div className="border p-3 rounded" style={{ maxHeight: '100%', overflowY: 'auto' }}>
      <h3 className="font-bold mb-2">Tool Activity</h3>

      {events.map((e, i) => (
        <div key={i} className="text-sm mb-1">
          {e.phase === "start" && "🛠"}
          {e.phase === "success" && "✅"}
          {e.phase === "error" && "❌"}

          <span className="ml-2 font-mono">{e.tool}</span>

          {e.phase !== "start" && e.payload && (
            <span className="ml-2 text-gray-600">
              <pre className="whitespace-pre-wrap text-xs font-mono bg-muted/30 px-2 py-1 rounded">
                {JSON.stringify(e.payload, null, 2)}
              </pre>
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

const MotionBottom = motion.create('div');

const MotionMessage = motion.create(Shimmer);

const BOTTOM_VIEW_MOTION_PROPS = {
  variants: {
    visible: {
      opacity: 1,
      translateY: '0%',
    },
    hidden: {
      opacity: 0,
      translateY: '100%',
    },
  },
  initial: 'hidden',
  animate: 'visible',
  exit: 'hidden',
  transition: {
    duration: 0.3,
    delay: 0.5,
    ease: 'easeOut',
  },
};

const SHIMMER_MOTION_PROPS = {
  variants: {
    visible: {
      opacity: 1,
      transition: {
        ease: 'easeIn',
        duration: 0.5,
        delay: 0.8,
      },
    },
    hidden: {
      opacity: 0,
      transition: {
        ease: 'easeIn',
        duration: 0.5,
        delay: 0,
      },
    },
  },
  initial: 'hidden',
  animate: 'visible',
  exit: 'hidden',
};

interface FadeProps {
  top?: boolean;
  bottom?: boolean;
  className?: string;
}

export function Fade({ top = false, bottom = false, className }: FadeProps) {
  return (
    <div
      className={cn(
        'from-background pointer-events-none h-4 bg-linear-to-b to-transparent',
        top && 'bg-linear-to-b',
        bottom && 'bg-linear-to-t',
        className
      )}
    />
  );
}

interface SessionViewProps {
  appConfig: AppConfig;
}

export const SessionView = ({
  appConfig,
  ...props
}: React.ComponentProps<'section'> & SessionViewProps) => {
  const session = useSessionContext();
  const { messages } = useSessionMessages(session);
  const [chatOpen, setChatOpen] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  // const { toolCalls } = useToolCallTracker();
  const [toolEvents, setToolEvents] = useState<ToolEvent[]>([]);
  const [callSummary, setCallSummary] = useState("");
  // const { message } = useDataChannel("tool_event")
  // console.log("Tool events: ", toolEvents)


  // console.log(messages, toolCalls)
  // useEffect(() => {
  //   if (message) {
  //     const decoder = new TextDecoder();
  //     const textMessage = decoder.decode(message.payload);
  //     console.log(`Received message from ${message}: ${textMessage}`);
  //   }
  // }, [message]);

  const controls: AgentControlBarControls = {
    leave: true,
    microphone: true,
    chat: appConfig.supportsChatInput,
    camera: appConfig.supportsVideoInput,
    screenShare: appConfig.supportsScreenShare,
  };

  useEffect(() => {
    const lastMessage = messages.at(-1);
    const lastMessageIsLocal = lastMessage?.from?.isLocal === true;

    if (scrollAreaRef.current && lastMessageIsLocal) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // useEffect(() => {
  //   console.log(session)
  //   if (!session.isConnected) {
  //     // Backend closed the session or connection was lost
  //     console.log('Session disconnected');
  //     session.end();
  //   }
  // }, [session]);


  useDataChannel((msg) => {
    console.log("useDataChannel: ", msg)
    const data = JSON.parse(new TextDecoder().decode(msg.payload));

    if (data.type === "tool_event") {
      setToolEvents(prev => [...prev, data]);
    } else if (data.type === "call_summary") {
      setCallSummary(data.summary)
    }
  });


  return (
    <section className="bg-background relative z-10 h-svh w-svw overflow-hidden" {...props}>
      <Fade top className="absolute inset-x-4 top-0 z-10 h-40" />
      {/* Tool Call Visualizer */}
      <div className="fixed top-4 right-4 z-40 w-80 max-w-[calc(100vw-2rem)]" style={{ height: '70vh'}}>
        {/* <ToolCallVisualizer toolCalls={toolCalls} maxVisible={5} /> */}
        <ToolActivity events={toolEvents}/>
        {callSummary != "" && <div className="border p-3 rounded" style={{ maxHeight: '100%', overflowY: 'auto' }}>
          {callSummary}
        </div>
        }
      </div>
      {/* transcript */}
      <ChatTranscript
        hidden={!chatOpen}
        messages={messages}
        className="space-y-3 transition-opacity duration-300 ease-out"
      />
      {/* Tile layout */}
      <TileLayout chatOpen={chatOpen} />
      {/* Bottom */}
      <MotionBottom
        {...BOTTOM_VIEW_MOTION_PROPS}
        className="fixed inset-x-3 bottom-0 z-50 md:inset-x-12"
      >
        {/* Pre-connect message */}
        {appConfig.isPreConnectBufferEnabled && (
          <AnimatePresence>
            {messages.length === 0 && (
              <MotionMessage
                key="pre-connect-message"
                duration={2}
                aria-hidden={messages.length > 0}
                {...SHIMMER_MOTION_PROPS}
                className="pointer-events-none mx-auto block w-full max-w-2xl pb-4 text-center text-sm font-semibold"
              >
                Agent is listening, ask it a question
              </MotionMessage>
            )}
          </AnimatePresence>
        )}
        <div className="bg-background relative mx-auto max-w-2xl pb-3 md:pb-12">
          <Fade bottom className="absolute inset-x-0 top-0 h-4 -translate-y-full" />
          <AgentControlBar
            variant="livekit"
            controls={controls}
            isChatOpen={chatOpen}
            isConnected={session.isConnected}
            onDisconnect={session.end}
            onIsChatOpenChange={setChatOpen}
          />
        </div>
      </MotionBottom>
    </section>
  );
};
