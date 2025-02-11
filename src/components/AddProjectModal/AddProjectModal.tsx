import React, { useCallback, useMemo, useState } from "react";
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

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmedName = name.trim();
      const trimmedDescription = description.trim();

      if (!trimmedName) return;

      onAdd(trimmedName, trimmedDescription);
      setName("");
      setDescription("");
    },
    [name, description, onAdd]
  );

  const handleBackdropClick = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleModalClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  const nameInput = useMemo(
    () => (
      <input
        id="projectName"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
    ),
    [name]
  );

  const descriptionTextarea = useMemo(
    () => (
      <textarea
        id="projectDescription"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
    ),
    [description]
  );

  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.modalBackdrop} onClick={handleBackdropClick}>
      <div className={styles.modal} onClick={handleModalClick}>
        <h2>Добавить новый проект</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="projectName">Название проекта</label>
            {nameInput}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="projectDescription">Описание проекта</label>
            {descriptionTextarea}
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
