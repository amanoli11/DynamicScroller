import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react"
import { InView } from "react-intersection-observer";

interface Section {
  type: "Vertical" | "Horizontal",
  data: any[];
}

const getSectionName = (num: number): "Vertical" | "Horizontal" => {
  // Creating a seperate function to get the name because i may implement dynamic logic in future.
  // Just following Seperation Of Concern pattern.

  // if (num >= 1 && num <= 20) return 'Vertical';
  if (num > 20 && num <= 30) return 'Horizontal';
  // if (num > 30 && num <= 50) return 'Vertical';
  return "Vertical";
}


const DynamicScroller = () => {

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['dynamicData'],
    queryFn: async ({ pageParam = 1 }) => {
      if (pageParam > 50) throw new Error('End'); // or return null
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${pageParam}`
      );
      if (!response.ok) throw new Error('Fetch error');
      const post = await response.json();

      return {
        post,
        next: pageParam < 50 ? pageParam + 1 : undefined
      };
    },
    initialPageParam: 1,
    getNextPageParam: (_lastPage, _allPages, lastPageParam) => {
      return lastPageParam + 1
    },
    maxPages: 50
  })

  const pages = data?.pages ?? [];
  const posts = pages.map(p => p.post);

  const sections = posts.reduce<Section[]>((acc, post) => {
    const sectionName = getSectionName(post.id);
    const last = acc.at(-1);
    if (last?.type === sectionName) {
      last.data.push(post);
    } else {
      acc.push({ type: sectionName, data: [post] });
    }
    return acc;
  }, []);


  useEffect(() => {
    if (hasNextPage && !isFetchingNextPage) {
      if ([20, 30, 50].includes(data?.pages.length ?? 0)) return;
      const timer = setTimeout(fetchNextPage, 500);
      return () => clearTimeout(timer);
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">

        <div className="text-center mb-8 space-y-4">
          <h1 className="text-4xl font-bold text-gray-800">
            Dynamic API Data Scroller with TanStack Query
          </h1>
        </div>

        {/* Now here is the content part */}
        <div
          className="w-full h-[80vh] overflow-auto bg-white rounded-2xl shadow-2xl p-6 border border-gray-200"
        >
          {sections.map((section) => (
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className={`px-4 py-2 rounded-full text-sm font-semibold ${section.type === 'Vertical'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-purple-100 text-purple-700'
                  }`}>
                  {section.type === 'Vertical' ? 'Vertical' : 'Horizontal'} Section
                </div>
              </div>

              {section.type === 'Vertical' ? (
                <div className="space-y-4">
                  {section.data.map((item, index) => (
                    <div
                      key={item.id}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-md p-6 transform transition-all duration-300 hover:scale-102 animate-fade-in"
                      style={{ animationDelay: `${index * 500}ms` }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <span className="text-2xl font-bold">#{item.id}</span>
                        <span className="text-sm bg-blue-400 px-2 py-1 rounded">User {item.userId}</span>
                      </div>
                      <h3 className="text-lg font-semibold mb-2 capitalize">{item.title}</h3>
                      <p className="text-blue-100 text-sm leading-relaxed">{item.body}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto pb-4">
                  <div className="flex gap-4 min-w-max">
                    {section.data.map((item, index) => (
                      <div
                        key={item.id}
                        className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg shadow-md p-4 w-64 flex-shrink-0 transform transition-all duration-300 hover:scale-105 animate-fade-in"
                        style={{ animationDelay: `${index * 500}ms` }}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xl font-bold">#{item.id}</span>
                          <span className="text-xs bg-purple-400 px-2 py-1 rounded">User {item.userId}</span>
                        </div>
                        <h4 className="text-sm font-semibold mb-2 capitalize line-clamp-2">{item.title}</h4>
                        <p className="text-purple-100 text-xs leading-relaxed line-clamp-3">{item.body}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {
            [20, 30, 50].includes(data?.pages.length ?? 0) &&
            <InView as="div" onChange={(inView) => {
              if (inView) {
                // Just settime 2second timeout so that the loader becomes visible
                setTimeout(() => {
                  fetchNextPage();
                }, 2000);
              }
            }}>
              <div className="text-center">
                {data?.pages.length !== 50 && <div className="w-6 h-6 border-3 border-gray-300 border-t-indigo-500 rounded-full animate-spin mx-auto mb-2"></div>}
                <p className="text-sm">
                  {
                    data?.pages.length === 50
                      ? "All data has been loaded"
                      : "Loading data from API..."
                  }
                </p>
              </div>
            </InView>
          }
        </div>

        {/* Footer */}
        <div className="mt-1 text-center text-sm text-gray-500">
          <p>Data fetched from JSONPlaceholder API • TanStack Query caching • 2-second loader • 500ms render interval</p>
        </div>

      </div>
    </div>
  )
}

export default DynamicScroller