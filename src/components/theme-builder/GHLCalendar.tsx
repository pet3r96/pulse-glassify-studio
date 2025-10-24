import { ChevronLeft, ChevronRight, Clock, Video, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  sidebar: string;
  text: string;
}

interface ThemeFonts {
  heading: string;
  body: string;
}

interface GHLCalendarProps {
  colors: ThemeColors;
  fonts: ThemeFonts;
}

const mockEvents = [
  { time: "9:00 AM", title: "Client Meeting", type: "video", duration: "1h" },
  { time: "11:30 AM", title: "Sales Call", type: "phone", duration: "30m" },
  { time: "2:00 PM", title: "Team Standup", type: "video", duration: "15m" },
  { time: "4:00 PM", title: "Strategy Session", type: "in-person", duration: "2h" },
];

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const hours = Array.from({ length: 12 }, (_, i) => `${i + 8}:00`);

export const GHLCalendar = ({ colors, fonts }: GHLCalendarProps) => {
  return (
    <div className="h-full w-full flex" style={{ background: colors.background }}>
      {/* Sidebar with upcoming events */}
      <div className="w-80 p-6 border-r" style={{ background: colors.sidebar, borderColor: colors.background }}>
        <h2 className="text-xl font-bold mb-4" style={{ color: colors.text, fontFamily: fonts.heading }}>
          Today's Schedule
        </h2>
        <p className="text-sm opacity-70 mb-6" style={{ color: colors.text, fontFamily: fonts.body }}>
          Wednesday, October 24, 2025
        </p>

        <div className="space-y-4">
          {mockEvents.map((event, idx) => (
            <div 
              key={idx}
              className="rounded-lg p-4 border-l-4"
              style={{ 
                background: colors.background,
                borderLeftColor: colors.primary
              }}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" style={{ color: colors.primary }} />
                  <span className="font-semibold text-sm" style={{ color: colors.text, fontFamily: fonts.body }}>
                    {event.time}
                  </span>
                </div>
                <span className="text-xs opacity-60" style={{ color: colors.text, fontFamily: fonts.body }}>
                  {event.duration}
                </span>
              </div>
              <h4 className="font-medium mb-1" style={{ color: colors.text, fontFamily: fonts.body }}>
                {event.title}
              </h4>
              <div className="flex items-center gap-1 text-xs opacity-60" style={{ color: colors.text, fontFamily: fonts.body }}>
                {event.type === "video" && <Video className="w-3 h-3" />}
                {event.type === "in-person" && <MapPin className="w-3 h-3" />}
                {event.type === "phone" && <Clock className="w-3 h-3" />}
                {event.type === "video" ? "Video Call" : event.type === "in-person" ? "In Person" : "Phone Call"}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main calendar view */}
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold" style={{ color: colors.text, fontFamily: fonts.heading }}>
            Calendar
          </h1>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" style={{ color: colors.text }}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <span className="font-semibold" style={{ color: colors.text, fontFamily: fonts.body }}>
              October 2025
            </span>
            <Button variant="ghost" size="icon" style={{ color: colors.text }}>
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="rounded-lg overflow-hidden" style={{ background: colors.sidebar }}>
          {/* Week header */}
          <div className="grid grid-cols-7 border-b" style={{ borderColor: colors.background }}>
            {weekDays.map((day, idx) => (
              <div 
                key={idx}
                className="p-4 text-center font-semibold"
                style={{ color: colors.text, fontFamily: fonts.heading }}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 auto-rows-fr">
            {Array.from({ length: 35 }, (_, i) => {
              const dayNum = i - 2 + 1;
              const isCurrentMonth = dayNum > 0 && dayNum <= 31;
              const isToday = dayNum === 24;
              
              return (
                <div 
                  key={i}
                  className="min-h-24 p-2 border-r border-b hover:opacity-80 transition-opacity cursor-pointer"
                  style={{ 
                    borderColor: colors.background,
                    background: isToday ? colors.primary : 'transparent',
                    opacity: isCurrentMonth ? 1 : 0.3
                  }}
                >
                  {isCurrentMonth && (
                    <span 
                      className="text-sm font-medium"
                      style={{ 
                        color: isToday ? colors.background : colors.text,
                        fontFamily: fonts.body 
                      }}
                    >
                      {dayNum}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
