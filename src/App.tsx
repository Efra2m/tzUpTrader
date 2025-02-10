import { Routes, Route } from "react-router-dom";
import Header from "./common/Header";
import TaskBoardWrapper from "./components/TaskBoardWrapper/TaskBoardWrapper";

import ProjectsContainer from "./components/ProjectsContainer/ProjectsContainer";
import { ProjectsProvider } from "./components/ProjectContext/ProjectContext";

function App() {
  return (
    <ProjectsProvider>
      <Header />
      <Routes>
        <Route path="/" element={<ProjectsContainer />} />
        <Route path="/tasks/:projectName" element={<TaskBoardWrapper />} />
      </Routes>
    </ProjectsProvider>
  );
}

export default App;
