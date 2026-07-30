import { createContext } from "react";

export type TopicQuote = {
  content?: string;
  userName?: string;
  replyTime?: string;
  floor?: any;
  postId?: any;
};

export type TopicQuoteHandler = (quote: TopicQuote) => void;

const defaultQuoteHandler: TopicQuoteHandler = () => {};

export const QuoteContext =
  createContext<TopicQuoteHandler>(defaultQuoteHandler);
export const QuoteTraceContext =
  createContext<TopicQuoteHandler>(defaultQuoteHandler);
