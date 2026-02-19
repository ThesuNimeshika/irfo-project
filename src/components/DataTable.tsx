"use client"

import { useMemo, useState, useEffect } from "react"
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table"

type FundData = {
  fundCode: string
  fundName: string
  date: string
  creationPrice: number
  redeemPrice: number
  status: string
  pending: number
  approved: number
  confirm: string
}

const columnHelper = createColumnHelper<FundData>()

const sampleData: FundData[] = [
  { fundCode: "FND001", fundName: "Growth Equity Fund",       date: "2024-01-15", creationPrice: 4500.00, redeemPrice: 4300.00, status: "Active",   pending: 5, approved: 12, confirm: "Yes" },
  { fundCode: "FND002", fundName: "Tech Innovation Fund",     date: "2024-01-15", creationPrice: 3800.00, redeemPrice: 3700.00, status: "Active",   pending: 3, approved: 8,  confirm: "No"  },
  { fundCode: "FND003", fundName: "Balanced Income Fund",     date: "2024-01-15", creationPrice: 5200.50, redeemPrice: 5100.00, status: "Inactive", pending: 2, approved: 5,  confirm: "Yes" },
  { fundCode: "FND004", fundName: "Global Opportunities Fund",date: "2024-01-15", creationPrice: 6100.75, redeemPrice: 6000.00, status: "Active",   pending: 4, approved: 10, confirm: "No"  },
  { fundCode: "FND005", fundName: "Emerging Markets Fund",    date: "2024-01-15", creationPrice: 2950.00, redeemPrice: 2900.00, status: "Active",   pending: 1, approved: 3,  confirm: "Yes" },
  { fundCode: "FND006", fundName: "Fixed Income Fund",        date: "2024-01-15", creationPrice: 1800.00, redeemPrice: 1780.00, status: "Active",   pending: 0, approved: 7,  confirm: "Yes" },
  { fundCode: "FND007", fundName: "Dividend Growth Fund",     date: "2024-01-15", creationPrice: 3200.00, redeemPrice: 3100.00, status: "Inactive", pending: 2, approved: 4,  confirm: "No"  },
]

