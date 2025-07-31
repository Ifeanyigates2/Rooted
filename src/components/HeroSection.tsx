@@ .. @@
   const handleSearch = () => {
     if (!searchQuery.trim()) return;
-    
-    const params = new URLSearchParams({
-      type: searchType,
-      q: searchQuery.trim(),
-      ...(searchLocation && { location: searchLocation })
-    });
-    
-    setLocation(`/search?${params.toString()}`);
+    // Demo: Just show alert
+    alert(`Searching for ${searchType}: ${searchQuery} ${searchLocation ? `in ${searchLocation}` : ''}`);
   };
 
   return (