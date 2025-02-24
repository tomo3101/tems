'use client';

import { ReservationWithEvent } from '@/utils/hc';
import {
  ArrowPathIcon,
  ChevronDownIcon,
  EllipsisVerticalIcon,
} from '@heroicons/react/24/solid';
import { Alert } from '@heroui/alert';
import { Button } from '@heroui/button';
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
import dayjs from 'dayjs';
import { Key, useCallback, useMemo, useState } from 'react';
import {
  deleteReservation,
  editReservation,
  fetchReservations,
} from './actions';
import { DashboardTable } from './table';
import { Select, SelectItem } from '@heroui/react';

interface ReservationsTableProps {
  reservations: ReservationWithEvent[];
}

const columns = [
  {
    name: 'ID',
    uid: 'id',
    sortable: true,
  },
  {
    name: 'イベントID',
    uid: 'eventId',
    sortable: true,
  },
  {
    name: '会員ID',
    uid: 'memberId',
    sortable: true,
  },
  {
    name: '人数',
    uid: 'numberOfPeople',
    sortable: true,
  },
  {
    name: 'QRコードハッシュ',
    uid: 'qrCodeHash',
    sortable: false,
  },
  {
    name: 'ステータス',
    uid: 'status',
    sortable: true,
  },
  {
    name: '呼出番号',
    uid: 'callNumber',
    sortable: true,
  },
  {
    name: '作成日時',
    uid: 'createdAt',
    sortable: true,
  },
  {
    name: 'チェックイン日時',
    uid: 'checkedInAt',
    sortable: true,
  },
  {
    name: '呼出日時',
    uid: 'calledAt',
    sortable: true,
  },
  {
    name: '操作',
    uid: 'actions',
  },
];

const statusOptions = [
  {
    key: 'reserved',
    label: '予約済み',
  },
  {
    key: 'cancelled',
    label: 'キャンセル済み',
  },
  {
    key: 'checked_in',
    label: 'チェックイン済み',
  },
  {
    key: 'called',
    label: '呼出済み',
  },
  {
    key: 'done',
    label: '完了',
  },
];

export const ReservationsTable = ({
  reservations: initialReservations,
}: ReservationsTableProps) => {
  const INITIAL_VISIBLE_COLUMNS = [
    'id',
    'eventId',
    'memberId',
    'numberOfPeople',
    'status',
    'callNumber',
    'actions',
  ];

  const [reservations, setReservations] = useState(initialReservations);

  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS),
  );
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'event_id',
    direction: 'ascending',
  });

  const [selectReservation, setSelectReservation] =
    useState<ReservationWithEvent>();
  const [selectReservationId, setSelectReservationId] = useState<number>();
  const [alertSuccess, setAlertSuccess] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>();

  const {
    isOpen: isOpenEdit,
    onOpen: onOpenEdit,
    onOpenChange: onOpenEditChange,
  } = useDisclosure();
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
    const response = await fetchReservations();

    if (!response) return;

    setReservations(response);
  }, []);

  const renderCell = useCallback(
    (item: ReservationWithEvent, columnKey: Key) => {
      const cellValue = item[columnKey as keyof typeof item];

      switch (columnKey) {
        case 'createdAt':
        case 'checkedInAt':
        case 'calledAt':
          return dayjs(cellValue).format('YYYY-MM-DD HH:mm:ss');

        case 'status':
          switch (cellValue) {
            case 'reserved':
              return '予約済み';
            case 'checked_in':
              return 'チェックイン済み';
            case 'cancelled':
              return 'キャンセル済み';
            case 'called':
              return '呼出済み';
            case 'done':
              return '完了';
            default:
              return cellValue;
          }

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
                      setSelectReservation(item);
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
                      setSelectReservationId(item.id);
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
      </div>

      <DashboardTable
        data={reservations}
        columns={headerColumns}
        renderCell={renderCell}
        sortDescriptor={sortDescriptor}
        onSortChange={setSortDescriptor}
      />

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

                  const response = await editReservation(
                    selectReservation?.id,
                    formData,
                  );
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
                    label="人数"
                    name="numberOfPeople"
                    type="number"
                    placeholder="イベント名を入力してください"
                    defaultValue={selectReservation?.numberOfPeople.toString()}
                  />
                  <Select
                    isRequired
                    variant="bordered"
                    items={statusOptions}
                    label="ステータス"
                    name="status"
                    placeholder="ステータスを選択してください"
                    defaultSelectedKeys={
                      selectReservation?.status
                        ? [selectReservation.status]
                        : []
                    }
                  >
                    {(status) => <SelectItem>{status.label}</SelectItem>}
                  </Select>
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
              <ModalHeader className="w-full">予約削除</ModalHeader>
              <ModalBody className="w-full">
                <p>予約ID: {selectReservationId} を削除しますか？</p>
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
                    if (selectReservationId) {
                      const response =
                        await deleteReservation(selectReservationId);
                      if (response) {
                        onFetchEvents();
                        setAlertSuccess(true);
                        setAlertMessage('予約を削除しました');
                      } else {
                        setAlertSuccess(false);
                        setAlertMessage('予約の削除に失敗しました');
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
