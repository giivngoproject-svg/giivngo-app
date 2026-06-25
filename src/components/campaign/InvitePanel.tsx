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
  const [tab, setTab] = useState<Tab>("link");
  const [emailChips, setEmailChips] = useState<string[]>([]);
  const [emailInput, setEmailInput] = useState("");
  const [emailMessage, setEmailMessage] = useState(
    `Hi! I'm collecting for "${campaignTitle}". Throw in whatever you can:`,
  );
  const [phoneChips, setPhoneChips] = useState<string[]>([]);
  const [phoneInput, setPhoneInput] = useState("");
  const [isLoadingEmail, setIsLoadingEmail] = useState(false);
  const [isLoadingSms, setIsLoadingSms] = useState(false);

  const addEmailChip = () => {
    if (emailInput.trim()) {
      setEmailChips([...emailChips, emailInput.trim()]);
      setEmailInput("");
    }
  };

  const removeEmailChip = (index: number) => {
    setEmailChips(emailChips.filter((_, i) => i !== index));
  };

  const addPhoneChip = () => {
    if (phoneInput.trim()) {
      setPhoneChips([...phoneChips, phoneInput.trim()]);
      setPhoneInput("");
    }
  };

  const removePhoneChip = (index: number) => {
    setPhoneChips(phoneChips.filter((_, i) => i !== index));
  };

  const sendEmails = async () => {
    if (emailChips.length === 0) return;
    setIsLoadingEmail(true);
    try {
      await sendEmailInvites(campaignId, emailChips, emailMessage, campaignTitle, shareUrl);
      setEmailChips([]);
    } finally {
      setIsLoadingEmail(false);
    }
  };

  const sendSms = async () => {
    if (phoneChips.length === 0) return;
    setIsLoadingSms(true);
    try {
      await sendSmsInvites(campaignId, phoneChips);
      setPhoneChips([]);
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
        <TabBtn active={tab === "link"} icon={<Link2 size={14} />} onClick={() => setTab("link")}>
          Copy link
        </TabBtn>
        <TabBtn
          active={tab === "whatsapp"}
          icon={<MessageCircle size={14} />}
          onClick={() => setTab("whatsapp")}
        >
          WhatsApp
        </TabBtn>
        <TabBtn active={tab === "email"} icon={<Mail size={14} />} onClick={() => setTab("email")}>
          Email
        </TabBtn>
        <TabBtn active={tab === "sms"} icon={<MessageSquare size={14} />} onClick={() => setTab("sms")}>
          SMS
        </TabBtn>
      </div>

      <div className="p-5">
        {tab === "email" && (
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium block mb-2">Email addresses</label>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="alex@example.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addEmailChip())}
                  disabled={isLoadingEmail}
                />
                <Button onClick={addEmailChip} disabled={isLoadingEmail} variant="outline">
                  Add
                </Button>
              </div>
              {emailChips.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {emailChips.map((email, idx) => (
                    <div
                      key={idx}
                      className="bg-accent/10 border border-accent/30 rounded-full px-3 py-1.5 text-sm flex items-center gap-2"
                    >
                      {email}
                      <button
                        onClick={() => removeEmailChip(idx)}
                        className="text-muted hover:text-foreground ml-1"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-xs text-muted">
                {emailChips.length} email{emailChips.length !== 1 ? "s" : ""} added
              </p>
            </div>
            <Textarea
              label="Message"
              value={emailMessage}
              onChange={(e) => setEmailMessage(e.target.value)}
              rows={3}
              disabled={isLoadingEmail}
            />
            <Button onClick={sendEmails} disabled={isLoadingEmail || emailChips.length === 0}>
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
            <div>
              <label className="text-sm font-medium block mb-2">Phone numbers</label>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="+61 400 111 222"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addPhoneChip())}
                  disabled={isLoadingSms}
                />
                <Button onClick={addPhoneChip} disabled={isLoadingSms} variant="outline">
                  Add
                </Button>
              </div>
              {phoneChips.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {phoneChips.map((phone, idx) => (
                    <div
                      key={idx}
                      className="bg-accent/10 border border-accent/30 rounded-full px-3 py-1.5 text-sm flex items-center gap-2"
                    >
                      {phone}
                      <button
                        onClick={() => removePhoneChip(idx)}
                        className="text-muted hover:text-foreground ml-1"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-xs text-muted">
                {phoneChips.length} number{phoneChips.length !== 1 ? "s" : ""} added
              </p>
            </div>
            <Button onClick={sendSms} disabled={isLoadingSms || phoneChips.length === 0}>
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
