import type { PersonalInfo } from "@/lib/types";

function displayUrl(url: string): string {
  return url.replace(/^https?:\/\//, "");
}

interface Props {
  personalInfo: PersonalInfo;
}

export default function ResumeHeader({ personalInfo }: Props) {
  const { fullName, title, email, phone, location, linkedin, github, portfolio } =
    personalInfo;

  const contactItems: { label: string; href?: string }[] = [];
  if (email) contactItems.push({ label: email, href: `mailto:${email}` });
  if (phone) contactItems.push({ label: phone, href: `tel:${phone}` });
  if (location) contactItems.push({ label: location });
  if (linkedin) contactItems.push({ label: displayUrl(linkedin), href: linkedin });
  if (github) contactItems.push({ label: displayUrl(github), href: github });
  if (portfolio) contactItems.push({ label: displayUrl(portfolio), href: portfolio });

  return (
    <header className="text-center mb-6">
      {fullName && (
        <h1 className="text-[28px] font-bold text-zinc-900 leading-tight">
          {fullName}
        </h1>
      )}
      {title && (
        <p className="text-[15px] text-zinc-600 mt-1">{title}</p>
      )}
      {contactItems.length > 0 && (
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-0.5 mt-2">
          {contactItems.map((item, i) => (
            <span key={i} className="flex items-center gap-3">
              {i > 0 && (
                <span className="text-zinc-300 select-none" aria-hidden>·</span>
              )}
              {item.href ? (
                <a
                  href={item.href}
                  target={item.href.startsWith("mailto") || item.href.startsWith("tel") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  className="text-[12px] text-zinc-500 hover:text-zinc-800 transition-colors"
                >
                  {item.label}
                </a>
              ) : (
                <span className="text-[12px] text-zinc-500">{item.label}</span>
              )}
            </span>
          ))}
        </div>
      )}
    </header>
  );
}
