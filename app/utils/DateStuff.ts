export const getFutureDateString = (daysAhead: number) => {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  return date.toISOString().split("T")[0];
};

export function checkIfToday(date: Date): boolean {
  if (!date) return false;
  return new Date(date).toDateString() === new Date().toDateString();
}

export const getDaysUntilDeadline = (deadline: Date | string): number => {
  const today = new Date();
  const deadlineDate = new Date(deadline);
  const diffTime = deadlineDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};
