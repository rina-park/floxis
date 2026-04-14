import { supabase } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

// --- Server Action: 追加 ---
async function createTask(formData: FormData) {
  'use server'

  const title = String(formData.get('title') || '').trim()
  if (!title) return

  const { error } = await supabase.from('tasks').insert({
    title,
    title_original: title,
    status: 'pending',
  })

  if (error) {
    console.error('insert error:', error)
    return
  }

  // 一覧を再取得させる
  revalidatePath('/')
}

// --- Page ---
export default async function Home() {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <main style={{ padding: 24, maxWidth: 640, margin: '0 auto' }}>
      <h1>Floxis</h1>

      {/* 追加フォーム */}
      <form action={createTask} style={{ marginBottom: 16 }}>
        <input
          name="title"
          placeholder="Enter a task"
          style={{ padding: 8, width: '70%', marginRight: 8 }}
        />
        <button type="submit">Add</button>
      </form>

      {/* 一覧 */}
      {error ? (
        <pre>{JSON.stringify(error, null, 2)}</pre>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {(data ?? []).map((task) => (
            <li
              key={task.id}
              style={{
                padding: '8px 0',
                borderBottom: '1px solid #eee',
              }}
            >
              {task.title}
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}