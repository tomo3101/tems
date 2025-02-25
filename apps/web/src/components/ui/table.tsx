'use client';

import { ReservationIcon } from '@/components/ui/icon';
import { Event, ReservationWithEvent } from '@/utils/hc';
import { Button } from '@heroui/button';
import {
  getKeyValue,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/table';
import Link from 'next/link';
import { Key, useMemo } from 'react';

interface ReservationTableProps {
  selectCallNumber?: number;
  reservations?: ReservationWithEvent[];
}

export const WaitingTable = ({
  selectCallNumber,
  reservations,
}: ReservationTableProps) => {
  const columns = [
    {
      key: 'callNumber',
      label: '受付番号',
    },
    {
      key: 'numberOfPeople',
      label: '人数',
    },
  ];

  const rows = (reservations ?? [])
    .filter((reservation) => reservation.status === 'checked_in')
    .map((reservation) => ({
      callNumber: reservation.callNumber,
      numberOfPeople: reservation.numberOfPeople,
    }));

  return (
    <Table
      aria-label="Waiting Table"
      color="primary"
      selectedKeys={new Set([(selectCallNumber ?? '').toString()])}
      selectionMode="single"
      removeWrapper
    >
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody emptyContent="順番待ちはありません" items={rows}>
        {(item) => (
          <TableRow key={item.callNumber.toString()}>
            {(columnKey) => (
              <TableCell>{getKeyValue(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export const CalledTable = ({
  selectCallNumber,
  reservations,
}: ReservationTableProps) => {
  const columns = [
    {
      key: 'callNumber',
      label: '受付番号',
    },
  ];

  const rows = (reservations ?? [])
    .filter((reservation) => reservation.status === 'called')
    .map((reservation) => ({
      callNumber: reservation.callNumber,
    }));

  return (
    <Table
      aria-label="Called Table"
      color="primary"
      selectedKeys={new Set([(selectCallNumber ?? '').toString()])}
      selectionMode="single"
      removeWrapper
    >
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody emptyContent="呼出はありません" items={rows}>
        {(item) => (
          <TableRow key={item.callNumber.toString()}>
            {(columnKey) => (
              <TableCell>{getKeyValue(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

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

interface EventWaitingStatusTableProps {
  events: Event[] | undefined;
  reservations: ReservationWithEvent[] | undefined;
}

export const EventWaitingStatusTable = ({
  events,
  reservations,
}: EventWaitingStatusTableProps) => {
  const columns = [
    {
      key: 'time',
      label: '時間',
    },
    {
      key: 'callNumber',
      label: '呼出済み受付番号',
    },
    {
      key: 'numberOfWaiting',
      label: '順番待ち人数',
    },
    {
      key: 'action',
      label: '詳細',
    },
  ];

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

      case 'callNumber':
        return (
          reservations?.findLast(
            (reservation) =>
              reservation.eventId === item.id && reservation.status === 'done',
          )?.callNumber ?? '-'
        );

      case 'numberOfWaiting':
        return reservations?.filter(
          (reservation) =>
            reservation.eventId === item.id &&
            reservation.status === 'checked_in',
        ).length;

      case 'action':
        return (
          <Button
            as={Link}
            variant="solid"
            color="primary"
            href={`/waiting/${item.id}`}
          >
            詳細
          </Button>
        );

      default:
        return cellValue;
    }
  };

  return (
    <Table aria-label="Event Waiting Status Table">
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

interface AdminCallReservationTableProps {
  reservations: ReservationWithEvent[];
  renderCell: (item: ReservationWithEvent, columnKey: Key) => React.ReactNode;
}

export const AdminCallReservationTable = ({
  reservations,
  renderCell,
}: AdminCallReservationTableProps) => {
  const columns = [
    {
      key: 'callNumber',
      label: '受付番号',
    },
    {
      key: 'numberOfPeople',
      label: '人数',
    },
    {
      key: 'call',
      label: '呼出',
    },
  ];

  const checkedInReservations = useMemo(() => {
    return reservations.filter(
      (reservation) => reservation.status === 'checked_in',
    );
  }, [reservations]);

  return (
    <Table
      aria-label="Admin Call Reservation Table"
      removeWrapper
      isHeaderSticky
    >
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody
        items={checkedInReservations}
        emptyContent="順番待ちはありません"
      >
        {(item) => (
          <TableRow key={item.callNumber}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

interface AdminCalledReservationTableProps {
  reservations: ReservationWithEvent[];
  renderCell: (item: ReservationWithEvent, columnKey: Key) => React.ReactNode;
}

export const AdminCalledReservationTable = ({
  reservations,
  renderCell,
}: AdminCalledReservationTableProps) => {
  const columns = [
    {
      key: 'callNumber',
      label: '受付番号',
    },
    {
      key: 'complete',
      label: '完了',
    },
  ];

  const calledReservations = useMemo(() => {
    return reservations.filter(
      (reservation) => reservation.status === 'called',
    );
  }, [reservations]);

  return (
    <Table
      aria-label="Admin Called Reservation Table"
      removeWrapper
      isHeaderSticky
    >
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody items={calledReservations} emptyContent="呼出はありません">
        {(item) => (
          <TableRow key={item.callNumber}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
