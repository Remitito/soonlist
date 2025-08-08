import { TaskWithStatus } from "./ActiveTasks";
import { ProcessedTask } from "../actions/getTasks";
import { getDaysUntilDeadline } from "../utils/DateStuff";
import { FiCalendar, FiBell, FiBellOff } from "react-icons/fi";

interface TaskDisplayProps {
  task: TaskWithStatus;
  index: number;
  updateTaskField: <K extends keyof ProcessedTask>(
    index: number,
    field: K,
    value: ProcessedTask[K]
  ) => void;
  tomorrowString: string;
  inputStyle: string;
}

export const TaskDisplay: React.FC<TaskDisplayProps> = ({
  task,
  index,
  updateTaskField,
  tomorrowString,
  inputStyle,
}) => {
  const daysUntilDeadline = getDaysUntilDeadline(task.deadline);

  const getDeadlineColor = (days: number) => {
    if (days <= 1) return "text-red-600";
    if (days <= 6) return "text-yellow-600";
    return "text-green-600";
  };

  const enabledReminders = [];
  if (task.remindBefore1Days) enabledReminders.push("1 day");
  if (task.remindBefore3Days) enabledReminders.push("3 days");
  if (task.remindBefore7Days) enabledReminders.push("7 days");

  if (task.editing) {
    return (
      <div className="w-full md:h-20 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="flex flex-col md:col-span-2">
          <label
            htmlFor={`desc-${task._id}`}
            className="text-xs font-medium text-gray-500 mb-1"
          >
            Description
          </label>
          <input
            id={`desc-${task._id}`}
            type="text"
            className={inputStyle}
            value={task.description}
            maxLength={50}
            onChange={(e) =>
              updateTaskField(index, "description", e.target.value)
            }
          />
        </div>
        <div className="flex flex-col">
          <label
            htmlFor={`date-${task._id}`}
            className="text-xs font-medium text-gray-500 mb-1"
          >
            Deadline
          </label>
          <input
            id={`date-${task._id}`}
            type="date"
            className={inputStyle}
            min={tomorrowString}
            value={task.deadline.slice(0, 10)}
            onChange={(e) => {
              updateTaskField(index, "deadline", e.target.value);
            }}
          />
        </div>
        <div className="flex flex-col md:col-span-2 lg:col-span-1">
          <label className="text-xs font-medium text-gray-500 mb-1">
            Reminders
          </label>
          <div className="flex flex-row flex-wrap gap-x-4 gap-y-2 items-center min-h-[40px]">
            {[1, 3, 7].map((day) => {
              const fieldName = `remindBefore${day}Days`;
              const isDisabled =
                daysUntilDeadline < day ||
                (day === 1 && daysUntilDeadline === 1);
              return (
                <label key={day} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={task[fieldName as keyof ProcessedTask] as boolean}
                    className={
                      isDisabled ? "cursor-not-allowed opacity-50" : ""
                    }
                    disabled={isDisabled}
                    onChange={(e) =>
                      updateTaskField(
                        index,
                        fieldName as keyof ProcessedTask,
                        e.target.checked
                      )
                    }
                  />
                  {day} Day{day > 1 ? "s" : ""}
                </label>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="w-full md:h-20 rounded-lg border border-gray-200 p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="space-y-4  md:grid md:grid-cols-4 md:gap-6 md:space-y-0 md:items-center">
        <div className="md:col-span-2 min-w-0 break-words">
          <h3 className="text-base font-semibold text-gray-900">
            {task.description}
          </h3>
        </div>

        <div className="flex items-center space-x-2 text-sm">
          <FiCalendar className="h-4 w-4 flex-shrink-0 text-gray-400" />
          <div className="text-gray-500">
            Deadline in{" "}
            <span
              className={`font-medium ${getDeadlineColor(daysUntilDeadline)}`}
            >
              {daysUntilDeadline} days
            </span>
            <p>{task.deadline.slice(0, 10)}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-sm">
          {enabledReminders.length > 0 ? (
            <>
              <FiBell className="h-4 w-4 flex-shrink-0 text-gray-400" />
              <span className="text-gray-500">
                Reminders: {enabledReminders.join(", ")}
              </span>
            </>
          ) : (
            <>
              <FiBellOff className="h-4 w-4 flex-shrink-0 text-gray-400" />
              <span className="italic text-gray-400">No reminders set</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
