import React, { useEffect, useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import { CloudSun, CloudRain, Zap, TrendingUp, MapPin, Thermometer, Wind, Droplets } from 'lucide-react';
import { UserProfile } from '../types';
import { generateWeatherInsight } from '../services/geminiService';

interface DashboardProps {
  userProfile: UserProfile;
}

const data = [
  { name: '08:00', temp: 24, humidity: 40 },
  { name: '10:00', temp: 28, humidity: 35 },
  { name: '12:00', temp: 32, humidity: 30 },
  { name: '14:00', temp: 34, humidity: 28 },
  { name: '16:00', temp: 31, humidity: 32 },
  { name: '18:00', temp: 29, humidity: 38 },
];

const StatCard: React.FC<{ title: string, value: string, sub: string, icon: any, color: string }> = ({ title, value, sub, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
      </div>
      <div className={`p-3 rounded-full ${color} bg-opacity-10 text-${color.split('-')[1]}-600`}>
        <Icon size={24} className={color.replace('bg-', 'text-').replace('10', '600')} />
      </div>
    </div>
    <div className="flex items-center text-sm">
      <span className="text-green-500 font-bold flex items-center ml-1">
        <TrendingUp size={14} className="ml-1" />
        {sub}
      </span>
      <span className="text-gray-400">تحديث دوري</span>
    </div>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ userProfile }) => {
  const [weatherInsight, setWeatherInsight] = useState<string>('جاري تحليل حالة الطقس...');

  useEffect(() => {
    const fetchWeather = async () => {
        const insight = await generateWeatherInsight(userProfile);
        setWeatherInsight(insight);
    };

    fetchWeather(); // Initial fetch

    // Update every hour (3600000 ms)
    const interval = setInterval(() => {
        fetchWeather();
    }, 3600000);

    return () => clearInterval(interval);
  }, [userProfile]);

  return (
    <div className="space-y-6 animate-fade-in">
      <header className="mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            مرحباً، {userProfile.name} <span className="text-2xl">👋</span>
          </h1>
          <p className="text-gray-500 mt-2 flex items-center gap-2">
            <MapPin size={16} className="text-primary" />
            {userProfile.city}, {userProfile.country}
          </p>
        </div>
        <div className="bg-blue-50 px-4 py-2 rounded-xl border border-blue-100 text-blue-800 text-sm font-medium flex items-center gap-2">
          <CloudSun size={16} />
          <span>تحديث الطقس: نشط كل ساعة</span>
        </div>
      </header>

      {/* Weather Insight Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden group">
        <div className="absolute right-0 top-0 opacity-10 transform translate-x-10 -translate-y-10 group-hover:scale-110 transition-transform duration-700">
            <CloudSun size={150} />
        </div>
        <div className="relative z-10">
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                <CloudSun size={20} className="text-yellow-300" />
                تحليل الطقس المباشر والبيئة
            </h3>
            <p className="text-blue-50 leading-relaxed max-w-2xl text-lg font-light">
                {weatherInsight}
            </p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="درجة الحرارة" 
          value="32°C" 
          sub="معتدل" 
          icon={Thermometer} 
          color="bg-orange-100" 
        />
        <StatCard 
          title="جودة الهواء (AQI)" 
          value="45" 
          sub="ممتاز" 
          icon={Wind} 
          color="bg-green-100" 
        />
        <StatCard 
          title="استهلاك الموارد" 
          value="12 KWh" 
          sub="اقتصادي" 
          icon={Zap} 
          color="bg-yellow-100" 
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Main Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
            <Thermometer size={20} className="ml-2 text-orange-500" />
            توقعات الحرارة اليوم في {userProfile.city}
          </h3>
          <div className="h-80 w-full" style={{ direction: 'ltr' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Area type="monotone" dataKey="temp" stroke="#f97316" fillOpacity={1} fill="url(#colorTemp)" name="الحرارة" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Rain/Humidity Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
            <Droplets size={20} className="ml-2 text-blue-500" />
            نسبة الرطوبة المتوقعة
          </h3>
          <div className="h-80 w-full" style={{ direction: 'ltr' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip cursor={{fill: '#f8f9fa'}} contentStyle={{ borderRadius: '12px', border: 'none' }} />
                <Bar dataKey="humidity" radius={[4, 4, 0, 0]} name="الرطوبة %">
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.humidity > 40 ? '#3b82f6' : '#93c5fd'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;