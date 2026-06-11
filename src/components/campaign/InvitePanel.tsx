"use client";

import { useState } from "react";
import { Mail, MessageSquare, MessageCircle, Link2, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import {
  sendEmailInvites,
  sendSmsInvites,
  openWhatsApp,
  copyToClipboard,
} from "@/lib/mock/invites";

type Tab = "email" | "sms" | "whatsapp" | "link";

export function InvitePanel({
  campaignId,
  shareUrl,
  campaignTitle,
}: {
  campaignId: string;
  shareUrl: string;
  campaignTitle: string;
}) {
  const [tab, setTab] = useState<Tab>("email");
  const [emails, setEmails] = useState("");
  const [emailMessage, setEmailMessage] = useState(
    `Hi! I'm collecting for "${campaignTitle}". Throw in whatever you can:`,
  );
  const [phones, setPhones] = useState("");
  const [isLoadingEmail, setIsLoadingEmail] = useState(false);
  const [isLoadingSms, setIsLoadingSms] = useState(false);

  const sendEmails = async () => {
    const list = emails
      .split(/[,\n]/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (list.length === 0) return;
    setIsLoadingEmail(true);
    try {
      await sendEmailInvites(campaignId, list, emailMessage, campaignTitle, shareUrl);
      setEmails("");
    } finally {
      setIsLoadingEmail(false);
    }
  };

  const sendSms = async () => {
    const list = phones
      .split(/[,\n]/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (list.length === 0) return;
    setIsLoadingSms(true);
    try {
      await sendSmsInvites(campaignId, list);
      setPhones("");
    } finally {
      setIsLoadingSms(false);
    }
  };

  return (
    <div className="rounded-3xl border border-border bg-background overflow-hidden">
      <div className="p-5 border-b border-border">
        <h3 className="font-semibold text-base">Invite contributors</h3>
        <p className="text-sm text-muted mt-0.5">Share the link any way you like.</p>
      </div>

      <div className="flex border-b border-border overflow-x-auto">
        <TabBtn active={tab === "email"} icon={<Mail size={14} />} onClick={() => setTab("email")}>
          Email
        </TabBtn>
        <TabBtn active={tab === "sms"} icon={<MessageSquare size={14} />} onClick={() => setTab("sms")}>
          SMS
        </TabBtn>
        <TabBtn
          active={tab === "whatsapp"}
          icon={<MessageCircle size={14} />}
          onClick={() => setTab("whatsapp")}
        >
          WhatsApp
        </TabBtn>
        <TabBtn active={tab === "link"} icon={<Link2 size={14} />} onClick={() => setTab("link")}>
          Copy link
        </TabBtn>
      </div>

      <div className="p-5">
        {tab === "email" && (
          <div className="space-y-3">
            <Textarea
              label="Email addresses"
              placeholder="alex@example.com, sam@example.com"
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
              hint="One per line, or separated by commas."
              rows={3}
              disabled={isLoadingEmail}
            />
            <Textarea
              label="Message"
              value={emailMessage}
              onChange={(e) => setEmailMessage(e.target.value)}
              rows={3}
              disabled={isLoadingEmail}
            />
            <Button onClick={sendEmails} disabled={isLoadingEmail}>
              {isLoadingEmail ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send size={14} />
                  Send invites
                </>
              )}
            </Button>
          </div>
        )}

        {tab === "sms" && (
          <div className="space-y-3">
            <Textarea
              label="Phone numbers"
              placeholder="+61 400 111 222, +61 411 333 444"
              value={phones}
              onChange={(e) => setPhones(e.target.value)}
              hint="One per line, or separated by commas. AU numbers preferred."
              rows={3}
              disabled={isLoadingSms}
            />
            <Button onClick={sendSms} disabled={isLoadingSms}>
              {isLoadingSms ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send size={14} />
                  Send SMS
                </>
              )}
            </Button>
          </div>
        )}

        {tab === "whatsapp" && (
          <div className="space-y-3">
            <p className="text-sm text-muted">
              Opens WhatsApp with a pre-filled message and your share link. Pick who to send it to from your contacts.
            </p>
            <Button
              onClick={() =>
                openWhatsApp(shareUrl, `Hey — I'm collecting for "${campaignTitle}":`)
              }
            >
              <MessageCircle size={14} />
              Open WhatsApp
            </Button>
          </div>
        )}

        {tab === "link" && (
          <div className="space-y-3">
            <Input
              label="Shareable link"
              value={shareUrl}
              readOnly
              onFocus={(e) => e.currentTarget.select()}
            />
            <Button onClick={() => copyToClipboard(shareUrl)}>
              <Link2 size={14} />
              Copy to clipboard
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function TabBtn({
  active,
  icon,
  onClick,
  children,
}: {
  active: boolean;
  icon: React.ReactNode;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 min-w-fit flex items-center justify-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
        active ? "border-accent text-foreground" : "border-transparent text-muted hover:text-foreground"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}
