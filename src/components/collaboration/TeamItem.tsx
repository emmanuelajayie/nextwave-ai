import React from 'react';

interface TeamItemProps {
  name: string;
  description?: string;
}

const TeamItem: React.FC<TeamItemProps> = ({ name, description }) => {
  return (
    <div style={{
      border: '1px solid #ccc',
      padding: '1rem',
      marginBottom: '1rem',
      borderRadius: '8px'
    }}>
      <h4>{name}</h4>
      {description && <p>{description}</p>}
    </div>
  );
};

export default TeamItem;
