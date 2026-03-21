import { useState } from 'react';
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
import { createTenant } from '@/services/mqtt';

const createTenantSchema = z.object({
  tenant_name: z.string().min(1, 'Tenant name is required').max(128, 'Tenant name must be at most 128 characters'),
  desc: z.string().max(500, 'Description must be at most 500 characters').optional(),
  max_connections_per_node: z.coerce.number().int().positive().optional().or(z.literal('')),
  max_create_connection_rate_per_second: z.coerce.number().int().positive().optional().or(z.literal('')),
  max_topics: z.coerce.number().int().positive().optional().or(z.literal('')),
  max_sessions: z.coerce.number().int().positive().optional().or(z.literal('')),
  max_publish_rate: z.coerce.number().int().positive().optional().or(z.literal('')),
});

type CreateTenantFormData = z.infer<typeof createTenantSchema>;

interface CreateTenantFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateTenantForm({ open, onOpenChange }: CreateTenantFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<CreateTenantFormData>({
    resolver: zodResolver(createTenantSchema),
    defaultValues: { tenant_name: '', desc: '' },
  });

  const createTenantMutation = useMutation({
    mutationFn: createTenant,
    onSuccess: () => {
      toast({ title: 'Success', description: 'Tenant created successfully!' });
      queryClient.invalidateQueries({ queryKey: ['QueryTenantListData'] });
      form.reset();
      onOpenChange(false);
    },
    onError: (error: any) => {
      console.error('Failed to create tenant:', error);
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const onSubmit = (data: CreateTenantFormData) => {
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

    createTenantMutation.mutate({
      tenant_name: data.tenant_name,
      desc: data.desc || undefined,
      config: Object.keys(config).length > 0 ? config : undefined,
    });
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!isLoading) {
      onOpenChange(newOpen);
      if (!newOpen) form.reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Tenant</DialogTitle>
          <DialogDescription>
            Create a new tenant with optional resource quotas. Leave quota fields empty to use cluster defaults.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="tenant_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tenant Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. business-a" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                      <Input type="number" placeholder="default: 10000000" {...field} />
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
                      <Input type="number" placeholder="default: 10000" {...field} />
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
                      <Input type="number" placeholder="default: 5000000" {...field} />
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
                      <Input type="number" placeholder="default: 50000000" {...field} />
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
                      <Input type="number" placeholder="default: 10000" {...field} />
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
                {isLoading ? 'Creating...' : 'Create Tenant'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
