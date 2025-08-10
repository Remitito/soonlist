"use client";

import React, { useEffect, useState } from "react";
import { createTask } from "../actions/createTask";
import { FiSave, FiXCircle } from "react-icons/fi";
import StatusPopup from "./StatusPopup";
import LoginPopup from "./LoginPopup";
import { checkIfToday, getDaysUntilDeadline } from "../utils/DateStuff";

const containerStyles = "w-full mx-auto bg-gray-100 shadow-sm p-6 md:p-8";
const headingStyles =
  "text-xl md:text-2xl font-bold text-gray-800 text-center mb-8";
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
  flex items-center gap-2 px-7 py-2 
  font-semibold rounded-full shadow-md   
  focus:outline-none focus:ring-4 
  disabled:bg-gray-400 disabled:cursor-not-allowed
  transition-all duration-300 cursor-pointer
`;

interface TaskFormProps {
  loggedIn: boolean;
  setShowTaskForm: (val: boolean) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ loggedIn, setShowTaskForm }) => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowString = tomorrow.toISOString().split("T")[0];

  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState(tomorrowString);
  const [reminders, setReminders] = useState<{ [key: number]: boolean }>({
    1: false,
    3: false,
    7: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginPopupIsOpen, setLoginPopupIsOpen] = useState(false);
  const daysUntilDeadline = getDaysUntilDeadline(deadline);

  const [statusPopup, setStatusPopup] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const handleSubmit = async () => {
    if (!description) {
      setStatusPopup({ message: "Please add a description", type: "error" });
      return;
    }

    if (!loggedIn) {
      setLoginPopupIsOpen(true);
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("description", description);
    formData.append("deadline", deadline);
    Object.entries(reminders).forEach(([day, checked]) => {
      if (checked) {
        formData.append(`remindBefore${day}Days`, "on");
      }
    });

    const result = await createTask(formData);
    setIsSubmitting(false);

    setStatusPopup({
      message: result.message,
      type: result.message.startsWith("Success") ? "success" : "error",
    });

    if (result.message.startsWith("Success")) {
      setDescription("");
      setDeadline(tomorrowString);
      setReminders({ 1: false, 3: false, 7: false });
      localStorage.removeItem("taskFormDraft");
      setShowTaskForm(false);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem("taskFormDraft");
    if (saved) {
      const { description, deadline, reminders, date } = JSON.parse(saved);
      if (checkIfToday(date)) {
        setDescription(description || "");
        setDeadline(deadline || tomorrowString);
        setReminders(reminders || { 1: false, 3: false, 7: false });
      }
    }
  }, []);

  useEffect(() => {
    const date = new Date();
    const draft = { description, deadline, reminders, date };
    localStorage.setItem("taskFormDraft", JSON.stringify(draft));
  }, [description, deadline, reminders]);

  useEffect(() => {
    setReminders((prev) => {
      const updated = { ...prev };
      let hasChanges = false;

      [1, 3, 7].forEach((day) => {
        const isPastReminder =
          day === 1 ? daysUntilDeadline <= day : daysUntilDeadline < day;

        if (isPastReminder && prev[day]) {
          updated[day] = false;
          hasChanges = true;
        }
      });

      return hasChanges ? updated : prev;
    });
  }, [deadline]);

  return (
    <div className={containerStyles}>
      {statusPopup && (
        <StatusPopup
          message={statusPopup.message}
          type={statusPopup.type}
          onClose={() => setStatusPopup(null)}
        />
      )}

      <h2 className={headingStyles}>
        Create a new deadline and setup email reminders in seconds...
      </h2>

      <div className={formContainerStyles}>
        <div className={`${formGroupStyles} md:w-2/5`}>
          <label htmlFor="description" className={labelStyles}>
            Description
          </label>
          <input
            id="description"
            type="text"
            name="description"
            maxLength={50}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Cancel trial / Submit thesis"
            required
            className={inputStyles}
          />
        </div>

        <div className={`${formGroupStyles} md:w-auto`}>
          <label htmlFor="deadline" className={labelStyles}>
            Deadline Date
          </label>
          <input
            id="deadline"
            type="date"
            name="deadline"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
            min={tomorrowString}
            className={`${inputStyles} pr-10`}
          />
        </div>

        <fieldset className={`${formGroupStyles} md:w-auto`}>
          <legend className={labelStyles}>Remind me ___ before...</legend>
          <div className="flex flex-wrap justify-center items-center gap-4 min-h-[42px]">
            {[1, 3, 7].map((day) => {
              const isDisabled =
                daysUntilDeadline < day ||
                (day === 1 && daysUntilDeadline === 1);
              return (
                <div key={day} className="flex items-center gap-1.5">
                  <input
                    type="checkbox"
                    id={`remind${day}`}
                    name={`remindBefore${day}Days`}
                    checked={reminders[day]}
                    disabled={isDisabled}
                    onChange={() =>
                      setReminders((prev) => ({
                        ...prev,
                        [day]: !prev[day],
                      }))
                    }
                    className={`w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 ${
                      isDisabled ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  />
                  <label
                    htmlFor={`remind${day}`}
                    className="text-sm text-gray-600"
                  >
                    {day} day{day > 1 && "s"}
                  </label>
                </div>
              );
            })}
          </div>
        </fieldset>
      </div>
      <div className="flex flex-row w-full items-center justify-center space-x-6">
        <div className={buttonWrapperStyles}>
          <button
            onClick={() => setShowTaskForm(false)}
            disabled={isSubmitting}
            className={`${buttonStyles} bg-red-500 hover:bg-red-600 text-white focus:ring-red-300`}
          >
            <FiXCircle className="w-5 h-5" />
            Close
          </button>
        </div>
        <div className={buttonWrapperStyles}>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`${buttonStyles} bg-green-500 hover:bg-green-600 text-white focus:ring-green-300`}
          >
            <FiSave className="w-5 h-5" />
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      <LoginPopup
        loginPopupIsOpen={loginPopupIsOpen}
        onClose={() => setLoginPopupIsOpen(false)}
      />
    </div>
  );
};

export default TaskForm;
