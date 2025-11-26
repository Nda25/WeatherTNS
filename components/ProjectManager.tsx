import React, { useState } from 'react';
import { EcoProject } from '../types';
import { Plus, CheckCircle, Clock, Calendar } from 'lucide-react';

const ProjectManager: React.FC = () => {
  const [projects, setProjects] = useState<EcoProject[]>([
    { id: '1', title: 'حملة تشجير المدرسة', description: 'زراعة 50 شجرة في فناء المدرسة الخلفي.', progress: 75, status: 'active' },
    { id: '2', title: 'إعادة تدوير الورق', description: 'جمع الأوراق المستعملة من الفصول وإرسالها للمصنع.', progress: 30, status: 'active' },
    { id: '3', title: 'توفير الطاقة', description: 'تركيب حساسات حركة للإضاءة في الممرات.', progress: 100, status: 'completed' },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'active': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'مكتمل';
      case 'active': return 'قيد التنفيذ';
      case 'planned': return 'مخطط';
      default: return status;
    }
  };

  return (
    <div className="space-y-6"> {/* Removed animate-fade-in to prevent visibility issues */}
      <div className="flex justify-between items-center animate-fade-in">
        <div>
           <h1 className="text-3xl font-bold text-gray-800">مشاريعنا البيئية</h1>
           <p className="text-gray-500 mt-1">تابع تقدم المشاريع وساهم في حماية بيئتك.</p>
        </div>
        <button className="bg-primary hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <Plus size={20} />
          <span>مشروع جديد</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
        {projects.map((project) => (
          <div key={project.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col">
             <div className="flex justify-between items-start mb-4">
               <div className={`text-xs px-3 py-1 rounded-full border font-medium ${getStatusColor(project.status)}`}>
                 {getStatusText(project.status)}
               </div>
               {project.status === 'completed' ? <CheckCircle className="text-green-500" size={20} /> : <Clock className="text-blue-500" size={20} />}
             </div>
             
             <h3 className="font-bold text-lg text-gray-800 mb-2">{project.title}</h3>
             <p className="text-gray-500 text-sm mb-6 flex-1">{project.description}</p>

             <div className="space-y-2">
               <div className="flex justify-between text-sm">
                 <span className="text-gray-600">نسبة الإنجاز</span>
                 <span className="font-bold text-primary">{project.progress}%</span>
               </div>
               <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                 <div 
                    className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                    style={{ width: `${project.progress}%` }}
                 />
               </div>
             </div>

             <div className="mt-4 pt-4 border-t border-gray-50 flex items-center gap-2 text-xs text-gray-400">
               <Calendar size={14} />
               <span>آخر تحديث: منذ يومين</span>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectManager;