@@ .. @@
-import { QueryClient, QueryFunction } from "@tanstack/react-query";
-
-async function throwIfResNotOk(res: Response) {
-  if (!res.ok) {
-    const text = (await res.text()) || res.statusText;
-    throw new Error(`${res.status}: ${text}`);
-  }
-}
-
-export async function apiRequest(
-  method: string,
-  url: string,
-  data?: unknown | undefined,
-): Promise<Response> {
-  const headers: Record<string, string> = {};
-  
-  if (data) {
-    headers["Content-Type"] = "application/json";
-  }
-  
-  // Add session ID if available
-  const sessionId = localStorage.getItem("sessionId");
-  if (sessionId) {
-    headers["x-session-id"] = sessionId;
-  }
-  
-  const res = await fetch(url, {
-    method,
-    headers,
-    body: data ? JSON.stringify(data) : undefined,
-    credentials: "include",
-  });
-
-  await throwIfResNotOk(res);
-  return res;
-}
-
-type UnauthorizedBehavior = "returnNull" | "throw";
-export const getQueryFn: <T>(options: {
-  on401: UnauthorizedBehavior;
-}) => QueryFunction<T> =
-  ({ on401: unauthorizedBehavior }) =>
-  async ({ queryKey }) => {
-    const headers: Record<string, string> = {};
-    
-    // Add session ID if available
-    const sessionId = localStorage.getItem("sessionId");
-    if (sessionId) {
-      headers["x-session-id"] = sessionId;
-    }
-    
-    const res = await fetch(queryKey[0] as string, {
-      credentials: "include",
-      headers,
-    });
-
-    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
-      return null;
-    }
-
-    await throwIfResNotOk(res);
-    return await res.json();
-  };
+import { QueryClient } from "@tanstack/react-query";
 
 export const queryClient = new QueryClient({
   defaultOptions: {
     queries: {
-      queryFn: getQueryFn({ on401: "throw" }),
+      queryFn: async ({ queryKey }) => {
+        // Mock data for demo purposes
+        const endpoint = queryKey[0] as string;
+        
+        if (endpoint === "/api/categories") {
+          return [
+            { id: 1, name: "Hair", slug: "hair", imageUrl: "https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=100&h=100" },
+            { id: 2, name: "Nails", slug: "nails", imageUrl: "https://images.pexels.com/photos/1319460/pexels-photo-1319460.jpeg?auto=compress&cs=tinysrgb&w=100&h=100" },
+            { id: 3, name: "Lash", slug: "lash", imageUrl: "https://images.pexels.com/photos/5069432/pexels-photo-5069432.jpeg?auto=compress&cs=tinysrgb&w=100&h=100" },
+            { id: 4, name: "Body", slug: "body", imageUrl: "https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg?auto=compress&cs=tinysrgb&w=100&h=100" },
+            { id: 5, name: "Tattoo", slug: "tattoo", imageUrl: "https://images.pexels.com/photos/1319460/pexels-photo-1319460.jpeg?auto=compress&cs=tinysrgb&w=100&h=100" },
+            { id: 6, name: "Makeup", slug: "makeup", imageUrl: "https://images.pexels.com/photos/2113855/pexels-photo-2113855.jpeg?auto=compress&cs=tinysrgb&w=100&h=100" },
+            { id: 7, name: "Waxing", slug: "waxing", imageUrl: "https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg?auto=compress&cs=tinysrgb&w=100&h=100" },
+            { id: 8, name: "Barber", slug: "barber", imageUrl: "https://images.pexels.com/photos/1319460/pexels-photo-1319460.jpeg?auto=compress&cs=tinysrgb&w=100&h=100" },
+          ];
+        }
+        
+        if (endpoint === "/api/providers?topRated=true&limit=4") {
+          return [
+            { id: 1, name: "Crowned Beauty", businessName: "Crowned Beauty Studio", location: "Westminster, London", country: "UK", localGovernment: "Westminster", imageUrl: null, rating: "4.9", reviewCount: 127, startingPrice: "45.00", categoryId: 1, specialties: ["Hair Styling", "Color"], verified: true },
+            { id: 2, name: "The Tail Bandit", businessName: "The Tail Bandit", location: "Leeds, UK", country: "UK", localGovernment: "Leeds", imageUrl: null, rating: "4.8", reviewCount: 89, startingPrice: "35.00", categoryId: 1, specialties: ["Ponytails", "Sew Ins", "Quick Weaves"], verified: true },
+            { id: 3, name: "ITSMBEAUTY", businessName: "ITSMBEAUTY", location: "Chelmsford, UK", country: "UK", localGovernment: "Chelmsford", imageUrl: null, rating: "4.7", reviewCount: 156, startingPrice: "25.00", categoryId: 6, specialties: ["Makeup", "Bridal"], verified: true },
+            { id: 4, name: "KDHAIR", businessName: "KDHAIR Studio", location: "Newcastle, UK", country: "UK", localGovernment: "Newcastle", imageUrl: null, rating: "4.9", reviewCount: 203, startingPrice: "40.00", categoryId: 1, specialties: ["Hair Extensions", "Styling"], verified: true },
+          ];
+        }
+        
+        if (endpoint === "/api/services?trending=true&limit=4") {
+          return [
+            { id: 1, name: "Silk Press & Style", description: "Professional silk press with styling", price: "65.00", duration: 120, imageUrl: "https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=400&h=300", providerId: 1, categoryId: 1, trending: true },
+            { id: 2, name: "Gel Manicure", description: "Long-lasting gel manicure", price: "35.00", duration: 60, imageUrl: "https://images.pexels.com/photos/1319460/pexels-photo-1319460.jpeg?auto=compress&cs=tinysrgb&w=400&h=300", providerId: 2, categoryId: 2, trending: true },
+            { id: 3, name: "Classic Lash Extensions", description: "Natural-looking lash extensions", price: "80.00", duration: 90, imageUrl: "https://images.pexels.com/photos/5069432/pexels-photo-5069432.jpeg?auto=compress&cs=tinysrgb&w=400&h=300", providerId: 3, categoryId: 3, trending: true },
+            { id: 4, name: "Bridal Makeup", description: "Complete bridal makeup package", price: "120.00", duration: 180, imageUrl: "https://images.pexels.com/photos/2113855/pexels-photo-2113855.jpeg?auto=compress&cs=tinysrgb&w=400&h=300", providerId: 4, categoryId: 6, trending: true },
+          ];
+        }
+        
+        // Return empty array for other endpoints
+        return [];
+      },
       refetchInterval: false,
       refetchOnWindowFocus: false,
       staleTime: Infinity,
       retry: false,
     },
-    mutations: {
-      retry: false,
-    },
   },
 });