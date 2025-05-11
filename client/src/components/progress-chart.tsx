import { useApp } from "../context/app-context";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { motion } from "framer-motion";

const ProgressChart = () => {
  const { subjects, getCompletedTopicsCount, getTotalTopicsCount } = useApp();

  // Prepare data for bar chart
  const barData = subjects.map(subject => {
    const completed = getCompletedTopicsCount(subject.id);
    const total = getTotalTopicsCount(subject.id);
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    // Extract course code or short name
    let shortName = subject.name.split(' ')[0]; // Default to first word
    const match = subject.name.match(/\(([^)]+)\)/); // Try to extract text in parentheses
    if (match) {
      shortName = match[1];
    }
    
    return {
      name: shortName,
      progress,
      completed,
      total
    };
  });
  
  // Prepare data for pie chart
  const totalCompleted = subjects.reduce((sum, subject) => 
    sum + getCompletedTopicsCount(subject.id), 0);
  const totalUnits = subjects.reduce((sum, subject) => 
    sum + getTotalTopicsCount(subject.id), 0);
  const totalRemaining = totalUnits - totalCompleted;
  
  const pieData = [
    { name: 'Completed', value: totalCompleted },
    { name: 'Remaining', value: totalRemaining }
  ];
  
  const COLORS = ['#FF5252', '#333333'];
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#252525] p-2 border border-[#333333] rounded-md shadow-lg text-sm">
          <p className="font-semibold">{`${label}`}</p>
          <p>{`Completed: ${payload[0].payload.completed}/${payload[0].payload.total} units`}</p>
          <p>{`Progress: ${payload[0].value}%`}</p>
        </div>
      );
    }
    return null;
  };
  
  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#252525] p-2 border border-[#333333] rounded-md shadow-lg text-sm">
          <p className="font-semibold">{`${payload[0].name}`}</p>
          <p>{`Units: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 md:px-2 sm:px-0 max-w-full">
      <motion.div 
        className="bg-[#1E1E1E] rounded-xl p-4 h-80 overflow-x-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="font-medium mb-4">Progress by Subject</h3>
        <ResponsiveContainer width="100%" height="85%" minWidth={300}>
          <BarChart
            data={barData}
            margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
          >
            <XAxis dataKey="name" stroke="#AAAAAA" />
            <YAxis stroke="#AAAAAA" domain={[0, 100]} tickFormatter={(tick) => `${tick}%`} />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="progress" 
              fill="#FF5252" 
              radius={[4, 4, 0, 0]}
              animationBegin={200}
              animationDuration={1500}
            />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
      
      <motion.div 
        className="bg-[#1E1E1E] rounded-xl p-4 h-80 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h3 className="font-medium mb-4">Overall Completion</h3>
        <div className="text-center">
          <p className="text-lg font-semibold">{Math.round((totalCompleted / totalUnits) * 100)}% Complete</p>
          <p className="text-sm text-[#AAAAAA]">{totalCompleted} of {totalUnits} units completed</p>
        </div>
        <ResponsiveContainer width="100%" height="70%" minWidth={250}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              animationBegin={500}
              animationDuration={1500}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomPieTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
};

export default ProgressChart;
