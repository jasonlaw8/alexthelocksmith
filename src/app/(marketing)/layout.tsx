import { SiteHeader } from "@/components/site-header";
import { ChatWidget } from "@/components/chat-widget";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="font-sans">
      <SiteHeader />
      {children}
      <ChatWidget />
    </div>
  );
}
