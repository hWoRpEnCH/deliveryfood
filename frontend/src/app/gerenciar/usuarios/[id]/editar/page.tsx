'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useUser } from '@/contexts/UserContext';
import { getUsuario, updateUsuario } from '@/services/usuarios';

const schema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  imagem: z.string().url('URL inválida').or(z.literal('')).optional(),
  senha: z
    .string()
    .min(6, 'Mínimo 6 caracteres')
    .or(z.literal(''))
    .optional(),
});

type FormData = z.infer<typeof schema>;

export default function EditarUsuarioPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user: activeUser, setUser } = useUser();
  const [loading, setLoading] = useState(true);
  const [previewImg, setPreviewImg] = useState<string>('');
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const imagemValue = watch('imagem');

  useEffect(() => {
    getUsuario(id)
      .then((u) => {
        reset({ nome: u.nome, email: u.email, imagem: u.imagem ?? '', senha: '' });
        setPreviewImg(u.imagem ?? '');
      })
      .catch((e) => setAlert({ type: 'error', message: (e as Error).message }))
      .finally(() => setLoading(false));
  }, [id, reset]);

  useEffect(() => {
    if (imagemValue) setPreviewImg(imagemValue);
  }, [imagemValue]);

  const onSubmit = async (data: FormData) => {
    try {
      const payload: Partial<{ nome: string; email: string; senha: string; imagem: string }> = {
        nome: data.nome,
        email: data.email,
        imagem: data.imagem || undefined,
      };
      if (data.senha && data.senha.length >= 6) {
        payload.senha = data.senha;
      }

      const updated = await updateUsuario(id, payload);
      // Se o usuário ativo foi editado, atualiza o contexto
      if (activeUser?._id === id) setUser(updated);

      setAlert({ type: 'success', message: 'Usuário atualizado com sucesso!' });
      setTimeout(() => router.push('/gerenciar/usuarios'), 900);
    } catch (e) {
      setAlert({ type: 'error', message: (e as Error).message });
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href="/gerenciar/usuarios"
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
        >
          ← Voltar para usuários
        </Link>
      </div>

      <div className="ifood-card p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Editar usuário</h1>

        {/* Preview do avatar */}
        <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
          {previewImg ? (
            <img
              src={previewImg}
              alt="Preview"
              className="w-16 h-16 rounded-full object-cover border-2 border-[rgb(255,79,1)]"
              onError={() => setPreviewImg('')}
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-[rgb(255,235,229)] flex items-center justify-center border-2 border-dashed border-[rgb(255,79,1)]">
              <span className="text-[rgb(255,79,1)] text-2xl font-bold">?</span>
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-gray-700">Preview do avatar</p>
            <p className="text-xs text-gray-400">Cole uma URL de imagem abaixo</p>
          </div>
        </div>

        {alert && (
          <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Nome"
            {...register('nome')}
            error={errors.nome?.message}
            placeholder="Nome completo"
          />

          <Input
            label="E-mail"
            type="email"
            {...register('email')}
            error={errors.email?.message}
            placeholder="email@exemplo.com"
          />

          <Input
            label="URL da foto (opcional)"
            {...register('imagem')}
            error={errors.imagem?.message}
            placeholder="https://exemplo.com/foto.jpg"
          />

          <div className="border-t border-gray-100 pt-4">
            <p className="text-xs text-gray-400 mb-3">
              Deixe em branco para manter a senha atual
            </p>
            <Input
              label="Nova senha (opcional)"
              type="password"
              {...register('senha')}
              error={errors.senha?.message}
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="submit" loading={isSubmitting}>
              Salvar alterações
            </Button>
            <Link href="/gerenciar/usuarios">
              <Button type="button" variant="secondary">
                Cancelar
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
