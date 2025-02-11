import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./common/Header";
import { ProjectsProvider } from "./components/ProjectContext/ProjectContext";

const TaskBoardWrapper = lazy(
  () => import("./components/TaskBoardWrapper/TaskBoardWrapper")
);
const ProjectsContainer = lazy(
  () => import("./components/ProjectsContainer/ProjectsContainer")
);

function App() {
  return (
    <ProjectsProvider>
      <Header />
      <Suspense fallback={<div>Загрузка компонента...</div>}>
        <Routes>
          <Route path="/" element={<ProjectsContainer />} />
          <Route path="/tasks/:projectName" element={<TaskBoardWrapper />} />
        </Routes>
      </Suspense>
    </ProjectsProvider>
  );
}

export default App;
