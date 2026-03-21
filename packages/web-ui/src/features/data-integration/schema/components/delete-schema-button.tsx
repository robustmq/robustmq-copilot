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
import { deleteSchema, SchemaRaw } from '@/services/mqtt';

interface DeleteSchemaButtonProps {
  schema: SchemaRaw;
}

export function DeleteSchemaButton({ schema }: DeleteSchemaButtonProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => deleteSchema({ tenant: schema.tenant, schema_name: schema.name }),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Schema deleted successfully',
      });
      queryClient.refetchQueries({ queryKey: ['QuerySchemaListData_all'], exact: false });
      setOpen(false);
    },
    onError: (error: any) => {
      console.error('Failed to delete schema:', error);
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
          <AlertDialogTitle>Delete Schema</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this schema? This action cannot be undone.
            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-md">
              <div className="text-sm space-y-1">
                <div>
                  <span className="font-medium">Schema Name:</span> {schema.name}
                </div>
                <div>
                  <span className="font-medium">Schema Type:</span> {schema.schema_type}
                </div>
                <div>
                  <span className="font-medium">Description:</span> {schema.desc || '-'}
                </div>
                <div>
                  <span className="font-medium">Schema Definition:</span>
                  <div className="mt-1 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono max-h-32 overflow-y-auto">
                    {schema.schema || '-'}
                  </div>
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
