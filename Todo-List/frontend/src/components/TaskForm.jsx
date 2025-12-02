import { useState, useEffect } from "react";

const TaskForm = ({ onSubmit, initialData = {} }) => {
  const [task, setTask] = useState({
    title: "",
    description: "",
    status: "pending",
    dueDate: "",
  });

  useEffect(() => {
    initialData &&
      setTask({
        title: initialData.title || "",
        description: initialData.description || "",
        status: initialData.status || "pending",
        dueDate: initialData.dueDate
          ? new Date(initialData.dueDate).toISOString().split("T")[0]
          : "",
      });
  }, [initialData]);

  const handleChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(task);
    setTask({
      title: "",
      description: "",
      status: "pending",
      dueDate: "",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="form-control">
      <input
        type="text"
        placeholder="Title"
        value={task.title}
        name="title"
        onChange={handleChange}
        className="input-field"
        required
      />
      <textarea
        placeholder="Description"
        name="description"
        value={task.description}
        onChange={handleChange}
        className="input-field "
      />
      <select
        value={task.status}
        onChange={handleChange}
        name="status"
        className="input-field"
      >
        <option value="pending">Pending</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>
      <input
        type="date"
        value={task.dueDate}
        onChange={handleChange}
        name="dueDate"
        className="input-field"
      />
      <button type="submit" className="btn">
        {initialData._id ? "Update Task" : "Add Task"}
      </button>
    </form>
  );
};

export default TaskForm;
