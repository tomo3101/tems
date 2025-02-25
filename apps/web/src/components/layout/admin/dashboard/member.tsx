'use client';

import {
  deleteEvent,
  fetchMembers,
} from '@/components/layout/admin/dashboard/actions';
import { Member } from '@/utils/hc';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import { ArrowPathIcon, ChevronDownIcon } from '@heroicons/react/24/solid';
import { Alert } from '@heroui/alert';
import { Button } from '@heroui/button';
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@heroui/dropdown';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/modal';
import { Selection, SortDescriptor } from '@heroui/table';
import dayjs from 'dayjs';
import { Key, useCallback, useMemo, useState } from 'react';
import { DashboardTable } from './table';

interface MembersTableProps {
  members: Member[];
}

const columns = [
  {
    name: 'ID',
    uid: 'id',
    sortable: true,
  },
  {
    name: '名前',
    uid: 'name',
    sortable: true,
  },
  {
    name: 'メール',
    uid: 'email',
    sortable: true,
  },
  {
    name: '電話番号',
    uid: 'phoneNumber',
  },
  {
    name: 'パスワードハッシュ',
    uid: 'passwordHash',
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

export const MembersTable = ({
  members: initialMembers,
}: MembersTableProps) => {
  const INITIAL_VISIBLE_COLUMNS = [
    'id',
    'name',
    'email',
    'phoneNumber',
    'actions',
  ];

  const [members, setMembers] = useState(initialMembers);

  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS),
  );
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'id',
    direction: 'ascending',
  });

  const [deleteMemberId, setDeleteMemberId] = useState<number>();
  const [alertSuccess, setAlertSuccess] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>();

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
    const response = await fetchMembers();

    if (!response) return;

    setMembers(response);
  }, []);

  const renderCell = useCallback((item: Member, columnKey: Key) => {
    const cellValue = item[columnKey as keyof typeof item];

    switch (columnKey) {
      case 'createdAt':
      case 'updatedAt':
        return dayjs(cellValue).format('YYYY-MM-DD HH:mm:ss');

      case 'phoneNumber':
        return cellValue || '-';

      case 'actions':
        return (
          <div className="flex justify-end items-center gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <EllipsisVerticalIcon className="size-6 text-default-foreground" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu disabledKeys={['view', 'edit']}>
                <DropdownItem key="view">詳細表示</DropdownItem>
                <DropdownItem key="edit">編集</DropdownItem>
                <DropdownItem
                  key="delete"
                  color="danger"
                  className="text-danger"
                  onPress={() => {
                    setDeleteMemberId(item.id);
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
  }, []);

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
        data={members}
        columns={headerColumns}
        renderCell={renderCell}
        sortDescriptor={sortDescriptor}
        onSortChange={setSortDescriptor}
      />
      <Modal
        isOpen={isOpenConfirm}
        onOpenChange={onOpenConfirmChange}
        placement="center"
        hideCloseButton
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="w-full">会員削除</ModalHeader>
              <ModalBody className="w-full">
                <p>会員ID: {deleteMemberId} を削除しますか？</p>
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
                    if (deleteMemberId) {
                      const response = await deleteEvent(deleteMemberId);
                      if (response) {
                        onFetchEvents();
                        setAlertSuccess(true);
                        setAlertMessage('会員を削除しました');
                      } else {
                        setAlertSuccess(false);
                        setAlertMessage('会員の削除に失敗しました');
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
