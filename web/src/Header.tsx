import React from 'react';

interface HeaderProps {
          title: string,  //colocar ? para ser opcional
          teste: Number,
}

const Header: React.FC<HeaderProps> = (props) => {
          return (
                    <header>
                              <h1>{props.title}</h1>
                              <p>{props.teste}</p>
                    </header>
          );
};

export default Header;