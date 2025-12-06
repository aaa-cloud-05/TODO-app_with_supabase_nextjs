# Tidy - 認証付きフルスタックTodoアプリ
React / Next.js (App Router) / TypeScript / Zustand / Tailwind CSS / shadcn/ui / Supabase (Postgres + Auth + RLS) / Vercel 

## 概要

Tidyは、モダンなフルスタック開発のベストプラクティスを学ぶために作った実践的なTODOアプリケーションです。

単なるCRUDではなく、認証、永続化、状態管理、UX最適化(楽観的更新やスケルトン表示など) を取り入れ、ローカルでのオフラインライクな利用と、ログイン後のDB同期の両方を提供します。

* Google OAuth に対応したSupabase認証

* ユーザーごとのデータ分離 (Row Level Security)

* 未ログイン時はlocalStorage、ログイン後はSupabase DBに同期

* Optimistic UI / Skeleton / 多重API呼び出し防止などのUX最適化

* Next.js App Router / Route Handlers を用いたAPI層

## デモ
https://todo-app-with-supabase-nextjs-beta.vercel.app

Googleアカウントが無くても操作が可能です(未ログイン時はlocalStorageに保存されます)。

<!-- ### スクリーンショット -->

## 特徴

* Next.js App Router を用いたクライアント/サーバー間の分離

* shadcn/ui を活用したモダンなUI

* カラーテーマ対応

* レスポンシブデザイン

* Optimistic UI

* APIの多重呼び出しを防ぐローディング制御

* 未ログイン時のlocalStorage保存と、ログイン時の一括マージ(/api/todos/bulk-insert)

* Supabase Auth + RLSによるユーザーごとのDB分離

* Vercelによるデプロイ

## 動機
実務で求められる Web アプリケーションの構成（認証・永続化・API・DB・デプロイ）を、一通り実装できるようになることを目的とした。

フロント,バックエンド,DB まで一貫したデータフローの理解を重視した。

また、一般的なチュートリアルの Todo アプリはクライアント完結であり、
認証・永続化・RLS・端末間同期など、実務に必要な要素が欠けているため、段階的に以下のステップで現実的な構成へ拡張した。

1. フロントのみで完結するTODOアプリ

2. localStorageによる永続化

3. Supabaseによる永続化 (端末間共有)

4. Supabase Auth + RLS によるユーザー単位の分離

5. 未ログイン時でもアプリケーションを使用できるようにし、ログイン後にDBと同期

動くだけのものではなく、実際にリリースできる構成と意図のある設計を意識したプロダクトを目指した。

## 技術スタック
### Frontend

| 技術 | バージョン |
| ------------ | ---------- |
| React                | 19.1.0   |
| Next.js / App Router  | 16.0.7   |
| TypeScript          | 5.9.3    |
| Zustand | 11.5.2 |
| shadcn/ui | 3.5.0 |
| Tailwind CSS        | 4.1.17   |
| lucide-react         | 0.548.0  |

### Backend / Hosting
* Supabase (Postgres / Auth / RLS)

* Vercel (Hosting / Deploy)

## 主な技術の選定理由
* **Next.js**
API Routes と App Router により、フロントとサーバーを同一プロジェクトで構築でき、フルスタック全体の流れを理解しやすいため。

* **shadcn/ui**
UI構築に時間を使いすぎず、必要なデザインとアクセシビリティを実現できるため。

* **Zustand**
認証状態をグローバルで一元管理し、コンポーネント間での多重呼び出しや不整合を防ぐため。

* **Supabase**
DB + Auth + RLS が統合された環境で、学習コストを抑えてフルスタック開発の全体像を掴めるため。

* **Vercel**
Next.jsと親和性が高く、デプロイが簡単に行えるため。完成系を提供しやすい。


## アーキテクチャ
```
┌─────────────────────────────────────────────────┐
│  Client (Next.js App Router)                    │
│  ├─ React Components (shadcn/ui)                │
│  ├─ Zustand Global State                        │
│  └─ Optimistic UI                               │
└──────────────┬──────────────────────────────────┘
               │ HTTP Fetch
               ↓
┌─────────────────────────────────────────────────┐
│  Next.js API Routes                             │
│  ├─ /api/todos (CRUD)                           │
│  └─ /auth/callback (OAuth)                      │
└──────────────┬──────────────────────────────────┘
               │ Supabase
               ↓
┌─────────────────────────────────────────────────┐
│  Supabase Backend                               │
│  ├─ PostgreSQL Database                         │
│  ├─ Auth (Google OAuth)                         │
│  └─ Row Level Security (RLS)                    │
└─────────────────────────────────────────────────┘
```

### 主要ディレクトリ

```
├── app
    ├── (main)
    │   ├── layout.tsx                             ##共通レイアウト
    │   ├── page.tsx                               ##/ページ
    │   └── todo
    │   │   └── page.tsx                           ##/todoページ
    ├── account
    │   └── page.tsx                               ##アカウントページ
    ├── api
    │   └── todos
    │   │   ├── bulk-insert
    │   │       └── route.ts                       ##一括挿入
    │   │   └── route.ts                           ##CRUD API
    ├── auth
    │   └── callback
    │   │   └── page.tsx                           ##GoogleOAuthコールバック
    ├── globals.css                                ##カラーテーマ定義
    └── layout.tsx                                 
├── components
    ├── AuthInitializer.tsx                        ##認証ストア初期化
    ├── Header.tsx                                 ##ヘッダー
    ├── Listview.tsx
    ├── Themebutton.tsx
    ├── TodoSkeleton.tsx                           ##Skeleton UI
    ├── app-sidebar.tsx
    ├── theme-provider.tsx
    └── ui                                         ##shadcn/ui
        └── ...
├── hooks
    └── useTodos.ts                                ##Todo用カスタムフック
├── lib
    ├── supabase.ts                    
    └── utils.ts
└── stores
    └── useAuthStore.ts                            ##認証 + localStorageのマージ

```

### 状態遷移
```
[未ログイン状態]
ユーザーのCRUD操作
   ↓
localStorage に保存
   ↓
[ログイン実行]
Google OAuth → Supabase Auth
   ↓
既存のlocalStorage データを読み取り
   ↓
POST /api/todos/bulk-insert (データの一括挿入)
   ↓
Supabase DBに永続化 + localStorage 削除
[ログイン状態]
ユーザーのCRUD操作
   ↓
CRUD /api/todos
```

## データベース
### テーブル定義
```postgres
CREATE TABLE todos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  taskname TEXT NOT NULL,
  done BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now();
)
```

### RLSポリシー
```postgres
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own todos"
ON todos
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own todos"
ON todos
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own todos"
ON todos
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own todos"
ON todos
FOR DELETE
USING (auth.uid() = user_id);
```

## クイックスタート

省略

## ライセンス

MIT License

## 反省点・今後の展望

* ブランチ戦略を使わずに開発をしたため、変更意図を追いづらくなった。
今後はブランチを作成して可読性の高い履歴を残す。

* 機能追加を繰り返す開発となり、途中で設計を見直す必要性が生じた。
今後は要件定義→設計→実装のプロセス(ウォーターフォールに近い工程)を取り入れ、データ構造・責務分離・API設計を予め整理したうえで開発する。
