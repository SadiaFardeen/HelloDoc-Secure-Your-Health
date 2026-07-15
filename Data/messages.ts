export interface Message {
  id: string;
  sender: "patient" | "doctor";
  text: string;
  time: string;
}

export const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    sender: "doctor",
    text: "Hello. I am ready for your consultation. How can I help you today?",
    time: "Now",
  },
];