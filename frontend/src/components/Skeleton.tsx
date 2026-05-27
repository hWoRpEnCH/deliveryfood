export function RestaurantSkeleton() {
  return (
    <div className="ifood-card overflow-hidden animate-pulse">
      <div className="aspect-[16/9] bg-gray-200" />
      <div className="p-4">
        <div className="h-5 w-3/4 bg-gray-200 rounded mb-2" />
        <div className="h-3 w-1/2 bg-gray-200 rounded mb-3" />
        <div className="flex justify-between">
          <div className="h-4 w-16 bg-gray-200 rounded" />
          <div className="h-4 w-16 bg-gray-200 rounded" />
        </div>
        <div className="h-3 w-2/3 bg-gray-200 rounded mt-3" />
      </div>
    </div>
  );
}

export function MenuItemSkeleton() {
  return (
    <div className="ifood-card overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-gray-200" />
      <div className="p-4">
        <div className="h-3 w-16 bg-gray-200 rounded mb-1" />
        <div className="h-5 w-3/4 bg-gray-200 rounded mb-2" />
        <div className="h-3 w-full bg-gray-200 rounded mb-3" />
        <div className="flex justify-between items-center">
          <div className="h-6 w-16 bg-gray-200 rounded" />
          <div className="h-8 w-24 bg-gray-200 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function OrderSkeleton() {
  return (
    <div className="ifood-card animate-pulse">
      <div className="flex">
        <div className="w-32 h-24 bg-gray-200" />
        <div className="flex-1 p-4">
          <div className="h-5 w-1/2 bg-gray-200 rounded mb-2" />
          <div className="h-3 w-1/4 bg-gray-200 rounded mb-3" />
          <div className="space-y-1">
            <div className="h-3 w-1/3 bg-gray-200 rounded" />
            <div className="h-3 w-1/4 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
