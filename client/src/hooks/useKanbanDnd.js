import { useCallback, useState } from "react";

/** HTML5 drag-and-drop helpers for kanban columns. */
export function useKanbanDnd({ enabled = true, onDropItem }) {
  const [draggingId, setDraggingId] = useState(null);
  const [overKey, setOverKey] = useState(null);

  const cardProps = useCallback(
    (id) => {
      if (!enabled) return {};
      return {
        draggable: true,
        onDragStart: (e) => {
          e.dataTransfer.setData("text/plain", id);
          e.dataTransfer.effectAllowed = "move";
          setDraggingId(id);
          e.currentTarget.classList.add("is-dragging");
        },
        onDragEnd: (e) => {
          setDraggingId(null);
          setOverKey(null);
          e.currentTarget.classList.remove("is-dragging");
        },
      };
    },
    [enabled]
  );

  const columnProps = useCallback(
    (columnKey) => {
      if (!enabled) return {};
      return {
        onDragOver: (e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = "move";
          setOverKey(columnKey);
        },
        onDragLeave: (e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) {
            setOverKey((k) => (k === columnKey ? null : k));
          }
        },
        onDrop: (e) => {
          e.preventDefault();
          const id = e.dataTransfer.getData("text/plain");
          setOverKey(null);
          setDraggingId(null);
          if (id) onDropItem?.(id, columnKey);
        },
      };
    },
    [enabled, onDropItem]
  );

  return { draggingId, overKey, cardProps, columnProps };
}
