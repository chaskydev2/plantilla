export const UserMetaSkeleton = () => (
  <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 animate-pulse">
    <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
      <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
        <div className="w-20 h-20 bg-gray-200 rounded-full dark:bg-gray-700"></div>
        
        <div className="order-3 xl:order-2 flex-1 space-y-3">
          <div className="h-6 bg-gray-200 rounded dark:bg-gray-700 w-3/4 mx-auto xl:mx-0"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-full"></div>
            <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-2/3"></div>
          </div>
        </div>
        
        <div className="order-2 xl:order-3">
          <div className="h-10 bg-gray-200 rounded-lg dark:bg-gray-700 w-32"></div>
        </div>
      </div>
    </div>
  </div>
);