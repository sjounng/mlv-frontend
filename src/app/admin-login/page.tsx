"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, ShieldCheck } from "lucide-react";
import { Button, Card, Input, useToast } from "@/components/ui";
import { api, setAccessToken, type TokenResponse, ApiError } from "@/lib/api";
import { siteConfig } from "@/lib/site-config";

export default function AdminLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      toast({ title: "아이디와 비밀번호를 입력해 주세요", variant: "warning" });
      return;
    }
    setLoading(true);
    try {
      const token = await api.post<TokenResponse>(
        "/api/admin/auth/login",
        { username: username.trim(), password },
        { skipAuthRetry: true },
      );
      setAccessToken(token.accessToken);
      router.replace("/admin");
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "로그인에 실패했습니다.";
      toast({ title: "로그인 실패", description: message, variant: "error" });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-surface-1">
      <div className="flex items-center gap-2.5 mb-8">
        <div className="w-9 h-9 rounded-md bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center">
          <ShieldCheck size={18} className="text-emerald-300" />
        </div>
        <div>
          <p className="text-sm font-bold text-white/90">{siteConfig.name} 관리자</p>
          <p className="text-xs text-white/35">운영 도구</p>
        </div>
      </div>

      <Card padding="lg" className="w-full max-w-sm">
        <h1 className="text-xl font-bold text-center">관리자 로그인</h1>
        <p className="mt-1.5 text-sm text-white/50 text-center">운영진 계정으로 로그인하세요.</p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <Input label="아이디" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" />
          <Input label="비밀번호" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
          <Button type="submit" className="w-full" disabled={loading} leftIcon={loading ? <Loader2 className="animate-spin" size={16} /> : undefined}>
            로그인
          </Button>
        </form>
      </Card>

      <Link href="/" className="mt-8 text-xs text-white/40 hover:text-white/70">← 사이트로 돌아가기</Link>
    </div>
  );
}
