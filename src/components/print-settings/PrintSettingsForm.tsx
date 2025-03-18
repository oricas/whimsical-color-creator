
import React from "react";
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui-custom/Card";
import PageSizeSelector from "./PageSizeSelector";
import OutlineThicknessSelector from "./OutlineThicknessSelector";
import OutlineColorSelector from "./OutlineColorSelector";
import CopiesCounter from "./CopiesCounter";

type SizeOption = "A4" | "A3";
type ThicknessOption = "thin" | "medium" | "thick";
type ColorOption = "black" | "gray" | "blue";

interface PrintSettings {
  pageSize: SizeOption;
  outlineThickness: ThicknessOption;
  outlineColor: ColorOption;
  copies: number;
}

interface PrintSettingsFormProps {
  settings: PrintSettings;
  onUpdateSettings: (settings: PrintSettings) => void;
}

const PrintSettingsForm: React.FC<PrintSettingsFormProps> = ({
  settings,
  onUpdateSettings
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Page Settings</CardTitle>
        <CardDescription>
          Customize the appearance of your coloring page
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <PageSizeSelector 
          value={settings.pageSize} 
          onChange={(value) => onUpdateSettings({...settings, pageSize: value})}
        />
        
        <OutlineThicknessSelector 
          value={settings.outlineThickness} 
          onChange={(value) => onUpdateSettings({...settings, outlineThickness: value})}
        />
        
        <OutlineColorSelector 
          value={settings.outlineColor} 
          onChange={(value) => onUpdateSettings({...settings, outlineColor: value})}
        />
        
        <CopiesCounter 
          value={settings.copies} 
          onChange={(value) => onUpdateSettings({...settings, copies: value})}
        />
      </CardContent>
    </Card>
  );
};

export default PrintSettingsForm;
