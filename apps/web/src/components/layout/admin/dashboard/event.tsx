'use client';

import {
  createEvent,
  deleteEvent,
  editEvent,
  fetchEvents,
} from '@/components/layout/admin/dashboard/actions';
import { Event } from '@/utils/hc';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import {
  ArrowPathIcon,
  ChevronDownIcon,
  PlusIcon,
} from '@heroicons/react/24/solid';
import { Alert } from '@heroui/alert';
import { Button } from '@heroui/button';
import { TimeInput } from '@heroui/date-input';
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@heroui/dropdown';
import { Form } from '@heroui/form';
import { Input } from '@heroui/input';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@heroui/modal';
import { Selection, SortDescriptor } from '@heroui/table';
import { parseTime } from '@internationalized/date';
import dayjs from 'dayjs';
import { Key, useCallback, useMemo, useState } from 'react';
import { DashboardTable } from './table';

interface EventsTableProps {
  events: Event[];
}

const columns = [
  {
    name: 'ID',
    uid: 'id',
    sortable: true,
  },
  {
    name: '名称',
    uid: 'name',
    sortable: true,
  },
  {
    name: '日付',
    uid: 'date',
    sortable: true,
  },
  {
    name: '開始時間',
    uid: 'startTime',
    sortable: true,
  },
  {
    name: '終了時間',
    uid: 'endTime',
    sortable: true,
  },
  {
    name: '定員',
    uid: 'capacity',
    sortable: true,
  },
  {
    name: '予約数',
    uid: 'reservedCount',
    sortable: true,
  },
  {
    name: '作成日時',
    uid: 'createdAt',
    sortable: true,
  },
  {
    name: '更新日時',
    uid: 'updatedAt',
    sortable: true,
  },
  {
    name: '操作',
    uid: 'actions',
  },
];

