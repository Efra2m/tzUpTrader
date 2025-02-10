import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";

interface TaskCollection {
  queue: any[];
  development: any[];
  done: any[];
}

interface Project {
  id: number;
  name: string;
  description: string;
  tasksCollection?: TaskCollection;
}

interface ProjectsContextProps {
  projectsList: Project[];
  loading: boolean;
  addProject: (name: string, description: string) => void;
  getProjectData: (projectKey: string) => Project | undefined;
}

const ProjectsContext = createContext<ProjectsContextProps | undefined>(
  undefined
);

export const useProject = () => {
  const context = useContext(ProjectsContext);
  if (!context) {
    throw new Error("useProject must be used within a ProjectsProvider");
  }
  return context;
};

interface ProjectsProviderProps {
  children: ReactNode;
}

export const ProjectsProvider: React.FC<ProjectsProviderProps> = ({
  children,
}) => {
  const [projectsList, setProjectsList] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      const response = await axios.get("/assets/projects.json");
      const projectsData = response.data;

      const fetchedProjects: Project[] = Object.keys(projectsData).map(
        (projectName, index) => {
          const projectInfo = projectsData[projectName];

          return {
            id: index + 1,
            name: projectName,
            description:
              projectInfo.description || "Описание проекта отсутствует",
            tasksCollection: {
              queue: projectInfo.queue || [],
              development: projectInfo.development || [],
              done: projectInfo.done || [],
            },
          };
        }
      );

      const storedProjectsJSON = localStorage.getItem("projects");
      if (storedProjectsJSON) {
        const storedProjects: Project[] = JSON.parse(storedProjectsJSON);

        const allProjectsMap = new Map<string, Project>();
        fetchedProjects.forEach((project) => {
          allProjectsMap.set(project.name, project);
        });
        storedProjects.forEach((project) => {
          allProjectsMap.set(project.name, project);
        });
        const allProjects = Array.from(allProjectsMap.values());
        setProjectsList(allProjects);
      } else {
        setProjectsList(fetchedProjects);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (projectsList.length > 0) {
      localStorage.setItem("projects", JSON.stringify(projectsList));
    }
  }, [projectsList]);

  const addProject = (name: string, description: string) => {
    const newProject: Project = {
      id: projectsList.length + 1,
      name,
      description,
      tasksCollection: {
        queue: [],
        development: [],
        done: [],
      },
    };

    setProjectsList([...projectsList, newProject]);
  };

  const getProjectData = (projectKey: string): Project | undefined => {
    const project = projectsList.find(
      (project) => project.name.toLowerCase() === projectKey.toLowerCase()
    );
    if (!project) {
    }
    return project;
  };

  return (
    <ProjectsContext.Provider
      value={{ projectsList, loading, addProject, getProjectData }}
    >
      {children}
    </ProjectsContext.Provider>
  );
};
