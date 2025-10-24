import { LayoutDashboard, Users, Calendar, MessageSquare, Settings } from "lucide-react";
import { Card } from "@/components/ui/card";

interface GHLMockDashboardProps {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    sidebar: string;
    text: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
}

const GHLMockDashboard = ({ colors, fonts }: GHLMockDashboardProps) => {
  const customStyle = {
    "--theme-primary": colors.primary,
    "--theme-secondary": colors.secondary,
    "--theme-accent": colors.accent,
    "--theme-background": colors.background,
    "--theme-sidebar": colors.sidebar,
    "--theme-text": colors.text,
    "--theme-heading-font": fonts.heading,
    "--theme-body-font": fonts.body,
  } as React.CSSProperties;

  return (
    <div className="flex h-[600px]" style={customStyle}>
      {/* Sidebar */}
      <div
        className="w-64 p-4 space-y-2"
        style={{
          backgroundColor: colors.sidebar,
          color: colors.text,
          fontFamily: fonts.body,
        }}
      >
        <div className="mb-8">
          <h2
            className="text-xl font-bold"
            style={{ fontFamily: fonts.heading, color: colors.primary }}
          >
            GoHighLevel
          </h2>
        </div>
        
        {[
          { icon: LayoutDashboard, label: "Dashboard" },
          { icon: Users, label: "Contacts" },
          { icon: Calendar, label: "Calendar" },
          { icon: MessageSquare, label: "Conversations" },
          { icon: Settings, label: "Settings" },
        ].map((item, idx) => (
          <button
            key={idx}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:opacity-80 transition-all"
            style={{
              backgroundColor: idx === 0 ? colors.primary : "transparent",
              color: colors.text,
            }}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto" style={{ backgroundColor: colors.background }}>
        {/* Top Bar */}
        <div
          className="border-b p-4 flex items-center justify-between"
          style={{
            borderColor: `${colors.primary}33`,
            backgroundColor: `${colors.sidebar}80`,
          }}
        >
          <h1
            className="text-2xl font-bold"
            style={{ fontFamily: fonts.heading, color: colors.text }}
          >
            Dashboard
          </h1>
          <button
            className="px-4 py-2 rounded-lg font-medium"
            style={{
              backgroundColor: colors.primary,
              color: colors.text,
            }}
          >
            New Contact
          </button>
        </div>

        {/* Stats Cards */}
        <div className="p-6 grid grid-cols-3 gap-4">
          {[
            { label: "Total Contacts", value: "1,234", change: "+12%" },
            { label: "Active Campaigns", value: "8", change: "+2" },
            { label: "Revenue", value: "$45,678", change: "+23%" },
          ].map((stat, idx) => (
            <Card
              key={idx}
              className="p-4 border"
              style={{
                backgroundColor: `${colors.sidebar}40`,
                borderColor: `${colors.primary}33`,
              }}
            >
              <div className="text-sm opacity-70" style={{ color: colors.text, fontFamily: fonts.body }}>
                {stat.label}
              </div>
              <div className="text-2xl font-bold mt-2" style={{ color: colors.text, fontFamily: fonts.heading }}>
                {stat.value}
              </div>
              <div className="text-sm mt-1" style={{ color: colors.accent }}>
                {stat.change}
              </div>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="p-6">
          <h2
            className="text-xl font-semibold mb-4"
            style={{ fontFamily: fonts.heading, color: colors.text }}
          >
            Recent Activity
          </h2>
          <div className="space-y-2">
            {["New contact added", "Campaign sent", "Appointment scheduled", "Payment received"].map((activity, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg border"
                style={{
                  backgroundColor: `${colors.sidebar}20`,
                  borderColor: `${colors.primary}22`,
                  color: colors.text,
                  fontFamily: fonts.body,
                }}
              >
                {activity}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GHLMockDashboard;
