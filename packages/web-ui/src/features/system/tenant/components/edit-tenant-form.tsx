import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { updateTenant, TenantRaw } from '@/services/mqtt';

const editTenantSchema = z.object({
  desc: z.string().max(500, 'Description must be at most 500 characters').optional(),
  max_connections_per_node: z.coerce.number().int().positive().optional().or(z.literal('')),
  max_create_connection_rate_per_second: z.coerce.number().int().positive().optional().or(z.literal('')),
  max_topics: z.coerce.number().int().positive().optional().or(z.literal('')),
  max_sessions: z.coerce.number().int().positive().optional().or(z.literal('')),
  max_publish_rate: z.coerce.number().int().positive().optional().or(z.literal('')),
});

type EditTenantFormData = z.infer<typeof editTenantSchema>;

interface EditTenantFormProps {
  tenant: TenantRaw;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditTenantForm({ tenant, open, onOpenChange }: EditTenantFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const tenantFormValues = (): EditTenantFormData => ({
    desc: tenant.desc ?? '',
    max_connections_per_node: tenant.config?.max_connections_per_node ?? '',
    max_create_connection_rate_per_second: tenant.config?.max_create_connection_rate_per_second ?? '',
    max_topics: tenant.config?.max_topics ?? '',
    max_sessions: tenant.config?.max_sessions ?? '',
    max_publish_rate: tenant.config?.max_publish_rate ?? '',
  });

  const form = useForm<EditTenantFormData>({
    resolver: zodResolver(editTenantSchema),
    defaultValues: tenantFormValues(),
  });

  useEffect(() => {
    if (open) {
      form.reset(tenantFormValues());
    }
  }, [open, tenant]);

  const updateTenantMutation = useMutation({
    mutationFn: updateTenant,
    onSuccess: () => {
      toast({ title: 'Success', description: 'Tenant updated successfully!' });
      queryClient.invalidateQueries({ queryKey: ['QueryTenantListData'] });
      onOpenChange(false);
    },
    onError: (error: any) => {
      console.error('Failed to update tenant:', error);
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const onSubmit = (data: EditTenantFormData) => {
    setIsLoading(true);
    const config: Record<string, number> = {};
    const configFields = [
      'max_connections_per_node',
      'max_create_connection_rate_per_second',
      'max_topics',
      'max_sessions',
      'max_publish_rate',
    ] as const;
    configFields.forEach(key => {
      if (data[key] !== '' && data[key] !== undefined) {
        config[key] = Number(data[key]);
      }
    });

    updateTenantMutation.mutate({
      tenant_name: tenant.tenant_name,
      desc: data.desc || undefined,
      config: Object.keys(config).length > 0 ? config : undefined,
    });
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!isLoading) onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Tenant</DialogTitle>
          <DialogDescription>
            Update description and resource quotas for tenant <strong>{tenant.tenant_name}</strong>.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="desc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Optional description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="max_connections_per_node"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Connections / Node</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Leave empty to keep current" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="max_create_connection_rate_per_second"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Connection Rate / s</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Leave empty to keep current" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="max_topics"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Topics</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Leave empty to keep current" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="max_sessions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Sessions</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Leave empty to keep current" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="max_publish_rate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Publish Rate / s</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Leave empty to keep current" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
