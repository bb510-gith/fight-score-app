import React from 'react';

interface SimpleCounterProps {
  value: number;
  onChange: (newValue: number) => void;
}

const SimpleCounter: React.FC<SimpleCounterProps> = ({ value, onChange }) => {
  console.log(`SimpleCounter rendered with value: ${value}`);

  const handleIncrement = () => {
    onChange(value + 1);
  };

  const handleDecrement = () => {
    if (value > 0) {
      onChange(value - 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    if (!isNaN(newValue) && newValue >= 0) {
      onChange(newValue);
    } else if (e.target.value === '') {
      onChange(0);
    }
  };

  return (
    <div className="d-flex align-items-center" style={{ width: '120px' }}>
      <input type="text" className="form-control form-control-sm text-center" value={value} onChange={handleInputChange} />
      <div className="btn-group btn-group-sm ms-1" role="group">
        <button className="btn btn-outline-secondary" type="button" onClick={handleDecrement}>-</button>
        <button className="btn btn-outline-secondary" type="button" onClick={handleIncrement}>+</button>
      </div>
    </div>
  );
};

export default SimpleCounter;