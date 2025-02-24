'use client';

import { ReservationIcon } from '@/components/ui/icon';
import { Event } from '@/utils/hc';
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/table';
import { Key } from 'react';

interface EventAvailabilityTableProps {
  events: Event[] | undefined;
}

export const EventAvailabilityTable = ({
  events,
}: EventAvailabilityTableProps) => {
  const columns = [
    {
      key: 'time',
      label: '時間',
    },
    {
      key: 'availability',
      label: '空き状況',
    },
    {
      key: 'remaining',
      label: '残数',
    },
  ];

  const getAvailabilityRatio = (
    capacity: number,
    reservedCount: number | undefined,
  ) => {
    if (reservedCount === undefined) return 0;

    return (capacity - reservedCount) / capacity;
  };

  const renderCell = (item: Event, columnKey: Key) => {
    const cellValue = item[columnKey as keyof typeof item];

    switch (columnKey) {
      case 'time':
        return (
          <span>
            {item.startTime.split(':').slice(0, 2).join(':')}~
            {item.endTime.split(':').slice(0, 2).join(':')}
          </span>
        );

      case 'availability':
        return (
          <ReservationIcon
            ratio={getAvailabilityRatio(item.capacity, item.reservedCount)}
          />
        );

      case 'remaining':
        return item.capacity - (item.reservedCount ?? 0);

      default:
        return cellValue;
    }
  };

  return (
    <Table aria-label="Event Availability Table">
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody emptyContent="イベントはありません" items={events}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
