import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react';
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
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { deleteTenant } from '@/services/mqtt';

interface DeleteTenantButtonProps {
  tenantName: string;
}

export function DeleteTenantButton({ tenantName }: DeleteTenantButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const deleteTenantMutation = useMutation({
    mutationFn: deleteTenant,
    onSuccess: () => {
      toast({ title: 'Success', description: 'Tenant deleted successfully!' });
      queryClient.invalidateQueries({ queryKey: ['QueryTenantListData'] });
      setIsOpen(false);
    },
    onError: (error: any) => {
      console.error('Failed to delete tenant:', error);
    },
  });

  const handleDelete = () => {
    deleteTenantMutation.mutate({ tenant_name: tenantName });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 transition-all duration-200 rounded-md"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Tenant</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete tenant <strong>"{tenantName}"</strong>?
            <br />
            <br />
            This action cannot be undone. All resources associated with this tenant will be permanently removed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteTenantMutation.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteTenantMutation.isPending ? 'Deleting...' : 'Delete Tenant'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
