import { CompareRowData, CompareSection, CompareRowItem } from "@/lib/plans-data";
import { Section } from "@/app/components/Section";

interface CompareTableProps {
  title: string;
  subtitle: string;
  rows: CompareRowData[];
}

function isSection(row: CompareRowData): row is CompareSection {
  return "section" in row;
}

function Cell({ value, isFeatured }: { value: string | null; isFeatured?: boolean }) {
  if (value === null) {
    return <td className={`dash-cell ${isFeatured ? "featured-col" : ""}`}>—</td>;
  }
  if (value === "✓") {
    return <td className={`check-cell ${isFeatured ? "featured-col" : ""}`}>✓</td>;
  }
  if (value === "قريباً") {
    return (
      <td className={`soon-cell ${isFeatured ? "featured-col" : ""}`}>
        <span>{value}</span>
      </td>
    );
  }
  return <td className={`val-cell ${isFeatured ? "featured-col" : ""}`}>{value}</td>;
}

function RowItem({ row }: { row: CompareRowItem }) {
  return (
    <tr>
      <td>{row.label}</td>
      <Cell value={row.free} />
      <Cell value={row.advanced} />
      <Cell value={row.featured} isFeatured />
    </tr>
  );
}

export function CompareTable({ title, subtitle, rows }: CompareTableProps) {
  return (
    <Section className="bg-white">
      <div className="max-w-[1000px] mx-auto">
        <div className="text-center mb-[52px]">
          <h2 className="text-[clamp(26px,3.5vw,40px)] font-bold text-text mb-3">{title}</h2>
          <p className="text-base text-muted">{subtitle}</p>
        </div>

        <table className="compare-table">
          <thead>
            <tr>
              <th className="feat-col">الميزة</th>
              <th className="plan-col">المجانية</th>
              <th className="plan-col">المتقدمة</th>
              <th className="plan-col plan-featured">المميزة</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) =>
              isSection(row) ? (
                <tr key={i} className="section-row">
                  <td colSpan={4}>{row.section}</td>
                </tr>
              ) : (
                <RowItem key={i} row={row} />
              )
            )}
          </tbody>
        </table>
      </div>
    </Section>
  );
}
