import { DataTable } from '@/components/table';
import { ColumnDef } from '@tanstack/react-table';
import { getAutoSubscribeListHttp, AutoSubscribeRaw } from '@/services/mqtt';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, ToggleLeft, Archive, Settings, Building2, Tag, Eye, FileText, Zap, Copy, Check } from 'lucide-react';
import { useState as useLocalState } from 'react';
import { DeleteAutoSubscribeButton } from './components/delete-auto-subscribe-button';
import { FilterValue } from '@/components/table/filter';

const QOS_MAP = {
  QoS0: 'QoS 0',
  QoS1: 'QoS 1',
  QoS2: 'QoS 2',
};

const RETAINED_HANDLING_MAP = {
  SendAtSubscribe: 'Send at Subscribe',
  SendAtSubscribeIfNotExist: 'Send if Not Exist',
  DoNotSend: 'Do Not Send',
};

const getQosBadgeStyle = (qos: string) => {
  switch (qos) {
    case 'QoS0':
      return 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-sm';
    case 'QoS1':
      return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm';
    case 'QoS2':
      return 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-sm';
    default:
      return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-sm';
  }
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useLocalState(false);
  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button
      onClick={handleCopy}
      className="shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
      title="Copy"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}

function InfoRow({ label, value, mono }: { label: string; value?: string | boolean; mono?: boolean }) {
  const display = typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value;
  return (
    <div className="flex flex-col gap-1 py-2 border-b last:border-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={`text-sm font-medium break-all ${mono ? 'font-mono' : ''}`}>{display || '-'}</span>
    </div>
  );
}

function DetailButton({ autoSubscribe }: { autoSubscribe: AutoSubscribeRaw }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950 h-8 w-8 p-0 rounded-md"
        >
          <Eye className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[420px] sm:w-[480px] overflow-y-auto">
        <SheetHeader className="pb-4 border-b">
          <SheetTitle className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-purple-600">
              <Zap className="h-4 w-4 text-white" />
            </div>
            Auto Subscription Rule
          </SheetTitle>
          <SheetDescription>View the complete auto subscription rule configuration</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          <Card>
            <CardContent className="pt-4 pb-2 px-4">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Basic Information</span>
              </div>
              <InfoRow label="Name" value={autoSubscribe.name} />
              <InfoRow label="Tenant" value={autoSubscribe.tenant} />
              <InfoRow label="Description" value={autoSubscribe.desc} />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4 pb-2 px-4">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Subscription Settings</span>
              </div>
              <InfoRow label="Topic" value={autoSubscribe.topic} mono />
              <InfoRow label="QoS" value={QOS_MAP[autoSubscribe.qos as keyof typeof QOS_MAP] || autoSubscribe.qos} />
              <InfoRow label="No Local" value={autoSubscribe.no_local} />
              <InfoRow label="Retain as Published" value={autoSubscribe.retain_as_published} />
              <InfoRow
                label="Retained Handling"
                value={RETAINED_HANDLING_MAP[autoSubscribe.retained_handling as keyof typeof RETAINED_HANDLING_MAP] || autoSubscribe.retained_handling}
              />
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  );
}

interface AutoSubscriptionListProps {
  leftActions?: React.ReactNode;
  extraActions?: React.ReactNode;
  tenant?: string;
  onSearch?: () => void;
}

export default function AutoSubscriptionList({ leftActions, extraActions, tenant, onSearch }: AutoSubscriptionListProps) {
  const columns: ColumnDef<AutoSubscribeRaw>[] = [
    {
      id: 'tenant',
      header: 'Tenant',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Building2 className="h-4 w-4 text-purple-400 shrink-0" />
          <span className="text-sm text-gray-600 dark:text-gray-400 truncate">{row.original.tenant || '-'}</span>
        </div>
      ),
      size: 120,
      maxSize: 140,
    },
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2 max-w-[420px]">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900 shrink-0">
            <Tag className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
          </div>
          <span className="font-medium truncate flex-1" title={row.original.name}>{row.original.name}</span>
          <CopyButton text={row.original.name} />
        </div>
      ),
      size: 420,
      maxSize: 500,
    },
    {
      accessorKey: 'qos',
      header: 'QoS',
      cell: ({ row }) => (
        <Badge variant="default" className={getQosBadgeStyle(row.original.qos)}>
          <Shield className="mr-1 h-3 w-3" />
          {QOS_MAP[row.original.qos as keyof typeof QOS_MAP] || row.original.qos}
        </Badge>
      ),
      size: 90,
      maxSize: 100,
    },
    {
      accessorKey: 'no_local',
      header: 'No Local',
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className={
            row.original.no_local
              ? 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800'
              : 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950 dark:text-gray-300 dark:border-gray-800'
          }
        >
          <ToggleLeft className="mr-1 h-3 w-3" />
          {row.original.no_local ? 'Yes' : 'No'}
        </Badge>
      ),
      size: 100,
      maxSize: 110,
    },
    {
      accessorKey: 'retain_as_published',
      header: 'Retain Published',
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className={
            row.original.retain_as_published
              ? 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800'
              : 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950 dark:text-gray-300 dark:border-gray-800'
          }
        >
          <Archive className="mr-1 h-3 w-3" />
          {row.original.retain_as_published ? 'Yes' : 'No'}
        </Badge>
      ),
      size: 110,
      maxSize: 120,
    },
    {
      accessorKey: 'retained_handling',
      header: 'Ret. Handling',
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800"
        >
          <Settings className="mr-1 h-3 w-3" />
          {RETAINED_HANDLING_MAP[row.original.retained_handling as keyof typeof RETAINED_HANDLING_MAP] ||
            row.original.retained_handling}
        </Badge>
      ),
      size: 120,
      maxSize: 140,
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center justify-center space-x-1">
          <DetailButton autoSubscribe={row.original} />
          <DeleteAutoSubscribeButton autoSubscribe={row.original} />
        </div>
      ),
      size: 90,
      minSize: 80,
      maxSize: 100,
    },
  ];

  const fetchDataFn = async (pageIndex: number, pageSize: number, searchValue: FilterValue[]) => {
    const nameVal = searchValue.find(f => f.field === 'name' || f.field === '')?.valueList?.[0];
    try {
      const ret = await getAutoSubscribeListHttp({
        pagination: { offset: pageIndex * pageSize, limit: pageSize },
        ...(tenant ? { tenant } : {}),
        ...(nameVal ? { name: nameVal } : {}),
      });
      return {
        data: ret.autoSubscribesList || [],
        totalCount: ret.totalCount || 0,
      };
    } catch (error) {
      console.error('Failed to fetch auto subscribe data:', error);
      return { data: [], totalCount: 0 };
    }
  };

  return (
    <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
      <DataTable
        columns={columns}
        fetchDataFn={fetchDataFn}
        queryKey={`QueryAutoSubscriptionListData_${tenant ?? 'all'}`}
        headerClassName="bg-purple-600 text-white"
        leftActions={leftActions}
        extraActions={extraActions}
        onSearch={onSearch}
        searchPlaceholder="Search by name..."
      />
    </div>
  );
}
