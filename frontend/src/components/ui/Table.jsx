import { Search, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "./Button";
import { Input } from "./Input";

/**
 * Reusable table component for the ERP frontend.
 * Features:
 * - Search bar with real-time feedback
 * - Pagination controls
 * - Add new record button
 * - Fully customizable columns and actions
 */
export const Table = ({ 
  title, 
  data = [], 
  columns = [], 
  onAdd, 
  onSearch, 
  pagination = { current: 1, total: 1 },
  onPageChange,
  actions 
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Table Header */}
      <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-500 mt-1">Manage your {title.toLowerCase()} records</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder={`Search ${title.toLowerCase()}...`}
              className="pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 text-sm transition-all"
              onChange={(e) => onSearch?.(e.target.value)}
            />
          </div>
          {onAdd && (
            <Button onClick={onAdd} className="flex items-center gap-2">
              <Plus size={18} />
              Add New
            </Button>
          )}
        </div>
      </div>

      {/* Table Content - Desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50">
              {columns.map((col, idx) => (
                <th key={idx} className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {col.header}
                </th>
              ))}
              {actions && (
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data.length > 0 ? (
              data.map((item, rowIdx) => (
                <tr key={rowIdx} className="hover:bg-gray-50/80 transition-colors">
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                      {col.render ? col.render(item) : item[col.accessor]}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-6 py-4 text-sm text-right">
                      <div className="flex justify-end gap-1">
                        {actions(item)}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="px-6 py-12 text-center text-gray-400 italic">
                  No records found matching your criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Table Content - Mobile (Card View) */}
      <div className="md:hidden divide-y divide-gray-100">
        {data.length > 0 ? (
          data.map((item, idx) => (
            <div key={idx} className="p-4 space-y-4 bg-white active:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start">
                <div className="space-y-3 flex-1">
                  {columns.map((col, colIdx) => (
                    <div key={colIdx} className="flex flex-col">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{col.header}</span>
                      <div className="text-sm font-medium text-gray-900 mt-0.5">
                        {col.render ? col.render(item) : item[col.accessor]}
                      </div>
                    </div>
                  ))}
                </div>
                {actions && (
                  <div className="flex flex-col gap-2 ml-4">
                    {actions(item)}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center text-gray-400 italic text-sm">
            No records found
          </div>
        )}
      </div>

      {/* Table Footer / Pagination */}
      <div className="p-6 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
        <p className="text-sm text-gray-500">
          Showing <span className="font-medium text-gray-900">{data.length}</span> of <span className="font-medium text-gray-900">{pagination.totalRecords || data.length}</span> results
        </p>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="secondary" 
            className="p-1 px-2" 
            disabled={pagination.current === 1}
            onClick={() => onPageChange?.(pagination.current - 1)}
          >
            <ChevronLeft size={20} />
          </Button>
          <span className="text-sm font-medium px-3 text-gray-700">
            Page {pagination.current} of {pagination.total}
          </span>
          <Button 
            variant="secondary" 
            className="p-1 px-2" 
            disabled={pagination.current === pagination.total}
            onClick={() => onPageChange?.(pagination.current + 1)}
          >
            <ChevronRight size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
};
