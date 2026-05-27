'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { createRestaurante } from '@/services/restaurantes';

const schema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  categoria: z.string().min(2, 'Categoria obrigatória'),
  taxa_entrega: z.coerce.number().min(0, 'Taxa inválida'),
  descricao: z.string().optional(),
  imagem: z.string().url('URL inválida').or(z.literal('')).optional(),
  endereco: z.string().optional(),
  tempo_entrega: z.string().optional(),
  pedido_minimo: z.coerce.number().min(0).optional(),
  aberto: z.boolean().optional(),
});

type FormData = z.infer<typeof schema>;

export default function NovoRestaurantePage() {
  const router = useRouter();
  const [previewImg, setPreviewImg] = useState('');
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { aberto: true, pedido_minimo: 0, taxa_entrega: 0, tempo_entrega: '30-45 min' },
  });

  const imagemValue = watch('imagem');
  useEffect(() => { if (imagemValue) setPreviewImg(imagemValue); }, [imagemValue]);

  const onSubmit = async (data: FormData) => {
    try {
      await createRestaurante({
        ...data,
        imagem: data.imagem || undefined,
        descricao: data.descricao || undefined,
        endereco: data.endereco || undefined,
        aberto: data.aberto ?? true,
      });
      setAlert({ type: 'success', message: 'Restaurante criado com sucesso!' });
      setTimeout(() => router.push('/gerenciar/restaurantes'), 900);
    } catch (e) {
      setAlert({ type: 'error', message: (e as Error).message });
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/gerenciar/restaurantes" className="text-sm text-gray-500 hover:text-gray-700">
          ← Voltar para restaurantes
        </Link>
      </div>

      <div className="ifood-card p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Novo restaurante</h1>

        {/* Preview da imagem */}
        <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
          {previewImg ? (
            <img
              src={previewImg}
              alt="Preview"
              className="w-20 h-16 rounded-lg object-cover border-2 border-[rgb(255,79,1)]"
              onError={() => setPreviewImg('')}
            />
          ) : (
            <div className="w-20 h-16 rounded-lg bg-[rgb(255,235,229)] flex items-center justify-center border-2 border-dashed border-[rgb(255,79,1)]">
              <span className="text-2xl">🍽️</span>
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-gray-700">Preview da capa</p>
            <p className="text-xs text-gray-400">Cole uma URL de imagem abaixo</p>
          </div>
        </div>

        {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Informações principais */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Informações principais
            </p>
            <div className="space-y-3">
              <Input label="Nome do restaurante *" {...register('nome')} error={errors.nome?.message} placeholder="Ex: Pizza Bacana" />
              <Input label="Categoria *" {...register('categoria')} error={errors.categoria?.message} placeholder="Ex: Italiana, Japonesa, Lanches..." />
              <Input label="Descrição" {...register('descricao')} error={errors.descricao?.message} placeholder="Uma breve descrição do restaurante" />
              <Input label="URL da imagem de capa" {...register('imagem')} error={errors.imagem?.message} placeholder="https://exemplo.com/imagem.jpg" />
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Entrega
            </p>
            <div className="space-y-3">
              <Input label="Endereço" {...register('endereco')} error={errors.endereco?.message} placeholder="Rua, número, bairro" />
              <div className="grid grid-cols-2 gap-3">
                <Input label="Taxa de entrega (R$) *" type="number" step="0.01" {...register('taxa_entrega')} error={errors.taxa_entrega?.message} />
                <Input label="Tempo estimado" {...register('tempo_entrega')} error={errors.tempo_entrega?.message} placeholder="Ex: 30-45 min" />
              </div>
              <Input label="Pedido mínimo (R$)" type="number" step="0.01" {...register('pedido_minimo')} error={errors.pedido_minimo?.message} />
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Status
            </p>
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input type="checkbox" className="sr-only peer" {...register('aberto')} />
                <div className="w-11 h-6 rounded-full bg-gray-200 peer-checked:bg-[rgb(255,79,1)] transition-colors" />
                <div className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
              </div>
              <span className="text-sm font-medium text-gray-700">Restaurante aberto</span>
            </label>
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="submit" loading={isSubmitting}>Criar restaurante</Button>
            <Link href="/gerenciar/restaurantes">
              <Button type="button" variant="secondary">Cancelar</Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
