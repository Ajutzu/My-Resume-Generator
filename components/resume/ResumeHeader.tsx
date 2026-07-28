import type { PersonalInfo } from "@/lib/types";

function displayUrl(url: string): string {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

interface Props {
  personalInfo: PersonalInfo;
}

export default function ResumeHeader({ personalInfo }: Props) {
  const { fullName, title, email, phone, location, linkedin, github, portfolio } =
    personalInfo;

  const contactItems: string[] = [];
  if (email)     contactItems.push(email);
  if (phone)     contactItems.push(phone);
  if (location)  contactItems.push(location);
  if (linkedin)  contactItems.push(displayUrl(linkedin));
  if (github)    contactItems.push(displayUrl(github));
  if (portfolio) contactItems.push(displayUrl(portfolio));

  return (
    <header style={{ textAlign: "center", marginBottom: "20px" }}>
      {fullName && (
        <h1 style={{ fontSize: "26px", fontWeight: "bold", color: "#111827", lineHeight: 1.2, margin: 0 }}>
          {fullName}
        </h1>
      )}
      {title && (
        <p style={{ fontSize: "14px", color: "#4b5563", marginTop: "4px", marginBottom: 0 }}>
          {title}
        </p>
      )}
      {contactItems.length > 0 && (
        <p style={{ fontSize: "11px", color: "#6b7280", marginTop: "6px", marginBottom: 0, lineHeight: 1.6 }}>
          {contactItems.join("  ·  ")}
        </p>
      )}
    </header>
  );
}
