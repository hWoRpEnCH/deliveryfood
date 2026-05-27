'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { formatCurrency } from '@/lib/format';
import { getPedido, updatePedido } from '@/services/pedidos';
import { getRestaurantes } from '@/services/restaurantes';
import { getUsuarios } from '@/services/usuarios';
import type { Restaurante, Usuario } from '@/types';

const itemSchema = z.object({
  produto: z.string().min(1),
  preco: z.coerce.number().min(0),
  qtd: z.coerce.number().min(1),
});

const schema = z.object({
  usuario_id: z.string().min(1),
  restaurante_id: z.string().min(1),
  itens: z.array(itemSchema).min(1),
});

type FormData = z.infer<typeof schema>;

export default function EditarPedidoPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [restaurantes, setRestaurantes] = useState<Restaurante[]>([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null,
  );

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const { fields, append, remove } = useFieldArray({ control, name: 'itens' });

  useEffect(() => {
    Promise.all([
      getUsuarios({ limit: 100 }),
      getRestaurantes({ limit: 100 }),
      getPedido(id),
    ])
      .then(([u, r, p]) => {
        setUsuarios(u.data);
        setRestaurantes(r.data);
        const usuarioId =
          typeof p.usuario_id === 'string' ? p.usuario_id : p.usuario_id._id;
        const restauranteId =
          typeof p.restaurante_id === 'string' ? p.restaurante_id : p.restaurante_id._id;
        reset({
          usuario_id: usuarioId,
          restaurante_id: restauranteId,
          itens: p.itens,
        });
      })
      .catch((e) => setAlert({ type: 'error', message: (e as Error).message }))
      .finally(() => setLoading(false));
  }, [id, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      const pedido = await updatePedido(id, data);
      setAlert({
        type: 'success',
        message: `Pedido atualizado! Total: ${formatCurrency(pedido.valor_total)}`,
      });
      setTimeout(() => router.push('/gerenciar/pedidos'), 1000);
    } catch (e) {
      setAlert({ type: 'error', message: (e as Error).message });
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="mx-auto max-w-2xl rounded-xl bg-white p-6 shadow-sm">
      <h1 className="mb-4 text-2xl font-bold">Editar pedido</h1>
      {alert && (
        <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Usuário</label>
          <select
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            {...register('usuario_id')}
          >
            {usuarios.map((u) => (
              <option key={u._id} value={u._id}>
                {u.nome}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Restaurante</label>
          <select
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            {...register('restaurante_id')}
          >
            {restaurantes.map((r) => (
              <option key={r._id} value={r._id}>
                {r.nome}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-3">
          {fields.map((field, index) => (
            <div key={field.id} className="grid gap-2 rounded-lg border p-3 md:grid-cols-4">
              <Input label="Produto" {...register(`itens.${index}.produto`)} />
              <Input
                label="Preço"
                type="number"
                step="0.01"
                {...register(`itens.${index}.preco`)}
              />
              <Input label="Qtd" type="number" {...register(`itens.${index}.qtd`)} />
              <div className="flex items-end">
                <Button type="button" variant="ghost" onClick={() => remove(index)}>
                  Remover
                </Button>
              </div>
            </div>
          ))}
          <Button
            type="button"
            variant="secondary"
            onClick={() => append({ produto: '', preco: 0, qtd: 1 })}
          >
            + Item
          </Button>
        </div>
        <div className="flex gap-2">
          <Button type="submit" loading={isSubmitting}>
            Salvar
          </Button>
          <Link href="/gerenciar/pedidos">
            <Button type="button" variant="secondary">
              Voltar
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
