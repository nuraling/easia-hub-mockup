import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import StoryTooltip from '../StoryTooltip';

export default function Breadcrumbs({ items }) {
  return (
    <nav className="flex items-center gap-1.5 text-sm text-easia-gray-500 py-4">
      <Link to="/" className="hover:text-easia-burgundy transition">Home</Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <ChevronRight size={14} />
          {item.href ? (
            <Link to={item.href} className="hover:text-easia-burgundy transition">{item.label}</Link>
          ) : (
            <span className="text-easia-gray-900 font-medium">{item.label}</span>
          )}
        </span>
      ))}
      <StoryTooltip id="L1-009" className="ml-2" />
    </nav>
  );
}
