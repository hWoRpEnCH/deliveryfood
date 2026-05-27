'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { deleteUsuario, getUsuarios } from '@/services/usuarios';
import { useUser } from '@/contexts/UserContext';
import type { Usuario } from '@/types';

export default function GerenciarUsuariosPage() {
  const { user: activeUser, setUser } = useUser();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getUsuarios({ limit: 100 });
      setUsuarios(res.data);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (u: Usuario) => {
    if (!confirm(`Excluir o usuário "${u.nome}"? Esta ação não pode ser desfeita.`)) return;
    try {
      await deleteUsuario(u._id);
      if (activeUser?._id === u._id) setUser(null);
      toast.success('Usuário excluído');
      await load();
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  const favoritosCount = (u: Usuario) =>
    Array.isArray(u.restaurantes_favoritos) ? u.restaurantes_favoritos.length : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gerenciar usuários</h1>
          <p className="text-sm text-gray-500 mt-1">{usuarios.length} usuário(s) cadastrado(s)</p>
        </div>
        <div className="flex gap-3">
          <Link href="/usuarios">
            <Button variant="secondary" type="button">← Voltar para Conta</Button>
          </Link>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : usuarios.length === 0 ? (
        <div className="ifood-card p-10 text-center text-gray-400">
          <p className="text-lg">Nenhum usuário cadastrado.</p>
          <p className="text-sm mt-1">Cadastre o primeiro na página de Conta.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {usuarios.map((u) => (
            <div
              key={u._id}
              className={`ifood-card p-4 flex flex-wrap items-center gap-4 ${
                activeUser?._id === u._id ? 'ring-2 ring-[rgb(255,79,1)]' : ''
              }`}
            >
              {/* Avatar */}
              <div className="flex-shrink-0">
                {u.imagem ? (
                  <img
                    src={u.imagem}
                    alt={u.nome}
                    className="w-12 h-12 rounded-full object-cover border border-gray-200"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '';
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[rgb(255,235,229)] flex items-center justify-center">
                    <span className="text-[rgb(255,79,1)] font-bold text-lg">
                      {u.nome.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-gray-900">{u.nome}</p>
                  {activeUser?._id === u._id && (
                    <span className="text-xs font-medium text-white bg-[rgb(255,79,1)] px-2 py-0.5 rounded-full">
                      Ativo
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500">{u.email}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {favoritosCount(u)} favorito(s)
                  {u.createdAt && (
                    <> · Criado em {new Date(u.createdAt).toLocaleDateString('pt-BR')}</>
                  )}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 flex-shrink-0">
                <Link href={`/gerenciar/usuarios/${u._id}/editar`}>
                  <Button variant="ghost" type="button" className="text-sm">
                    Editar
                  </Button>
                </Link>
                <Button
                  variant="danger"
                  type="button"
                  className="text-sm"
                  onClick={() => handleDelete(u)}
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
