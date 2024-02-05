# Relay — Open-Source Team Automation & Workflow Hub

**Less busywork. More forward.** Relay is a free, customizable website template that brings a team’s social media schedule, project stages, daily workflows, and activity updates into one responsive workspace.

[Open the live hub](https://georgiarachel07.github.io/team-automation-hub/) · [Use the source template](https://github.com/georgiarachel07/team-automation-hub)

Enter your organization, team members, and project titles, then select **Generate Hub**. Relay instantly updates its branding, projects, member selectors, and About section. Keep your workspace in your browser or download a self-contained HTML copy to edit and host yourself.

**This is an automation sandbox. It does not publish social posts, connect social accounts, run a server, or synchronize a team’s data.** All actions are local demonstrations.

## Features

- White-label setup: organization name, 1–20 team members, and 1–8 custom projects.
- Social Media Automation Queue with platform, owner, project, and scheduled local time.
- Mock posts move from **Scheduled** to **Demo completed** when due, or immediately through **Run demo now**. Scheduled posts can be cancelled without deleting their record.
- Pause/resume the browser’s demo scheduler and filter posts by status.
- Project stage controls: Planned, In progress, and Completed.
- Daily workflow checklist with custom tasks and owners.
- Live Team Activity Tracker that reflects actual interactions and mock scheduler events, including user-authored status updates.
- Summary cards calculated from the current queue, projects, checklist, and member list.
- Browser-local persistence and a visible warning if storage is unavailable.
- Download your personalized hub as one HTML file with embedded CSS, JavaScript, workspace data, and license notice. The generated file has no external runtime dependencies and starts its demo scheduler paused.
- Responsive layout, inline SVG icons, native dialogs, labels, keyboard focus styles, skip link, screen-reader action announcements, and reduced-motion support.
- No account, package installation, build process, analytics scripts, API keys, or external libraries required.

## Project structure

```text
team-automation-hub/
├── index.html  # Accessible dashboard, setup form, About, and editors
├── style.css   # Responsive visual system and interface styles
├── script.js   # Generator, mock scheduler, local persistence, downloads
├── README.md   # Setup, usage, deployment, and integration guide
└── LICENSE     # MIT license
```

## Clone and run

```bash
git clone https://github.com/georgiarachel07/team-automation-hub.git
cd team-automation-hub
```

Open `index.html` in a current browser to use the dashboard. For the **Download my hub** feature from the multi-file source, use the hosted website or a local static server: browsers commonly block CSS/JavaScript fetches from `file://` URLs.

If Python 3 is installed, start a local server from the repository folder:

```bash
python -m http.server 8000
```

Open `http://localhost:8000`. Alternatively, use an editor’s static preview extension or any static web server. Previously generated standalone downloads embed their source and can generate new copies without fetching local assets.

## Generate your own hub

1. Open the live website or your local preview.
2. Expand **Make room for your team** if it is collapsed.
3. Enter your organization name, one member per line, and one project title per line. Member names and project titles must each be distinct within their list.
4. Select **Generate Hub**. Your organization appears in the heading and browser title; the About section and workspace controls update instantly.
5. Add mock posts, status updates, and workflow tasks using the buttons in each section.
6. Select **Download my hub** to generate your own HTML copy. Open it, modify its source, or publish it under your own domain. Retain the MIT license notice.

Generating a personal hub for the first time removes the example posts/activity and starts a fresh personal checklist. Later setup edits preserve your existing posts, tasks, and activity. Historical records retain their original owner and project labels, even if you remove those names from setup. Projects with unchanged titles retain their stage; renamed/new titles create new projects.

**Restore example workspace** opens a confirmation dialog before replacing your browser-local hub. Download a backup first if you want to preserve it.

## Try the mock automations

### Social media queue

1. Select **Add mock post**.
2. Enter a title, choose a platform, and select an owner and project.
3. Choose a future time within one year, using your browser’s local timezone.
4. Add the post to the queue. Use **Run demo now** to complete the mock action immediately, or leave the visible tab open until its scheduled time.
5. Inspect the activity tracker. It explicitly states that nothing was sent to the platform.

The timer checks for due posts every second while scheduling is enabled, the page is visible, and no editor dialog is open. It is not a background job service. Closed tabs do not run tasks. Overdue queued mock posts are processed when the page is visible again and the scheduler is enabled. Browser timers may be delayed by the browser or operating system.

### Team status updates and daily workflows

Select **Team status update**, choose a member and project, select On track / Needs help / Completed, and write a note. It appears immediately in this browser’s activity feed. A status note does not change the project’s stage; use the project’s stage selector for that.

Use the plus button in **Daily workflows** to add a checklist item. Completing or reopening it updates the summary and activity feed. The checklist is manually managed; it does not automatically reset at midnight or repeat on a schedule.

## Data, privacy, and practical limits

- Workspace records live in `localStorage` under a versioned, per-copy key. They are not sent to an application backend.
- Every visitor gets their own local copy. Two people opening the same website do not share a live workspace. Changes in separate tabs are not synchronized automatically; avoid editing the same browser copy in multiple tabs.
- Clearing site data removes locally saved work. Download your hub to back it up.
- Downloads include your organization, members, projects, queue, checklist, and activity. Anyone you share that file with can read those values. Publish only data intended for that audience.
- The app limits queues to 100 posts, checklists to 100 tasks, and activity to the most recent 100 events. Download and archive a workspace or restore the example if you need to begin again.
- Names and notes are rendered as text/escaped HTML. Stored/downloaded data is validated before being loaded.
- Static hosting is not an authenticated system; use an appropriate backend and authorization before handling private team data.

## Make a GitHub copy and deploy free

1. On the source repository, select **Use this template → Create a new repository**, or fork it.
2. Choose your own repository name. Use a public repository for GitHub Pages on GitHub Free.
3. Keep `index.html`, `style.css`, and `script.js` in the root of the publishing branch. Keep LICENSE when redistributing.
4. Open **Settings → Pages**.
5. Under **Build and deployment → Source**, choose **Deploy from a branch**.
6. Select **main** and **/(root)**, then **Save**. Choose your actual publishing branch if it has another name.
7. Wait for the Pages build in **Actions** to succeed.
8. Open the URL shown in **Settings → Pages**. A project website usually has the form `https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/`.

Relative asset links support repository subpaths. Future commits to the publishing branch redeploy the site. See GitHub’s [official Pages configuration guide](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

You can instead publish a generated standalone HTML file as your own `index.html`. It contains the workspace you downloaded and requires no companion CSS or JavaScript files.

## Connect real backend automations

The current project deliberately simulates execution. To connect real services:

1. **Add authentication and authorization.** Introduce team accounts and server-enforced workspace membership before accepting shared records.
2. **Store records in a database.** Replace browser-only state reads/writes with validated API requests. Preserve IDs and use concurrency control to prevent lost updates.
3. **Run scheduling on a server.** Use a durable job queue or scheduler with explicit timezone handling, retries, idempotency keys, cancellation, and run logs. A browser interval cannot guarantee timely execution.
4. **Integrate official provider APIs.** Obtain the appropriate consent and scopes for each supported social platform; confirm publication with the provider’s response. Store credentials on the server, never in browser code or a public repository.
5. **Reflect true execution state.** Replace `completePost()` with a server request or subscription. Distinguish queued, running, succeeded, failed, cancelled, and disconnected states. Do not mark jobs completed merely because the browser sent a request.
6. **Stream activity safely.** Use polling, Server-Sent Events, or WebSockets to receive authorized team events. Add loading, stale-state, and error feedback.
7. **Review platform requirements.** Confirm the current API limits, supported publishing formats, permissions, and provider rules in the platform’s official documentation before integrating.

GitHub Pages serves static files; host your backend elsewhere. Suitable integration points in `script.js` are `save()`, `completePost()`, `log()`, and the post/status/task submit handlers. The included MIT license covers this template; third-party services have their own terms.

## Why teams use a workflow hub

Putting schedules, project stages, ownership, and daily work in one view helps teams see what happens next and who owns it. A marketing team can review the next content rollout; a project lead can spot a stalled initiative; contributors can share progress and coordinate handoffs. Clear activity records reduce repeated status questions.

This template demonstrates that interaction model. Reliable shared monitoring, real publishing, and always-on automation require the backend described above.

## Customize the interface

- Edit the color, spacing, border, and typography tokens at the top of `style.css`.
- Edit headings and section descriptions in `index.html`.
- Change `example()` in `script.js` to customize the starting example. Existing local saves take precedence; restore the example to load revised defaults.
- Update the GitHub links in `index.html` and this README when making your own repository copy.
- If changing the persistence schema, add an explicit migration or change the versioned key; keep `valid()` aligned with new fields.
- Increment the `?v=` query strings in `index.html` when deploying changed assets so browsers load the new code.

## License

MIT License — Copyright (c) **2023 Georgia Rachel and contributors**. Use, modify, redistribute, and build on the template, including commercially, while retaining the license notice. See [LICENSE](./LICENSE).

