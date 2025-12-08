import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';// 代码高亮样式

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ 
  content, 
  className = "" 
}) => {
  return (
    <div className={`leading-relaxed text-gray-800 dark:text-gray-200 ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          // 自定义组件渲染
          h1: ({ children }) => (
            <h1 className="mt-6 mb-2 text-3xl md:text-2xl font-semibold leading-tight text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-1">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="mt-6 mb-2 text-2xl md:text-xl font-semibold leading-tight text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-1">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mt-6 mb-2 text-xl md:text-lg font-semibold leading-tight text-gray-900 dark:text-gray-100">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="mt-6 mb-2 text-lg md:text-base font-semibold leading-tight text-gray-900 dark:text-gray-100">
              {children}
            </h4>
          ),
          h5: ({ children }) => (
            <h5 className="mt-6 mb-2 text-base font-semibold leading-tight text-gray-900 dark:text-gray-100">
              {children}
            </h5>
          ),
          h6: ({ children }) => (
            <h6 className="mt-6 mb-2 text-base font-semibold leading-tight text-gray-900 dark:text-gray-100">
              {children}
            </h6>
          ),
          p: ({ children }) => (
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="mb-4 pl-8 md:pl-6 list-disc">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-4 pl-8 md:pl-6 list-decimal">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="mb-1 last:mb-0">
              {children}
            </li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-4 px-4 text-gray-600 dark:text-gray-400 border-l-4 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 rounded-r">
              {children}
            </blockquote>
          ),
          code: ({ children, className }) => {
            const isInline = !className;
            return isInline ? (
              <code className="px-1 py-0.5 mx-0 text-sm bg-gray-100 dark:bg-gray-800 rounded font-mono text-pink-600 dark:text-pink-400">
                {children}
              </code>
            ) : (
              <code className={className}>{children}</code>
            );
          },
          pre: ({ children }) => (
            <pre className="p-4 my-4 overflow-auto bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 text-sm md:text-xs md:p-3">
              {children}
            </pre>
          ),
          a: ({ children, href }) => (
            <a 
              href={href} 
              className="text-blue-600 dark:text-blue-400 hover:underline" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-gray-900 dark:text-gray-100">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic text-gray-600 dark:text-gray-400">
              {children}
            </em>
          ),
          hr: () => (
            <hr className="h-1 p-0 my-6 bg-gray-200 dark:bg-gray-700 border-0 rounded" />
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-4">
              <table className="w-full border-collapse my-4 block whitespace-nowrap md:table md:whitespace-normal">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-gray-50 dark:bg-gray-800">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody>
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className="even:bg-gray-50 dark:even:bg-gray-800/50">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="p-2 border border-gray-300 dark:border-gray-600 text-left font-semibold bg-gray-50 dark:bg-gray-800">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="p-2 border border-gray-300 dark:border-gray-600 text-left">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
