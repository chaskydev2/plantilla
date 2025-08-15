export const PersonalInformationMetaSkeleton = () => (
  <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 animate-pulse">
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
      <div className="w-full">
        <div className="h-6 bg-gray-200 rounded-full dark:bg-gray-700 w-1/3 mb-6"></div>
        
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
          {[...Array(7)].map((_, i) => (
            <div key={i}>
              <div className="h-3 bg-gray-200 rounded-full dark:bg-gray-700 w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded-full dark:bg-gray-600 w-full"></div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="h-10 bg-gray-200 rounded-lg dark:bg-gray-700 w-24 mt-4 lg:mt-0"></div>
    </div>
  </div>
);