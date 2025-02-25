'use client';

import {
  createAdmin,
  deleteAdmin,
  fetchAdmins,
} from '@/components/layout/admin/dashboard/actions';
import { InputPassword } from '@/components/ui/input';
import { Admin } from '@/utils/hc';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import {
  ArrowPathIcon,
  ChevronDownIcon,
  PlusIcon,
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
} from '@heroui/modal';
import { Selection, SortDescriptor } from '@heroui/table';
import dayjs from 'dayjs';
import { Key, useCallback, useMemo, useState } from 'react';
import { DashboardTable } from './table';

interface AdminsTableProps {
  admins: Admin[];
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

export const AdminsTable = ({ admins: initialAdmins }: AdminsTableProps) => {
  const INITIAL_VISIBLE_COLUMNS = ['id', 'name', 'email', 'actions'];

  const [admins, setAdmins] = useState(initialAdmins);

  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS),
  );
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'id',
    direction: 'ascending',
  });

  const [deleteAdminId, setDeleteAdminId] = useState<number>();
  const [alertSuccess, setAlertSuccess] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>();
  const [formError, setFormError] = useState<string>();

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

  const onFetchAdmins = useCallback(async () => {
    const response = await fetchAdmins();

    if (!response) return;

    setAdmins(response);
  }, []);

  const renderCell = useCallback((item: Admin, columnKey: Key) => {
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
              <DropdownMenu disabledKeys={['view', 'edit']}>
                <DropdownItem key="view">詳細表示</DropdownItem>
                <DropdownItem key="edit">編集</DropdownItem>
                <DropdownItem
                  key="delete"
                  color="danger"
                  className="text-danger"
                  onPress={() => {
                    setDeleteAdminId(item.id);
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
        <Button isIconOnly variant="light" onPress={onFetchAdmins}>
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
        data={admins}
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

                  const response = await createAdmin(formData);
                  if (response.success) {
                    onFetchAdmins();
                    setAlertSuccess(true);
                    setAlertMessage('管理者を作成しました');
                    onClose();
                  } else {
                    setAlertSuccess(false);
                    setAlertMessage('管理者の作成に失敗しました');
                    setFormError(response.message);
                  }

                  onOpenResultChange(true);
                  setIsWaiting(false);
                }}
              >
                <ModalHeader className="w-full">管理者作成</ModalHeader>
                <ModalBody className="w-full">
                  <Input
                    isRequired
                    label="名前"
                    name="name"
                    autoComplete="name"
                    placeholder="名前を入力してください"
                    variant="bordered"
                  />
                  <Input
                    isRequired
                    label="メールアドレス"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="メールアドレスを入力してください"
                    variant="bordered"
                  />
                  <InputPassword
                    isRequired
                    label="パスワード"
                    name="password"
                    autoComplete="new-password"
                    placeholder="パスワードを入力してください"
                    variant="bordered"
                  />
                  <InputPassword
                    isRequired
                    label="パスワードの確認"
                    name="passwordConfirm"
                    autoComplete="new-password"
                    placeholder="パスワードを再度入力してください"
                    variant="bordered"
                  />

                  {formError && <p className="text-red-500">{formError}</p>}
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
        isOpen={isOpenConfirm}
        onOpenChange={onOpenConfirmChange}
        placement="center"
        hideCloseButton
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="w-full">管理者削除</ModalHeader>
              <ModalBody className="w-full">
                <p>管理者ID: {deleteAdminId} を削除しますか？</p>
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
                    if (deleteAdminId) {
                      const response = await deleteAdmin(deleteAdminId);
                      if (response) {
                        onFetchAdmins();
                        setAlertSuccess(true);
                        setAlertMessage('管理者を削除しました');
                      } else {
                        setAlertSuccess(false);
                        setAlertMessage('管理者の削除に失敗しました');
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
