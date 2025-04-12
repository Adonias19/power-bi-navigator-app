
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Palette, Upload } from "lucide-react";

const PRESET_COLORS = [
  { name: "Default Blue", primary: "#0078D4", secondary: "#00B7C3", accent: "#83B9F9" },
  { name: "Forest Green", primary: "#107C41", secondary: "#599B41", accent: "#AAD576" },
  { name: "Vivid Purple", primary: "#8B5CF6", secondary: "#A78BFA", accent: "#C4B5FD" },
  { name: "Modern Red", primary: "#E11D48", secondary: "#FB7185", accent: "#FEA3B4" },
  { name: "Dark Theme", primary: "#1E293B", secondary: "#334155", accent: "#475569" },
];

const FONT_OPTIONS = [
  { name: "Default (System UI)", value: "system-ui, sans-serif" },
  { name: "Inter", value: "Inter, sans-serif" },
  { name: "Roboto", value: "Roboto, sans-serif" },
  { name: "Poppins", value: "Poppins, sans-serif" },
  { name: "Playfair Display", value: "'Playfair Display', serif" },
];

const ThemeSettings: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("colors");
  const [primaryColor, setPrimaryColor] = useState("#0078D4");
  const [secondaryColor, setSecondaryColor] = useState("#00B7C3");
  const [accentColor, setAccentColor] = useState("#83B9F9");
  const [borderRadius, setBorderRadius] = useState([8]);
  const [selectedFont, setSelectedFont] = useState(FONT_OPTIONS[0].value);
  const [darkMode, setDarkMode] = useState(false);
  const [logo, setLogo] = useState<string | null>(null);

  const handlePresetSelect = (preset: typeof PRESET_COLORS[0]) => {
    setPrimaryColor(preset.primary);
    setSecondaryColor(preset.secondary);
    setAccentColor(preset.accent);
    
    toast({
      title: "Theme preset applied",
      description: `Applied the ${preset.name} theme preset.`
    });
  };

  const handleSaveTheme = () => {
    // In a real app, this would save to localStorage or a backend
    const themeSettings = {
      primaryColor,
      secondaryColor,
      accentColor,
      borderRadius: borderRadius[0],
      font: selectedFont,
      darkMode,
      logo
    };
    
    console.log("Saving theme settings:", themeSettings);
    
    // Apply theme changes
    document.documentElement.style.setProperty('--powerbi-primary', primaryColor);
    document.documentElement.style.setProperty('--powerbi-secondary', secondaryColor);
    document.documentElement.style.setProperty('--powerbi-accent', accentColor);
    
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    toast({
      title: "Theme settings saved",
      description: "Your theme changes have been applied successfully."
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogo(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold flex items-center">
          <Palette className="h-5 w-5 mr-2 text-powerbi-primary" />
          Theme Settings
        </h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="colors">Colors</TabsTrigger>
          <TabsTrigger value="typography">Typography</TabsTrigger>
          <TabsTrigger value="layout">Layout</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
        </TabsList>
        
        <TabsContent value="colors">
          <Card>
            <CardHeader>
              <CardTitle>Color Scheme</CardTitle>
              <CardDescription>
                Customize the primary colors used throughout the application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex items-center space-x-2 mt-1.5">
                    <div 
                      className="h-8 w-8 rounded-md border"
                      style={{ backgroundColor: primaryColor }}
                    ></div>
                    <Input
                      id="primaryColor"
                      type="text"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-full"
                    />
                    <Input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-12 h-8 p-0 cursor-pointer"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <div className="flex items-center space-x-2 mt-1.5">
                    <div 
                      className="h-8 w-8 rounded-md border"
                      style={{ backgroundColor: secondaryColor }}
                    ></div>
                    <Input
                      id="secondaryColor"
                      type="text"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="w-full"
                    />
                    <Input
                      type="color"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="w-12 h-8 p-0 cursor-pointer"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="accentColor">Accent Color</Label>
                  <div className="flex items-center space-x-2 mt-1.5">
                    <div 
                      className="h-8 w-8 rounded-md border"
                      style={{ backgroundColor: accentColor }}
                    ></div>
                    <Input
                      id="accentColor"
                      type="text"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="w-full"
                    />
                    <Input
                      type="color"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="w-12 h-8 p-0 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <Label>Color Presets</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mt-2">
                  {PRESET_COLORS.map((preset, index) => (
                    <Button 
                      key={index}
                      variant="outline"
                      className="h-auto p-2 flex flex-col items-center"
                      onClick={() => handlePresetSelect(preset)}
                    >
                      <div className="flex space-x-1 mb-1">
                        <div className="h-4 w-4 rounded-full" style={{ backgroundColor: preset.primary }}></div>
                        <div className="h-4 w-4 rounded-full" style={{ backgroundColor: preset.secondary }}></div>
                        <div className="h-4 w-4 rounded-full" style={{ backgroundColor: preset.accent }}></div>
                      </div>
                      <span className="text-xs">{preset.name}</span>
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="darkMode" 
                  checked={darkMode}
                  onCheckedChange={setDarkMode}
                />
                <Label htmlFor="darkMode">Enable Dark Mode</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="typography">
          <Card>
            <CardHeader>
              <CardTitle>Typography</CardTitle>
              <CardDescription>
                Choose the fonts and text styles for the application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="fontSelect">Application Font</Label>
                <select 
                  id="fontSelect"
                  className="w-full mt-1.5 rounded-md border border-input bg-background px-3 py-2"
                  value={selectedFont}
                  onChange={(e) => setSelectedFont(e.target.value)}
                >
                  {FONT_OPTIONS.map((font, index) => (
                    <option key={index} value={font.value}>
                      {font.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <Label>Preview</Label>
                <div 
                  className="p-4 mt-1.5 border rounded-md"
                  style={{ fontFamily: selectedFont }}
                >
                  <p className="text-2xl font-bold">Heading Text</p>
                  <p className="text-base">
                    This is an example paragraph that demonstrates how text will appear 
                    with the selected font family. The quick brown fox jumps over the lazy dog.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="layout">
          <Card>
            <CardHeader>
              <CardTitle>Layout Settings</CardTitle>
              <CardDescription>
                Configure the layout and visual styles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between">
                  <Label htmlFor="borderRadius">Border Radius</Label>
                  <span className="text-sm text-muted-foreground">{borderRadius[0]}px</span>
                </div>
                <Slider
                  id="borderRadius" 
                  min={0}
                  max={20}
                  step={1}
                  value={borderRadius}
                  onValueChange={setBorderRadius}
                  className="mt-2"
                />
                <div className="flex justify-between mt-2">
                  <span className="text-xs text-muted-foreground">Square</span>
                  <span className="text-xs text-muted-foreground">Rounded</span>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="border rounded p-4 text-center flex items-center justify-center" 
                     style={{ borderRadius: `${borderRadius[0]}px` }}>
                  <span className="text-sm">Card Preview</span>
                </div>
                <div className="border rounded p-4 text-center flex items-center justify-center bg-powerbi-primary text-white" 
                     style={{ borderRadius: `${borderRadius[0]}px` }}>
                  <span className="text-sm">Button Preview</span>
                </div>
                <div className="border rounded p-4 text-center flex items-center justify-center" 
                     style={{ borderRadius: `${borderRadius[0]}px`, backgroundColor: accentColor }}>
                  <span className="text-sm">Accent Preview</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="branding">
          <Card>
            <CardHeader>
              <CardTitle>Branding Assets</CardTitle>
              <CardDescription>
                Upload and manage your organization's branding assets
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="logoUpload">Application Logo</Label>
                <div className="mt-1.5 border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                  {logo ? (
                    <div className="text-center">
                      <img 
                        src={logo} 
                        alt="Uploaded logo" 
                        className="max-h-24 mx-auto mb-4" 
                      />
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setLogo(null)}
                      >
                        Remove Logo
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground mb-1">
                        Drag and drop your logo here, or click to browse
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Recommended: 200x50px in PNG or SVG format
                      </p>
                      <Input
                        id="logoUpload"
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="mt-4"
                        onClick={() => document.getElementById('logoUpload')?.click()}
                      >
                        Select File
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="mt-6 flex justify-end">
        <Button onClick={handleSaveTheme}>
          Save Theme Settings
        </Button>
      </div>
    </div>
  );
};

export default ThemeSettings;
