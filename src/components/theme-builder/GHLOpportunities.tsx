import { Plus, DollarSign, Clock } from "lucide-react";
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

interface GHLOpportunitiesProps {
  colors: ThemeColors;
  fonts: ThemeFonts;
}

const pipelineStages = [
  { 
    name: "New Leads", 
    opportunities: [
      { name: "Website Redesign", value: "$5,000", company: "TechCo", daysInStage: 2 },
      { name: "SEO Package", value: "$2,500", company: "RetailCo", daysInStage: 5 }
    ]
  },
  { 
    name: "Qualified", 
    opportunities: [
      { name: "Marketing Campaign", value: "$10,000", company: "StartupXYZ", daysInStage: 8 }
    ]
  },
  { 
    name: "Proposal Sent", 
    opportunities: [
      { name: "Full Stack Dev", value: "$15,000", company: "FinanceCo", daysInStage: 3 },
      { name: "Brand Strategy", value: "$7,500", company: "FashionBrand", daysInStage: 12 }
    ]
  },
  { 
    name: "Negotiation", 
    opportunities: [
      { name: "CRM Integration", value: "$8,000", company: "SalesCorp", daysInStage: 4 }
    ]
  }
];

export const GHLOpportunities = ({ colors, fonts }: GHLOpportunitiesProps) => {
  return (
    <div className="h-full w-full p-6 overflow-auto" style={{ background: colors.background }}>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: colors.text, fontFamily: fonts.heading }}>
            Opportunities
          </h1>
          <p className="opacity-80" style={{ color: colors.text, fontFamily: fonts.body }}>
            Sales Pipeline Overview
          </p>
        </div>
        <Button style={{ background: colors.primary, color: colors.text, fontFamily: fonts.body }}>
          <Plus className="w-4 h-4 mr-2" />
          New Opportunity
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {pipelineStages.map((stage, stageIdx) => (
          <div key={stageIdx} className="space-y-3">
            <div className="rounded-lg p-4" style={{ background: colors.sidebar }}>
              <h3 className="font-semibold mb-1" style={{ color: colors.text, fontFamily: fonts.heading }}>
                {stage.name}
              </h3>
              <p className="text-sm opacity-70" style={{ color: colors.text, fontFamily: fonts.body }}>
                {stage.opportunities.length} opportunities
              </p>
            </div>

            <div className="space-y-3">
              {stage.opportunities.map((opp, oppIdx) => (
                <div 
                  key={oppIdx}
                  className="rounded-lg p-4 cursor-pointer hover:opacity-90 transition-opacity"
                  style={{ background: colors.sidebar }}
                >
                  <h4 className="font-medium mb-2" style={{ color: colors.text, fontFamily: fonts.body }}>
                    {opp.name}
                  </h4>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4" style={{ color: colors.primary }} />
                    <span className="font-semibold" style={{ color: colors.primary, fontFamily: fonts.body }}>
                      {opp.value}
                    </span>
                  </div>

                  <div className="text-sm opacity-70 mb-2" style={{ color: colors.text, fontFamily: fonts.body }}>
                    {opp.company}
                  </div>

                  <div className="flex items-center gap-1 text-xs opacity-60" style={{ color: colors.text, fontFamily: fonts.body }}>
                    <Clock className="w-3 h-3" />
                    {opp.daysInStage} days in stage
                  </div>
                </div>
              ))}
            </div>

            <Button 
              variant="ghost" 
              className="w-full border-2 border-dashed"
              style={{ borderColor: colors.text, color: colors.text, fontFamily: fonts.body, opacity: 0.5 }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Card
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
