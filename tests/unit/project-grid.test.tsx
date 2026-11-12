import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { ProjectGrid } from "@/components/project-grid";
vi.mock("next/image", () => ({
  default: (
    imageProps: React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean },
  ) => {
    const props = { ...imageProps };
    delete props.fill;
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img alt={props.alt ?? ""} {...props} />
    );
  },
}));
describe("Project filters", () => {
  it("filters by AI and exposes modal case study actions", async () => {
    render(<ProjectGrid />);
    fireEvent.click(screen.getByRole("button", { name: "AI" }));
    expect(screen.getByText("Netflix GPT")).toBeInTheDocument();
    await waitFor(() =>
      expect(
        screen.queryByText("Quick Chat – MERN Stack Chat App"),
      ).not.toBeInTheDocument(),
    );
    expect(screen.getByText("Three-Way Match Engine")).toBeInTheDocument();
    expect(screen.queryByText("Pipeline Builder")).not.toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Case study" })).toHaveLength(
      4,
    );
  });

  it("includes Pipeline Builder in Full Stack, Frontend, and Backend only", async () => {
    render(<ProjectGrid />);
    for (const category of ["Full Stack", "Frontend", "Backend"]) {
      fireEvent.click(screen.getByRole("button", { name: category }));
      expect(screen.getByText("Pipeline Builder")).toBeInTheDocument();
    }
    fireEvent.click(screen.getByRole("button", { name: "AI" }));
    await waitFor(() =>
      expect(screen.queryByText("Pipeline Builder")).not.toBeInTheDocument(),
    );
  });

  it("includes the match engine in its existing project categories", async () => {
    render(<ProjectGrid />);
    for (const category of ["Full Stack", "Backend"]) {
      fireEvent.click(screen.getByRole("button", { name: category }));
      expect(screen.getByText("Three-Way Match Engine")).toBeInTheDocument();
    }
  });

  it("renders TraceGraph in Full Stack and Backend but not AI", async () => {
    render(<ProjectGrid />);
    for (const category of ["Full Stack", "Backend"]) {
      fireEvent.click(screen.getByRole("button", { name: category }));
      expect(screen.getByText("TraceGraph")).toBeInTheDocument();
    }
    fireEvent.click(screen.getByRole("button", { name: "AI" }));
    await waitFor(() =>
      expect(screen.queryByText("TraceGraph")).not.toBeInTheDocument(),
    );
  });

  it("renders TraceGraph chips and its shared-modal actions", () => {
    render(<ProjectGrid />);
    const card = screen.getByText("TraceGraph").closest("article");
    expect(card).not.toBeNull();
    expect(
      within(card as HTMLElement).getByText("CognoDB"),
    ).toBeInTheDocument();
    expect(
      within(card as HTMLElement).getByText("openCypher"),
    ).toBeInTheDocument();
    expect(
      within(card as HTMLElement).getByText("React Flow"),
    ).toBeInTheDocument();
    expect(
      within(card as HTMLElement).getByText("Neo4j Driver"),
    ).toBeInTheDocument();
    expect(
      within(card as HTMLElement).getByRole("button", { name: "Case study" }),
    ).toHaveAttribute("data-case-study-slug", "tracegraph");
    expect(within(card as HTMLElement).getAllByRole("link")).toHaveLength(2);
  });

  it("renders Case study, Code, and Live for Three-Way Match Engine", () => {
    render(<ProjectGrid />);
    const card = screen.getByText("Three-Way Match Engine").closest("article");
    expect(card).not.toBeNull();
    const links = within(card as HTMLElement).getAllByRole("link");
    expect(links).toHaveLength(2);
    expect(links.map((link) => link.textContent?.trim())).toEqual([
      "Code",
      "Live",
    ]);
    expect(
      within(card as HTMLElement).getByRole("button", { name: "Case study" }),
    ).toHaveAttribute("data-case-study-slug", "three-way-match-engine");
  });

  it("renders Case study, Code, and Live for Pipeline Builder", () => {
    render(<ProjectGrid />);
    const card = screen.getByText("Pipeline Builder").closest("article");
    expect(card).not.toBeNull();
    const links = within(card as HTMLElement).getAllByRole("link");
    expect(links).toHaveLength(2);
    expect(links.map((link) => link.textContent?.trim())).toEqual([
      "Code",
      "Live",
    ]);
    expect(
      within(card as HTMLElement).getByRole("button", { name: "Case study" }),
    ).toHaveAttribute("data-case-study-slug", "pipeline-builder");
  });

  it("renders a non-empty technology container capped at six on every card", () => {
    render(<ProjectGrid />);
    for (const card of document.querySelectorAll("article.project-card")) {
      const tags = card.querySelector(".tags");
      expect(tags).toBeInTheDocument();
      expect(tags?.children.length).toBeGreaterThan(0);
      expect(tags?.children.length).toBeLessThanOrEqual(6);
    }
  });
});
