import { CommonLayout } from '@/components/layout/common-layout';
import { columns } from './components/columns';
import { DataTable } from './components/data-table';
import { TasksDialogs } from './components/tasks-dialogs';
import TasksProvider from './context/tasks-context';
import { tasks } from './data/tasks';
import { useQuery } from '@tanstack/react-query';
import { fetchClusterNodeList } from './services';

export default function PlacementCenter() {
  const { data, error } = useQuery({
    queryKey: ['QueryData'],
    queryFn: fetchClusterNodeList,
  });

  console.log(data);

  console.log('error:', error);

  return (
    <TasksProvider>
      <CommonLayout>
        <div className="mb-2 flex flex-wrap items-center justify-between gap-x-4 space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">PlacementCenter</h2>
          </div>
        </div>
        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
          <DataTable data={tasks} columns={columns} />
        </div>

        <TasksDialogs />
      </CommonLayout>
    </TasksProvider>
  );
}
