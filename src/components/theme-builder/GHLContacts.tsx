import { Search, Filter, MoreVertical, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

interface GHLContactsProps {
  colors: ThemeColors;
  fonts: ThemeFonts;
}

const mockContacts = [
  { name: "Sarah Johnson", email: "sarah.j@example.com", phone: "(555) 123-4567", location: "New York, NY", tags: ["Lead", "Hot"] },
  { name: "Michael Chen", email: "m.chen@example.com", phone: "(555) 234-5678", location: "San Francisco, CA", tags: ["Customer"] },
  { name: "Emma Williams", email: "emma.w@example.com", phone: "(555) 345-6789", location: "Austin, TX", tags: ["Lead"] },
  { name: "David Brown", email: "d.brown@example.com", phone: "(555) 456-7890", location: "Chicago, IL", tags: ["Customer", "VIP"] },
];

export const GHLContacts = ({ colors, fonts }: GHLContactsProps) => {
  return (
    <div className="h-full w-full p-6" style={{ background: colors.background }}>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2" style={{ color: colors.text, fontFamily: fonts.heading }}>
          Contacts
        </h1>
        <p className="opacity-80" style={{ color: colors.text, fontFamily: fonts.body }}>
          Manage your contacts and leads
        </p>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50" style={{ color: colors.text }} />
          <Input 
            placeholder="Search contacts..."
            className="pl-10 border-0"
            style={{ background: colors.sidebar, color: colors.text, fontFamily: fonts.body }}
          />
        </div>
        <Button style={{ background: colors.sidebar, color: colors.text, fontFamily: fonts.body }}>
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
        <Button style={{ background: colors.primary, color: colors.text, fontFamily: fonts.body }}>
          Add Contact
        </Button>
      </div>

      <div className="rounded-lg overflow-hidden" style={{ background: colors.sidebar }}>
        <table className="w-full">
          <thead>
            <tr className="border-b" style={{ borderColor: colors.background }}>
              <th className="text-left p-4 font-semibold" style={{ color: colors.text, fontFamily: fonts.heading }}>Name</th>
              <th className="text-left p-4 font-semibold" style={{ color: colors.text, fontFamily: fonts.heading }}>Contact Info</th>
              <th className="text-left p-4 font-semibold" style={{ color: colors.text, fontFamily: fonts.heading }}>Location</th>
              <th className="text-left p-4 font-semibold" style={{ color: colors.text, fontFamily: fonts.heading }}>Tags</th>
              <th className="w-12 p-4"></th>
            </tr>
          </thead>
          <tbody>
            {mockContacts.map((contact, idx) => (
              <tr key={idx} className="border-b hover:opacity-80 transition-opacity" style={{ borderColor: colors.background }}>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-semibold" style={{ background: colors.primary, color: colors.text }}>
                      {contact.name[0]}
                    </div>
                    <span className="font-medium" style={{ color: colors.text, fontFamily: fonts.body }}>
                      {contact.name}
                    </span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm" style={{ color: colors.text, fontFamily: fonts.body }}>
                      <Mail className="w-3 h-3 opacity-50" />
                      {contact.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm" style={{ color: colors.text, fontFamily: fonts.body }}>
                      <Phone className="w-3 h-3 opacity-50" />
                      {contact.phone}
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2 text-sm" style={{ color: colors.text, fontFamily: fonts.body }}>
                    <MapPin className="w-3 h-3 opacity-50" />
                    {contact.location}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    {contact.tags.map((tag, tagIdx) => (
                      <span 
                        key={tagIdx}
                        className="px-2 py-1 rounded text-xs font-medium"
                        style={{ background: colors.accent, color: colors.text, fontFamily: fonts.body }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="p-4">
                  <Button variant="ghost" size="icon" style={{ color: colors.text }}>
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
