import { useLocation, useRoute } from "wouter";
import { motion } from "framer-motion";

const NavigationBar = () => {
  const [location, setLocation] = useLocation();
  
  const [isHomeRoute] = useRoute("/");
  const [isScheduleRoute] = useRoute("/schedule");
  const [isProgressRoute] = useRoute("/progress");
  const [isSettingsRoute] = useRoute("/settings");

  const navItems = [
    {
      name: "Subjects",
      icon: "ri-book-open-line",
      path: "/",
      active: isHomeRoute
    },
    {
      name: "Schedule",
      icon: "ri-calendar-line",
      path: "/schedule",
      active: isScheduleRoute
    },
    {
      name: "Progress",
      icon: "ri-bar-chart-line",
      path: "/progress",
      active: isProgressRoute
    },
    {
      name: "Settings",
      icon: "ri-settings-3-line",
      path: "/settings",
      active: isSettingsRoute
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#1E1E1E] border-t border-[#333333] p-2 flex justify-around items-center z-50">
      {navItems.map((item) => (
        <button
          key={item.name}
          className={`flex flex-col items-center py-1 px-3 ${
            item.active ? "text-[#FF5252]" : "text-[#AAAAAA]"
          }`}
          onClick={() => setLocation(item.path)}
        >
          <motion.i
            className={`${item.icon} text-xl`}
            initial={false}
            animate={item.active ? { y: -4, scale: 1.1 } : { y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          />
          <span className="text-xs mt-1">{item.name}</span>
          {item.active && (
            <motion.div
              className="absolute bottom-0 w-8 h-1 bg-[#FF5252] rounded-t-lg"
              layoutId="navIndicator"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
        </button>
      ))}
    </nav>
  );
};

export default NavigationBar;
