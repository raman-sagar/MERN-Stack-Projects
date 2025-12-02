import React from "react";
import TaskItem from "./TaskItem";

const TaskList = ({ tasks, onEdit, onDelete }) => {
  return (
    <>
      <h1 className="heading1">Todo Items</h1>
      <div className="p-2 border-2 rounded-md border-blue-500 bg-neutral-400 gap-4 grid grid-cols-1 md:grid-cols-4">
        {tasks.map((task) => (
          <TaskItem
            key={task._id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </>
  );
};

export default TaskList;
