"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { formatDistanceToNowStrict } from "date-fns";
import { CheckCircle2, Building2, Banknote } from "lucide-react";
import { useRequireAuth } from "@/lib/mock/auth";
import { useAuth } from "@/stores/auth";
import { useCampaigns } from "@/stores/campaigns";
import { uploadImage } from "@/lib/mock/storage";
import { formatAUD } from "@/lib/money";
import { toast } from "@/stores/toast";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Avatar } from "@/components/nav/TopNav";
import { StatusBadge } from "@/components/ui/Badge";

export default function ProfilePage() {
  const user = useRequireAuth();
  const updateUser = useAuth((s) => s.updateUser);
  const campaigns = useCampaigns((s) => s.campaigns);
  const contributions = useCampaigns((s) => s.contributions);

  const [tab, setTab] = useState<"created" | "contributed">("created");
  const [connectOpen, setConnectOpen] = useState(false);

  const mine = useMemo(
    () => (user ? campaigns.filter((c) => c.user_id === user.id) : []),
    [campaigns, user],
  );
  const myContributions = useMemo(
    () => (user ? contributions.filter((c) => c.contributor_email === user?.email) : []),
    [contributions, user],
  );

  if (!user) return null;

  const handleAvatar = async (file: File) => {
    const url = await uploadImage(file);
    updateUser({ avatar_url: url });
    toast.success("Profile photo updated");
  };

  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-10">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Your profile</h1>

      {/* Profile card */}
      <div className="rounded-3xl border border-border bg-background p-6">
        <div className="flex items-center gap-4">
          <label className="cursor-pointer relative group">
            <Avatar name={user.name} url={user.avatar_url} size={64} />
            <span className="absolute inset-0 rounded-full bg-black/40 text-white text-[10px] font-medium flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              Change
            </span>
            <input
              type="file"
              accept="image/jpeg,image/png"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void handleAvatar(f);
                e.target.value = "";
              }}
            />
          </label>
          <div className="flex-1 min-w-0">
            <p className="font-semibold">{user.name}</p>
            <p className="text-sm text-muted">{user.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
          <Input
            label="Full name"
            value={user.name}
            onChange={(e) => updateUser({ name: e.target.value })}
          />
          <Input
            label="Display name"
            value={user.display_name || ""}
            onChange={(e) => updateUser({ display_name: e.target.value })}
            hint="Shown on the public campaign pages."
          />
          <Input
            label="Email"
            type="email"
            value={user.email}
            onChange={(e) => updateUser({ email: e.target.value })}
          />
          <Input
            label="Mobile"
            type="tel"
            value={user.phone || ""}
            onChange={(e) => updateUser({ phone: e.target.value })}
          />
        </div>
      </div>

      {/* Bank account */}
      <div className="rounded-3xl border border-border bg-background p-6 mt-5">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-accent/15 text-accent flex items-center justify-center shrink-0">
            <Banknote size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold">Bank account for payouts</p>
            <p className="text-sm text-muted mt-0.5">
              {user.stripe_account_id
                ? "Connected via Stripe Connect Express"
                : "Connect a bank account to receive payouts when your campaigns end."}
            </p>
            {user.stripe_account_id && (
              <p className="text-xs text-muted mt-1 font-mono">{user.stripe_account_id}</p>
            )}
          </div>
          {user.stripe_account_id ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full shrink-0">
              <CheckCircle2 size={12} />
              Connected
            </span>
          ) : (
            <Button variant="outline" onClick={() => setConnectOpen(true)}>
              Connect
            </Button>
          )}
        </div>
      </div>

      {/* History */}
      <div className="mt-8">
        <div className="border-b border-border flex">
          <TabBtn active={tab === "created"} onClick={() => setTab("created")}>
            Campaigns ({mine.length})
          </TabBtn>
          <TabBtn active={tab === "contributed"} onClick={() => setTab("contributed")}>
            Contributions ({myContributions.length})
          </TabBtn>
        </div>

        <div className="mt-5">
          {tab === "created" ? (
            mine.length === 0 ? (
              <p className="text-sm text-muted text-center py-8">No campaigns yet.</p>
            ) : (
              <ul className="divide-y divide-border">
                {mine.map((c) => (
                  <li key={c.id} className="py-3 flex items-center justify-between gap-3">
                    <Link
                      href={`/manage/${c.slug}`}
                      className="font-medium hover:underline truncate"
                    >
                      {c.title}
                    </Link>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-sm tabular-nums">{formatAUD(c.raised_amount)}</span>
                      <StatusBadge status={c.status} />
                    </div>
                  </li>
                ))}
              </ul>
            )
          ) : myContributions.length === 0 ? (
            <p className="text-sm text-muted text-center py-8">
              No contributions yet. When you contribute with your email on a public page, it&apos;ll show here.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {myContributions.map((c) => {
                const camp = campaigns.find((x) => x.id === c.campaign_id);
                return (
                  <li key={c.id} className="py-3 flex items-center justify-between gap-3">
                    <Link
                      href={camp ? `/campaign/${camp.slug}` : "#"}
                      className="font-medium hover:underline truncate"
                    >
                      {camp?.title || "Unknown campaign"}
                    </Link>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-sm tabular-nums">{formatAUD(c.amount)}</span>
                      <span className="text-xs text-muted">
                        {formatDistanceToNowStrict(new Date(c.created_at))} ago
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      <ConnectModal
        open={connectOpen}
        onClose={() => setConnectOpen(false)}
        onComplete={() => {
          updateUser({ stripe_account_id: `acct_mock_${Math.random().toString(36).slice(2, 10)}` });
          toast.success("Bank account connected", "You can now receive payouts");
          setConnectOpen(false);
        }}
      />
    </div>
  );
}

function TabBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
        active ? "border-accent text-foreground" : "border-transparent text-muted hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function ConnectModal({
  open,
  onClose,
  onComplete,
}: {
  open: boolean;
  onClose: () => void;
  onComplete: () => void;
}) {
  const [step, setStep] = useState(0);
  const [bsb, setBsb] = useState("083-004");
  const [acct, setAcct] = useState("12345678");
  const [name, setName] = useState("Alex Morgan");

  const close = () => {
    setStep(0);
    onClose();
  };

  return (
    <Modal open={open} onClose={close} title="Connect bank account">
      <div className="flex items-center gap-2 text-xs text-muted mb-4">
        <Building2 size={12} />
        Stripe Connect Express · simulated
      </div>
      {step === 0 && (
        <div className="space-y-3">
          <p className="text-sm">
            Stripe will verify your identity and set you up to receive payouts. This usually takes about 2 minutes.
          </p>
          <ul className="text-sm text-muted space-y-1 pl-4 list-disc">
            <li>Australian bank account (BSB + account number)</li>
            <li>Government ID, in real life — skipped in this demo</li>
            <li>2.5% platform fee deducted at payout</li>
          </ul>
          <div className="flex justify-end gap-2 mt-5">
            <Button variant="ghost" onClick={close}>
              Cancel
            </Button>
            <Button onClick={() => setStep(1)}>Continue</Button>
          </div>
        </div>
      )}
      {step === 1 && (
        <div className="space-y-3">
          <Input label="Account holder name" value={name} onChange={(e) => setName(e.target.value)} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="BSB" value={bsb} onChange={(e) => setBsb(e.target.value)} />
            <Input label="Account number" value={acct} onChange={(e) => setAcct(e.target.value)} />
          </div>
          <div className="flex justify-end gap-2 mt-5">
            <Button variant="ghost" onClick={() => setStep(0)}>
              Back
            </Button>
            <Button onClick={() => setStep(2)}>Continue</Button>
          </div>
        </div>
      )}
      {step === 2 && (
        <div className="space-y-3">
          <p className="text-sm">
            Confirm and submit. In production, Stripe would do micro-deposits to verify the account.
          </p>
          <dl className="text-sm bg-foreground/5 rounded-2xl p-4 space-y-1">
            <div className="flex justify-between">
              <dt className="text-muted">Holder</dt>
              <dd>{name}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">BSB</dt>
              <dd className="font-mono">{bsb}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Account</dt>
              <dd className="font-mono">{acct}</dd>
            </div>
          </dl>
          <div className="flex justify-end gap-2 mt-5">
            <Button variant="ghost" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button onClick={onComplete}>Submit</Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
