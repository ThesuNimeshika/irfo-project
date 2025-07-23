"use client"

import { useMemo } from "react"
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
  price: number
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
    price: 125.45,
    status: "Active",
    pending: 5,
    approved: 12,
    confirm: "Yes",
  },
  {
    fundCode: "FND002",
    fundName: "Tech Innovation Fund",
    date: "2024-01-15",
    price: 98.76,
    status: "Active",
    pending: 3,
    approved: 8,
    confirm: "No",
  },
]

export default function DataTable() {
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
    columnHelper.accessor("price", {
      header: "Price",
      cell: (info) => (
        <span className="font-medium text-green-600">
          ${info.getValue().toFixed(2)}
        </span>
      ),
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => (
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            info.getValue() === "Active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("pending", {
      header: "Pending",
      cell: (info) => (
        <span className="text-orange-600 font-medium">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("approved", {
      header: "Approved",
      cell: (info) => (
        <span className="text-blue-600 font-medium">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("confirm", {
      header: "Confirm",
      cell: (info) => (
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            info.getValue() === "Yes"
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {info.getValue()}
        </span>
      ),
    }),
  ], [])

  const table = useReactTable({
    data: sampleData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
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
                    className="px-4 py-4 whitespace-nowrap text-sm"
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
