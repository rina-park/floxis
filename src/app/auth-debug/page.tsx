import { getCurrentUser } from "@/lib/auth/get-current-user";

export default async function AuthDebugPage() {
  const user = await getCurrentUser();

  return (
    <main>
      <h1>Auth Debug</h1>

      {user ? (
        <pre>{JSON.stringify({ id: user.id, email: user.email }, null, 2)}</pre>
      ) : (
        <p>Not signed in</p>
      )}
    </main>
  );
}
