// Mock Supabase client for demo - replace with real Supabase when you deploy
// For local testing, this uses localStorage

class MockSupabase {
  async auth() {
    return {
      signInWithPassword: async ({ email, password }: any) => {
        localStorage.setItem("user", JSON.stringify({ email, id: "demo-user" }));
        return { data: { user: { email, id: "demo-user" } }, error: null };
      },
      signUp: async ({ email, password }: any) => {
        localStorage.setItem("user", JSON.stringify({ email, id: "demo-user" }));
        return { data: { user: { email, id: "demo-user" } }, error: null };
      },
      signOut: async () => {
        localStorage.removeItem("user");
        return { error: null };
      },
      getSession: async () => {
        const user = localStorage.getItem("user");
        return { data: { session: user ? { user: JSON.parse(user) } : null } };
      },
    };
  }

  from(table: string) {
    return {
      select: (cols: string) => ({
        order: (col: string, options: any) => ({
          then: async (callback: any) => {
            const data = JSON.parse(localStorage.getItem(`${table}-data`) || "[]");
            return callback({
              data: data.sort((a: any, b: any) =>
                options.ascending ? a[col].localeCompare(b[col]) : b[col].localeCompare(a[col])
              ),
              error: null,
            });
          },
        }),
      }),
      insert: (obj: any) => ({
        then: async (callback: any) => {
          const data = JSON.parse(localStorage.getItem(`${table}-data`) || "[]");
          data.push({ ...obj, id: Math.random().toString(36) });
          localStorage.setItem(`${table}-data`, JSON.stringify(data));
          return callback({ error: null });
        },
      }),
      delete: () => ({
        eq: (col: string, val: any) => ({
          then: async (callback: any) => {
            const data = JSON.parse(localStorage.getItem(`${table}-data`) || "[]");
            const filtered = data.filter((item: any) => item[col] !== val);
            localStorage.setItem(`${table}-data`, JSON.stringify(filtered));
            return callback({ error: null });
          },
        }),
      }),
      update: (obj: any) => ({
        eq: (col: string, val: any) => ({
          then: async (callback: any) => {
            const data = JSON.parse(localStorage.getItem(`${table}-data`) || "[]");
            const updated = data.map((item: any) =>
              item[col] === val ? { ...item, ...obj } : item
            );
            localStorage.setItem(`${table}-data`, JSON.stringify(updated));
            return callback({ error: null });
          },
        }),
      }),
    };
  }
}

export const supabase = {
  auth: new MockSupabase().auth(),
  from: (table: string) => new MockSupabase().from(table),
};
