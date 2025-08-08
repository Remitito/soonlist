# Deadline Desk (formerly Soonlist)

🚧 **This project is currently in development.** 🚧

**Your simple deadline list with just the reminders you need..**

Deadline Desk is a minimalist, single-purpose web application designed to do one thing exceptionally well: remind you of upcoming deadlines. Built for users who feel overwhelmed by complex to-do lists and project management software, Deadline Desk provides a clean, single-list view of your tasks, sorted by urgency.

## The Philosophy

In a world of feature-bloated productivity apps, Deadline Desk is an experiment in radical simplicity. The core workflow is designed to be frictionless:

1.  **Add a task** in a single input box.
2.  **Pick a deadline** from a calendar.
3.  **Choose when to be reminded** (1, 3, or 7 days before).

That's it. No multiple lists, no sub-tasks, no priorities, no tags. Just a clear, chronological list of what's next.

---

## Tech Stack

This project is being built with a modern, full-stack TypeScript architecture.

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Authentication**: [Auth.js](https://authjs.dev/) (with Google & Magic Link providers)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/atlas)
- **ODM / DB Client**: [Mongoose](https://mongoosejs.com/) / [Prisma](https://www.prisma.io/) _(Choose one and delete the other)_
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Scheduled Jobs**: [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs) for sending reminders
