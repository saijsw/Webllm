import { WebWorkerMLCEngineHandler } from "@mlc-ai/web-llm";

// A worker that handles WebLLM requests
const handler = new WebWorkerMLCEngineHandler();
self.onmessage = (msg: MessageEvent) => {
  handler.onmessage(msg);
};