export const EventsTable = ({ events: initialEvents }: EventsTableProps) => {
  const INITIAL_VISIBLE_COLUMNS = [
    'id',
    'name',
    'date',
    'startTime',
    'endTime',
    'capacity',
    'reservedCount',
    'actions',
  ];

  const [events, setEvents] = useState(initialEvents);

  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS),
  );
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'event_id',
    direction: 'ascending',
  });

  const [selectEvent, setSelectEvent] = useState<Event>();
  const [selectEventId, setSelectEventId] = useState<number>();
  const [alertSuccess, setAlertSuccess] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>();

  const {
    isOpen: isOpenEdit,
    onOpen: onOpenEdit,
    onOpenChange: onOpenEditChange,
  } = useDisclosure();
  const [isOpenNew, onOpenNewChange] = useState(false);
  const [isOpenConfirm, onOpenConfirmChange] = useState(false);
  const [isOpenResult, onOpenResultChange] = useState(false);

  const [isWaiting, setIsWaiting] = useState(false);

  const headerColumns = useMemo(() => {
    if (visibleColumns === 'all') return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid),
    );
  }, [visibleColumns]);

  const onFetchEvents = useCallback(async () => {
    const response = await fetchEvents();

    if (!response) return;

    setEvents(response);
  }, []);

  const renderCell = useCallback(
    (item: EventsTableProps['events'][number], columnKey: Key) => {
      const cellValue = item[columnKey as keyof typeof item];

      switch (columnKey) {
        case 'createdAt':
        case 'updatedAt':
          return dayjs(cellValue).format('YYYY-MM-DD HH:mm:ss');

        case 'actions':
          return (
            <div className="flex justify-end items-center gap-2">
              <Dropdown>
                <DropdownTrigger>
                  <Button isIconOnly size="sm" variant="light">
                    <EllipsisVerticalIcon className="size-6 text-default-foreground" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu disabledKeys={['view']}>
                  <DropdownItem key="view">詳細表示</DropdownItem>
                  <DropdownItem
                    key="edit"
                    onPress={() => {
                      setSelectEvent(item);
                      onOpenEdit();
                    }}
                  >
                    編集
                  </DropdownItem>
                  <DropdownItem
                    key="delete"
                    color="danger"
                    className="text-danger"
                    onPress={() => {
                      setSelectEventId(item.id);
                      onOpenConfirmChange(true);
                    }}
                  >
                    削除
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          );

        default:
          return cellValue;
      }
    },
    [onOpenEdit],
  );

  return (
    <>
      <div className="flex justify-end items-end gap-3">
        <Button isIconOnly variant="light" onPress={onFetchEvents}>
          <ArrowPathIcon className="size-6" />
        </Button>
        <Dropdown>
          <DropdownTrigger>
            <Button
              variant="flat"
              endContent={
                <ChevronDownIcon className="size-6 text-default-foreground" />
              }
            >
              項目
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Table Columns"
            disallowEmptySelection
            closeOnSelect={false}
            selectedKeys={visibleColumns}
            selectionMode="multiple"
            onSelectionChange={setVisibleColumns}
          >
            {columns.map((column) => (
              <DropdownItem key={column.uid} className="capitalize">
                {column.name}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
        <Button
          color="primary"
          endContent={<PlusIcon className="size-6 text-white" />}
          onPress={() => onOpenNewChange(true)}
        >
          作成
        </Button>
      </div>

      <DashboardTable
        data={events}
        columns={headerColumns}
        renderCell={renderCell}
        sortDescriptor={sortDescriptor}
        onSortChange={setSortDescriptor}
      />

      <Modal
        isOpen={isOpenNew}
        onOpenChange={onOpenNewChange}
        placement="center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <Form
                validationBehavior="native"
                onSubmit={async (e) => {
                  setIsWaiting(true);

                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);

                  const response = await createEvent(formData);
                  if (response) {
                    onFetchEvents();
                    setAlertSuccess(true);
                    setAlertMessage('イベントを作成しました');
                  } else {
                    setAlertSuccess(false);
                    setAlertMessage('イベントの作成に失敗しました');
                  }

                  onOpenResultChange(true);
                  onClose();
                  setIsWaiting(false);
                }}
              >
                <ModalHeader className="w-full">イベント作成</ModalHeader>
                <ModalBody className="w-full">
                  <Input
                    isRequired
                    label="イベント名"
                    name="name"
                    placeholder="イベント名を入力してください"
                    variant="bordered"
                  />
                  <Input
                    isRequired
                    label="日付"
                    name="date"
                    type="date"
                    variant="bordered"
                  />
                  <TimeInput
                    isRequired
                    label="開始時間"
                    name="startTime"
                    variant="bordered"
                    hourCycle={24}
                  />
                  <TimeInput
                    isRequired
                    label="終了時間"
                    name="endTime"
                    variant="bordered"
                    hourCycle={24}
                  />
                  <Input
                    isRequired
                    label="定員"
                    name="capacity"
                    type="number"
                    variant="bordered"
                  />
                </ModalBody>
                <ModalFooter className="w-full">
                  <Button color="danger" variant="light" onPress={onClose}>
                    キャンセル
                  </Button>
                  <Button color="primary" type="submit" isLoading={isWaiting}>
                    作成
                  </Button>
                </ModalFooter>
              </Form>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isOpenEdit}
        onOpenChange={onOpenEditChange}
        placement="center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <Form
                validationBehavior="native"
                onSubmit={async (e) => {
                  setIsWaiting(true);

                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);

                  const response = await editEvent(selectEvent?.id, formData);
                  if (response) {
                    onFetchEvents();
                    setAlertSuccess(true);
                    setAlertMessage('イベントを編集しました');
                  } else {
                    setAlertSuccess(false);
                    setAlertMessage('イベントの編集に失敗しました');
                  }

                  onOpenResultChange(true);
                  onClose();
                  setIsWaiting(false);
                }}
              >
                <ModalHeader className="w-full">イベント編集</ModalHeader>
                <ModalBody className="w-full">
                  <Input
                    isRequired
                    variant="bordered"
                    label="イベント名"
                    name="name"
                    placeholder="イベント名を入力してください"
                    defaultValue={selectEvent?.name}
                  />
                  <Input
                    isRequired
                    variant="bordered"
                    label="日付"
                    name="date"
                    type="date"
                    defaultValue={selectEvent?.date}
                  />
                  <TimeInput
                    isRequired
                    variant="bordered"
                    label="開始時間"
                    name="startTime"
                    hourCycle={24}
                    defaultValue={parseTime(selectEvent?.startTime ?? '')}
                  />
                  <TimeInput
                    isRequired
                    variant="bordered"
                    label="終了時間"
                    name="endTime"
                    hourCycle={24}
                    defaultValue={parseTime(selectEvent?.endTime ?? '')}
                  />
                  <Input
                    isRequired
                    variant="bordered"
                    label="定員"
                    name="capacity"
                    type="number"
                    defaultValue={selectEvent?.capacity.toString()}
                  />
                </ModalBody>
                <ModalFooter className="w-full">
                  <Button color="danger" variant="light" onPress={onClose}>
                    キャンセル
                  </Button>
                  <Button color="primary" type="submit" isLoading={isWaiting}>
                    編集
                  </Button>
                </ModalFooter>
              </Form>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isOpenConfirm}
        onOpenChange={onOpenConfirmChange}
        placement="center"
        hideCloseButton
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="w-full">イベント削除</ModalHeader>
              <ModalBody className="w-full">
                <p>イベントID: {selectEventId} を削除しますか？</p>
              </ModalBody>
              <ModalFooter className="w-full">
                <Button variant="light" onPress={onClose}>
                  キャンセル
                </Button>
                <Button
                  color="danger"
                  isLoading={isWaiting}
                  onPress={async () => {
                    setIsWaiting(true);
                    if (selectEventId) {
                      const response = await deleteEvent(selectEventId);
                      if (response) {
                        onFetchEvents();
                        setAlertSuccess(true);
                        setAlertMessage('イベントを削除しました');
                      } else {
                        setAlertSuccess(false);
                        setAlertMessage('イベントの削除に失敗しました');
                      }
                      onOpenResultChange(true);
                    }
                    onClose();
                    setIsWaiting(false);
                  }}
                >
                  削除
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal
        isOpen={isOpenResult}
        onOpenChange={onOpenResultChange}
        placement="top"
        backdrop="transparent"
        hideCloseButton
      >
        <ModalContent>
          {(onClose) => (
            <>
              <Alert
                color={alertSuccess ? 'success' : 'danger'}
                title={alertSuccess ? '成功' : 'エラー'}
                description={alertMessage}
                onClose={onClose}
              />
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
