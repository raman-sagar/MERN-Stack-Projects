const TaskItem = ({ task, onEdit, onDelete }) => {
  return (
    <div className="bg-blue-100 p-4 rounded shadow-md/30 ">
      <h3 className="font-bold text-gray-600">Title:{task.title}</h3>
      <p className="text-gray-600">Discription:{task.description}</p>
      <p className="text-gray-600">Status: {task.status}</p>
      <p className="text-gray-600">
        Due:{" "}
        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "None"}
      </p>
      <button
        onClick={() => onEdit(task)}
        className="bg-yellow-500 text-white p-1 rounded mr-2 cursor-pointer hover:bg-yellow-600"
      >
        Edit
      </button>
      <button
        onClick={() => onDelete(task._id)}
        className="bg-red-500 text-white p-1 rounded cursor-pointer hover:bg-red-600"
      >
        Delete
      </button>
    </div>
  );
};

export default TaskItem;
