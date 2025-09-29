
import './style.scss'


export interface ThumbTextProps {
  date?: string;
  month?: string;
  className?: string
}

const ThumbText = ({className = '', date, month}: ThumbTextProps) => {
  return (
    <div className={`thumb-text ${className}`}>
      <span>{date}</span>
      <span>{month}</span>
    </div>
  );
};

export default ThumbText;
