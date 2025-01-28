"use client";

import { useQuery } from '../hook';
import UserItem, { TaskDto } from '../components/TodoItem';
import { useSessionContext } from "../components/ContextProvider";
import NavBar from '../components/NavBar'
export type GetTasksReturnType = {
    tasks: TaskDto[];
};

export default function TaskList() {
    const session = useSessionContext();
    const accountId = session?.account.id;

    if (!accountId) {
        window.location.href = "/register";
        return <p className="text-center text-red-500">User not logged in</p>;
       
    }

    // Fetch tasks for the current user
    const { result: tasks } = useQuery<GetTasksReturnType>("get_user_tasks", {
        user_id: accountId,
    });

    // Fetch completed tasks for the current user
    const { result: completedTasks } = useQuery<GetTasksReturnType>("get_user_tasks_by_status", {
        user_id: accountId,
        is_completed: true,
    });

    // Fetch overdue tasks for the current user
    const { result: overdueTasks } = useQuery<GetTasksReturnType>("get_overdue_tasks", {
        user_id: accountId,
    });
 
    // Helper function to render tasks
    const renderTasks = (tasks: TaskDto[] | undefined, title: string) => {
        if (!tasks || tasks.length === 0) {
            return <p className="text-gray-500">No tasks available</p>;
        }

        return (
            <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">{title}</h2>
                <ul>
                    {tasks.map((task, index) => (
                        <li key={task.task_id.toString()}>
                            <UserItem user={task} />
                            {index < tasks.length - 1 && (
                                <hr className="my-4 border-t border-gray-300" />
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    return (
        <div className="p-4 md:p-8">
            <NavBar></NavBar>
            <p className="text-center text-3xl text-slate-500">Simple Navigations</p>
            <div className="absolute top-40 left-[45%] bg-white bg-opacity-15 box-border flex flex-col items-center justify-around gap-5 hover:text-black rounded-md shadow-lg border border-gray-200 w-42">
                <a href="#completed">
                    <h3 className="text-gray-300 hover:text-slate-900 hover:bg-blue-100 px-3 py-2 cursor-pointer rounded-md transition-colors duration-300">
                        Completed Tasks
                    </h3>
                </a>
                <a href="#overdue">
                    <h3 className="text-gray-300 hover:text-slate-900 hover:bg-blue-100 px-3 py-2 cursor-pointer rounded-md transition-colors duration-300">
                        Overdue Tasks
                    </h3>
                </a>
            </div>

            <div className="relative h-screen overflow-hidden">
                <p className="absolute top-44 left-[43%]">All tasks Sorted By Due Date</p>
                {tasks ? (
                    <div id="all">
                        {renderTasks(tasks?.tasks, "All Tasks")}
                    </div>
                ) : (
                    <div className="h-screen flex items-center justify-center text-2xl absolute w-screen">
                        <span className="text-slate-500 text-xs text-center -ml-28">Loading...</span>
                    </div>
                )}

                <div id="completed">
                    {renderTasks(completedTasks?.tasks, "Completed Tasks")}
                </div>
            </div>

            <div id="overdue">
                {renderTasks(overdueTasks?.tasks, "Overdue Tasks")}
            </div>
        </div>
    );
}
