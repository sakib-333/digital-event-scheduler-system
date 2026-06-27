import { SectionShell } from "./section-shell";

const stats = [
  { value: "98%", label: "Efficiency Increase" },
  { value: "500+", label: "Institutions" },
];

export function AboutSection() {
  return (
    <SectionShell id="about" className="bg-card py-16 transition-colors dark:bg-card/40 lg:py-24">
      <div className="grid min-w-0 items-center gap-12 md:grid-cols-2">
        <div className="overflow-hidden rounded-2xl shadow-xl">
          <img
            src="https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1200&q=80"
            alt="Students collaborating in a modern university space"
            className="aspect-video h-full w-full object-cover"
          />
        </div>

        <div className="min-w-0">
          <h2 className="text-4xl font-extrabold text-foreground sm:text-5xl">
            Our Institutional Mission
          </h2>
          <p className="mt-6 text-base leading-7 text-muted-foreground">
            DESS was engineered by university infrastructure experts to bridge
            the gap between traditional scheduling hurdles and modern digital
            efficiency. We provide a robust architecture that handles the
            complexities of higher education logistical needs.
          </p>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            From automated conflict resolution for large-scale exams to tiered
            approval workflows for student-led hackathons, our system ensures
            that every event on campus is executed flawlessly.
          </p>
          <div className="mt-8 flex flex-wrap gap-x-10 gap-y-6">
            {stats.map((stat) => (
              <div key={stat.label} className="min-w-0">
                <p className="text-5xl font-extrabold text-primary">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm font-semibold text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
