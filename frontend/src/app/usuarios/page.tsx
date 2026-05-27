'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useUser } from '@/contexts/UserContext';
import { createUsuario, getUsuarios } from '@/services/usuarios';
import type { Usuario } from '@/types';

const schema = z.object({
  nome: z.string().min(2, 'Nome obrigatório'),
  email: z.string().email('E-mail inválido'),
  senha: z.string().min(6, 'Mínimo 6 caracteres'),
});

type FormData = z.infer<typeof schema>;

export default function UsuariosPage() {
  const { user, setUser } = useUser();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const load = async () => {
    setLoading(true);
    try {
      const res = await getUsuarios({ limit: 50 });
      setUsuarios(res.data);
    } catch (e) {
      setAlert({ type: 'error', message: (e as Error).message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleSelectUser = (usuario: Usuario) => {
    setUser(usuario);
    setAlert({ type: 'success', message: `Usuário ativo: ${usuario.nome}` });
  };

  const onSubmit = async (data: FormData) => {
    try {
      const novo = await createUsuario(data);
      setAlert({ type: 'success', message: `Usuário ${novo.nome} cadastrado!` });
      reset();
      setUser(novo);
      await load();
    } catch (e) {
      setAlert({ type: 'error', message: (e as Error).message });
    }
  };

  const favoritosCount = (u: Usuario) =>
    Array.isArray(u.restaurantes_favoritos) ? u.restaurantes_favoritos.length : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Conta</h1>
          <p className="text-gray-500 mt-1">Cadastre usuários e escolha quem está fazendo o pedido</p>
        </div>
        <div className="flex flex-wrap gap-3 text-sm">
          <Link href="/usuarios/favoritos" className="font-semibold text-[rgb(255,79,1)] hover:underline">
            Ver favoritos →
          </Link>
          <Link href="/gerenciar/usuarios" className="font-semibold text-gray-700 hover:underline">
            Gerenciar usuários →
          </Link>
          <Link href="/gerenciar/restaurantes" className="font-semibold text-gray-700 hover:underline">
            Gerenciar restaurantes →
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="ifood-card p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Cadastro de usuário</h2>
          {alert && (
            <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input label="Nome" {...register('nome')} error={errors.nome?.message} />
            <Input label="E-mail" type="email" {...register('email')} error={errors.email?.message} />
            <Input label="Senha" type="password" {...register('senha')} error={errors.senha?.message} />
            <Button type="submit" loading={isSubmitting}>Cadastrar</Button>
          </form>
          <p className="mt-4 text-sm text-gray-500">Seed: fulanoes@email.com / senha 123456</p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Usuários cadastrados</h2>
          {user && (
            <p className="text-sm text-[rgb(255,79,1)] font-medium mb-4">
              Ativo: {user.nome} ({user.email})
            </p>
          )}
          {loading ? (
            <LoadingSpinner />
          ) : usuarios.length === 0 ? (
            <p className="text-gray-500">Nenhum usuário cadastrado.</p>
          ) : (
            <div className="space-y-2">
              {usuarios.map((u) => (
                <Card
                  key={u._id}
                  className={
                    user?._id === u._id
                      ? 'ring-2 ring-[rgb(255,79,1)] cursor-default'
                      : 'cursor-pointer hover:shadow-md transition-shadow'
                  }
                  onClick={() => handleSelectUser(u)}
                >
                  <div className="flex items-center gap-3">
                    {u.imagem ? (
                      <img
                        src={u.imagem}
                        alt={u.nome}
                        className="w-10 h-10 rounded-full object-cover border border-gray-200 flex-shrink-0"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[rgb(255,235,229)] flex items-center justify-center flex-shrink-0">
                        <span className="text-[rgb(255,79,1)] font-bold">
                          {u.nome.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900">{u.nome}</p>
                      <p className="text-sm text-gray-500">{u.email}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{favoritosCount(u)} favorito(s)</p>
                      {user?._id === u._id && (
                        <span className="inline-block mt-1 text-xs font-medium text-[rgb(255,79,1)]">
                          Usuário selecionado
                        </span>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
