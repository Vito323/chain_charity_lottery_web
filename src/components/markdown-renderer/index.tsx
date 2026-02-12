import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';// 代码高亮样式
import rehypeSanitize from 'rehype-sanitize'; 

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className = ""
}) => {
  return (
    <div
      className={`
        text-[15px] md:text-base leading-7
        text-gray-900 dark:text-gray-100
        ${className}
      `}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize, rehypeHighlight]}
        components={{
          // 自定义组件渲染
          h1: ({ children }) => (
            <h1 className="mt-8 mb-4 first:mt-0 text-[26px] md:text-[28px] font-semibold leading-snug tracking-tight text-gray-900 dark:text-gray-100 border-b border-gray-200/60 dark:border-gray-700/70 pb-2">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="mt-6 mb-3 text-[20px] md:text-[22px] font-semibold leading-snug tracking-tight text-gray-900 dark:text-gray-100 border-b border-gray-200/50 dark:border-gray-700/70 pb-1.5">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mt-5 mb-2 text-[18px] md:text-[19px] font-semibold leading-snug text-gray-900 dark:text-gray-100">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="mt-4 mb-2 text-[16px] md:text-[17px] font-semibold leading-snug text-gray-900 dark:text-gray-100">
              {children}
            </h4>
          ),
          h5: ({ children }) => (
            <h5 className="mt-4 mb-2 text-[15px] font-semibold leading-snug text-gray-900 dark:text-gray-100">
              {children}
            </h5>
          ),
          h6: ({ children }) => (
            <h6 className="mt-4 mb-2 text-[14px] font-semibold leading-snug text-gray-900 dark:text-gray-100">
              {children}
            </h6>
          ),
          p: ({ children }) => (
            <p className="mb-3 last:mb-0 text-[15px] leading-7 text-gray-800 dark:text-gray-300">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="my-3 pl-6 md:pl-5 list-disc space-y-1 text-[15px] leading-7">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="my-3 pl-6 md:pl-5 list-decimal space-y-1 text-[15px] leading-7">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="ml-1">
              {children}
            </li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-4 px-4 py-2 text-[15px] leading-7 text-gray-700 dark:text-gray-300 border-l-4 border-gray-300 dark:border-gray-600 bg-gray-50/80 dark:bg-gray-800/80 rounded-r">
              {children}
            </blockquote>
          ),
          code: ({ children, className }) => {
            const isInline = !className;
            return isInline ? (
              <code className="px-1 py-0.5 mx-0 text-[13px] bg-gray-100 dark:bg-[#161b22] rounded font-mono text-pink-600 dark:text-pink-400">
                {children}
              </code>
            ) : (
              <code className={className}>{children}</code>
            );
          },
          pre: ({ children }) => (
            <pre className="p-4 my-4 overflow-auto bg-gray-50 dark:bg-[#0d1117] rounded-lg border border-gray-200 dark:border-gray-700 text-[13px] md:text-xs md:p-3 leading-6">
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
            <strong className="font-semibold text-gray-900 dark:text-gray-50">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic text-gray-600 dark:text-gray-300">
              {children}
            </em>
          ),
          hr: () => (
            <hr className="h-px p-0 my-6 bg-gray-200/80 dark:bg-gray-700/80 border-0 rounded" />
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-4">
              <table className="w-full border-collapse my-4 block whitespace-nowrap md:table md:whitespace-normal text-[14px]">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-gray-50 dark:bg-gray-800/80">
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
            <th className="px-3 py-2 border border-gray-300 dark:border-gray-700 text-left font-semibold bg-gray-50 dark:bg-gray-900">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-3 py-2 border border-gray-300 dark:border-gray-700 text-left align-top">
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
