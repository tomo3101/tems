'use client';

import { ReservationIcon } from '@/components/ui/icon';
import { Event } from '@/utils/hc';
import {
  getKeyValue,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/table';

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

  return (
    <Table aria-label="Event Availability Table">
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody
        emptyContent="イベントはありません"
        items={events?.map((event) => ({
          key: event.id,
          time: `${event.startTime.split(':').slice(0, 2).join(':')}~${event.endTime.split(':').slice(0, 2).join(':')}`,
          availability: (
            <ReservationIcon
              ratio={getAvailabilityRatio(event.capacity, event.reservedCount)}
            />
          ),
          remaining: event.capacity - (event.reservedCount ?? 0),
        }))}
      >
        {(item) => (
          <TableRow key={item.key}>
            {(columnKey) => (
              <TableCell>{getKeyValue(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
