"use client";

import React, { useState, useRef } from "react";
import { createTask } from "../actions/createTask";

const TaskForm = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputStyles =
    "p-2 bg-background border border-input-border rounded-md text-main-text placeholder:text-secondary-text focus:outline-none focus:ring-2 focus:ring-highlight focus:border-transparent transition-all duration-200";

  const formAction = async (formData: FormData) => {
    setIsSubmitting(true);
    await createTask(formData);
    setIsSubmitting(false);
    formRef.current?.reset();
  };

  return (
    <div className="">
      <form ref={formRef} action={formAction} className=" p-6 space-y-6">
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-main-text mb-1"
          >
            Task Details
          </label>
          <input
            id="description"
            type="text"
            name="description"
            placeholder="e.g., Finalize project report"
            required
            className={`w-full ${inputStyles}`}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label
              htmlFor="deadline"
              className="block text-sm font-medium text-main-text mb-1"
            >
              Deadline
            </label>
            <input
              id="deadline"
              type="date"
              name="deadline"
              required
              className={`w-full ${inputStyles}`}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-main-text mb-1">
              Email Reminder (days before)
            </label>
            <fieldset className="flex items-center gap-6 pt-2">
              <legend className="sr-only">Reminders</legend>
              {[1, 3, 7].map((day) => (
                <div key={day} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`remind${day}`}
                    name={`remindBefore${day}Days`}
                    className="h-4 w-4 rounded border-primary-border text-button-primary accent-button-primary focus:ring-highlight"
                  />
                  <label
                    htmlFor={`remind${day}`}
                    className="text-sm text-secondary-text"
                  >
                    {day}d
                  </label>
                </div>
              ))}
            </fieldset>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 font-semibold text-text-on-primary bg-button-primary rounded-md
                       hover:bg-button-primary-hover
                       focus:outline-none focus:ring-2 focus:ring-highlight focus:ring-offset-2 focus:ring-offset-container
                       disabled:bg-disabled-bg disabled:text-disabled-text disabled:cursor-not-allowed
                       transition-colors duration-200"
          >
            {isSubmitting ? "Saving..." : "Save Task"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
