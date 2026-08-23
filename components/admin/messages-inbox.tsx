"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Trash2, Mail, MailOpen, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";

type Message = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export function MessagesInbox({ initialMessages }: { initialMessages: Message[] }) {
  const router = useRouter();
  const [messages, setMessages] = React.useState(initialMessages);
  const [openId, setOpenId] = React.useState<string | null>(null);

  React.useEffect(() => setMessages(initialMessages), [initialMessages]);

  async function toggleOpen(msg: Message) {
    const nowOpen = openId === msg.id ? null : msg.id;
    setOpenId(nowOpen);
    if (nowOpen && !msg.isRead) {
      setMessages((prev) => prev.map((m) => (m.id === msg.id ? { ...m, isRead: true } : m)));
      try {
        await fetch(`/api/messages/${msg.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isRead: true }),
        });
        router.refresh();
      } catch {
        /* non-critical */
      }
    }
  }

  async function deleteMessage(id: string) {
    try {
      const res = await fetch(`/api/messages/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Message deleted");
      setMessages((prev) => prev.filter((m) => m.id !== id));
      router.refresh();
    } catch {
      toast.error("Failed to delete message");
    }
  }

  if (messages.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-10 text-center text-muted-foreground">
        No messages yet. Submissions from the contact form will appear here.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card divide-y divide-border">
      {messages.map((msg) => (
        <div key={msg.id}>
          <button onClick={() => toggleOpen(msg)} className="w-full flex items-center gap-3 p-4 text-left hover:bg-secondary/30 transition-colors">
            {msg.isRead ? <MailOpen className="h-4 w-4 text-muted-foreground shrink-0" /> : <Mail className="h-4 w-4 text-primary shrink-0" />}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className={`text-sm ${msg.isRead ? "font-medium" : "font-bold"}`}>{msg.subject}</span>
              </div>
              <p className="text-xs text-muted-foreground truncate">{msg.name} · {msg.email}</p>
            </div>
            <span className="text-xs text-muted-foreground shrink-0">{formatDate(msg.createdAt)}</span>
            <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${openId === msg.id ? "rotate-180" : ""}`} />
          </button>
          {openId === msg.id && (
            <div className="px-4 pb-4">
              <div className="rounded-lg bg-secondary/40 p-4 text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</div>
              <div className="flex justify-end mt-3">
                <button onClick={() => deleteMessage(msg.id)} className="inline-flex items-center gap-1.5 text-xs text-destructive hover:underline">
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
