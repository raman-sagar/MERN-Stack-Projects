import { useState, useEffect, Suspense, lazy } from "react";
import axios from "axios";
/*
!Lazy importing
!Import the component at the runtime
*/
const TaskForm = lazy(() => import("./components/TaskForm"));
const TaskList = lazy(() => import("./components/TaskList"));
const App = () => {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState("");
  const [error, setErorr] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  //! Fetch tasks
  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error(err);
      setErorr(err.message);
    }
  };
  //!Form Handling
  const handleSubmit = async (taskData) => {
    try {
      if (editingTask) {
        const res = await axios.put(
          `http://localhost:3000/api/tasks/task/${editingTask._id}`,
          taskData
        );
        const arr = tasks.map((task) =>
          task._id === editingTask._id ? res.data : task
        );
        setTasks(arr);
        setEditingTask("");
      } else {
        const res = await axios.post(
          "http://localhost:3000/api/tasks/task",
          taskData
        );
        setTasks([...tasks, res.data]);
      }
    } catch (err) {
      console.error(err);
      setErorr(err.message);
    }
  };
  //! Edit the Task
  const handleEdit = (task) => {
    // Here task is an object
    setEditingTask(task);
  };
  //! Delete Task
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/tasks/${id}`);
      const arr = tasks.filter((item) => item._id !== id);
      setTasks(arr);
    } catch (err) {
      console.error(err);
      setErorr(err.message);
    }
  };

  if (error) {
    return (
      <div className="h-screen flex flex-col justify-center-safe items-center-safe">
        <div className="border font-mono text-4xl text-red-500 ">
          {" "}
          <h1> Error:</h1>
          <h1>!{error}😢</h1>
        </div>
      </div>
    );
  }
  return (
    <Suspense
      fallback={
        <div className="h-screen flex justify-center items-center text-gray-500">
          <h1 className="font-mono text-4xl">Loading...</h1>
        </div>
      }
    >
      <div className="container mx-auto p-4">
        <div className="flex justify-center">
          <h1 className="text-2xl font-bold mb-4 text-indigo-600">
            Task Management Dashboard
          </h1>
        </div>
        <TaskForm onSubmit={handleSubmit} initialData={editingTask} />
        <TaskList tasks={tasks} onEdit={handleEdit} onDelete={handleDelete} />
      </div>
    </Suspense>
  );
};

export default App;
