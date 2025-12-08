// 示例：如何在 Stalwart 页面中集成捐赠组件

import Link from 'next/link';

// 在 Stalwart 页面的某个部分添加捐赠按钮
export function DonateSection({ projectId, projectName }: { projectId: string; projectName: string }) {
  return (
    <div className="text-center py-16">
      <h3 className="text-3xl font-bold text-white mb-4">
        Support This Project
      </h3>
      <p className="text-white/70 mb-8 max-w-2xl mx-auto">
        Help us make a difference by contributing to this project. 
        Your donation will directly support our mission and help us achieve our goals.
      </p>
      
      <Link href={`/stalwart-donate/${projectId}/${encodeURIComponent(projectName)}`}>
        <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25">
          Donate Now
        </button>
      </Link>
    </div>
  );
}

// 在项目卡片中添加捐赠按钮
export function ProjectCard({ project }: { project: any }) {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
      <h3 className="text-xl font-bold text-white mb-2">{project.name}</h3>
      <p className="text-white/70 mb-4">{project.description}</p>
      
      <div className="flex gap-3">
        <Link href={`/project/${project.id}`}>
          <button className="border border-white/20 text-white hover:bg-white/10 px-4 py-2 rounded-lg transition-colors">
            View Details
          </button>
        </Link>
        
        <Link href={`/stalwart-donate/${project.id}/${encodeURIComponent(project.name)}`}>
          <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg transition-all duration-300">
            Donate
          </button>
        </Link>
      </div>
    </div>
  );
}
