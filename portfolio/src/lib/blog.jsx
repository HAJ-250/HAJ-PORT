// Markdown renderer component. Data functions live in blog-data.js so that
// this file only exports a component (better React Fast Refresh behavior).
import ReactMarkdown from 'react-markdown';

export function Markdown({ source }) {
  return <ReactMarkdown>{source}</ReactMarkdown>;
}
