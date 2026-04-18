"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase, isConfigured } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

type Task = {
  id: string;
  title: string;
  completed: boolean;
  created_at: string;
};

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [authError, setAuthError] = useState("");

  // Check auth state
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch tasks when user is authenticated
  const fetchTasks = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) setTasks(data);
  }, [user]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    setAuthError("");

    const fn =
      authMode === "login"
        ? supabase.auth.signInWithPassword
        : supabase.auth.signUp;

    const { error } = await fn.call(supabase.auth, { email, password });
    if (error) setAuthError(error.message);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    setTasks([]);
  }

  async function addTask(e: React.FormEvent) {
    e.preventDefault();
    const title = newTask.trim();
    if (!title) return;

    const { data, error } = await supabase
      .from("tasks")
      .insert({ title })
      .select()
      .single();

    if (!error && data) {
      setTasks((prev) => [data, ...prev]);
      setNewTask("");
    }
  }

  async function toggleTask(id: string, completed: boolean) {
    const { error } = await supabase
      .from("tasks")
      .update({ completed: !completed })
      .eq("id", id);

    if (!error) {
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: !completed } : t))
      );
    }
  }

  async function deleteTask(id: string) {
    const { error } = await supabase.from("tasks").delete().eq("id", id);

    if (!error) {
      setTasks((prev) => prev.filter((t) => t.id !== id));
    }
  }

  if (!isConfigured) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-start justify-center pt-16 px-4">
        <div className="w-full max-w-sm text-center">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
            Task Manager
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mb-4">
            Supabase is not configured. Set <code className="text-sm bg-zinc-200 dark:bg-zinc-800 px-1.5 py-0.5 rounded">NEXT_PUBLIC_SUPABASE_URL</code> and <code className="text-sm bg-zinc-200 dark:bg-zinc-800 px-1.5 py-0.5 rounded">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> in <code className="text-sm bg-zinc-200 dark:bg-zinc-800 px-1.5 py-0.5 rounded">.env.local</code> to get started.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <p className="text-zinc-400">Loading...</p>
      </div>
    );
  }

  // Auth screen
  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-start justify-center pt-16 px-4">
        <div className="w-full max-w-sm">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
            Task Manager
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mb-8">
            Sign in to manage your tasks.
          </p>

          <form onSubmit={handleAuth} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2.5 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              minLength={6}
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2.5 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {authError && (
              <p className="text-red-500 text-sm">{authError}</p>
            )}
            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-white font-medium hover:bg-blue-700 transition-colors"
            >
              {authMode === "login" ? "Sign In" : "Sign Up"}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-zinc-500">
            {authMode === "login" ? (
              <>
                No account?{" "}
                <button
                  onClick={() => setAuthMode("signup")}
                  className="text-blue-500 hover:underline"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Have an account?{" "}
                <button
                  onClick={() => setAuthMode("login")}
                  className="text-blue-500 hover:underline"
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    );
  }

  // Main app
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-start justify-center pt-16 px-4">
      <div className="w-full max-w-lg">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            Task Manager
          </h1>
          <button
            onClick={handleSignOut}
            className="text-sm text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
          >
            Sign out
          </button>
        </div>
        <p className="text-zinc-500 dark:text-zinc-400 mb-8 text-sm">
          Signed in as {user.email}
        </p>

        {/* Add task form */}
        <form onSubmit={addTask} className="flex gap-2 mb-8">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="What needs to be done?"
            className="flex-1 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2.5 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            Add
          </button>
        </form>

        {/* Task list */}
        {tasks.length === 0 ? (
          <p className="text-center text-zinc-400 dark:text-zinc-500 py-12">
            No tasks yet. Add one above.
          </p>
        ) : (
          <ul className="space-y-2">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="flex items-center gap-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-3"
              >
                <button
                  onClick={() => toggleTask(task.id, task.completed)}
                  className={`h-5 w-5 rounded border-2 flex items-center justify-center transition-colors ${
                    task.completed
                      ? "bg-green-500 border-green-500 text-white"
                      : "border-zinc-300 dark:border-zinc-600 hover:border-blue-500"
                  }`}
                >
                  {task.completed && (
                    <svg
                      className="h-3 w-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </button>
                <span
                  className={`flex-1 ${
                    task.completed
                      ? "line-through text-zinc-400 dark:text-zinc-500"
                      : "text-zinc-900 dark:text-zinc-100"
                  }`}
                >
                  {task.title}
                </span>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-zinc-400 hover:text-red-500 transition-colors"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Stats */}
        {tasks.length > 0 && (
          <div className="mt-4 flex justify-between text-sm text-zinc-400 dark:text-zinc-500">
            <span>{tasks.filter((t) => !t.completed).length} remaining</span>
            <span>{tasks.filter((t) => t.completed).length} completed</span>
          </div>
        )}
      </div>
    </div>
  );
}
