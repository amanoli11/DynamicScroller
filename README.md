# OVERVIEW
This is a react application
I have used Tailwind, React router, Tanstack query and react-intersection-observer libraries in this project
In the DynamicScroller component i have not used useInfiniteQuery hook form tanstack query and useEffect.
I have used jsonplaceholder for demo API.
The API call is set using setInterval for 500ms. As per requirement when the element is rendered to 20 the API call stops.
That is where the react-intersection-observer helps. After scrolling to bottom of the page the API is called again till 30th element is     rendered.
Then again you have to scroll to bottom of the page then it renders till 50th element and shows message that all elements have been loaded.


# Instructions on how to run your code
Just clone the repository
pnpm install
pnpm run dev

# Any assumptions or limitations
There are lots of limitations
There is no error handling. Only page not found is created. No error handling is done for API call failure.
Global state managers have not been used
Authentication is missing
I only had about 3hours to work in this task that's why some required requirements are missing.