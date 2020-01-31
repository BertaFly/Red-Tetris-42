import * as React from 'react';

type Props = {
  onClose: () => void
  show: boolean
  children: React.ReactChild
  isWin: boolean
}

export const Modal: React.FC<Props> = ({ onClose, show, children, isWin }) => {
  const showHideClassName = show ? "modal display-block" : "modal display-none";

  return (
    <div className={showHideClassName}>
      <section className={`modal-main ${isWin ? 'win' : 'loose'}`}>
        {children}
        <button onClick={onClose}>close</button>
      </section>
    </div>
  );
};
