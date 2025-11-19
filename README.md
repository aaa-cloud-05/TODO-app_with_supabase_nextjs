# 認証付きフルスタックTODOアプリ
Next.js / TypeScript / Supabase / Tailwind / shadcn/ui / Vercel 

Google認証に対応し、ユーザーごとに異なるTODOリストを保持できる**フルスタックWebアプリケーション**です。

フロントエンドからバックエンド、データベース、デプロイまで、Web開発の基本構成を一通り実装した。

## デモ
https://todo-app-with-supabase-nextjs-beta.vercel.app

Googleアカウントでのログインは必須ですが、どなたでも利用できます。

## 目的
実際のWebアプリケーションで必要とされる基本機能を実装することを目的とした。

単なる動作だけではなく、**フロントエンドからバックエンドまで一貫したデータフローの理解**を重視した。

主な技術は以下の通り。

* Next.js / App Router を用いた fetcher / Route Handler の実装

* shadcn/ui を活用したモダンなUI構築とカラーテーマの実装

* 楽観的更新の実装

* CRUD操作 (frontend / API / DB) の実装 

* Supabaseを用いたテーブル設計とPostgreSQLの基本操作

* Google OAuthを用いたユーザー認証 (Supabase Auth)

* Row Level Security (RLS) によるユーザー単位のデータ分離

* Vercelを用いた本番環境へのデプロイ

* shadcn/uiを用いたモダンなUI構築

## 背景
多くのチュートリアルでのTODOアプリでは、フロント内で完結し、データの永続化やユーザー認証機能を備えていない。

そのため、実際のWebアプリケーションとは構成に乖離があると感じた。

そこで、本プロジェクトは、以下のように段階的に実践的な構成へと発展させた。

* フロント内で完結するTODOアプリ

* ローカルストレージによる永続化

* Supabase DBによる永続化 (端末間で共有可能)

* Supabase Auth / RLS によるユーザー単位でのデータ分離

開発過程で、公式ドキュメントと生成AIを活用し、理解を深めながら実装した。

## 技術スタック
### Frontend

| 言語など | バージョン  |
| ------------ | ---------- |
| React                | 19.1.0   |
| Next.js / App Router  | 15.5.6   |
| TypeScript          | 5.9.3    |
| shadcn/ui | 3.5.0 |
| Tailwind CSS        | 4.1.17   |
| lucide-react         | 0.548.0  |

### Backend
* Supabase (PostgreSQL / Authentication / RLS)

* Vercel (Hosting)

## 主な技術の選定理由
* **Next.js**
API Routesでフロントエンドとサーバーを同一プロジェクト内で扱えるため。

* **Supabase**
DB・Authが統合された環境で、学習コストを抑えてフルスタック開発の全体像を掴めるため。

* **Vercel**
Next.jsと親和性が高く、デプロイが簡単に行えるため。完成系を提供しやすい。


## アーキテクチャ
```
[Client (Next.js)] 
   ↓ fetch
[Next.js API Route (/api/todos)]
   ↓
[Supabase (Auth + DB)]
```

## データベース
### テーブル定義
```
CREATE TABLE todos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  taskname TEXT NOT NULL,
  done BOOLEAN DEFAULT false
)
```

### RLSポリシー
```
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

## 主要なディレクトリ

```
.
 └─ app
    ├── api/todos/route.ts  -Supabaseと通信するRoute Handler
    ├── auth/callback.tsx  -Google認証コールバック
    ├── globals.css -カラーテーマの定義
    └── login/page.tsx  -ログイン画面

 └─ components
    ├── ui/ -shadcn/uiのコンポーネント
    └── Todo.tsx - TODOリストのUIとfetcher

```

## 今後の展望
* ここで学習した技術を活用して、より複雑なアーキテクチャのアプリケーションを開発する。

* 動的ルーティングを中心とした、ネストしたディレクトリ構成でのAPI作成に取り組む。

* 段階的な機能追加を行う開発ではなく、一般的な開発手法に基づいて開発を行う。