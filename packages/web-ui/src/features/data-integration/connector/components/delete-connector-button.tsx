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
import { deleteConnector } from '@/services/mqtt';

interface DeleteConnectorButtonProps {
  connectorName: string;
  tenant: string;
}

export function DeleteConnectorButton({ connectorName, tenant }: DeleteConnectorButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const deleteConnectorMutation = useMutation({
    mutationFn: deleteConnector,
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Connector deleted successfully!',
      });
      queryClient.invalidateQueries({ queryKey: ['QueryConnectorListData'] });
      setIsOpen(false);
    },
    onError: (error: any) => {
      console.error('Failed to delete connector:', error);
      const errorMessage = error?.message || error?.toString() || 'Failed to delete connector';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    },
  });

  const handleDelete = () => {
    deleteConnectorMutation.mutate({ tenant, connector_name: connectorName });
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
          <AlertDialogTitle>Delete Connector</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete connector <strong>"{connectorName}"</strong>?
            <br />
            <br />
            This action cannot be undone. This will permanently delete the connector and stop all data integration
            activities associated with it.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteConnectorMutation.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteConnectorMutation.isPending ? 'Deleting...' : 'Delete Connector'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
