"use client";

import React from "react";
import { createTask } from "../actions/createTask";

const TaskForm = () => {
  const formRef = React.useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await createTask(formData);
        formRef.current?.reset();
      }}
      className="flex items-center gap-4 p-2 border rounded-lg"
    >
      <input
        type="text"
        name="description"
        placeholder="Task Details"
        required
        className="flex-grow p-2 border rounded"
      />

      <input
        type="date"
        name="deadline"
        required
        className="p-2 border rounded"
      />

      <fieldset className="flex items-center gap-3">
        <legend className="sr-only">Reminders</legend>{" "}
        <div className="flex items-center gap-1">
          <input type="checkbox" id="remind1" name="remindBefore1Day" />
          <label htmlFor="remind1" className="text-sm">
            1d
          </label>
        </div>
        <div className="flex items-center gap-1">
          <input type="checkbox" id="remind3" name="remindBefore3Days" />
          <label htmlFor="remind3" className="text-sm">
            3d
          </label>
        </div>
        <div className="flex items-center gap-1">
          <input type="checkbox" id="remind7" name="remindBefore7Days" />
          <label htmlFor="remind7" className="text-sm">
            7d
          </label>
        </div>
      </fieldset>

      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Save
      </button>
    </form>
  );
};

export default TaskForm;
