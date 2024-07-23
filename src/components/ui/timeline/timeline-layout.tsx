"use client";

import React from "react";
import {
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineTitle,
  TimelineIcon,
  TimelineDescription,
  TimelineContent,
  TimelineTime,
  TimelineSeparate,
} from "@/components/ui/timeline/timeline";

export interface TimelineElement {
  id: number;
  title: string;
  date: string;
  description: string;
}

interface TimelineLayoutProps {
  items: TimelineElement[]; // Replace any[] with the actual type of items.
}
export const TimelineLayout = ({ items }: TimelineLayoutProps) => {
  return (
    <Timeline className="w-full mt-4 lg:justify-center">
      <TimelineItem>
        <TimelineSeparate>
          <TimelineConnector />
        </TimelineSeparate>
        <TimelineContent />
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparate>
          <TimelineConnector />
        </TimelineSeparate>
        <TimelineContent />
      </TimelineItem>
      {items.map((item) => (
        <TimelineItem key={item.id}>
          <TimelineSeparate>
            <TimelineIcon />
            <TimelineConnector />
          </TimelineSeparate>
          <TimelineContent>
            <TimelineTitle>{item.title}</TimelineTitle>
            <TimelineDescription>{item.description}</TimelineDescription>
            <TimelineTime>{item.date}</TimelineTime>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
};
