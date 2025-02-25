'use client';

import { Button } from '@heroui/button';
import { Pagination } from '@heroui/pagination';
import {
  SortDescriptor,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/table';
import { ChangeEvent, Key, useCallback, useMemo, useState } from 'react';

interface DashboardTableProps<T extends { id: Key }> {
  data: T[];
  columns: { name: string; uid: string; sortable?: boolean }[];
  renderCell: (item: T, columnKey: Key) => React.ReactNode;
  sortDescriptor: SortDescriptor;
  onSortChange: (descriptor: SortDescriptor) => void;
}

export const DashboardTable = <T extends { id: Key }>({
  data,
  columns,
  renderCell,
  sortDescriptor,
  onSortChange,
}: DashboardTableProps<T>) => {
  const [page, setPage] = useState(1);
  const [rowPerPage, setRowPerPage] = useState(5);

  const pages = Math.ceil(data.length / rowPerPage);

  const onNextPage = useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      setRowPerPage(Number(e.target.value));
      setPage(1);
    },
    [],
  );

  const items = useMemo(() => {
    const start = (page - 1) * rowPerPage;
    const end = start + rowPerPage;

    return data.slice(start, end);
  }, [data, page, rowPerPage]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column as keyof typeof a] as number;
      const second = b[sortDescriptor.column as keyof typeof b] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === 'descending' ? -cmp : cmp;
    });
  }, [items, sortDescriptor]);

  const topContent = useMemo(() => {
    return (
      <div className="flex justify-end items-center">
        <label className="flex items-center text-default-400 text-small">
          Rows per page:
          <select
            className="bg-transparent outline-none text-default-400 text-small"
            onChange={onRowsPerPageChange}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
          </select>
        </label>
      </div>
    );
  }, [onRowsPerPageChange]);

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          合計 {data.length} 件
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onPreviousPage}
          >
            前へ
          </Button>
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onNextPage}
          >
            次へ
          </Button>
        </div>
      </div>
    );
  }, [data.length, onNextPage, onPreviousPage, page, pages]);

  return (
    <Table
      aria-label="Dashboard Table"
      topContent={topContent}
      topContentPlacement="outside"
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      sortDescriptor={sortDescriptor}
      onSortChange={onSortChange}
      isHeaderSticky
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === 'actions' ? 'center' : 'start'}
            allowsSorting={column.sortable}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent="データはありません" items={sortedItems}>
        {(item) => (
          <TableRow key={item.id.toString()}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
