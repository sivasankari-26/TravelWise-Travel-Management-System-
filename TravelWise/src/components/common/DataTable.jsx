import EmptyState from './EmptyState.jsx';
import { Inbox } from 'lucide-react';

export default function DataTable({ columns, rows, emptyMessage = 'No records found.' }) {
  if (!rows.length) {
    return <EmptyState icon={Inbox} title="Nothing here yet" message={emptyMessage} />;
  }

  return (
    <div className="table-scroll">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.id || i}>
              {columns.map((col) => (
                <td key={col.key}>{col.render ? col.render(row) : row[col.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
