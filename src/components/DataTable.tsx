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
  {
    fundCode: "FND001",
    fundName: "Growth Equity Fund",
    date: "2024-01-15",
    creationPrice: 4500.00,
    redeemPrice: 4300.00,
    status: "Active",
    pending: 5,
    approved: 12,
    confirm: "Yes",
  },
  {
    fundCode: "FND002",
    fundName: "Tech Innovation Fund",
    date: "2024-01-15",
    creationPrice: 3800.00,
    redeemPrice: 3700.00,
    status: "Active",
    pending: 3,
    approved: 8,
    confirm: "No",
  },
  {
    fundCode: "FND003",
    fundName: "Balanced Income Fund",
    date: "2024-01-15",
    creationPrice: 5200.50,
    redeemPrice: 5100.00,
    status: "Inactive",
    pending: 2,
    approved: 5,
    confirm: "Yes",
  },
  {
    fundCode: "FND004",
    fundName: "Global Opportunities Fund",
    date: "2024-01-15",
    creationPrice: 6100.75,
    redeemPrice: 6000.00,
    status: "Active",
    pending: 4,
    approved: 10,
    confirm: "No",
  },
  {
    fundCode: "FND005",
    fundName: "Emerging Markets Fund",
    date: "2024-01-15",
    creationPrice: 2950.00,
    redeemPrice: 2900.00,
    status: "Active",
    pending: 1,
    approved: 3,
    confirm: "Yes",
  },
]

export default function DataTable({ onTotalCountChange, onVisibleCountChange }: { onTotalCountChange?: (count: number) => void, onVisibleCountChange?: (count: number) => void } = {}) {
  const [pageSize, setPageSize] = useState(3);
  const [search, setSearch] = useState("");
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' ? window.innerWidth <= 768 : false);
  const [isTablet, setIsTablet] = useState(() => typeof window !== 'undefined' ? window.innerWidth > 768 && window.innerWidth <= 1024 : false);

  // Update responsive states on resize
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 768);
      setIsTablet(width > 768 && width <= 1024);
    };
    handleResize(); // Call immediately
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const columns = useMemo(() => [
    columnHelper.accessor("fundCode", {
      header: "Fund Code",
      cell: (info) => (
        <span className="font-medium text-gray-900">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor("fundName", {
      header: "Fund Name",
      cell: (info) => (
        <span className="text-gray-900">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor("date", {
      header: "Date",
      cell: (info) => (
        <span className="text-gray-600">
          {new Date(info.getValue()).toLocaleDateString()}
        </span>
      ),
    }),
    columnHelper.accessor("creationPrice", {
      header: "Creation Price",
      cell: (info) => (
        <span className="font-medium text-green-600">LKR {info.getValue().toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
      ),
    }),
    columnHelper.accessor("redeemPrice", {
      header: "Redeem Price",
      cell: (info) => (
        <span className="font-medium text-blue-600">LKR {info.getValue().toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
      ),
    }),
    columnHelper.accessor("pending", {
      header: "Pending",
      cell: (info) => (
        <span style={{ color: '#eab308', fontWeight: 600 }}>
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("confirm", {
      header: "Confirm",
      cell: (info) => (
        <span style={{ color: '#2563eb', fontWeight: 700 }}>
          {info.getValue() === "Yes" ? 1 : 0}
        </span>
      ),
    }),
    columnHelper.accessor("approved", {
      header: "Approved",
      cell: (info) => (
        <span style={{ color: '#22c55e', fontWeight: 600 }}>
          {info.getValue()}
        </span>
      ),
    }),
  ], [])

  // Filtered data for search
  const filteredData = useMemo(() => {
    if (!search) return sampleData;
    return sampleData.filter(row =>
      Object.values(row).some(val =>
        String(val).toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search]);

  // Paginated data
  const paginatedData = useMemo(() => {
    return filteredData.slice(0, pageSize);
  }, [filteredData, pageSize]);

  useEffect(() => {
    if (onTotalCountChange) onTotalCountChange(filteredData.length);
    if (onVisibleCountChange) onVisibleCountChange(paginatedData.length);
  }, [filteredData.length, paginatedData.length, onTotalCountChange, onVisibleCountChange]);

  const table = useReactTable({
    data: paginatedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="overflow-hidden" style={{ 
      padding: isMobile ? '0 20px 24px 30px' : isTablet ? '0 40px 24px 60px' : '0 60px 24px 80px', 
      minWidth: 0, 
      boxSizing: 'border-box', 
      width: '100%', 
      height: '100%' 
    }}>
      {/* Top bar: page size switcher and search */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, padding: '0 0px' }}>
        <div>
          <label htmlFor="pageSize" style={{ fontSize: 14, marginRight: 8 }}>Show</label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={e => setPageSize(Number(e.target.value))}
            style={{ fontSize: 14, padding: '2px 8px', borderRadius: 4, border: '1px solid #ccc', marginRight: 8 }}
          >
            {[3, 5, 10, 25, 50, 100].map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
          <span style={{ fontSize: 14 }}>rows</span>
        </div>
        <div>
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ fontSize: 14, padding: '2px 8px', borderRadius: 4, border: '1px solid #ccc', minWidth: 120 }}
          />
        </div>
      </div>
      <div style={{ padding: 0, minWidth: 0, width: '100%', maxWidth: 'none', margin: '0', overflowY: 'auto', overflowX: 'auto', height: 160 }}>
        <table className="min-w-full divide-y divide-gray-200" style={{ width: '100%', tableLayout: 'auto', background: 'white' }}>
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-3 py-2 whitespace-nowrap text-sm"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
