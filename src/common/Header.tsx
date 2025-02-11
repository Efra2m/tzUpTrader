import { NavLink, useLocation } from "react-router-dom";
import styles from "./Header.module.scss";
import { useCallback, useState } from "react";
import AddProjectModal from "../components/AddProjectModal/AddProjectModal";
import { useProject } from "../components/ProjectContext/ProjectContext";
import { v4 as uuidv4 } from "uuid";

const Header = () => {
  const location = useLocation();
  const { addProject } = useProject();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleNewProjectClick = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleAddProject = useCallback(
    (projectName: string, projectDescription: string) => {
      const projectId = uuidv4();
      // eslint-disable-next-line
      const newProject = {
        id: projectId,
        name: projectName,
        description: projectDescription,
        tasksCollection: {
          queue: [],
          development: [],
          done: [],
        },
      };
      addProject(projectName, projectDescription);
      setIsModalOpen(false);
    },
    [addProject]
  );

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.container}>
          <div className={styles.navBar}>
            <div className={styles.leftSection}>
              <nav className={styles.navLinks}>
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) =>
                    isActive ? styles.navLinkActive : styles.navLink
                  }
                >
                  Проекты
                </NavLink>
                {location.pathname !== "/" && (
                  <NavLink
                    to="/tasks"
                    className={({ isActive }) =>
                      isActive ? styles.navLinkActive : styles.navLink
                    }
                  >
                    Задачи
                  </NavLink>
                )}
              </nav>
            </div>
            {location.pathname === "/" && (
              <div className={styles.rightSection}>
                <button
                  type="button"
                  className={styles.newProjectButton}
                  onClick={handleNewProjectClick}
                >
                  <i className="fas fa-plus" />
                  <span className={styles.buttonText}>
                    <img
                      src="plus.png"
                      alt="plus"
                      className={styles.plusImage}
                    />
                    Новый проект
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      <AddProjectModal
        isOpen={isModalOpen}
        onAdd={handleAddProject}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default Header;
