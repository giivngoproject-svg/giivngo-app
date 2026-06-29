import { Pencil, Link2, Users, CheckCircle2, Eye, Lock } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const heading = "font-[family-name:var(--font-poppins)]";

type Step = {
  num: number;
  title: string;
  cap: string;
  color: string;
  Icon: LucideIcon;
};

// NOTE: step.color is consumed inside an inline style={{}} (runtime value).
// Your CSS variables store bare RGB triplets, so they must be wrapped in
// rgb(...) here — rgb(var(--brand-strong)), NOT var(--brand-strong).
const STEPS: Step[] = [
  { num: 1, title: "Create your pool", cap: "Set a goal and add the details", color: "rgb(var(--brand-strong))", Icon: Pencil },
  { num: 2, title: "Share your link", cap: "Invite your people in seconds", color: "rgb(var(--accent-teal))", Icon: Link2 },
  { num: 3, title: "Everyone chips in", cap: "Contributions are safe and simple", color: "rgb(var(--accent-amber))", Icon: Users },
  { num: 4, title: "Goal reached", cap: "Enjoy the moment together!", color: "rgb(var(--accent-blue))", Icon: CheckCircle2 },
];

const CONTRIBUTORS = [
  { name: "You", amount: "$150", img: 11 },
  { name: "Sarah", amount: "$100", img: 45 },
  { name: "Tom", amount: "$100", img: 51 },
  { name: "Jess", amount: "$75", img: 5 },
  { name: "Mike", amount: "$75", img: 33 },
];

const BENEFITS = [
  { title: "No awkward asks", cap: "People chip in because they want to.", Icon: Users },
  { title: "Transparent", cap: "Everyone sees progress in real time.", Icon: Eye },
  { title: "Safe & secure", cap: "Your money is protected always.", Icon: Lock },
];

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-[1600px] px-6 py-12 sm:px-10 lg:px-16">
      <h2 className={`${heading} mb-8 text-5xl md:text-6xl font-extrabold text-foreground`}>
        How Giivngo works
      </h2>
      <div className="grid items-center gap-10 lg:grid-cols-2">
        {/* left: steps */}
        <div>
          <div className="flex justify-between gap-1.5">
            {STEPS.map((step, i) => (
              <div
                key={step.num}
                className="relative flex flex-1 flex-col items-center text-center"
              >
                {i < STEPS.length - 1 && (
                  // lavender-grey step connector — no clean token, kept inline
                  <div className="absolute left-1/2 top-[27px] z-0 h-0 w-full border-t-2 border-dashed border-[#D6D3E0]" />
                )}
                <div
                  className="relative z-[2] flex h-[54px] w-[54px] items-center justify-center rounded-full text-white"
                  style={{ background: step.color, boxShadow: `0 8px 20px ${step.color.replace(/\)$/, " / 0.4)")}` }}
                >
                  <step.Icon size={22} />
                </div>
                <div
                  className="absolute left-[calc(50%-30px)] top-10 z-[3] flex h-5 w-5 items-center justify-center rounded-full border-2 bg-white text-[10px] font-bold"
                  style={{ borderColor: step.color, color: step.color }}
                >
                  {step.num}
                </div>
                <h4 className={`${heading} mb-1 mt-3.5 text-[14.5px] font-semibold text-foreground`}>
                  {step.title}
                </h4>
                <p className="text-[12.5px] leading-snug text-muted">
                  {step.cap}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* right: phone + benefits */}
        <div className="flex flex-col items-center gap-7 rounded-[22px] bg-brand/10 p-8 sm:flex-row">
          {/* phone */}
          <div className="w-[218px] flex-[0_0_218px] rounded-[34px] bg-gray-900 p-2.5 shadow-[0_18px_40px_rgba(30,27,75,0.28)]">
            <div className="overflow-hidden rounded-[26px] bg-white">
              <div className="relative h-[22px] bg-white">
                <div className="absolute left-1/2 top-[7px] h-[7px] w-16 -translate-x-1/2 rounded-full bg-gray-900" />
              </div>
              <div className="px-4 pb-[18px] pt-3.5">
                <h5 className={`${heading} text-[15px] font-bold text-foreground`}>
                  Weekend away 🏖️
                </h5>
                <div className="my-1.5 mb-3 inline-flex items-center rounded-full bg-accentTeal/10 px-2.5 py-1 text-[11px] font-semibold text-accentTeal">
                  Trip ready! 🎉
                </div>
                {CONTRIBUTORS.map((c) => (
                  <div
                    key={c.name}
                    className="flex items-center justify-between border-t border-border py-[7px]"
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={`https://i.pravatar.cc/60?img=${c.img}`}
                        alt=""
                        className="h-6 w-6 rounded-full object-cover"
                      />
                      <span className="text-xs text-foreground">
                        <b className="font-semibold">{c.name}</b>{" "}
                        <span className="text-[10.5px] text-gray-400">contributed</span>
                      </span>
                    </div>
                    <span className="text-xs font-bold text-foreground">{c.amount}</span>
                  </div>
                ))}
                <p className="mt-2.5 text-[11px] text-gray-400">+3 more</p>
              </div>
            </div>
          </div>

          {/* benefits */}
          <div className="flex flex-1 flex-col gap-[22px]">
            {BENEFITS.map((b) => (
              <div key={b.title} className="flex items-start gap-3">
                <div className="flex h-[38px] w-[38px] flex-[0_0_38px] items-center justify-center rounded-full bg-white shadow-[0_4px_12px_rgba(15,23,42,0.08)]">
                  <b.Icon size={18} className="text-muted" />
                </div>
                <div>
                  <h4 className={`${heading} mb-0.5 text-[15px] font-semibold text-foreground`}>
                    {b.title}
                  </h4>
                  <p className="text-[13px] leading-snug text-muted">{b.cap}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
