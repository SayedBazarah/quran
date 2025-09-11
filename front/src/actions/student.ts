import type { SWRConfiguration } from 'swr';
import type { IStudentItem, IEnrollmentItem } from 'src/types/student';

import useSWR, { mutate } from 'swr';
import { useMemo, useCallback } from 'react';

import { fetcher, endpoints } from 'src/lib/axios';

// ----------------------------------------------------------------------

const swrOptions: SWRConfiguration = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

// ----------------------------------------------------------------------

export function useGetStudents() {
  const url = endpoints.student.list;
  const { data, isLoading, error, isValidating } = useSWR<IStudentItem[]>(url, fetcher, {
    ...swrOptions,
  });

  const refetchData = useCallback(() => {
    mutate(url); // This will re-fetch the data from the same URL
  }, [url]);

  const memoizedValue = useMemo(
    () => ({
      students: data || [],
      studentsLoading: isLoading,
      studentsError: error,
      studentsValidating: isValidating,
      studentsEmpty: !isLoading && !isValidating && !data?.length,
      refetch: refetchData,
    }),
    [data, error, isLoading, isValidating, refetchData]
  );
  return memoizedValue;
}

export function useGetStudentById(id: string) {
  const url = endpoints.student.details.replace(':id', id);

  const { data, isLoading, error, isValidating } = useSWR<IStudentItem>(url, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const refetchData = useCallback(() => {
    mutate(url); // This will re-fetch the data from the same URL
  }, [url]);

  const memoizedValue = useMemo(
    () => ({
      student: data as IStudentItem,
      studentLoading: isLoading,
      studentError: error,
      studentValidating: isValidating,
      studentEmpty: !isLoading && !isValidating && !data,
      refetch: refetchData,
    }),
    [data, error, isLoading, isValidating, refetchData]
  );
  return memoizedValue;
}
export function useGetPendingEnrollments() {
  const url = endpoints.student.pendingEnrollments;

  const { data, isLoading, error, isValidating } = useSWR<IEnrollmentItem[]>(url, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const refetchData = useCallback(() => {
    mutate(url); // This will re-fetch the data from the same URL
  }, [url]);
  const memoizedValue = useMemo(
    () => ({
      enrollment: data as IEnrollmentItem[],
      enrollmentLoading: isLoading,
      enrollmentError: error,
      enrollmentValidating: isValidating,
      enrollmentEmpty: !isLoading && !isValidating && !data,
      refetch: refetchData,
    }),
    [data, error, isLoading, isValidating, refetchData]
  );
  return memoizedValue;
}