export default function DataTable({
  onTotalCountChange,
  onVisibleCountChange,
}: {
  onTotalCountChange?: (count: number) => void
  onVisibleCountChange?: (count: number) => void
} = {}) {
  const [pageSize, setPageSize] = useState(5)
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState("")
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Reset to page 1 when search or pageSize changes
  useEffect(() => { setCurrentPage(1) }, [search, pageSize])

  const columns = useMemo(() => [
    columnHelper.accessor("fundCode", {
      header: "Fund Code",
      cell: info => (
        <span style={{ fontWeight: 700, color: '#1e3a8a', fontFamily: 'monospace', fontSize: 12 }}>
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("fundName", {
      header: "Fund Name",
      cell: info => (
        <span style={{ color: '#1f2937', fontWeight: 600 }}>{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor("date", {
      header: "Date",
      cell: info => (
        <span style={{ color: '#6b7280', fontSize: 12 }}>
          {new Date(info.getValue()).toLocaleDateString("en-GB")}
        </span>
      ),
    }),
    columnHelper.accessor("creationPrice", {
      header: "Creation Price",
      cell: info => (
        <span style={{ fontWeight: 700, color: '#1e3a8a', fontVariantNumeric: 'tabular-nums' }}>
          LKR {info.getValue().toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      ),
    }),
    columnHelper.accessor("redeemPrice", {
      header: "Redeem Price",
      cell: info => (
        <span style={{ fontWeight: 700, color: '#0d7f5a', fontVariantNumeric: 'tabular-nums' }}>
          LKR {info.getValue().toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      ),
    }),
    columnHelper.accessor("pending", {
      header: "Pending",
      cell: info => {
        const v = info.getValue()
        return (
          <span style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            minWidth: 24, height: 22, padding: '0 7px',
            background: v > 0 ? '#fef3c7' : '#f3f4f6',
            color: v > 0 ? '#b45309' : '#9ca3af',
            borderRadius: 4, fontWeight: 700, fontSize: 11,
          }}>
            {v}
          </span>
        )
      },
    }),
    columnHelper.accessor("confirm", {
      header: "Confirm",
      cell: info => {
        const v = info.getValue()
        return (
          <span style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            minWidth: 24, height: 22, padding: '0 7px',
            background: v === "Yes" ? '#dbeafe' : '#f3f4f6',
            color: v === "Yes" ? '#1e3a8a' : '#9ca3af',
            borderRadius: 4, fontWeight: 700, fontSize: 11,
          }}>
            {v === "Yes" ? "✓" : "–"}
          </span>
        )
      },
    }),
    columnHelper.accessor("approved", {
      header: "Approved",
      cell: info => {
        const v = info.getValue()
        return (
          <span style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            minWidth: 24, height: 22, padding: '0 7px',
            background: v > 0 ? '#dcfce7' : '#f3f4f6',
            color: v > 0 ? '#0d7f5a' : '#9ca3af',
            borderRadius: 4, fontWeight: 700, fontSize: 11,
          }}>
            {v}
          </span>
        )
      },
    }),
  ], [])

  const filteredData = useMemo(() => {
    if (!search.trim()) return sampleData
    const q = search.toLowerCase()
    return sampleData.filter(row =>
      Object.values(row).some(val => String(val).toLowerCase().includes(q))
    )
  }, [search])

  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize))
  const safePage = Math.min(currentPage, totalPages)

  const paginatedData = useMemo(() => {
    const start = (safePage - 1) * pageSize
    return filteredData.slice(start, start + pageSize)
  }, [filteredData, safePage, pageSize])

  useEffect(() => {
    onTotalCountChange?.(filteredData.length)
    onVisibleCountChange?.(paginatedData.length)
  }, [filteredData.length, paginatedData.length, onTotalCountChange, onVisibleCountChange])

  const table = useReactTable({
    data: paginatedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const startRecord = filteredData.length === 0 ? 0 : (safePage - 1) * pageSize + 1
  const endRecord = Math.min(safePage * pageSize, filteredData.length)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, padding: isMobile ? '8px 12px' : '10px 20px', width: '100%', boxSizing: 'border-box' }}>
      <style>{`
        .dt-container { width: 100%; display: flex; flex-direction: column; flex: 1; min-height: 0; }

        /* Controls bar */
        .dt-controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 8px;
          flex-wrap: wrap;
          flex-shrink: 0;
        }

        .dt-controls-left {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: #6b7280;
          font-family: 'Lato', system-ui, sans-serif;
          font-weight: 600;
        }

        .dt-select {
          border: 1px solid rgba(0,0,0,0.12);
          border-radius: 6px;
          padding: 4px 8px;
          font-size: 12px;
          font-family: 'Lato', system-ui, sans-serif;
          background: #fff;
          color: #1f2937;
          cursor: pointer;
          height: 28px;
          outline: none;
        }

        .dt-select:focus {
          border-color: #1e3a8a;
          box-shadow: 0 0 0 3px rgba(30,58,138,0.10);
        }

        .dt-search {
          border: 1px solid rgba(0,0,0,0.12);
          border-radius: 6px;
          padding: 0 10px 0 30px;
          font-size: 12px;
          font-family: 'Lato', system-ui, sans-serif;
          background: #fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='11' cy='11' r='8'/%3E%3Cpath d='m21 21-4.35-4.35'/%3E%3C/svg%3E") no-repeat 9px center;
          color: #1f2937;
          height: 28px;
          width: 180px;
          outline: none;
          transition: all 0.18s;
        }

        .dt-search:focus {
          border-color: #1e3a8a;
          box-shadow: 0 0 0 3px rgba(30,58,138,0.10);
          width: 220px;
        }

        /* Table wrapper — flex to fill space */
        .dt-table-wrap {
          border: 1px solid rgba(0,0,0,0.08);
          border-radius: 8px;
          overflow: hidden;
          background: #fff;
          box-shadow: 0 1px 4px rgba(0,0,0,0.05);
          flex: 1;
          min-height: 0;
          display: flex;
          flex-direction: column;
        }

        /* Scrollable area — both axes, sticky thead */
        .dt-scroll {
          overflow-x: auto;
          overflow-y: auto;
          flex: 1;
          min-height: 0;
          scrollbar-width: thin;
          scrollbar-color: rgba(30,58,138,0.30) rgba(0,0,0,0.04);
        }
        .dt-scroll::-webkit-scrollbar { width: 7px; height: 7px; }
        .dt-scroll::-webkit-scrollbar-track { background: rgba(0,0,0,0.04); border-radius: 4px; }
        .dt-scroll::-webkit-scrollbar-thumb { background: rgba(30,58,138,0.28); border-radius: 4px; }
        .dt-scroll::-webkit-scrollbar-thumb:hover { background: rgba(30,58,138,0.50); }

        .dt-table {
          width: 100%;
          border-collapse: collapse;
          font-family: 'Lato', system-ui, sans-serif;
        }

        .dt-table thead tr {
          background: #f1f4f9;
          border-bottom: 1px solid rgba(0,0,0,0.08);
        }

        /* Sticky header inside scroll container */
        .dt-table thead {
          position: sticky;
          top: 0;
          z-index: 2;
        }

        .dt-table th {
          padding: 9px 14px;
          text-align: left;
          font-size: 10px;
          font-weight: 700;
          color: #9ca3af;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          white-space: nowrap;
          border-right: 1px solid rgba(0,0,0,0.05);
        }

        .dt-table th:last-child { border-right: none; }

        .dt-table tbody tr {
          border-bottom: 1px solid rgba(0,0,0,0.06);
          transition: background 0.12s;
        }

        .dt-table tbody tr:last-child { border-bottom: none; }

        .dt-table tbody tr:hover { background: #f8faff; }
        .dt-table tbody tr:nth-child(even) { background: #fafbfd; }
        .dt-table tbody tr:nth-child(even):hover { background: #f4f7ff; }

        .dt-table td {
          padding: 9px 14px;
          font-size: 12px;
          color: #1f2937;
          white-space: nowrap;
          border-right: 1px solid rgba(0,0,0,0.04);
        }

        .dt-table td:last-child { border-right: none; }

        /* Empty state */
        .dt-empty {
          text-align: center;
          padding: 32px;
          color: #9ca3af;
          font-size: 13px;
          font-style: italic;
        }

        /* Footer bar */
        .dt-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 14px;
          border-top: 1px solid rgba(0,0,0,0.07);
          background: #fafbfd;
          flex-wrap: wrap;
          gap: 8px;
        }

        .dt-info {
          font-size: 11px;
          color: #9ca3af;
          font-family: 'Lato', system-ui, sans-serif;
          font-weight: 600;
        }

        .dt-info b { color: #4b5563; }

        /* Pagination */
        .dt-pagination {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .dt-page-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 28px;
          height: 28px;
          padding: 0 6px;
          border: 1px solid rgba(0,0,0,0.10);
          border-radius: 6px;
          background: #fff;
          font-size: 12px;
          font-family: 'Lato', system-ui, sans-serif;
          font-weight: 700;
          color: #4b5563;
          cursor: pointer;
          transition: all 0.15s;
          line-height: 1;
        }

        .dt-page-btn:hover:not(:disabled) {
          background: #eef2ff;
          border-color: #1e3a8a;
          color: #1e3a8a;
        }

        .dt-page-btn.active {
          background: #1e3a8a;
          border-color: #1e3a8a;
          color: #fff;
          box-shadow: 0 2px 8px rgba(30,58,138,0.28);
        }

        .dt-page-btn:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }
      `}</style>

      <div className="dt-container">
        {/* Controls */}
        <div className="dt-controls">
          <div className="dt-controls-left">
            <span>Show</span>
            <select
              className="dt-select"
              value={pageSize}
              onChange={e => setPageSize(Number(e.target.value))}
            >
              {[5, 10, 25, 50, 100].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <span>entries</span>
          </div>
          <input
            className="dt-search"
            type="text"
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="dt-table-wrap">
          <div className="dt-scroll">
            <table className="dt-table">
              <thead>
                {table.getHeaderGroups().map(hg => (
                  <tr key={hg.id}>
                    {hg.headers.map(h => (
                      <th key={h.id}>
                        {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="dt-empty">
                      No records found
                    </td>
                  </tr>
                ) : (
                  table.getRowModel().rows.map(row => (
                    <tr key={row.id}>
                      {row.getVisibleCells().map(cell => (
                        <td key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer with info + pagination */}
          <div className="dt-footer">
            <div className="dt-info">
              {filteredData.length === 0
                ? "No records"
                : <>Showing <b>{startRecord}–{endRecord}</b> of <b>{filteredData.length}</b> entries{search && ` (filtered from ${sampleData.length} total)`}</>
              }
            </div>

            <div className="dt-pagination">
              {/* Prev */}
              <button
                className="dt-page-btn"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={safePage === 1}
              >
                ‹
              </button>

              {/* Page numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
                .reduce<(number | '...')[]>((acc, p, i, arr) => {
                  if (i > 0 && typeof arr[i-1] === 'number' && (p as number) - (arr[i-1] as number) > 1) {
                    acc.push('...')
                  }
                  acc.push(p)
                  return acc
                }, [])
                .map((p, i) =>
                  p === '...'
                    ? <span key={`ellipsis-${i}`} style={{ padding: '0 4px', color: '#9ca3af', fontSize: 12 }}>…</span>
                    : (
                      <button
                        key={p}
                        className={`dt-page-btn${safePage === p ? ' active' : ''}`}
                        onClick={() => setCurrentPage(p as number)}
                      >
                        {p}
                      </button>
                    )
                )
              }

              {/* Next */}
              <button
                className="dt-page-btn"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}