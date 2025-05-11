import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { toast } = useToast();

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
      className="min-h-screen pt-6"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.header 
        className="px-5 mb-6 flex justify-between items-center"
        variants={itemVariants}
      >
        <h1 className="text-2xl font-bold text-[#E0E0E0]">Settings</h1>
      </motion.header>

      {/* Main Content */}
      <main className="px-5">
        <motion.div variants={itemVariants}>
          <Card className="bg-[#1E1E1E] border-[#333333] mb-6">
            <CardHeader>
              <CardTitle className="text-[#E0E0E0]">Notifications</CardTitle>
              <CardDescription className="text-[#AAAAAA]">Configure how you want to be reminded</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="study-reminders" className="flex flex-col space-y-1">
                  <span>Study Reminders</span>
                  <span className="font-normal text-xs text-[#AAAAAA]">Receive notifications before scheduled sessions</span>
                </Label>
                <Switch id="study-reminders" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="exam-alerts" className="flex flex-col space-y-1">
                  <span>Exam Alerts</span>
                  <span className="font-normal text-xs text-[#AAAAAA]">Get warnings when exams are approaching</span>
                </Label>
                <Switch id="exam-alerts" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="progress-updates" className="flex flex-col space-y-1">
                  <span>Progress Updates</span>
                  <span className="font-normal text-xs text-[#AAAAAA]">Weekly summary of your study progress</span>
                </Label>
                <Switch id="progress-updates" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-[#1E1E1E] border-[#333333] mb-6">
            <CardHeader>
              <CardTitle className="text-[#E0E0E0]">Data Management</CardTitle>
              <CardDescription className="text-[#AAAAAA]">Export or clear your study data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                variant="outline" 
                className="w-full bg-[#252525] border-[#333333] text-[#E0E0E0]"
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
              <CardTitle className="text-[#E0E0E0]">About</CardTitle>
              <CardDescription className="text-[#AAAAAA]">Application information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-[#AAAAAA]">Second Brain v1.0.0</p>
              <p className="text-sm text-[#AAAAAA]">A client-side study planning application</p>
              <p className="text-sm text-[#AAAAAA]">All data is stored locally on your device</p>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </motion.div>
  );
};

export default Settings;
