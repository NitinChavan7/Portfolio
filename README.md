# Nitin Chavan - Full Stack Developer Portfolio

A premium, responsive portfolio for **Nitin Chavan**, a full stack developer with 2+ years of experience delivering React.js interfaces, Node.js APIs, PostgreSQL-backed workflows, dashboards, admin panels, and business web applications.

The portfolio presents professional experience, resume-backed skills, selected projects, delivery discipline, collaborator feedback, and an EmailJS-powered contact form.

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- CSS with custom responsive styling
- EmailJS contact form
- Vitest unit tests
- Playwright end-to-end and responsive checks

## Local Development

Use Node.js 20 or newer.

```bash
npm install
npm run dev
```

Common scripts:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Project Structure

- `src/app` - routes, metadata, homepage, manifest, sitemap, robots
- `src/components` - EmailJS bridge, command palette, UI helpers
- `src/config/site.ts` - name, contact details, resume link, navigation
- `src/data` - projects, skills, experience, testimonials
- `public/images` - profile, project, and testimonial images
- `public/resume/nitin-chavan-resume.pdf` - downloadable resume
- `tests` - unit and browser test coverage

## Contact Form Setup

The contact form uses EmailJS and reads these variables from `.env.local`:

```env
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_lulvf4t
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_q79v6cv
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=0hKpo709YyIpXzaQ9
REACT_APP_EMAILJS_SERVICE_ID=service_lulvf4t
REACT_APP_EMAILJS_TEMPLATE_ID=template_q79v6cv
REACT_APP_EMAILJS_USER_ID=0hKpo709YyIpXzaQ9
```

If sending fails with a Gmail grant error, reconnect the Gmail account in:

EmailJS Dashboard -> Email Services -> `service_lulvf4t` -> Reconnect Gmail.

## Profile Details

- Name: Nitin Chavan
- Role: Full Stack Developer
- Location: Hyderabad, India
- Email: `nitin.k.chavan1001@gmail.com`
- Phone: `+91 9325997861`
- Resume: `public/resume/nitin-chavan-resume.pdf`

## Quality Checks

Before deployment, run:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

The UI is designed to stay responsive across desktop, tablet, and mobile without horizontal overflow.
