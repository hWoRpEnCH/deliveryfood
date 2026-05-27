export function LoadingSpinner({ label = 'Carregando...' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-ifood-red" />
      <p className="text-sm text-ifood-gray">{label}</p>
    </div>
  );
}
