import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const Settings = () => {
  const { toast } = useToast();
  const [theme, setTheme] = useState("dark");

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
    exit: { opacity: 0 }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 }
  };

  const handleBackupData = () => {
    // In a real app, this would create a JSON export of the database
    toast({
      title: "Data Exported",
      description: "Your study data has been backed up to your device",
    });
  };

  const handleClearData = () => {
    // This would clear the database in a real app
    toast({
      title: "Warning",
      description: "This action cannot be undone. Please backup your data first.",
      variant: "destructive",
    });
  };

  return (
    <motion.div
      className="min-h-screen pb-24"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
    >
      {/* Header with gradient */}
      <motion.div 
        className="bg-gradient-to-b from-[#1E1E1E] to-[#121212] py-6 px-5 mb-6"
        variants={itemVariants}
      >
        <h1 className="text-2xl font-bold text-[#E0E0E0]">Settings</h1>
        <p className="text-[#AAAAAA] text-sm mt-1">
          Customize your study experience
        </p>
      </motion.div>

      {/* Main Content */}
      <main className="px-5">
        <motion.div variants={itemVariants}>
          <Card className="bg-[#1E1E1E] border-[#333333] mb-6">
            <CardHeader>
              <CardTitle className="text-[#E0E0E0] flex items-center">
                <i className="ri-focus-2-line text-[#FF5252] mr-2"></i>
                Study Focus
              </CardTitle>
              <CardDescription className="text-[#AAAAAA]">Configure your study environment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Focus Session Length</Label>
                <div className="flex items-center space-x-3">
                  <Slider
                    defaultValue={[25]}
                    max={60}
                    min={5}
                    step={5}
                    className="flex-1"
                  />
                  <span className="text-sm">25 min</span>
                </div>
                <p className="text-xs text-[#AAAAAA]">Length of your focus periods in the Pomodoro timer</p>
              </div>
              
              <div className="space-y-2">
                <Label>Break Length</Label>
                <div className="flex items-center space-x-3">
                  <Slider
                    defaultValue={[5]}
                    max={20}
                    min={1}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-sm">5 min</span>
                </div>
                <p className="text-xs text-[#AAAAAA]">Length of your break periods in the Pomodoro timer</p>
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-start-breaks" className="flex flex-col space-y-1">
                  <span>Auto-start Breaks</span>
                  <span className="font-normal text-xs text-[#AAAAAA]">Automatically start breaks after focus sessions</span>
                </Label>
                <Switch id="auto-start-breaks" defaultChecked />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-[#1E1E1E] border-[#333333] mb-6">
            <CardHeader>
              <CardTitle className="text-[#E0E0E0] flex items-center">
                <i className="ri-user-settings-line text-[#FF5252] mr-2"></i>
                Preferences
              </CardTitle>
              <CardDescription className="text-[#AAAAAA]">Customize your experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="display-mode">Display Mode</Label>
                <Select 
                  value="compact" 
                  onValueChange={() => {}}
                >
                  <SelectTrigger id="display-mode" className="bg-[#252525] border-[#333333] text-[#E0E0E0] w-full">
                    <SelectValue placeholder="Select mode" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#252525] border-[#333333] text-[#E0E0E0]">
                    <SelectItem value="compact">Compact</SelectItem>
                    <SelectItem value="comfortable">Comfortable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="theme">App Theme</Label>
                <Select 
                  value={theme} 
                  onValueChange={setTheme}
                >
                  <SelectTrigger id="theme" className="bg-[#252525] border-[#333333] text-[#E0E0E0] w-full">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#252525] border-[#333333] text-[#E0E0E0]">
                    <SelectItem value="dark">Dark</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-[#AAAAAA]">Currently only dark theme is available</p>
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-archive" className="flex flex-col space-y-1">
                  <span>Auto-archive Completed Sessions</span>
                  <span className="font-normal text-xs text-[#AAAAAA]">Automatically archive sessions after completion</span>
                </Label>
                <Switch id="auto-archive" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-[#1E1E1E] border-[#333333] mb-6">
            <CardHeader>
              <CardTitle className="text-[#E0E0E0] flex items-center">
                <i className="ri-database-2-line text-[#FF5252] mr-2"></i>
                Data Management
              </CardTitle>
              <CardDescription className="text-[#AAAAAA]">Export or clear your study data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                variant="outline" 
                className="w-full bg-[#252525] border-[#333333] text-[#E0E0E0] hover:bg-[#333333]"
                onClick={handleBackupData}
              >
                <i className="ri-download-line mr-2"></i>
                Backup Data
              </Button>
              
              <Separator className="bg-[#333333]" />
              
              <Button 
                variant="destructive" 
                className="w-full"
                onClick={handleClearData}
              >
                <i className="ri-delete-bin-line mr-2"></i>
                Clear All Data
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-[#1E1E1E] border-[#333333]">
            <CardHeader>
              <CardTitle className="text-[#E0E0E0] flex items-center">
                <i className="ri-information-line text-[#FF5252] mr-2"></i>
                About
              </CardTitle>
              <CardDescription className="text-[#AAAAAA]">Application information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center mb-2">
                <div className="w-10 h-10 bg-[#FF5252] rounded-lg flex items-center justify-center mr-3">
                  <i className="ri-brain-line text-white text-xl"></i>
                </div>
                <div>
                  <h3 className="font-medium text-[#E0E0E0]">Second Brain</h3>
                  <p className="text-xs text-[#AAAAAA]">v1.0.0</p>
                </div>
              </div>
              <p className="text-sm text-[#AAAAAA]">A client-side study planning application</p>
              <p className="text-sm text-[#AAAAAA]">All data is stored locally on your device</p>
              <p className="text-sm text-[#AAAAAA] mt-2">Built with React, TypeScript, TailwindCSS, and Dexie.js</p>
              
              <div className="mt-4 pt-4 border-t border-[#333333]">
                <h3 className="text-sm font-medium text-[#E0E0E0] mb-2">Connect with the Developer:</h3>
                <div className="flex space-x-3">
                  <a 
                    href="https://github.com/kamleshp214" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center px-3 py-2 bg-[#252525] rounded-md text-[#E0E0E0] hover:bg-[#333333] transition-colors text-sm"
                  >
                    <i className="ri-github-fill mr-2"></i>
                    GitHub
                  </a>
                  <a 
                    href="https://www.linkedin.com/in/kamlesh-porwal-2b1a2a1a6/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center px-3 py-2 bg-[#252525] rounded-md text-[#E0E0E0] hover:bg-[#333333] transition-colors text-sm"
                  >
                    <i className="ri-linkedin-box-fill mr-2"></i>
                    LinkedIn
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </motion.div>
  );
};

export default Settings;
