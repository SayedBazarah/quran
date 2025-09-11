'use client';

// ----------------------------------------------------------------------

import type { TableHeadCellProps } from 'src/components/table';
import type { IStudentItem, IStudentTableFilters } from 'src/types/student';

import { useCallback } from 'react';
import { useBoolean, useSetState } from 'minimal-shared/hooks';

import { Box, Card, Table, Button, Tooltip, TableBody, IconButton } from '@mui/material';

import { paths } from 'src/routes/paths';

import { useGetStudents } from 'src/actions/student';
import { DashboardContent } from 'src/layouts/dashboard';
import { GlobalPermissionCode } from 'src/global-config';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { LoadingScreen } from 'src/components/loading-screen';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  rowInPage,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import { RoleBasedGuard } from 'src/auth/guard';
import { useAuthContext } from 'src/auth/hooks';

import { StudentTableRow } from '../student-table-row';
import { StudentTableToolbar } from '../student-table-toolbar';
import { StudentQuickEditForm } from '../student-edit-new-form';
import { StudentTableFiltersResult } from '../student-table-filters-result';

const TABLE_HEAD: TableHeadCellProps[] = [
  { id: 'name', label: 'الاسم' },
  { id: 'phone', label: 'المشرف' },
  { id: 'rounds', label: 'المراحل الحالية', width: 150 },
  { id: '', width: 88 },
];

// ----------------------------------------------------------------------

export function StudentListView() {
  const { user } = useAuthContext();
  const isNew = useBoolean();
  const table = useTable({
    defaultRowsPerPage: 25,
  });

  const confirmDialog = useBoolean();

  const { students, refetch, studentsLoading } = useGetStudents();
  const filters = useSetState<IStudentTableFilters>({ name: '', teacher: [], admin: [] });
  const { state: currentFilters } = filters;

  const dataFiltered = applyFilter({
    inputData: students,
    comparator: getComparator(table.order, table.orderBy),
    filters: currentFilters,
  });

  const admins = [
    ...new Map(
      students
        .filter((student) => student.admin) // keep only students with admins
        .map((student) => [
          student.admin.id,
          { value: student.admin.id, label: student.admin.name },
        ])
    ).values(),
  ];
  const teachers = [
    ...new Map(
      students
        .filter((student) => student.teacher) // keep only students with admins
        .map((student) => [
          student.teacher.id,
          { value: student.teacher.id, label: student.admin.name },
        ])
    ).values(),
  ];
  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

  const canReset = !!currentFilters.name;

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleDeleteRow = useCallback(
    (id: string) => {
      toast.success('تم المسح بنجاح!');

      refetch();

      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, refetch]
  );

  const handleDeleteRows = useCallback(() => {
    toast.success('تم المسح بنجاح!');

    refetch();

    table.onUpdatePageDeleteRows(dataInPage.length, dataFiltered.length);
  }, [dataFiltered.length, dataInPage.length, table, refetch]);

  // const handleFilterTeacher = useCallback(
  //   (event: React.SyntheticEvent, newValue: string) => {
  //     table.onResetPage();
  //     updateFilters({ teacher: newValue });
  //   },
  //   [updateFilters, table]
  // );

  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="مسح"
      content={
        <>
          هل تريد حذف <strong> {table.selected.length} </strong> الطالب؟
        </>
      }
      action={
        <Button
          variant="contained"
          color="error"
          onClick={() => {
            handleDeleteRows();
            confirmDialog.onFalse();
          }}
        >
          حذف
        </Button>
      }
    />
  );

  if (studentsLoading) return <LoadingScreen />;
  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="الطلاب"
          links={[{ name: 'لوحة التحكم', href: paths.dashboard.root }, { name: 'الطلاب' }]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={isNew.onTrue}
            >
              طالب جديد
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <RoleBasedGuard
          hasContent
          currentRole={user?.role?.permissions?.map((p) => p.code) || []}
          allowedRoles={[GlobalPermissionCode.ReadStudent]}
          sx={{
            marginY: 'auto',
          }}
        >
          <Card>
            <StudentTableToolbar
              filters={filters}
              onResetPage={table.onResetPage}
              options={{
                admins,
                teachers,
              }}
            />

            {canReset && (
              <StudentTableFiltersResult
                filters={filters}
                totalResults={dataFiltered.length}
                onResetPage={table.onResetPage}
                sx={{ p: 2.5, pt: 0 }}
              />
            )}

            <Box sx={{ position: 'relative' }}>
              <TableSelectedAction
                dense={table.dense}
                numSelected={table.selected.length}
                rowCount={dataFiltered.length}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    dataFiltered.map((row) => row.id)
                  )
                }
                action={
                  <Tooltip title="مسح">
                    <IconButton color="primary" onClick={confirmDialog.onTrue}>
                      <Iconify icon="solar:trash-bin-trash-bold" />
                    </IconButton>
                  </Tooltip>
                }
              />

              <Scrollbar>
                <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                  <TableHeadCustom
                    order={table.order}
                    orderBy={table.orderBy}
                    headCells={TABLE_HEAD}
                    rowCount={dataFiltered.length}
                    numSelected={table.selected.length}
                    onSort={table.onSort}
                    onSelectAllRows={(checked) =>
                      table.onSelectAllRows(
                        checked,
                        dataFiltered.map((row) => row.id)
                      )
                    }
                  />

                  <TableBody>
                    {dataFiltered
                      .slice(
                        table.page * table.rowsPerPage,
                        table.page * table.rowsPerPage + table.rowsPerPage
                      )
                      .map((row) => (
                        <StudentTableRow
                          key={row.id}
                          row={row}
                          selected={table.selected.includes(row.id)}
                          refetch={refetch}
                          onSelectRow={() => table.onSelectRow(row.id)}
                          onDeleteRow={() => handleDeleteRow(row.id)}
                          editHref={paths.dashboard.student.details.replace(':id', row.id)}
                        />
                      ))}

                    <TableEmptyRows
                      height={table.dense ? 56 : 56 + 20}
                      emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                    />

                    <TableNoData notFound={notFound} />
                  </TableBody>
                </Table>
              </Scrollbar>
            </Box>

            <TablePaginationCustom
              page={table.page}
              dense={table.dense}
              count={dataFiltered.length}
              rowsPerPage={table.rowsPerPage}
              onPageChange={table.onChangePage}
              onChangeDense={table.onChangeDense}
              onRowsPerPageChange={table.onChangeRowsPerPage}
            />
          </Card>
        </RoleBasedGuard>
      </DashboardContent>

      {isNew.value && (
        <StudentQuickEditForm open={isNew.value} onClose={isNew.onFalse} refetch={refetch} />
      )}
      {renderConfirmDialog()}
    </>
  );
}

// ----------------------------------------------------------------------

type ApplyFilterProps = {
  inputData: IStudentItem[];
  filters: IStudentTableFilters;
  comparator: (a: any, b: any) => number;
};

function applyFilter({ inputData, comparator, filters }: ApplyFilterProps) {
  const { name, teacher, admin } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (admin.length) {
    inputData = inputData.filter((user) => admin.includes(user.admin?.id));
  }

  if (teacher.length) {
    inputData = inputData.filter((user) => admin.includes(user.admin?.id));
  }

  if (name) {
    inputData = inputData.filter((student) =>
      student.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  return inputData;
}
