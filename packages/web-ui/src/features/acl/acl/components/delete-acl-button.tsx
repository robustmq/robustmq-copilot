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
import { deleteAcl, AclRaw } from '@/services/mqtt';

interface DeleteAclButtonProps {
  acl: AclRaw;
}

export function DeleteAclButton({ acl }: DeleteAclButtonProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => deleteAcl({ tenant: acl.tenant, name: acl.name }),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'ACL rule deleted successfully',
      });
      queryClient.refetchQueries({ queryKey: ['QueryAclListData_all'], exact: false });
      setOpen(false);
    },
    onError: (error: any) => {
      console.error('Failed to delete ACL rule:', error);
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
          <AlertDialogTitle>Delete ACL Rule</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete ACL rule <strong>"{acl.name}"</strong>? This action cannot be undone.
            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-md">
              <div className="text-sm space-y-1">
                <div><span className="font-medium">Tenant:</span> {acl.tenant}</div>
                <div><span className="font-medium">Name:</span> {acl.name}</div>
                <div><span className="font-medium">Resource Type:</span> {acl.resource_type}</div>
                <div><span className="font-medium">Action:</span> {acl.action}</div>
                <div><span className="font-medium">Permission:</span> {acl.permission}</div>
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
