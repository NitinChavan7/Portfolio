import { skillGroups } from "@/data/skills";

test("resume skill groups stay organized around Nitin's full stack profile", () => {
  expect(skillGroups.map((group) => group.title)).toEqual([
    "Frontend Engineering",
    "Backend & API Integration",
    "Database & Querying",
    "Product Domains",
    "Quality & Testing",
    "Delivery Tools",
  ]);
});

test("frontend, backend, database, and HRMS skills are represented", () => {
  const allSkills = skillGroups.flatMap((group) => group.skills);

  for (const skill of [
    "React.js",
    "Redux",
    "React DevTools",
    "Node.js",
    "Express.js",
    "REST APIs",
    "PostgreSQL",
    "SQL",
    "Jest Framework",
    "HRMS",
    "Payroll",
    "Employee Onboarding",
    "GitLab",
    "Postman",
    "Jira",
  ]) {
    expect(allSkills).toContain(skill);
  }
});
