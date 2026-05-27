'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { formatCurrency } from '@/lib/format';
import { createPedido } from '@/services/pedidos';
import { getRestaurantes } from '@/services/restaurantes';
import { getUsuarios } from '@/services/usuarios';
import type { Restaurante, Usuario } from '@/types';

const itemSchema = z.object({
  produto: z.string().min(1),
  preco: z.coerce.number().min(0),
  qtd: z.coerce.number().min(1),
});

const schema = z.object({
  usuario_id: z.string().min(1, 'Selecione o usuário'),
  restaurante_id: z.string().min(1, 'Selecione o restaurante'),
  itens: z.array(itemSchema).min(1),
});

type FormData = z.infer<typeof schema>;

export default function NovoPedidoPage() {
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
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      itens: [{ produto: '', preco: 0, qtd: 1 }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'itens' });
  const itens = watch('itens');
  const restauranteId = watch('restaurante_id');
  const restaurante = restaurantes.find((r) => r._id === restauranteId);
  const subtotal = (itens ?? []).reduce(
    (acc, i) => acc + (Number(i.preco) || 0) * (Number(i.qtd) || 0),
    0,
  );
  const estimativa = subtotal + (restaurante?.taxa_entrega ?? 0);

  useEffect(() => {
    Promise.all([getUsuarios({ limit: 100 }), getRestaurantes({ limit: 100 })])
      .then(([u, r]) => {
        setUsuarios(u.data);
        setRestaurantes(r.data);
      })
      .catch((e) => setAlert({ type: 'error', message: (e as Error).message }))
      .finally(() => setLoading(false));
  }, []);

  const onSubmit = async (data: FormData) => {
    try {
      const pedido = await createPedido(data);
      setAlert({
        type: 'success',
        message: `Pedido criado! Total: ${formatCurrency(pedido.valor_total)}`,
      });
      setTimeout(() => router.push('/gerenciar/pedidos'), 1000);
    } catch (e) {
      setAlert({ type: 'error', message: (e as Error).message });
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="mx-auto max-w-2xl rounded-xl bg-white p-6 shadow-sm">
      <h1 className="mb-4 text-2xl font-bold">Novo pedido</h1>
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
            <option value="">Selecione...</option>
            {usuarios.map((u) => (
              <option key={u._id} value={u._id}>
                {u.nome}
              </option>
            ))}
          </select>
          {errors.usuario_id && (
            <span className="text-xs text-red-600">{errors.usuario_id.message}</span>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Restaurante</label>
          <select
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            {...register('restaurante_id')}
          >
            <option value="">Selecione...</option>
            {restaurantes.map((r) => (
              <option key={r._id} value={r._id}>
                {r.nome} (entrega {formatCurrency(r.taxa_entrega)})
              </option>
            ))}
          </select>
          {errors.restaurante_id && (
            <span className="text-xs text-red-600">{errors.restaurante_id.message}</span>
          )}
        </div>

        <div className="space-y-3">
          <p className="font-semibold">Itens</p>
          {fields.map((field, index) => (
            <div key={field.id} className="grid gap-2 rounded-lg border p-3 md:grid-cols-4">
              <Input
                label="Produto"
                {...register(`itens.${index}.produto`)}
                error={errors.itens?.[index]?.produto?.message}
              />
              <Input
                label="Preço"
                type="number"
                step="0.01"
                {...register(`itens.${index}.preco`)}
              />
              <Input
                label="Qtd"
                type="number"
                {...register(`itens.${index}.qtd`)}
              />
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

        <p className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-ifood-red">
          Estimativa (itens + taxa): {formatCurrency(estimativa)}
          <br />
          <span className="font-normal text-ifood-gray">
            O valor final é calculado automaticamente pela API.
          </span>
        </p>

        <div className="flex gap-2">
          <Button type="submit" loading={isSubmitting}>
            Criar pedido
          </Button>
          <Link href="/gerenciar/pedidos">
            <Button type="button" variant="secondary">
              Cancelar
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
