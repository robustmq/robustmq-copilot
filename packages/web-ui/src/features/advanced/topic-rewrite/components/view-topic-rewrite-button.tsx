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
import { Eye, FileText, FileEdit } from 'lucide-react';
import { TopicRewriteRaw } from '@/services/mqtt';

interface ViewTopicRewriteButtonProps {
  topicRewrite: TopicRewriteRaw;
}

function InfoRow({ label, value, mono }: { label: string; value?: string; mono?: boolean }) {
  return (
    <div className="flex flex-col gap-1 py-2 border-b last:border-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={`text-sm font-medium break-all ${mono ? 'font-mono' : ''}`}>{value || '-'}</span>
    </div>
  );
}

export function ViewTopicRewriteButton({ topicRewrite }: ViewTopicRewriteButtonProps) {
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
              <FileEdit className="h-4 w-4 text-white" />
            </div>
            Topic Rewrite Rule
          </SheetTitle>
          <SheetDescription>View the complete topic rewrite rule configuration</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {/* Basic Info */}
          <Card>
            <CardContent className="pt-4 pb-2 px-4">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Basic Information</span>
              </div>
              <InfoRow label="Name" value={topicRewrite.name} />
              <InfoRow label="Tenant" value={topicRewrite.tenant} />
              <InfoRow label="Description" value={topicRewrite.desc} />
            </CardContent>
          </Card>

          {/* Rewrite Rule */}
          <Card>
            <CardContent className="pt-4 pb-2 px-4">
              <div className="flex items-center gap-2 mb-3">
                <FileEdit className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Rewrite Rule</span>
              </div>
              <InfoRow label="Action" value={topicRewrite.action} />
              <InfoRow label="Source Topic" value={topicRewrite.source_topic} mono />
              <InfoRow label="Destination Topic" value={topicRewrite.dest_topic} mono />
              <InfoRow label="Regex Pattern" value={topicRewrite.regex} mono />
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  );
}
