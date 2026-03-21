import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { deleteAutoSubscribe, AutoSubscribeRaw } from '@/services/mqtt';

interface DeleteAutoSubscribeButtonProps {
  autoSubscribe: AutoSubscribeRaw;
}

export function DeleteAutoSubscribeButton({ autoSubscribe }: DeleteAutoSubscribeButtonProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => deleteAutoSubscribe({ tenant: autoSubscribe.tenant, name: autoSubscribe.name }),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Auto subscription rule deleted successfully',
      });
      queryClient.refetchQueries({ queryKey: ['QueryAutoSubscriptionListData_all'], exact: false });
      setOpen(false);
    },
    onError: (error: any) => {
      console.error('Failed to delete auto subscription rule:', error);
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 h-8 w-8 p-0 rounded-md"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Auto Subscription Rule</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this auto subscription rule? This action cannot be undone.
            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-md">
              <div className="text-sm space-y-1">
                <div>
                  <span className="font-medium">Name:</span> {autoSubscribe.name}
                </div>
                <div>
                  <span className="font-medium">Tenant:</span> {autoSubscribe.tenant}
                </div>
                <div>
                  <span className="font-medium">Topic:</span> {autoSubscribe.topic}
                </div>
                <div>
                  <span className="font-medium">QoS:</span> {autoSubscribe.qos}
                </div>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deleteMutation.mutate()}
            disabled={deleteMutation.isPending}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
