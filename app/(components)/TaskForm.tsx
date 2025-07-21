"use client";

import React, { useState, useRef } from "react";
import { createTask } from "../actions/createTask";
import { FiSave } from "react-icons/fi";

const containerStyles = "w-full mx-auto bg-gray-100 shadow-sm p-6 md:p-8";
const headingStyles = "text-2xl font-bold text-gray-800 text-center mb-8";
const formContainerStyles =
  "flex flex-col md:flex-row items-center md:items-end justify-center gap-6";
const formGroupStyles = "w-full flex flex-col";
const labelStyles = "text-sm text-center font-medium text-gray-600 mb-2";
const inputStyles = `
  bg-white border border-gray-300 text-gray-800 text-sm rounded-lg 
  focus:ring-green-500 focus:border-green-500 block w-full p-2.5 
  placeholder:text-gray-400
`;
const buttonWrapperStyles = "mt-8 flex justify-center";
const buttonStyles = `
  flex items-center gap-2 px-7 py-2.5 text-white bg-green-500 
  font-semibold rounded-full shadow-md hover:bg-green-600 
  focus:outline-none focus:ring-4 focus:ring-green-300 
  disabled:bg-gray-400 disabled:cursor-not-allowed
  transition-all duration-300 cursor-pointer
`;

const TaskForm = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formAction = async (formData: FormData) => {
    setIsSubmitting(true);
    await createTask(formData);
    setIsSubmitting(false);
    formRef.current?.reset();
  };

  return (
    <div className={containerStyles}>
      <h2 className={headingStyles}>
        Create a new task and setup email reminders in seconds...
      </h2>
      <form ref={formRef} className="w-full" action={formAction}>
        <div className={formContainerStyles}>
          <div className={`${formGroupStyles} md:w-2/5`}>
            <label htmlFor="description" className={labelStyles}>
              Task Description
            </label>
            <input
              id="description"
              type="text"
              name="description"
              placeholder="Cancel trial / Submit thesis"
              required
              className={inputStyles}
            />
          </div>

          <div className={`${formGroupStyles} md:w-auto`}>
            <label htmlFor="deadline" className={labelStyles}>
              Deadline Date
            </label>
            <div className="relative w-full">
              <input
                id="deadline"
                type="date"
                name="deadline"
                required
                className={`${inputStyles} pr-10`}
              />
            </div>
          </div>

          <fieldset className={`${formGroupStyles} md:w-auto`}>
            <legend className={labelStyles}>Remind me ___ before...</legend>
            <div className="flex flex-wrap justify-center items-center gap-4 min-h-[42px]">
              {[
                { day: 1, label: "1 day" },
                { day: 3, label: "3 days" },
                { day: 7, label: "7 days" },
              ].map(({ day, label }) => (
                <div key={day} className="flex items-center gap-1.5">
                  <input
                    type="checkbox"
                    id={`remind${day}`}
                    name={`remindBefore${day}Days`}
                    className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                  />
                  <label
                    htmlFor={`remind${day}`}
                    className="text-sm text-gray-600"
                  >
                    {label}
                  </label>
                </div>
              ))}
            </div>
          </fieldset>
        </div>

        <div className={buttonWrapperStyles}>
          <button
            type="submit"
            disabled={isSubmitting}
            className={buttonStyles}
          >
            <FiSave className="w-5 h-5" />
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
