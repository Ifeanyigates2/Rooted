import { useQuery } from "@tanstack/react-query";
import type { Category } from "@shared/schema";

export default function CategorySection() {
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[var(--rooted-primary)] text-center mb-12">Explore by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-200 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-[var(--rooted-primary)] text-center mb-12">Explore by Category</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
          {categories?.map((category) => (
            <div key={category.id} className="text-center group cursor-pointer category-hover">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow">
                <img 
                  src={category.imageUrl} 
                  alt={category.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-[var(--rooted-primary)] font-medium">{category.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
