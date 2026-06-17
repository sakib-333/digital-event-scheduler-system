import { SectionShell } from "./section-shell";

const stats = [
  { value: "98%", label: "Efficiency Increase" },
  { value: "500+", label: "Institutions" },
];

export function AboutSection() {
  return (
    <SectionShell id="about" className="bg-white py-16 transition-colors dark:bg-card/40 lg:py-24">
      <div className="grid items-center gap-12 md:grid-cols-2">
        <div className="overflow-hidden rounded-2xl shadow-xl">
          <img
            src="https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1200&q=80"
            alt="Students collaborating in a modern university space"
            className="aspect-video h-full w-full object-cover"
          />
        </div>

        <div>
          <h2 className="text-4xl font-extrabold text-[#191b23] dark:text-foreground sm:text-5xl">
            Our Institutional Mission
          </h2>
          <p className="mt-6 text-base leading-7 text-[#434655] dark:text-muted-foreground">
            DESS was engineered by university infrastructure experts to bridge
            the gap between traditional scheduling hurdles and modern digital
            efficiency. We provide a robust architecture that handles the
            complexities of higher education logistical needs.
          </p>
          <p className="mt-4 text-base leading-7 text-[#434655] dark:text-muted-foreground">
            From automated conflict resolution for large-scale exams to tiered
            approval workflows for student-led hackathons, our system ensures
            that every event on campus is executed flawlessly.
          </p>
          <div className="mt-8 flex gap-10">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-5xl font-extrabold text-[#004ac6]">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm font-semibold text-[#434655] dark:text-muted-foreground">
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
