'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { deleteRestaurante, getRestaurantes } from '@/services/restaurantes';
import type { Restaurante } from '@/types';

export default function GerenciarRestaurantesPage() {
  const [restaurantes, setRestaurantes] = useState<Restaurante[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getRestaurantes({ limit: 100 });
      setRestaurantes(res.data);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (r: Restaurante) => {
    if (!confirm(`Excluir "${r.nome}"? Esta ação não pode ser desfeita.`)) return;
    try {
      await deleteRestaurante(r._id);
      toast.success('Restaurante excluído');
      await load();
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gerenciar restaurantes</h1>
          <p className="text-sm text-gray-500 mt-1">{restaurantes.length} restaurante(s) cadastrado(s)</p>
        </div>
        <div className="flex gap-3">
          <Link href="/usuarios">
            <Button variant="secondary" type="button">← Voltar para Conta</Button>
          </Link>
          <Link href="/gerenciar/restaurantes/novo">
            <Button type="button">+ Novo restaurante</Button>
          </Link>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : restaurantes.length === 0 ? (
        <div className="ifood-card p-10 text-center text-gray-400">
          <p className="text-lg">Nenhum restaurante cadastrado.</p>
          <Link href="/gerenciar/restaurantes/novo">
            <Button type="button" className="mt-4">Criar primeiro restaurante</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {restaurantes.map((r) => (
            <div key={r._id} className="ifood-card p-4 flex flex-wrap items-center gap-4">
              {/* Imagem */}
              <div className="flex-shrink-0">
                {r.imagem ? (
                  <img
                    src={r.imagem}
                    alt={r.nome}
                    className="w-16 h-14 rounded-lg object-cover border border-gray-200"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                ) : (
                  <div className="w-16 h-14 rounded-lg bg-[rgb(255,235,229)] flex items-center justify-center">
                    <span className="text-2xl">🍽️</span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-gray-900">{r.nome}</p>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      r.aberto
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {r.aberto ? 'Aberto' : 'Fechado'}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-0.5">
                  {r.categoria}
                  {r.endereco && <> · {r.endereco}</>}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Taxa R$ {r.taxa_entrega.toFixed(2)}
                  {r.tempo_entrega && <> · {r.tempo_entrega}</>}
                  {r.pedido_minimo ? <> · Mín. R$ {r.pedido_minimo.toFixed(2)}</> : ''}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 flex-shrink-0">
                <Link href={`/gerenciar/restaurantes/${r._id}/editar`}>
                  <Button variant="ghost" type="button" className="text-sm">Editar</Button>
                </Link>
                <Button
                  variant="danger"
                  type="button"
                  className="text-sm"
                  onClick={() => handleDelete(r)}
                >
                  Excluir
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
