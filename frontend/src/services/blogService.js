// Mock data
let blogs = [
  {
    id: 1,
    title: "React Hooks Guide",
    author: "John Doe",
    authorEmail: "john@example.com",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    rating: 4.5,
    dateCreated: "2024-03-15",
    categories: ["React", "Frontend"],
    description:
      "A comprehensive guide to understanding and mastering React Hooks in modern web development.",
    image:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    content: `
      <h2>Introduction to React Hooks</h2>
      <p>React Hooks are a powerful feature introduced in React 16.8 that allow you to use state and other React features without writing a class component.</p>
      
      <h2>Why Use Hooks?</h2>
      <p>Hooks solve several problems that developers face when using class components:</p>
      <ul>
        <li>It's hard to reuse stateful logic between components</li>
        <li>Complex components become hard to understand</li>
        <li>Classes confuse both people and machines</li>
      </ul>

      <h2>Common Hooks</h2>
      <h3>useState</h3>
      <p>The useState Hook lets you add state to functional components:</p>
      <pre>
        const [count, setCount] = useState(0);
      </pre>

      <h3>useEffect</h3>
      <p>The useEffect Hook lets you perform side effects in components:</p>
      <pre>
        useEffect(() => {
          document.title = \`Count: \${count}\`;
        }, [count]);
      </pre>
    `,
  },
  {
    id: 2,
    title: "Understanding Async/Await",
    author: "Jane Smith",
    authorEmail: "jane@example.com",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    rating: 4.8,
    dateCreated: "2024-02-28",
    categories: ["JavaScript", "Backend"],
    description:
      "Deep dive into asynchronous programming patterns in JavaScript using async/await syntax.",
    image:
      "https://images.unsplash.com/photo-1555066931-bf19f8e1083d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    content: `
      <h2>Understanding Async/Await</h2>
      <p>Async/await is a modern way to handle asynchronous operations in JavaScript. It makes asynchronous code look and behave more like synchronous code.</p>
      
      <h2>Basic Syntax</h2>
      <pre>
        async function fetchData() {
          try {
            const response = await fetch('https://api.example.com/data');
            const data = await response.json();
            return data;
          } catch (error) {
            console.error('Error:', error);
          }
        }
      </pre>
    `,
  },
];

// Simulate API delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const blogService = {
  // Get all blogs
  getAllBlogs: async () => {
    await delay(500);
    return blogs;
  },

  // Get a single blog by ID
  getBlogById: async (id) => {
    await delay(300);
    const blog = blogs.find((b) => b.id === parseInt(id));
    if (!blog) throw new Error("Content not found");
    return blog;
  },

  // Create a new blog
  createBlog: async (blogData) => {
    await delay(1000);
    const newBlog = {
      id: blogs.length + 1,
      dateCreated: new Date().toISOString(),
      rating: 0,
      ...blogData,
    };
    blogs.push(newBlog);
    return newBlog;
  },

  // Update an existing blog
  updateBlog: async (id, blogData) => {
    await delay(1000);
    const index = blogs.findIndex((b) => b.id === parseInt(id));
    if (index === -1) throw new Error("Content not found");

    blogs[index] = {
      ...blogs[index],
      ...blogData,
      dateCreated: blogs[index].dateCreated, // Preserve original date
    };
    return blogs[index];
  },

  // Delete a blog
  deleteBlog: async (id) => {
    await delay(500);
    const index = blogs.findIndex((b) => b.id === parseInt(id));
    if (index === -1) throw new Error("Content not found");

    blogs = blogs.filter((b) => b.id !== parseInt(id));
    return true;
  },
};
