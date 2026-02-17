import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  ApprovalWorkflowConfigurator,
  ApprovalsInbox,
  ESignExperience,
  SignedDocumentArchive,
} from '@/components/approvals-e-signatures'
import {
  useApprovalsList,
  useWorkflow,
  useSaveWorkflow,
  usePendingItems,
  useSignedDocuments,
  useSubmitSignature,
  useSubmitCheckboxApproval,
} from '@/hooks/use-approvals-e-signatures'
import { downloadSignedDocument } from '@/api/approvals-e-signatures'
import type { PendingApprovalItem, SignedDocumentItem } from '@/types/approvals-e-signatures'
import { Workflow, Inbox, PenTool, Archive } from 'lucide-react'

const defaultFilters = { status: 'all' as const, search: '' }

export default function ApprovalsESignaturesPage() {
  const [selectedApprovalId, setSelectedApprovalId] = useState<string | null>(null)
  const [workflowApprovalId, setWorkflowApprovalId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('inbox')

  const { data: approvals = [], isLoading: listLoading, isError: listError } =
    useApprovalsList(defaultFilters)
  const { data: workflow, isLoading: workflowLoading } = useWorkflow(workflowApprovalId ?? undefined)
  const { data: pendingItems = [], isLoading: inboxLoading } = usePendingItems()
  const { data: signedDocs = [], isLoading: archiveLoading } = useSignedDocuments()

  const saveWorkflowMutation = useSaveWorkflow()
  const submitSignatureMutation = useSubmitSignature(selectedApprovalId ?? '')
  const submitCheckboxMutation = useSubmitCheckboxApproval(selectedApprovalId ?? '')

  useEffect(() => {
    if (approvals.length === 1 && !workflowApprovalId) setWorkflowApprovalId(approvals[0].id)
  }, [approvals, workflowApprovalId])

  useEffect(() => {
    document.title = 'Approvals & E-signatures | SpecLogix'
    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Secure capture of approvals and e-signatures with audit trail and signed document export. SpecLogix.'
      )
    }
    return () => {
      document.title = 'SpecLogix'
    }
  }, [])

  const handleReview = (item: PendingApprovalItem) => {
    setSelectedApprovalId(item.approval_id)
    setActiveTab('sign')
  }

  const handleDownload = async (doc: SignedDocumentItem) => {
    try {
      const blob = await downloadSignedDocument(doc.id)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = doc.file_name ?? `signed-${doc.id}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      // Toast handled by caller if needed
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Approvals & E-signatures
        </h1>
        <p className="mt-1 text-muted-foreground">
          Secure capture of approvals and signatures with audit trail and signed document export.
        </p>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 gap-1 rounded-xl bg-muted p-1 sm:grid-cols-4">
          <TabsTrigger value="inbox" className="gap-2 rounded-lg">
            <Inbox className="h-4 w-4" />
            Inbox
            {pendingItems.length > 0 && (
              <span className="ml-1 rounded-full bg-primary px-1.5 py-0.5 text-xs text-primary-foreground">
                {pendingItems.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="workflow" className="gap-2 rounded-lg">
            <Workflow className="h-4 w-4" />
            Workflow
          </TabsTrigger>
          <TabsTrigger value="sign" className="gap-2 rounded-lg">
            <PenTool className="h-4 w-4" />
            E-sign
          </TabsTrigger>
          <TabsTrigger value="archive" className="gap-2 rounded-lg">
            <Archive className="h-4 w-4" />
            Archive
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inbox" className="mt-6">
          <ApprovalsInbox
            items={pendingItems}
            isLoading={inboxLoading}
            onReview={handleReview}
            emptyMessage="No pending approvals. Items requiring your signature or approval will appear here."
          />
        </TabsContent>

        <TabsContent value="workflow" className="mt-6">
          <div className="space-y-6">
            {listError && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                Could not load approvals. You can still use Inbox and Archive if data is available.
              </div>
            )}
            {approvals.length === 0 && !listLoading ? (
              <p className="rounded-lg border border-dashed border-border bg-muted/30 p-6 text-center text-sm text-muted-foreground">
                No approval workflows yet. Create an approval from your project or decisions to configure signers and e-sign options here.
              </p>
            ) : (
              <>
                {approvals.length > 1 && (
                  <div className="flex flex-col gap-2">
                    <label htmlFor="workflow-approval" className="text-sm font-medium">
                      Select approval to configure
                    </label>
                    <select
                      id="workflow-approval"
                      value={workflowApprovalId ?? ''}
                      onChange={(e) => setWorkflowApprovalId(e.target.value || null)}
                      className="h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">Choose one…</option>
                      {approvals.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.title}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                {(workflowApprovalId || approvals.length === 1) && (workflowApprovalId ?? approvals[0]?.id) && (
                  <ApprovalWorkflowConfigurator
                    key={workflowApprovalId ?? approvals[0]?.id}
                    approvalId={workflowApprovalId ?? approvals[0]?.id}
                    workflow={
                      workflow?.approval_id === (workflowApprovalId ?? approvals[0]?.id)
                        ? workflow
                        : null
                    }
                    isLoading={workflowLoading}
                    onSave={(config) =>
                      saveWorkflowMutation.mutate({
                        approval_id: workflowApprovalId ?? approvals[0]?.id ?? '',
                        ...config,
                      })
                    }
                    isSubmitting={saveWorkflowMutation.isPending}
                  />
                )}
              </>
            )}
          </div>
        </TabsContent>

        <TabsContent value="sign" className="mt-6">
          {selectedApprovalId ? (
            <ESignExperience
              approvalId={selectedApprovalId}
              legalText={workflow?.legal_text}
              requireESign={workflow?.approval_type === 'e_sign'}
              onSubmitSignature={(payload) =>
                submitSignatureMutation.mutate(payload, {
                  onSuccess: () => setActiveTab('archive'),
                })
              }
              onSubmitCheckbox={
                workflow?.approval_type === 'checkbox'
                  ? () =>
                      submitCheckboxMutation.mutate(undefined, {
                        onSuccess: () => setActiveTab('archive'),
                      })
                  : undefined
              }
              isSubmitting={
                submitSignatureMutation.isPending || submitCheckboxMutation.isPending
              }
            />
          ) : (
            <div className="rounded-xl border border-dashed border-border bg-muted/30 py-12 text-center">
              <PenTool className="mx-auto h-12 w-12 text-muted-foreground/60" />
              <p className="mt-4 text-sm font-medium text-foreground">Select an item to sign</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Go to Inbox and click “Review & sign” on a pending item, or choose an approval in Workflow to open the e-sign experience.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="archive" className="mt-6">
          <SignedDocumentArchive
            documents={signedDocs}
            isLoading={archiveLoading}
            onDownload={handleDownload}
            emptyMessage="No signed documents yet. Signed PDFs and metadata will appear here."
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
