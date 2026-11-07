import { useEffect, useId, useState, type ComponentProps } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { InfiniteSlider } from "@/components/ui/infinite-slider";

export type ProjectSlide = {
  title: string;
  desc: string;
  img: string;
  tags?: string[];
  appStore?: string;
  playStore?: string;
};

const columnSpeed: [number, number][] = [
  [30, 15],
  [50, 25],
  [35, 17],
  [42, 20],
  [28, 14],
];

function columnCountFor(width: number) {
  if (width >= 1536) return 5;
  if (width >= 1280) return 4;
  if (width >= 1024) return 3;
  if (width >= 768) return 2;
  return 1;
}

function useColumnCount() {
  const [count, setCount] = useState(() =>
    typeof window === "undefined" ? 1 : columnCountFor(window.innerWidth),
  );
  useEffect(() => {
    const update = () => setCount(columnCountFor(window.innerWidth));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return count;
}

function intoColumns(projects: ProjectSlide[], count: number) {
  const columns: ProjectSlide[][] = Array.from({ length: count }, () => []);
  projects.forEach((project, index) => {
    columns[index % count].push(project);
  });
  return columns;
}

export function TestimonialsSection({ projects = [] }: { projects?: ProjectSlide[] }) {
  const count = useColumnCount();
  const columns = intoColumns(projects, count);
  const [preview, setPreview] = useState<ProjectSlide | null>(null);

  return (
    <section className="relative py-10">
      <div className="mx-auto w-full min-w-0">
        <div className="mx-auto flex max-w-sm flex-col items-center justify-center gap-4 px-4">
          <div className="flex justify-center">
            <div className="rounded-lg border px-4 py-1">Projects</div>
          </div>

          <h2 className="font-bold text-3xl tracking-tighter lg:text-4xl">
            Shipped apps
          </h2>
          <p className="text-center text-muted-foreground text-sm">
            Screens from the apps on the App Store and Google Play.
          </p>
        </div>

        <div
          className={cn(
            "mt-10 flex w-full min-w-0 max-h-[40rem] justify-center gap-2 overflow-hidden px-1",
            "mask-[linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)]",
            "[mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)]",
          )}
        >
          {columns.map((column, index) =>
            column.length === 0 ? null : (
              <InfiniteSlider
                key={`${count}-${column[0]?.title ?? index}`}
                direction="vertical"
                speed={columnSpeed[index][0]}
                speedOnHover={columnSpeed[index][1]}
              >
                {column.map((project) => (
                  <ProjectCard key={project.title} project={project} onDetail={setPreview} />
                ))}
              </InfiniteSlider>
            ),
          )}
        </div>
      </div>
      {preview ? <ProjectPreview project={preview} onClose={() => setPreview(null)} /> : null}
    </section>
  );
}

function ProjectCard({
  project,
  onDetail,
  className,
  ...props
}: ComponentProps<"figure"> & {
  project: ProjectSlide;
  onDetail: (project: ProjectSlide) => void;
}) {
  const { title, desc, img } = project;
  return (
    <figure
      className={cn(
        "m-0 w-full min-w-0 overflow-hidden rounded-3xl border bg-card text-card-foreground shadow-foreground/10 shadow-lg [[data-theme=dark]_&]:bg-[#242822] [[data-theme=dark]_&]:text-[#F5F7F2]",
        className,
      )}
      {...props}
    >
      <div className="h-52 w-full overflow-hidden bg-muted">
        <img
          src={img}
          alt={title}
          draggable={false}
          className="h-full w-full object-cover"
        />
      </div>
      <figcaption className="p-5">
        <cite className="m-0 font-medium not-italic leading-5 tracking-tight">
          {title}
        </cite>
        <blockquote className="m-0 mt-2 text-sm leading-5 text-muted-foreground line-clamp-4">
          {desc}
        </blockquote>
        <button type="button" className="fc-btn fc-detail" onClick={() => onDetail(project)}>
          Detail
        </button>
      </figcaption>
    </figure>
  );
}

function ProjectPreview({ project, onClose }: { project: ProjectSlide; onClose: () => void }) {
  const titleId = useId();
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [onClose]);

  return createPortal(
    <div className="fc-preview" role="presentation" onClick={onClose}>
      <div
        className="fc-preview-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="fc-preview-shot">
          <img src={project.img} alt="" />
        </div>
        <div className="fc-preview-copy">
          <h3 id={titleId}>{project.title}</h3>
          <p>{project.desc}</p>
          <div className="fc-preview-links">
            {project.appStore ? (
              <a href={project.appStore} target="_blank" rel="noreferrer">App Store</a>
            ) : null}
            {project.playStore ? (
              <a href={project.playStore} target="_blank" rel="noreferrer">Google Play</a>
            ) : null}
          </div>
          <button type="button" className="fc-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default TestimonialsSection;
