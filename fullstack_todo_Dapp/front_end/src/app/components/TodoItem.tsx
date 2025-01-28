import React, { useState } from "react";
import { useSessionContext } from "./ContextProvider"; // Import the session context
import { createKeyStoreInteractor } from "@chromia/ft4"; // Import necessary functions from Chromia FT4

export type TaskDto = {
    task_id: number;
    task_title: string;
    task_description: string;
    due_date: string; // Date as string
    is_completed: boolean;
    created_at: string; // Date as string
    updated_at: string; // Date as string
};

type TodoItemProps = {
    user: TaskDto;
    client: any; // Chromia client instance
};

export default function TodoItem({ user, client }: TodoItemProps) {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { session, evmKeyStore } = useSessionContext(); // Access both session and evmKeyStore from context
    const [task, setTask] = useState<TaskDto>(user); // Manage the task state

    // Ensure that the session and evmKeyStore are available before interacting with the backend
    if (!session || !evmKeyStore) {
        return <div>Loading user session...</div>;
    }

    // Function to get the task interactor (used for backend operations)
    const getTaskInteractor = () => {
        if (!session || !evmKeyStore) {
            console.error("Session or keyStore not available.");
            return;
        }
        return createKeyStoreInteractor(client, evmKeyStore);
    };

    // Function to update the task in the backend
    const updateTask = async () => {
        try {
            setIsLoading(true);
            const interactor = getTaskInteractor();
            if (!interactor) return;

            await interactor.update_task({
                task_id: user.task_id,
                task_title: task.task_title,
                task_description: task.task_description,
                due_date: task.due_date
            });

            setTask((prev) => ({
                ...prev,
                task_title: task.task_title,
                task_description: task.task_description,
                due_date: task.due_date,
                updated_at: new Date().toISOString() // Update the updated_at field
            }));

            alert("Task updated successfully!");
        } catch (error) {
            console.error("Error updating task:", error);
            alert("Failed to update task");
        } finally {
            setIsLoading(false);
        }
    };

    // Function to mark the task as completed
    const completeTask = async () => {
        try {
            setIsLoading(true);
            const interactor = getTaskInteractor();
            if (!interactor) return;

            await interactor.complete_task(user.task_id);

            setTask((prev) => ({
                ...prev,
                is_completed: true,
                updated_at: new Date().toISOString() // Update the updated_at field
            }));

            alert("Task completed successfully!");
        } catch (error) {
            console.error("Error completing task:", error);
            alert("Failed to complete task");
        } finally {
            setIsLoading(false);
        }
    };

    // Function to delete the task from the backend
    const deleteTask = async () => {
        try {
            setIsLoading(true);
            const interactor = getTaskInteractor();
            if (!interactor) return;

            await interactor.delete_task(user.task_id);

            alert("Task deleted successfully!");
        } catch (error) {
            console.error("Error deleting task:", error);
            alert("Failed to delete task");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-between mb-4 p-4 bg-white shadow-md rounded-lg">
            <div>
                <h3 className="text-lg font-bold">{task.task_title}</h3>
                <p className="text-gray-600">{task.task_description}</p>
                <p className="text-sm text-gray-500">Due: {new Date(task.due_date).toLocaleDateString()}</p>
                <p className="text-sm text-gray-500">Created: {new Date(task.created_at).toLocaleDateString()}</p>
                <p className="text-sm text-gray-500">Updated: {new Date(task.updated_at).toLocaleDateString()}</p>
            </div>
            <div className="flex flex-col items-center space-y-2">
                <span className={`px-2 py-1 rounded-full text-sm ${task.is_completed ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                    {task.is_completed ? "Completed" : "Pending"}
                </span>
                <div className="space-x-2">
                    <button
                        onClick={updateTask}
                        disabled={isLoading || task.is_completed}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-400"
                    >
                        {isLoading ? 'Updating...' : 'Update'}
                    </button>
                    <button
                        onClick={completeTask}
                        disabled={isLoading || task.is_completed}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg disabled:bg-gray-400"
                    >
                        {isLoading ? 'Completing...' : 'Complete'}
                    </button>
                    <button
                        onClick={deleteTask}
                        disabled={isLoading}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg disabled:bg-gray-400"
                    >
                        {isLoading ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
}
