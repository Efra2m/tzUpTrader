import React, { useState } from "react";
import styles from "./AddProjectModal.module.scss";

interface AddProjectModalProps {
  isOpen: boolean;
  onAdd: (projectName: string, projectDescription: string) => void;
  onClose: () => void;
}

const AddProjectModal: React.FC<AddProjectModalProps> = ({
  isOpen,
  onAdd,
  onClose,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedDescription = description.trim();

    if (!trimmedName) return;

    onAdd(trimmedName, trimmedDescription);
    setName("");
    setDescription("");
  };

  const handleBackdropClick = () => {
    onClose();
  };

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className={styles.modalBackdrop} onClick={handleBackdropClick}>
      <div className={styles.modal} onClick={handleModalClick}>
        <h2>Добавить новый проект</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="projectName">Название проекта</label>
            <input
              id="projectName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="projectDescription">Описание проекта</label>
            <textarea
              id="projectDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className={styles.buttonGroup}>
            <button type="submit">Добавить проект</button>
            <button type="button" onClick={onClose}>
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProjectModal;
