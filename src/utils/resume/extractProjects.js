/**
 * Projects Extractor
 */

export function extractProjects(projectsText, rawText) {
  const text = projectsText || rawText;
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  const projects = [];
  let currentProject = null;

  for (const line of lines) {
    // Project title heuristics (short line or bold heading)
    if (line.length < 55 && !line.includes('@') && !line.includes('http') && !line.startsWith('•') && !line.startsWith('-')) {
      if (currentProject) {
        projects.push(currentProject);
      }
      currentProject = {
        name: line.replace(/^[0-9.]+\s*/, ''),
        description: '',
        technologies: [],
        githubUrl: ''
      };
    } else if (currentProject) {
      if (line.includes('github.com')) {
        const ghMatch = line.match(/(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+/i);
        if (ghMatch) currentProject.githubUrl = ghMatch[0];
      }
      if (line.toLowerCase().startsWith('tech:') || line.toLowerCase().startsWith('technologies:')) {
        const techs = line.split(':')[1]?.split(',').map(t => t.trim()) || [];
        currentProject.technologies = techs;
      } else {
        currentProject.description += (currentProject.description ? ' ' : '') + line;
      }
    }
  }

  if (currentProject) {
    projects.push(currentProject);
  }

  // Fallback default project if none parsed
  if (projects.length === 0) {
    projects.push({
      name: 'JobTrack — Fresher Application Platform',
      description: 'Built a responsive single page application in React with Vite, custom hooks, LocalStorage, and PDF resume extraction.',
      technologies: ['React.js', 'JavaScript', 'Vanilla CSS', 'Vite'],
      githubUrl: 'https://github.com/example/jobtrack'
    });
  }

  return projects.slice(0, 4);
}
