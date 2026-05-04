# Floxis

[English Version](#floxis-en)

Floxis は、生活・仕事・学習のタスクを分断せず、ユーザー自身のタスクを1つの空間で管理するためのWebアプリケーションです。

現在は v0.1 として、タスク管理の基本構造、認証、ユーザー別データ管理の土台を開発中です。

## 概要

Floxis は、自然言語で書き出したタスクやアイデアを、実行可能なタスク管理構造に整理することを目的とした個人開発プロジェクトです。

v0.1 では、まずタスク管理の基本機能に絞って実装しています。

- タスク一覧表示
- タスク詳細表示
- タスク作成
- タスク編集
- ステータスに基づくタスク管理
- 認証ユーザーごとのデータ分離

## 使用技術

- Next.js
- TypeScript
- Supabase
- Supabase Auth
- Row Level Security（RLS）

## 実装済み機能

- タスク一覧 / 詳細 / 作成 / 編集画面
- ステータスに基づくタスク管理
- Supabase Auth によるログイン
- `owner_id` によるユーザー別データ設計
- 認証ユーザーに紐づくタスク作成・更新処理
- RLS によるユーザー別アクセス制御

## アプリケーション構成

Next.js App Router を使用し、画面、UIコンポーネント、データアクセス層の責務を分離しています。

```txt
/app
  /login
    page.tsx
  /tasks
    page.tsx
    /new
      page.tsx
    /[id]
      page.tsx
      /edit
        page.tsx

/components
  /tasks
    task-list-content.tsx
    task-detail-content.tsx
    task-form.tsx

/lib
  /auth
    get-current-user.ts
  /supabase
    client.ts
    server.ts
  /tasks
    queries.ts
    mutations.ts
    actions.ts

/types
  task.ts
```

責務の分離は以下の方針です。

- app/：ルーティング、Server Component、データ取得、画面単位の状態分岐
- components/：UI 表示
- lib/：データ取得、更新処理、認証ヘルパー、Server Actions
- types/：TypeScript 型定義

## データモデル

現在のデータモデルは、以下の5テーブルを中心に構成しています。

- tasks
- statuses
- categories
- projects
- task_status_logs

すべてのテーブルに `owner_id` を持たせ、認証ユーザー単位でデータを分離する設計にしています。

## 実装上のポイント

### データ取得・更新処理の分離

タスク関連の処理は、取得処理を `queries.ts`、作成・更新処理を `mutations.ts`、Server Actions を `actions.ts` に分けて実装しています。

画面表示とデータ操作の責務を分離し、UI コンポーネントが DB 操作の詳細を直接持たない構成にしています。

### アプリケーション層と DB 層によるユーザー別アクセス制御

Floxis では、アプリケーション側のクエリで `owner_id` を指定し、現在ログイン中のユーザーに紐づくデータのみ取得・更新するようにしています。

```ts
const { data, error } = await supabase
  .from("tasks")
  .select(...)
  .eq("owner_id", user.id)
  .order("created_at", { ascending: false });
```

加えて、Supabase の RLS でも `owner_id = auth.uid()` を条件にしたポリシーを設定し、DB 側でもユーザー自身のデータのみ操作できるようにしています。

```sql
create policy "Users can manage own tasks"
on public.tasks
for all
using (owner_id = auth.uid())
with check (owner_id = auth.uid());
```

これにより、アプリケーション層と DB 層の両方で、ユーザー別のデータ分離とアクセス制御を行っています。

### 結合データの正規化

Supabase のリレーション取得結果は、TypeScript 上で単体オブジェクトまたは配列として扱われる場合があります。

そのため、UI に渡す前に結合データを正規化しています。

```ts
function normalizeJoinedOne<T>(value: T | T[] | null | undefined): T | null {
  return Array.isArray(value) ? (value[0] ?? null) : (value ?? null);
}
```

これにより、UI コンポーネント側でデータ形状の揺れを意識しなくてよい構成にしています。

## 今後の実装予定

- [ ] ステータス管理画面の拡充
- [ ] カテゴリ管理機能
- [ ] プロジェクト管理機能
- [ ] UI / UX の改善
- [ ] 未ログイン時の画面制御改善

---

# Floxis EN

[Back to Japanese Version](#floxis)

Floxis is a web application for managing personal tasks across life, work, and learning in one unified workspace.

The project is currently in v0.1, focusing on building the foundation for task management, authentication, and user-scoped data management.

## Overview

Floxis is a personal development project designed to organize tasks and ideas written in natural language into an executable task management structure.

In v0.1, the implementation focuses on the core features of task management.

- Task list
- Task detail
- Task creation
- Task editing
- Status-based task management
- Authenticated user-based data separation

## Tech Stack

- Next.js
- TypeScript
- Supabase
- Supabase Auth
- Row Level Security (RLS)

## Implemented Features

- Task list / detail / create / edit pages
- Status-based task management
- Login with Supabase Auth
- User-scoped data design using `owner_id`
- Task creation and update processes linked to the authenticated user
- User-based access control using RLS

## Application Structure

Floxis uses the Next.js App Router and separates responsibilities between pages, UI components, and the data access layer.

```txt
/app
  /login
    page.tsx
  /tasks
    page.tsx
    /new
      page.tsx
    /[id]
      page.tsx
      /edit
        page.tsx

/components
  /tasks
    task-list-content.tsx
    task-detail-content.tsx
    task-form.tsx

/lib
  /auth
    get-current-user.ts
  /supabase
    client.ts
    server.ts
  /tasks
    queries.ts
    mutations.ts
    actions.ts

/types
  task.ts
```

The responsibilities are separated as follows.

- app/: routing, Server Components, data fetching, and page-level state handling
- components/: UI rendering
- lib/: data fetching, update logic, authentication helpers, and Server Actions
- types/: TypeScript type definitions

## Data Model

The current data model is centered around the following five tables.

- tasks
- statuses
- categories
- projects
- task_status_logs

All tables include an `owner_id` column to separate data by authenticated user.

## Implementation Highlights

### Separation of Data Fetching and Update Logic

Task-related logic is separated into `queries.ts` for data fetching, `mutations.ts` for create and update operations, and `actions.ts` for Server Actions.

This keeps the responsibilities of UI rendering and data operations separate, so UI components do not directly handle the details of DB operations.

### User-Based Access Control at Both the Application and DB Layers

In Floxis, application-level queries use `owner_id` to fetch and update only the data associated with the currently logged-in user.

```ts
const { data, error } = await supabase
  .from("tasks")
  .select(...)
  .eq("owner_id", user.id)
  .order("created_at", { ascending: false });
```

In addition, Supabase RLS policies use `owner_id = auth.uid()` so that users can operate only on their own data at the DB layer as well.

```sql
create policy "Users can manage own tasks"
on public.tasks
for all
using (owner_id = auth.uid())
with check (owner_id = auth.uid());
```

This provides user-based data separation and access control at both the application layer and the DB layer.

### Normalizing Joined Data

Supabase relation query results may be treated as either a single object or an array in TypeScript.

To keep the UI layer simple, joined data is normalized before being passed to UI components.

```ts
function normalizeJoinedOne<T>(value: T | T[] | null | undefined): T | null {
  return Array.isArray(value) ? (value[0] ?? null) : (value ?? null);
}
```

This allows UI components to avoid handling inconsistent data shapes directly.

## Roadmap

- [ ] Expand status management screens
- [ ] Add category management
- [ ] Add project management
- [ ] Improve UI / UX
- [ ] Improve screen handling for unauthenticated users
