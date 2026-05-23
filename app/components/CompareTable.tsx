import { CompareTableData, CompareRow, CompareSectionRow, CompareFeatureRow } from "@/lib/plans-data";
import { Section } from "@/app/components/Section";

interface CompareTableProps {
  title: string;
  subtitle: string;
  data: CompareTableData;
}

function isSectionRow(row: CompareRow): row is CompareSectionRow {
  return row.type === "section";
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

function RowItem({ row, columns }: { row: CompareFeatureRow; columns: CompareTableData["columns"] }) {
  return (
    <tr>
      <td>{row.label}</td>
      {columns.map((col, cidx) => (
        <Cell key={col.id} value={row.values[col.id] ?? null} isFeatured={cidx === columns.length - 1} />
      ))}
    </tr>
  );
}

export function CompareTable({ title, subtitle, data }: CompareTableProps) {
  const { featureLabel, columns, rows } = data;

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
              <th className="feat-col">{featureLabel}</th>
              {columns.map((col, cidx) => (
                <th key={col.id} className={`plan-col ${cidx === columns.length - 1 ? "plan-featured" : ""}`}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) =>
              isSectionRow(row) ? (
                <tr key={i} className="section-row">
                  <td colSpan={columns.length + 1}>{row.label}</td>
                </tr>
              ) : (
                <RowItem key={i} row={row} columns={columns} />
              )
            )}
          </tbody>
        </table>
      </div>
    </Section>
  );
}
